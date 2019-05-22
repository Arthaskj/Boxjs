Box.define('Box.ComponentTplCompile', {

    requires: [
        Box.tpl.Template
    ],

    singleton: true,

    tpl: function (content, scope) {
        return new Box.tpl.Template({
            html: content,
            compile: true,
            disableFormats: false,
            scope: scope
        })
    },

    ejs: function (content, scope) {
        if (!Box.isDefined(ejs)) {
            Box.Error({
                className: "Box.ComponentTplCompile",
                methodName: "ejs",
                error: 'you must load ejs lib'
            });
        }
        return function (data) {
            return ejs.render(content, data);
        }
    },

    handlebars: function (content, scope) {
        if (!Box.isDefined(Handlebars)) {
            Box.Error({
                className: "Box.ComponentTplCompile",
                methodName: "handlebars",
                error: 'you must load handlebarsjs lib'
            });
        }
        return function (data) {
            var helpers = {};
            for (var key in Handlebars.helpers) {
                helpers[key] = Handlebars.helpers[key];
            }
            for (var key in scope) {
                helpers[key] = scope[key];
            }
            return Handlebars.compile(content)(data, {
                helpers: helpers
            });
        }
    }

});