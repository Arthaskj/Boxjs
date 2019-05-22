Box.Function = {

    clone: function(method) {
        return function() {
            return method.apply(this, arguments);
        };
    },

    //private
    //给function包装成setting方式
    //fn(obj) ---> fn(key, name) * n
    flexSetter: function (fun) {
        return function (key, value) {
            if (Box.isEmpty(key)) {
                return this;
            }

            var proto, me = this;

            if (typeof key !== 'string') {
                for (proto in key) {
                    if (key.hasOwnProperty(proto)) {
                        fun.call(this, proto, key[proto]);
                    }
                }

                if (Box.enumerables) {
                    Box.Array.forEach(Box.enumerables, function (name, i) {
                        if (key.hasOwnProperty(name)) {
                            fun.call(me, name, key[name])
                        }
                    })
                }
            } else {
                fun.call(this, key, value)
            }
            return this;
        }
    },

    //设置别名
    /**
     * var obj = {
     *     fun: function(){}
     * };
     * var fun2 = Box.Function.alias(obj, fun);
     */
    alias: function (object, name) {
        return function () {
            return object[name].apply(object, arguments);
        }
    }, 

    //给一个函数绑定this值和参数集合
    bind: function (fn, scope, args, appendArgs) {
        var method = fn,
            applyArgs,
            slice = Array.prototype.slice;

        return function () {
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            } else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0);
                Box.Array.insert(callArgs, appendArgs, args);
            }

            return method.apply(scope || window, callArgs);
        }
    },

    /**
     * 在原来的函数参数集合中合并新加参数
     * var testFn = function(a, b){
     *     Box.log(a + b);
     * };
     * var testFn2 = function(fn){
     *     fn();
     * };
     * testFn2(Box.Function.mergeArgs(testFn, [1, 2], this));
     */
    mergeArgs: function (fn, args, scope) {
        if (args) {
            args = Box.Array.toArray(args);
        }

        return function () {
            return fn.apply(scope, Box.Array.toArray(arguments).concat(args));
        };
    },

    changeArgs: function (fn, scope, args) {
        var method = fn,
            aargs = arguments,
            alen = aargs.length,
            slice = Array.prototype.slice;

        return function () {
            var callArgs = slice.call(arguments, 0),
                i = 2;

            for (; i < alen; i++) {
                callArgs[aargs[i][0]] = aargs[i][1];
            }

            return method.apply(scope || window, callArgs);
        }
    },

    //给一个函数绑定this值和参数集合， 并且可以设置delay(延迟执行)， 主要针对callback回调函数
    callback: function (callback, scope, args, delay) {
        if (Box.isFunction(callback)) {
            args = args || [];
            scope = scope || window;
            if (delay) {
                Box.delay(callback, delay, scope, args);
            } else {
                callback.apply(scope, args);
            }
        }
    },

    //给一个函数设置延迟执行， 并且执行它
    defer: function (fn, delay, scope, args, appendArgs) {
        fn = Box.Function.bind(fn, scope, args, appendArgs);
        if (delay > 0) {
            return setTimeout(fn, delay);
        }
        fn();
        return 0;

    },

    //给一个函数创建拦截器
    //当条件在拦截器中通过的话， 那么才可以执行原来的函数origFn， 否则返回一个默认自行设置的值
    createInterceptor: function (origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Box.isFunction(newFn)) {
            return origFn;
        } else {
            return function () {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ? origFn.apply(me || window, args) : returnValue || null;
            };
        }
    },

    createDelayed: function (fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Box.Function.bind(fn, scope, args, appendArgs);
        }

        return function () {
            var me = this;
            var args = Array.prototype.slice.call(arguments);

            setTimeout(function () {
                fn.apply(me, args);
            }, delay);
        };
    },

    //给一个函数创建缓冲器
    createBuffered: function (fn, buffer, scope, args) {
        return function () {
            var timerId;
            return function () {
                var me = this;
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }

                timerId = setTimeout(function () {
                    fn.apply(scope || me, args || arguments);
                }, buffer);
            };
        }();
    },

    //给一个函数创建序列化执行
    createSequence: function (origFn, newFn, scope) {
        if (!Box.isFunction(newFn)) {
            return origFn;
        } else {
            return function () {
                var retval = origFn.apply(this || window, arguments);
                newFn.apply(scope || this || window, arguments);
                return retval;
            };
        }
    },

    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    },
 
    factory: function () {
        var args = Array.prototype.slice.call(arguments);
        return Function.prototype.constructor.apply(Function.prototype, args);
    },

    pass: function(fn, args, scope) {
        if (args) {
            args = Box.Array.from(args);
        }

        return function() {
            return fn.apply(scope, args.concat(Box.Array.toArray(arguments)));
        };
    },

    before: function(object, methodName, fn, scope) {
        var method = object[methodName] || Box.emptyFn;

        return (object[methodName] = function() {
            var ret = fn.apply(scope || this, arguments);
            method.apply(this, arguments);

            return ret;
        });
    },

    after: function(object, methodName, fn, scope) {
        var method = object[methodName] || Box.emptyFn;

        return (object[methodName] = function() {
            method.apply(this, arguments);
            return fn.apply(scope || this, arguments);
        });
    },

    preFunction: function (fn, pre) {
        return function () {
            pre.apply(this, arguments);
            if (fn) {
                fn.apply(this, arguments);
            }
        };
    },

    postFunction: function (fn, post) {
        return function () {
            if (fn) {
                fn.apply(this, arguments);
            }
            post.apply(this, arguments);
        };
    }

};

Box.defer = Box.Function.alias(Box.Function, 'defer');

Box.pass = Box.Function.alias(Box.Function, 'pass');

Box.bind = Box.Function.alias(Box.Function, 'bind');

Box.callback = Box.Function.alias(Box.Function, 'callback');

Box.functionFactory = Box.Function.alias(Box.Function, 'factory');