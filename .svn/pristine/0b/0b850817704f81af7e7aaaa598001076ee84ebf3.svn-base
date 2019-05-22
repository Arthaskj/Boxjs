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


// Keyboard
Box.apply(Box.Keyboard = {}, {

    BACKSPACE: 8,

    TAB: 9,

    NUM_CENTER: 12,

    ENTER: 13,

    RETURN: 13,

    SHIFT: 16,

    CTRL: 17,

    ALT: 18,

    PAUSE: 19,

    CAPS_LOCK: 20,

    ESC: 27,

    SPACE: 32,

    PAGE_UP: 33,

    PAGE_DOWN: 34,

    END: 35,

    HOME: 36,

    LEFT: 37,

    UP: 38,

    RIGHT: 39,

    DOWN: 40,

    PRINT_SCREEN: 44,

    INSERT: 45,

    DELETE: 46,

    ZERO: 48,

    ONE: 49,

    TWO: 50,

    THREE: 51,

    FOUR: 52,

    FIVE: 53,

    SIX: 54,

    SEVEN: 55,

    EIGHT: 56,

    NINE: 57,

    A: 65,

    B: 66,

    C: 67,

    D: 68,

    E: 69,

    F: 70,

    G: 71,

    H: 72,

    I: 73,

    J: 74,

    K: 75,

    L: 76,

    M: 77,

    N: 78,

    O: 79,

    P: 80,

    Q: 81,

    R: 82,

    S: 83,

    T: 84,

    U: 85,

    V: 86,

    W: 87,

    X: 88,

    Y: 89,

    Z: 90,

    CONTEXT_MENU: 93,

    NUM_ZERO: 96,

    NUM_ONE: 97,

    NUM_TWO: 98,

    NUM_THREE: 99,

    NUM_FOUR: 100,

    NUM_FIVE: 101,

    NUM_SIX: 102,

    NUM_SEVEN: 103,

    NUM_EIGHT: 104,

    NUM_NINE: 105,

    NUM_MULTIPLY: 106,

    NUM_PLUS: 107,

    NUM_MINUS: 109,

    NUM_PERIOD: 110,

    NUM_DIVISION: 111,

    F1: 112,

    F2: 113,

    F3: 114,

    F4: 115,

    F5: 116,

    F6: 117,

    F7: 118,

    F8: 119,

    F9: 120,

    F10: 121,

    F11: 122,

    F12: 123

});

// StatusType 
Box.apply(Box.StatusType = {}, {

    SUCCESS: 'success',

    FAIL: 'fail',

    OK: 'ok',

    YES: 'yes',

    NO: 'no',

    CONFIRE: 'confirm',

    CANCEL: 'cancel',

    INFO: 'info',

    WARNING: 'warning',

    QUESTION: 'question',

    ERROR: 'error',

    NOT_FIND: 404,

    SERVER_ERROR: 500,

    HTTP_OK: 200

});

// ElementTag
Box.apply(Box.ElementTag = {}, {

    ABBR: 'abbr',

    ADDRESS: 'address',

    AREA: 'area',

    ARTICLE: 'article',

    AUDIO: 'audio',

    DIV: 'div',

    SPAN: 'span',

    A: 'a',

    UL: 'ul',

    LI: 'li',

    TABLE: 'table',

    TBODY: 'tbody',

    THEAD: 'thead',

    TFOOT: 'tfoot',

    TR: 'tr',

    TD: 'td',

    TH: 'th',

    DL: 'dl',

    DT: 'dt',

    DD: 'dd',

    BODY: 'body',

    HTML: 'html',

    HEAD: 'head',

    LINK: 'link',

    SCRIPT: 'script',

    B: 'b',

    BOTTON: 'botton',

    CANVAS: 'canvas',

    CAPTION: 'caption',

    CENTER: 'center',

    CITE: 'cite',

    CODE: 'code',

    COL: 'col',

    COLGROUP: 'colgroup',

    DEL: 'del',

    DETAILS: 'details',

    DIR: 'dir',

    EM: 'em',

    EMBED: 'embed',

    FONT: 'font',

    FORM: 'form',

    FRAME: 'frame',

    FRAMESET: 'frameset',

    HEADER: 'header',

    HR: 'hr',

    H1: 'h1',

    H2: 'h2',

    H3: 'h3',

    H4: 'h4',

    H5: 'h5',

    H6: 'h6',

    I: 'i',

    IFRAME: 'iframe',

    IMG: 'img',

    INPUT: 'input',

    INS: 'ins',

    LABEL: 'label',

    MAP: 'map',

    MARK: 'mark',

    MENU: 'menu',

    MENUITEM: 'menuitem',

    META: 'meta',

    METER: 'meter',

    NAV: 'nav',

    NOFRAMES: 'noframes',

    NOSCRIPT: 'noscript',

    OBJECT: 'object',

    OL: 'ol',

    OPTION: 'option',

    OUTPUT: 'output',

    P: 'p',

    PARAM: 'param',

    PRE: 'pre',

    PROGRESS: 'progress',

    S: 's',

    SECTION: 'section',

    SELECT: 'select',

    SMALL: 'small',

    SOURCE: 'source',

    STRONG: 'strong',

    STYLE: 'style',

    SUB: 'sub',

    SUMMARY: 'summary',

    SUP: 'sup',

    TEXTAREA: 'textarea',

    TIME: 'time',

    TITLE: 'title',

    TRACK: 'track',

    TT: 'tt',

    U: 'u',

    VAR: 'var',

    VIDEO: 'video',

    WBR: 'wbr'

});


// EventType
Box.apply(Box.EventType = {}, {

    CLICK: 'click',

    DBLCLICK: 'dblclick',

    BLUR: 'blur',

    CHANGE: 'change',

    ERROR: 'error',

    FOCUS: 'focus',

    KEYDOWN: 'keydown',

    KEYPRESS: 'keypress',

    KEYUP: 'keyup',

    MOUSEDOWN: 'mousedown',

    MOUSEENTER: 'mouseenter',

    MOUSELEAVE: 'mouseleave',

    MOUSEMOVE: 'mousemove',

    MOUSEOUT: 'mouseout',

    MOUSEOVER: 'mouseover',

    MOUSEUP: 'mouseup',

    RESIZE: 'resize',

    SCROLL: 'scroll',

    SELECT: 'select',

    SUBMIT: 'submit'

});


//Array
(function (Box) {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice;

    //splice function in IE8 is broken (hack)
    var supportsSplice = (function () {
        var array = [],
            lengthBefore, i = 20;

        if (!array.splice) {
            return false;
        }

        while (i--) {
            array.push("A");
        }

        array.splice(15, 0, "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F");

        lengthBefore = array.length;

        //预期的长度应该是42，实际长度为55
        array.splice(13, 0, "XXX");

        if (lengthBefore + 1 != array.length) {
            return false;
        }

        return true;
    })();

    function fixArrayIndex(array, index) {
        return (index < 0) ? Math.max(0, array.length + index) : Math.min(array.length, index);
    }

    function replaceSim(array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index),
            remove,
            tailOldPos,
            tailNewPos,
            tailCount,
            lengthAfterRemove,
            i;

        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            remove = Math.min(removeCount, length - pos);
            tailOldPos = pos + remove;
            tailNewPos = tailOldPos + add - remove;
            tailCount = length - tailOldPos;
            lengthAfterRemove = length - remove;

            if (tailNewPos < tailOldPos) {
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos + i] = array[tailOldPos + i];
                }
            } else if (tailNewPos > tailOldPos) {
                for (i = tailCount; i--;) {
                    array[tailNewPos + i] = array[tailOldPos + i];
                }
            }

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove;
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add;
                for (i = 0; i < add; ++i) {
                    array[pos + i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative(array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim(array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative(array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim(array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos + removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative(array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim;
    var replace = supportsSplice ? replaceNative : replaceSim;
    var splice = supportsSplice ? spliceNative : spliceSim;

    var arrayPrototype = Array.prototype,
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function () {
            var a = [1, 2, 3, 4, 5].sort(function () {
                return 0;
            });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    /*给HY定义Array对象*/
    Box.Array = {

        each: function (array, fn, scope, reverse) {
            //当array不是可迭代数组，或者是基本数据类型的话，那么创建array
            array = Box.Array.from(array);

            var i, k, len = array.length;

            if (reverse !== true) {
                for (i = 0; i < len; i++) {
                    k = array[i];
                    //循环执行fn函数，若fn返回false时，直接跳出each循环
                    if (fn.call(scope || k, k, i, array) === false) {
                        return i;
                    }
                }
            } else {
                for (i = len - 1; i > -1; i--) {
                    k = array[i];
                    if (fn.call(scope || k, k, i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        forEach: function (array, fn, scope) {
            array = Box.Array.from(array);
            if (supportsForEach) {
                return array.forEach(fn, scope);
            }
            var i, k, ln = array.length;
            for (i = 0; i < ln; i++) {
                k = array[i];
                fn.call(scope, k, i, array);
            }
        },

        /**
         * 返回(想要找寻值)一样的该值在数组的索引值
         * @function
         * @param {array} array 待检测的数组
         * @param {all} item 需要检测索引值的项
         * @param {number} from 设置从待检测数组开始检测索引
         * @returns {array}
         */
        indexOf: function (array, item, from) {
            from = from || 0;
            if (supportsIndexOf) {
                return array.indexOf(item, from);
            }
            var i, length = array.length;
            //判断from的大小，然后定位起始点
            for (i = (from < 0 ? Math.max(0, length + from) : from || 0); i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        //查找数组中是否包含item项
        contains: function (array, item) {
            return (Box.Array.indexOf(array, item) > -1);
        },

        /**
         * 从一个数组中截取新的数组
         * @function
         * @param {array} array 新数组的母体
         * @param {number} start 截取数组的开始索引
         * @param {number} end 截取数组的结束索引
         * @returns {array}
         */
        subArray: function (array, start, end) {
            return arrayPrototype.slice.call(array || [], start || 0, end === 0 ? 0 : (end || array.length));
        },

        slice: function (array, start, end) {
            return this.subArray(array, start, end)
        },

        /**
         * 遍历数组，执行函数,迭代数组，每个元素作为参数执行callBack方法，
         * 由callBack方法对每个元素进行处理，最后返回处理后的一个数组
         * @function
         * @param {array} array 待遍历的数组
         * @param {function} fn 每次遍历执行的回调函数
         * @param {object} scope 回调函数内部的作用域，即this的指向对象
         * @returns {array}
         */
        map: function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "map",
                    error: "fn must be a valid callback function"
                })
            }

            if (supportsMap) {
                return array.map(fn, scope);
            }

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        clean: function (array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Box.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * 通过自定义规则过滤数组，得到新的数组
         * @function
         * @param {array} array 待过滤的数组
         * @param {function} fn 每次遍历执行的回调函数
         * @param {object} scope 回调函数内部的作用域，即this的指向对象
         * @returns {array}
         */
        filter: function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "filter",
                    error: "fn must be a valid callback function"
                });
            }

            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array) === true) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * 给数组去重，得到一个新的数组
         * @function
         * @param {array} array 待去重的数组
         * @returns {array}
         */
        unique: function (array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (Box.Array.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        remove: function (array, item) {
            var index = Box.Array.indexOf(array, item);
            if (index !== -1) {
                array.splice(index, 1)
            }
            return array;
        },

        /**
         * 向一个数组中添加元素项，但是保持唯一性
         * @function
         * @param {array} array 待添加的数组
         * @param {all} item 待添加到数组中的元素项，需要验证唯一性
         * @returns {array}
         */
        include: function (array, item) {
            if (!Box.Array.contains(array, item)) {
                array.push(item)
            }
            return array;
        },

        /**
         * 克隆数组
         * @function
         * @param {array} array 待克隆数组
         * @returns {array}
         */
        clone: function (array) {
            return arrayPrototype.slice.call(array);
        },

        /**
         * 数组合并获得新数组
         * @function
         * @param {array} array 待合并数组
         * @returns {array}
         */
        merge: function () {
            if (arguments.length == 0) {
                return [];
            }

            var me = Box.Array,
                source = arguments[0],
                remain = arrayPrototype.slice.call(arguments, 1);

            me.each(remain, function (item, i) {
                me.each(item, function (kitem, k) {
                    source.push(kitem)
                })
            });

            return source;
        },

        uniqueMerge: function () {
            if (arguments.length == 0) {
                return [];
            }

            var me = Box.Array,
                source = me.unique(arguments[0]),
                remain = arrayPrototype.slice.call(arguments, 1);

            me.each(remain, function (item, i) {
                me.each(item, function (kitem, k) {
                    me.include(source, kitem)
                })
            });

            return source;
        },

        from: function (value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Box.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return Box.Array.toArray(value);
            }

            return [value];
        },

        toArray: function (iterable, start, end) {

            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        min: function (array, comparisonFn) {
            //debug
            if (!Box.isIterable(array)) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "min",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        max: function (array, comparisonFn) {
            //debug
            if (!Box.isIterable(array)) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "max",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        sum: function (array, name) {
            //debug
            if (!Box.isIterable(array)) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "sum",
                    error: "arguments type must be an array"
                });
            }
            //debug
            var sum = 0,
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        mean: function (array) {
            return array.length > 0 ? Box.Array.sum(array) / array.length : undefined;
        },

        //获取arr中每个对象中的prop属性值，并且放到array中
        pluck: function (arr, prop) {
            var ret = [];
            Box.each(arr, function (v) {
                ret.push(v[prop]);
            });
            return ret;
        },

        flatten: function (array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Box.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        grep: function (arr, callback, inv) {
            var ret = [],
                retVal;
            inv = !!inv;

            for (var i = 0, length = arr.length; i < length; i++) {
                retVal = !!callback(arr[i], i);
                if (inv !== retVal) {
                    ret.push(arr[i]);
                }
            }
            return ret;
        },

        erase: erase,

        replace: replace,

        splice: splice,

        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        sort: supportsSort ? function (array, sortFn) {
            if (sortFn) {
                return array.sort(sortFn);
            } else {
                return array.sort();
            }
        } : function (array, sortFn) {
            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        some: supportsSome ? function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "some",
                    error: "must have a callback function passed as second argument."
                })
            }
            return array.some(fn, scope);
        } : function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "some",
                    error: "must have a callback function passed as second argument."
                })
            }
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        every: supportsEvery ? function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "every",
                    error: "must have a callback function passed as second argument."
                })
            }
            return array.every(fn, scope);
        } : function (array, fn, scope) {
            if (!fn) {
                Box.Error({
                    className: "Box.Array",
                    methodName: "every",
                    error: "must have a callback function passed as second argument."
                })
            }
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        difference: function (arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0, lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        intersect: function () {
            var intersection = [],
                arrays = slice.call(arguments),
                arraysLength,
                array,
                arrayLength,
                minArray,
                minArrayIndex,
                minArrayCandidate,
                minArrayLength,
                element,
                elementCandidate,
                elementCount,
                i, j, k;

            if (!arrays.length) {
                return intersection;
            }

            arraysLength = arrays.length;
            for (i = minArrayIndex = 0; i < arraysLength; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }

            minArray = Box.Array.unique(minArray);
            erase(arrays, minArrayIndex, 1);

            minArrayLength = minArray.length;
            arraysLength = arrays.length;
            for (i = 0; i < minArrayLength; i++) {
                element = minArray[i];
                elementCount = 0;

                for (j = 0; j < arraysLength; j++) {
                    array = arrays[j];
                    arrayLength = array.length;
                    for (k = 0; k < arrayLength; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }

                if (elementCount === arraysLength) {
                    intersection.push(element);
                }
            }

            return intersection;
        },

        invoke: function (arr, methodName) {
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2),
                a, v,
                aLen = arr.length;

            for (a = 0; a < aLen; a++) {
                v = arr[a];

                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            }

            return ret;
        }

    }
})(Box);
Box.Date = new function () {

    var utilDate = this,
        stripEscapeRe = /(\\.)/g,
        hourInfoRe = /([gGhHisucUOPZ]|MS)/,
        dateInfoRe = /([djzmnYycU]|MS)/,
        slashRe = /\\/gi,
        numberTokenRe = /\{(\d+)\}/g,
        MSFormatRe = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/'),
        code = [
            "var me = this, dt, y, m, d, h, i, s, ms, o, O, z, zz, u, v, W, year, jan4, week1monday,",
            "def = me.defaults,",
            "from = Box.Number.from,",
            "results = String(input).match(me.parseRegexes[{0}]);",

            "if(results){",
            "{1}",

            "if(u != null){",
            "v = new Date(u * 1000);",
            "}else{",

            "dt = me.clearTime(new Date);",

            "y = from(y, from(def.y, dt.getFullYear()));",
            "m = from(m, from(def.m - 1, dt.getMonth()));",
            "d = from(d, from(def.d, dt.getDate()));",

            "h  = from(h, from(def.h, dt.getHours()));",
            "i  = from(i, from(def.i, dt.getMinutes()));",
            "s  = from(s, from(def.s, dt.getSeconds()));",
            "ms = from(ms, from(def.ms, dt.getMilliseconds()));",

            "if(z >= 0 && y >= 0){",

            "v = me.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",

            "v = !strict? v : (strict === true && (z <= 364 || (me.isLeapYear(v) && z <= 365))? me.add(v, me.DAY, z) : null);",
            "}else if(strict === true && !me.isValid(y, m + 1, d, h, i, s, ms)){",
            "v = null;",
            "}else{",
            "if (W) {",
            "year = y || (new Date()).getFullYear(),",
            "jan4 = new Date(year, 0, 4, 0, 0, 0),",
            "week1monday = new Date(jan4.getTime() - ((jan4.getDay() - 1) * 86400000));",
            "v = Box.Date.clearTime(new Date(week1monday.getTime() + ((W - 1) * 604800000)));",
            "} else {",
            "v = me.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",
            "}",
            "}",
            "}",
            "}",

            "if(v){",
            "if(zz != null){",
            "v = me.add(v, me.SECOND, -v.getTimezoneOffset() * 60 - zz);",
            "}else if(o){",
            "v = me.add(v, me.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
            "}",
            "}",

            "return v;"
        ].join('\n');


    function xf(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(numberTokenRe, function (m, i) {
            return args[i];
        });
    }

    Box.apply(utilDate, {

        now: Date.now || function () {
            return +new Date();
        },

        toString: function (date) {
            var pad = Box.String.leftPad;

            return date.getFullYear() + "-"
                + pad(date.getMonth() + 1, 2, '0') + "-"
                + pad(date.getDate(), 2, '0') + "T"
                + pad(date.getHours(), 2, '0') + ":"
                + pad(date.getMinutes(), 2, '0') + ":"
                + pad(date.getSeconds(), 2, '0');
        },

        getElapsed: function (dateA, dateB) {
            return Math.abs(dateA - (dateB || new Date()));
        },

        useStrict: false,

        formatCodeToRegex: function (character, currentGroup) {
            var p = utilDate.parseCodes[character];

            if (p) {
                p = typeof p == 'function' ? p() : p;
                utilDate.parseCodes[character] = p;
            }

            return p ? Box.applyIf({
                c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
            }, p) : {
                g: 0,
                c: null,
                s: Box.String.escapeRegex(character)
            };
        },

        parseFunctions: {
            "MS": function (input, strict) {
                var r = (input || '').match(MSFormatRe);
                return r ? new Date(((r[1] || '') + r[2]) * 1) : null;
            },
            "time": function (input, strict) {
                var num = parseInt(input, 10);
                if (num || num === 0) {
                    return new Date(num);
                }
                return null;
            },
            "timestamp": function (input, strict) {
                var num = parseInt(input, 10);
                if (num || num === 0) {
                    return new Date(num * 1000);
                }
                return null;
            }
        },
        parseRegexes: [],

        formatFunctions: {
            "MS": function () {
                return '\\/Date(' + this.getTime() + ')\\/';
            },
            "time": function () {
                return this.getTime().toString();
            },
            "timestamp": function () {
                return utilDate.format(this, 'U');
            }
        },

        y2kYear: 50,

        MILLI: "ms",

        SECOND: "s",

        MINUTE: "mi",

        HOUR: "h",

        DAY: "d",

        MONTH: "mo",

        YEAR: "y",

        defaults: {},

        dayNames: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],

        monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],

        monthNumbers: {
            January: 0,
            Jan: 0,
            February: 1,
            Feb: 1,
            March: 2,
            Mar: 2,
            April: 3,
            Apr: 3,
            May: 4,
            June: 5,
            Jun: 5,
            July: 6,
            Jul: 6,
            August: 7,
            Aug: 7,
            September: 8,
            Sep: 8,
            October: 9,
            Oct: 9,
            November: 10,
            Nov: 10,
            December: 11,
            Dec: 11
        },

        defaultFormat: "Y-m-d",

        getShortMonthName: function (month) {
            return Box.Date.monthNames[month].substring(0, 3);
        },

        getShortDayName: function (day) {
            return Box.Date.dayNames[day].substring(0, 3);
        },

        getMonthNumber: function (name) {
            return Box.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        },

        formatContainsHourInfo: function (format) {
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        },

        formatContainsDateInfo: function (format) {
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        },

        unescapeFormat: function (format) {
            return format.replace(slashRe, '');
        },

        formatCodes: {
            d: "Box.String.leftPad(this.getDate(), 2, '0')",
            D: "Box.Date.getShortDayName(this.getDay())",
            j: "this.getDate()",
            l: "Box.Date.dayNames[this.getDay()]",
            N: "(this.getDay() ? this.getDay() : 7)",
            S: "Box.Date.getSuffix(this)",
            w: "this.getDay()",
            z: "Box.Date.getDayOfYear(this)",
            W: "Box.String.leftPad(Box.Date.getWeekOfYear(this), 2, '0')",
            F: "Box.Date.monthNames[this.getMonth()]",
            m: "Box.String.leftPad(this.getMonth() + 1, 2, '0')",
            M: "Box.Date.getShortMonthName(this.getMonth())",
            n: "(this.getMonth() + 1)",
            t: "Box.Date.getDaysInMonth(this)",
            L: "(Box.Date.isLeapYear(this) ? 1 : 0)",
            o: "(this.getFullYear() + (Box.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Box.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
            Y: "Box.String.leftPad(this.getFullYear(), 4, '0')",
            y: "('' + this.getFullYear()).substring(2, 4)",
            a: "(this.getHours() < 12 ? 'am' : 'pm')",
            A: "(this.getHours() < 12 ? 'AM' : 'PM')",
            g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
            G: "this.getHours()",
            h: "Box.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
            H: "Box.String.leftPad(this.getHours(), 2, '0')",
            i: "Box.String.leftPad(this.getMinutes(), 2, '0')",
            s: "Box.String.leftPad(this.getSeconds(), 2, '0')",
            u: "Box.String.leftPad(this.getMilliseconds(), 3, '0')",
            O: "Box.Date.getGMTOffset(this)",
            P: "Box.Date.getGMTOffset(this, true)",
            T: "Box.Date.getTimezone(this)",
            Z: "(this.getTimezoneOffset() * -60)",

            c: function () {
                var c, code, i, l, e;
                for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                    e = c.charAt(i);
                    code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e));
                }
                return code.join(" + ");
            },
            U: "Math.round(this.getTime() / 1000)"
        },

        isValid: function (y, m, d, h, i, s, ms) {
            h = h || 0;
            i = i || 0;
            s = s || 0;
            ms = ms || 0;

            var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

            return y == dt.getFullYear() &&
                m == dt.getMonth() + 1 &&
                d == dt.getDate() &&
                h == dt.getHours() &&
                i == dt.getMinutes() &&
                s == dt.getSeconds() &&
                ms == dt.getMilliseconds();
        },

        parse: function (input, format, strict) {
            var p = utilDate.parseFunctions;
            if (p[format] == null) {
                utilDate.createParser(format);
            }
            return p[format].call(utilDate, input, Box.isDefined(strict) ? strict : utilDate.useStrict);
        },

        parseDate: function (input, format, strict) {
            return utilDate.parse(input, format, strict);
        },

        getFormatCode: function (character) {
            var f = utilDate.formatCodes[character];

            if (f) {
                f = typeof f == 'function' ? f() : f;
                utilDate.formatCodes[character] = f;
            }

            return f || ("'" + Box.String.escape(character) + "'");
        },

        createFormat: function (format) {
            var code = [],
                special = false,
                ch = '',
                i;

            for (i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    code.push("'" + Box.String.escape(ch) + "'");
                } else {
                    code.push(utilDate.getFormatCode(ch));
                }
            }
            utilDate.formatFunctions[format] = Box.functionFactory("return " + code.join('+'));
        },

        createParser: function (format) {
            var regexNum = utilDate.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "",
                i = 0,
                len = format.length,
                atEnd = [],
                obj;

            for (; i < len; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(Box.String.escape(ch));
                } else {
                    obj = utilDate.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        if (obj.calcAtEnd) {
                            atEnd.push(obj.c);
                        } else {
                            calc.push(obj.c);
                        }
                    }
                }
            }

            calc = calc.concat(atEnd);

            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
            utilDate.parseFunctions[format] = Box.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
        },

        parseCodes: {
            d: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(3[0-1]|[1-2][0-9]|0[1-9])"
            },
            j: {
                g: 1,
                c: "d = parseInt(results[{0}], 10);\n",
                s: "(3[0-1]|[1-2][0-9]|[1-9])"
            },
            D: function () {
                for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i) ;
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + a.join("|") + ")"
                };
            },
            l: function () {
                return {
                    g: 0,
                    c: null,
                    s: "(?:" + utilDate.dayNames.join("|") + ")"
                };
            },
            N: {
                g: 0,
                c: null,
                s: "[1-7]"
            },
            S: {
                g: 0,
                c: null,
                s: "(?:st|nd|rd|th)"
            },
            w: {
                g: 0,
                c: null,
                s: "[0-6]"
            },
            z: {
                g: 1,
                c: "z = parseInt(results[{0}], 10);\n",
                s: "(\\d{1,3})"
            },
            W: {
                g: 1,
                c: "W = parseInt(results[{0}], 10);\n",
                s: "(\\d{2})"
            },
            F: function () {
                return {
                    g: 1,
                    c: "m = parseInt(me.getMonthNumber(results[{0}]), 10);\n",
                    s: "(" + utilDate.monthNames.join("|") + ")"
                };
            },
            M: function () {
                for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i) ;
                return Box.applyIf({
                    s: "(" + a.join("|") + ")"
                }, utilDate.formatCodeToRegex("F"));
            },
            m: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(1[0-2]|0[1-9])"
            },
            n: {
                g: 1,
                c: "m = parseInt(results[{0}], 10) - 1;\n",
                s: "(1[0-2]|[1-9])"
            },
            t: {
                g: 0,
                c: null,
                s: "(?:\\d{2})"
            },
            L: {
                g: 0,
                c: null,
                s: "(?:1|0)"
            },
            o: {
                g: 1,
                c: "y = parseInt(results[{0}], 10);\n",
                s: "(\\d{4})"

            },
            Y: {
                g: 1,
                c: "y = parseInt(results[{0}], 10);\n",
                s: "(\\d{4})"
            },
            y: {
                g: 1,
                c: "var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > me.y2kYear ? 1900 + ty : 2000 + ty;\n",
                s: "(\\d{1,2})"
            },
            a: {
                g: 1,
                c: "if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
                s: "(am|pm|AM|PM)",
                calcAtEnd: true
            },
            A: {
                g: 1,
                c: "if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
                s: "(AM|PM|am|pm)",
                calcAtEnd: true
            },
            g: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(1[0-2]|[0-9])"
            },
            G: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(2[0-3]|1[0-9]|[0-9])"
            },
            h: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(1[0-2]|0[1-9])"
            },
            H: {
                g: 1,
                c: "h = parseInt(results[{0}], 10);\n",
                s: "(2[0-3]|[0-1][0-9])"
            },
            i: {
                g: 1,
                c: "i = parseInt(results[{0}], 10);\n",
                s: "([0-5][0-9])"
            },
            s: {
                g: 1,
                c: "s = parseInt(results[{0}], 10);\n",
                s: "([0-5][0-9])"
            },
            u: {
                g: 1,
                c: "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
                s: "(\\d+)"
            },
            O: {
                g: 1,
                c: [
                    "o = results[{0}];",
                    "var sn = o.substring(0,1),",
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),",
                    "mn = o.substring(3,5) % 60;",
                    "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Box.String.leftPad(hr, 2, '0') + Box.String.leftPad(mn, 2, '0')) : null;\n"
                ].join("\n"),
                s: "([+-]\\d{4})"
            },
            P: {
                g: 1,
                c: [
                    "o = results[{0}];",
                    "var sn = o.substring(0,1),",
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),",
                    "mn = o.substring(4,6) % 60;",
                    "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Box.String.leftPad(hr, 2, '0') + Box.String.leftPad(mn, 2, '0')) : null;\n"
                ].join("\n"),
                s: "([+-]\\d{2}:\\d{2})"
            },
            T: {
                g: 0,
                c: null,
                s: "[A-Z]{1,5}"
            },
            Z: {
                g: 1,
                c: "zz = results[{0}] * 1;\n"
                + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
                s: "([+-]?\\d{1,5})"
            },
            c: function () {
                var calc = [],
                    arr = [
                        utilDate.formatCodeToRegex("Y", 1),
                        utilDate.formatCodeToRegex("m", 2),
                        utilDate.formatCodeToRegex("d", 3),
                        utilDate.formatCodeToRegex("H", 4),
                        utilDate.formatCodeToRegex("i", 5),
                        utilDate.formatCodeToRegex("s", 6),
                        {c: "ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"},
                        {
                            c: [
                                "if(results[8]) {",
                                "if(results[8] == 'Z'){",
                                "zz = 0;",
                                "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c,
                                "}else{",
                                utilDate.formatCodeToRegex("O", 8).c,
                                "}",
                                "}"
                            ].join('\n')
                        }
                    ],
                    i,
                    l;

                for (i = 0, l = arr.length; i < l; ++i) {
                    calc.push(arr[i].c);
                }

                return {
                    g: 1,
                    c: calc.join(""),
                    s: [
                        arr[0].s,
                        "(?:", "-", arr[1].s,
                        "(?:", "-", arr[2].s,
                        "(?:",
                        "(?:T| )?",
                        arr[3].s, ":", arr[4].s,
                        "(?::", arr[5].s, ")?",
                        "(?:(?:\\.|,)(\\d+))?",
                        "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?",
                        ")?",
                        ")?",
                        ")?"
                    ].join("")
                };
            },
            U: {
                g: 1,
                c: "u = parseInt(results[{0}], 10);\n",
                s: "(-?\\d+)"
            }
        },

        dateFormat: function (date, format) {
            return utilDate.format(date, format);
        },

        isEqual: function (date1, date2) {
            if (date1 && date2) {
                return (date1.getTime() === date2.getTime());
            }
            return !(date1 || date2);
        },

        format: function (date, format) {
            var formatFunctions = utilDate.formatFunctions;

            if (!Box.isDate(date)) {
                return '';
            }

            if (formatFunctions[format] == null) {
                utilDate.createFormat(format);
            }

            return formatFunctions[format].call(date) + '';
        },

        getTimezone: function (date) {
            return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,5})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
        },

        getGMTOffset: function (date, colon) {
            var offset = date.getTimezoneOffset();
            return (offset > 0 ? "-" : "+")
                + Box.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
                + (colon ? ":" : "")
                + Box.String.leftPad(Math.abs(offset % 60), 2, "0");
        },

        getDayOfYear: function (date) {
            var num = 0,
                d = Box.Date.clone(date),
                m = date.getMonth(),
                i;

            for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
                num += utilDate.getDaysInMonth(d);
            }
            return num + date.getDate() - 1;
        },

        getWeekOfYear: (function () {
            var ms1d = 864e5,
                ms7d = 7 * ms1d;

            return function (date) {
                var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d,
                    AWN = Math.floor(DC3 / 7),
                    Wyr = new Date(AWN * ms7d).getUTCFullYear();

                return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
            };
        }()),

        isLeapYear: function (date) {
            var year = date.getFullYear();
            return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
        },

        getFirstDayOfMonth: function (date) {
            var day = (date.getDay() - (date.getDate() - 1)) % 7;
            return (day < 0) ? (day + 7) : day;
        },

        getLastDayOfMonth: function (date) {
            return utilDate.getLastDateOfMonth(date).getDay();
        },

        getFirstDateOfMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        getLastDateOfMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
        },

        getDaysInMonth: (function () {
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            return function (date) {
                var m = date.getMonth();

                return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
            };
        }()),

        getSuffix: function (date) {
            switch (date.getDate()) {
                case 1:
                case 21:
                case 31:
                    return "st";
                case 2:
                case 22:
                    return "nd";
                case 3:
                case 23:
                    return "rd";
                default:
                    return "th";
            }
        },

        clone: function (date) {
            return new Date(date.getTime());
        },

        isDST: function (date) {
            return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
        },

        clearTime: function (date, clone) {
            if (clone) {
                return Box.Date.clearTime(Box.Date.clone(date));
            }

            var d = date.getDate(),
                hr,
                c;

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            if (date.getDate() != d) {
                for (hr = 1, c = utilDate.add(date, Box.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Box.Date.HOUR, hr)) ;

                date.setDate(d);
                date.setHours(c.getHours());
            }

            return date;
        },

        add: function (date, interval, value) {
            var d = Box.Date.clone(date),
                Date = Box.Date,
                day, decimalValue, base = 0;
            if (!interval || value === 0) {
                return d;
            }

            decimalValue = value - parseInt(value, 10);
            value = parseInt(value, 10);

            if (value) {
                switch (interval.toLowerCase()) {
                    case Box.Date.MILLI:
                        d.setTime(d.getTime() + value);
                        break;
                    case Box.Date.SECOND:
                        d.setTime(d.getTime() + value * 1000);
                        break;
                    case Box.Date.MINUTE:
                        d.setTime(d.getTime() + value * 60 * 1000);
                        break;
                    case Box.Date.HOUR:
                        d.setTime(d.getTime() + value * 60 * 60 * 1000);
                        break;
                    case Box.Date.DAY:
                        d.setDate(d.getDate() + value);
                        break;
                    case Box.Date.MONTH:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, Box.Date.getLastDateOfMonth(Box.Date.add(Box.Date.getFirstDateOfMonth(date), Box.Date.MONTH, value)).getDate());
                        }
                        d.setDate(day);
                        d.setMonth(date.getMonth() + value);
                        break;
                    case Box.Date.YEAR:
                        day = date.getDate();
                        if (day > 28) {
                            day = Math.min(day, Box.Date.getLastDateOfMonth(Box.Date.add(Box.Date.getFirstDateOfMonth(date), Box.Date.YEAR, value)).getDate());
                        }
                        d.setDate(day);
                        d.setFullYear(date.getFullYear() + value);
                        break;
                }
            }

            if (decimalValue) {
                switch (interval.toLowerCase()) {
                    case Box.Date.MILLI:
                        base = 1;
                        break;
                    case Box.Date.SECOND:
                        base = 1000;
                        break;
                    case Box.Date.MINUTE:
                        base = 1000 * 60;
                        break;
                    case Box.Date.HOUR:
                        base = 1000 * 60 * 60;
                        break;
                    case Box.Date.DAY:
                        base = 1000 * 60 * 60 * 24;
                        break;

                    case Box.Date.MONTH:
                        day = utilDate.getDaysInMonth(d);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;

                    case Box.Date.YEAR:
                        day = (utilDate.isLeapYear(d) ? 366 : 365);
                        base = 1000 * 60 * 60 * 24 * day;
                        break;
                }
                if (base) {
                    d.setTime(d.getTime() + base * decimalValue);
                }
            }

            return d;
        },

        subtract: function (date, interval, value) {
            return utilDate.add(date, interval, -value);
        },

        between: function (date, start, end) {
            var t = date.getTime();
            return start.getTime() <= t && t <= end.getTime();
        },

        compat: function () {
            var nativeDate = window.Date,
                p,
                statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
                proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'],
                sLen = statics.length,
                pLen = proto.length,
                stat, prot, s;

            for (s = 0; s < sLen; s++) {
                stat = statics[s];
                nativeDate[stat] = utilDate[stat];
            }

            for (p = 0; p < pLen; p++) {
                prot = proto[p];
                nativeDate.prototype[prot] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(this);
                    return utilDate[prot].apply(utilDate, args);
                };
            }
        }
    });
};

