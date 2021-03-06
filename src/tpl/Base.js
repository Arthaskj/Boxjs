Box.define('Box.tpl.Base', {

    requires: [
        Box.dom.Element,
        Box.util.Format
    ],

    mixins: {
        event: Box.util.Event
    },

    uses: ['Box.dom.Helper'],

    isTemplate: true,

    scope: null,

    compiled: false,

    disableFormats: false,

    html: Box.emptyString,

    re: /\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,

    constructor: function (config) {
        var args = arguments,
            length = args.length,
            buffer = [],
            i = 0,
            value;

        if (length > 1) {
            for (; i < length; i++) {
                value = args[i];
                if (typeof value == 'object') {
                    Box.apply(this, value);
                } else {
                    buffer.push(value);
                }
            }
            this.html = buffer.join('');
        } else {
            if (Box.isArray(config) || Box.isString(config)) {
                this.html = Box.Array.toArray(config).join('');
            } else {
                if (Box.isArray(config.html)) {
                    config.html = config.html.join('');
                }
                Box.apply(this, config);
            }
        }
        this.mixins.event.constructor.call(this, config);

        this.scope = this.scope || this;
        this.compiled && this.compile();
    },

    apply: function (values) {
        var me = this,
            useFormat = this.disableFormats !== true,
            compiled = this.compiled,
            fm = Box.util.Format,
            tpl = this.scope;

        if (compiled) {
            return compiled(values).join('');
        }

        function formatFn(m, name, format, args) {
            if (format && useFormat) {
                if (args) {
                    args = [values[name]].concat(Box.functionFactory('return [' + args + ']')());
                } else {
                    args = [values[name]];
                }
                if (format.substr(0, 5) == 'this.') {
                    return tpl[format.substr(5)].apply(tpl, args);
                } else {
                    return fm[format].apply(fm, args);
                }
            } else {
                return values[name] !== undefined ? values[name] : Box.emptyString;
            }
        }

        var ret = this.html.replace(this.re, formatFn);
        return ret
    },

    applyTemplate: function () {
        return this.apply.apply(this, arguments);
    },

    applyOther: function (values, other) {
        var compiled = this.compiled;
        if (compiled) {
            other.push.apply(other, compiled(values));
        } else {
            other.push(this.apply(values));
        }
        return other;
    },

    compileARe: /\\/g,

    compileBRe: /(\r\n|\n)/g,

    compileCRe: /'/g,

    compile: function () {
        var me = this,
            fm = Box.util.Format,
            useFormat = this.disableFormats !== true,
            tpl = this.scope,
            body, bodyReturn;

        function compileFn(m, name, format, args) {
            if (format && useFormat) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                } else {
                    format = 'tpl.' + format.substr(5) + '(';
                }
            } else {
                args = '';
                format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'," + format + "values['" + name + "']" + args + ") ,'";
        }

        this.html = bodyReturn = this.html.replace(this.compileARe, '\\\\').replace(this.compileBRe, '\\n').replace(this.compileCRe, '\\').replace(this.re, compileFn);
        eval("this.compiled = function (values) { return ['" + bodyReturn + "']; }");
        return this;
    },

    prepend: function (el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    before: function (el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    after: function (el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    append: function (el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert: function (where, el, values, returnElement) {
        var newNode = Box.dom.Helper.insertHtml(where, Box.getDom(el), this.apply(values));
        return returnElement ? Box.get(newNode) : newNode;
    },

    overwrite: function (el, values, returnElement) {
        var newNode = Box.dom.Helper.overwrite(Box.getDom(el), this.apply(values));
        return returnElement ? Box.get(newNode) : newNode;
    }

});