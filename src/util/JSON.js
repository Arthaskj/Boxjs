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