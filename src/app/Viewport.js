Box.define('Box.app.Viewport', {

    requires: [
        Box.app.History,
        Box.app.Router
    ],

    extend: Box.Component,

    target: document.body,

    routes: {},

    setRoute: function (route, callback) {
        this.router.set(route, callback);
    },

    navigate: function (fragment, options) {
        Box.app.History.navigate(fragment, options);
        return this;
    },

    afterRender: function () {
        this.callParent(arguments);
        this.router = Box.create('Box.app.Router', {
            scope: this,
            routes: this.routes
        });
    }

});