// 中文处理
(function () {

    Box.Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    Box.Date.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    Box.Date.formatCodes.a = "(this.getHours() < 12 ? '上午' : '下午')";
    Box.Date.formatCodes.A = "(this.getHours() < 12 ? '上午' : '下午')";

    parseCodes = {
        g: 1,
        c: "if (/(上午)/i.test(results[{0}])) {\n"
        + "if (!h || h == 12) { h = 0; }\n"
        + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
        s: "(上午|下午)",
        calcAtEnd: true
    };

    Box.Date.parseCodes.a = Box.Date.parseCodes.A = parseCodes;

})();
Box.Function = {

    clone: function (method) {
        return function () {
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

    createThrottled: function (fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function () {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function () {
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

    pass: function (fn, args, scope) {
        if (args) {
            args = Box.Array.from(args);
        }

        return function () {
            return fn.apply(scope, args.concat(Box.Array.toArray(arguments)));
        };
    },

    before: function (object, methodName, fn, scope) {
        var method = object[methodName] || Box.emptyFn;

        return (object[methodName] = function () {
            var ret = fn.apply(scope || this, arguments);
            method.apply(this, arguments);

            return ret;
        });
    },

    after: function (object, methodName, fn, scope) {
        var method = object[methodName] || Box.emptyFn;

        return (object[methodName] = function () {
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
(function () {

    var math = Math;
    var isToFixedBroken = (0.9).toFixed() !== '1';

    Box.Number = {
        //限制一个数字类型的大小范围， 如果小于最小范围， 那么返回最小值
        //如果大于最大范围， 那么返回最大值
        constrain: function (number, min, max) {
            number = parseFloat(number);
            if (!isNaN(min)) {
                number = math.max(number, min);
            }
            if (!isNaN(max)) {
                number = math.min(number, max);
            }
            return number;
        },

        //精确到几位
        toFixed: function (value, precision) {
            if (isToFixedBroken) {
                precision = precision || 0;
                var pow = math.pow(10, precision);
                return (math.round(value * pow) / pow).toFixed(precision);
            }

            return value.toFixed(precision);
        },

        //Box.Number.num('1.23', 1); // returns 1.23
        //Box.Number.num('abc', 1);  // returns 1
        num: function (value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }
            return !isNaN(value) ? value : defaultValue;
        },

        from: function (value, defaultValue) {
            return Box.Number.num(value, defaultValue)
        },

        randomInt: function (from, to) {
            return math.floor(math.random() * (to - from + 1) + from);
        },

        correctFloat: function (n) {
            return parseFloat(n.toPrecision(14));
        },

        snap: function (value, increment, minValue, maxValue) {
            var m;

            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return Box.Number.constrain(value, minValue, maxValue);
        }

    };

})();

Box.num = Box.Number.num;
(function () {

    var TemplateClass = function () {
    };

    Box.Object = {

        chain: Object.create || function (object) {
            TemplateClass.prototype = object;
            var result = new TemplateClass();
            TemplateClass.prototype = null;
            return result;
        },

        //循环迭代对象
        each: function (obj, fn, scope) {
            var prop;
            scope = scope || obj;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (fn.call(scope, prop, obj[prop], obj) === false) {
                        return;
                    }
                }
            }
        },

        toQueryObjects: function (name, value, recursive) {
            var self = Box.Object.toQueryObjects,
                objects = [],
                i, ln;

            if (Box.isArray(value)) {
                for (i = 0, ln = value.length; i < ln; i++) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    } else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            } else if (Box.isObject(value)) {
                for (i in value) {
                    if (value.hasOwnProperty(i)) {
                        if (recursive) {
                            objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                        } else {
                            objects.push({
                                name: name,
                                value: value[i]
                            });
                        }
                    }
                }
            } else {
                objects.push({
                    name: name,
                    value: value
                });
            }

            return objects;
        },


        toQueryString: function (object, recursive) {
            var paramObjects = [],
                params = [],
                i, j, ln, paramObject, value;

            for (i in object) {
                if (object.hasOwnProperty(i)) {
                    paramObjects = paramObjects.concat(Box.Object.toQueryObjects(i, object[i], recursive));
                }
            }

            for (j = 0, ln = paramObjects.length; j < ln; j++) {
                paramObject = paramObjects[j];
                value = paramObject.value;

                if (Box.isEmpty(value)) {
                    value = '';
                } else if (Box.isDate(value)) {
                    value = Box.Date.toString(value);
                }

                params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
            }

            return params.join('&');
        },


        fromQueryString: function (queryString, recursive) {
            var parts = queryString.replace(/^\?/, '').split('&'),
                object = {},
                temp, components, name, value, i, ln,
                part, j, subLn, matchedKeys, matchedName,
                keys, key, nextKey;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (part.length > 0) {
                    components = part.split('=');
                    name = decodeURIComponent(components[0]);
                    value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                    if (!recursive) {
                        if (object.hasOwnProperty(name)) {
                            if (!Box.isArray(object[name])) {
                                object[name] = [object[name]];
                            }

                            object[name].push(value);
                        } else {
                            object[name] = value;
                        }
                    } else {
                        matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                        matchedName = name.match(/^([^\[]+)/);

                        if (!matchedName) {
                            throw new Error('[Box.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                        }

                        name = matchedName[0];
                        keys = [];

                        if (matchedKeys === null) {
                            object[name] = value;
                            continue;
                        }

                        for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                            key = matchedKeys[j];
                            key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                            keys.push(key);
                        }

                        keys.unshift(name);

                        temp = object;

                        for (j = 0, subLn = keys.length; j < subLn; j++) {
                            key = keys[j];

                            if (j === subLn - 1) {
                                if (Box.isArray(temp) && key === '') {
                                    temp.push(value);
                                } else {
                                    temp[key] = value;
                                }
                            } else {
                                if (temp[key] === undefined || typeof temp[key] === 'string') {
                                    nextKey = keys[j + 1];

                                    temp[key] = (Box.isNumeric(nextKey) || nextKey === '') ? [] : {};
                                }

                                temp = temp[key];
                            }
                        }
                    }
                }
            }

            return object;
        },


        //给一个对象合并其他的值
        merge: function (source, key, value) {
            source = source || {};

            if (Box.isString(key)) {
                if (Box.isObject(value) && Box.isObject(source[key])) {
                    Box.Object.merge(source[key], value);
                } else if (Box.isObject(value)) {
                    source[key] = value;
                } else {
                    source[key] = value;
                }

                return source;
            }

            var index = 1,
                len = arguments.length,
                i = 0,
                obj, perp;

            for (; i < len; i++) {
                obj = arguments[i] || {};

                var hasProp = false;
                for (perp in obj) {
                    hasProp = true;
                }
                if (hasProp) {
                    for (perp in obj) {
                        if (obj.hasOwnProperty(perp)) {
                            Box.Object.merge(source, perp, obj[perp]);
                        }
                    }
                }
            }
            return source;
        },

        mergeIf: function (destination) {
            var i = 1,
                ln = arguments.length,
                cloneFn = Box.clone,
                object, key, value;

            for (; i < ln; i++) {
                object = arguments[i];

                for (key in object) {
                    if (!(key in destination)) {
                        value = object[key];

                        if (value && value.constructor === Object) {
                            destination[key] = cloneFn(value);
                        }
                        else {
                            destination[key] = value;
                        }
                    }
                }
            }

            return destination;
        },

        //根据值来获取键
        getKey: function (object, value) {
            for (var property in object) {
                if (object.hasOwnProperty(property) && object[property] === value) {
                    return property;
                }
            }
            return null;
        },

        getValues: function (object) {
            var values = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    values.push(object[property]);
                }
            }
            return values;
        },

        getKeys: ('keys' in Object.prototype) ? Object.keys : function (object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }
            return keys;
        },

        getSize: function (object) {
            var size = 0,
                property;
            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    size++;
                }
            }
            return size;
        },

        toStringBy: function (object, by, by2) {
            by = by || ":";
            by2 = by2 || "|";
            var string = [];
            Box.each(object, function (name, value) {
                string.push(name + by + value);
            });
            return string.join(by2);
        },

        isEmpty: function (object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },

        equals: (function () {
            var check = function (o1, o2) {
                var key;

                for (key in o1) {
                    if (o1.hasOwnProperty(key)) {
                        if (o1[key] !== o2[key]) {
                            return false;
                        }
                    }
                }
                return true;
            };

            return function (object1, object2) {

                if (object1 === object2) {
                    return true;
                }

                if (object1 && object2) {
                    return check(object1, object2) && check(object2, object1);
                } else if (!object1 && !object2) {
                    return object1 === object2;
                } else {
                    return false;
                }
            };
        })(),

        clone: function (object) {
            return Box.clone(object);
        },

        toArray: function (object) {
            if (!Box.isObject(object)) {
                throw '错误的对象。';
            }

            var rtn = [];
            for (var key in object) {
                object[key]._key = key;
                rtn.push(object[key]);
            }
            return rtn;
        },
        toDictionary: function (object) {
            if (!Box.isObject(object)) {
                throw '错误的对象。';
            }

            var rtn = [];
            for (var key in object) {
                var item = {
                    Key: key,
                    Value: object[key]
                };
                rtn.push(item);
            }
            return rtn;
        }
    };

    Box.merge = Box.Object.merge;

    Box.mergeIf = Box.Object.mergeIf;

    Box.urlEncode = function () {
        var args = Box.Array.from(arguments),
            prefix = '';

        if ((typeof args[1] === 'string')) {
            prefix = args[1] + '&';
            args[1] = false;
        }

        return prefix + Box.Object.toQueryString.apply(Box.Object, args);
    };

    Box.urlDecode = function () {
        return Box.Object.fromQueryString.apply(Box.Object, arguments);
    };

})();
Box.String = (function () {

    var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe = /('|\\)/g,
        formatRe = /\{(\d+)\}/g,
        escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
        basicTrimRe = /^\s+|\s+$/g,
        whitespaceRe = /\s+/,
        varReplace = /(^[^a-z]*|[^\w])/gi,
        charToEntity,
        entityToChar,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function (match, capture) {
            return charToEntity[capture];
        },
        htmlDecodeReplaceFn = function (match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        },
        boundsCheck = function (s, other) {
            if (s === null || s === undefined || other === null || other === undefined) {
                return false;
            }

            return other.length <= s.length;
        };

    return {

        EMPTY: "",

        EMPTY_GUID: "00000000-0000-0000-0000-000000000000",

        has: function (string, chars) {
            return string.indexOf(chars) >= 0;
        },

        //首字母变成大写
        firstUpperCase: function (string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        insert: function (s, value, index) {
            if (!s) {
                return value;
            }

            if (!value) {
                return s;
            }

            var len = s.length;

            if (!index && index !== 0) {
                index = len;
            }

            if (index < 0) {
                index *= -1;
                if (index >= len) {
                    // negative overflow, insert at start
                    index = 0;
                } else {
                    index = len - index;
                }
            }

            if (index === 0) {
                s = value + s;
            } else if (index >= s.length) {
                s += value;
            } else {
                s = s.substr(0, index) + value + s.substr(index);
            }
            return s;
        },

        startsWith: function (s, start, ignoreCase) {
            var result = boundsCheck(s, start);

            if (result) {
                if (ignoreCase) {
                    s = s.toLowerCase();
                    start = start.toLowerCase();
                }
                result = s.lastIndexOf(start, 0) === 0;
            }
            return result;
        },

        endsWith: function (s, end, ignoreCase) {
            var result = boundsCheck(s, end);

            if (result) {
                if (ignoreCase) {
                    s = s.toLowerCase();
                    end = end.toLowerCase();
                }
                result = s.indexOf(end, s.length - end.length) !== -1;
            }
            return result;
        },

        createVarName: function (s) {
            return s.replace(varReplace, '');
        },

        htmlEncode: function (value) {
            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        },

        htmlDecode: function (value) {
            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        },

        addCharacterEntities: function (newEntities) {
            var charKeys = [],
                entityKeys = [],
                key, echar;
            for (key in newEntities) {
                echar = newEntities[key];
                entityToChar[key] = echar;
                charToEntity[echar] = key;
                charKeys.push(echar);
                entityKeys.push(key);
            }
            charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
            entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        },

        resetCharacterEntities: function () {
            charToEntity = {};
            entityToChar = {};
            // add the default set
            this.addCharacterEntities({
                '&amp;': '&',
                '&gt;': '>',
                '&lt;': '<',
                '&quot;': '"',
                '&#39;': "'"
            });
        },

        urlAppend: function (url, string) {
            if (!Box.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        trim: function (string) {
            return string.replace(trimRegex, "");
        },

        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        uncapitalize: function (string) {
            return string.charAt(0).toLowerCase() + string.substr(1);
        },

        ellipsis: function (value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2),
                        index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },

        escapeRegex: function (string) {
            return string.replace(escapeRegexRe, "\\$1");
        },

        escape: function (string) {
            return string.replace(escapeRe, "\\$1");
        },


        toggle: function (string, value, other) {
            return string === value ? other : value;
        },

        leftPad: function (string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        format: function (format) {
            var args = Box.Array.toArray(arguments, 1);
            return format.replace(formatRe, function (m, i) {
                return args[i];
            });
        },

        repeat: function (pattern, count, sep) {
            if (count < 1) {
                count = 0;
            }
            for (var buf = [], i = count; i--;) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },

        splitWords: function (words) {
            if (words && typeof words == 'string') {
                return words.replace(basicTrimRe, '').split(whitespaceRe);
            }
            return words || [];
        },

        parseVersion: function (version) {
            var parts, releaseStartIndex, info = {};

            info.version = info.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');
            releaseStartIndex = info.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                info.release = info.version.substr(releaseStartIndex, version.length);
                info.shortVersion = info.version.substr(0, releaseStartIndex);
            }

            info.shortVersion = info.shortVersion.replace(/[^\d]/g, '');
            parts = info.version.split('.');

            info.major = parseInt(parts.shift() || 0, 10);
            info.minor = parseInt(parts.shift() || 0, 10);
            info.patch = parseInt(parts.shift() || 0, 10);
            info.build = parseInt(parts.shift() || 0, 10);

            return info;
        },

        hasHtmlCharacters: function (str) {
            return charToEntityRegex.test(str);
        },

        uuid: function (len, radix) {
            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },

        isGuid: function (value) {
            if (typeof value === "string")
                return /^[\dA-F]{8}(-[\dA-F]{4}){4}[\dA-F]{8}$/i.test(value);
            return false;
        }
    }
})();

Box.String.resetCharacterEntities();

Box.htmlEncode = Box.String.htmlEncode;

Box.htmlDecode = Box.String.htmlDecode;


(function (flexSetter) {

    var noArgs = [],
        Base = function () {
        },
        hookFunctionFactory = function (hookFunction, underriddenFunction, methodName, owningClass) {
            var result = function () {
                var result = this.callParent(arguments);
                hookFunction.apply(this, arguments);
                return result;
            };
            result.$name = methodName;
            result.$owner = owningClass;
            if (underriddenFunction) {
                result.$previous = underriddenFunction.$previous;
                underriddenFunction.$previous = result;
            }
            return result;
        };

    Box.apply(Base, {

        $className: 'Box.Base',

        $isClass: true,

        create: function () {
            return Box.create.apply(Box, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        extend: function (parent) {
            var parentPrototype = parent.prototype,
                basePrototype, prototype, i, ln, name, statics;

            prototype = this.prototype = Box.Object.chain(parentPrototype);
            prototype.self = this;

            this.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                basePrototype = Box.Base.prototype;

                for (i in basePrototype) {
                    if (i in prototype) {
                        prototype[i] = basePrototype[i];
                    }
                }
            }

            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0, ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }
        },

        $onExtended: [],

        triggerExtended: function () {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        onExtended: function (fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        addStatics: function (members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
                        member.$owner = this;
                        member.$name = name;

                        member.displayName = Box.getClassName(this) + '.' + name;
                    }
                    this[name] = member;
                }
            }

            return this;
        },

        addInheritableStatics: function (members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.displayName = Box.getClassName(this) + '.' + name;
                    }
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        addMembers: function (members) {
            var prototype = this.prototype,
                enumerables = Box.enumerables,
                names = [],
                i, ln, name, member;

            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0, ln = names.length; i < ln; i++) {
                name = names[i];

                //                if (members.hasOwnProperty(name)) {
                //                    member = members[name];
                //
                //                    if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
                //                        member.$owner = this;
                //                        member.$name = name;
                //                        member.displayName = (this.$className || '') + '#' + name;
                //                    }
                //
                //                    prototype[name] = member;
                //                }
                //修改继承类的时候覆盖属性的问题
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this.addMember.call(this, name, member);
                }
            }

            return this;
        },

        addMember: function (name, member) {
            var prototype = this.prototype;
            if (typeof member == 'function' && !member.$isClass && member !== Box.emptyFn && member !== Box.identityFn) {
                member.$owner = this;
                member.$name = name;
                member.displayName = (this.$className || '') + '#' + name;
            }

            //            this.prototype[name] = member;
            //修改继承类的时候覆盖属性的问题
            if (Box.isObject(member) && Box.isObject(prototype[name])) {
                prototype[name] = Box.apply(Box.clone(prototype[name]), member);
            } else {
                prototype[name] = member;
            }
            return this;
        },

        implement: function () {
            this.addMembers.apply(this, arguments);
        },

        borrow: function (fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.prototype,
                className = Box.getClassName(this),
                i, ln, name, fn, toBorrow;

            members = Box.Array.from(members);

            for (i = 0, ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = Box.Function.clone(toBorrow);

                    if (className) {
                        fn.displayName = className + '#' + name;
                    }

                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        override: function (members) {
            var me = this,
                enumerables = Box.enumerables,
                target = me.prototype,
                cloneFunction = Box.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = [];
                statics = null;

                for (name in members) {
                    if (name == 'statics') {
                        statics = members[name];
                    } else if (name == 'inheritableStatics') {
                        me.addInheritableStatics(members[name]);
                    } else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--;) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$className && member !== Box.emptyFn && member !== Box.identityFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }

                            if (me.$className) {
                                member.displayName = me.$className + '#' + name;
                            }

                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me;
                members = statics;
            } while (members);

            return this;
        },

        callParent: function (args) {
            var method;
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        },

        callSuper: function (args) {
            var method;
            return (method = this.callSuper.caller) &&
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name]).apply(this, args || noArgs);
        },

        mixin: function (name, mixinClass) {
            var me = this,
                mixin = mixinClass.prototype,
                prototype = me.prototype,
                key, statics, i, ln, staticName,
                mixinValue, hookKey, hookFunction;

            if (typeof mixin.onClassMixedIn != 'undefined') {
                mixin.onClassMixedIn.call(mixinClass, me);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Box.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                mixinValue = mixin[key];
                if (key === 'mixins') {
                    Box.merge(prototype.mixins, mixinValue);
                } else if (key === 'xhooks') {
                    for (hookKey in mixinValue) {
                        hookFunction = mixinValue[hookKey];
                        hookFunction.$previous = Box.emptyFn;

                        if (prototype.hasOwnProperty(hookKey)) {
                            hookFunctionFactory(hookFunction, prototype[hookKey], hookKey, me);
                        } else {
                            prototype[hookKey] = hookFunctionFactory(hookFunction, null, hookKey, me);
                        }
                    }
                } else if (!(key === 'mixinId' || key === 'config') && (prototype[key] === undefined)) {
                    prototype[key] = mixinValue;
                }
            }

            statics = mixin.$inheritableStatics;

            if (statics) {
                for (i = 0, ln = statics.length; i < ln; i++) {
                    staticName = statics[i];

                    if (!me.hasOwnProperty(staticName)) {
                        me[staticName] = mixinClass[staticName];
                    }
                }
            }

            prototype.mixins[name] = mixin;
            return me;
        },

        getName: function () {
            return Box.getClassName(this);
        },

        createAlias: flexSetter(function (alias, origin) {
            this.override(alias, function () {
                return this[origin].apply(this, arguments);
            });
        }),

        addXtype: function (xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Box.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Box.ClassManager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({

        isInstance: true,

        $className: 'Box.Base',

        statics: function () {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        callParent: function (args) {

            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            if (!superMethod) {
                method = this.callParent.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callParent() was called but there's no such method (" + methodName +
                        ") found in the parent class (" + (Box.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        callSuper: function (args) {

            var method,
                superMethod = (method = this.callSuper.caller) &&
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]);

            if (!superMethod) {
                method = this.callSuper.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callSuper() was called but there's no such method (" + methodName +
                        ") found in the parent class (" + (Box.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        self: Base,

        constructor: function () {
            return this;
        },

        destroy: function () {
            this.destroy = Box.emptyFn;
        }
    });

    Base.prototype.callOverridden = Base.prototype.callParent;

    Box.Base = Base;

}(Box.Function.flexSetter));

// class
(function () {

    var BoxClass,
        Base = Box.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    function Ctor(className) {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }

        if (className) {
            constructor.displayName = className;
        }
        return constructor;
    }

    Box.Class = BoxClass = function (Class, properties, fn) {
        if (typeof Class != 'function') {
            fn = properties;
            properties = Class;
            Class = null;
        }
        properties = properties || {};
        Class = BoxClass.create(Class, properties);
        BoxClass.process(Class, properties, fn);
        return Class;
    };

    Box.apply(BoxClass, {

        onBeforeCreated: function (Class, properties, hooks) {
            properties.$configs = {};
            Class.addMembers(properties);
            hooks.onCreated.call(Class, Class);
        },

        process: function (Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || BoxClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty;

            delete data.preprocessors;

            for (i = 0, ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    } else if (preprocessorsProperties) {
                        for (j = 0, subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Box.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Class, data, hooks);
        },

        doProcess: function (Class, data, hooks) {
            var me = this,
                preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift(),
                doProcess = me.doProcess;

            for (; preprocessor; preprocessor = preprocessors.shift()) {
                if (preprocessor.call(me, Class, data, hooks, doProcess) === false) {
                    return;
                }
            }
            hooks.onBeforeCreated.apply(me, arguments);
        },

        create: function (Class, properties) {
            var name, i;
            Class = Class || Ctor(properties.$className);
            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }
            return Class;
        },

        preprocessors: {},

        registerPreprocessor: function (name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }
            if (!properties) {
                properties = [name];
            }
            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };
            this.setDefaultPreprocessorPosition(name, position, relativeTo);
            return this;
        },

        getPreprocessor: function (name) {
            return this.preprocessors[name];
        },

        getPreprocessors: function () {
            return this.preprocessors;
        },

        defaultPreprocessors: [],

        getDefaultPreprocessors: function () {
            return this.defaultPreprocessors;
        },

        setDefaultPreprocessors: function (preprocessors) {
            this.defaultPreprocessors = Box.Array.from(preprocessors);
            return this;
        },

        setDefaultPreprocessorPosition: function (name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPreprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }

            index = Box.Array.indexOf(defaultPreprocessors, relativeName);
            if (index !== -1) {
                Box.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

        configNameCache: {},

        getConfigNameMap: function (name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
                map = cache[name] = {
                    internal: name,
                    initialized: '_is' + capitalizedName + 'Initialized',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    set: 'set' + capitalizedName,
                    get: 'get' + capitalizedName
                };
            }
            return map;
        }

    });

    Box.Class.registerPreprocessor('extend', function (Class, properties, hooks) {
        var Base = Box.Base,
            basePrototype = Base.prototype,
            extend = properties.extend,
            Parent, parentPrototype, i;

        delete properties.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        } else {
            Parent = Base;
        }
        parentPrototype = Parent.prototype;

        if (!Parent.$isClass) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Class.extend(Parent);
        Class.triggerExtended.apply(Class, arguments);

        if (properties.onClassExtended) {
            Class.onExtended(properties.onClassExtended, Class);
            delete properties.onClassExtended;
        }

    }, true);

    Box.Class.registerPreprocessor('statics', function (Class, properties, hooks) {
        Class.addStatics(properties.statics);
        delete properties.statics;
    });
    //指定的某个类的分支,会自动在后缀加上机构代码
    Box.Class.registerPreprocessor('branch', function (Class, properties, hooks) {
        var branch = properties.branch;
        var branchClass;
        var branchName;
        var appcode = window.TempAppCode || HY.Context.ClientCode;//TempAppCode在menumap用到
        //alert(window.TempAppCode);
        if (appcode == 'Main') {//代表主干版本,menumap用到
            return;
        }

        //现在branch支持多种类型,是为了兼容之前的代码,后面会逐步去掉,只需要支持branch.constructor == Object
        if (branch.constructor == Object) {
            for (var prop in branch) {
                if (prop == appcode) {
                    // branchName = properties.$className + '_' + (appcode);
                    branchName = Box.String.insert(properties.$className, '.' + appcode, Box.app.Application.name.length)
                    try {
                        branchClass = Box.requireSync(branchName);
                    } catch (e) {
                        return;
                    }
                    break;
                }
            }
        } else if (branch instanceof Array) {//如果是配置的数组,

            if (Box.Array.contains(branch, appcode)) {
                branchName = properties.$className + '_' + (appcode);
                try {
                    branchClass = Box.requireSync(branchName);
                } catch (e) {
                    return;
                }
            } else {
                return;
            }
        } else if (branch === true) { //如果branch设置为true,就默认使用类本身的名字,并且加入机构代码后缀
            branchName = properties.$className + '_' + (appcode);//TempAppCode 菜单管理临时预览页面用(慎用,不完善)
            try {
                branchClass = Box.requireSync(branchName);
            } catch (e) {
                return;
            }

        } else if (typeof branch == 'function') { //如果branch设置为string,会自动获取到相应的类
            branchClass = branch;
        } else {
            return;
        }

        if (!branchClass) {
            return;
        }

        //只有分支上面不一样的方法、属性，才覆盖
        Box.Function.before(hooks, 'onCreated', function () {
            for (var branchPrototype in branchClass.prototype) {
                if (branchPrototype != 'self' && branchPrototype != 'superclass' && branchPrototype != '$className'
                    && branchPrototype != '$configs' && branchPrototype != 'isInstance' && branchPrototype != 'statics'
                    && branchPrototype != 'callParent' && branchPrototype != 'callSuper' && branchPrototype != 'destroy'
                    && branchPrototype != 'callOverridden') {
                    Class.prototype[branchPrototype] = branchClass.prototype[branchPrototype];
                }

            }
        });

    });

    Box.Class.registerPreprocessor('inheritableStatics', function (Class, properties, hooks) {
        Class.addInheritableStatics(properties.inheritableStatics);
        delete properties.inheritableStatics;
    });

    Box.Class.registerPreprocessor('config', function (Class, properties) {
        var config = properties.config,
            prototype = Class.prototype;

        delete properties.config;

        Box.Object.each(config, function (name, value) {
            var nameMap = Box.Class.getConfigNameMap(name),
                internalName = nameMap.internal,
                initializedName = nameMap.initialized,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setName = nameMap.set,
                getName = nameMap.get;

            var hasOwnSetter = (setName in prototype) || properties.hasOwnProperty(setName),
                hasOwnApplier = (applyName in prototype) || properties.hasOwnProperty(applyName),
                hasOwnUpdater = (updateName in prototype) || properties.hasOwnProperty(updateName);

            var optimizedGetter, customGetter;

            if (value === null || (!hasOwnSetter && !hasOwnApplier && !hasOwnUpdater)) {
                prototype[internalName] = value;
                prototype[initializedName] = true;
            } else {
                prototype[initializedName] = false;
            }

            if (!hasOwnSetter) {
                properties[setName] = function (value, unupdate) {
                    var oldValue = this[internalName],
                        applier = this[applyName],
                        updater = this[updateName];

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                    }
                    if (applier) {
                        value = applier.call(this, value, oldValue);
                    }
                    if (typeof value != 'undefined' && !unupdate) {
                        this[internalName] = value;
                        if (updater && value !== oldValue) {
                            updater.call(this, value, oldValue);
                        }
                    }

                    return this;
                }
            }

            if (!(getName in prototype) || properties.hasOwnProperty(getName)) {
                customGetter = properties[getName] || false;

                if (customGetter) {
                    optimizedGetter = function () {
                        return customGetter.apply(this, arguments);
                    };
                } else {
                    optimizedGetter = function () {
                        return this[internalName];
                    };
                }

                properties[getName] = function () {
                    var currentGetter;

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                        this[setName](this.config[name], true);
                    }

                    currentGetter = this[getName];

                    if ('$previous' in currentGetter) {
                        currentGetter.$previous = optimizedGetter;
                    } else {
                        this[getName] = optimizedGetter;
                    }

                    return optimizedGetter.apply(this, arguments);
                };
            }

        });

    });

    Box.Class.registerPreprocessor('mixins', function (Class, properties, hooks) {
        var mixins = properties.mixins,
            name, mixin, i, len;

        delete properties.mixins;

        Box.Function.before(hooks, 'onCreated', function () {
            if (mixins instanceof Array) {
                for (i = 0, len = mixins.length; i < len; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;
                    Class.mixin(name, mixin);
                }
            } else {
                for (var mixinName in mixins) {
                    if (mixins.hasOwnProperty(mixinName)) {
                        Class.mixin(mixinName, mixins[mixinName]);
                    }
                }
            }
        });
    });

    Box.extend = function (Class, Parent, members) {
        if (arguments.length === 2 && Box.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }
        var cls;
        if (!Parent) {
            throw new Error("[Box.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = ['extend', 'statics', 'inheritableStatics', 'mixins'];

        if (Class) {
            cls = new BoxClass(Class, members);
            cls.prototype.constructor = Class;
        } else {
            cls = new BoxClass(members);
        }

        cls.prototype.override = function (o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };
        return cls;
    };

})();
(function (Class, alias, arraySlice, arrayFrom, global) {

    function makeCtor() {
        function constructor() {
            return this.constructor.apply(this, arguments) || null;
        }

        return constructor;
    }

    var Manager = Box.ClassManager = {

        classes: {},

        existCache: {},

        fileCache: {},

        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {}
        },

        namespaceRewrites: [{
            from: 'Box.',
            to: Box
        }],

        enableNamespaceParseCache: true,

        namespaceParseCache: {},

        instantiators: [],

        isCreated: function (className) {
            var existCache = this.existCache,
                i, ln, part, root, parts;

            if (typeof className != 'string' || className.length < 1) {
                throw new Error("[Box.ClassManager] Invalid classname, must be a string and must not be empty");
            }

            if (Box.String.has(className, '!')) {
                return this.fileCache[className] !== undefined;
            }

            if (this.classes[className] || existCache[className]) {
                return true;
            }
            root = global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];
                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }
                    root = root[part];
                }
            }
            existCache[className] = true;
            this.triggerCreated(className);
            return true;
        },

        createdListeners: [],

        nameCreatedListeners: {},

        triggerCreated: function (className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                alternateNames = this.maps.nameToAlternates[className],
                names = [className],
                i, ln, j, subLn, listener, name;

            for (i = 0, ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            if (alternateNames) {
                names.push.apply(names, alternateNames);
            }

            for (i = 0, ln = names.length; i < ln; i++) {
                name = names[i];
                listeners = nameListeners[name];

                if (listeners) {
                    for (j = 0, subLn = listeners.length; j < subLn; j++) {
                        listener = listeners[j];
                        listener.fn.call(listener.scope, name);
                    }
                    delete nameListeners[name];
                }
            }
        },

        onCreated: function (fn, scope, className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        parseNamespace: function (namespace) {
            if (typeof namespace != 'string') {
                throw new Error("[Box.ClassManager] Invalid namespace, must be a string");
            }

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        setNamespace: function (name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        createNamespaces: function () {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        set: function (name, value) {
            if (Box.String.has(name, '!')) {
                this.fileCache[name] = value;
                return this;
            }
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        get: function (name) {
            var classes = this.classes,
                root,
                parts,
                part, i, ln;

            if (Box.String.has(name, '!')) {
                return this.fileCache[name];
            }
            if (classes[name]) {
                return classes[name];
            }

            root = global;
            parts = this.parseNamespace(name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
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

        setAlias: function (cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (typeof cls == 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {
                if (aliasToNameMap[alias] && Box.isDefined(global.console)) {
                    global.console.log("[Box.ClassManager] Overriding existing alias: '" + alias + "' " +
                        "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Box.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        addNameAliasMappings: function (aliases) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className, aliasList, alias, i;

            for (className in aliases) {
                aliasList = nameToAliasesMap[className] ||
                    (nameToAliasesMap[className] = []);

                for (i = 0; i < aliases[className].length; i++) {
                    alias = aliases[className][i];
                    if (!aliasToNameMap[alias]) {
                        aliasToNameMap[alias] = className;
                        aliasList.push(alias);
                    }
                }

            }
            return this;
        },

        addNameAlternateMappings: function (alternates) {
            var alternateToName = this.maps.alternateToName,
                nameToAlternates = this.maps.nameToAlternates,
                className, aliasList, alternate, i;

            for (className in alternates) {
                aliasList = nameToAlternates[className] ||
                    (nameToAlternates[className] = []);

                for (i = 0; i < alternates[className].length; i++) {
                    alternate = alternates[className][i];
                    if (!alternateToName[alternate]) {
                        alternateToName[alternate] = className;
                        aliasList.push(alternate);
                    }
                }

            }
            return this;
        },

        getByAlias: function (alias) {
            return this.get(this.getNameByAlias(alias));
        },

        getNameByAlias: function (alias) {
            return this.maps.aliasToName[alias] || '';
        },

        getNameByAlternate: function (alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        getAliasesByName: function (name) {
            return this.maps.nameToAliases[name] || [];
        },

        getName: function (object) {
            return object && object.$className || '';
        },

        getClass: function (object) {
            return object && object.self || null;
        },

        create: function (className, data, createdFn) {
            if (className != null && typeof className != 'string') {
                throw new Error("[Box.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }

            var ctor = makeCtor();
            if (typeof data == 'function') {
                data = data(ctor);
            }

            if (className) {
                ctor.displayName = className;
            }

            data.$className = className;

            return new Class(ctor, data, function () {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    postprocessors = [],
                    postprocessor, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0, ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0, subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                data.postprocessors = postprocessors;
                data.createdFn = createdFn;
                Manager.processCreate(className, this, data);
            });
        },

        processCreate: function (className, cls, clsData) {
            var me = this,
                postprocessor = clsData.postprocessors.shift(),
                createdFn = clsData.createdFn;

            if (!postprocessor) {

                if (className) {
                    me.set(className, cls);
                }

                if (createdFn) {
                    createdFn.call(cls, cls);
                }

                if (className) {
                    me.triggerCreated(className);
                }
                return;
            }

            if (postprocessor.call(me, className, cls, clsData, me.processCreate) !== false) {
                me.processCreate(className, cls, clsData);
            }
        },

        createOverride: function (className, data, createdFn) {
            var me = this,
                overriddenClassName = data.override,
                requires = data.requires,
                uses = data.uses,
                classReady = function () {
                    var cls, temp;

                    if (requires) {
                        temp = requires;
                        requires = null;
                        Box.Loader.require(temp, classReady);
                    } else {

                        cls = me.get(overriddenClassName);

                        delete data.override;
                        delete data.requires;
                        delete data.uses;

                        Box.override(cls, data);

                        me.triggerCreated(className);

                        if (uses) {
                            Box.Loader.addUsedClasses(uses);
                        }

                        if (createdFn) {
                            createdFn.call(cls);
                        }
                    }
                };

            me.existCache[className] = true;

            me.onCreated(classReady, me, overriddenClassName);

            return me;
        },

        instantiateByAlias: function () {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];

                if (!className) {
                    throw new Error("[Box.createByAlias] Cannot create an instance of unrecognized alias: " + alias);
                }
                if (global.console) {
                    /*global.console.warn("[Box.Loader] Synchronously loading '" + className + "'; consider adding " +
                    "Box.require('" + alias + "') above Box.onReady");*/
                }
                Box.requireSync(className);
            }

            args[0] = className;

            return this.instantiate.apply(this, args);
        },

        instantiate: function () {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (nameType != 'function') {
                if (nameType != 'string' && args.length === 0) {
                    args = [name];
                    name = name.xclass;
                }
                if (typeof name != 'string' || name.length < 1) {
                    throw new Error("[Box.create] Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                cls = this.get(name);
            }
            else {
                cls = name;
            }

            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            if (!cls) {
                if (global.console) {
                    /*global.console.warn("[Box.Loader] Synchronously loading '" + name + "'; consider adding " +
                    "Box.require('" + ((possibleName) ? alias : name) + "') above Box.onReady");*/
                }
                Box.requireSync(name);

                cls = this.get(name);
            }

            if (!cls) {
                throw new Error("[Box.create] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (typeof cls != 'function') {
                throw new Error("[Box.create] '" + name + "' is a singleton and cannot be instantiated");
            }

            return this.getInstantiator(args.length)(cls, args);
        },

        dynInstantiate: function (name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        getInstantiator: function (length) {
            var instantiators = this.instantiators,
                instantiator,
                i,
                args;

            instantiator = instantiators[length];

            if (!instantiator) {
                i = length;
                args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
                instantiator.displayName = "Box.ClassManager.instantiate" + length;
            }

            return instantiator;
        },

        postprocessors: {},

        defaultPostprocessors: [],

        registerPostprocessor: function (name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }
            if (!properties) {
                properties = [name];
            }
            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };
            this.setDefaultPostprocessorPosition(name, position, relativeTo);
            return this;
        },

        setDefaultPostprocessors: function (postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);
            return this;
        },

        setDefaultPostprocessorPosition: function (name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);
                    return this;
                } else if (offset === 'last') {
                    defaultPostprocessors.push(name);
                    return this;
                }
                offset = (offset === 'after') ? 1 : -1;
            }

            index = Box.Array.indexOf(defaultPostprocessors, relativeName);
            if (index !== -1) {
                Box.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }
            return this;
        },

        getNamesByExpression: function (expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;

            if (typeof expression != 'string' || expression.length < 1) {
                throw new Error("[Box.ClassManager.getNamesByExpression] Expression " + expression + " is invalid, must be a non-empty string");
            }

            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        } else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];
                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }

    };

    Manager.registerPostprocessor('alias', function (name, cls, properties) {
        var aliases = properties.alias,
            i, len;

        for (i = 0, len = aliases.length; i < len; i++) {
            alias = aliases[i];
            this.setAlias(cls, alias);
        }
    }, ['xtype', 'alias']);

    Manager.registerPostprocessor('singleton', function (name, cls, properties, fn) {
        if (properties.singleton) {
            fn.call(this, name, (cls = new cls()), properties);
        } else {
            return true;
        }
        return false;
    });

    Manager.registerPostprocessor('alternateClassName', function (name, cls, properties) {
        var alternates = properties.alternateClassName, i, len, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }
        for (i = 0, len = alternates.length; i < len; i++) {
            alternate = alternates[i];
            if (typeof alternate != 'string') {
                throw new Error("[Box.define] Invalid alternate of: '" + alternate + "' for class: '" + name + "'; must be a valid string");
            }
            this.set(alternate, cls);
        }
    });

    Box.apply(Box, {

        create: alias(Manager, 'instantiate'),

        createByAlias: alias(Manager, 'instantiateByAlias'),

        define: function (className, data, createdFn) {
            if (!Box.String.startsWith(className, 'Box.')) {
                var appName = Box.app.Application.name + ".";
                if (!Box.String.startsWith(className, appName)) {
                    Box.Error('the module name [' + className + '] is error, ' +
                        'module name must start with [' + appName + ']');
                }
            }
            if (data.override) {
                return Manager.createOverride.apply(Manager, arguments);
            }
            return Manager.create.apply(Manager, arguments);
        },

        getClassName: alias(Manager, 'getName'),

        getDisplayName: function (object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Box.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        getClass: alias(Manager, 'getClass')
    });

    Class.registerPreprocessor('className', function (cls, properties) {
        if (properties.$className) {
            cls.$className = properties.$className;
            cls.displayName = cls.$className;
        }
    }, true, 'first');

})(Box.Class, Box.Function.alias, Array.prototype.slice, Box.Array.from, Box.global);
Box.Loader = new function () {

    var Loader = this,
        Manager = Box.ClassManager,
        Class = Box.Class,
        flexSetter = Box.Function.flexSetter,
        alias = Box.Function.alias,
        pass = Box.Function.pass,
        defer = Box.Function.defer,
        arrayErase = Box.Array.erase,

        isNonBrowser = typeof window == 'undefined',
        isNodeJS = isNonBrowser && (typeof require == 'function'),
        isJsdb = isNonBrowser && typeof system != 'undefined' && system.program.search(/jsdb/) !== -1,
        isPhantomJS = (typeof phantom != 'undefined' && phantom.fs),

        dependencyProperties = ['extend', 'mixins', 'requires'],
        isInHistory = {},
        history = [],
        slashDotSlashRe = /\/\.\//g,
        dotRe = /\./g,
        setPathCount = 0;

    Box.apply(Loader, {

        isInHistory: isInHistory,

        history: history,

        namespaces: {},

        collectNamespaces: function (paths) {
            var namespaces = Loader.namespaces,
                path;

            for (path in paths) {
                if (paths.hasOwnProperty(path)) {
                    namespaces[path] = true;
                }
            }
        },

        addNamespaces: function (ns) {
            var namespaces = Loader.namespaces,
                i, l;

            if (!Box.isArray(ns)) {
                ns = [ns];
            }

            for (i = 0, l = ns.length; i < l; i++) {
                namespaces[ns[i]] = true;
            }
        },

        clearNamespaces: function () {
            Loader.namespaces = {};
        },

        getNamespace: function (className) {
            var namespaces = Loader.namespaces,
                deepestPrefix = '',
                prefix;

            for (prefix in namespaces) {
                if (namespaces.hasOwnProperty(prefix) &&
                    prefix.length > deepestPrefix.length &&
                    (prefix + '.' === className.substring(0, prefix.length + 1))) {
                    deepestPrefix = prefix;
                }
            }

            return deepestPrefix === '' ? undefined : deepestPrefix;
        },

        config: {

            enabled: false,

            scriptChainDelay: false,

            disableCaching: true,

            disableCachingParam: '_v',

            garbageCollect: false,

            paths: {
                'Box': '.'
            },

            preserveScripts: true,

            scriptCharset: undefined

        },

        setConfig: function (name, value) {
            if (Box.isObject(name) && arguments.length === 1) {
                Box.merge(Loader.config, name);
                if ('paths' in name) {
                    Loader.collectNamespaces(name.paths);
                }
            } else {
                Loader.config[name] = (Box.isObject(value)) ? Box.merge(Loader.config[name], value) : value;
                if (name === 'paths') {
                    Loader.collectNamespaces(value);
                }
            }
            return Loader;
        },

        getConfig: function (name) {
            if (name) {
                return Loader.config[name];
            }
            return Loader.config;
        },

        addClassPathMappings: function (paths) {
            var name;
            if (setPathCount == 0) {
                Loader.config.paths = paths;
            } else {
                for (name in paths) {
                    Loader.config.paths[name] = paths[name];
                }
            }
            setPathCount++;
            return Loader;
        },

        setPath: flexSetter(function (name, path) {
            Loader.config.paths[name] = path;
            Loader.namespaces[name] = true;
            setPathCount++;
            return Loader;
        }),

        getPath: function (className) {
            var path = '',
                paths = Loader.config.paths,
                prefix = Loader.getPrefix(className);

            if (prefix.length > 0) {
                if (prefix === className) {
                    return paths[prefix];
                }
                path = paths[prefix];
                className = className.substring(prefix.length + 1);
            }
            if (path.length > 0) {
                path += '/';
            }

            return path.replace(slashDotSlashRe, '/') + className.replace(dotRe, '/') + '.js';
        },

        getPrefix: function (className) {
            var paths = Loader.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return className;
            }
            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }
            return deepestPrefix;
        },

        isAClassNameWithAKnownPrefix: function (className) {
            var prefix = Loader.getPrefix(className);
            return prefix !== '' && prefix !== className;
        },

        require: function (expressions, fn, scope, excludes) {
            fn && fn.call(scope);
        },

        requireSync: function () {
        },

        exclude: function (excludes) {
            return {
                require: function (expressions, fn, scope, excludes) {
                    return Loader.require(expressions, fn, scope, excludes);
                },
                requireSync: function (expressions, fn, scope, excludes) {
                    return Loader.requireSync(expressions, fn, scope, excludes);
                }
            }
        },

        onReady: function (fn, scope, withDomReady) {
            var oldFn;
            if (withDomReady !== false && Box.DOM_QUERY) {
                oldFn = fn;
                fn = function () {
                    Box.DOM_QUERY(document).ready(Box.bind(oldFn, scope))
                }
            }
            fn.call(scope);
        }
    });

    var queue = [],
        isClassFileLoaded = {},
        isFileLoaded = {},
        classNameToFilePathMap = {},
        scriptElements = {},
        readyListeners = [],
        usedClasses = [],
        requiresMap = {},
        requireTypeParses = {},
        comparePriority = function (listenerA, listenerB) {
            return listenerB.priority - listenerA.priority;
        };

    Box.apply(Loader, {

        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        isLoading: false,

        queue: queue,

        isClassFileLoaded: isClassFileLoaded,

        readyListeners: readyListeners,

        optionalRequires: usedClasses,

        requiresMap: requiresMap,

        numPendingFiles: 0,

        numLoadedFiles: 0,

        hasFileLoadError: false,

        classNameToFilePathMap: classNameToFilePathMap,

        scriptsLoading: 0,

        syncModeEnabled: false,

        scriptElements: scriptElements,

        refreshQueue: function () {
            var ln = queue.length,
                i, item, j, requires;

            if (!ln && !Loader.scriptsLoading) {
                return Loader.triggerReady();
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;
                    if (requires.length > Loader.numLoadedFiles) {
                        continue;
                    }

                    for (j = 0; j < requires.length;) {
                        if (Manager.isCreated(requires[j])) {
                            item.objects = item.objects || [];
                            item.objects.push(Manager.get(requires[j]));
                            arrayErase(requires, j, 1);
                        } else {
                            j++;
                        }
                    }

                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.apply(item.scope, item.objects || []);
                        Loader.refreshQueue();
                        break;
                    }
                }
            }

            return Loader;
        },

        injectScriptElement: function (url, onLoad, onError, scope, charset) {
            var script = document.createElement('script'),
                dispatched = false,
                config = Loader.config,
                onLoadFn = function () {
                    if (!dispatched) {
                        dispatched = true;
                        script.onload = script.onreadystatechange = script.onerror = null;
                        if (typeof config.scriptChainDelay == 'number') {
                            defer(onLoad, config.scriptChainDelay, scope);
                        } else {
                            onLoad.call(scope);
                        }
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }

                },
                onErrorFn = function (arg) {
                    defer(onError, 1, scope);
                    Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                };

            script.type = 'text/javascript';
            script.onerror = onErrorFn;
            charset = charset || config.scriptCharset;
            if (charset) {
                script.charset = charset;
            }

            if ('addEventListener' in script) {
                script.onload = onLoadFn;
            } else if ('readyState' in script) {
                script.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        onLoadFn();
                    }
                };
            } else {
                script.onload = onLoadFn;
            }

            script.src = url;
            (Loader.documentHead || document.getElementsByTagName('head')[0]).appendChild(script);
            return script;
        },

        removeScriptElement: function (url) {
            if (scriptElements[url]) {
                Loader.cleanupScriptElement(scriptElements[url], true, !!Loader.getConfig('garbageCollect'));
                delete scriptElements[url];
            }

            return Loader;
        },

        cleanupScriptElement: function (script, remove, collect) {
            var prop;
            script.onload = script.onreadystatechange = script.onerror = null;
            if (remove) {
                Box.DOM_QUERY(script).remove();
                if (collect) {
                    for (prop in script) {
                        try {
                            if (prop != 'src') {
                                script[prop] = null;
                            }
                            delete script[prop];
                        } catch (cleanEx) {
                        }
                    }
                }
            }
            return Loader;
        },

        loadScript: function (options) {
            var config = Loader.getConfig(),
                isString = typeof options == 'string',
                url = isString ? options : options.url,
                onError = !isString && options.onError,
                onLoad = !isString && options.onLoad,
                scope = !isString && options.scope,
                src;

            var onScriptError = function () {
                Loader.numPendingFiles--;
                Loader.scriptsLoading--;

                if (onError) {
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists");
                }

                if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                    Loader.refreshQueue();
                }
            };
            var onScriptLoad = function () {
                Loader.numPendingFiles--;
                Loader.scriptsLoading--;

                if (onLoad) {
                    onLoad.call(scope);
                }

                if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                    Loader.refreshQueue();
                }
            };

            Loader.isLoading = true;
            Loader.numPendingFiles++;
            Loader.scriptsLoading++;

            src = config.disableCaching ?
                (url + '?' + config.disableCachingParam + '=' + Box.AppVersion.Version()) : url;

            scriptElements[url] = Loader.injectScriptElement(src, onScriptLoad, onScriptError);
        },

        //参考资料:http://blog.csdn.net/szwandcj/article/details/50212209
        loadScriptFile: function (url, onLoad, onError, scope, synchronous) {
            if (isFileLoaded[url]) {
                return Loader;
            }

            var config = Loader.getConfig(),
                noCacheUrl = url + (config.disableCaching ? ('?' + config.disableCachingParam + '=' + Box.AppVersion.Version()) : ''),
                isCrossOriginRestricted = false,
                xhr, status, onScriptError,
                debugSourceURL = "";

            scope = scope || Loader;

            Loader.isLoading = true;

            if (!synchronous) {
                onScriptError = function () {
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists", synchronous);
                };

                scriptElements[url] = Loader.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
            } else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                } catch (e) {
                    isCrossOriginRestricted = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && ((self.location || {}).protocol == 'file:' || (self.location || {}).protocol == 'ionp:')) ? 200 : xhr.status;

                isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

                if (isCrossOriginRestricted && !isPhantomJS) {
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                        "being loaded from a different domain or from the local file system whereby cross origin " +
                        "requests are not allowed due to security reasons. Use asynchronous loading with " +
                        "Box.require instead.", synchronous);
                }
                else if ((status >= 200 && status < 300) || (status === 304) || isPhantomJS) {
                    if (!Box.browser.is.IE) {
                        debugSourceURL = "\n//@ sourceURL=" + url;
                    }
                    Box.globalEval(xhr.responseText + debugSourceURL);
                    onLoad.call(scope);
                }
                else {
                    onError.call(Loader, "Failed loading synchronously via XHR: '" + url + "'; please " +
                        "verify that the file exists. " +
                        "XHR status code: " + status, synchronous);
                }

                xhr = null;
            }
        },

        requireSync: function () {
            var syncModeEnabled = Loader.syncModeEnabled;
            if (!syncModeEnabled) {
                Loader.syncModeEnabled = true;
            }
            var ret = Loader.require.apply(Loader, arguments);
            if (!syncModeEnabled) {
                Loader.syncModeEnabled = false;
            }
            Loader.refreshQueue();
            return ret;
        },

        require: function (expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                excludedClassNames = [],
                possibleClassNames = [],
                classNames = [],
                references = [],
                existClassNames = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, className,
                possibleClassName, i, j, ln, subLn;

            if (excludes) {
                excludes = (typeof excludes === 'string') ? [excludes] : excludes;
                for (i = 0, ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];
                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedClassNames = Manager.getNamesByExpression(exclude);
                        for (j = 0, subLn = excludedClassNames.length; j < subLn; j++) {
                            excluded[excludedClassNames[j]] = true;
                        }
                    }
                }
            }

            expressions = (typeof expressions === 'string') ? [expressions] : (expressions ? expressions : []);

            if (fn) {
                callback = function () {
                    var classes = [], i, ln;
                    for (i = 0, ln = references.length; i < ln; i++) {
                        classes.push(Manager.get(references[i]));
                    }
                    return fn.apply(this, classes);
                };
            } else {
                callback = Box.emptyFn;
            }

            scope = scope || Box.global;

            for (i = 0, ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);
                    subLn = possibleClassNames.length;

                    for (j = 0; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (excluded[possibleClassName] !== true) {
                            references.push(possibleClassName);

                            if (!Manager.isCreated(possibleClassName) && !included[possibleClassName]) {
                                included[possibleClassName] = true;
                                classNames.push(possibleClassName);
                            }
                        }
                    }
                }
            }

            if (classNames.length > 0) {
                if (!Loader.config.enabled) {
                    throw new Error("Box.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                        "Missing required class" + ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
                }
            } else {
                callback.call(scope);
                if (references.length == 1) {
                    return Manager.get(references[0]);
                }
                return Loader;
            }

            syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: classNames.slice(),
                    callback: callback,
                    scope: scope
                });
            }

            ln = classNames.length;

            for (i = 0; i < ln; i++) {
                className = classNames[i];
                var loader = Loader.resolve(className);
                loader.exec(className);
            }

            if (syncModeEnabled) {
                callback.call(scope);
                if (ln === 1) {
                    return Manager.get(className);
                }
            }
            return Loader;
        },

        resolve: function (className) {
            var type = 'js';
            if (Box.String.has(className, '!')) {
                type = className.split('!')[0];
            }
            return {
                type: type,
                exec: requireTypeParses[type]
            };
        },

        onFileLoaded: function (className, filePath) {
            var loaded = isClassFileLoaded[className];
            Loader.numLoadedFiles++;

            isClassFileLoaded[className] = true;
            isFileLoaded[filePath] = true;

            if (!loaded) {
                Loader.numPendingFiles--;
            }

            if (Loader.numPendingFiles === 0) {
                Loader.refreshQueue();
            }

            if (!Loader.syncModeEnabled && Loader.numPendingFiles === 0 && Loader.isLoading && !Loader.hasFileLoadError) {
                var missingClasses = [],
                    missingPaths = [],
                    requires,
                    i, ln, j, subLn;

                for (i = 0, ln = queue.length; i < ln; i++) {
                    requires = queue[i].requires;

                    for (j = 0, subLn = requires.length; j < subLn; j++) {
                        if (isClassFileLoaded[requires[j]]) {
                            missingClasses.push(requires[j]);
                        }
                    }
                }

                if (missingClasses.length < 1) {
                    return;
                }

                missingClasses = Box.Array.filter(Box.Array.unique(missingClasses), function (item) {
                    return !requiresMap.hasOwnProperty(item);
                }, Loader);

                if (missingClasses.length < 1) {
                    return;
                }

                for (i = 0, ln = missingClasses.length; i < ln; i++) {
                    missingPaths.push(classNameToFilePathMap[missingClasses[i]]);
                }

                throw new Error("The following classes are not declared even if their files have been " +
                    "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                    "corresponding files for possible typos: '" + missingPaths.join("', '"));
            }
        },

        onFileLoadError: function (className, filePath, errorMessage, isSynchronous) {
            Loader.numPendingFiles--;
            Loader.hasFileLoadError = true;
            throw new Error("[Box.Loader] " + errorMessage);
        },

        addUsedClasses: function (classes) {
            var cls, i, ln;
            if (classes) {
                classes = (typeof classes == 'string') ? [classes] : classes;
                for (i = 0, ln = classes.length; i < ln; i++) {
                    cls = classes[i];
                    if (typeof cls == 'string' && !Box.Array.contains(usedClasses, cls)) {
                        usedClasses.push(cls);
                    }
                }
            }
            return Loader;
        },

        registerRequireTypeParse: function (type, exec) {
            requireTypeParses[type] = exec;
        },

        triggerReady: function () {
            var listener,
                refClasses = usedClasses;

            if (Loader.isLoading) {
                Loader.isLoading = false;

                if (refClasses.length !== 0) {
                    refClasses = refClasses.slice();
                    usedClasses.length = 0;
                    Loader.require(refClasses, Loader.triggerReady, Loader);
                    return Loader;
                }
            }

            Box.Array.sort(readyListeners, comparePriority);

            while (readyListeners.length && !Loader.isLoading) {
                listener = readyListeners.shift();
                listener.fn.call(listener.scope);
            }

            return Loader;
        },

        onReady: function (fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Box.DOM_QUERY) {
                oldFn = fn;
                fn = function () {
                    Box.DOM_QUERY(document).ready(Box.bind(oldFn, scope))
                }
            }

            if (!Loader.isLoading) {
                fn.call(scope);
            } else {
                readyListeners.push({
                    fn: fn,
                    scope: scope,
                    priority: (options && options.priority) || 0
                });
            }
        },

        historyPush: function (className) {
            if (className && isClassFileLoaded.hasOwnProperty(className) && !isInHistory[className]) {
                isInHistory[className] = true;
                history.push(className);
            }
            return Loader;
        }

    });

    Box.require = alias(Loader, 'require');

    Box.requireSync = alias(Loader, 'requireSync');

    Box.exclude = alias(Loader, 'exclude');

    Box.onReady = function (fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    Class.registerPreprocessor('loader', function (cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            dependency,
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue,
            requiredMap, requiredDep;

        for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                } else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                } else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }

        var deadlockPath = [],
            detectDeadlock;

        if (className) {
            requiresMap[className] = dependencies;
            requiredMap = Loader.requiredByMap || (Loader.requiredByMap = {});

            for (i = 0, ln = dependencies.length; i < ln; i++) {
                dependency = dependencies[i];
                (requiredMap[dependency] || (requiredMap[dependency] = [])).push(className);
            }
            detectDeadlock = function (cls) {
                deadlockPath.push(cls);

                if (requiresMap[cls]) {
                    if (Box.Array.contains(requiresMap[cls], className)) {
                        throw new Error("Deadlock detected while loading dependencies! '" + className + "' and '" +
                            deadlockPath[1] + "' " + "mutually require each other. Path: " +
                            deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                    }

                    for (i = 0, ln = requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }

        Loader.require(dependencies, function () {
            for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }
            continueFn.call(me, cls, data, hooks);
        });
        return false;
    }, true, 'after', 'className');

    Manager.registerPostprocessor('uses', function (name, cls, data) {
        var uses = data.uses;
        if (uses) {
            Loader.addUsedClasses(uses);
        }
    });

    Manager.onCreated(Loader.historyPush);
};

