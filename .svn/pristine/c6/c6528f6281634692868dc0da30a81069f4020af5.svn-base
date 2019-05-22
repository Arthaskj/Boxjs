Box.define('Box.util.ListenerProxy', {

    statics: {

        create: function () {
            var proxy = new Box.util.ListenerProxy();
            var args = Array.prototype.concat.apply([], arguments);
            if (args.length > 0) {
                var errorHandler = args[args.length - 1];
                var callback = args[args.length - 2];
                if (typeof errorHandler === 'function' && typeof callback === 'function') {
                    args.pop();
                    proxy.fail(errorHandler);
                }
                proxy.all.apply(proxy, args);
            }
            return proxy;
        }

    },

    firedCaches: {},

    callbackCaches: {},

    afterCaches: {},

    all_event_name: '__all__',

    on: function (event, callback) {
        this.callbackCaches[event] = this.callbackCaches[event] || [];
        this.callbackCaches[event].push(callback);
        return this;
    },

    //绑定事件， 但是把事件绑定到第一个
    headOn: function (event, callback) {
        this.callbackCaches[event] = this.callbackCaches[event] || [];
        this.callbackCaches[event].unshift(callback);
        return this;
    },

    _on_all: function (callback) {
        this.on(this.all_event_name, callback)
    },

    off: function (name, callback) {
        var calls = this.callbackCaches;
        if (!Box.isEmpty(name)) {
            if (Box.isEmpty(callback)) {
                calls[name] = [];
            } else {
                var list = calls[name];
                if (list) {
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        list[i] = null
                    }
                }
            }
        } else {
            this.callbackCaches = {}
        }
    },

    _off_all: function (callback) {
        this.off(this.all_event_name, callback)
    },

    emit: function (event, data) {
        var both = 2, list, ev, callback, args, i, l;
        while (both--) {
            ev = both ? event : this.all_event_name;
            list = this.callbackCaches[ev];
            if (Box.isEmpty(list)) {
                continue;
            }
            for (i = 0, l = list.length; i < l; i++) {
                if (!(callback = list[i])) {
                    list.splice(i, 1);
                    i--;
                    l--;
                } else {
                    args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
                    callback.apply(this, args);
                }
            }
        }
        return this;
    },

    once: function (event, callback) {
        var self = this;
        var wrapper = function () {
            callback.apply(self, arguments);
            self.off(event, wrapper);
        };
        this.on(event, wrapper);
        return this;
    },

    //立即执行
    immediate: function (event, callback, data) {
        this.on(event, callback);
        this.emit(event, data);
        return this
    },

    _assign: function (event1, event2, cb, once) {
        var self = this;
        var argsLength = arguments.length;
        var times = 0, flag = {};

        if (argsLength < 3) {
            return this
        }

        var events = Array.prototype.slice.call(arguments, 0, -2);
        var callback = arguments[argsLength - 2];
        var isOnce = arguments[argsLength - 1];

        if (typeof callback !== 'function') {
            return this;
        }

        Box.Array.forEach(events, function (event, i) {
            var method = isOnce ? 'once' : 'on';
            this[method](event, function (data) {
                this.firedCaches[event] = this.firedCaches[event] || {};
                this.firedCaches[event].data = data;
                if (!flag[event]) {
                    flag[event] = true;
                    times++;
                }
            })
        }, this);

        var all_fn = function (event) {
            if (times < events.length) {
                return;
            }
            if (!flag[event]) {
                return;
            }
            var data = Box.Array.map(events, function (event) {
                return this.firedCaches[event].data
            }, self);
            if (isOnce) {
                self._off_all(all_fn)
            }
            callback.apply(null, data)
        };

        this._on_all(all_fn)

    },

    all: function (event1, event2, callback) {
        var args = Array.prototype.concat.apply([], arguments);
        args.push(true);
        this._assign.apply(this, args);
        return this;
    },

    fail: function (callback) {
        var self = this;
        this.once('error', function (err) {
            self.off();
            callback.apply(null, arguments)
        });
        return this;
    },

    tail: function () {
        var args = Array.prototype.concat.apply([], arguments);
        args.push(false);
        this._assign.apply(this, args);
        return this;
    },

    after: function (event, times, callback) {
        if (times === 0) {
            callback.call(null, []);
            return this;
        }

        var self = this, firedData = [];
        var group = event + '_group';

        this.afterCaches = this.afterCaches || {};
        this.afterCaches[group] = {
            index: 0,
            results: []
        };

        var all_fn = function (name, data) {
            if (name === event) {
                times--;
                firedData.push(data);
                if (times < 1) {
                    self._off_all(all_fn);
                    callback.apply(null, [firedData]);
                }
            }
            if (name === group) {
                times--;
                self.afterCaches[group].results[data.index] = data.result;
                if (times < 1) {
                    self._off_all(all_fn);
                    callback.call(null, self.afterCaches[group].results);
                }
            }
        };
        this._on_all(all_fn);

    },

    group: function (event, callback) {
        var self = this,
            group = event + '_group',
            index = this.afterCaches[group].index,
            slice = Array.property.slice;

        this.afterCaches[group].index++;
        return function (err, data) {
            if (err) {
                return self.emit.apply(self, ['error'].concat(slice.call(arguments)));
            }
            self.emit(group, {
                index: index,
                result: callback ? callback.apply(null, slice.call(arguments, 1)) : data
            });
        };
    },

    any: function () {
        var slice = Array.property.slice,
            callback = arguments[arguments.length - 1],
            events = slice.call(arguments, 0, -1),
            event = events.join("_"),
            self = this;

        this.once(event, callback);

        var bind_fn = function (key) {
            self.on(key, function (data) {
                self.emit(event, {"data": data, eventName: key});
            });
        };

        Box.Array.forEach(events, function (key) {
            this.on(key, function (data) {
                self.emit(event, {"data": data, eventName: key});
            })
        }, this);
    },

    not: function (event, callback) {
        this._on_all(function (name, data) {
            if (name !== event) {
                callback(data);
            }
        })
    },

    done: function (handler, callback) {
        var self = this;
        var slice = Array.prototype.slice;
        return function (err, data) {
            if (err) {
                return self.emit.apply(self, ['error'].concat(slice.call(arguments)));
            }
            var args = slice.call(arguments, 1);

            if (typeof handler === 'string') {
                if (callback) {
                    return self.emit(handler, callback.apply(null, args));
                } else {
                    return self.emit.apply(self, [handler].concat(args));
                }
            }
            if (arguments.length <= 2) {
                return handler(data);
            }
            handler.apply(null, args);
        };
    }

}, function () {

    Box.Array.forEach([
        {
            name: 'all',
            alias: ['assign']
        },
        {
            name: 'on',
            alias: ['bind', 'addListener']
        },
        {
            name: 'off',
            alias: ['unbind', 'removeListener']
        },
        {
            name: 'emit',
            alias: ['trigger', 'fire']
        }
    ], function (item) {
        item.alias = Box.Array.toArray(item.alias);
        Box.Array.forEach(item.alias, function (_name) {
            this.prototype[_name] = Box.Function.alias(this.prototype, item.name);
        }, this)
    }, this)

});