window.undefined = window.undefined;

Box.globalEval = Box.global.execScript ? function (code) {
    //return execScript(code);
    return (function () {
        var Box = this.Box;
        return eval(code);
    }());
} : function ($$code) {
    return (function () {
        var Box = this.Box;
        return eval($$code);
    }());
};

if (Box.isEmpty(Box.DOM_QUERY = window.jQuery || window.$)) {
    Box.Error('you must load jquery lib');
}

Box.apply(Box, {

    USE_NATIVE_JSON: false,

    TEMPLATE_TYPE: "tpl",

    TEMPLATE_SERVER_URL: null,

    TEMPLATE_SERVER_METHOD: 'GET'

});

Box.apply(Box.Namespace = {}, {

    classes: {},

    toName: function (url) {
        return url.replace(/\//g, '.');
    },

    toUrl: function (namespace) {
        return namespace.replace(/\./g, '/');
    },

    set: function (namespace, cls) {
        this.classes[namespace] = this.assign(namespace, cls);
    },

    get: function (namespace) {
        if (Box.isEmpty(namespace)) {
            return null;
        }
        if (!Box.isString(namespace)) {
            return namespace;
        }
        if (this.classes.hasOwnProperty(namespace)) {
            return this.classes[namespace];
        }
        var root = Box.global,
            parts = this.parse(namespace),
            part;

        for (var i = 0, len = parts.length; i < len; i++) {
            part = parts[i];
            if (!Box.isString(part)) {
                root = part;
            } else {
                if (!root || !root[part]) {
                    return null;
                }
                root = root[part];
            }
        }
        return root;
    },

    //解析命名空间
    parse: function (namespace) {
        if (!Box.isString(namespace)) {
            throw new Error("[Box.ClassManager] Invalid namespace, must be a string");
        }
        var parts = [],
            root = Box.global;
        parts.push(root);
        parts = parts.concat(namespace.split(/\/|\./g));
        return parts;
    },

    //分配命名空间
    assign: function (name, value) {
        var root = Box.global,
            list = this.parse(name),
            leaf = list.pop();

        Box.Array.forEach(list, function (item, i) {
            if (!Box.isString(item)) {
                root = item;
            } else {
                if (!root[item]) {
                    root[item] = {};
                }
                root = root[item];
            }
        });
        root[leaf] = value;

        return root[leaf];
    },

    //创建命名空间
    create: function () {
        var root = Box.global,
            namespace = Box.Array.toArray(arguments);

        Box.Array.forEach(namespace, function (item, i) {
            Box.Array.forEach(Box.Namespace.parse(item), function (name, j) {
                if (!Box.isString(name)) {
                    root = name;
                } else {
                    if (!root[name]) {
                        root[name] = {};
                    }
                    root = root[name];
                }
            })
        }, this);

        return root;
    }
});

Box.ns = Box.namespace = Box.Namespace.create;