Box.Loader.setConfig({
    enabled: true,
    disableCaching: (/[?&](?:cache|disableCacheBuster)\b/i.test(location.search) || /(^|[ ;])ext-cache=1/.test(document.cookie)) ? false : true,
    paths: {
        'Box': 'src'
    }
});

(function () {

    var Loader = Box.Loader;
    var pass = Box.Function.pass;
    var isClassFileLoaded = Loader.isClassFileLoaded;
    var classNameToFilePathMap = Loader.classNameToFilePathMap;

    function httpRequest(url, callback) {
        var xhr = Box.global.XMLHttpRequest ?
            new Box.global.XMLHttpRequest() :
            new Box.global.ActiveXObject("Microsoft.XMLHTTP");

        Loader.numPendingFiles++;

        var argname = "_v";
        while (Box.String.has(url, "?" + argname + "=") || Box.String.has(url, "&" + argname + "=")) {
            argname = argname + "_";
        }
        url += (Box.String.has(url, "?") ? "&" : "?") + argname + "=" + Box.AppVersion.Version();


        xhr.open("GET", url, false);
        xhr.send(null);

        var status = (xhr.status === 1223) ? 204 : xhr.status === 0 ? 200 : xhr.status;
        callback(xhr.responseText);
        Loader.numLoadedFiles++;
        Loader.numPendingFiles--;
        if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
            Loader.refreshQueue();
        }
    }

    function jsEscape(content) {
        return content.replace(/(["\\])/g, "\\$1")
            .replace(/[\f]/g, "\\f")
            .replace(/[\b]/g, "\\b")
            .replace(/[\n]/g, "\\n")
            .replace(/[\t]/g, "\\t")
            .replace(/[\r]/g, "\\r")
            .replace(/[\u2028]/g, "\\u2028")
            .replace(/[\u2029]/g, "\\u2029");
    }

    function loadFileToSet(className, callback) {
        if (!Box.String.has(className, '!')) {
            return;
        }
        var filePath = className.split('!')[1];
        httpRequest(filePath, function (content) {
            Box.ClassManager.set(className, (function () {
                return callback.call(Loader, content);
            })());
        });
    }

    Loader.registerRequireTypeParse('js', function (className) {
        var filePath = Loader.getPath(className);
        var syncModeEnabled = Loader.syncModeEnabled;
        if (syncModeEnabled && isClassFileLoaded.hasOwnProperty(className)) {
            if (!isClassFileLoaded[className]) {
                Loader.numPendingFiles--;
                Loader.removeScriptElement(filePath);
                delete isClassFileLoaded[className];
            }
        }
        if (!isClassFileLoaded.hasOwnProperty(className)) {
            isClassFileLoaded[className] = false;
            classNameToFilePathMap[className] = filePath;

            Loader.numPendingFiles++;
            Loader.loadScriptFile(
                filePath,
                pass(Loader.onFileLoaded, [className, filePath], Loader),
                pass(Loader.onFileLoadError, [className, filePath], Loader),
                Loader,
                syncModeEnabled
            );
        }
    });

    Loader.registerRequireTypeParse('text', function (className) {
        loadFileToSet(className, function (content) {
            return content;
        });
    });

    Loader.registerRequireTypeParse('json', function (className) {
        loadFileToSet(className, function (content) {
            return Box.globalEval('(' + content + ')');
        });
    });

    Loader.registerRequireTypeParse('handlebars', function (className) {
        loadFileToSet(className, function (content) {
            return Handlebars.compile(content);
        });
    });

})();
Box.define('Box.env.Browser', {

    statics: {

        browserNames: {
            ie: 'IE',
            firefox: 'Firefox',
            safari: 'Safari',
            chrome: 'Chrome',
            opera: 'Opera',
            other: 'Other'
        },

        engineNames: {
            webkit: 'WebKit',
            gecko: 'Gecko',
            presto: 'Presto',
            trident: 'Trident',
            other: 'Other'
        },

        enginePrefixes: {
            webkit: 'AppleWebKit/',
            gecko: 'Gecko/',
            presto: 'Presto/',
            trident: 'Trident/'
        },

        browserPrefixes: {
            ie: 'MSIE ',
            firefox: 'Firefox/',
            chrome: 'Chrome/',
            safari: 'Version/',
            opera: 'Opera/'
        }

    },

    isSecure: /^https/i.test(Box.global.location.protocol),

    isStrict: Box.global.document.compatMode === "CSS1Compat",

    name: null,

    engineName: null,

    is: Box.emptyFn,

    constructor: function () {

        var userAgent = this.userAgent = Box.global.navigator.userAgent,
            selfClass = this.statics(),
            browserMatch = userAgent.match(new RegExp('((?:' + Box.Object.getValues(selfClass.browserPrefixes).join(')|(?:') + '))([\\d\\._]+)')),
            engineMatch = userAgent.match(new RegExp('((?:' + Box.Object.getValues(selfClass.enginePrefixes).join(')|(?:') + '))([\\d\\._]+)')),
            browserName = selfClass.browserNames.other,
            browserVersion = '',
            engineName = selfClass.engineNames.other,
            engineVersion = '',
            key, value;

        this.is = function (name) {
            return this.is[name] === true;
        };

        if (browserMatch) {
            browserName = selfClass.browserNames[Box.Object.getKey(selfClass.browserPrefixes, browserMatch[1])];
            browserVersion = browserMatch[2];
        }

        if (engineMatch) {
            engineName = selfClass.engineNames[Box.Object.getKey(selfClass.enginePrefixes, engineMatch[1])];
            engineVersion = engineMatch[2];
        }

        Box.apply(this, {
            name: browserName,
            engineVersion: Box.String.parseVersion(engineVersion),
            engineName: engineName,
            version: Box.String.parseVersion(browserVersion)
        });

        this.is[this.name] = true;
        this.is[this.name + (this.version.major || '')] = true;
        this.is[this.name + this.version.shortVersion] = true;

        for (key in selfClass.browserNames) {
            if (selfClass.browserNames.hasOwnProperty(key)) {
                value = selfClass.browserNames[key];
                this.is[value] = (this.name === value);
            }
        }

        this.is[this.name] = true;
        this.is[this.engineName + (this.engineVersion.major || '')] = true;
        this.is[this.engineName + this.engineVersion.shortVersion] = true;

        for (key in selfClass.engineNames) {
            if (selfClass.engineNames.hasOwnProperty(key)) {
                value = selfClass.engineNames[key];
                this.is[value] = (this.engineName === value);
            }
        }

        return this;
    }

}, function () {

    Box.browser = new Box.env.Browser();

    Box.isStrict = Box.browser.isStrict;

});

Box.define('Box.env.FeatureDetector', {

    statics: {

        tests: {

            Canvas: function () {
                var element = this.getTestElement('canvas');
                return !!(element && element.getContext && element.getContext('2d'));
            },

            SVG: function () {
                var doc = Box.global.document;

                return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
            },

            VML: function () {
                var element = this.getTestElement(),
                    ret = false;

                element.innerHTML = "<!--[if vml]><br/><br/><![endif]-->";
                ret = (element.childNodes.length === 2);
                element.innerHTML = "";

                return ret;
            },

            Touch: function () {
                return ('ontouchstart' in Box.global) && !(Box.platform && Box.platform.name.match(/Windows|MacOSX|Linux/));
            },

            Orientation: function () {
                return ('orientation' in Box.global);
            },

            Geolocation: function () {
                return !!Box.global.navigator.geolocation;
            },

            SqlDatabase: function () {
                return !!Box.global.openDatabase;
            },

            Websockets: function () {
                return 'WebSocket' in Box.global;
            },

            History: function () {
                return !!(Box.global.history && Box.global.history.pushState);
            },

            CSSTransforms: function () {
                return this.isStyleSupported('transform');
            },

            CSS3DTransforms: function () {
                return this.has('csstransforms') && this.isStyleSupported('perspective');
            },

            CSSAnimations: function () {
                return this.isStyleSupported('animationName');
            },

            CSSTransitions: function () {
                return this.isStyleSupported('transitionProperty');
            },

            Audio: function () {
                return !!this.getTestElement('audio').canPlayType;
            },

            Video: function () {
                return !!this.getTestElement('video').canPlayType;
            }

        },

        stylePrefixes: ['Webkit', 'Moz', 'O', 'ms']

    },

    tests: {},

    testElements: {},

    constructor: function () {
        this.registerTests(this.statics().tests, true);
        return this;
    },

    has: function (name) {
        if (!this.hasTest(name)) {
            return false;
        }
        else if (this.has.hasOwnProperty(name)) {
            return this.has[name];
        }
        else {
            return this.getTestResult(name);
        }
    },

    getTestResult: function (name) {
        return !!this.getTest(name).call(this);
    },

    getTestElement: function (tag) {
        if (!tag) {
            tag = 'div';
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = Box.global.document.createElement(tag);
        }

        return this.testElements[tag];
    },

    registerTest: function (name, fn, isDefault) {
        if (this.hasTest(name)) {
            Box.Error({
                className: "Box.env.FeatureDetector",
                methodName: "registerTest",
                error: "Test name " + name + " has already been registered"
            });
        }
        this.tests[name] = fn;
        if (isDefault) {
            this.has[name] = this.getTestResult(name);
        }
        return this;
    },

    registerTests: function (tests, isDefault) {
        var key;
        for (key in tests) {
            if (tests.hasOwnProperty(key)) {
                this.registerTest(key, tests[key], isDefault);
            }
        }
        return this;
    },

    hasTest: function (name) {
        return this.tests.hasOwnProperty(name);
    },

    getTest: function (name) {
        if (!this.hasTest(name)) {
            Box.Error({
                className: "Box.env.FeatureDetector",
                methodName: "getTest",
                error: "Test name " + name + " does not exist"
            });
        }
        return this.tests[name];
    },

    getTests: function () {
        return this.tests;
    },

    isStyleSupported: function (name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Box.String.capitalize(name),
            i = this.statics().stylePrefixes.length;

        if (elementStyle[name] !== undefined) {
            return true;
        }

        while (i--) {
            if (elementStyle[this.statics().stylePrefixes[i] + cName] !== undefined) {
                return true;
            }
        }
        return false;
    },

    isEventSupported: function (name, tag) {
        var element = this.getTestElement(tag),
            eventName = 'on' + name,
            isSupported = false;

        isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';
                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }
                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    }


}, function () {

    Box.features = new Box.env.FeatureDetector();

});

Box.define('Box.dom.Element', function () {

    var doc = document,
        activeElement = null,
        isCSS1 = doc.compatMode == "CSS1Compat";

    if (!('activeElement' in doc) && doc.addEventListener) {
        doc.addEventListener('focus', function (ev) {
            if (ev && ev.target) {
                activeElement = (ev.target == doc) ? null : ev.target;
            }
        }, true);
    }

    function makeSelectionRestoreFn(activeEl, start, end) {
        return function () {
            activeEl.selectionStart = start;
            activeEl.selectionEnd = end;
        };
    }

    function isIE9m() {
        return Box.browser.is.IE6 || Box.browser.is.IE7 || Box.browser.is.IE8 || Box.browser.is.IE9
    }

    return {

        singleton: true,

        get: function (selector, content) {
            return Box.DOM_QUERY(selector, content);
        },

        getDom: function (el) {
            if (Box.isElement(el)) {
                return el;
            }
            if (Box.isString(el)) {
                return Box.DOM_QUERY(el)[0];
            }
            if (el.jquery) {
                return el[0];
            }
            return null;
        },

        defaultUnit: 'px',

        cssRe: /([a-z0-9\-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*)?;?/gi,

        unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,

        borders: {
            l: 'border-left-width',
            r: 'border-right-width',
            t: 'border-top-width',
            b: 'border-bottom-width'
        },

        paddings: {
            l: 'padding-left',
            r: 'padding-right',
            t: 'padding-top',
            b: 'padding-bottom'
        },

        margins: {
            l: 'margin-left',
            r: 'margin-right',
            t: 'margin-top',
            b: 'margin-bottom'
        },

        userAgent: navigator.userAgent.toLowerCase(),

        idSeed: 1000,

        windowId: 'box-window',

        documentId: 'box-document',

        id: function (el, prefix) {
            var sandboxPrefix = "";
            el = this.getDom(el);
            if (el === document) {
                el.id = this.documentId;
            } else if (el === window) {
                el.id = this.windowId;
            }
            el.id = el.id || (sandboxPrefix + (prefix || 'box-gen') + (++Box.idSeed));
            return el.id;
        },

        contains: function (parent, dom) {
            var ret = false;

            parent = this.getDom(parent);
            dom = this.getDom(dom);

            if (!Box.isElement(parent) || !Box.isElement(dom)) {
                return false;
            }

            if (parent === dom) {
                return true;
            }

            if (parent && dom) {
                if (parent.contains) {
                    return parent.contains(dom)
                } else if (parent.compareDocumentPosition) {
                    return !!(parent.compareDocumentPosition(dom) & 16);
                } else {
                    while ((dom = dom.parentNode)) {
                        ret = dom == parent || ret;
                    }
                }
            }
            return ret;
        },

        addUnits: function (size, units) {
            if (typeof size == 'number') {
                return size + (units || this.defaultUnit || 'px');
            }

            if (size === '' || size == 'auto' || size === undefined || size === null) {
                return size || '';
            }

            if (!this.unitRe.test(size)) {
                Box.log('warn', 'Warning, size detected as NaN on Element.addUnits.');
                return size || '';
            }
            return size;
        },

        parseBox: function (box) {
            box = box || 0;
            var type = typeof box,
                parts, len;

            if (type === 'number') {
                return {
                    top: box,
                    right: box,
                    bottom: box,
                    left: box
                }
            } else if (type !== 'string') {
                return box
            }

            parts = box.split(' ');
            len = parts.length;

            if (len == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            } else if (len == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            } else if (len == 3) {
                parts[3] = parts[1];
            }

            return {
                top: parseFloat(parts[0]) || 0,
                right: parseFloat(parts[1]) || 0,
                bottom: parseFloat(parts[2]) || 0,
                left: parseFloat(parts[3]) || 0
            }
        },

        unitizeBox: function (box, units) {
            var parse = this.parseBox(box);
            return this.addUnits(parse.top, units) + ' ' +
                this.addUnits(parse.right, units) + ' ' +
                this.addUnits(parse.bottom, units) + ' ' +
                this.addUnits(parse.left, units);
        },

        parseStyles: function (styles) {
            var out = {},
                cssRe = this.cssRe,
                matches;

            if (styles) {
                cssRe.lastIndex = 0;
                while ((matches = cssRe.exec(styles))) {
                    out[matches[1]] = matches[2] || '';
                }
            }
            return out;
        },

        getActiveElement: function () {
            var active;
            try {
                active = document.activeElement;
            } catch (e) {

            }
            active = active || activeElement;
            if (!active) {
                active = activeElement = document.body;
            }
            return active;
        },

        getViewWidth: function (full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },

        getViewHeight: function (full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },

        getDocumentHeight: function () {
            return Math.max(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },

        getDocumentWidth: function () {
            return Math.max(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },

        getViewportHeight: function () {
            return isIE9m() ?
                (Box.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
                window.innerHeight;
        },

        getViewportWidth: function () {
            return (!Box.isStrict && !Box.browser.is.Opera) ? doc.body.clientWidth :
                isIE9m() ? doc.documentElement.clientWidth : window.innerWidth;
        },

        getViewSize: function (full) {
            return {
                width: this.getViewWidth(full),
                height: this.getViewHeight(full)
            }
        },

        serializeForm: function (form) {
            var fElements = form.elements || (document.forms[form] || this.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                data = '',
                eLen = fElements.length,
                element, name, type, options, hasValue, e,
                o, oLen, opt;

            for (e = 0; e < eLen; e++) {
                element = fElements[e];
                name = element.name;
                type = element.type;
                options = element.options;

                if (!element.disabled && name) {
                    if (/select-(one|multiple)/i.test(type)) {
                        oLen = options.length;
                        for (o = 0; o < oLen; o++) {
                            opt = options[o];
                            if (opt.selected) {
                                hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                                data += Box.String.format("{0}={1}&", encoder(name), encoder(hasValue ? opt.value : opt.text));
                            }
                        }
                    } else if (!(/file|undefined|reset|button/i.test(type))) {
                        if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                            data += encoder(name) + '=' + encoder(element.value) + '&';
                            hasSubmit = /submit/i.test(type);
                        }
                    }
                }
            }
            return data.substr(0, data.length - 1);
        },

        getDoc: (function () {
            var doc;
            return function () {
                return doc || (doc = Box.dom.Element.get(document));
            }
        }()),

        getBody: (function () {
            var body;
            return function () {
                return body || (body = Box.dom.Element.get(document.body));
            }
        }()),

        getHead: (function () {
            var head;
            return function () {
                return head || (head = Box.dom.Element.get(document.getElementsByTagName("head")[0]));
            }
        }()),

        isScrollable: function (el) {
            var dom = Box.getDom(el);
            return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
        },

        getScroll: function (el) {
            var dom = Box.getDom(el),
                doc = document,
                body = doc.body,
                docElement = doc.documentElement,
                left, top;

            if (dom === doc || dom === body) {
                left = docElement.scrollLeft || (body ? body.scrollLeft : 0);
                top = docElement.scrollTop || (body ? body.scrollTop : 0);
            } else {
                left = dom.scrollLeft;
                top = dom.scrollTop;
            }
            return {
                left: left,
                top: top
            }
        },

        getScrollLeft: function (el) {
            var dom = Box.getDom(el), doc = document;
            if (dom === doc || dom === doc.body) {
                return this.getScroll().left;
            } else {
                return dom.scrollLeft;
            }
        },

        getScrollTop: function (el) {
            var dom = Box.getDom(el), doc = document;
            if (dom === doc || dom === doc.body) {
                return this.getScroll().top;
            } else {
                return dom.scrollTop;
            }
        },

        setScrollLeft: function (el, left) {
            var dom = Box.getDom(el);
            dom.scrollLeft = this.normalizeScrollLeft(left);
            return this;
        },

        setScrollTop: function (el, top) {
            var dom = Box.getDom(el);
            dom.scrollTop = top;
            return this;
        },

        normalizeScrollLeft: Box.identityFn

    }

}, function () {

    function apply(src, target, methods) {
        Box.Array.forEach(methods, function (name) {
            src[name] = Box.Function.bind(target[name], Box.Element);
        });
    }

    Box.Element = Box.dom.Element;

    apply(Box, Box.Element, ['id', 'get', 'getDom', 'getDoc', 'getBody', 'getHead']);

});

Box.define('Box.dom.Helper', function () {

    var afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        bbValues = ['BeforeBegin', 'previousSibling'],
        aeValues = ['AfterEnd', 'nextSibling'],
        bb_ae_PositionHash = {
            beforebegin: bbValues,
            afterend: aeValues
        },
        fullPositionHash = {
            beforebegin: bbValues,
            afterend: aeValues,
            afterbegin: ['AfterBegin', 'firstChild'],
            beforeend: ['BeforeEnd', 'lastChild']
        };

    function range() {
        return !!document.createRange;
    }

    function CreateContextualFragment() {
        var range = range() ? document.createRange() : false;
        return range && !!range.createContextualFragment;
    }

    return {

        singleton: true,

        alternateClassName: ['Box.DomHelper', 'Box.dom.DomHelper'],

        emptyTags: /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,

        confRe: /^(?:tag|children|cn|html|tpl|tplData)$/i,

        endRe: /end/i,

        attributeTransform: {cls: 'class', htmlFor: 'for'},

        closeTags: {},

        detachedDiv: document.createElement('div'),

        decamelizeName: function () {
            var camelCaseRe = /([a-z])([A-Z])/g,
                cache = {};

            function decamel(match, p1, p2) {
                return p1 + '-' + p2.toLowerCase();
            }

            return function (s) {
                return cache[s] || (cache[s] = s.replace(camelCaseRe, decamel));
            };
        }(),

        generateMarkup: function (spec, buffer) {
            var me = this,
                specType = typeof spec,
                attr, val, tag, i, closeTags;

            if (specType === "string" || specType === "number") {
                buffer.push(spec);
            } else if (Box.isArray(spec)) {
                for (i = 0; i < spec.length; i++) {
                    if (spec[i]) {
                        me.generateMarkup(spec[i], buffer);
                    }
                }
            } else {
                tag = spec.tag || 'div';
                buffer.push('<', tag);

                for (attr in spec) {
                    if (spec.hasOwnProperty(attr)) {
                        val = spec[attr];
                        if (val !== undefined && !me.confRe.test(attr)) {
                            if (typeof val === "object") {
                                buffer.push(' ', attr, '="');
                                me.generateStyles(val, buffer, true).push('"');
                            } else {
                                buffer.push(' ', me.attributeTransform[attr] || attr, '="', val, '"');
                            }
                        }
                    }
                }

                if (me.emptyTags.test(tag)) {
                    buffer.push('/>');
                } else {
                    buffer.push('>');

                    if ((val = spec.tpl)) {
                        val.applyOut(spec.tplData, buffer);
                    }
                    if ((val = spec.html)) {
                        buffer.push(val);
                    }
                    if ((val = spec.cn || spec.children)) {
                        me.generateMarkup(val, buffer);
                    }

                    closeTags = me.closeTags;
                    buffer.push(closeTags[tag] || (closeTags[tag] = '</' + tag + '>'));
                }
            }

            return buffer;
        },

        generateStyles: function (styles, buffer, encode) {
            var a = buffer || [],
                name, val;

            for (name in styles) {
                if (styles.hasOwnProperty(name)) {
                    val = styles[name];
                    name = this.decamelizeName(name);
                    if (encode && Box.String.hasHtmlCharacters(val)) {
                        val = Box.String.htmlEncode(val);
                    }
                    a.push(name, ':', val, ';');
                }
            }

            return buffer || a.join('');
        },

        markup: function (spec) {
            if (typeof spec === "string") {
                return spec;
            }

            var buf = this.generateMarkup(spec, []);
            return buf.join('');
        },

        createContextualFragment: function (html) {
            var div = this.detachedDiv,
                fragment = document.createDocumentFragment(),
                length, childNodes;

            div.innerHTML = html;
            childNodes = div.childNodes;
            length = childNodes.length;

            while (length--) {
                fragment.appendChild(childNodes[0]);
            }
            return fragment;
        },

        createDom: function (o, parentNode) {
            var me = this,
                markup = me.markup(o),
                div = me.detachedDiv;

            div.innerHTML = markup;

            return div.firstChild;
        },


        insertHtml: function (where, el, html) {
            var me = this,
                hashVal,
                range,
                rangeEl,
                setStart,
                frag;

            where = where.toLowerCase();

            if (el.insertAdjacentHTML) {

                if (me.ieInsertHtml) {
                    frag = me.ieInsertHtml(where, el, html);
                    if (frag) {
                        return frag;
                    }
                }

                hashVal = fullPositionHash[where];
                if (hashVal) {
                    el.insertAdjacentHTML(hashVal[0], html);
                    return el[hashVal[1]];
                }
            } else {
                if (el.nodeType === 3) {
                    where = where === afterbegin ? beforebegin : where;
                    where = where === beforeend ? afterend : where;
                }
                range = CreateContextualFragment() ? el.ownerDocument.createRange() : undefined;
                setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');
                if (bb_ae_PositionHash[where]) {
                    if (range) {
                        range[setStart](el);
                        frag = range.createContextualFragment(html);
                    } else {
                        frag = this.createContextualFragment(html);
                    }
                    el.parentNode.insertBefore(frag, where === beforebegin ? el : el.nextSibling);
                    return el[(where === beforebegin ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (where === afterbegin ? 'first' : 'last') + 'Child';
                    if (el.firstChild) {
                        if (range) {
                            try {
                                range[setStart](el[rangeEl]);
                                frag = range.createContextualFragment(html);
                            } catch (e) {
                                frag = this.createContextualFragment(html);
                            }
                        } else {
                            frag = this.createContextualFragment(html);
                        }

                        if (where === afterbegin) {
                            el.insertBefore(frag, el.firstChild);
                        } else {
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }
            }
            Box.Error({
                className: "Box.dom.Helper",
                methodName: "insertHtml",
                error: 'Illegal insertion point reached: "' + where + '"'
            });
        },

        before: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, beforebegin);
        },

        after: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, afterend);
        },

        append: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, beforeend);
        },

        prepend: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, afterbegin);
        },

        overwrite: function (el, html, returnElement) {
            var me = this,
                newNode;

            el = Box.get(el)[0];
            html = me.markup(html);

            if (me.ieOverwrite) {
                // hook for IE table hack - impl in ext package override
                newNode = me.ieOverwrite(el, html);
            }
            if (!newNode) {
                el.innerHTML = html;
                newNode = el.firstChild;
            }
            return returnElement ? Box.get(newNode) : newNode;
        },

        doInsert: function (el, o, returnElement, where) {
            var me = this,
                newNode;

            el = Box.get(el)[0];

            if ('innerHTML' in el) {
                newNode = me.insertHtml(where, el, me.markup(o));
            } else {
                newNode = me.createDom(o, null);

                if (el.nodeType === 3) {
                    where = where === afterbegin ? beforebegin : where;
                    where = where === beforeend ? afterend : where;
                }
                if (bb_ae_PositionHash[where]) {
                    el.parentNode.insertBefore(newNode, where === beforebegin ? el : el.nextSibling);
                } else if (el.firstChild && where === afterbegin) {
                    el.insertBefore(newNode, el.firstChild);
                } else {
                    el.appendChild(newNode);
                }
            }

            return returnElement ? Box.get(newNode) : newNode;
        },

        createTemplate: function (o) {
            return new Box.tpl.Base(this.markup(o));
        },

        createHtml: function (spec) {
            return this.markup(spec);
        },

        parse: function (spec) {
            return this.createHtml(spec)
        }
    };

});
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

        if (me.__$eventsSuspended && !--me.__$eventsSuspended) {
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
Box.define('Box.util.Sorter', {

    mixins: {
        event: Box.util.Event
    },

    property: null,

    sorterFn: null,

    root: null,

    transform: null,

    direction: "ASC",

    constructor: function (config) {
        Box.apply(this, config);
        if (Box.isEmpty(this.property) && Box.isEmpty(this.sorterFn)) {
            Box.Error("A Sorter requires either a property or a sorter function");
        }
        this.mixins.event.constructor.call(this, config);
        this.updateSortFunction();
    },

    createSortFunction: function (sorterFn) {
        var me = this,
            property = me.property,
            direction = me.direction || "ASC",
            modifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        return function (o1, o2) {
            return modifier * sorterFn.call(me, o1, o2);
        };
    },

    defaultSorterFn: function (o1, o2) {
        var me = this,
            transform = me.transform,
            v1 = me.getRoot(o1)[me.property],
            v2 = me.getRoot(o2)[me.property];

        if (transform) {
            v1 = transform(v1);
            v2 = transform(v2);
        }

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    },

    getRoot: function (item) {
        return Box.isEmpty(this.root) ? item : item[this.root];
    },

    setDirection: function (direction) {
        var me = this;
        me.direction = direction ? direction.toUpperCase() : direction;
        me.updateSortFunction();
    },

    toggle: function () {
        var me = this;
        me.direction = Box.String.toggle(me.direction, "ASC", "DESC");
        me.updateSortFunction();
    },

    updateSortFunction: function (fn) {
        var me = this;
        fn = fn || me.sorterFn || me.defaultSorterFn;
        me.sort = me.createSortFunction(fn);
    }

});
Box.define("Box.util.Sortable", {

    isSortable: true,

    defaultSortDirection: "ASC",

    requires: [
        Box.util.Sorter,
        Box.util.AbstractMixedCollection
    ],

    sortRoot: null,

    initSortable: function () {
        var sorters = this.sorters;

        this.sorters = new Box.util.AbstractMixedCollection(false, function (item) {
            return item.id || item.property;
        });

        if (sorters) {
            this.sorters.addAll(this.decodeSorters(sorters));
        }
    },

    sort: function (sorters, direction, where, doSort) {
        var me = this,
            sorter, sorterFn,
            newSorters;

        if (Box.isArray(sorters)) {
            doSort = where;
            where = direction;
            newSorters = sorters;
        } else if (Box.isObject(sorters)) {
            doSort = where;
            where = direction;
            newSorters = [sorters];
        } else if (Box.isString(sorters)) {
            sorter = me.sorters.get(sorters);

            if (!sorter) {
                sorter = {
                    property: sorters,
                    direction: direction
                };
                newSorters = [sorter];
            } else if (direction === undefined) {
                sorter.toggle();
            } else {
                sorter.setDirection(direction);
            }
        }

        if (newSorters && newSorters.length) {
            newSorters = me.decodeSorters(newSorters);
            if (Box.isString(where)) {
                if (where === 'prepend') {
                    sorters = me.sorters.clone().items;

                    me.sorters.clear();
                    me.sorters.addAll(newSorters);
                    me.sorters.addAll(sorters);
                }
                else {
                    me.sorters.addAll(newSorters);
                }
            }
            else {
                me.sorters.clear();
                me.sorters.addAll(newSorters);
            }
        }

        if (doSort !== false) {
            me.onBeforeSort(newSorters);

            sorters = me.sorters.items;
            if (sorters.length) {
                me.doSort(me.generateComparator());
            }
        }

        return sorters;
    },

    generateComparator: function () {
        var sorters = this.sorters.getRange();
        return sorters.length ? this.createComparator(sorters) : this.emptyComparator;
    },

    createComparator: function (sorters) {
        return function (r1, r2) {
            var result = sorters[0].sort(r1, r2),
                length = sorters.length,
                i = 1;

            for (; i < length; i++) {
                result = result || sorters[i].sort.call(this, r1, r2);
            }
            return result;
        };
    },

    emptyComparator: function () {
        return 0;
    },

    onBeforeSort: Box.emptyFn,

    decodeSorters: function (sorters) {
        if (!Box.isArray(sorters)) {
            if (sorters === undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Box.util.Sorter,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Box.isString(config)) {
                    config = {
                        property: config
                    };
                }

                Box.applyIf(config, {
                    root: this.sortRoot,
                    direction: "ASC"
                });

                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                sorters[i] = new Box.util.Sorter(config);
            }
        }

        return sorters;
    },

    getSorters: function () {
        return this.sorters.items;
    },

    getFirstSorter: function () {
        var sorters = this.sorters.items,
            len = sorters.length,
            i = 0,
            sorter;

        for (; i < len; ++i) {
            sorter = sorters[i];
            return sorter;
        }
        return null;
    }
});
Box.define('Box.util.Filter', {

    mixins: {
        event: Box.util.Event
    },

    statics: {

        createFilterFn: function (filters) {
            return filters && filters.length ? function (candidate) {
                var isMatch = true,
                    length = filters.length,
                    i, filter;

                for (i = 0; isMatch && i < length; i++) {
                    filter = filters[i];
                    if (!filter.disabled) {
                        isMatch = isMatch && filter.filterFn.call(filter.scope || filter, candidate);
                    }
                }
                return isMatch;
            } : function () {
                return true;
            };
        }

    },

    anyMatch: false,

    exactMatch: false,

    caseSensitive: false,

    root: null,

    filterFn: null,

    property: null,

    value: null,

    // < <= = >= > !=
    operator: null,

    operatorFns: {
        "<": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) < this.value;
        },
        "<=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) <= this.value;
        },
        "=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) == this.value;
        },
        "==": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) == this.value;
        },
        ">=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) >= this.value;
        },
        ">": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) > this.value;
        },
        "!=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) != this.value;
        }
    },

    constructor: function (config) {
        this.initialConfig = config;
        Box.apply(this, config);
        this.mixins.event.constructor.call(this, config);
        this.filter = this.filter || this.filterFn;
        if (Box.isEmpty(this.filter)) {
            this.setValue(config.value);
        }
    },

    setValue: function (value) {
        this.value = value;
        if (this.property === undefined || this.value === undefined) {

        } else {
            this.filter = this.createFilterFn();
        }
        this.filterFn = this.filter;
    },

    setFilterFn: function (filterFn) {
        this.filterFn = this.filter = filterFn;
    },

    createFilterFn: function () {
        var me = this, matcher = this._createValueMatcher(),
            property = this.property;

        if (this.operator) {
            return this.operatorFns[this.operator];
        } else {
            return function (item) {
                var value = me.getRoot.call(me, item)[property];
                return matcher === null ? value === null : matcher.test(value);
            };
        }
    },

    getRoot: function (item) {
        var root = this.root;
        return Box.isEmpty(root) ? item : item[root];
    },

    _createValueMatcher: function () {
        var value = this.value,
            anyMatch = this.anyMatch,
            exactMatch = this.exactMatch,
            caseSensitive = this.caseSensitive,
            escapeRe = Box.String.escapeRegex;

        if (value === null) {
            return value;
        }

        if (!value.exec) {
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
        }

        return value;
    },

    serialize: function () {
        var result = Box.apply({}, this.initialConfig);
        result.value = this.value;
        return result;
    }

});
// 4.0.1
Box.define('Box.util.AbstractMixedCollection', {

    requires: [Box.util.Filter],

    mixins: {
        event: Box.util.Event
    },

    isMixedCollection: true,

    generation: 0,

    constructor: function (keyFn) {
        if (Box.isObject(keyFn)) {
            Box.apply(this, keyFn);
        } else if (Box.isFunction(keyFn)) {
            this.getKey = keyFn;
        }
        this.mixins.event.constructor.call(this);

        this.items = [];
        this.map = {};
        this.keys = [];
        this.length = 0;
    },

    getKey: function (item) {
        return item.id
    },

    add: function (key, item) {
        var iKey = key, iItem = item, old;
        if (arguments.length == 1) {
            iItem = iKey;
            iKey = this.getKey(iItem)
        }
        if (typeof iKey != 'undefined' && iKey !== null) {
            old = this.map[iKey];
            if (typeof old != 'undefined') {
                return this.replace(iKey, iItem);
            }
            this.map[iKey] = iItem
        }

        this.generation++;
        this.length++;
        this.items.push(iItem);
        this.keys.push(iKey);
        this.trigger('add', this.length - 1, iItem, iKey);
        return iItem
    },

    addAll: function (items) {
        var i = 0, args, len, key;
        if (arguments.length > 1 || Box.isArray(items)) {
            args = arguments.length > 1 ? arguments : items;
            for (len = args.length; i < len; i++) {
                this.add(args[i])
            }
        } else {
            for (key in items) {
                if (items.hasOwnProperty(key)) {
                    this.add(key, items[key])
                }
            }
        }
    },

    replace: function (key, item) {
        var old, index;
        if (arguments.length == 1) {
            item = arguments[0];
            key = this.getKey(item);
        }

        old = this.map[key];
        if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
            return this.add(key, item)
        }
        this.generation++;
        index = this.indexOfKey(key);
        this.items[index] = item;
        this.map[key] = item;
        this.trigger('replace', key, old, item);
        return item
    },

    each: function (fn, scope) {
        var items = [].concat(this.items);
        var len = items.length, i = 0, item;
        for (; i < len; i++) {
            item = items[i];
            if (fn.call(scope || item, item, i, len) === false) {
                break;
            }
        }
    },

    eachKey: function (fn, scope) {
        var keys = this.keys,
            items = this.items,
            len = keys.length,
            i = 0;

        for (; i < len; i++) {
            fn.call(scope || window, keys[i], items[i], i, len)
        }
    },

    findBy: function (fn, scope) {
        var keys = this.keys,
            items = this.items,
            len = items.length,
            i = 0;
        for (; i < len; i++) {
            if (fn.call(scope || window, items[i], keys[i])) {
                return items[i]
            }
        }
        return null
    },

    find: function () {
        return this.findBy.apply(this, arguments)
    },

    insert: function (index, key, record) {
        var iKey = key, iRecord = record;
        if (arguments.length == 2) {
            iRecord = record;
            iKey = this.getKey(iRecord);
        }
        if (this.containsKey(iKey)) {
            this.suspendEvents();
            this.removeAtKey(iKey);
            this.resumeEvents();
        }
        if (index >= this.length) {
            return this.add(iKey, iRecord);
        }
        this.generation++;
        this.length++;
        Box.Array.splice(this.items, index, 0, iRecord);
        if (typeof iKey != 'undefined' && iKey !== null) {
            this.map[iKey] = iRecord
        }
        Box.Array.splice(this.keys, index, 0, iRecord);
        this.trigger('add', index, iRecord, iKey);
        return iRecord
    },

    remove: function (record) {
        this.generation++;
        return this.removeAt(this.indexOf(record))
    },

    removeAt: function (index) {
        var key, record;
        if (index < this.length && index >= 0) {
            this.length--;
            record = this.items[index];
            Box.Array.erase(this.items, index, 1);
            key = this.keys[index];
            if (typeof key != 'undefined') {
                delete this.map[key]
            }
            Box.Array.erase(this.keys, index, 1);
            this.trigger('remove', record, key);
            this.generation++;
            return record
        }
        return false
    },

    removes: function (items) {
        items = [].concat(items);
        var i, len = items.length;
        for (i = 0; i < len; i++) {
            this.remove(items[i])
        }
        return this
    },

    removeAtKey: function (key) {
        return this.removeAt(this.indexOfKey(key));
    },

    getCount: function () {
        return this.length;
    },

    indexOf: function (record) {
        return Box.Array.indexOf(this.items, record);
    },

    indexOfKey: function (key) {
        return Box.Array.indexOf(this.keys, key);
    },

    get: function (key) {
        var record = this.map[key],
            item = record !== undefined ? record : (typeof key == 'number') ? this.items[key] : undefined;
        return typeof item != 'function' ? item : null;
    },

    getAt: function (index) {
        return this.items[index];
    },

    getByKey: function (key) {
        return this.map[key];
    },

    contains: function (item) {
        return typeof this.map[this.getKey(item)] != 'undefined';
    },

    containsKey: function (key) {
        return typeof this.map[key] != 'undefined';
    },

    clear: function () {
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.generation++;
        this.trigger('clear');
    },

    first: function () {
        return this.items[0]
    },

    last: function () {
        return this.items[this.length - 1];
    },

    sum: function (property, root, start, end) {
        var values = this._extractValues(property, root),
            length = values.length,
            sum = 0,
            i;

        start = start || 0;
        end = (end || end === 0) ? end : length - 1;
        for (i = start; i <= end; i++) {
            sum += values[i];
        }
        return sum;
    },

    _extractValues: function (property, root) {
        var values = this.items;
        if (root) {
            values = Box.Array.pluck(values, root);
        }
        return Box.Array.pluck(values, property);
    },

    collect: function (property, root, isUnique, allowNull) {
        var values = this._extractValues(property, root),
            length = values.length,
            hits = {},
            unique = [],
            value, strValue, i;

        for (i = 0; i < length; i++) {
            value = values[i];
            strValue = String(value);
            if ((allowNull || !Box.isEmpty(value))) {
                if (isUnique) {
                    if (!hits[strValue]) {
                        hits[strValue] = true;
                        unique.push(value);
                    }
                } else {
                    unique.push(value);
                }
            }
        }
        return unique;
    },

    getRange: function (start, end) {
        var items = this.items,
            range = [],
            i;

        if (items.length < 1) {
            return range;
        }
        start = start || 0;
        end = Math.min(typeof end == 'undefined' ? this.length - 1 : end, this.length - 1);
        if (start <= end) {
            for (i = start; i <= end; i++) {
                range[range.length] = items[i];
            }
        } else {
            for (i = start; i >= end; i--) {
                range[range.length] = items[i];
            }
        }
        return range;
    },

    filter: function (property, value, anyMatch, caseSensitive) {
        var filters = [], filterFn;
        if (Box.isString(property)) {
            filters.push(new Box.util.Filter({
                property: property,
                value: value,
                anyMatch: anyMatch,
                caseSensitive: caseSensitive
            }))
        } else if (Box.isArray(property) || property instanceof Box.util.Filter) {
            filters = filters.concat(property)
        }

        filterFn = function (record) {
            var isMatch = true, length = filters.length;
            var filter, scope, fn, i;
            for (i = 0; i < length; i++) {
                filter = filters[i];
                fn = filter.filterFn;
                scope = filter.scope;
                isMatch = isMatch && fn.call(scope, record);
            }
            return isMatch;
        };

        return this.filterBy(filterFn)
    },

    filterBy: function (fn, scope) {
        var newMC = new (this.self)(),
            keys = this.keys,
            items = this.items,
            length = items.length,
            i;

        newMC.getKey = this.getKey;

        for (i = 0; i < length; i++) {
            if (fn.call(scope || this, items[i], keys[i])) {
                newMC.add(keys[i], items[i]);
            }
        }
        return newMC;
    },

    findIndex: function (property, value, start, anyMatch, caseSensitive) {
        if (Box.isEmpty(value, false)) {
            return -1
        }
        value = this._createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function (record) {
            return record && value.test(record[property]);
        }, null, start);
    },

    findIndexBy: function (fn, scope, start) {
        var keys = this.keys,
            items = this.items,
            len = items.length,
            i = start || 0;

        for (; i < len; i++) {
            if (fn.call(scope || this, items[i], keys[i])) {
                return i;
            }
        }
        return -1;
    },

    _createValueMatcher: function (value, anyMatch, caseSensitive, exactMatch) {
        if (!value.exec) {
            var er = Box.String.escapeRegex;
            value = String(value);
            if (anyMatch === true) {
                value = er(value)
            } else {
                value = '^' + er(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
        }
        return value;
    },

    clone: function () {
        var copy = new (this.self)(),
            keys = this.keys,
            items = this.items,
            len = items.length,
            i = 0;

        for (; i < len; i++) {
            copy.add(keys[i], items[i]);
        }
        copy.getKey = this.getKey;
        return copy;
    }

});
Box.define('Box.util.MixedCollection', {

    requires: [Box.util.Filter],

    mixins: {
        sortable: Box.util.Sortable
    },

    extend: Box.util.AbstractMixedCollection,

    constructor: function () {
        this.callParent(arguments);
        this.initSortable()
    },

    doSort: function (sorterFn) {
        this.sortBy(sorterFn)
    },

    _sort: function (property, dir, fn) {
        var dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1,
            keys = this.keys,
            items = this.items,
            c = [],
            i, len;

        fn = fn || function (a, b) {
            return a - b;
        };

        for (i = 0, len = items.length; i < len; i++) {
            c[c.length] = {
                key: keys[i],
                value: items[i],
                index: i
            };
        }

        Box.Array.sort(c, function (a, b) {
            var v = fn(a[property], b[property]) * dsc;
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        for (i = 0, len = c.length; i < len; i++) {
            items[i] = c[i].value;
            keys[i] = c[i].key;
        }

        this.trigger('sort', this);
    },

    sortBy: function (sorterFn, scope) {
        var items = this.items,
            keys = this.keys,
            length = items.length,
            temp = [],
            i;

        for (i = 0; i < length; i++) {
            temp[i] = {
                key: keys[i],
                value: items[i],
                index: i
            };
        }

        Box.Array.sort(temp, function (a, b) {
            var v = sorterFn.call(scope || this, a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }

            return v;
        }, this);

        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i] = temp[i].key;
        }

        this.trigger('sort', this, items, keys);
    },

    findInsertionIndex: function (newItem, sorterFn) {
        var items = this.items,
            start = 0,
            end = items.length - 1,
            middle,
            comparison;

        if (!sorterFn) {
            sorterFn = this.generateComparator();
        }
        while (start <= end) {
            middle = (start + end) >> 1;
            comparison = sorterFn(newItem, items[middle]);
            if (comparison >= 0) {
                start = middle + 1;
            } else if (comparison < 0) {
                end = middle - 1;
            }
        }
        return start;
    },

    reorder: function (mapping) {
        var items = this.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        //todo suspendEvents

        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }
        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }
        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        this.clear();
        this.addAll(order);

        //todo resumeEvents
        this.trigger('sort', this);
    },

    sortByKey: function (dir, fn, scope) {
        if (Box.isFunction(dir)) {
            fn = dir;
            dir = "ASC";
        }
        this._sort('key', dir, Box.Function.bind(fn || function (a, b) {
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        }, scope || this));
    }

});
Box.define('Box.util.Cookie', {

    singleton: true,

    set: function (name, value) {
        var argv = arguments;
        var argc = arguments.length;

        var expires = (argc > 2) ? argv[2] : null;
        var path = (argc > 3) ? argv[3] : '/';
        var domain = (argc > 4) ? argv[4] : null;
        var secure = (argc > 5) ? argv[5] : false;

        var expressions = name + "=" + escape(value);

        if (expires !== null) {
            expressions += "; expires=" + expires.toGMTString();
        }
        if (path !== null) {
            expressions += "; path=" + path;
        }
        if (domain !== null) {
            expressions += "; domain=" + domain;
        }
        if (secure === true) {
            expressions += "; secure";
        }

        document.cookie = expressions;
    },

    get: function (name) {
        var arg = name + "=",
            alen = arg.length,
            clen = document.cookie.length,
            i = 0,
            j = 0;

        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i === 0) {
                break;
            }
        }
        return null;
    },

    clear: function (name, path) {
        if (this.get(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + path;
        }
    },

    getCookieVal: function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }

});

