Box.define('Box.app.Application', {

    singleton: true,

    name: 'Box',

    baseFolder: 'app',

    paths: {},

    resources: [],

    templateType: 'tpl',

    templateServerUrl: false,

    templateServerMethod: 'POST',

    launch: null,

    launchProperties: {},

    create: function (config) {
        var me = this;
        if (this.created) {
            Box.Error('Box.app.Application is already created.');
        }
        Box.apply(this, config);
        this.setTemplateConfig();
        this.proxy = new Box.util.ListenerProxy();
        Box.getDoc().ready(function () {
            me.importResources();
            me.proxy.after('imports', me.resources.length, function () {
                me.afterImportResources();
                me.paths[me.name] = me.baseFolder;
                me.setPaths(me.paths);
                me.__$domReady = true;
                me.launch && me.doLaunch();
            });
        });
        this.created = true;

        this.timer = this.timer || setInterval(Box.bind(function () {
            this._autoLogin();
        }, this), 1000 * 60 * 5);
    },

    _autoLogin: function () {
        if (this.Context && this.Context.UserName) {
            Box.HY.Auth.autologin();
        }
    },
    setTemplateConfig: function () {
        if (this.templateType) {
            Box.TEMPLATE_TYPE = this.templateType;
        }
        if (this.templateServerUrl) {
            Box.TEMPLATE_SERVER_URL = this.templateServerUrl;
        }
        if (this.templateServerMethod) {
            Box.TEMPLATE_SERVER_METHOD = this.templateServerMethod;
        }
    },

    setPaths: function (name, path) {
        var paths = {};
        if (Box.isString(name)) {
            paths[name] = path;
        } else {
            paths = name;
        }
        Box.Loader.setPath(paths);
    },

    domain: function (options) {
        this.launch = options;
        this.__$domReady && this.doLaunch();
    },

    doLaunch: function () {
        var launch = this.launch, viewport;
        if (Box.isFunction(launch)) {
            viewport = launch.call(this);
        } else if (Box.isObject(launch)) {
            viewport = Box.create('Box.app.Viewport', launch);
        } else if (Box.isString(launch)) {
            viewport = Box.create(launch, this.launchProperties);
        }
        Box.app.Application.viewport = viewport;
    },

    importResources: function () {
        var me = this;
        this.beforeImportResources(this.resources);
        Box.Array.forEach(this.resources, function (url) {
            Box.Loader.loadScriptFile(url, function () {
                me.proxy.emit('imports');
            }, function () {
                me.proxy.emit('imports');
            });
        }, this);
    },

    beforeImportResources: Box.emptyFn,

    afterImportResources: Box.emptyFn

});

Box.AppVersion = {
    Version: function () {
        if (typeof HY === 'undefined')
            return "1.0.0.0";
        return HY.Context && HY.Context.Version && HY.Context.Version.version || "1.0.0.0";
    }
};


Box.queue = (function () {

    return {
        when: function (args, success) {
            var items = [];

            for (var i = 0; i < args.length; i++) {
                items.push($.ajax(args[i]));
            }

            $.when.apply($, items).always(success);
        },

        request: function (args, success) {
            var der = $.Deferred();

            for (var i = 0; i < args.length; i++) {
                der = der.then($.ajax(args[i]).always(success));
            }

            return der;
        }
    };
})();