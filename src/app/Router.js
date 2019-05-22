Box.define('Box.app.Router', {

    mixins: {
        event: Box.util.Event
    },

    requires: [Box.app.History],

    scope: null,

    routes: {},

    optionalParam: /\((.*?)\)/g,

    namedParam: /(\(\?)?:\w+/g,

    splatParam: /\*\w+/g,

    escapeRegExp: /[\-{}\[\]+?.,\\\^$|#\s]/g,

    constructor: function (config) {
        Box.apply(this, config);
        this.scope = this.scope || this;
        this.mixins.event.constructor.call(this);
        this.set(this.routes);
        if (!Box.app.History.started) {
            Box.app.History.start();
        }
    },

    set: function (route, action) {
        if (Box.isObject(route)) {
            Box.Object.each(route, function (name, fn) {
                this.set(name, fn);
            }, this);
            return this;
        }
        if (!Box.isRegExp(route)) {
            route = this._routeToRegExp(route);
        }

        if (!Box.isFunction(action)) {
            action = this.scope[action];
        }
        var router = this;
        Box.app.History.route(route, function (fragment) {
            var args = router._extractParameters(route, fragment);
            if (router.execute(action, args) !== false) {
                router.trigger('route', args);
            }
        });
        return this;
    },

    navigate: function (fragment, options) {
        Box.app.History.navigate(fragment, options);
        return this;
    },

    execute: function (action, args) {
        action && action.apply(this.scope, args);
    },

    _routeToRegExp: function (route) {
        route = route.replace(this.escapeRegExp, '\\$&')
            .replace(this.optionalParam, '(?:$1)?')
            .replace(this.namedParam, function (match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(this.splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    _extractParameters: function (route, fragment) {
        var params = route.exec(fragment).slice(1);
        return Box.Array.map(params, function (param, i) {
            if (i === params.length - 1) {
                return param || null;
            }
            return param ? decodeURIComponent(param) : null;
        });
    }

});