Box.define('Box.util.JSON', {

    singleton: true,

    encodingFunction: null,

    decodingFunction: null,

    useNative: null,

    useHasOwn: !!{}.hasOwnProperty,

    specials: {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\',
        '\x0b': '\\u000b'
    },

    charToReplace: /[\\\"\x00-\x1f\x7f-\uffff]/g,

    isNative: function () {
        return Box.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]'
    },

    pad: function (n) {
        return n < 10 ? "0" + n : n;
    },

    doDecode: function (json) {
        return eval("(" + json + ')');
    },

    toJson: function (o) {
        if (Box.isObject(o)) {
            var obj;
            obj = o.toJSON ? o.toJSON() : o;
            for (var key in obj) {
                obj[key] = Box.JSON.toJson(obj[key]);
            }
            return obj;
        }
        return o;
    },


    doEncode: function (o, newline) {
        if (o === null || o === undefined) {
            return "null";
        } else if (Box.isDate(o)) {
            return this.encodeDate(o);
        } else if (Box.isString(o)) {
            return this.encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (Box.isBoolean(o)) {
            return String(o);
        } else if (o.toJSON) {
            return o.toJSON();
        } else if (Box.isArray(o)) {
            return this.encodeArray(o, newline);
        } else if (Box.isObject(o)) {
            return this.encodeObject(o, newline);
        } else if (typeof o === "function") {
            return "null";
        }
        return 'undefined';
    },

    encodeString: function (s) {
        var $this = this;
        return '"' + s.replace(this.charToReplace, function (a) {
            var c = $this.specials[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },

    encodeArrayPretty: function (o, newline) {
        var len = o.length,
            cnewline = newline + '   ',
            sep = ',' + cnewline,
            a = ["[", cnewline],
            i;

        for (i = 0; i < len; i += 1) {
            a.push(this.encodeValue(o[i], cnewline), sep);
        }
        a[a.length - 1] = newline + ']';
        return a.join('');
    },

    encodeObjectPretty: function (o, newline) {
        var cnewline = newline + '   ',
            sep = ',' + cnewline,
            a = ["{", cnewline],
            i;

        for (i in o) {
            if (!this.useHasOwn || o.hasOwnProperty(i)) {
                a.push(this.encodeValue(i) + ': ' + this.encodeValue(o[i], cnewline), sep);
            }
        }
        a[a.length - 1] = newline + '}';
        return a.join('');
    },

    encodeArray: function (o, newline) {
        if (newline) {
            return this.encodeArrayPretty(o, newline);
        }
        var a = ["[", ""],
            len = o.length,
            i;
        for (i = 0; i < len; i += 1) {
            a.push(this.encodeValue(o[i]), ',');
        }
        a[a.length - 1] = ']';
        return a.join("");
    },

    encodeObject: function (o, newline) {
        if (newline) {
            return this.encodeObjectPretty(o, newline);
        }
        var a = ["{", ""],
            i;
        for (i in o) {
            if (!this.useHasOwn || o.hasOwnProperty(i)) {
                a.push(this.encodeValue(i), ":", this.encodeValue(o[i]), ',');
            }
        }
        a[a.length - 1] = '}';
        return a.join("");
    },

    encodeDate: function (o) {
        return '"' + o.getFullYear() + "-"
            + this.pad(o.getMonth() + 1) + "-"
            + this.pad(o.getDate()) + "T"
            + this.pad(o.getHours()) + ":"
            + this.pad(o.getMinutes()) + ":"
            + this.pad(o.getSeconds()) + '"';
    },

    encode: function (o) {
        if (!this.encodingFunction) {
            this.encodingFunction = this.isNative() ? JSON.stringify : this.doEncode;
        }
        return this.encodingFunction(o);
    },

    decode: function (json, safe) {
        if (!this.decodingFunction) {
            this.decodingFunction = this.isNative() ? JSON.parse : this.doDecode;
        }
        try {
            return this.decodingFunction(json);
        } catch (e) {
            if (safe === true) {
                return null;
            }
            Box.Error({
                className: "Box.util.JSON",
                methodName: "decode",
                error: "You're trying to decode an invalid JSON String: " + json
            });
        }
    }

}, function () {

    Box.JSON = Box.util.JSON;

    Box.JSON.encodeValue = Box.JSON.doEncode;

});
Box.define('Box.Util.Format', (function () {

    var stripTagsRE = /<\/?[^>]+>/gi,
        stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        nl2brRe = /\r?\n/g,
        formatCleanRe = /[^\d\.]/g,
        I18NFormatCleanRe;

    return {
        singleton: true,

        thousandSeparator: ",",

        //小数分隔符
        decimalSeparator: ".",

        //货币的精确到2位小数
        currencyPrecision: 2,
        //货币符号
        currencySign: '$',

        currencyAtEnd: false,

        undef: function (value) {
            return value !== undefined ? value : "";
        },

        defaultValue: function (value, defaultValue) {
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        substr: 'ab'.substr(-1) != 'b' ? function (value, start, length) {
            var str = String(value);
            return (start < 0) ? str.substr(Math.max(str.length + start, 0), length) : str.substr(start, length);
        } : function (value, start, length) {
            return String(value).substr(start, length);
        },

        lowercase: function (value) {
            return String(value).toLowerCase();
        },

        uppercase: function (value) {
            return String(value).toUpperCase();
        },

        usMoney: function (v) {
            return this.currency(v, '$', 2);
        },

        //格式化一个数字类型的值为货币类型
        currency: function (v, currencySign, decimals, end) {
            //negativeSign：正负标识
            var negativeSign = "",
                format = ',0',
                i = 0;

            v = v - 0;
            if (v < 0) {
                v = -v;
                negativeSign = '-';
            }

            decimals = decimals || _module.currencyPrecision;
            format += format + (decimals > 0 ? '.' : '');
            for (; i < decimals; i++) {
                format += '0';
            }
            v = this.number(v, format);
            if ((end || this.currencyAtEnd) === true) {
                return Box.String.format("{0}{1}{2}", negativeSign, v, currencySign || this.currencySign);
            } else {
                return Box.String.format("{0}{1}{2}", negativeSign, currencySign || this.currencySign, v);
            }
        },

        date: function (v, format) {
            if (!v) {
                return "";
            }
            if (!Box.isDate(v)) {
                v = new Date(Date.parse(v));
            }
            return Box.Date.format(v, format || Box.Date.defaultFormat);
        },

        dateRenderer: function (format) {
            return function (v) {
                return Box.Date.format(v, format);
            };
        },

        stripTags: function (v) {
            return !v ? v : String(v).replace(stripTagsRE, "");
        },

        stripScripts: function (v) {
            return !v ? v : String(v).replace(stripScriptsRe, "");
        },

        fileSize: function (size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (this.round(((size * 10) / 1024)) / 10) + " KB";
            } else {
                return (this.round(((size * 10) / 1048576)) / 10) + " MB";
            }
        },

        math: function () {
            var fns = {};
            return function (v, a) {
                if (!fns[a]) {
                    fns[a] = Box.functionFactory('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            };
        }(),

        round: function (value, precision) {
            precision = precision || 0;
            return parseFloat(value.toFixed(precision));
        },

        //这里用的是toFixed处理小数,采用的是"四舍六入五成双"的规则
        //在百度百科上给的解释是：也即“4舍6入5凑偶”这里“四”是指≤4 时舍去，"六"是指≥6时进上，"五"指的是根据5后面的数字来定，当5后有数时，舍5入1；当5后无有效数字时，需要分两种情况来讲：①5前为奇数，舍5入1；②5前为偶数，舍5不进。（0是最小的偶数）
        //format.number(123456.9, '0.0000') --> 123456.9000
        number: function (v, formatString) {
            if (!formatString) {
                return v;
            }
            v = Box.Number.num(v, NaN);
            if (isNaN(v)) {
                return "";
            }
            var comma = this.thousandSeparator,
                dec = this.decimalSeparator,
                i18n = false,
                neg = v < 0,
                hasComma,
                psplit;

            v = Math.abs(v);

            if (formatString.substr(formatString.length - 2) == '/i') {
                if (!I18NFormatCleanRe) {
                    I18NFormatCleanRe = new RegExp('[^\\d\\' + this.decimalSeparator + ']', 'g');
                }
                formatString = formatString.substr(0, formatString.length - 2);
                i18n = true;
                hasComma = formatString.indexOf(comma) != -1;
                psplit = formatString.replace(I18NFormatCleanRe).split(dec);
            } else {
                hasComma = formatString.indexOf(',') != -1;
                psplit = formatString.replace(formatCleanRe, '').split('.');
            }

            if (1 < psplit.length) {
                v = v.toFixed(psplit[1].length);
            } else if (2 < psplit.length) {
                alert("Invalid number format, should have no more than 1 decimal");
                return;
            } else {
                v = v.toFixed(0);
            }

            var fnum = v.toString();
            psplit = fnum.split('.');
            if (hasComma) {
                var cnum = psplit[0],
                    parr = [],
                    j = cnum.length,
                    m = Math.floor(j / 3),
                    n = cnum.length % 3 || 3,
                    i;

                for (i = 0; i < j; i += n) {
                    if (i !== 0) {
                        n = 3;
                    }

                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            } else {
                if (psplit[1]) {
                    fnum = psplit[0] + dec + psplit[1];
                }
            }

            return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
        },

        numberRenderer: function (format) {
            return function (v) {
                return this.number(v, format);
            };
        },

        plural: function (v, s, p) {
            return v + ' ' + (v == 1 ? s : (p ? p : s + 's'));
        },

        //把换行转化成html标签br
        nl2br: function (v) {
            return Box.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>')
        },

        //字符串首字母大写
        firstUpperCase: Box.String.firstUpperCase,

        //字符串超出长度以省略号代替
        ellipsis: Box.String.ellipsis,

        format: Box.String.format,

        htmlDecode: Box.String.htmlDecode,

        htmlEncode: Box.String.htmlEncode,

        leftPad: Box.String.leftPad,

        trim: Box.String.trim,

        escapeRegex: function (s) {
            return s.replace(/([\-.*+?\^${}()|\[\]\/\\])/g, "\\$1");
        },

        //主要是针对css中的象margin这样的设置， 10px可以写成10 10 10 10
        parseBox: function (box) {
            box = box || 0;
            if (Box.isObject(box)) {
                return {
                    top: box.top || 0,
                    right: box.right || 0,
                    bottom: box.bottom || 0,
                    left: box.left || 0,
                    width: (box.right || 0) + (box.left || 0),
                    height: (box.top || 0) + (box.bottom || 0)
                };
            } else {
                if (typeof box != 'string') {
                    box = box.toString();
                }
                var parts = box.split(/\s+/),
                    ln = parts.length;

                if (ln == 1) {
                    parts[1] = parts[2] = parts[3] = parts[0];
                } else if (ln == 2) {
                    parts[2] = parts[0];
                    parts[3] = parts[1];
                } else if (ln == 3) {
                    parts[3] = parts[1];
                }

                return {
                    top: parseFloat(parts[0]) || 0,
                    right: parseFloat(parts[1]) || 0,
                    bottom: parseFloat(parts[2]) || 0,
                    left: parseFloat(parts[3]) || 0,
                    width: (parseFloat(parts[1]) || 0) + (parseFloat(parts[3]) || 0),
                    height: (parseFloat(parts[0]) || 0) + (parseFloat(parts[2]) || 0)
                };
            }
        },
        toNumeric: function (data, defaultVal) {
            if (typeof data === "number")
                return data;
            if (typeof data === "string" && data)
                return parseFloat(data.replace(/,/g, ""));
            return defaultVal || 0;
        },

        //格式化数字
        renderFormat: function (data, digits) {
            if (typeof digits === "undefined" || digits == null || !digits) {
                digits = 0;
            }
            var fmt = '0,0.';
            for (i = 0; i < digits; i++) {
                fmt = fmt + '0';
            }
            return this.number(data, fmt);
        },
        //格式化数字，digits：保留小数位数
        renderNumric: function (data, digits, defaultVal) {
            if (!data) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (!data) {
                return defaultVal || "--";
            }
            return this.renderFormat(data, digits);
        },
        //格式化数字，digits：保留小数位数
        renderNumricZero: function (data, digits, defaultVal) {
            if (Box.isNullOrUndefined(data)) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (Box.isNullOrUndefined(data)) {
                return defaultVal || "--";
            }
            return this.renderFormat(data, digits);
        },
        //百分比格式化数字，digits：保留小数位数
        renderPercentWith: function (data, digits, defaultVal) {
            if (!data) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (!data) {
                return defaultVal || "--";
            }
            return this.renderFormat(data * 100, digits) + '%';
        },
        //百分比格式化数字，digits：保留小数位数
        renderPercent: function (data, digits, defaultVal) {
            if (!data) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (!data) {
                return defaultVal || "--";
            }
            return this.renderFormat(data * 100, digits);
        },
        //万元为单位，格式化数字，digits：保留小数位数
        renderWanYuan: function (data, digits, defaultVal) {
            if (!data) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (!data) {
                return defaultVal || "--";
            }
            return this.renderFormat(data / 10000, digits);
        },
        //亿元为单位，格式化数字，digits：保留小数位数
        renderYiYuan: function (data, digits, defaultVal) {
            if (!data) {
                return defaultVal || "--";
            }
            if (typeof data === "string")
                data = parseFloat(data.replace(/,/g, ""));
            if (!data) {
                return defaultVal || "--";
            }
            return this.renderFormat(data / 100000000, digits);
        },
        //格式化日期
        renderDate: function (date, defaultVal) {
            if (typeof date === "undefined" || date == null) {
                return defaultVal || "--";
            }
            if (typeof date === "string") {
                // var v = date.replace(/\..*/g, "").replace(/[^/\d\s]+/g, " ").split(" ");
                // date = new Date();
                // date.setFullYear(v[0]);
                // date.setDate(v[2] || 1);
                // date.setMonth((v[1] - 1));
                // date.setDate(v[2] || 1);
                // date.setMonth((v[1] - 1));
                // date.setHours(v[3] || 0);
                // date.setMinutes(v[4] || 0);
                // date.setSeconds(v[5] || 0);
                date = new Date(date);
            }
            if (date.toString() === 'Invalid Date')
                return defaultVal || "--";
            return this.formatDate(date, "yyyy-MM-dd");
        },
        //格式化日期
        renderTime: function (date, defaultVal) {
            if (typeof date === "undefined" || date == null) {
                return defaultVal || "--";
            }
            if (typeof date === "string") {
                var v = date.replace(/\..*/g, "").replace(/[^/\d\s]+/g, " ").split(" ");
                date = new Date();
                date.setFullYear(v[0]);
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setHours(v[3] || 0);
                date.setMinutes(v[4] || 0);
                date.setSeconds(v[5] || 0);
            }
            if (date.toString() === 'Invalid Date')
                return defaultVal || "--";
            return this.formatDate(date, "HH:mm:ss");
        },
        //格式化日期
        renderDateChinese: function (date, defaultVal) {
            if (typeof date === "undefined" || date == null) {
                return defaultVal || "--";
            }
            if (typeof date === "string") {
                var v = date.replace(/\..*/g, "").replace(/[^/\d\s]+/g, " ").split(" ");
                date = new Date();
                date.setFullYear(v[0]);
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setHours(v[3] || 0);
                date.setMinutes(v[4] || 0);
                date.setSeconds(v[5] || 0);
            }
            if (date.toString() === 'Invalid Date')
                return defaultVal || "--";
            return this.formatDate(date, "yyyy年MM月dd日");
        },
        //格式化日期和时间
        renderDatetime: function (date, defaultVal) {
            if (typeof date === "undefined" || date == null) {
                return defaultVal || "--";
            }
            if (typeof date === "string") {
                var v = date.replace(/\..*/g, "").replace(/[^/\d\s]+/g, " ").split(" ");
                date = new Date();
                date.setFullYear(v[0]);
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setDate(v[2] || 1);
                date.setMonth((v[1] - 1));
                date.setHours(v[3] || 0);
                date.setMinutes(v[4] || 0);
                date.setSeconds(v[5] || 0);
            }
            if (date.toString() === 'Invalid Date')
                return defaultVal || "--";
            return this.formatDate(date, "yyyy-MM-dd HH:mm:ss");
        },
        //数字转大写
        renderDigitUpper: function (digits) {
            var fraction = ['角', '分'];
            var digit = ['零', '壹', '貳', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

            var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];

            if (typeof digits === "undefined" || digits == null) {
                return "--";
            }

            var head = digits < 0 ? '欠' : '';
            digits = Math.abs(digits);

            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                //todo:digits * 10 修改为 Box.Number.num(Box.Number.toFixed(digits * 10,2))
                s += (digit[Math.floor(digits * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }

            s = s || '整';

            digits = Math.floor(digits);

            for (var i = 0; i < unit[0].length && digits > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && digits > 0; j++) {
                    p = digit[digits % 10] + unit[1][j] + p;
                    digits = Math.floor(digits / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;

            }

            return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
        },


        //自定义格式化日期时间
        formatDate: function (date, fmt) {
            if (!Box.isDate(date))
                date = new Date(date);
            if (Box.isDate(date))
                return date.format(fmt);
            else
                throw 'date的格式不对';
        }
    };

})(), function () {

    Box.Format = Box.Util.Format;

});

// regexp see: VerbalExpressions 
Box.define('Box.util.RegExp', {

    statics: {

        create: function () {
            return new Box.util.RegExp();
        },

        is: function (type, str) {
            var fn = Box.util.RegExp[type];
            if (!Box.isFunction(fn)) {
                Box.Error('can not find ' + type + ' method');
            }
            return fn().test(str);
        },

        getIp: function () {
            var regexp = Box.regexp().beginCapture().number().repeat(1, 2)
                .or().then("1").number().repeat(2)
                .or().then("2").range("0", "4").number()
                .or().then("25").range("0", "5").endCapture();

            return Box.regexp()
                .startOfLine()
                .beginCapture().then(regexp).then(".").endCapture()
                .repeat(3)
                .then(regexp)
                .endOfLine();
        },

        getUrl: function () {
            return Box.regexp()
                .startOfLine()
                .then("http")
                .maybe("s")
                .then("://")
                .maybe("www.")
                .anythingBut(" ")
                .endOfLine();
        },

        getImage: function () {
            return Box.regexp()
                .startOfLine()
                .word().then(".")
                .orBy("jpg", "jfif", "jpeg", "tiff", "raw", "pam", "webp", "svg", "pns", "mpo", "jps", "png", "gif", "bmp")
                .endOfLine();
        },

        getEmail: function () {
            return Box.regexp()
                .startOfLine()
                .word()
                .beginCapture()
                .then(".").word()
                .endCapture()
                .add("*")
                .then("@")
                .word()
                .beginCapture()
                .then(".").word()
                .endCapture()
                .add("+")
                .endOfLine();
        },

        ip: /^((([1-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([1-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))$/,

        url: /^(http)(s)?(\:\/\/)(www\.)?([^\ ]*)$/,

        image: /^\w+\.(jpg|jfif|jpeg|tiff|raw|pam|webp|svg|pns|mpo|jps|png|gif|bmp)$/,

        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,

        tel: /^(\d{3}(-\d{4}){2})$|^(\d{11})$|^(0\d{2,3}-?\d{7,8})$/,

        date: /^([1-9][0-9]{3}-((0?[13578]|1[02])-(0?[1-9]|[12][0-9]|3[01])|(0?[469]|11)-(0?[1-9]|[12][0-9]|30)|(0?2)-(0?[1-9]|1[0-9]|2[0-8]))|(([13579][26]|[2468][048])00|[1-9][0-9]([02468][48]|[2468][048]|[13579][26]))-0?2-(0?[1-9]|[12][0-9]))$/,
    },

    isRegExp: true,

    prefixes: "",

    suffixes: "",

    source: "",

    modifiers: 'gm',

    sanitize: function (value) {
        if (value.source) {
            return value.source;
        }
        if (Box.isNumber(value)) {
            return value
        }
        return value.replace(/[^\w]/g, function (character) {
            return "\\" + character;
        });
    },

    add: function (value) {
        this.source += value || "";
        this.expression = this.expression || new RegExp();
        this.expression.compile(this.prefixes + this.source + this.suffixes, this.modifiers);
        return this;
    },

    reset: function () {
        return this.add(Box.EMPTY_STRING);
    },

    startOfLine: function (enable) {
        enable = (enable !== false);
        this.prefixes = enable ? "^" : "";
        return this.reset();
    },

    endOfLine: function (enable) {
        enable = (enable !== false);
        this.suffixes = enable ? "$" : "";
        return this.reset();
    },

    then: function (value) {
        value = this.sanitize(value);
        return this.add("(?:" + value + ")");
    },

    find: function (value) {
        return this.then(value);
    },

    maybe: function (value) {
        value = this.sanitize(value);
        return this.add("(?:" + value + ")?");
    },

    anything: function () {
        return this.add("(?:.*)");
    },


    anythingBut: function (value) {
        value = this.sanitize(value);
        return this.add("(?:[^" + value + "]*)");
    },


    something: function () {
        return this.add("(?:.+)");
    },

    somethingBut: function (value) {
        value = this.sanitize(value);
        return this.add("(?:[^" + value + "]+)");
    },

    lineBreak: function () {
        return this.add("(?:\\r\\n|\\r|\\n)");
    },

    br: function () {
        return this.lineBreak();
    },

    word: function () {
        return this.add("(?:\\w+)");
    },

    tab: function () {
        return this.add("(?:\\t)");
    },

    whitespace: function () {
        return this.add("(?:\\s)");
    },

    number: function () {
        return this.add("(?:\\d)");
    },

    any: function (value) {
        value = this.sanitize(value);
        return this.add("[" + value + "]");
    },

    range: function () {
        var value = "[";
        for (var _to = 1; _to < arguments.length; _to += 2) {
            var from = this.sanitize(arguments[_to - 1]);
            var to = this.sanitize(arguments[_to]);

            value += from + "-" + to;
        }
        value += "]";
        return this.add(value);
    },


    repeat: function () {
        var value, len = arguments.length;
        if (len == 0 || len > 2) {
            Box.Error("arguments’s length must gt 0 and lt 3");
        }
        if (arguments.length == 1) {
            value = "{" + Box.num(arguments[0]) + "}";
        } else {
            var values = [];
            for (var i = 0; i < arguments.length; i++) {
                values.push(Box.num(arguments[i]));
            }

            value = "{" + values.join(",") + "}";
        }
        return this.add(value || "");
    },


    multiple: function (value) {
        value = value.source ? value.source : this.sanitize(value);
        if (arguments.length === 1) {
            this.add("(?:" + value + ")*");
        }
        if (arguments.length == 2) {
            this.add("(?:" + value + ")");
            this.add("{" + arguments[1] + "}");
        }
        return this;
    },

    or: function (value) {
        this.prefixes += "(?:";
        this.suffixes = ")" + this.suffixes;

        this.add(")|(?:");
        if (value) {
            this.then(value);
        }
        return this;
    },

    orBy: function () {
        var args = Box.Array.toArray(arguments);
        args = Box.Array.map(args, function (item) {
            return item.source ? ("(?:" + item.source + ")") : this.sanitize(item);
        }, this);
        return this.add("(?:" + args.join('|') + ")");
    },

    beginCapture: function () {
        this.suffixes += ")";
        return this.add("(", false);
    },

    endCapture: function () {
        this.suffixes = this.suffixes.substring(0, this.suffixes.length - 1);
        return this.add(")", true);
    },

    setModifier: function (modifiers) {
        this.modifiers = modifiers;
        return this.reset();
    },


    toRegExp: function () {
        var arr = this.expression.toString().match(/\/(.*)\/([a-z]+)?/);
        return new RegExp(arr[1], arr[2]);
    },


    replace: function (value, text) {
        value = value.toString();
        return value.replace(this.expression, text);
    },

    exec: function (text) {
        return this.expression.exec(text);
    },

    test: function (text) {
        return this.expression.test(text);
    }

}, function () {

    Box.RegExp = Box.util.RegExp;

    Box.regexp = Box.util.RegExp.create;

});
Box.define('Box.util.HashMap', {

    mixins: {
        event: Box.util.Event
    },

    isHashMap: true,

    constructor: function (config) {
        this.initialConfig = config;
        if (Box.isObject(config)) {
            Box.apply(this, config || {});
        } else if (Box.isFunction(config)) {
            this.getKey = config
        }
        this.mixins.event.constructor.call(this, config);
        this.clear(true);
    },

    len: function () {
        return this.length;
    },

    getCount: function () {
        return this.len();
    },

    data: function (key, value) {
        if (value === undefined) {
            value = key;
            key = this.getKey(value)
        }
        return [key, value]
    },

    getData: function (key, value) {
        return this.data(key, value);
    },

    getKey: function (item) {
        return item.id
    },

    push: function (key, value) {
        if (Box.isArray(key)) {
            Box.Array.forEach(key, function (item) {
                this.push(item)
            }, this);
            return this
        }

        var me = this,
            data;
        if (arguments.length === 1) {
            value = key;
            key = this.getKey(value)
        }
        if (this.indexOf(key)) {
            this.replace(key, value)
        } else {
            ++this.length
        }

        data = this.data(key, value);
        key = data[0];
        value = data[1];
        this.map[key] = value;
        this.trigger('add', this, key, value);
        return value;
    },

    add: function (key, value) {
        return this.push(key, value)
    },

    addAll: function (items) {
        return this.push(items);
    },

    get: function (key) {
        return this.map[key]
    },

    remove: function (item, isKey) {
        if (!isKey) {
            var key = this.findKey(item);
            if (key !== undefined) {
                return this.removeAtKey(key)
            }
            return false
        }
        return this.removeAtKey(item)
    },

    removeAtKey: function (key) {
        if (this.containsKey(key)) {
            var value = this.map[key];
            delete this.map[key];
            --this.length;
            this.trigger('remove', this, key, value);
            return true;
        }
        return false;
    },

    containsKey: function (key) {
        return this.map[key] !== undefined;
    },

    contains: function (value) {
        return this.containsKey(this.findKey(value));
    },

    replace: function (key, value) {
        var old;
        if (arguments.length == 1) {
            value = key;
            key = this.getKey(key);
        }
        if (!this.containsKey(key)) {
            this.add(key, value);
            return value
        }
        old = this.map[key];
        this.map[key] = value;
        this.trigger('replace', this, key, value, old);
        return value
    },

    findKey: function (value) {
        var key;
        for (key in this.map) {
            if (this.map.hasOwnProperty(key) && this.map[key] === value) {
                return key
            }
        }
        return undefined
    },

    indexOf: function (key) {
        return this.map[key] !== undefined
    },

    clear: function (initial) {
        this.map = {};
        this.length = 0;
        if (initial !== true) {
            this.trigger('clear', this);
        }
        return this
    },

    eq: function (index) {
        var key, i = 0;
        index = index || 0;
        for (key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                if (index == i) {
                    return this.map[key]
                }
                i++
            }
        }
    },

    keys: function () {
        return this.getArray(true)
    },

    getKeys: function () {
        return this.keys()
    },

    values: function () {
        return this.getArray()
    },

    getValues: function () {
        return this.values();
    },

    getArray: function (isKey) {
        var arr = [],
            key;
        for (key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                arr.push(isKey ? key : this.map[key])
            }
        }
        return arr
    },

    each: function (fn, scope) {
        var items = Box.apply({}, this.map),
            len = this.length,
            i = 0,
            key;

        scope = scope || this;

        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], len, i) === false) {
                    break;
                }
                i++;
            }
        }

        return this
    },

    clone: function () {
        var hash = new (this.self)(this.initialConfig),
            key;
        for (key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                hash.push(key, this.map[key])
            }
        }
        return hash
    }

});
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
Box.define('Box.util.LocalStorage', {

    statics: {

        ID: +new Date,

        cache: {},

        get: function (id) {
            var cache = this.cache;
            var config = {_users: 1}, instance;
            if (Box.isString(id)) {
                config.id = id;
            } else {
                Box.apply(config, id);
            }
            if (!(instance = cache[config.id])) {
                instance = new this(config);
            } else {
                if (instance === true) {
                    Box.Error('Creating a shared instance of private local store "' + this.id + '".');
                }
                ++instance._users;
            }
            return instance;
        },

        supported: true

    },

    id: null,

    destroyed: false,

    lazyKeys: true,

    prefix: '',

    session: false,

    _keys: null,

    _store: null,

    _users: 0,

    constructor: function (config) {
        var statics = this.statics();
        Box.apply(this, config);
        this.id = this.id || statics.ID++;
        if (this._users) {
            statics.cache[this.id] = this
        } else {
            if (statics.cache[this.id]) {
                Box.Error('Cannot create duplicate instance of local store "' +
                    this.id + '". Use Box.util.LocalStorage.get() to share instances.');
            }
            statics.cache[this.id] = true;
        }
        this.initStore();
    },

    initStore: function () {
        if (!this.prefix && this.id) {
            this.prefix = this.id + '-';
        }
        this._store = (this.session ? Box.global.sessionStorage : Box.global.localStorage);
    },

    getKeys: function () {
        var store = this._store,
            prefix = this.prefix,
            keys = this._keys,
            prefixLen = prefix.length,
            key, i;

        if (!keys) {
            this._keys = keys = [];
            for (i = store.length; i--;) {
                key = store.key(i);
                if (key.length > prefixLen) {
                    if (prefix === key.substring(0, prefixLen)) {
                        keys.push(key.substring(prefixLen));
                    }
                }
            }
        }
        return keys
    },

    key: function (index) {
        var keys = this._keys || this.getKeys();
        return (0 <= index && index < keys.length) ? keys[index] : null;
    },

    release: function () {
        if (!--this._users) {
            this.destroy();
        }
    },

    set: function (key, value) {
        var iKey = this.prefix + key,
            store = this._store,
            keys = this._keys,
            length = store.length;

        store.setItem(iKey, value);
        if (keys && length !== store.length) {
            keys.push(key)
        }
    },

    get: function (key) {
        return this._store.getItem(this.prefix + key)
    },

    remove: function (key) {
        var iKey = this.prefix + key,
            store = this._store,
            keys = this._keys,
            length = store.length;

        store.removeItem(iKey);
        if (keys && length !== store.length) {
            if (this.lazyKeys) {
                this._keys = null;
            } else {
                Box.Array.remove(keys, key);
            }
        }
    },

    clear: function () {
        var store = this._store,
            prefix = this.prefix,
            keys = this._keys || this.getKeys(),
            i;

        for (i = keys.length; i--;) {
            store.removeItem(prefix + keys[i]);
        }
        keys.length = 0;
    }

}, function () {

    var LocalStorage = this;

    if ('LocalStorage' in window) {
        return;
    }

    if (!Box.browser.is('IE')) {
        LocalStorage.supported = false;
        LocalStorage.prototype.init = function () {
            Box.Error("Local storage is not supported on this browser");
        };
        return;
    }

    Box.apply(this.prototype, {})

});
Box.define('Box.util.KeyMap', {

    alternateClassName: 'Box.KeyMap',

    eventName: 'keydown',

    binding: null,

    target: null,

    processEventScope: null,

    //是否忽略对input等标签的处理
    ignoreInputFields: false,

    constructor: function (config) {
        if ((arguments.length !== 1) || (typeof config === 'string') || config.dom || config.tagName || config === document || config.isComponent) {
            this.legacyConstructor.apply(this, arguments);
            return;
        }
        Box.apply(this, config);
        this.bindings = [];

        if (!this.target.isComponent) {
            this.target = Box.get(this.target);
        }

        if (this.binding) {
            this.addBinding(this.binding);
        } else if (config.key) {
            this.addBinding(config);
        }
        this.enable();
    },

    legacyConstructor: function (el, binding, eventName) {
        Box.apply(this, {
            target: Box.get(el),
            eventName: eventName || this.eventName,
            bindings: []
        });
        if (binding) {
            this.addBinding(binding);
        }
        this.enable();
    },

    addBinding: function (binding) {
        var keyCode = binding.key,
            bindings = this.bindings,
            i, len;

        if (this.processing) {
            this.bindings = bindings.slice(0);
        }

        if (Box.isArray(binding)) {
            for (i = 0, len = binding.length; i < len; i++) {
                this.addBinding(binding[i]);
            }
            return;
        }

        this.bindings.push(Box.apply({
            keyCode: this.processKeys(keyCode)
        }, binding));
    },

    removeBinding: function (binding) {
        var bindings = this.bindings,
            len = bindings.length,
            keys, item, i;

        if (this.processing) {
            this.bindings = bindings.slice(0);
        }

        keys = this.processKeys(binding.key);
        for (i = 0; i < len; ++i) {
            item = bindings[i];
            if ((item.fn || item.handler) === (binding.fn || binding.handler) && item.scope === binding.scope) {
                if (binding.alt === item.alt && binding.crtl === item.crtl && binding.shift === item.shift) {
                    if (Box.Array.equals(item.keyCode, keys)) {
                        Box.Array.erase(this.bindings, i, 1);
                        return;
                    }
                }
            }
        }
    },

    processKeys: function (keyCode) {
        var processed = false,
            keys, key, keyString, len, i;

        if (Box.isString(keyCode)) {
            keys = [];
            keyString = keyCode.toUpperCase();

            for (i = 0, len = keyString.length; i < len; ++i) {
                keys.push(keyString.charCodeAt(i));
            }
            keyCode = keys;
            processed = true;
        }

        if (!Box.isArray(keyCode)) {
            keyCode = [keyCode];
        }

        if (!processed) {
            for (i = 0, len = keyCode.length; i < len; ++i) {
                key = keyCode[i];
                if (Box.isString(key)) {
                    keyCode[i] = key.toUpperCase().charCodeAt(0);
                }
            }
        }
        return keyCode;
    },

    handleTargetEvent: (function () {
        var tagRe = /input|textarea/i;
        return function (event) {
            var me = this,
                bindings, i, len,
                target, contentEditable;

            if (me.enabled) {
                bindings = me.bindings;
                i = 0;
                len = bindings.length;

                event = me.processEvent.apply(me || me.processEventScope, arguments);

                if (me.ignoreInputFields) {
                    target = event.target;
                    contentEditable = target.contentEditable;
                    if (tagRe.test(target.tagName) || (contentEditable === '' || contentEditable === 'true')) {
                        return;
                    }
                }

                if (Box.isEmpty(event.which)) {
                    return event;
                }
                me.processing = true;
                for (; i < len; ++i) {
                    me.processBinding(bindings[i], event);
                }
                me.processing = false;
            }
        }
    }()),

    processEvent: Box.identityFn,

    processBinding: function (binding, evnet) {
        if (this.checkModifiers(binding, event)) {
            var key = event.which,
                handler = binding.fn || binding.handler,
                scope = binding.scope || this,
                keyCode = binding.keyCode,
                defaultEventAction = binding.defaultEventAction,
                i,
                len;


            for (i = 0, len = keyCode.length; i < len; ++i) {
                if (key === keyCode[i]) {
                    if (handler.call(scope, key, event) !== true && defaultEventAction) {
                        if (defaultEventAction == 'stopEvent') {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            event[defaultEventAction]();
                        }
                    }
                    break;
                }
            }
        }
    },

    checkModifiers: function (binding, event) {
        var keys = ['shift', 'ctrl', 'alt'],
            len = keys.length,
            i = 0, key, val;

        for (; i < len; ++i) {
            key = keys[i];
            val = binding[key];
            if (!(val === undefined || (val === event[key + 'Key']))) {
                return false;
            }
        }
        return true;
    },

    on: function (key, fn, scope) {
        var keyCode, shift, ctrl, alt;
        if (Box.isObject(key) && !Box.isArray(key)) {
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        } else {
            keyCode = key;
        }
        this.addBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        });
    },

    un: function (key, fn, scope) {
        var keyCode, shift, ctrl, alt;
        if (Box.isObject(key) && !Box.isArray(key)) {
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        } else {
            keyCode = key;
        }
        this.removeBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        });
    },

    isEnabled: function () {
        return this.enabled;
    },

    enable: function () {
        if (!this.enabled) {
            this.__$handleTargetEvent = Box.Function.bind(this.handleTargetEvent, this);
            this.target.on(this.eventName, this.__$handleTargetEvent);
            this.enabled = true;
        }
    },

    disable: function () {
        if (this.enabled && this.__$handleTargetEvent) {
            this.target.off(this.eventName, this.__$handleTargetEvent);
            this.enabled = false;
        }
    },

    setDisabled: function (disabled) {
        if (disabled) {
            this.disable();
        } else {
            this.enable();
        }
    },

    destroy: function () {
        var target = this.target;
        this.bindings = [];
        this.disable();
        delete this.target;
    }

});
Box.define('Box.util.KeyNav', {

    alternateClassName: 'Box.KeyNav',

    requires: [Box.util.KeyMap],

    disabled: false,

    //stopPropagation preventDefault stopEvent
    defaultEventAction: 'stopEvent',

    forceKeyDown: false,

    eventName: 'keypress',

    processEventScope: null,

    ignoreInputFields: false,

    statics: {

        keyOptions: {
            left: 37,
            right: 39,
            up: 38,
            down: 40,
            space: 32,
            pageUp: 33,
            pageDown: 34,
            del: 46,
            backspace: 8,
            home: 36,
            end: 35,
            enter: 13,
            esc: 27,
            tab: 9
        }

    },

    constructor: function (config) {
        if (arguments.length === 2) {
            this.legacyConstructor.apply(this, arguments);
            return;
        }
        this.doConstruction(config);
    },

    legacyConstructor: function (el, config) {
        this.doConstruction(Box.apply({
            target: el
        }, config));
    },

    doConstruction: function (config) {
        var me = this,
            keymapCfg = {
                target: config.target,
                ignoreInputFields: config.ignoreInputFields,
                eventName: me.getKeyEvent('forceKeyDown' in config ? config.forceKeyDown : me.forceKeyDown, config.eventName),
                capture: config.capture
            },
            map;

        if (me.map) {
            me.map.destroy();
        }

        if (config.processEvent) {
            keymapCfg.processEvent = config.processEvent;
            keymapCfg.processEventScope = config.processEventScope || me;
        }

        if (config.keyMap) {
            map = me.map = config.keyMap;
        } else {
            map = me.map = new Box.util.KeyMap(keymapCfg);
            me.destroyKeyMap = true;
        }

        this.addBindings(config);

        map.disable();
        if (!config.disabled) {
            map.enable();
        }
    },

    addBindings: function (bindings) {
        var me = this,
            map = me.map,
            keyCodes = Box.util.KeyNav.keyOptions,
            defaultScope = bindings.scope || me;

        Box.Object.each(bindings, function (keyName, binding) {
            if (binding && (keyName.length === 1 || (keyName = keyCodes[keyName]) || (!isNaN(keyName = parseInt(keyName, 10))))) {
                if (typeof binding === 'function') {
                    binding = {
                        handler: binding,
                        defaultEventAction: (bindings.defaultEventAction !== undefined) ? bindings.defaultEventAction : me.defaultEventAction
                    };
                }
                map.addBinding({
                    key: keyName,
                    ctrl: binding.ctrl,
                    shift: binding.shift,
                    alt: binding.alt,
                    handler: Box.Function.bind(me.handleEvent, binding.scope || defaultScope, [binding.handler || binding.fn, me], true),
                    defaultEventAction: (binding.defaultEventAction !== undefined) ? binding.defaultEventAction : me.defaultEventAction
                });
            }
        }, this);
    },

    handleEvent: function (keyCode, event, handler, keyNav) {
        keyNav.lastKeyEvent = event;
        return handler.call(this, event);
    },

    destroy: function (removeEl) {
        if (this.destroyKeyMap) {
            this.map.destroy(removeEl);
        }
        delete this.map;
    },

    enable: function () {
        if (this.map) {
            this.map.enable();
            this.disabled = false;
        }
    },

    disable: function () {
        if (this.map) {
            this.map.disable();
        }
        this.disabled = true;
    },

    setDisabled: function (disabled) {
        this.map.setDisabled(disabled);
        this.disabled = disabled;
    },

    useKeyDown: Box.browser.is.WebKit ?
        parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
        !((Box.browser.is.Gecko && !window) || Box.browser.is.Opera),

    getKeyEvent: function (forceKeyDown, configuredEventName) {
        if (forceKeyDown || (this.useKeyDown && !configuredEventName)) {
            return 'keydown';
        } else {
            return configuredEventName || this.eventName;
        }
    }


});
Box.define('Box.util.LruCache', {

    extend: Box.util.HashMap,

    maxSize: null,

    constructor: function (config) {
        Box.apply(this, config);
        this.callParent([config]);
    },

    add: function (key, newValue) {
        var me = this,
            existingKey = me.findKey(newValue),
            entry;

        if (existingKey) {
            me.unlinkEntry(entry = me.map[existingKey]);
            entry.prev = me.last;
            entry.next = null;
        } else {
            entry = {
                prev: me.last,
                next: null,
                key: key,
                value: newValue
            };
        }

        if (me.last) {
            me.last.next = entry;
        } else {
            me.first = entry;
        }
        me.last = entry;
        me.callParent([key, entry]);
        me.prune();
        return newValue;
    },

    insertBefore: function (key, newValue, sibling) {
        var me = this,
            existingKey,
            entry;

        if (sibling = this.map[this.findKey(sibling)]) {
            existingKey = me.findKey(newValue);

            if (existingKey) {
                me.unlinkEntry(entry = me.map[existingKey]);
            } else {
                entry = {
                    prev: sibling.prev,
                    next: sibling,
                    key: key,
                    value: newValue
                };
            }

            if (sibling.prev) {
                entry.prev.next = entry;
            } else {
                me.first = entry;
            }
            entry.next = sibling;
            sibling.prev = entry;
            me.prune();
            return newValue;
        } else {
            return me.add(key, newValue);
        }
    },

    get: function (key) {
        var entry = this.map[key];
        if (entry) {
            if (entry.next) {
                this.moveToEnd(entry);
            }
            return entry.value;
        }
    },

    removeAtKey: function (key) {
        this.unlinkEntry(this.map[key]);
        return this.callParent(arguments);
    },

    clear: function (initial) {
        this.first = this.last = null;
        return this.callParent(arguments);
    },

    unlinkEntry: function (entry) {
        if (entry) {
            if (entry.next) {
                entry.next.prev = entry.prev;
            } else {
                this.last = entry.prev;
            }
            if (entry.prev) {
                entry.prev.next = entry.next;
            } else {
                this.first = entry.next;
            }
            entry.prev = entry.next = null;
        }
    },

    moveToEnd: function (entry) {
        this.unlinkEntry(entry);
        if (entry.prev = this.last) {
            this.last.next = entry;
        } else {
            this.first = entry;
        }
        this.last = entry;
    },

    getArray: function (isKey) {
        var arr = [],
            entry = this.first;

        while (entry) {
            arr.push(isKey ? entry.key : entry.value);
            entry = entry.next;
        }
        return arr;
    },

    each: function (fn, scope, reverse) {
        var me = this,
            entry = reverse ? me.last : me.first,
            length = me.length;

        scope = scope || me;
        while (entry) {
            if (fn.call(scope, entry.key, entry.value, length) === false) {
                break;
            }
            entry = reverse ? entry.prev : entry.next;
        }
        return me;
    },

    findKey: function (value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key].value === value) {
                return key;
            }
        }
        return undefined;
    },

    clone: function () {
        var newCache = new this.self(this.initialConfig),
            map = this.map,
            key;

        newCache.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                newCache.add(key, map[key].value);
            }
        }
        newCache.resumeEvents();
        return newCache;
    },

    prune: function () {
        var me = this,
            purgeCount = me.maxSize ? (me.length - me.maxSize) : 0;

        if (purgeCount > 0) {
            for (; me.first && purgeCount; purgeCount--) {
                me.removeAtKey(me.first.key);
            }
        }
    }
});

