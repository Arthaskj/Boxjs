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

