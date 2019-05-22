Box.define('Box.tpl.Template', {

    extend: Box.tpl.Base,

    requires: [Box.tpl.TemplateCompiler],

    scope: null,

    compiled: false,

    disableFormats: false,

    definitions: false,

    html: Box.emptyString,

    emptyObj: {},

    apply: function (values, parent) {
        return this.applyOther(values, [], parent).join('')
    },

    applyOther: function (values, out, parent) {
        var compiler;

        if (!this.fn) {
            compiler = new Box.tpl.TemplateCompiler({
                useFormat: this.disableFormats !== true,
                definitions: this.definitions
            });
            this.fn = compiler.compile(this.html);
        }

        try {
            this.fn.call(this.scope, out, values, parent || this.emptyObj, 1, 1);
        } catch (e) {
            Box.Error({
                className: "Box.XTemplate",
                methodName: "applyOther",
                error: e.message
            })
        }

        return out;
    },

    compile: function () {
        return this
    }

});