Box.define('Box.util.MD5', function () {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;
    /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = "";
    /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8;
    /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_md5(s) {
        return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }

    function b64_md5(s) {
        return binl2b64(core_md5(str2binl(s), s.length * chrsz));
    }

    function str_md5(s) {
        return binl2str(core_md5(str2binl(s), s.length * chrsz));
    }

    function hex_hmac_md5(key, data) {
        return binl2hex(core_hmac_md5(key, data));
    }

    function b64_hmac_md5(key, data) {
        return binl2b64(core_hmac_md5(key, data));
    }

    function str_hmac_md5(key, data) {
        return binl2str(core_hmac_md5(key, data));
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function md5_vm_test() {
        return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function core_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function core_hmac_md5(key, data) {
        var bkey = str2binl(key);
        if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
        return bin;
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        return str;
    }

    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    function binl2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }

    return {
        singleton: true,

        getMD5: function (text) {
            return hex_md5(text);
        }
    };

});
Box.define('Box.util.ImageLazyLoad', {

    mixins: {
        event: Box.util.Event
    },

    container: document,

    imageFlag: 'lazy-src',

    constructor: function (config) {
        Box.apply(this, config);
        this.mixins.event.constructor.call(this, config);

    }

});
Box.define('Box.tpl.Base', {

    requires: [
        Box.dom.Element,
        Box.Util.Format
    ],

    mixins: {
        event: Box.util.Event
    },

    uses: ['Box.dom.Helper'],

    isTemplate: true,

    scope: null,

    compiled: false,

    disableFormats: false,

    html: Box.emptyString,

    re: /\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,

    constructor: function (config) {
        var args = arguments,
            length = args.length,
            buffer = [],
            i = 0,
            value;

        if (length > 1) {
            for (; i < length; i++) {
                value = args[i];
                if (typeof value == 'object') {
                    Box.apply(this, value);
                } else {
                    buffer.push(value);
                }
            }
            this.html = buffer.join('');
        } else {
            if (Box.isArray(config) || Box.isString(config)) {
                this.html = Box.Array.toArray(config).join('');
            } else {
                if (Box.isArray(config.html)) {
                    config.html = config.html.join('');
                }
                Box.apply(this, config);
            }
        }
        this.mixins.event.constructor.call(this, config);

        this.scope = this.scope || this;
        this.compiled && this.compile();
    },

    apply: function (values) {
        var me = this,
            useFormat = this.disableFormats !== true,
            compiled = this.compiled,
            fm = Box.Util.Format,
            tpl = this.scope;

        if (compiled) {
            return compiled(values).join('');
        }

        function formatFn(m, name, format, args) {
            if (format && useFormat) {
                if (args) {
                    args = [values[name]].concat(Box.functionFactory('return [' + args + ']')());
                } else {
                    args = [values[name]];
                }
                if (format.substr(0, 5) == 'this.') {
                    return tpl[format.substr(5)].apply(tpl, args);
                } else {
                    return fm[format].apply(fm, args);
                }
            } else {
                return values[name] !== undefined ? values[name] : Box.emptyString;
            }
        }

        var ret = this.html.replace(this.re, formatFn);
        return ret
    },

    applyTemplate: function () {
        return this.apply.apply(this, arguments);
    },

    applyOther: function (values, other) {
        var compiled = this.compiled;
        if (compiled) {
            other.push.apply(other, compiled(values));
        } else {
            other.push(this.apply(values));
        }
        return other;
    },

    compileARe: /\\/g,

    compileBRe: /(\r\n|\n)/g,

    compileCRe: /'/g,

    compile: function () {
        var me = this,
            fm = Box.Util.Format,
            useFormat = this.disableFormats !== true,
            tpl = this.scope,
            body, bodyReturn;

        function compileFn(m, name, format, args) {
            if (format && useFormat) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                } else {
                    format = 'tpl.' + format.substr(5) + '(';
                }
            } else {
                args = '';
                format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'," + format + "values['" + name + "']" + args + ") ,'";
        }

        this.html = bodyReturn = this.html.replace(this.compileARe, '\\\\').replace(this.compileBRe, '\\n').replace(this.compileCRe, '\\').replace(this.re, compileFn);
        eval("this.compiled = function (values) { return ['" + bodyReturn + "']; }");
        return this;
    },

    prepend: function (el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    before: function (el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    after: function (el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    append: function (el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert: function (where, el, values, returnElement) {
        var newNode = Box.dom.Helper.insertHtml(where, Box.getDom(el), this.apply(values));
        return returnElement ? Box.get(newNode) : newNode;
    },

    overwrite: function (el, values, returnElement) {
        var newNode = Box.dom.Helper.overwrite(Box.getDom(el), this.apply(values));
        return returnElement ? Box.get(newNode) : newNode;
    }

});
Box.define('Box.tpl.TemplateParser', {

    useFormat: false,

    definitions: false,

    constructor: function (config) {
        Box.apply(this, config);
    },

    doTpl: Box.emptyFn,

    parse: function (str) {
        var me = this,
            len = str.length,
            aliases = {
                elseif: 'elif'
            },
            topRe = me.topRe,
            actionsRe = me.actionsRe,
            index, stack, s, m, t, prev, frame, subMatch, begin, end, actions,
            prop;

        me.level = 0;
        me.stack = stack = [];

        for (index = 0; index < len; index = end) {
            topRe.lastIndex = index;
            m = topRe.exec(str);

            if (!m) {
                me.doText(str.substring(index, len));
                break;
            }

            begin = m.index;
            end = topRe.lastIndex;

            if (index < begin) {
                me.doText(str.substring(index, begin));
            }

            if (m[1]) {
                end = str.indexOf('%}', begin + 2);
                me.doEval(str.substring(begin + 2, end));
                end += 2;
            } else if (m[2]) {
                end = str.indexOf(']}', begin + 2);
                me.doExpr(str.substring(begin + 2, end));
                end += 2;
            } else if (m[3]) {
                me.doTag(m[3]);
            } else if (m[4]) {
                actions = null;
                while ((subMatch = actionsRe.exec(m[4])) !== null) {
                    s = subMatch[2] || subMatch[3];
                    if (s) {
                        s = Box.String.htmlDecode(s);
                        t = subMatch[1];
                        t = aliases[t] || t;
                        actions = actions || {};
                        prev = actions[t];

                        if (typeof prev == 'string') {
                            actions[t] = [prev, s];
                        } else if (prev) {
                            actions[t].push(s);
                        } else {
                            actions[t] = s;
                        }
                    }
                }

                if (!actions) {
                    if (me.elseRe.test(m[4])) {
                        me.doElse();
                    } else if (me.defaultRe.test(m[4])) {
                        me.doDefault();
                    } else {
                        me.doTpl();
                        stack.push({
                            type: 'tpl'
                        });
                    }
                } else if (actions['if']) {
                    me.doIf(actions['if'], actions);
                    stack.push({
                        type: 'if'
                    });
                } else if (actions['switch']) {
                    me.doSwitch(actions['switch'], actions);
                    stack.push({
                        type: 'switch'
                    });
                } else if (actions['case']) {
                    me.doCase(actions['case'], actions);
                } else if (actions['elif']) {
                    me.doElseIf(actions['elif'], actions);
                } else if (actions['for']) {
                    ++me.level;

                    if (prop = me.propRe.exec(m[4])) {
                        actions.propName = prop[1] || prop[2];
                    }
                    me.doFor(actions['for'], actions);
                    stack.push({
                        type: 'for',
                        actions: actions
                    });
                } else if (actions['foreach']) {
                    ++me.level;

                    if (prop = me.propRe.exec(m[4])) {
                        actions.propName = prop[1] || prop[2];
                    }
                    me.doForEach(actions['foreach'], actions);
                    stack.push({
                        type: 'foreach',
                        actions: actions
                    });
                } else if (actions.exec) {
                    me.doExec(actions.exec, actions);
                    stack.push({
                        type: 'exec',
                        actions: actions
                    });
                }
            } else if (m[0].length === 5) {
                stack.push({
                    type: 'tpl'
                });
            } else {
                frame = stack.pop();
                me.doEnd(frame.type, frame.actions);
                if (frame.type == 'for' || frame.type == 'foreach') {
                    --me.level;
                }
            }
        }
    },

    topRe: /(?:(\{\%)|(\{\[)|\{([^{}]+)\})|(?:<tpl([^>]*)\>)|(?:<\/tpl>)/g,

    actionsRe: /\s*(elif|elseif|if|for|foreach|exec|switch|case|eval|between)\s*\=\s*(?:(?:"([^"]*)")|(?:'([^']*)'))\s*/g,

    propRe: /prop=(?:(?:"([^"]*)")|(?:'([^']*)'))/,

    defaultRe: /^\s*default\s*$/,

    elseRe: /^\s*else\s*$/

});
Box.define('Box.tpl.TemplateCompiler', {

    extend: Box.tpl.TemplateParser,

    useEval: true,

    useIndex: true,

    propNameRe: /^[\w\d\$]*$/,

    definitions: [],

    fnArgs: 'out, values, parent, xindex, xcount, xkey',

    constructor: function () {
        this.callParent(arguments);
        this.callFn = '.call(this,' + this.fnArgs + ')';
    },

    compile: function (tpl) {
        var me = this,
            code = me.generate(tpl);

        var ret = me.useEval ? me.evalTpl(code) : (new Function('Box', code))(Box);
        return ret
    },

    generate: function (tpl) {
        var me = this,
            definitions = 'var fm=Box.Util.Format,ts=Object.prototype.toString;',
            code;

        me.maxLevel = 0;

        me.body = [
            'var c0=values, a0=' + me.createArrayTest(0) + ', p0=parent, n0=xcount, i0=xindex, k0, v;\n'
        ];

        if (me.definitions) {
            if (typeof me.definitions === 'string') {
                me.definitions = [me.definitions, definitions];
            } else {
                me.definitions.push(definitions);
            }
        } else {
            me.definitions = [definitions];
        }
        me.switches = [];

        me.parse(tpl);

        me.definitions.push(
            (me.useEval ? '$=' : 'return') + ' function (' + me.fnArgs + ') {',
            me.body.join(''),
            '}'
        );

        code = me.definitions.join('\n');

        me.definitions.length = me.body.length = me.switches.length = 0;
        delete me.definitions;
        delete me.body;
        delete me.switches;

        return code;
    },

    doText: function (text) {
        var me = this,
            out = me.body;

        text = text.replace(me.aposRe, "\\'").replace(me.newLineRe, '\\n');
        if (me.useIndex) {
            out.push('out[out.length]=\'', text, '\'\n');
        } else {
            out.push('out.push(\'', text, '\')\n');
        }
    },

    doExpr: function (expr) {
        var out = this.body;
        out.push('if ((v=' + expr + ') != null) out');
        if (this.useIndex) {
            out.push('[out.length]=v+\'\'\n');
        } else {
            out.push('.push(v+\'\')\n');
        }
    },

    doTag: function (tag) {
        var expr = this.parseTag(tag);
        if (expr) {
            this.doExpr(expr);
        } else {
            this.doText('{' + tag + '}');
        }
    },

    doElse: function () {
        this.body.push('} else {\n');
    },

    doEval: function (text) {
        this.body.push(text, '\n');
    },

    doIf: function (action, actions) {
        var me = this;
        if (action === '.') {
            me.body.push('if (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('if (', me.parseTag(action), ') {\n');
        } else {
            me.body.push('if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doElseIf: function (action, actions) {
        var me = this;

        if (action === '.') {
            me.body.push('else if (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('} else if (', me.parseTag(action), ') {\n');
        } else {
            me.body.push('} else if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doSwitch: function (action) {
        var me = this;

        if (action === '.') {
            me.body.push('switch (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('switch (', me.parseTag(action), ') {\n');
        } else {
            me.body.push('switch (', me.addFn(action), me.callFn, ') {\n');
        }
        me.switches.push(0);
    },

    doCase: function (action) {
        var me = this,
            cases = Box.isArray(action) ? action : [action],
            n = me.switches.length - 1,
            match, i;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        for (i = 0, n = cases.length; i < n; ++i) {
            match = me.intRe.exec(cases[i]);
            cases[i] = match ? match[1] : ("'" + cases[i].replace(me.aposRe, "\\'") + "'");
        }

        me.body.push('case ', cases.join(': case '), ':\n');
    },

    doDefault: function () {
        var me = this,
            n = me.switches.length - 1;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        me.body.push('default:\n');
    },

    doEnd: function (type, actions) {
        var me = this,
            L = me.level - 1;

        if (type == 'for' || type == 'foreach') {
            if (actions.exec) {
                me.doExec(actions.exec);
            }
            me.body.push('}\n');
            me.body.push('parent=p', L, ';values=r', L + 1, ';xcount=n' + L + ';xindex=i', L, '+1;xkey=k', L, ';\n');
        } else if (type == 'if' || type == 'switch') {
            me.body.push('}\n');
        }
    },

    doFor: function (action, actions) {
        var me = this,
            s,
            L = me.level,
            up = L - 1,
            parentAssignment;

        if (action === '.') {
            s = 'values';
        } else if (me.propNameRe.test(action)) {
            s = me.parseTag(action);
        } else {
            s = me.addFn(action) + me.callFn;
        }

        if (me.maxLevel < L) {
            me.maxLevel = L;
            me.body.push('var ');
        }

        if (action == '.') {
            parentAssignment = 'c' + L;
        } else {
            parentAssignment = 'a' + up + '?c' + up + '[i' + up + ']:c' + up;
        }

        me.body.push('i', L, '=0,n', L, '=0,c', L, '=', s, ',a', L, '=', me.createArrayTest(L), ',r', L, '=values,p', L, ',k', L, ';\n',
            'p', L, '=parent=', parentAssignment, '\n',
            'if (c', L, '){if(a', L, '){n', L, '=c', L, '.length;}else if (c', L, '.isMixedCollection){c', L, '=c', L, '.items;n', L, '=c', L, '.length;}else if(c', L, '.isStore){c', L, '=c', L, '.data.items;n', L, '=c', L, '.length;}else{c', L, '=[c', L, '];n', L, '=1;}}\n',
            'for (xcount=n', L, ';i', L, '<n' + L + ';++i', L, '){\n',
            'values=c', L, '[i', L, ']');
        if (actions.propName) {
            me.body.push('.', actions.propName);
        }
        me.body.push('\n',
            'xindex=i', L, '+1\n');

        if (actions.between) {
            me.body.push('if(xindex>1){ out.push("', actions.between, '"); } \n');
        }
    },

    doForEach: function (action, actions) {
        var me = this,
            s,
            L = me.level,
            up = L - 1,
            parentAssignment;

        if (action === '.') {
            s = 'values';
        } else if (me.propNameRe.test(action)) {
            s = me.parseTag(action);
        } else {
            s = me.addFn(action) + me.callFn;
        }

        if (me.maxLevel < L) {
            me.maxLevel = L;
            me.body.push('var ');
        }

        if (action == '.') {
            parentAssignment = 'c' + L;
        } else {
            parentAssignment = 'a' + up + '?c' + up + '[i' + up + ']:c' + up;
        }

        me.body.push('i', L, '=-1,n', L, '=0,c', L, '=', s, ',a', L, '=', me.createArrayTest(L), ',r', L, '=values,p', L, ',k', L, ';\n',
            'p', L, '=parent=', parentAssignment, '\n',
            'for(k', L, ' in c', L, '){\n',
            'xindex=++i', L, '+1;\n',
            'xkey=k', L, ';\n',
            'values=c', L, '[k', L, '];');
        if (actions.propName) {
            me.body.push('.', actions.propName);
        }

        if (actions.between) {
            me.body.push('if(xindex>1){ out.push("', actions.between, '"); } \n');
        }
    },

    createArrayTest: ('isArray' in Array) ? function (L) {
        return 'Array.isArray(c' + L + ')';
    } : function (L) {
        return 'ts.call(c' + L + ')==="[object Array]"';
    },

    doExec: function (action, actions) {
        var me = this,
            name = 'f' + me.definitions.length;

        me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
            ' try { with(values) {',
            '  ' + action,
            ' }} catch(e) {',
            '   Box.log("XTemplate Error: " + e.message);',
            '}',
            '}');

        me.body.push(name + me.callFn + '\n');
    },

    addFn: function (body) {
        var me = this,
            name = 'f' + me.definitions.length;

        if (body === '.') {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                ' return values',
                '}');
        } else if (body === '..') {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                ' return parent',
                '}');
        } else {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                ' try { with(values) {',
                '  return(' + body + ')',
                ' }} catch(e) {',
                '   Box.log("XTemplate Error: " + e.message);',
                '}',
                '}');
        }

        return name;
    },

    parseTag: function (tag) {
        var me = this,
            m = me.tagRe.exec(tag),
            name, format, args, math, v;

        if (!m) {
            return null;
        }

        name = m[1];
        format = m[2];
        args = m[3];
        math = m[4];

        if (name == '.') {
            if (!me.validTypes) {
                me.definitions.push('var validTypes={string:1,number:1,boolean:1};');
                me.validTypes = true;
            }
            v = 'validTypes[typeof values] || ts.call(values) === "[object Date]" ? values : ""';
        } else if (name == '#') {
            v = 'xindex';
        } else if (name == '$') {
            v = 'xkey';
        } else if (name.substr(0, 7) == "parent.") {
            v = name;
        } else if (isNaN(name) && name.indexOf('-') == -1 && name.indexOf('.') != -1) {
            v = "values." + name;
        } else {
            v = "values['" + name + "']";
        }

        if (math) {
            v = '(' + v + math + ')';
        }

        if (format && me.useFormat) {
            args = args ? ',' + args : "";
            if (format.substr(0, 5) != "this.") {
                format = "fm." + format + '(';
            } else {
                format += '(';
            }
        } else {
            return v;
        }

        return format + v + args + ')';
    },

    evalTpl: function ($) {
        eval($);
        return $;
    },

    newLineRe: /\r\n|\r|\n/g,

    aposRe: /[']/g,

    intRe: /^\s*(\d+)\s*$/,

    tagRe: /^([\w-\.\#\$]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?$/

});
Box.define('Box.tpl.Template', {

    extend: Box.tpl.Base,

    requires: [Box.tpl.TemplateCompiler],

    scope: null,

    compiled: false,

    disableFormats: false,

    definitions: false,

    html: Box.emptyString,

    emptyObj: {},

    apply: function (values, parent) {
        return this.applyOther(values, [], parent).join('')
    },

    applyOther: function (values, out, parent) {
        var compiler;

        if (!this.fn) {
            compiler = new Box.tpl.TemplateCompiler({
                useFormat: this.disableFormats !== true,
                definitions: this.definitions
            });
            this.fn = compiler.compile(this.html);
        }

        try {
            this.fn.call(this.scope, out, values, parent || this.emptyObj, 1, 1);
        } catch (e) {
            Box.Error({
                className: "Box.XTemplate",
                methodName: "applyOther",
                error: e.message
            })
        }

        return out;
    },

    compile: function () {
        return this
    }

});
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
Box.define('Box.ComponentTplFactory', {

    statics: {

        TEMPLATE_SCOPE_END_PREFIX: 'TemplateHelpers'

    },

    requires: [
        Box.util.JSON,
        Box.util.HashMap,
        Box.dom.Helper,
        Box.ComponentTplCompile
    ],

    singleton: true,

    pools: {},

    register: function (pro, templates) {
        var unloaded = [];
        Box.Object.each(templates, function (key, item) {
            item.name = key;
            this.push2Pools(pro, [item]);
            if (item.id) {
                item.content = this.parseElementTemplateContent(item.id);
            }
            if (item.content) {
                this.setContent(pro, item.name, item.content);
            } else if (!Box.isEmpty(item.path)) {
                if (!this.isLoaded(pro, item.name)) {//如果没有加载模板,就需要加载一下
                    unloaded.push(item);
                }
                else {//已经加载过了,就关联一下
                    this.setContent(pro, item.name, Box.requireSync('text!' + item.path))
                }
            }
        }, this);
        this.proxy(pro, unloaded);
    },

    parseElementTemplateContent: function (id) {
        var element = Box.get('#' + id).hide();
        if (Box.isEmpty(element)) {
            return Box.dom.Helper.parse({tag: 'div'});
        }
        return element.html();
    },

    push2Pools: function (pro, templates) {
        var name = pro.$className,
            manager;

        if (!(manager = this.pools[name])) {
            manager = this.pools[name] = new Box.util.HashMap({
                getKey: function (item) {
                    return item.name;
                }
            });
        }
        Box.Array.forEach(templates, function (template, i) {
            if (Box.isEmpty(manager.get(template.name))) {
                manager.push(template.name, template);
            }
        }, this);
    },

    proxy: function (pro, templates, params, callback) {
        templates = Box.isArray(templates) ? templates : [templates];
        if (Box.isEmpty(templates)) {
            return;
        }
        if (Box.isEmpty(Box.TEMPLATE_SERVER_URL)) {
            Box.Array.forEach(templates, function (tpl) {
                this.setContent(pro, tpl.name, Box.requireSync('text!' + tpl.path));
            }, this);
        } else {
            var proxyConfig = {
                async: false,
                type: Box.TEMPLATE_SERVER_METHOD || "GET",
                url: Box.TEMPLATE_SERVER_URL
            }, me = this;
            proxyConfig.data = Box.apply({
                templates: Box.util.JSON.encode(templates)
            }, params || {});
            var call_fn = function (data) {
                if (Box.isFunction(callback)) {
                    data = callback.call(pro, data);
                }
                Box.Object.each(data, function (name, content) {
                    this.setContent(pro, name, content);
                }, me);
            };
            Box.DOM_QUERY.ajax(proxyConfig).done(call_fn);
        }
    },

    compile: function (pro, name, content) {
        var scope_end_prefix = this.statics().TEMPLATE_SCOPE_END_PREFIX;
        var compiler = Box.ComponentTplCompile[Box.TEMPLATE_TYPE];
        var compile;

        if (Box.isString(content) || Box.isArray(content)) {
            var scope = pro[name + scope_end_prefix] || pro;
            content = Box.isArray(content) ? content.join('') : content;
            compile = compiler(content, scope);
        } else if (Box.isFunction(content)) {
            compile = content;
        }
        if (Box.isEmpty(compile)) {
            compile = function () {
                return Box.dom.Helper.parse({tag: 'div'});
            }
        }
        pro.__$setCompileTemplate(name, compile);
    },

    setContent: function (pro, name, content) {
        var template = this.get(pro, name);
        this.compile(pro, name, content);
        return template.content = content;
    },

    isLoaded: function (pro, name) {
        var template = this.get(pro, name);
        return !Box.isEmpty(template.content);
    },

    get: function (pro, name) {
        var manager = this.pools[pro.$className];
        if (Box.isEmpty(manager)) {
            return null;
        }
        return manager.get(name);
    }

});

//定义组件基类
Box.define('Box.Component', {

    statics: {

        ON_RENDER_ATTR_PREFIX: '_onChangeFor',

        GENERATE_ID_PREFIX: 'HY_ELEMENT_',

        GENERATE_INDEX: +new Date,

        getGenerateID: function () {
            return this.GENERATE_ID_PREFIX + ++this.GENERATE_INDEX
        }

    },

    extend: Box.Base,

    mixins: {
        event: Box.util.Event
    },

    requires: [
        Box.dom.Helper,
        Box.dom.Element,
        Box.tpl.Base,
        Box.tpl.Template,
        Box.ComponentTplFactory
    ],

    elements: {},

    events: {},

    delegates: {},

    templates: {},

    listeners: {},

    target: null,

    renderTo: null,

    autoRender: true,

    isComponent: true,

    setElementId: function (element) {
        var statics = this.statics(),
            me = this;

        if (Box.isEmpty(element)) {
            return;
        }

        if (element.jquery) {
            element.each(function () {
                me.setElementId(this);
            })
        } else if (Box.isArray(element)) {
            Box.Array.forEach(element, function (ele) {
                this.setElementId(ele);
            }, this)
        } else if (Box.isElement(element)) {
            if (Box.isEmpty(element.id)) {
                element.id = statics.getGenerateID();
            }
        }
    },

    //类的初始化
    constructor: function (config) {

        var thisClassName = this.$className;


        if (Box.app.Application.name == "HY" && HY.Context && HY.Context.userMenu && HY.Context.userMenu.length > 0) {

            //根据菜单配置实现不同的页面展示
            for (var i = 0; i < HY.Context.userMenu.length; i++) {
                if ((Box.app.Application.name + '.' + HY.Context.userMenu[i].ClassName) == thisClassName && HY.Context.userMenu[i].MapUrlClass != null && HY.Context.userMenu[i].MapUrlClass != "" && HY.Context.userMenu[i].MapUrlClass != thisClassName) {
                    return Box.apply(this, Box.create(HY.Context.userMenu[i].MapUrlClass, config));
                }
            }


            //根据当前创建的class,在menu里面查找,如果有对应的menu,那就把相应的FunctionUID记录下来,传给后台做权限控制
            //var hasFoundUID = false;
            for (var i = 0; i < HY.Context.userMenu.length; i++) {
                if ((Box.app.Application.name + '.' + HY.Context.userMenu[i].ClassName) == thisClassName) {
                    $('#currentFunctionUID').val(HY.Context.userMenu[i].UID);
                    $('#currentFunctionUID').attr('data-operationtype', HY.Context.userMenu[i].OperationType);
                    // hasFoundUID = true;
                    break;
                }
            }

            //如果上面那种方法取不到,再用下面的方法试一下,取className的前面几个点来比较,如果相同则认为是同一个功能,注意:这种方法存在问题
            if (!$('#currentFunctionUID').val()) {
                for (var i = 0; i < HY.Context.userMenu.length; i++) {
                    if (HY.Context.userMenu[i].ClassName) {
                        var thisClassNameList = thisClassName.split('.');
                        var menuClassNameList = HY.Context.userMenu[i].ClassName.split('.');

                        thisClassNameList.splice(thisClassNameList.length - 1, 1);
                        menuClassNameList.splice(menuClassNameList.length - 1, 1);

                        if (thisClassNameList.join('.') == Box.app.Application.name + '.' + menuClassNameList.join('.')) {
                            $('#currentFunctionUID').val(HY.Context.userMenu[i].UID);
                            $('#currentFunctionUID').attr('data-operationtype', HY.Context.userMenu[i].OperationType)
                            break;
                        }
                    }
                }
            }

        }


        var statics = this.statics();

        if (Box.isEmpty(config)) {
            config = {};
        }

        Box.apply(this, config);

        this.initialConfig = config;

        this.__$name = statics.getGenerateID();

        this.mixins.event.constructor.call(this, config);

        this.setting();

        this.initTemplates();

        if (this.autoRender) {
            this.render();
        }

        return this;
    },

    setting: Box.emptyFn,

    reRender: function () {
        if (this.rendered) {
            this.destroy(true);
            this.destroyed = false;
            this.rendered = false;

            var statics = this.statics();

            this.__$name = statics.getGenerateID();

            this.setting();

            this.initTemplates();

            this.render();
        }
    },

    beforeRender: function () {
        var target = this.target;
        this.el = this.el || {};
        if (target) {
            this.el.target = Box.get(target);
        } else if (this.tpl.main) {
            this.el.target = this.applyTemplate('main');
        }
        if (Box.isEmpty(this.el.target)) {
            Box.Error('the.el.target is undefined');
        }

        this.setElementId(this.el.target);
    },

    render: function (renderTo) {
        if (this.rendered) {
            this.destroy(false);
            this.destroyed = false;
            this.rendered = false;
            this.render();
            return;
        }

        if (!this.rendered && (this.trigger('beforerender', this) !== false)) {
            this.beforeRender();
            this.onRender(renderTo);
            this.afterRender();
        }
    },

    onRender: function (renderTo) {
        renderTo = Box.get(renderTo || this.renderTo);
        if (renderTo && renderTo.length > 0) {
            if (Box.isFunction(this.renderToFn)) {
                this.renderToFn(this.el.target, renderTo);
            } else {
                renderTo.append(this.el.target);
            }
        }

        this.applyElements();
        this.initEvents();
        this.initDelegates();
        this.initAttrsForRender();
        this.trigger('render', this);
    },

    afterRender: function () {
        this.trigger('afterrender', this);
        this.beforeSetup();
        this.setup();
        this.rendered = true;
        this.afterSetup();
        this.__setPermission();
    },

    //权限控制现在一共分为三类按钮,grid的列和里面的链接
    //这儿处理的是按钮和grid的列, grid里面的链接放到HYGrid里面的绑定事件处理了  可以搜索  var aEl = this.wrapper.find('a[data-operationtype="1"]');  找到

    //对页面上的按钮,指定列 进行权限控制
    __setPermission: function () {
        //判断当前页面的权限如果是只读的话,就把页面上的设置为编辑权限的按钮隐藏
        if ((this.$params && this.$params.OperationType == 0) || ($('#currentFunctionUID').attr('data-operationtype') == 0)) {
            //对按钮进行处理
            this.el.target.find('.k-button[data-operationtype="1"]').hide();

            //对grid里面的列进行处理
            this.el.target.find('.k-grid').each(function (index, element) {
                var grid = $(element).data('kendoGrid');
                if (grid) {
                    for (var i = 0; i < grid.columns.length; i++) {
                        if (grid.columns[i].operationType == 1) {
                            grid.hideColumn(i);
                        }
                    }
                }
            });
        }
    },

    beforeSetup: Box.emptyFn,

    afterSetup: Box.emptyFn,

    //提供给子类覆盖的初始化方法
    setup: Box.emptyFn,

    renderToFn: null,

    initAttrsForRender: function () {
        var me = this,
            statics = this.statics();
        Box.Object.each(this.attrs, function (attr) {
            var name = statics.ON_RENDER_ATTR_PREFIX + Box.String.firstUpperCase(attr);

            if (this[name]) {
                var value = this.get(attr);
                if (!Box.isEmpty(value)) {
                    this[name](value, undefined, attr);
                }
                (function (name) {
                    me.on('change:' + attr, function (val, prev, key) {
                        this[name](val, prev, key);
                    })
                })(name);
            }
        }, this)
    },

    initTemplates: function () {

        var tpls = this.templates, applyFn;
        if (typeof tpls === 'string') {
            tpls = {
                main: {name: 'main', path: tpls}
            };
        } else if (Box.isObject(tpls)) {
            tpls = Box.apply({}, this.templates, {});
        }

        Box.Object.each(tpls, function (name, tpl) {
            if (Box.isString(tpl)) {
                tpls[name] = Box.String.has(tpl, '.') ?
                    {name: name, path: tpl} :
                    {name: name, id: tpl};
            } else if (Box.isArray(tpl) || Box.isFunction(tpl)) {
                tpls[name] = {name: name, content: tpl};
            }
            applyFn = 'apply' + Box.String.firstUpperCase(name) + 'Template';
            this[applyFn] = function (data, isHtml) {
                return this.applyTemplate(name, data, isHtml);
            }
        }, this);
        this.tpl = {};
        Box.ComponentTplFactory.register(this, tpls);
    },

    __$setCompileTemplate: function (name, compile) {
        return this.tpl[name] = compile;
    },

    applyTemplate: function (name, data, isHtml) {
        var template = this.tpl[name];
        if (name == 'main') {
            data = Box.apply({}, this.getMainTplData());
        }
        var html = template.isTemplate ? template.apply(data) : template.call(this, data);
        return isHtml ? html : Box.get(html);
    },

    // type 的类型为：append、prepend、after、before、overwrite
    applyTemplateTo: function (name, data, el, type, isHtml) {
        var template = this.tpl[name];
        if (!template.isTemplate) {
            var html = template.call(this, data);
            var ret = isHtml ? html : Box.get(html);
            if (type == 'overwrite') {
                type = 'html';
            }
            el[type](html);
            return ret;
        }
        return template[type](el, data, isHtml);
    },

    getMainTplData: function () {
        return {};
    },

    applyElements: function (elements) {
        Box.Object.each(elements || this.elements || {}, function (name, selector) {
            this.element(name, selector, true);
        }, this);
    },

    element: function (name, selector, ignoreEvents) {
        var elements, index = -1, content = this.el;

        if (Box.isEmpty(selector)) {
            return;
        }

        if (Box.isString(selector)) {
            index = selector.indexOf('@');
            elements = index < 0 ? content.target.find(selector) :
                content[selector.substr(0, index)].find(selector.substr(index + 1));
        } else {
            if (selector.jquery) {
                elements = selector;
            } else {
                elements = Box.get(selector);
            }
        }

        this.__event_cache = this.__event_cache || {};

        var cache = this.__event_cache[name] || {};

        if (Box.isEmpty(content[name])) {
            content[name] = elements;
        } else {
            content[name] = content[name].add(elements);
        }

        if (!ignoreEvents) {
            Box.Object.each(cache, function (type, handlers) {
                Box.Array.forEach(handlers || [], function (handler) {
                    this.mon(elements, type, handler);
                }, this);
            }, this);
        }

        return elements;
    },

    __$eventReg: /([a-z]+)\s+([a-zA-Z0-9_-]+)(\s+\{([^\{\}]+)\})?/,

    initEvents: function (events) {
        events = events || Box.apply({}, this.events);
        if (Box.isEmpty(events)) {
            return;
        }

        Box.Object.each(events, function (name, handler) {
            var regObj = name.match(this.__$eventReg);

            var name = regObj[2];
            var type = regObj[1];
            var selector = regObj[4];
            var target;

            if (!Box.isEmpty(selector)) {
                this.applyElements((function () {
                    var selector_option = {};
                    selector_option[name] = selector;
                    return selector_option;
                })())
            }
            if (!Box.isEmpty(target = this.el[name])) {
                var cache = this.__event_cache[name] = this.__event_cache[name] || {};
                cache[type] = cache[type] || [];
                cache[type].push(handler);
                this.mon(target, type, handler);
            }
        }, this);
    },

    mon: function (target, type, handler, scope) {
        var me = this;

        if (Box.isString(handler)) {
            handler = this[handler];
        }

        if (!Box.isFunction(handler) || Box.isEmpty(target)) {
            return;
        }

        if (Box.isString(target)) {
            target = this.el[target];
        }

        target.bind(type || Box.EventType.CLICK, function (e) {
            return handler.call(scope || me, e, Box.get(this), me);
        });

        return this;
    },

    unmon: function (target, type) {
        target = Box.isString(target) ? this.el[target] : target;
        if (Box.isEmpty(target)) {
            return;
        }
        if (Box.isEmpty(type)) {
            target.unbind();
        } else {
            target.unbind(type);
        }
        return this;
    },

    initDelegates: function () {
        var delegates = Box.apply({}, this.delegates);
        Box.Object.each(delegates, function (selector, handler) {
            this.don(selector, handler);
        }, this);
    },

    __$delegateReg: /([a-z]+)\s+\{([^\{\}]+)\}/,

    don: function (name, handler, scope) {
        var me = this;
        handler = this[handler];
        if (!Box.isFunction(handler)) {
            return;
        }

        var regObj = name.match(this.__$delegateReg);
        var type = Box.EventType.CLICK, selector;

        if (Box.isEmpty(regObj)) {
            selector = name;
        } else {
            type = regObj[1];
            selector = regObj[2];
        }

        this.el.target.delegate(selector, type, function (e) {
            var target = Box.get(e.target);
            if (!target.is(selector)) {
                target = target.closest(selector).eq(0);
            }
            if (handler.call(scope || me, e, target, me) === false) {
                e.stopPropagation();
                return false;
            }
            return true;
        })
    },

    undon: function (selector, type) {
        this.el.target.undelegate(selector, type || Box.EventType.CLICK);
    },

    _bindBtnHandler: function (target, type, handler, button, scope) {
        var me = this;

        if (Box.isString(handler)) {
            handler = this[handler];
        }

        if (!Box.isFunction(handler) || Box.isEmpty(target)) {
            return this;
        }

        if (Box.isString(target)) {
            target = this.el[target];
        }

        target.bind(type || Box.EventType.CLICK, function (e) {
            if (!target.attr("disabled")) {
                me.trigger('click' + Box.String.firstUpperCase(button.name) + 'Btn', me, target);
                return handler.call(scope || me, e, Box.get(this), me);
            }
        });

        return this;
    },

    beforeDestroy: function () {
        Box.Object.each(this.__event_cache, function (name, events) {
            var elements = this.el[name];
            elements && elements.jquery && elements.unbind();
            delete this.__event_cache[name];
        }, this);
        this.el.target.undelegate();
        Box.Object.each(this.tpl, function (name) {
            delete this.tpl[name];
        }, this);
        this.tpl = null;
    },

    destroy: function (retain) {
        if (this.destroyed || this.trigger('beforedestroy', this) === false) {
            return;
        }
        this.beforeDestroy();
        this.onDestroy();
        this.afterDestroy(retain);
    },

    onDestroy: function () {
        Box.Object.each(this.el || {}, function (name, el) {
            if (name == 'target') {
                return;
            }
            if (el.jquery) {
                el.remove();
            } else if (Box.isArray(el)) {
                Box.Array.forEach(el, function (e) {
                    e.remove();
                }, this);
            } else if (Box.isObject(el)) {
                Box.Object.each(el, function (n, e) {
                    e.remove();
                }, this);
            }
            delete this.el[name];
        }, this);
        this.trigger('destroy', this);
    },

    afterDestroy: function (retain) {
        this.trigger('afterdestroy', this);
        if (this.rendered && this.el.target && !this.target) {
            this.el.target.remove();
            this.el.target = null;
        }
        this.off();
        this.destroyed = true;
        if (!retain) {
            for (var pro in this) {
                if (this.hasOwnProperty(pro)) {
                    delete this[pro];
                }
            }
        }
    }

});
Box.define('Box.ui.FileUpload', {

    extend: 'Box.Component'

});
Box.define('Box.ui.Pagination', {

    extend: 'Box.Component'

});
Box.define('Box.ui.Photos', {

    extend: 'Box.Component'

});
Box.define('Box.ui.Slider', {

    extend: 'Box.Component'

});
//see http://niceue.com/validator/#plugin_method
Box.define('Box.ui.Validator', {

    extend: 'Box.Component',

    constructor: function () {

    }

});
Box.define('Box.app.History', {

    mixins: {
        event: Box.util.Event
    },

    singleton: true,

    routeStripper: /^[#\/]|\s+$/g,

    rootStripper: /^\/+|\/+$/g,

    pathStripper: /#.*$/,

    started: false,

    handlers: [],

    constructor: function () {
        if (typeof window !== 'undefined') {
            this.location = window.location;
            this.history = window.history;
        }
        this.mixins.event.constructor.call(this);
    },

    interval: 50,

    atRoot: function () {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch();
    },

    getSearch: function () {
        var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : '';
    },

    getHash: function (window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    },

    getPath: function () {
        var path = decodeURI(this.location.pathname + this.getSearch());
        var root = this.root.slice(0, -1);
        if (!path.indexOf(root)) path = path.slice(root.length);
        return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    getFragment: function (fragment) {
        if (fragment == null) {
            if (this._hasPushState || !this._wantsHashChange) {
                fragment = this.getPath();
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(this.routeStripper, '');
    },

    start: function (options) {
        if (this.started) {
            Box.Error('Box.app.Router has already been started');
        }
        this.started = true;

        this.options = Box.apply({
            root: '/'
        }, this.options, options);
        this.root = this.options.root;

        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange = 'onhashchange' in window;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

        this.fragment = this.getFragment();

        this.root = ('/' + this.root + '/').replace(this.rootStripper, '/');

        if (this._wantsHashChange && this._wantsPushState) {
            if (!this._hasPushState && !this.atRoot()) {
                var root = this.root.slice(0, -1) || '/';
                this.location.replace(root + '#' + this.getPath());
                return true;
            } else if (this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), {
                    replace: true
                });
            }
        }

        if (!this._hasHashChange && this._wantsHashChange && (!this._wantsPushState || !this._hasPushState)) {
            var iframe = document.createElement('iframe');
            iframe.src = 'javascript:0';
            iframe.style.display = 'none';
            iframe.tabIndex = -1;
            var body = document.body;
            this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
            this.iframe.document.open().close();
            this.iframe.location.hash = '#' + this.fragment;
        }

        var addEventListener = window.addEventListener || function (eventName, listener) {
            return attachEvent('on' + eventName, listener);
        };

        var checkUrl = Box.Function.bind(this.checkUrl, this);

        if (this._hasPushState) {
            addEventListener('popstate', checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            addEventListener('hashchange', checkUrl, false);
        } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(checkUrl, this.interval);
        }

        if (!this.options.silent) {
            return this.loadUrl();
        }
    },

    stop: function () {
        var removeEventListener = window.removeEventListener || function (eventName, listener) {
            return detachEvent('on' + eventName, listener);
        };

        if (this._hasPushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange && !this.iframe) {
            removeEventListener('hashchange', this.checkUrl, false);
        }
        if (this.iframe) {
            document.body.removeChild(this.iframe.frameElement);
            this.iframe = null;
        }
        if (this._checkUrlInterval) {
            clearInterval(this._checkUrlInterval);
        }
        this.started = false;
    },

    route: function (route, callback) {
        this.handlers.unshift({
            route: route,
            callback: callback
        });
    },

    checkUrl: function (e) {
        var current = this.getFragment();

        if (current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe);
        }
        if (current === this.fragment) {
            return false;
        }
        if (this.iframe) {
            this.navigate(current);
        }
        this.loadUrl();
    },

    loadUrl: function (fragment) {
        fragment = this.fragment = this.getFragment(fragment);
        Box.Array.each(this.handlers, function (handler) {
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return false;
            }
        })
    },

    navigate: function (fragment, options) {
        if (!this.started) {
            return false;
        }
        if (!options || options === true) {
            options = {
                trigger: !!options
            };
        }

        fragment = this.getFragment(fragment || '');

        var root = this.root;
        if (fragment === '' || fragment.charAt(0) === '?') {
            root = root.slice(0, -1) || '/';
        }
        var url = root + fragment;

        fragment = decodeURI(fragment.replace(this.pathStripper, ''));

        if (this.fragment === fragment) {
            return;
        }
        this.fragment = fragment;

        if (this._hasPushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                if (!options.replace) {
                    this.iframe.document.open().close();
                }
                this._updateHash(this.iframe.location, fragment, options.replace);
            }
        } else {
            return this.location.assign(url);
        }
        if (options.trigger) {
            return this.loadUrl(fragment);
        }
    },

    _updateHash: function (location, fragment, replace) {
        if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            location.hash = '#' + fragment;
        }
    }

});
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
Box.define('Box.app.Store', {

    extend: Box.util.HashMap,

    singleton: true,

    get: function (key, name) {
        if (arguments.length == 1) {
            return this.callParent(arguments)
        }
        var value = this.map[key];
        if (Box.isEmpty(value)) {
            return undefined
        }
        return value[name]
    },

    set: function (key, name, value) {
        if (arguments.length < 3) {
            return this.callParent(arguments)
        }
        this.map[key] = this.map[key] || {};
        return this.map[key][name] = value
    }

});
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
Box.define('Box.app.View', {

    requires: [Box.tpl.Template],

    attrs: {

        html: null,

        data: null,

        change: false,

        scope: null

    },

    constructor: function (config) {
        this.callParent(arguments);
        this.tpl = Box.create('Box.tpl.Template', {
            html: this.get('html'),
            disableFormats: false,
            scope: this.get('scope')
        })
    },

    apply: function (data) {
        if (Box.isEmpty(data)) {
            data = this.get('data')
        } else {
            this.set('data', data, {
                silent: true
            })
        }
        var dom = Box.query(this.tpl.apply(data));
        if (!Box.isEmpty(this.dom)) {
            this.dom.replaceWith(dom)
        }
        return this.dom = dom;
    },

    _onChangeData: function (data) {
        this.get('change') && this.apply(data)
    }

});

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
        return HY.Context && HY.Context.Version || "1.0.0.0";
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