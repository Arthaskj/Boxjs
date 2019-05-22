Box.define('Box.dom.Element', function () {

    var doc = document,
        activeElement = null,
        isCSS1 = doc.compatMode == "CSS1Compat";

    if (!('activeElement' in doc) && doc.addEventListener) {
        doc.addEventListener('focus', function (ev) {
            if (ev && ev.target) {
                activeElement = (ev.target == doc) ? null : ev.target;
            }
        }, true);
    }

    function makeSelectionRestoreFn(activeEl, start, end) {
        return function () {
            activeEl.selectionStart = start;
            activeEl.selectionEnd = end;
        };
    }

    function isIE9m() {
        return Box.browser.is.IE6 || Box.browser.is.IE7 || Box.browser.is.IE8 || Box.browser.is.IE9
    }

    return {

        singleton: true,

        get: function (selector, content) {
            return Box.DOM_QUERY(selector, content);
        },

        getDom: function (el) {
            if (Box.isElement(el)) {
                return el;
            }
            if (Box.isString(el)) {
                return Box.DOM_QUERY(el)[0];
            }
            if (el.jquery) {
                return el[0];
            }
            return null;
        },

        defaultUnit: 'px',

        cssRe: /([a-z0-9\-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*)?;?/gi,

        unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,

        borders: {
            l: 'border-left-width',
            r: 'border-right-width',
            t: 'border-top-width',
            b: 'border-bottom-width'
        },

        paddings: {
            l: 'padding-left',
            r: 'padding-right',
            t: 'padding-top',
            b: 'padding-bottom'
        },

        margins: {
            l: 'margin-left',
            r: 'margin-right',
            t: 'margin-top',
            b: 'margin-bottom'
        },

        userAgent: navigator.userAgent.toLowerCase(),

        idSeed: 1000,

        windowId: 'box-window',

        documentId: 'box-document',

        id: function (el, prefix) {
            var sandboxPrefix = "";
            el = this.getDom(el);
            if (el === document) {
                el.id = this.documentId;
            } else if (el === window) {
                el.id = this.windowId;
            }
            el.id = el.id || (sandboxPrefix + (prefix || 'box-gen') + (++Box.idSeed));
            return el.id;
        },

        contains: function (parent, dom) {
            var ret = false;

            parent = this.getDom(parent);
            dom = this.getDom(dom);

            if (!Box.isElement(parent) || !Box.isElement(dom)) {
                return false;
            }

            if (parent === dom) {
                return true;
            }

            if (parent && dom) {
                if (parent.contains) {
                    return parent.contains(dom)
                } else if (parent.compareDocumentPosition) {
                    return !!(parent.compareDocumentPosition(dom) & 16);
                } else {
                    while ((dom = dom.parentNode)) {
                        ret = dom == parent || ret;
                    }
                }
            }
            return ret;
        },

        addUnits: function (size, units) {
            if (typeof size == 'number') {
                return size + (units || this.defaultUnit || 'px');
            }

            if (size === '' || size == 'auto' || size === undefined || size === null) {
                return size || '';
            }

            if (!this.unitRe.test(size)) {
                Box.log('warn', 'Warning, size detected as NaN on Element.addUnits.');
                return size || '';
            }
            return size;
        },

        parseBox: function (box) {
            box = box || 0;
            var type = typeof box,
                parts, len;

            if (type === 'number') {
                return {
                    top: box,
                    right: box,
                    bottom: box,
                    left: box
                }
            } else if (type !== 'string') {
                return box
            }

            parts = box.split(' ');
            len = parts.length;

            if (len == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            } else if (len == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            } else if (len == 3) {
                parts[3] = parts[1];
            }

            return {
                top: parseFloat(parts[0]) || 0,
                right: parseFloat(parts[1]) || 0,
                bottom: parseFloat(parts[2]) || 0,
                left: parseFloat(parts[3]) || 0
            }
        },

        unitizeBox: function (box, units) {
            var parse = this.parseBox(box);
            return this.addUnits(parse.top, units) + ' ' +
                this.addUnits(parse.right, units) + ' ' +
                this.addUnits(parse.bottom, units) + ' ' +
                this.addUnits(parse.left, units);
        },

        parseStyles: function (styles) {
            var out = {},
                cssRe = this.cssRe,
                matches;

            if (styles) {
                cssRe.lastIndex = 0;
                while ((matches = cssRe.exec(styles))) {
                    out[matches[1]] = matches[2] || '';
                }
            }
            return out;
        },

        getActiveElement: function () {
            var active;
            try {
                active = document.activeElement;
            } catch (e) {

            }
            active = active || activeElement;
            if (!active) {
                active = activeElement = document.body;
            }
            return active;
        },

        getViewWidth: function (full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },

        getViewHeight: function (full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },

        getDocumentHeight: function () {
            return Math.max(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },

        getDocumentWidth: function () {
            return Math.max(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },

        getViewportHeight: function () {
            return isIE9m() ?
                (Box.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
                window.innerHeight;
        },

        getViewportWidth: function () {
            return (!Box.isStrict && !Box.browser.is.Opera) ? doc.body.clientWidth :
                isIE9m() ? doc.documentElement.clientWidth : window.innerWidth;
        },

        getViewSize: function (full) {
            return {
                width: this.getViewWidth(full),
                height: this.getViewHeight(full)
            }
        },

        serializeForm: function (form) {
            var fElements = form.elements || (document.forms[form] || this.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                data = '',
                eLen = fElements.length,
                element, name, type, options, hasValue, e,
                o, oLen, opt;

            for (e = 0; e < eLen; e++) {
                element = fElements[e];
                name = element.name;
                type = element.type;
                options = element.options;

                if (!element.disabled && name) {
                    if (/select-(one|multiple)/i.test(type)) {
                        oLen = options.length;
                        for (o = 0; o < oLen; o++) {
                            opt = options[o];
                            if (opt.selected) {
                                hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                                data += Box.String.format("{0}={1}&", encoder(name), encoder(hasValue ? opt.value : opt.text));
                            }
                        }
                    } else if (!(/file|undefined|reset|button/i.test(type))) {
                        if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                            data += encoder(name) + '=' + encoder(element.value) + '&';
                            hasSubmit = /submit/i.test(type);
                        }
                    }
                }
            }
            return data.substr(0, data.length - 1);
        },

        getDoc: (function () {
            var doc;
            return function () {
                return doc || (doc = Box.dom.Element.get(document));
            }
        }()),

        getBody: (function () {
            var body;
            return function () {
                return body || (body = Box.dom.Element.get(document.body));
            }
        }()),

        getHead: (function () {
            var head;
            return function () {
                return head || (head = Box.dom.Element.get(document.getElementsByTagName("head")[0]));
            }
        }()),

        isScrollable: function (el) {
            var dom = Box.getDom(el);
            return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
        },

        getScroll: function (el) {
            var dom = Box.getDom(el),
                doc = document,
                body = doc.body,
                docElement = doc.documentElement,
                left, top;

            if (dom === doc || dom === body) {
                left = docElement.scrollLeft || (body ? body.scrollLeft : 0);
                top = docElement.scrollTop || (body ? body.scrollTop : 0);
            } else {
                left = dom.scrollLeft;
                top = dom.scrollTop;
            }
            return {
                left: left,
                top: top
            }
        },

        getScrollLeft: function (el) {
            var dom = Box.getDom(el), doc = document;
            if (dom === doc || dom === doc.body) {
                return this.getScroll().left;
            } else {
                return dom.scrollLeft;
            }
        },

        getScrollTop: function (el) {
            var dom = Box.getDom(el), doc = document;
            if (dom === doc || dom === doc.body) {
                return this.getScroll().top;
            } else {
                return dom.scrollTop;
            }
        },

        setScrollLeft: function (el, left) {
            var dom = Box.getDom(el);
            dom.scrollLeft = this.normalizeScrollLeft(left);
            return this;
        },

        setScrollTop: function (el, top) {
            var dom = Box.getDom(el);
            dom.scrollTop = top;
            return this;
        },

        normalizeScrollLeft: Box.identityFn

    }

}, function () {

    function apply(src, target, methods) {
        Box.Array.forEach(methods, function (name) {
            src[name] = Box.Function.bind(target[name], Box.Element);
        });
    }

    Box.Element = Box.dom.Element;

    apply(Box, Box.Element, ['id', 'get', 'getDom', 'getDoc', 'getBody', 'getHead']);

});
