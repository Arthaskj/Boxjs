// 接口类
Box.define('Box.app.Interface', {

    requires: [],

    constructor: function () {
        for (var name in this.interfaces) {
            var option = this.interfaces[name];
            option.name = name;
            this.registerInterface(option);
        }
    },

    interfaces: {},

    send: function (url, params, callback, headers, type) {
        var options = {}, sendAjax, header;
        options.headers = {};
        headers = headers || [];
        for (var i = 0; i < headers.length; i++) {
            header = headers[i];
            options.headers[header] = this.parseHeaders[header]();
        }
        options.url = url;
        options.type = type || 'POST';
        options.data = (Box.isFunction(params) ? params() : params) || {};
        sendAjax = $.ajax(options);
        return sendAjax.done(callback || Box.emptyFn);
    },

    registerInterface: function (config) {
        var me = this;
        this[config.name] = function (params, callback) {
            if (arguments.length == 1 && Box.isFunction(params)) {
                callback = params;
                params = null;
            }
            if (Box.isFunction(config.url)) {
                config.url = config.url(params);
            }
            return me.send(config.url, params, (config.callback ? function (data) {
                config.callback(data);
                callback(data);
            } : callback), config.headers, config.type);
        }
    },

    init: function () {

    }


});