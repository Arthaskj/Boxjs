Box.define('Box.dom.Helper', function () {

    var afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        bbValues = ['BeforeBegin', 'previousSibling'],
        aeValues = ['AfterEnd', 'nextSibling'],
        bb_ae_PositionHash = {
            beforebegin: bbValues,
            afterend: aeValues
        },
        fullPositionHash = {
            beforebegin: bbValues,
            afterend: aeValues,
            afterbegin: ['AfterBegin', 'firstChild'],
            beforeend: ['BeforeEnd', 'lastChild']
        };

    function range() {
        return !!document.createRange;
    }

    function CreateContextualFragment() {
        var range = range() ? document.createRange() : false;
        return range && !!range.createContextualFragment;
    }

    return {

        singleton: true,

        alternateClassName: ['Box.DomHelper', 'Box.dom.DomHelper'],

        emptyTags: /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,

        confRe: /^(?:tag|children|cn|html|tpl|tplData)$/i,

        endRe: /end/i,

        attributeTransform: {cls: 'class', htmlFor: 'for'},

        closeTags: {},

        detachedDiv: document.createElement('div'),

        decamelizeName: function () {
            var camelCaseRe = /([a-z])([A-Z])/g,
                cache = {};

            function decamel(match, p1, p2) {
                return p1 + '-' + p2.toLowerCase();
            }

            return function (s) {
                return cache[s] || (cache[s] = s.replace(camelCaseRe, decamel));
            };
        }(),

        generateMarkup: function (spec, buffer) {
            var me = this,
                specType = typeof spec,
                attr, val, tag, i, closeTags;

            if (specType === "string" || specType === "number") {
                buffer.push(spec);
            } else if (Box.isArray(spec)) {
                for (i = 0; i < spec.length; i++) {
                    if (spec[i]) {
                        me.generateMarkup(spec[i], buffer);
                    }
                }
            } else {
                tag = spec.tag || 'div';
                buffer.push('<', tag);

                for (attr in spec) {
                    if (spec.hasOwnProperty(attr)) {
                        val = spec[attr];
                        if (val !== undefined && !me.confRe.test(attr)) {
                            if (typeof val === "object") {
                                buffer.push(' ', attr, '="');
                                me.generateStyles(val, buffer, true).push('"');
                            } else {
                                buffer.push(' ', me.attributeTransform[attr] || attr, '="', val, '"');
                            }
                        }
                    }
                }

                if (me.emptyTags.test(tag)) {
                    buffer.push('/>');
                } else {
                    buffer.push('>');

                    if ((val = spec.tpl)) {
                        val.applyOut(spec.tplData, buffer);
                    }
                    if ((val = spec.html)) {
                        buffer.push(val);
                    }
                    if ((val = spec.cn || spec.children)) {
                        me.generateMarkup(val, buffer);
                    }

                    closeTags = me.closeTags;
                    buffer.push(closeTags[tag] || (closeTags[tag] = '</' + tag + '>'));
                }
            }

            return buffer;
        },

        generateStyles: function (styles, buffer, encode) {
            var a = buffer || [],
                name, val;

            for (name in styles) {
                if (styles.hasOwnProperty(name)) {
                    val = styles[name];
                    name = this.decamelizeName(name);
                    if (encode && Box.String.hasHtmlCharacters(val)) {
                        val = Box.String.htmlEncode(val);
                    }
                    a.push(name, ':', val, ';');
                }
            }

            return buffer || a.join('');
        },

        markup: function (spec) {
            if (typeof spec === "string") {
                return spec;
            }

            var buf = this.generateMarkup(spec, []);
            return buf.join('');
        },

        createContextualFragment: function (html) {
            var div = this.detachedDiv,
                fragment = document.createDocumentFragment(),
                length, childNodes;

            div.innerHTML = html;
            childNodes = div.childNodes;
            length = childNodes.length;

            while (length--) {
                fragment.appendChild(childNodes[0]);
            }
            return fragment;
        },

        createDom: function (o, parentNode) {
            var me = this,
                markup = me.markup(o),
                div = me.detachedDiv;

            div.innerHTML = markup;

            return div.firstChild;
        },


        insertHtml: function (where, el, html) {
            var me = this,
                hashVal,
                range,
                rangeEl,
                setStart,
                frag;

            where = where.toLowerCase();

            if (el.insertAdjacentHTML) {

                if (me.ieInsertHtml) {
                    frag = me.ieInsertHtml(where, el, html);
                    if (frag) {
                        return frag;
                    }
                }

                hashVal = fullPositionHash[where];
                if (hashVal) {
                    el.insertAdjacentHTML(hashVal[0], html);
                    return el[hashVal[1]];
                }
            } else {
                if (el.nodeType === 3) {
                    where = where === afterbegin ? beforebegin : where;
                    where = where === beforeend ? afterend : where;
                }
                range = CreateContextualFragment() ? el.ownerDocument.createRange() : undefined;
                setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');
                if (bb_ae_PositionHash[where]) {
                    if (range) {
                        range[setStart](el);
                        frag = range.createContextualFragment(html);
                    } else {
                        frag = this.createContextualFragment(html);
                    }
                    el.parentNode.insertBefore(frag, where === beforebegin ? el : el.nextSibling);
                    return el[(where === beforebegin ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (where === afterbegin ? 'first' : 'last') + 'Child';
                    if (el.firstChild) {
                        if (range) {
                            try {
                                range[setStart](el[rangeEl]);
                                frag = range.createContextualFragment(html);
                            } catch (e) {
                                frag = this.createContextualFragment(html);
                            }
                        } else {
                            frag = this.createContextualFragment(html);
                        }

                        if (where === afterbegin) {
                            el.insertBefore(frag, el.firstChild);
                        } else {
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }
            }
            Box.Error({
                className: "Box.dom.Helper",
                methodName: "insertHtml",
                error: 'Illegal insertion point reached: "' + where + '"'
            });
        },

        before: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, beforebegin);
        },

        after: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, afterend);
        },

        append: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, beforeend);
        },

        prepend: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, afterbegin);
        },

        overwrite: function (el, html, returnElement) {
            var me = this,
                newNode;

            el = Box.get(el)[0];
            html = me.markup(html);

            if (me.ieOverwrite) {
                // hook for IE table hack - impl in ext package override
                newNode = me.ieOverwrite(el, html);
            }
            if (!newNode) {
                el.innerHTML = html;
                newNode = el.firstChild;
            }
            return returnElement ? Box.get(newNode) : newNode;
        },

        doInsert: function (el, o, returnElement, where) {
            var me = this,
                newNode;

            el = Box.get(el)[0];

            if ('innerHTML' in el) {
                newNode = me.insertHtml(where, el, me.markup(o));
            } else {
                newNode = me.createDom(o, null);

                if (el.nodeType === 3) {
                    where = where === afterbegin ? beforebegin : where;
                    where = where === beforeend ? afterend : where;
                }
                if (bb_ae_PositionHash[where]) {
                    el.parentNode.insertBefore(newNode, where === beforebegin ? el : el.nextSibling);
                } else if (el.firstChild && where === afterbegin) {
                    el.insertBefore(newNode, el.firstChild);
                } else {
                    el.appendChild(newNode);
                }
            }

            return returnElement ? Box.get(newNode) : newNode;
        },

        createTemplate: function (o) {
            return new Box.tpl.Base(this.markup(o));
        },

        createHtml: function (spec) {
            return this.markup(spec);
        },

        parse: function (spec) {
            return this.createHtml(spec)
        }
    };

});