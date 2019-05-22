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