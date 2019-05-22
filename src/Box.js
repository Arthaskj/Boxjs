(function () {

    var global = window,
        enumerables = true,
        enumerablesTestObj = {
            toString: 1
        },
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        nonWhitespaceRe = /\S/,
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller;
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        name;

    //初始化HY对象，赋值为一个空对象
    var Box = global.Box = {};
    //让HY对象的global指向全局window/this
    Box.global = global;

    //标准浏览器对于for(var i in enumerablesTest){console.log(i)};
    //会输出"toString", 因为toString已经为自定义成员了。所以会遍历这个成员，
    //而IE6却只认名字不认人。它不会输出自定义的toString成员，
    //包括其它系统的成员也不会。因此，在IE6需要主动判断是否定义了toString。
    for (name in enumerablesTestObj) {
        enumerables = !enumerables;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
            'toLocaleString', 'toString', 'constructor'
        ];
    }

    Box.enumerables = enumerables;

    /**
     * 单纯的对象继承覆盖功能
     * @function
     * @param {object} object 待继承对象
     * @param {object} config
     * @param {object} defaults 可选
     * @returns {object} 返回经过覆盖属性/方法后的新object对象
     * */
    Box.apply = function (object, config, defaults) {
        if (defaults) {
            Box.apply(object, defaults || {});
        }
        if (object && config && typeof config == 'object') {
            var i, j, k;
            for (i in config) {
                object[i] = config[i];
            }
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
        return object;
    };

    Box.apply(Box, {

        name: 'Box',

        emptyString: "",

        emptyFn: function () {
        },

        EMPTY_STRING: "",

        EMPTY_FUNCTION: function () {
        },

        identityFn: function (o) {
            return o;
        },

        /**
         * 单纯的对象继承覆盖功能，但是和apply有一定的区别，只是拷贝config中在object中没有的成员
         * @function
         * @param {object} object
         * @param {object} config
         * @returns {object}  返回经过覆盖属性/方法后的新object对象
         * */
        applyIf: function (object, config) {
            var property;
            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }
            return object;
        },

        each: function (object, fn, scope) {
            if (Box.isEmpty(object)) {
                return;
            }
            Box[Box.isIterable(object) ? 'Array' : 'Object'].each.apply(this, arguments);
        },

        //level: "error", "warn", "info" or "log" (the default is "log")
        log: function (level, msg) {
            var console = Box.global.console;
            if (console) {
                if (arguments.length == 1) {
                    msg = level;
                    level = 'log';
                }
                console[level](msg);
            }
        },

        Error: function (error) {
            var method, msg, owner;
            error = error || {};
            if (Box.isString(error)) {
                if ((method = this.Error.caller) && (owner = method.__$owner)) {
                    var name = method.__$name;
                    var className = owner.__$namespace;
                    if (name && className) {
                        return Box.Error({
                            className: className,
                            methodName: name,
                            error: error
                        });
                    }
                } else {
                    error = {
                        error: error
                    }
                }
            }
            if (!error.className || !error.methodName) {
                msg = error.error;
            } else {
                msg = '[' + error.className + '.' + error.methodName + ']: ' + error.error;
            }

            throw new Error(msg);
        }

    });

    Box.apply(Box, {

        extend: (function () {
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function (o) {
                    for (var m in o) {
                        if (!o.hasOwnProperty(m)) {
                            continue;
                        }
                        this[m] = o[m];
                    }
                };

            return function (subclass, superclass, overrides) {
                if (Box.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function () {
                        superclass.apply(this, arguments);
                    };
                }

                if (!superclass) {
                    Box.Error({
                        className: 'Box',
                        methodName: 'extend',
                        msg: 'Attempting to extend from a class which has not been loaded on the page.'
                    });
                }

                var F = function () {
                    },
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function (overrides) {
                    Box.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function (o) {
                    return Box.extend(subclass, o);
                };

                return subclass;
            };
        }()),

        override: function (target, overrides) {
            if (target.$isClass) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Box.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) {
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value == 'function') {
                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name]
                                    : callOverrideParent;
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Box.apply(target, overrides);
                }
            }
            return target;
        }
    });

    Box.apply(Box, {

        objectPrototype: Object.prototype,

        isEmptyObject: function (object) {
            if (!object || !Box.isObject(object)) {
                return false;
            }

            for (var p in object) {
                if (object.hasOwnProperty(p)) {
                    return false;
                }
            }
            return true;
        },

        ifNull: function (value, defaultValue) {
            if ((value === null) || (value === undefined))
                return defaultValue;
            return value;
        },

        isNullOrUndefined: function (value) {
            return (value === null) || (value === undefined);
        },

        isEmpty: function (value, allowBlank) {
            return (value === null) ||
                (value === undefined) ||
                (Box.isArray(value) && !value.length) ||
                (value.jquery && !value.length) ||
                (!allowBlank ? value === '' : false);
        },

        isArray: function (array) {
            return Box.objectPrototype.toString.apply(array) === '[object Array]';
        },

        isObject: function (object) {
            return !!object && !object.tagName && Box.objectPrototype.toString.apply(object) === '[object Object]';
        },

        isFunction: function (fun) {
            return Box.objectPrototype.toString.apply(fun) === '[object Function]';
        },

        isString: function (str) {
            return typeof str === 'string';
        },

        isNumber: function (number) {
            return Box.objectPrototype.toString.apply(number) === '[object Number]';
        },

        isNumeric: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        isInteger: function (number) {
            return Box.isNumeric(number) && (new RegExp(/^-?\d+$/).test(number));
        },

        isDate: function (date) {
            return Box.objectPrototype.toString.apply(date) === '[object Date]';
        },

        isDateString: function (date) {
            return Box.RegExp.date.test(date);
        },

        isBoolean: function (boo) {
            return Box.objectPrototype.toString.apply(boo) === '[object Boolean]';
        },

        //判断对象是否为基本数据（字符串， 数字， 布尔值）类型
        isPrimitive: function (value) {
            return Box.isString(value) || Box.isNumber(value) || Box.isBoolean(value);
        },

        isElement: function (element) {
            if (typeof HTMLElement === 'object') {
                return element instanceof HTMLElement;
            } else {
                return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === "string";
            }
        },

        isDefined: function (defin) {
            return typeof defin !== 'undefined';
        },

        //判断对象是否为可迭代对象，包括array，节点数组
        isIterable: function (iter) {
            if (!iter) {
                return false;
            }
            //iter.callee成立的话， 说明iter是Function的arguments数组
            //iter.find && iter.filter说明是jQuery对象
            if (Box.isArray(iter) || iter.callee || (iter.find && iter.filter)) {
                return true;
            }
            //判断是否为节点数组
            if (/NodeList|HTMLCollection/.test(Box.objectPrototype.toString.apply(iter))) {
                return true;
            }

            return ((typeof iter.nextNode !== 'undefined' || iter.item) && Box.isNumber(iter.length)) || false;
        },

        isEmail: function (email) {
            return email && email.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) != null
        },

        isRegExp: function (regexp) {
            return regexp && Box.objectPrototype.toString.call(regexp) == '[object RegExp]';
        }
    });

    Box.apply(Box, {

        typeOf: function (value) {
            var type, typeToString;
            if (value === null) {
                return 'null';
            }
            type = typeof value;
            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }
            typeToString = toString.call(value);

            switch (typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }
            if (type === 'function') {
                return 'function';
            }
            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (nonWhitespaceRe).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    } else {
                        return 'element';
                    }
                }

                return 'object';
            }

            Box.Error({
                className: 'Box',
                methodName: 'typeOf',
                error: 'Failed to determine the type of the specified value "' + value + '". This is most likely a bug.'
            });
        },

        copyTo: function (dest, source, names) {
            if (typeof names == 'string') {
                names = names.split(/[,;\s]/);
            }

            var nLen = names ? names.length : 0,
                n, name;

            for (n = 0; n < nLen; n++) {
                name = names[n];
                if (source.hasOwnProperty(name)) {
                    dest[name] = source[name];
                }
            }
            return dest;
        },

        clone: function (item) {
            if (item === null || item === undefined) {
                return item;
            }

            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item);

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Box.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Box.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        copy: function (item, item2, properties) {
            var nitem = Box.clone(item);
            if (item2 && properties) {
                if (Box.isString(properties))
                    properties = properties.split(",");

                for (var i = 0; i < properties.length; i++) {
                    if (!Box.isNullOrUndefined(item2[properties[i]])) {
                        nitem[properties[i]] = Box.clone(item2[properties[i]]);
                    }
                }
            }
            return nitem;
        },

        isEqual: function (a, b) {
            if (a === b) {
                return true;
            }
            if (Box.isEmpty(a) && Box.isEmpty(b)) {
                return true;
            }
            var type = Box.typeOf(a);
            if (type != Box.typeOf(b)) {
                return false;
            }
            switch (type) {
                case 'string':
                    return a == String(b);
                case 'number':
                    return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                case 'date':
                case 'boolean':
                    return +a == +b;
                case 'regexp':
                    return a.source == b.source &&
                        a.global == b.global &&
                        a.multiline == b.multiline &&
                        a.ignoreCase == b.ignoreCase;
                case 'array':
                    var aString = a.toString();
                    var bString = b.toString();

                    return aString.indexOf('[object') === -1 &&
                        bString.indexOf('[object') === -1 &&
                        aString === bString;
            }
            if (typeof a != 'object' || typeof b != 'object') {
                return false;
            }
            if (Box.isObject(a) && Box.isObject(b)) {
                if (!Box.isEqual(Box.Object.getKeys(a), Box.Object.getKeys(b))) {
                    return false;
                }
                for (var p in a) {
                    if (!Box.isEqual(a[p], b[p])) {
                        return false;
                    }
                }
                return true;
            }
        },
        compare: function (a, b) {
            if (Box.isEqual(a, b))
                return 0;

            var typea = Box.typeOf(a);
            var typeb = Box.typeOf(b);
            if (typea != typeb) {
                return typea.localeCompare(typeb);
            }

            switch (typea) {
                case 'string':
                    return a.localeCompare(b);
                case 'number':
                    return a == b ? 0 : a > b ? 1 : -1;
                case 'date':
                    return Box.Format.renderDate(a, 'yyyyMMddHHmmssS').localeCompare(Box.Format.renderDate(b, 'yyyyMMddHHmmssS'));
                case 'boolean':
                    return (a ? 1 : 0) - (b ? 1 : 0);
                case 'regexp':
                    return a.source.localeCompare(b.source);
                case 'array':
                    return a.toString().localeCompare(b.toString());
                case 'object':
                    return Box.Object.toStringBy(a).localeCompare(Box.Object.toStringBy(b));
            }
        },

        coerce: function (from, to) {
            var fromType = Box.typeOf(from),
                toType = to && to.name || Box.typeOf(to),
                isString = typeof from === 'string';

            if (Box.isEmpty(toType)) {
                return from;
            }

            toType = toType.toLowerCase();

            if (fromType !== toType) {
                switch (toType) {
                    case 'string':
                        return String(from);
                    case 'number':
                        return Number(from);
                    case 'boolean':
                        return isString && (!from || from === 'false') ? false : Boolean(from);
                    case 'null':
                        return isString && (!from || from === 'null') ? null : from;
                    case 'undefined':
                        return isString && (!from || from === 'undefined') ? undefined : from;
                    case 'date':
                        return isString && isNaN(from) ? Box.Date.parse(from, Box.Date.defaultFormat) : Date(Number(from));
                }
            }
            return from;
        }

    });

    return Box;

})();
