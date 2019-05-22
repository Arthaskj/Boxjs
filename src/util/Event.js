Box.define('Box.util.Event', {

    constructor: function (config) {
        Box.apply(this, config || {});
        this.__$listeners = {};
        this.__$eventsSuspended = 0;
        this.initListeners();
    },

    initListeners: function () {
        var listeners = this.listeners;
        this.hasListeners = {};
        Box.Object.each(listeners, function (name, fn) {
            this.hasListeners[name] = true;
            this.on(name, fn);
        }, this);
    },

    on: function (events, handler, scope) {
        var cache, event, list;
        if (!handler) {
            return this;
        }
        events = events.split(/\s+/);
        while (event = events.shift()) {
            list = this.__$listeners[event] || (this.__$listeners[event] = []);
            list.push(handler, scope);
        }
        return this
    },

    once: function (events, handler, scope) {
        var me = this;
        var callback = function () {
            me.off(events, callback);
            handler.apply(scope || me, arguments);
        };
        return this.on(events, callback, scope);
    },

    off: function (events, handler, scope) {
        var event, list, i;
        // 当没有任何参数的时候
        if (!(events || handler || scope)) {
            this.__$listeners = {};
            return this;
        }
        events = events ? events.split(/\s+/) : Box.Object.getKeys(this.__$listeners);
        while (event = events.shift()) {
            list = this.__$listeners[event];
            if (!list) {
                continue;
            }
            if (!(handler || scope)) {
                delete this.__$listeners[event];
                continue;
            }
            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(handler && list[i] !== handler || scope && list[i + 1] !== scope)) {
                    list.splice(i, 2);
                }
            }
        }
        return this;
    },

    trigger: function (events) {
        var event, all, list, i, len, rest = [],
            returned = true;

        events = events.split(/\s+/);

        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i];
        }

        while (event = events.shift()) {
            if (all = this.__$listeners.all) {
                all = all.slice();
            }
            if (list = this.__$listeners[event]) {
                list = list.slice();
            }
            if (event !== 'all') {
                returned = this.__$continueFireEvent(list, rest) && returned;
            }
            returned = this.__$continueFireEvent(all, [event].concat(rest)) && returned;
        }
        return returned;
    },

    suspendEvents: function () {
        this.__$eventsSuspended += 1;
        this.__$eventQueue = [];
    },

    resumeEvents: function () {
        var me = this,
            queued = me.__$eventQueue,
            qLen, q;

        if (me.__$eventsSuspended && ! --me.__$eventsSuspended) {
            delete me.__$eventQueue;

            if (queued) {
                qLen = queued.length;
                for (q = 0; q < qLen; q++) {
                    me.__$continueFireEvent.apply(me, queued[q]);
                }
            }
        }
    },

    __$continueFireEvent: function (list, args) {
        var pass = true;
        if (this.__$eventsSuspended) {
            if (this.__$eventQueue) {
                this.__$eventQueue.push([list, args]);
            }
            return pass;
        } else {
            if (Box.isEmpty(list)) {
                return pass;
            }
            var i = 0, l = list.length;
            for (; i < l; i += 2) {
                pass = list[i].apply(list[i + 1] || this, args) !== false && pass;
            }
        }
        return pass;
    }

});