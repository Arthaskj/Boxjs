Box.define('Box.util.Format', (function () {

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

    Box.Format = Box.util.Format;

});
