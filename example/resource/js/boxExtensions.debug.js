/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.6.24
 * 描    述：封装的kendoUI的AutoComplete控件
 * ======================================================================== */
Box.define('Box.AutoComplete', {
    statics: {
        //默认规则
        DEFAULT_CONFIG: {}
    },
}, function () {

    Box.AutoComplete.selectBond = function (target, data, select) {
        return target.HYAutoBond({select: select}, data);
    };

    Box.AutoComplete.selectTrader = function (target, data, select) {
        return target.HYAutoTrader({select: select}, data);
    };

    Box.AutoComplete.selectAgency = function (target, data, select) {
        return target.HYAutoAgency({select: select}, data);
    };
});


if (typeof Date.prototype.addDays != 'function') {
    Date.prototype.addDays = function (days) {
        if (!days)
            return this;
        var d = this.getTime() + days * 24 * 3600 * 1000;
        return new Date(d);
    };
}

if (typeof Date.prototype.addMonths != 'function') {
    Date.prototype.addMonths = function (months) {
        if (!months)
            return this;
        var y = this.getFullYear();
        var m = this.getMonth();
        var date = new Date(this.getTime());
        var mm = m + months;
        if (months > 0) {
            while (mm > 11) {
                y += 1;
                mm -= 12;
            }
        } else {
            while (mm < 0) {
                y -= 1;
                mm += 12;
            }
        }
        date.setMonth(mm);
        date.setFullYear(y);
        return date;
    };
}

if (typeof Date.prototype.addYears != 'function') {
    Date.prototype.addYears = function (years) {
        if (!years)
            return this;
        var y = this.getFullYear();
        var date = new Date(this.getTime());
        date.setFullYear(y + years);
        return date;
    };
}

if (typeof Date.prototype.addHours != 'function') {
    Date.prototype.addHours = function (hours) {
        if (!hours)
            return this;
        var d = this.getTime() + hours * 3600 * 1000;
        return new Date(d);
    };
}

if (typeof Date.prototype.addMimutes != 'function') {
    Date.prototype.addMimutes = function (minutes) {
        if (!minutes)
            return this;
        var d = this.getTime() + minutes * 60 * 1000;
        return new Date(d);
    };
}

if (typeof Date.prototype.addSeconds != 'function') {
    Date.prototype.addSeconds = function (seconds) {
        if (!seconds)
            return this;
        var d = this.getTime() + seconds * 1000;
        return new Date(d);
    };
}

if (typeof Date.prototype.isToday != 'function') {
    Date.prototype.isToday = function () {
        var thisStr = Box.Format.renderDate(this);
        var todayStr = Box.Format.renderDate(new Date());
        return thisStr === todayStr;
    };
}

if (typeof Date.isToday != 'function') {
    Date.isToday = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return date.isToday();
    };
}

if (typeof Date.today != 'function') {
    Date.today = function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };
}

if (typeof Date.from != 'function') {
    Date.from = function (value) {
        if (value) {
            if (typeof value == "string")
                value = Date.parse(value);
            value = new Date(value);
            if (value != 'Invalid Date')
                return value;

            return null;
        } else {
            return Date.today();
        }
    };
}

if (typeof Date.now2 != 'function') {
    Date.now2 = function () {
        return new Date();
    };
}

if (typeof Date.prototype.isEquals != 'function') {
    Date.prototype.isEquals = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return this.format() === date.format();
    };
}

if (typeof Date.prototype.isLaterThen != 'function') {
    Date.prototype.isLaterThen = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return this.format() > date.format();
    };
}

if (typeof Date.prototype.isEarlierThen != 'function') {
    Date.prototype.isEarlierThen = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return this.format() < date.format();
    };
}

if (typeof Date.prototype.isLaterThenOrEquals != 'function') {
    Date.prototype.isLaterThenOrEquals = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return this.format() >= date.format();
    };
}

if (typeof Date.prototype.isEarlierThenOrEquals != 'function') {
    Date.prototype.isEarlierThenOrEquals = function (date) {
        date = new Date(date);
        if (date == 'Invalid Date')
            return false;
        return this.format() <= date.format();
    };
}

if (typeof Date.prototype.format != 'function') {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "H+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (typeof fmt === "undefined" || fmt == null || fmt == "")
            fmt = "yyyy-MM-dd";
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };
}

//if (typeof Date.prototype.subtract != 'function') {
//    Date.prototype.format = function (date,part) {
//        date = new Date(date);
//        if (date == 'Invalid Date')
//            return this;


//    };
//}

Box.Common = (function () {

    $(document.body).mousedown(function (e) {
        Box.Common.fnCloseEvent(e.target);
    });
    var index = 0;
    $(document.body).delegate(".link_summary", "click", function (e) {
        var icon = $(e.target);
        var isDown = icon.hasClass('fa-angle-double-down');
        var more = icon.closest('td').find('.more');
        var parent = icon.closest("div");
        var cls = parent.data("switch-cls");
        if (isDown) {
            $(e.target).closest("table").find(".more_comments").not(more).slideUp(1);
            $(e.target).closest("table").find(".fa-angle-double-up").not(icon).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
            $(e.target).closest("table").find("." + cls).not(parent).css("width", "auto").css("background-color", "transparent").removeClass(cls);

            var tr = icon.closest("tr");
            var bgColor = tr.hasClass("k-alt") ? "#f5f5f5" : "#fff";
            parent.css("background-color", bgColor);

            var grid = parent.closest(".k-grid-content");
            if (grid.length == 0)
                grid = parent.closest(".k-widget.k-grid");

            var top = parent.offset().top - grid.offset().top + grid.scrollTop() + parent.height();
            var window = parent.closest(".k-window");
            if (window.length) {
                top = parent.offset().top - window.offset().top + parent.height();
                more.css("position", "fixed");
            }
            more.css("top", top + "px");
            more.css("background-color", bgColor);
            more.slideDown(100);
            icon.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            parent.addClass(cls);
            var pwidth = parseFloat(parent.css("width")), mwidth = parseFloat(more.css("width")), twidth = 0;
            if (pwidth < mwidth) {
                var td = parent.closest("td");
                if (td.length) {
                    twidth = twidth + td.width();
                    var tds = td.nextAll("td");
                    $.each(tds, function () {
                        twidth = twidth + $(this).width();
                    });
                }
                if (twidth < mwidth) {
                    more.css("width", twidth + "px");
                    parent.css("width", twidth + "px");
                } else {
                    parent.css("width", mwidth + "px");
                }
            } else {
                more.css("width", pwidth + "px");
            }
        } else {
            more.slideUp(100, function () {
                parent.removeClass(cls);
                parent.css("background-color", "transparent");
                parent.css("width", "auto");
            });
            icon.addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
        }
    });


    return {
        fnCloseEvent: function (target) {
            if (Box.isNullOrUndefined(target) || $(target).closest(".more_comments,.first_comments,.front_comments").length == 0) {
                var parent = $(".first_comments:has(.fa-angle-double-up),.front_comments:has(.fa-angle-double-up)");
                parent.find(".fa-angle-double-up").addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
                $('.more.more_comments').slideUp(100, function () {
                    parent.removeClass("first_comments front_comments");
                    parent.css("background-color", "transparent");
                    parent.css("width", "auto");
                });
            }
            if (Box.isNullOrUndefined(target) || $(target).closest("li.message.open,li.task.open,li.notification.open").length == 0) {
                $("ul.remind").find("li.open").removeClass("open");
            }
            if (Box.isNullOrUndefined(target) || $(target).closest(".hy-dropdownselect-container.open").length == 0) {
                var container = $(".hy-dropdownselect-container.open");
                var dropdownselectroot = container.find('ul.dropdownselectroot');
                dropdownselectroot.css('transform', 'translateY(0px)');

                container.removeClass("open").hide(200);
                setTimeout(function () {
                    // dropdownselectroot.css('top', '0px');
                    dropdownselectroot.css('transition-duration', ' 0s');
                }, 200)

                // $(".hy-dropdownselect-container.open").removeClass("open").hide(200);
            }
        },

        /*
         * 静态方法，渲染子表
         * @params list 子表名称
         * @params fieldName 要渲染的子表的字段名
         * @params template 模版，可以不定义，默认直接输出值，可以定义为函数，不可以使用kendo的模版语法或Box的模版语法
         */
        fnRenderList: function (list, fieldName, template, precision) {
            var dftTpl = function (it) {
                var v = it[fieldName];
                return v || "&nbsp;";
            };

            if (list && list.length && fieldName) {
                if (!Box.isFunction(template))
                    template = dftTpl;

                var str = "<table class='inner_table'>";
                for (var i = 0; i < list.length; i++) {
                    var it = list[i];
                    if (precision) {
                        var vv = it[fieldName];
                        str += "<tr><td data-value='" + vv + "'>";
                    } else {
                        str += "<tr><td data-key='" + i + "'>";
                    }
                    str += template(it);
                    str += "</td></tr>";
                }
                str += "</table>";
                return str;
            }
            return "";
        },

        fnGetGridHeight: function (offset) {
            var bodyHeight = $('body').outerHeight();
            //console.log('bodyHeight:' + bodyHeight);

            var navHeight = $('#nav-wrapper').outerHeight();
            //console.log('navHeight:' + navHeight);

            var pageHeadHeight = $('#page-header').outerHeight();
            //console.log('pageHeadHeight:' + pageHeadHeight);

            var toolbarHeight = $('.table-toolbar').outerHeight();
            if (toolbarHeight == null) {
                toolbarHeight = ($('.toolbar.k-toolbar').outerHeight() || 0) + 10;
            }
            //console.log('toolbarHeight:' + toolbarHeight);

            // var tablebodyHeight = $('.table-body').outerHeight();
            //console.log('tablebodyHeight:' + tablebodyHeight);

            //console.log('diff:' + (bodyHeight - navHeight - pageHeadHeight - toolbarHeight));

            var result = bodyHeight - navHeight - pageHeadHeight - toolbarHeight - 20;
            if (offset && Box.isNumeric(offset))
                return result + parseInt(offset);
            return result;
        },

        fnGeReportDetailHeight: function (isPageHead) {
            var bodyHeight = $('body').outerHeight();
            //console.log('bodyHeight:' + bodyHeight);

            var navHeight = $('#nav-wrapper').outerHeight();
            //console.log('navHeight:' + navHeight);

            var pageHeadHeight = $('#page-header').outerHeight();
            //console.log('pageHeadHeight:' + pageHeadHeight);

            var toolbarHeight = $('.table-toolbar').outerHeight();
            if (toolbarHeight == null) {
                toolbarHeight = $('.toolbar.k-toolbar').outerHeight() + 10;
            }
            //console.log('toolbarHeight:' + toolbarHeight);

            var tablebodyHeight = $('.table-body').outerHeight();
            //console.log('tablebodyHeight:' + tablebodyHeight);

            //console.log('diff:' + (bodyHeight - navHeight - pageHeadHeight - toolbarHeight));
            if (isPageHead) {
                return bodyHeight - navHeight - toolbarHeight - pageHeadHeight - 60;
            } else {
                return bodyHeight - navHeight - toolbarHeight - 60; // - pageHeadHeight - toolbarHeight - 60; 
            }


        },

        addIcon: function (options) {
            var el = options.element,
                iconClass = options.className,
                appendClass = options.appendClass,
                fn = options.click,
                title = options.title,
                iconAttrs = options.iconAttrs || {},
                wrapAttrs = options.wrapAttrs || {},
                pickAttrs = options.pickAttrs || {};
            var tagName = el.prop("tagName");
            var selector = tagName + "[iconAdding]";
            el.attr("iconAdding", true);

            var poparent = el.parent();
            var picker = $('<span class="k-dropdown-wrap k-state-default k-addicon-wrap"></div>');
            picker.append(el);
            picker.append('<span class="k-select k-add-icon" role="button" style="cursor: pointer;"><span class="k-pick k-icon"></span></span>');

            if (title) {
                picker.find(".k-add-icon").attr("title", title);
            }
            picker.find(".k-add-icon .k-pick").addClass(iconClass);
            picker.addClass(appendClass);
            for (var wat in pickAttrs) {
                picker.attr(wat, pickAttrs[wat]);
            }
            // if (!poparent.closest(".k-header").hasClass("k-header")) {
            var header = $('<span class="k-widget k-dropdown k-header" role="ddselect">');
            header.append(picker);
            for (wat in wrapAttrs) {
                header.attr(wat, wrapAttrs[wat]);
                header.css(wat, wrapAttrs[wat]);
            }
            if (!wrapAttrs.width) {
                header.css("width", "100%");
            }
            poparent.empty().append(header);
            // } else {
            //     for (wat in wrapAttrs) {
            //         picker.attr(wat, wrapAttrs[wat]);
            //     }
            //     poparent.empty().append(picker);
            // }
            var arraw = picker.find("span.k-select");
            for (var at in iconAttrs) {
                arraw.attr(at, iconAttrs[at]);
            }
            if (fn && Box.isFunction(fn)) {
                var tg = options.disallowinput ? picker : arraw;
                tg.click(function () {
                    $(".k-widget.k-tooltip.k-popup").hide();
                    fn.apply(this, arguments);

                    picker.removeClass("k-state-border-down").removeClass("k-state-active");
                    picker.parent().removeClass("k-state-border-down").removeClass("k-state-active");
                });
            }

            var target = poparent.find(selector);
            target.removeAttr("iconAdding");
            return target;
        },

        convertCurrency: function (currencyDigits, endfix, perfix, autoUnit) {
            // Constants:
            var MAXIMUM_NUMBER = 99999999999.99;
            // Predefine the radix characters and currency symbols for output:
            var CN_ZERO = "零";
            var CN_ONE = "壹";
            var CN_TWO = "贰";
            var CN_THREE = "叁";
            var CN_FOUR = "肆";
            var CN_FIVE = "伍";
            var CN_SIX = "陆";
            var CN_SEVEN = "柒";
            var CN_EIGHT = "捌";
            var CN_NINE = "玖";
            var CN_TEN = "拾";
            var CN_HUNDRED = "佰";
            var CN_THOUSAND = "仟";
            var CN_TEN_THOUSAND = "万";
            var CN_HUNDRED_MILLION = "亿";
            var CN_SYMBOL = perfix || ""; // "人民币";
            var CN_DOLLAR = endfix || "元"; //"元";
            var CN_TEN_CENT = "角";
            var CN_CENT = "分";
            var CN_INTEGER = ""; //"整";
            // Variables:
            var integral; // Represent integral part of digit number.
            var decimal; // Represent decimal part of digit number.
            var outputCharacters; // The output result.
            var parts;
            var digits, radices, bigRadices, decimals;
            var zeroCount;
            var i, p, d;
            var quotient, modulus;
            // Validate input string:
            currencyDigits = currencyDigits.toString();
            if (currencyDigits == "") {
                return "";
            }
            if (currencyDigits.match(/[^,.\d]/) != null) {
                return "";
            }
            if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
                return "";
            }
            // Normalize the format of input digits:
            currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
            currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
            // Assert the number is not greater than the maximum number.
            if (Number(currencyDigits) > MAXIMUM_NUMBER) {
                return "";
            }
            // Process the coversion from currency digits to characters:
            // Separate integral and decimal parts before processing coversion:
            parts = currencyDigits.split(".");
            if (parts.length > 1) {
                integral = parts[0];
                decimal = parts[1];
                // Cut down redundant decimal digits that are after the second.
                decimal = decimal.substr(0, 2);
            } else {
                integral = parts[0];
                decimal = "";
            }
            // Prepare the characters corresponding to the digits:
            digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
            radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
            bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
            decimals = new Array(CN_TEN_CENT, CN_CENT);
            // Start processing:
            outputCharacters = "";
            // Process integral part if it is larger than 0:
            if (Number(integral) > 0) {
                zeroCount = 0;
                for (i = 0; i < integral.length; i++) {
                    p = integral.length - i - 1;
                    d = integral.substr(i, 1);
                    quotient = p / 4;
                    modulus = p % 4;
                    if (d == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            outputCharacters += digits[0];
                        }
                        zeroCount = 0;
                        outputCharacters += digits[Number(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4) {
                        outputCharacters += bigRadices[quotient];
                    }
                }

                if (autoUnit || decimal != "") {
                    outputCharacters += CN_DOLLAR;
                }
            }
            // Process decimal part if there is:
            if (decimal != "") {
                for (i = 0; i < decimal.length; i++) {
                    d = decimal.substr(i, 1);
                    if (d != "0") {
                        outputCharacters += digits[Number(d)] + decimals[i];
                    }
                }
            }
            // Confirm and return the final output string:
            if (outputCharacters == "") {
                outputCharacters = CN_ZERO;
                if (autoUnit) {
                    outputCharacters += CN_DOLLAR;
                }
            }
            if (decimal == "") {
                outputCharacters += CN_INTEGER;
            }
            outputCharacters = CN_SYMBOL + outputCharacters;
            return outputCharacters;
        },

        //todo:这样直接传入sql语句很危险
        //get: function (sql) {
        //    var values;
        //    $.ajax({
        //        url: "api/SysMgr/Setting/GetKeyValues",
        //        async: false,
        //        data: { sql: sql },
        //        success: function (result) {
        //            values = result;
        //        },
        //        timeout: 30000
        //    });
        //    return values;
        //},

        post: function (options) {
            var postData = JSON.stringify(options.data);
            var url = options.url;
            var success = options.success || function (result) {
                console.log(result);
            };
            var json = JSON.stringify({
                url: url,
                data: postData
            });

            if (Box.isNullOrUndefined(options.async)) {
                options.async = false;
            }

            //success.call(options.scope || window, 0.0623);
            $.ajax({
                type: 'post',
                url: "api/QL/post",
                contentType: "application/json",
                async: options.async,
                data: json,
                success: function (result) {
                    eval("data=" + result);
                    if (data.fetchSuccess == true) {
                        success.call(options.scope || window, data.result);
                    } else {

                        console.log(data.message + " --> " + json.replace(/\\/g, ''));
                        //Box.Notify.error("QuantLib计算出现错误！");
                        if (index == 0)
                            Box.Notify.warning("请维护债券基础信息！");
                        index++;
                        //Box.Notify.error("QuantLib计算出现错误！<br> <b style='color:blue;'>请联系系统管理员：</b><br>" + data.message + "-->" + json);
                    }
                },
                //timeout: 30000,
                error: function () {
                    console.log("QuantLib请求出现异常！" + " --> " + json.replace(/\\/g, ''));
                    Box.Notify.error("QuantLib计算出现异常！");
                }
            });
        },

        isBondOut: function (dealtype, dealside, usetype) {
            if ((dealtype == 223 && dealside == 4) || // 现券卖出
                (dealtype == 229 && dealside == 4) || // 期货交割卖出
                (dealtype == 224 && dealside == 4) || // 私募债卖出
                (dealtype == 702 && dealside == 4) || // 分销卖出
                (dealtype == 701 && dealside == 4) || // 转托管转出
                (dealtype == 226 && dealside == 4) || // 质押式正回购
                (dealtype == 231 && dealside == 4) || // 买断式正回购
                (dealtype == 1236 && dealside == 4 && usetype == 1) || // 借贷融出标的券
                (dealtype == 1236 && dealside == 1 && usetype == 2) // 借贷融入质押券
            ) {
                return true;
            }
            return false;
        },

        cellContent: function (summary, spchar, num) {
            if (!summary) {
                return '';
            }
            var elements = summary.split(spchar);
            return Box.Common.cellTip(elements, num);
        },

        cellTip: function (list, num) {
            list = list.where("x=>x&&x.trim()");
            if (!num) {
                var base2 = $('<div class="pre_comments"></div>');
                for (var ii = 0; ii < list.length; ii++) {
                    base2.append('<span style="display:block;">' + list[ii].trim() + '</span>');
                }
                return base2[0].outerHTML;
            } else {
                var cls = num == 1 ? "first_comments" : "front_comments";
                var base = $('<div data-switch-cls="' + cls + '" class="pre_comments"></div>');
                if (list.length <= num) {
                    for (var i = 0; i < list.length; i++) {
                        base.append('<span style="display:block;">' + list[i].trim() + '</span>');
                    }
                    return base[0].outerHTML;
                }
                for (i = 0; i < num; i++) {
                    if (i === num - 1) {
                        base.append('<span style="margin-right:10px;">' + list[i].trim() + '</span>');
                        base.append('<a href="javascript:void(0);" class="link_summary"><i class="fa fa-angle-double-down"></i></a>');
                    } else {
                        base.append('<span style="display:block;">' + list[i].trim() + '</span>');
                    }
                }
                var more = $('<div style="display:none;" class="more more_comments"></div>');
                for (i = num; i < list.length; i++) {
                    more.append('<span style="display:block;">' + list[i].trim() + '</span>');
                }

                return base[0].outerHTML + more[0].outerHTML;
            }
        },

        calc: function (options) {
            var url = options.url;
            var success = options.success || function (result) {
                console.log(result);
            };

            if (Box.isNullOrUndefined(options.async)) {
                options.async = true;
            }

            //success.call(options.scope || window, 0.0623);
            $.ajax({
                type: 'get',
                url: url,
                async: options.async,
                data: options.data,
                success: function (result) {
                    success.call(options.scope || window, result);
                },
                timeout: 30000,
            });
        },

        fromTable: function (option) {
            var table, thead, lockedTable = false, lockedHead = false;
            if (option.grid) {
                if (option.grid.lockedContent) {
                    table = option.grid.thead.add(option.grid.table).add(option.grid.footer.find('.k-grid-footer-wrap'));
                    thead = option.grid.thead.find("tr");
                    lockedTable = option.grid.lockedContent.add(option.grid.lockedFooter);
                    lockedHead = option.grid.lockedHeader.find("tr");
                } else {
                    table = option.grid.wrapper;
                    thead = $(table).find("thead tr");
                }
            } else {
                table = option.table;
                thead = $(table).find("thead tr");
            }

            var trTds = $(table).add($(table).find("table")).filter("table:not(.inner_table)").find(">tbody>tr");
            var lockedtrTds = lockedTable && $(lockedTable).add($(lockedTable).find("table")).filter("table:not(.inner_table)").find(">tbody>tr");

            var grid = option.grid || $(table).data("kendoGrid");
            var precision = grid && trTds.find("td[data-precision]").length > 0 || false;
            var data = {
                RowList: [],
                ShowLine: true,
                FileName: option.fileName,
                ShowTitle: option.ShowTitle,
                Params: option.params,
                //onlyVisible: false
            };
            if (!option.allowEmpty && trTds.length == 0) {
                return data;
            }

            //var onlyVisible = Box.isNullOrUndefined(option.onlyVisible) ? true : option.onlyVisible;

            if (thead.length) {
                var frows = thead.length + (option.ShowTitle ? 1 : 0);
                var fcols = 0;
                if (lockedHead) {
                    //var frcols = lockedHead.eq(-1).find(">th:not(.k-hierarchy-cell,.k-group-cell,[data-noexport],:has([data-noexport]))");
                    var frcols = lockedHead.eq(-1).find(">th:not(.k-hierarchy-cell,.k-group-cell,[data-noexport='true'])");
                    //if (onlyVisible) {
                    //    frcols = frcols.filter(":visible");
                    //}
                    fcols = frcols.length;
                }
                data.FreezeInfo = {
                    ColumnIndex: fcols,
                    RowIndex: frows,
                    LeftColumns: fcols,
                    TopRows: frows
                };
            }

            $.each(thead, function (index, tr) {
                var row = $(tr);
                if (lockedHead) {
                    var rowIndex = row.prop("rowIndex");
                    row = $(lockedHead).eq(rowIndex).add(row);
                }
                //var ths = row.find(">th:not(.k-hierarchy-cell,.k-group-cell,[data-noexport],:has([data-noexport]))");
                var ths = row.find(">th:not(.k-hierarchy-cell,.k-group-cell,[data-noexport='true'])");
                //onlyVisible && (ths = ths.filter(":visible"));
                var thVals = {CellCounts: ths.length, CellList: [], IsHeader: true};
                for (i = 0; i < ths.length; i++) {
                    var th = $(ths[i]);
                    var thVal = {};
                    thVal.ColSpan = th.attr("colspan") || 1;
                    thVal.RowSpan = th.data("rowspan") || th.attr("rowspan") || 1;
                    thVal.Value = ((th.data("title") && th.data("title").toString().replace(/(&nbsp;)?<br>(&nbsp;)?/g, ""))
                        || (th.attr("title") && th.attr("title").toString().replace(/(&nbsp;)?<br>(&nbsp;)?/g, ""))
                        || th.html().replace(/(&nbsp;)?<br>(&nbsp;)?/g, "").replace(/<\/span>/g, "\n").replace(/<[^>]*data-noexport[^>]*>[^<>]*/g, "").replace(/<[^>]*>/g, "")).trim();
                    thVal.Format = th.data("format");
                    thVal.Align = th.css("text-align") || "left";
                    thVal.CellBorder = th.attr("cborder") || 15;
                    //thVal.ForeColor = th.data("forecolor");
                    thVal.BackColor = th.data("backcolor");
                    thVal.ForeSize = th.attr("fontsize") || 10;
                    thVal.ForeWeight = th.attr("fontweight");
                    thVal.Diagonal = th.attr("diagonal") || false;
                    //thVal.VAlign = th.css("vertical-align") || "middle";
                    var _foreColor = th.data("forecolor");
                    if (!!_foreColor) {
                        thVal.ForeColor = _foreColor;
                    }
                    thVals.CellList.push(thVal);
                }
                data.RowList.push(thVals);
            });

            var dataItem;
            var datas;
            if (precision) {
                datas = Array.apply({}, grid.dataSource.data());
            }
            $.each(trTds, function (index, tr) {
                var rowspan = $(tr).find("table.inner_table:first td").length || 1;
                var spanTds = [];

                if (precision) {
                    var uid = $(tr).data("uid");
                    dataItem = datas.first("x=>x.uid=='" + uid + "'");
                }
                var row = $(tr);
                if (option.rowFilter) {
                    if (!row.attr("class") || row.attr("class").indexOf("k-state-selected") < 0) {
                        return;
                    }
                }

                if (lockedTable) {
                    // var rowIndex = row.prop("rowIndex");
                    var rowIndex = index;
                    row = lockedtrTds.eq(rowIndex).add(row);
                }
                var tds = row.find(">td:not(.k-hierarchy-cell,.k-group-cell,[data-noexport='true'])");
                //var tds = row.find(">td:not(.k-hierarchy-cell,.k-group-cell,[data-noexport],:has([data-noexport]))");
                //onlyVisible && (tds = tds.filter(":visible"));
                var tdVals = {
                    CellCounts: tds.length,
                    CellList: [],
                    IsGroup: $(tr).hasClass("k-grouping-row") || $(tr).hasClass("k-treelist-group")
                };
                for (i = 0; i < tds.length; i++) {
                    var td = $(tds[i]);
                    if (td.css('display') == 'none') { //针对合并单元格的处理
                        continue;
                    }
                    var tdVal = {};
                    tdVal.ColSpan = td.attr("colspan") || 1;
                    tdVal.RowSpan = td.attr("rowspan") || 1;
                    if (i == 0 && tdVals.IsGroup && (td.find("a.k-icon").length || td.parent().hasClass('total') && !td.parent().hasClass("noGroup"))) {
                        // console.log();

                        //这样写是为了兼容新旧版本
                        var cspan = ($(thead[0]).find('.k-group-cell').length - $(tr).find('.k-group-cell').length);
                        if (cspan) {
                            tdVal.ColSpan -= cspan;
                        } else {
                            tdVal.ColSpan--;
                        }


                    }
                    tdVal.Format = td.data("format") || td.children().data("format");
                    tdVal.Align = td.children().css("text-align") || td.css("text-align") || "left"; //如果他的子元素上取不到,再去td上面的,其实left在chrome上面没有用,默认返回start,不知道其他浏览器会是什么样
                    tdVal.CellBorder = td.attr("cborder") || 15;
                    //tdVal.ForeColor = td.data("forecolor") || td.find("div[data-forecolor]").data("forecolor");
                    tdVal.BackColor = td.data("backcolor") || td.find("div[data-backcolor]").data("backcolor");
                    tdVal.ForeSize = td.attr("fontsize") || 10;
                    tdVal.ForeWeight = td.attr("fontweight");
                    tdVal.Diagonal = td.attr("diagonal") || false;
                    //tdVal.VAlign = td.css("vertical-align") || "middle";
                    var _foreColor = td.data("forecolor") || td.attr("forecolor");
                    if (!!_foreColor) {
                        tdVal.ForeColor = _foreColor;
                    }
                    if (td.find("table.inner_table").length == 0) {
                        tdVal.RowSpan = td.attr("rowspan") || rowspan;

                        if (td.data("value") || td.data("precision")) {
                            var calexp = td.data("calexp");
                            var zv = td.data("value");
                            if (zv == null && dataItem) {
                                zv = dataItem[td.data("precision")];
                            }
                            if (calexp) {
                                calexp = calexp.replace("[o]", zv);
                                tdVal.Value = eval("Box.Format.round(" + calexp + ",6)");
                            } else if (zv != null) {
                                tdVal.Value = Box.Format.round(Box.Format.toNumeric(zv), 6);
                            } else {
                                tdVal.Value = "";
                            }
                        } else if (td.find('[data-exportvalue]').length) { // 有些单元格很特殊,是一种按钮,导出的时候需要特殊处理,加上data-exportvalue属性,作为导出的值,参考:HY.productMgr.product.productList
                            tdVal.Value = td.find('[data-exportvalue]').data('exportvalue');
                        }
                        else {
                            tdVal.Value = td.html().replace(/(&nbsp;)?<br>(&nbsp;)?/g, "").replace(/<\/span>/g, "\n").replace(/<[^>]*data-noexport[^>]*>[^<>]*/g, "").replace(/<[^>]*>/g, "").replace(/\n$/g, "");
                        }
                    } else {
                        var inTd = $(td).find("table.inner_table td:eq(0)");
                        tdVal.RowSpan = 1;

                        if (precision && td.data("value")) {
                            tdVal.Value = Box.Format.round(Box.Format.toNumeric(inTd.data("value")), 6);
                        } else {
                            tdVal.Value = inTd.html().replace(/(&nbsp;)?<br>(&nbsp;)?/g, "").replace(/<\/span>/g, "\n").replace(/<[^>]*data-noexport[^>]*>[^<>]*/g, "").replace(/<[^>]*>/g, "").replace(/\n$/g, "");
                        }
                        spanTds.push(td);
                    }
                    while (Box.String.startsWith(tdVal.Value.toString(), "\n")) {
                        tdVal.Value = tdVal.Value.substr(1);
                    }
                    while (Box.String.endsWith(tdVal.Value.toString(), "\n")) {
                        tdVal.Value = tdVal.Value.substr(0, tdVal.Value.length - 1);
                    }
                    tdVals.CellList.push(tdVal);
                }
                data.RowList.push(tdVals);

                if (rowspan > 1 && spanTds.length) {
                    for (var j = 1; j < rowspan; j++) {
                        var tdVs = {CellCounts: spanTds.length, CellList: [], IsGroup: false};
                        for (var i = 0; i < spanTds.length; i++) {
                            var td = $(spanTds[i]);
                            var tdVal = {};
                            tdVal.ColSpan = td.attr("colspan") || 1;
                            tdVal.RowSpan = td.attr("rowspan") || 1;
                            tdVal.Format = td.data("format");
                            tdVal.Align = td.css("text-align") || "left";
                            //tdVal.ForeColor = td.data("forecolor") || td.find("div[data-forecolor]").data("forecolor");
                            tdVal.BackColor = td.data("backcolor") || td.find("div[data-backcolor]").data("backcolor");
                            tdVal.ForeSize = td.attr("fontsize") || 10;
                            tdVal.ForeWeight = td.attr("fontweight");
                            tdVal.Diagonal = td.attr("diagonal") || false;
                            //tdVal.VAlign = td.css("vertical-align") || "middle";
                            var _foreColor = td.data("forecolor") || td.attr("forecolor");
                            if (!!_foreColor) {
                                tdVal.ForeColor = _foreColor;
                            }
                            var innerTd = td.find("table.inner_table td:eq(" + j + ")");

                            if (precision && td.data("value")) {
                                tdVal.Value = Box.Format.round(Box.Format.toNumeric(inTd.data("value")), 6);
                            } else {
                                tdVal.Value = innerTd.html().replace(/(&nbsp;)?<br>(&nbsp;)?/g, "").replace(/<\/span>/g, "\n").replace(/<[^>]*data-noexport[^>]*>[^<>]*/g, "").replace(/<[^>]*>/g, "").replace(/\n$/g, "");
                            }

                            tdVal.CellBorder = td.attr("cborder") || 15;

                            while (Box.String.startsWith(tdVal.Value.toString(), "\n")) {
                                tdVal.Value = tdVal.Value.substr(1);
                            }
                            while (Box.String.endsWith(tdVal.Value.toString(), "\n")) {
                                tdVal.Value = tdVal.Value.substr(0, tdVal.Value.length - 1);
                            }
                            tdVs.CellList.push(tdVal);
                        }
                        data.RowList.push(tdVs);
                    }
                }
            });

            var trTfs = $(table).find("tfoot tr");
            $.each(trTfs, function (index, tr) {
                var row = $(tr);
                if (lockedTable) {
                    // var rowIndex = row.prop("rowIndex");
                    var rowIndex = index;
                    row = $(lockedTable).find("tfoot tr").eq(rowIndex).add(row);
                }
                //var tds = row.find(">td:not(.k-hierarchy-cell,.k-group-cell,[data-noexport],:has([data-noexport]))");
                var tds = row.find(">td:not(.k-hierarchy-cell,.k-group-cell,[data-noexport='true'])");
                //onlyVisible && (tds = tds.filter(":visible"));
                var tdVals = {CellCounts: tds.length, CellList: [], IsGroup: true};
                for (i = 0; i < tds.length; i++) {
                    var td = $(tds[i]);
                    var tdVal = {};
                    tdVal.ColSpan = td.attr("colspan") || 1;
                    if (i == 0 && data.RowList.count("x=>x.IsGroup")) {
                        tdVal.ColSpan--;
                    }
                    tdVal.RowSpan = td.attr("rowspan") || 1;
                    if (precision && td.data("value")) {
                        tdVal.Value = Box.Format.round(Box.Format.toNumeric(td.data("value")), 6);
                    } else {
                        tdVal.Value = td.html().replace(/<[^>]*data-noexport[^>]*>[^<>]*/g, "").replace(/<[^>]*>/g, "").replace(/(&nbsp;)?<br>(&nbsp;)?/g, "");
                    }
                    tdVal.Format = td.data("format");
                    tdVal.Align = td.css("text-align") || "left";
                    tdVal.CellBorder = td.attr("cborder") || 15;
                    //tdVal.ForeColor = td.data("forecolor") || td.find("div[data-forecolor]").data("forecolor");
                    tdVal.BackColor = td.data("backcolor") || td.find("div[data-backcolor]").data("backcolor");
                    tdVal.ForeSize = td.attr("fontsize") || 10;
                    tdVal.ForeWeight = td.attr("fontweight");
                    //tdVal.VAlign = td.css("vertical-align") || "middle";
                    var _foreColor = td.data("forecolor") || td.attr("forecolor");
                    if (!!_foreColor) {
                        tdVal.ForeColor = _foreColor;
                    }
                    while (Box.String.startsWith(tdVal.Value.toString(), "\n")) {
                        tdVal.Value = tdVal.Value.substr(1);
                    }
                    while (Box.String.endsWith(tdVal.Value.toString(), "\n")) {
                        tdVal.Value = tdVal.Value.substr(0, tdVal.Value.length - 1);
                    }
                    tdVals.CellList.push(tdVal);
                }
                data.RowList.push(tdVals);
            });

            return data;
        },

        exportToExcel: function (option) {
            if (!option.fileName) {
                Box.Notify.warning("导出文件名为空");
                return;
            }
            if (option.table) {
                if (option.table.length == 0) {
                    Box.Notify.warning("没指定要导出的内容");
                    return;
                }

                if (option.table.find(".nodata").length != 0) {
                    Box.Notify.warning("没指定要导出的内容");
                    return;
                }
            }
            if (option.grid) {
                if (option.grid.table.length == 0) {
                    Box.Notify.warning("没指定要导出的内容");
                    return;
                }

                if (option.grid.table.find(".nodata").length != 0) {
                    Box.Notify.warning("没指定要导出的内容");
                    return;
                }
            }


            Box.HY.Page.showLoader();
            setTimeout(function () {
                var data = Box.Common.fromTable(option);

                data.Format = option.format || "xls";

                if (arguments[1]) {
                    if (Box.isArray(arguments[1])) {
                        arguments[1].forEach(function (value) {
                            option.grid = value;
                            var d = Box.Common.fromTable(option);
                            data.RowList.push({CellCounts: 0, CellList: []});
                            data.RowList = data.RowList.concat(d.RowList);
                        });
                    }
                }

                if (data.RowList.length == 0) {
                    Box.Notify.warning("没指定要导出的内容");
                    return;
                }

                Box.Array.forEach(data.RowList, function (row) {  //升级到高版本导出excel &nbsp;不会解析成空格而是直接导出
                    if (row.CellList.length > 0) {
                        Box.Array.forEach(row.CellList, function (cell) {
                            if (!Box.isNullOrUndefined(cell.Value) && typeof cell.Value != 'number') {
                                if (cell.Value.indexOf("&nbsp;") >= 0) {
                                    var arrs = cell.Value.split("&nbsp;");
                                    var newValue = "";
                                    Box.Array.forEach(arrs, function (item) {
                                        newValue += item + " ";
                                    });
                                    cell.Value = newValue;
                                }
                            }
                        });
                    }
                });

                //var form = $("<form method='post' action='/Home/ExcelExport'><textarea name='table'>" + JSON.stringify(data) + "</textarea></form>");
                //form.submit();
                var form = document.createElement("form");

                // 创建一个输入框
                var textarea = document.createElement("textarea");
                //设置相应参数

                textarea.name = "table";
                textarea.value = JSON.stringify(data);

                //将该输入框插入到 form 中
                form.appendChild(textarea);


                //form 提交方式
                form.method = "POST";
                //form 提交路径
                form.action = "/Home/ExcelExport";

                //添加到 body 中
                document.body.appendChild(form);

                Box.HY.Page.hideLoader();
                //执行提交
                form.submit();
                //删除该 form
                document.body.removeChild(form);
            }, 0);
        },

        exportToSheets: function (option) {
            if (!option.fileName) {
                Box.Notify.warning("导出文件名为空");
                return;
            }
            option.tables = option.tables.where("x=>x");
            if (option.tables.length == 0) {
                Box.Notify.warning("没指定要导出的内容");
                return;
            }
            var datas = option.tables.select(function (opt) {
                return Box.Common.fromTable(opt);
            });

            datas = datas.where("x=>x.RowList.length");

            if (datas.length == 0) {
                Box.Notify.warning("没指定要导出的内容");
                return;
            }

            Box.Array.forEach(datas, function (data) { //升级到高版本导出excel &nbsp;不会解析成空格而是直接导出
                if (data.RowList.length > 0) {
                    Box.Array.forEach(data.RowList, function (row) {
                        if (row.CellList.length > 0) {
                            Box.Array.forEach(row.CellList, function (cell) {
                                if (!Box.isNullOrUndefined(cell.Value) && typeof cell.Value != 'number') {
                                    if (cell.Value.indexOf("&nbsp;") >= 0) {
                                        var arrs = cell.Value.split("&nbsp;");
                                        var newValue = "";
                                        Box.Array.forEach(arrs, function (item) {
                                            newValue += item + " ";
                                        });
                                        cell.Value = newValue;
                                    }
                                }
                            });
                        }
                    });
                }
            });

            var jsonstring = JSON.stringify(datas);

            //var form = $("<form method='post' action='/Home/SheetsExport'><textarea name='tables'>" + jsonstring + "</textarea><input name='fileName' value='" + option.fileName + "'/></form>");
            //form.submit();

            var form = document.createElement("form");

            // 创建一个输入框
            var textarea = document.createElement("textarea");
            //设置相应参数 

            textarea.name = "tables";
            textarea.value = jsonstring;

            //将该输入框插入到 form 中 
            form.appendChild(textarea);

            var input = document.createElement("input");
            input.name = 'fileName';
            input.value = option.fileName;
            form.appendChild(input);

            //form 提交方式 
            form.method = "POST";
            //form 提交路径 
            form.action = "/Home/SheetsExport";

            //添加到 body 中 
            document.body.appendChild(form);

            //执行提交
            form.submit();
            //删除该 form 
            document.body.removeChild(form);

        },

        exportExcelAll: function (option) {
            if (!option.fileName) {
                Box.Notify.warning("导出文件名为空");
                return;
            }
            option.tables = option.tables.where("x=>x");
            if (option.tables.length == 0) {
                Box.Notify.warning("没指定要导出的内容");
                return;
            }
            var datas = option.tables.select(function (opt) {
                return Box.Common.fromTable(opt);
            });

            datas = datas.where("x=>x.RowList.length");

            if (datas.length == 0) {
                Box.Notify.warning("没指定要导出的内容");
                return;
            }

            Box.Array.forEach(datas, function (data) { //升级到高版本导出excel &nbsp;不会解析成空格而是直接导出
                if (data.RowList.length > 0) {
                    Box.Array.forEach(data.RowList, function (row) {
                        if (row.CellList.length > 0) {
                            Box.Array.forEach(row.CellList, function (cell) {
                                if (!Box.isNullOrUndefined(cell.Value) && typeof cell.Value != 'number') {
                                    if (cell.Value.indexOf("&nbsp;") >= 0) {
                                        var arrs = cell.Value.split("&nbsp;");
                                        var newValue = "";
                                        Box.Array.forEach(arrs, function (item) {
                                            newValue += item + " ";
                                        });
                                        cell.Value = newValue;
                                    }
                                }
                            });
                        }
                    });
                }
            });

            var jsonstring = JSON.stringify(datas);

            //var form = $("<form method='post' action='/Home/SheetsExport'><textarea name='tables'>" + jsonstring + "</textarea><input name='fileName' value='" + option.fileName + "'/></form>");
            //form.submit();

            var form = document.createElement("form");

            // 创建一个输入框
            var textarea = document.createElement("textarea");
            //设置相应参数 

            textarea.name = "tables";
            textarea.value = jsonstring;

            //将该输入框插入到 form 中 
            form.appendChild(textarea);

            var input = document.createElement("input");
            input.name = 'fileName';
            input.value = option.fileName;
            form.appendChild(input);

            //form 提交方式 
            form.method = "POST";
            //form 提交路径 
            form.action = "/Home/SheetsExport";

            //添加到 body 中 
            document.body.appendChild(form);

            //执行提交
            form.submit();
            //删除该 form 
            document.body.removeChild(form);
        },

        exportWordZip: function (data) {

            var form = document.createElement("form");

            // 创建一个输入框
            var textarea = document.createElement("textarea");
            //设置相应参数 
            textarea.name = "document";
            textarea.value = JSON.stringify(data);

            //将该输入框插入到 form 中 
            form.appendChild(textarea);


            //form 提交方式 
            form.method = "POST";
            //form 提交路径 
            form.action = "/Home/WordExportZip";

            //添加到 body 中 
            document.body.appendChild(form);

            //执行提交
            form.submit();
            //删除该 form 
            document.body.removeChild(form);
        },

        hasClientAccess: function (urlOrCode) {
            urlOrCode = urlOrCode.replace(/\./g, "/");
            if (urlOrCode == "app/function")
                return true;
            if (urlOrCode == "traderequest/partail/selecthref")
                return true;
            if (urlOrCode == "traderequest/partail/request")
                return true;

            var allmenus = HY.config.menu.selectLeaves("Menus", false);
            return !!allmenus.count("x=>(Box.isString(x.Url) && Box.String.endsWith(x.Url.split('?')[0],'" + urlOrCode + "')) || x.FunctionCode=='" + urlOrCode + "'");
        },

        hasAccess: function (urlOrCode) {
            var has = true;
            $.ajaxSettings.async = false;
            $.getJSON("api/SysMgr/Auth/Access?urlOrCode=" + urlOrCode, function (data) {
                has = data;
            });
            $.ajaxSettings.async = true;
            return has;
        },

        renderFunction: function (target) {
            var fns = $(target).find("[data-function]");
            if (fns.length == 0)
                return;

            var fncodes = $.map(fns, function (item) {
                return $(item).data("function");
            });

            var fncodedis = fncodes.distinct();
            fncodedis.foreach(function (code) {
                var hasAccess = Box.Common.hasAccess(code);
                if (!hasAccess) {
                    fns.filter("[data-function='" + code + "']").remove();
                }
            });
        },
        getLengthStr: function (str, strLength) {
            var tmp = 0;
            var len = 0;
            var okLen = 0;
            for (var i = 0; i < strLength; i++) {
                if (str.charCodeAt(i) > 255)
                    tmp += 2;
                else
                    len += 1;
                okLen += 1;
                if (tmp + len == strLength) {
                    return (str.substring(0, okLen));
                }
                if (tmp + len > strLength) {
                    return (str.substring(0, okLen - 1) + " ");
                }
            }
            return str;
        },

        getLength: function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255)
                    len += 2;
                else
                    len += 1;
            }
            return len;
        },

        padLeft: function (text, length, ch) {
            if (text && Box.isString(text) && length && Box.isInteger(length)) {
                if (Box.isString(ch)) {
                    if (ch.length > 1)
                        ch = ch.substring(0, 1);
                } else
                    ch = " ";
                while (text.length < length) {
                    text = ch + text;
                }
            }
            return text;
        },

        padRight: function (text, length, ch) {
            if (text && Box.isString(text) && length && Box.isInteger(length)) {
                if (Box.isString(ch)) {
                    if (ch.length > 1)
                        ch = ch.substring(0, 1);
                } else
                    ch = " ";
                while (text.length < length) {
                    text = text + ch;
                }
            }
            return text;
        },

        getFields: function (obj, field) {
            var rtn = [];
            if (Box.isObject(obj)) {
                for (var key in obj) {
                    if (key == field) {
                        rtn.push(obj[key]);
                    } else {
                        rtn.addRange(Box.Common.getFields(obj[key], field));
                    }
                }
            } else if (Box.isArray(obj)) {
                Box.Array.forEach(obj, function (o) {
                    rtn.addRange(Box.Common.getFields(o, field));
                }, this);
            }
            return rtn.distinct();
        },


        //根据Summary来判断需要添加多少个空行,来避免分割单元格错乱
        getEmptyRowCount: function (innerItem) {
            if (innerItem.Summary) {
                var str = innerItem.Summary;
                var anostr = "";
                var elements = str.split('|');

                if (Box.HY.DicHelper.formatDicForDealType(innerItem.DealType) == "债券远期") {
                    if (innerItem.ActType == "新建") {
                        //elements[0] = elements[0] + "              新建";
                        anostr = "              新建";
                    } else {
                        if (str.indexOf("转代持") < 0)
                            anostr = '             由<a href="\\#traderequest/openrepo/orpanel?oper=newtodo&requestNo=' + innerItem.attach + '">' +
                                innerItem.attach + '</a>' + (innerItem.ActType || "变更");
                        else {
                            anostr = '             由<a href="\\#traderequest/futureplus/orpanel?oper=newtodo&requestNo=' + innerItem.attach + '">' +
                                innerItem.attach + '</a>' + (innerItem.ActType || "变更");
                        }
                    }
                }

                if (Box.HY.DicHelper.formatDicForDealType(innerItem.DealType) == "代缴款") {
                    if (innerItem.ActType == "新建") {
                        anostr = "              新建";
                    } else {
                        if (str.indexOf("转代缴款") < 0)
                            anostr = '             由<a href="\\#traderequest/payment/paypanel?oper=newtodo&requestNo=' + innerItem.attach + '">' +
                                innerItem.attach + '</a>' + (innerItem.ActType || "变更");
                        else {
                            anostr = '             由<a href="\\#traderequest/turnpayment/paypanel?oper=newtodo&requestNo=' + innerItem.attach + '">' +
                                innerItem.attach + '</a>' + (innerItem.ActType || "变更");
                            ;
                        }
                    }
                }
                //var num = Box.HY.DicHelper.formatDicForBizType(innerItem.RequestType) == "自营业务" ? 1 : 2;
                return anostr === "" ? elements.length : elements.length + 1;
            } else {
                return 1;
            }
        },

        //获取下一个工作日
        getNextWorkDay: function (tradeMarket, dtDate) {
            var nextWorkDay = dtDate;
            $.ajaxSettings.async = false;
            $.getJSON("/api/System/GetNextWorkDay?tradeMarket=" + tradeMarket + "&date=" + dtDate, function (result) {//System/api/DurationMgr/AssetCheck/GetNextWorkDay
                nextWorkDay = result;
            });
            $.ajaxSettings.async = true;
            return nextWorkDay;
        },

        //检查当前时间是否可以撤销：
        //tradeMarket--交易市场, dtDate--日期, ishasAccess--是否判断权限
        getChkCrrentDateIsRevoke: function (tradeMarket, dtDate, ishasAccess) {
            var nextWorkDay = Box.Common.getNextWorkDay(tradeMarket, dtDate);
            var nextTime = Date.from(nextWorkDay).addHours(12);
            if (nextTime.isEarlierThen(Date.now2(), "yyyy-MM-dd HH:mm:ss")) {
                if (ishasAccess) {
                    var result = Box.Common.hasAccess("btncancle");
                    if (result) {
                        return "";
                    }
                }
                return "财务数据已推送，如需撤销，请联系管理员！";
            }
            return "";
        },
    };
})();



//Box.config = {

//    //回购利率默认选项，0-实际利率，1-市场利率，2-加权利率
//    dftRepoRateType: function () {
//        return {
//            "ZS": 2,
//            "RX": 0,
//            "WL": 0,
//            "CT": 2,
//        }[HY.Context.AppCode];
//    },

//    //defaultPortFlag: function () {
//    //    return {
//    //        "ZS": false,
//    //        "RX": false,
//    //        "WL": false,
//    //        "CT": false,
//    //    }[AppCode];
//    //},

//    //是否需要合伙人
//    hasCopartner: function () {
//        return {
//            "ZS": false,
//            "RX": false,
//            "WL": false,
//            "CT": true,
//        }[HY.Context.AppCode];
//    },

//    //机构简称
//    getSelfCounterParty: function () {
//        return {
//            "ZS": "浙商证券",
//            "RX": "日信证券",
//            "WL": "万联证券",
//            "CT": "财通证券"
//        }[HY.Context.AppCode];
//    },

//    //自营的现券业务，可以使用以下组合中的券
//    returnSelfBondBizTypes: function () {
//        return {
//            "ZS": [1],
//            "RX": [1],
//            "WL": [1, 8],
//            "CT": [1, 1012, 1014],
//        }[HY.Context.AppCode];
//    },

//    //自营的债券借贷业务，可以使用以下组合中的券
//    returnSelfSeclendBizTypes: function () {
//        return {
//            "ZS": [1],
//            "RX": [1],
//            "WL": [1, 8],
//            "CT": [1, 3, 100010, 100011, 1012, 1014, 100016],
//        }[HY.Context.AppCode];
//    },

//    //自营的回购业务，可以使用以下组合中的券
//    returnSelfRepoBizTypes: function () {
//        return {
//            "ZS": [1, 3, 100011, 1012, 1014, 100016],
//            "RX": [1],
//            "WL": [1, 3, 8, 1012, 1014, 100016],
//            "CT": [1, 3, 100010, 100011, 1012, 1014, 100016],
//        }[HY.Context.AppCode];
//    },

//    //
//    //onlyOtherBizTypes: function () {
//    //    return {
//    //        "ZS": [9],
//    //        "RX": [],
//    //        "WL": [],
//    //        "CT": [],
//    //    }[AppCode];
//    //},


//    //
//    //onlyCommonBizTypes: function () {
//    //    return this.allBizTypes().except(this.onlyOtherBizTypes()).distinct();
//    //},

//    //所有业务类型
//    allBizTypes: function () {
//        return Box.HY.DicHelper.getDicOfBizType().select(function (x) {
//            return parseInt(x.value);
//        });
//    },

//    //所有中间业务类型
//    allMiddleBizTypes: function () {
//        return this.allBizTypes().intersect([100010, 100011, 1012, 1014, 100016]).distinct();
//    },

//    //自营组合
//    onlySelfBizTypes: function () {
//        return {
//            "ZS": [1, 3],
//            "RX": [1],
//            "WL": [1, 3, 8],
//            "CT": [1, 3],
//            "ZY": [1, 3]
//        }[HY.Context.AppCode];
//    },

//    //uncheckShowTick: 24 * 60 * 60 * 1000
//};

/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.5.18
 * 描    述：封装的kendoUI的窗口,添加了右下角的按钮
 * ======================================================================== */

Box.define('Box.Window', {
    statics: {
        //默认右下角按钮的配置
        DEFAULT_BUTTON_CONFIG: {
            name: '', //按钮的名字,需要唯一
            text: '', //按钮显示的文字
            icon: '', //使用fontawesome的图标
            theme: "", //k-primary,k-info,k-success,k-warning,k-danger
            disable: false, //是否禁用按钮
            display: true, //是否显示按钮
            handler: '', //点击按钮的处理函数
            scope: null, //按钮处理函数的作用域
        }
    },

    extend: Box.Component,

    templates: {
        main: ['<div></div>'],

        //window的主体模板,包含主体内容和下面的按钮区域
        //(kendoUI的window是不包含按钮的,按钮是自己添加的,所以包含在这一块里面)
        body: [
            '<div class="window-body">' +
            '<div class="window-content"></div>' +
            '<div class="window-footer k-edit-buttons k-state-default"></div>' +
            '</div>'
        ],
        //右下角按钮模板
        button: ['<a name="{name}" <tpl if="!display"> style="display:none" </tpl>  <tpl if="disable"> disabled </tpl>  class="window-btn k-button k-button-icontext {theme}" href="javascript:void(0);"><span style="margin-right: 5px;" class="fa {icon}"></span>{text}</a>']
    },

    maximize: false, //默认弹出的时候,是否是最大化的

    buttons: [], //窗口底部的按钮

    width: 500,

    height: 300,

    minHeight: 100,

    minWidth: 200,

    modal: true, //Specifies whether the window should show a modal overlay over the page.

    title: '', //窗体的标题

    // icon: 'fa-edit', // 窗体标题前的图标   没人用,去掉了

    actions: [
//按钮右上角的按钮,如果值为false,则不显示标题栏
        //"Pin",    //固定按钮
        "Minimize", //最小化
        "Maximize", //最大化
        "Close" //关闭
    ],

    draggable: true,

    resizable: true,

    autoOpen: true, //如果为false,则需要手动调用open打开窗口,

    animation: {
        //设置窗口出现和关闭的动画(请不要乱改)
        close: {
            duration: 200,
            effects: "fade:out"
        },
        open: {
            duration: 200
        }
    },

    closeAction: 'destroy', //关闭的时候是销毁(destroy)还是隐藏(hide)

    contentElements: {
        //窗体里面的元素选择器,在用这个窗体的时候需要用这个,而不能用elements

    },

    //获取window居中的位置坐标
    _getWindowPosition: function () {
        var body = $(document.body);
        var top = (body.height() - parseInt(this.height)) / 2;
        var left = (body.width() - parseInt(this.width)) / 2;
        return {
            top: top,
            left: left
        };
    },

    //初始化窗体
    _initWindow: function () {
        var me = this;
        this.width = Math.max(parseFloat(this.width), parseFloat(this.minWidth));
        this.height = Math.max(parseFloat(this.height), parseFloat(this.minHeight));
        this.window = this.el.target.kendoWindow({
            width: this.width,
            height: this.height,
            modal: this.modal,
            title: this.title,
            position: this._getWindowPosition(),
            actions: this.actions,
            draggable: this.draggable,
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            resizable: this.resizable,
            visible: false,
            animation: this.animation,
            activate: function (e) {
                me.onActivate.call(me, e);
            },
            close: function (e) {
                Box.Common.fnCloseEvent();
                me.onClose.call(me, e);
            },
            deactivate: function (e) {
                me.onDeActivate.call(me, e);
            },
            dragend: function (e) {
                me.onDragend.call(me, e);
            },
            dragstart: function (e) {
                me.onDragstart.call(me, e);
            },
            open: function (e) {
                if (me.maximize) {
                    this.maximize();
                }
                me.onOpen.call(me, e);
                me.onResize.call(me, e);
                $(".k-animation-container:has([role='tooltip'])").hide();
            },
            resize: function (e) {
                me.onResize.call(me, e);
            },

        }).data("kendoWindow");

        //this.window.center();

        if (this.closeAction == 'destroy') {
            this.window.bind("close", this._destroyWindow);
        }

        this._setTitle();

        if (!this.actions) {
            this.window.wrapper.css("padding-top", "5px").find('.k-window-titlebar').remove();
        }
    },

    _setTitle: function () {

        if (!Box.isEmpty(this.title)) {
            this.window.wrapper.find('.k-window-title').html('<div class="k-window-title-text">' + this.title + '</div>');
        }
    },

    //初始化右下角的按钮
    _initButtons: function () {
        var statics = this.statics();
        var wnd = this;
        if (this.buttons.length) {
            this.el.buttons = this.el.buttons || {};
            var buttons = Box.isObject(this.buttons) ? [this.buttons] : this.buttons;
            Box.Array.forEach(buttons, function (btn) {
                if (btn) {
                    var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_BUTTON_CONFIG));
                    this.el.footer.append(this.el.buttons[btn.name] = btnEl);

                    var handler = btn.handler;
                    if (Box.isString(btn.handler)) {
                        handler = this[btn.handler];
                    }
                    if (btn.onceonly) {
                        handler = Box.Function.preFunction(handler, function () {
                            wnd.fnDisableBtn(btn.name);
                            wnd.disabledBtns.push(btn.name);
                        });
                    }
                    this._bindBtnHandler(btnEl, 'click', handler, btn, btn.scope);
                }
            }, this);
        }
    },

    //初始化主题部分(用户自定义的窗体内容和按钮区域拼起来填充到窗体里面)
    _initBody: function () {
        this.el.body = this.applyTemplate('body');
        this.el.content = this.el.body.find('.window-content');
        this.el.footer = this.el.body.find('.window-footer');
        if (this.templates.content) {
            var content = this.applyTemplate('content', this.getContentData());

            //this.window.content(content);
            //this.el.body = $(content);
            this.el.content.append(content);

            //$(bodyHtml).append($(content));

        }

        if (this.buttons.length == 0) { //没有按钮的话,隐藏按钮区域
            this.el.content.css('bottom', '0px');
        }

        this._initButtons();
        //var buttons = this._initButtons();
        //if (buttons) {
        //    bodyHtml.find('.footer').append(buttons);
        //}

        this.window.content(this.el.body);
        this.applyElements(this.contentElements);
    },

    getContentData: Box.emptyFn, //获取渲染内容的数据,返回JSON对象

    fnTitle: function (title) { //获取或者设置窗体的title
        if (title) {
            this.window.title(title);
        } else {
            return this.window.title();
        }
    },

    disabledBtns: [],

    //打开窗口
    fnOpen: function () {
        for (var i = 0; i < this.disabledBtns.length; i++) {
            this.fnEnableBtn(this.disabledBtns[i]);
        }
        this.disabledBtns = [];
        this.window.open();
    },

    //关闭窗口
    fnClose: function () {
        this.window.close();
    },

    //显示右下角的按钮
    fnShowBtn: function (name) {
        this.el.buttons[name].show();
    },

    //隐藏右下角的按钮
    fnHideBtn: function (name) {
        this.el.buttons[name].hide();
    },

    _setBtnDisable: function (name, disable) {
        this.el.buttons[name].attr("disabled", disable);
    },

    //禁用按钮
    fnDisableBtn: function (name) {
        this._setBtnDisable(name, true);
    },

    //启用按钮
    fnEnableBtn: function (name) {
        this._setBtnDisable(name, false);
    },

    //禁用所有按钮
    fnDisableAllBtn: function () {
        for (var btn in this.el.buttons) {
            this.fnDisableBtn(btn);
        }
    },

    //启用所有按钮
    fnEnableAllBtn: function () {
        for (var btn in this.el.buttons) {
            this.fnEnableBtn(btn);
        }
    },

    fnCalHeight: function (height) {
        /*this.window.setOptions({
         height: height + 60
         });
         this._fnIcon();*/
    },

    init: Box.emptyFn, //可以自己在这里初始化一些东西

    setup: function () {
        var me = this;
        this.el.target.keydown(function (e) {
            if ($(e.target).is(me.el.target) && e.keyCode == 13) {
                me.onEnter.call(me);
            }
        });

        this.beforeInit.call(this);
        this._initWindow();
        //this.initBottons();
        this._initBody();


        if (this.autoOpen) {
            this.fnOpen();
        }

        this.init();

        this.afterInit.call(this);

        if (this.target) {
            this.target.window = this;
        }
    },

    beforeInit: Box.emptyFn,

    onEnter: Box.emptyFn,// 点击回车键触发事件

    onActivate: Box.emptyFn, //Triggered when a Window has finished its opening animation.

    onDeActivate: Box.emptyFn, //Triggered when a Window has finished its closing animation.

    onOpen: Box.emptyFn, //打开窗体的时候命中,会在init之前命中

    afterInit: Box.emptyFn, //初始化结束后

    onClose: Box.emptyFn, //Triggered when a Window is closed (by a user or through the close() method).

    onDragstart: Box.emptyFn, //拖动开始的时候命中

    onDragend: Box.emptyFn, //拖动结束的时候命中

    onResize: Box.emptyFn, //大小改变的时候命中

    _destroyWindow: function () {
        var me = this;
        setTimeout(function () {
            me.destroy();
        }, 2000); //这儿设置延迟是为了把动画效果跑完
    },

}, function () {
    Box.Window.show = function (options) {
        options.autoOpen = true;
        var wnd = new Box.Window(options);
        return wnd;
    };

    Box.Window.removeAll = function () {
        //$(".k-widget.k-window").remove();
    };
});
/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.5.18
 * 描    述：继承自Box.Window,弹出窗口,给用户确认信息
 用的时候传入message和callback就行了
 示    例:
 new Box.ConfirmDialog({
 message:'确定要减肥?',
 callback:function(result) {
 if (result) {
 console.log('true');
 } else {
 console.log('false');
 }
 }
 });


 Box.ConfirmDialog.show({
 message: '确定要减肥?',
 callback: function (result) {
 if (result) {
 console.log('true');
 } else {
 console.log('false');
 }
 }
 });
 * ======================================================================== */
Box.define('Box.ConfirmDialog', {
    extend: 'Box.Window',

    templates: {
        content: [
            //'<div style="text-align: center;padding: 16px;">{message}</div>'
            "<div class='hy-notify-2 hy-notify-confirm-2'>" +
            "<i class='fa fa-question-circle hy-notify-icon-2'></i>" +
            "<span class='hy-notify-message-2'>{message}</span>" +
            "</div>"
        ]
    },

    title: '确认',

    icon: 'fa', // 窗体标题前的图标

    actions: [
        "Close" //只需要右上角的关闭按钮
    ],

    resizable: false, //不能调整大小

    draggable: true, //可以拖动

    width: '300px',

    height: '30px',

    scope: null,

    message: '', //需要显示的提示信息

    buttons: [
        {
            theme: "k-info",
            name: "confirm",
            text: "确定",
            handler: '_doConfirm'
        },
        {
            theme: "",
            name: "cancel",
            text: "取消",
            handler: '_doCancel'
        }
    ],

    onEnter: function () {
        this._doConfirm();
    },

    getContentData: function () {
        return {
            message: this.message
        };
    },

    _doConfirm: function () {
        this.callback.call(this.scope || this, true);
        this.ok.call(this.scope || this);
        this.window.close();
    },
    /**
     * 增加额外的自定义按钮点击扩展，执行内部函数名为
     * callback_extra()
     * @private
     */
    _doConfirm_extra: function () {
        this.callback_extra.call(this.scope || this, true);
        this.ok.call(this.scope || this);
        this.window.close();
    },

    _doCancel: function () {
        this.callback.call(this.scope || this, false);
        this.cancel.call(this.scope || this);
        this.window.close();
    },

    _close: function () {
        this.callback.call(this.scope || this, false);
        this.cancel.call(this.scope || this);
        this.window.close();
    },

    //回调函数, 用户点击确定返回true,点击取消返回false,用户关闭对话框也返回false
    callback: function (result) {

    },

    ok: function () {
    },

    cancel: function () {
    },

}, function () {
    Box.ConfirmDialog.show = function (options) {
        var cfm = new Box.ConfirmDialog(options);
        return cfm;
    };
});

/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.7.3
 * 描    述：封装的DropBlock组件
 * ======================================================================== */

Box.define('Box.DropBlock', {
    extend: Box.Component,

    templates: {
        main: ['<div></div>'],
        content: [
            '<div class="hy-dropblock-container" style="border: 1px solid #999 !important;">' +
            '<div class="k-resize-handle k-resize-e" style="display: block;"></div>' +
            '<div class="k-resize-handle k-resize-s" style="display: block;"></div>' +
            '<div class="k-resize-handle k-resize-se" style="display: block;"></div></div>'
        ],
        mask: ['<div class="hy-dropdown-mask" style="display: none;"></div>']
    },

    bindTo: false, //按钮组合绑定到该目标上

    liveTo: false,

    floatTo: "",

    openEvents: null,

    autoClose: true,

    width: 300,

    height: null,

    minWidth: 300,

    minHeight: 200,

    //打开下拉框
    fnOpen: function (e) {
        this.open.apply(this, arguments);
        if (e && e.cancel) {
            return;
        }
        var t = $(e.target).closest(".k-add-icon");
        var toffset = t.offset();
        var btop = 1 - parseInt(t.css("border-top-width"));
        var bbottom = 1 - parseInt(t.css("border-bottom-width"));
        var top = toffset.top + t.height() + btop + bbottom;
        var height = parseInt(this.height);
        if (top + height > $(document.body).height()) {
            top = toffset.top - height - 2;
        }

        var eTarget = this.floatTo ? t.closest(this.floatTo) : t.closest(".hy-dropblock-target").parent();
        if (eTarget.length == 0)
            eTarget = t.parent();
        var parent = eTarget;
        var offset = parent.offset();
        var bleft = 1 - parseInt(parent.css("border-left-width"));
        var left = offset.left - bleft;
        var width = parseInt(this.width);
        if (left + width > $(document.body).width()) {
            left = toffset.left;
            left = left - width;
            left = left + t.width() + parseInt(t.css("border-left-width")) + parseInt(t.css("border-right-width")) + 1;
        }

        this.el.content.css("top", top + "px");
        this.el.content.css("left", left + "px");
        this.el.content.show(200);
        this.el.mask.show();
        this.opend.apply(this, arguments);
    },

    //关闭下拉框
    fnClose: function (e) {
        this.close.apply(this, arguments);
        if (e && e.cancel) {
            return;
        }
        this.resizing = false;
        this.el.content.hide(200);
        this.el.mask.hide();
        this.closed.apply(this, arguments);
    },

    init: Box.emptyFn, //可以自己在这里初始化一些东西

    initBody: function () {
        if (this.width < this.minWidth)
            this.width = this.minWidth;
        if (this.height < this.minHeight)
            this.height = this.minHeight;

        var me = this;

        this.el.content = this.applyTemplate("content");
        this.el.content.css("position", "fixed");
        this.el.content.css("width", this.width + "px");
        if (this.height) {
            this.el.content.css("height", this.height + "px");
        }
        this.el.mask = this.applyTemplate("mask");
        if (this.autoClose) {
            this.el.mask.click(function () {
                me.fnClose.apply(me, arguments);
            });
        }
        $(document.body).append(this.el.content);
        $(document.body).append(this.el.mask);

        var open = function () {
            me.fnOpen.apply(me, arguments);
        };

        if (this.openEvents) {
            for (var key in this.openEvents) {
                if (this.targetElement) {
                    this.targetElement.find(key).on(this.openEvents[key], open);
                } else if (this.liveTo) {
                    $(this.liveTo).delegate(key, this.openEvents[key], open);
                }
            }
        } else {
            if (this.targetElement) {
                this.targetElement.click(open);
            } else if (this.liveTo) {
                $(this.liveTo).live("click", open);
            }
        }
    },

    initResize: function () {
        var handle = this.el.content.find(".k-resize-handle");
        handle.on("mousedown", Box.bind(this._resizestart, this));
        $(document.body).on("mouseup", Box.bind(this._resizeend, this));
        $(document.body).on("mouseleave", Box.bind(this._resizeend, this));
        $(document.body).on("mousemove", Box.bind(this._resize, this));
    },

    setup: function () {
        if (this.bindTo) {
            this.targetElement = $(this.bindTo);
            this.targetElement.addClass("hy-dropblock-target");
        }
        this.initBody();
        this.initResize();
        this.init();
    },

    open: Box.emptyFn,

    close: Box.emptyFn,

    opend: Box.emptyFn,

    closed: Box.emptyFn,

    _resizestart: function (e) {
        var handle = $(e.target);
        if (handle.hasClass("k-resize-se")) {
            this.resizing = "se";
        } else if (handle.hasClass("k-resize-s")) {
            this.resizing = "s";
        } else if (handle.hasClass("k-resize-e")) {
            this.resizing = "e";
        }
        $(document.body).on("selectstart", function () {
            return false;
        });
    },

    _resizeend: function () {
        this.resizing = false;
        $(document.body).on("selectstart", function () {
        });
    },

    _resize: function (e) {
        if (this.resizing) {
            var offset = this.el.content.offset();
            var sx = offset.left, sy = offset.top;
            var ex = e.clientX, ey = e.clientY;
            if (this.resizing.indexOf("e") > -1) {
                var w = ex - sx;
                if (w > this.minwidth) {
                    this.el.content.css("width", w + "px");
                }
            }
            if (this.resizing.indexOf("s") > -1) {
                var h = ey - sy;
                if (h > this.minheight) {
                    this.el.content.css("height", h + "px");
                }
            }
        }
    }

}, function () {
    Box.DropBlock.create = function (option) {
        var block = new Box.DropBlock(option);
        return block;
    };
});
/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.6.5
 * 描    述：封装的DropDownButton按钮组件
 * ======================================================================== */

Box.define('Box.DropDownButton', {
    statics: {
        //默认下拉项的配置
        DEFAULT_ITEM_CONFIG: {
            name: '', //按钮的名字,需要唯一
            text: '', //按钮显示的文字
            icon: '', //使用fontawesome的图标
            disable: false, //是否禁用按钮
            display: true, //是否显示按钮
            handler: '', //点击按钮的处理函数
            scope: null, //按钮事件的作用域
            withseparator: false //如果为true,会在item的下面放一条分隔线
        }
    },

    extend: Box.Component,

    templates: {
        main: [
            '<div class="hy-dropdown {theme}">' +
            '<ul class="hy-dropdown-container" style="display:none;min-width:{[Box.isString(values.width)? values.width:values.width +"px"]}"></ul>' +
            '<div class="hy-dropdown-mask" style="display: none;"></div></div>'
        ],

        mainbutton: [
            '<a name="{name}" class="k-button {theme}"><span class="fa {icon}" style="padding-right: 6px;"></span>{text}</a>'
        ],

        arrow: [
            '<a class="k-button hy-arrow {theme}"><span class="fa fa-caret-down"></span></a>'
        ],

        button: ['<li><a name="{name}" <tpl if="!display"> style="display:none" </tpl>  <tpl if="disable"> disabled </tpl>  class="dropdownitem" href="javascript:void(0);"><span style="margin-right: 5px;" class="fa {icon}"></span>{text}</a></li>'],

        separator: ['<li><hr style="padding: 0;margin: 0;"></li>']
    },

    elements: {
        container: '.hy-dropdown-container',
        mask: '.hy-dropdown-mask'
    },

    events: {
        'click mask': 'fnClose'
    },

    bindTo: false, //按钮组合绑定到该目标上，如果设定该值，下面一组属性不需要设置

    split: true, //是否显示下拉箭头
    name: 'dropdownButton',
    text: '', //按钮显示的文字
    icon: '', //使用fontawesome的图标
    theme: "k-default", //k-primary,k-info,k-success,k-warning,k-danger
    handler: '', //点击主按钮的处理函数
    scope: null, //按钮事件的作用域
    width: '', //弹出的下拉框的宽度
    buttons: [],

    _initBody: function () {
        this._initItems();
    },

    getMainTplData: function () {
        return {
            theme: this.theme,
            width: this.width
        };
    },

    //初始化按钮
    _initItems: function () {
        var me = this;
        var fnarrow = function () {
            var ul = $(this).closest(".hy-dropdown").find("ul.hy-dropdown-container");
            if (ul.is(":visible")) {
                me.fnClose();
            } else {
                me.fnOpen();
            }
        };

        var statics = this.statics();

        if (this.bindTo) {
            var target = $(this.bindTo);
            target.wrap("<div class='hy-dropdown'></div>");
            this.el.main = target.closest(".hy-dropdown");
            this.el.main.addClass(this.theme);
            this.el.main.append(this.el.container);
            this.el.main.append(this.el.mask);
            this._bindBtnHandler(target, 'click', fnarrow, {name: "target"}, target, this.scope);
        } else {
            var mainbtn = {
                name: this.name,
                text: this.text, //按钮显示的文字
                icon: this.icon, //使用fontawesome的图标
                theme: this.theme, //k-primary,其他样式待添加
                handler: this.handler, //点击按钮的处理函数
                scope: this.scope, //点击按钮的处理函数
            };

            var mbtn = this.applyTemplate("mainbutton", Box.apply({}, mainbtn, statics.DEFAULT_ITEM_CONFIG));
            this.el.target.append(mbtn);

            if (this.split) {
                var arrow = this.applyTemplate("arrow", {theme: this.theme});
                this.el.target.append(arrow);

                this._bindBtnHandler(arrow, 'click', fnarrow, {name: "arrow"}, arrow, this.scope);
                this._bindBtnHandler(mbtn, 'click', this.handler, mainbtn, this.scope);
                //mbtn.css("border-radius", "4px 0 0 4px");
                //arrow.css("border-radius", "0 4px 4px 0");
            } else {
                this._bindBtnHandler(mbtn, 'click', fnarrow, mainbtn, this.scope);
            }
        }

        if (this.buttons.length) {
            this.el.buttons = this.el.buttons || {};
            var buttons = Box.isObject(this.buttons) ? [this.buttons] : this.buttons;
            Box.Array.forEach(buttons, function (btn) {
                var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_ITEM_CONFIG));
                this.el.container.append(this.el.buttons[btn.name] = btnEl);

                var handler = function () {
                    me.fnClose();

                    if (Box.isString(btn.handler)) {
                        btn.handler = me[btn.handler];
                    }

                    if (Box.isFunction(btn.handler)) {
                        btn.handler.call(this);
                    }
                };

                this._bindBtnHandler(btnEl.find(">a"), 'click', handler, btn, btn.scope);

                if (btn.withseparator) {
                    var sp = this.applyTemplate('separator');
                    this.el.container.append(sp);
                }
            }, this);
        }
    },
    //打开下拉框
    fnOpen: function () {
        this.el.target.find(".hy-arrow>span.fa").removeClass("fa-caret-down").addClass("fa-caret-up");
        this.el.container.show(200);
        this.el.mask.show();
    },

    //关闭下拉框
    fnClose: function () {
        this.el.target.find(".hy-arrow>span.fa").removeClass("fa-caret-up").addClass("fa-caret-down");
        this.el.container.hide(200);
        this.el.mask.hide();
    },

    //显示按钮
    fnShowBtn: function (name) {
        this.el.buttons[name].show();
    },

    //隐藏按钮
    fnHideBtn: function (name) {
        this.el.buttons[name].hide();
    },

    _setBtnDisable: function (name, disable) {
        this.el.buttons[name].prop("disabled", disable);
    },

    //禁用按钮
    fnDisableBtn: function (name) {
        this._setBtnDisable(name, true);
    },

    //启用按钮
    fnEnableBtn: function (name) {
        this._setBtnDisable(name, false);
    },

    init: Box.emptyFn, //可以自己在这里初始化一些东西

    setup: function () {
        this._initBody();
        this.init();
    },
});
/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.5.18
 * 描    述：封装的kendoUI的Grid,添加了工具栏按钮和查询条件
 * ======================================================================== */

Box.define('Box.GridPage', {
    extend: Box.Component,

    statics: {
        //默认工具栏按钮配置
        DEFAULT_BUTTON_CONFIG: {
            text: '', //按钮显示的文字
            icon: '', //使用fontawesome的图标,
            handler: '', //点击按钮的处理函数
            name: '', //按钮的名字,需要唯一,这个属性一定要设置
            theme: "", //k-primary,k-info,k-success,k-warning,k-danger
            hidden: false,
            // operationType    增加对权限的控制,1代表当前按钮只有在可编辑状态显示,如果不配置的话,任何情况都显示,不做处理
        },

        //默认查询条件的配置
        DEFAULT_SEARCH_CONFIG: {
            name: '', //这个name后面会用作查询条件的field,所以需要跟字段名一样
            text: '', //查询条件显示的名字
            type: 'text', // 有这些类型: text  checkbox date  rangeDate comboBox  hide(不显示在页面上)
            operator: 'contains', //The supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), "gte" (greater than or equal to), "startswith", "endswith", "contains".
            renderData: '', //渲染的时候用的数据,
            isAdvanced: false, //是否属于高级查询条件
            //  isResetBtnHide: false,
            value: '', //初始化的值,
            placeholder: '', //只有当type为text,comboBox时才有效
            width: '192px', //默认的宽度,允许的格式:数值(100),字符串("150px")
            isRequired: false //是否必填
        }

        /**********查询条件示例******/
        //table_search:[
        //{
        //    name: 'RealName',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //    text: '用户名',
        //    type: 'text',// text radioBtn checkbox date
        //    operator: 'contains',  //The supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), "gte" (greater than or equal to), "startswith", "endswith", "contains".

        //},
        // {
        //     name: 'AccountID',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //     text: '登录账号',
        //     type: 'text',// text radioBtn checkbox date
        //     operator: 'contains',  //The supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), "gte" (greater than or equal to), "startswith", "endswith", "contains".
        //     //value: 'l'
        // },
        //{
        //    name: 'CreatedTime',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //    text: '创建时间',
        //    type: 'date',// text radioBtn checkbox date
        //    operator: 'eq',  //The supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), "gte" (greater than or equal to), "startswith", "endswith", "contains".
        //    //value:'2013-4-5'
        //},
        //  {
        //      name: 'CreatedTime',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //      text: '创建时间',
        //      type: 'rangeDate',// text radioBtn checkbox date
        //      isAdvanced: true,
        //      //value: {
        //      //    startDate: '2015-7-7',
        //      //    endDate:'2015-8-8'
        //      //}
        //  },
        // {
        //     name: 'IsSys',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //     text: '是否系统用户',
        //     type: 'checkbox',// text radioBtn checkbox date
        //     isAdvanced: true,
        //     value: [ 'false' ],
        //     renderData: [
        //         {
        //             value: 'true',
        //             text:'是'
        //         },
        //         {
        //             value: 'false',
        //             text:'否'
        //         }
        //     ]
        // },
        //    {
        //        name: 'IsForbidden',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        //        text: '是否禁用',
        //        type: 'comboBox',// text radioBtn checkbox date
        //        isAdvanced: true,
        //        //value: 'false',
        //        renderData: [
        //            {
        //                value: 'true',
        //                text: '是'
        //            },
        //            {
        //                value: 'false',
        //                text: '否'
        //            }
        //        ]
        //    }

        //],
    },


    searchBtn: {
        text: '查询',
        theme: '',
        icon: 'fa-search'
    },

    templates: {
        //查询按钮(当没有高级查询条件的时候使用)
        searchBtn: [
            '<div class="k-button-group" data-overflow="auto" style="visibility: visible;display:inline;">' +
            '<a class="searchBtn k-button k-info k-button-icontext k-group-start {theme}">' +
            '<span class=" k-icon fa {icon} "></span>{text}</a>' +
            '<a class="resetBtn k-button k-button-icontext k-group-end" style=" margin-left: 5px; display:none;  ">' +
            '<span class=" k-icon fa fa-refresh"></span>重置</a>' +
            '</div>'
        ],

        //查询按钮(当没有高级查询条件的时候使用)
        //resetBtnHide: [
        //    '<div class="k-button-group" data-overflow="auto" style="visibility: visible;display:inline;">' +
        //        '<a class="searchBtn k-button k-button-icontext k-group-start">' +
        //        '<span class="k-sprite fa fa-search"></span>查询</a>' +
        //        '</div>'
        //],

        //查询按钮(有高级查询条件的时候使用)
        advancedSearchBtn: [
            '<div class="k-button-group" data-overflow="auto" style="visibility: visible;display:inline;">' +
            '<a class=" searchBtn k-button k-info k-button-icontext k-group-start {theme}">' +
            '<span class=" k-icon fa {icon} "></span>{text}</a>' +
            '<a class="advancedBtn k-button k-info k-button-icon k-group-end {theme}" title="高级查询">' +
            '<span class=" k-icon fa fa-chevron-down   "></span></a>' +
            '<a class=" resetBtn k-button k-button-icontext " style=" margin-left: 5px; display:none; ">' +
            '<span class=" k-icon fa fa-refresh"></span>重置</a>' +
            '</div>'
        ],


        // 在调用的类里面添加   例如: customshow: ['<div>testtest</div>'] , 可以显示在table-customshow里面
        main: [
            '<div class="hy-gridpage">' +
            '<div class="table-customshow"></div>' +
            '<div class="table-toolbar k-toolbar k-widget k-toolbar-resizable"></div>' +
            '<div class="table-body" style="margin-top: -1px;"></div>' +
            '</div>'
        ],

        btnGroup: ['<div class="" style="margin: 3px;  border-radius: 5px;overflow: hidden; position: absolute;right: 0;"></div>'],

        customeSearchHtml: ['<div class="gridpage-search" style="margin: 3px; float:right"></div>'],

        //搜索区域的模板
        search: [
            '<div class="gridpage-search" style="margin: 3px; position: relative;">' +
            '<div class="commonSearch" style="position: inherit;"></div>' +
            '<div class="advancedSearch"></div>' +
            '<div class="searchLayer" style="display: none;"></div>' +
            '</div>'
        ],

        button: [
            '<a name="{name}"  {[values.operationType&& "data-operationtype=\'1\' " ]}  class="k-button {theme}" style="display:{[values.hidden?"none":"inline-block"]} ">' +
            '<span class="fa {icon}" style="margin-right: 5px;"></span>' +
            '{text}' +
            '</a>'
        ],

        //查询条件输入文本的模板
        text: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem <tpl else>commonSearchItem</tpl> ">' +
            '<div class="filterLabel"><label>{text}:</label></div> ' +
            '<div class="filterInput" style=" margin: 0 4.6px;"><input type="text" class="k-textbox {name}" name="{name}" placeholder="{placeholder}" style="height: 30px;margin: 0px; width:{[Box.isString(values.width)? values.width:values.width +"px"]}" value="{value}"></div> ' +
            '</div>'
        ],

        //单个日期查询条件
        date: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>">' +
            '<div class="filterLabel"><label>{text}:</label> </div>' +
            '<div class="filterInput" style=" margin: 0 4.6px;">' +
            '<input class="{name}" name="{name}" style="margin-right:3px;width:{[Box.isString(values.width)? values.width:values.width +"px"]}" value="{value}"></div>' +
            '</div>'
        ],

        //日期区间查询条件
        rangeDate: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>">' +
            '<div class="filterLabel"><label>{text}:</label> </div>' +
            '<div class="filterInput" style=" margin: 0 4.6px;"><input class="{name}-start" name="{name}" style="margin-right:3px;width:{[Box.isString(values.width)? values.width:values.width +"px"]}" value="<tpl if="value.startDate"> {value.startDate}</tpl>">' +
            '<label>至</label>' +
            '<input class="{name}-end" name="{name}" style="margin-right:3px;width:{[Box.isString(values.width)? values.width:values.width +"px"]}" value="<tpl if="value.endDate"> {value.endDate}</tpl>">' +
            '</div>' +
            '</div>'
        ],

        //复选框
        checkbox: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>">' +
            '<div class="filterLabel"> <label>{text}:</label> </div>' +
            '<div class="filterInput" style=" margin: 0 4.6px;">' +
            '<tpl for="renderData">' +
            '<input type="checkbox" id="checkbox-{parent.name}-{value}" value="{value}" class="k-checkbox" >' +
            '<label class="k-checkbox-label" for="checkbox-{parent.name}-{value}" style="line-height: .875em">{text}</label>' +
            '</tpl>' +
            '</div>' +
            '</div>'
        ],

        //下拉框
        comboBox: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>"> ' +
            '<div class="filterLabel"> <label>{text}:</label> </div>' +
            '<div class="filterInput" style=" margin: 0 4.6px;">' +
            '<select  placeholder="{placeholder}" name="{name}" class="{name}" style=" width:{[Box.isString(values.width)? values.width:values.width +"px"]}">' +
            '<option value="">全部</option>' +
            '<tpl for="renderData">' +
            '<option value="{value}">{text}</option>' +
            '</tpl>' +
            '</select>' +
            '</div>' +
            '</div>'
        ],
        //下拉多选框
        //multiselect: [
        //    '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>"> ' +
        //    '<div class="filterLabel"> <label>{text}:</label> </div>' +
        //    '<div class="filterInput" style=" margin: 0 4.6px;">' +
        //    '<select multiple="multiple" name="{name}" class="{name}" style=" width:{[Box.isString(values.width)? values.width:values.width +"px"]}">' +
        //    '{%  console.log(this); %}' +
        //    '<tpl for=" renderData ">' +
        //    '<option value="{value}">{text}</option>' +
        //    '</tpl>' +
        //    '</select>' +
        //    '</div>' +
        //    '</div>'
        //],
        //下拉多选框
        dropdownselect: [
            '<div name="{name}" class="<tpl if="isAdvanced">advancedSearchItem<tpl else>commonSearchItem</tpl>"> ' +
            '<div class="filterLabel"> <label>{text}:</label> </div>' +
            '<div class="filterInput" style=" margin: 0 4.6px;">' +
            '<input name="{name}" class="{name}" style=" width:{[Box.isString(values.width)? values.width:values.width +"px"]}">' +
            '</div>' +
            '</div>'
        ]
    },

    delegates: {
        'click {.searchBtn}': 'fnSearch',
        'click {.resetBtn}': 'fnResetSearch',
        'click {.advancedBtn}': 'fnToggleAdvancedQuery',
        'click {.searchLayer}': 'fnToggleAdvancedQuery'
    },

    elements: {
        tableBody: '.table-body', //下面gird的主体
        toolbar: '.table-toolbar', //上面的工具栏区域
        customshow: '.table-customshow'
    },
    serverFiltering: true,

    enableExport: false,

    ajaxUrl: '', //请求后台数据的url

    autoLoadData: false, //初始化完成后是否自动加载数据,如果为false,需要手动调用search 获取数据

    isfiltersArray: false,//true传到后台的filters是数组，false传到后台的filters是对象

    ///注意：移除了multiselect，统一使用dropdownselect
    table_search: null, //查询条件,如果是数组的话,就是内置的查询,如果是字符串的话,就是自定义的查询控件类名,自定义类一定要包含getFilter() 来返回有效的查询条件

    reset_btn_hide: false, //控制不显示重置按钮

    search_btn_hide: false, //控制不显示查询按钮

    pageabledisabled: false, //控制不显示分页

    table_height: null, //高度

    table_buttons: [], //在工具栏里面的按钮

    table_filterable: false, //是否显示列的过滤条件

    table_groupable: false,  //是否允许用户自己分组

    table_group: [],         //默认的分组选项

    table_aggregate: null,         //默认的统计配置

    //实例：
    // table_group: [{
    //     field: "DealType",
    //         dir: 'asc'
    // }]

    //range_date_null: false, //查询条件的日期范围是否允许为空

    table_serverSorting: true, //是否服务端排序

    default_search_params: null, //在查询初始化完成后,可以默认的设置一些查询条件,或者从其他页面跳转过来的时候,需要默认加一些查询条件

    table_columns: [ //新增可以传一个数组，或者传一个方法返回数组
        //{
        //    field: "RealName",  绑定的字段 
        //    title: "用户名",   字段显示的名称
        //    sortable: false,   是否支持排序
        //    attributes: {     //向列添加一些属性
        //        "class": "table-cell",
        //        style: "text-align: right; font-size: 14px"
        //    },
        //    template: function (dataItem) {  //自定义列
        //        return "<strong>" + kendo.htmlEncode(dataItem.name) + "</strong>";
        //    }
        //}
    ],

    table_sortable: true, //是否允许排序

    table_selectable: false, //"multi" 多选框. "single"单选框，  false  不需要选择

    table_selectable2: false, //对应kendoGrid中的selectable属性

    table_showselectall: false,

    table_order: null, //排序字段   举例：{ field: "age", dir: "desc" }

    dataSource_model: {},//数据的模型, 注意：遇到数据有枚举值的，需要把这个字段改为string类型，否则枚举值有0的时候，过滤筛选的时候会出现错误

    isPopupWin: false,  // 是否在window弹窗中,如果是在弹窗中显示，会加入 “table-body-win” 控制grid不随着浏览器大小而改变
    table_offsetSize: -5, //偏移量

    table_fnEnable: function (dataItem) {
        return true;
    },

    //table_order_type: 'desc',//排序方式

    fnGetSelectedRows: function () { //获取选择的行,返回选择的行的数据
        var selectedRows = this.gridpage.getSelection();
        return selectedRows;
    },

    //初始化工具栏
    _initToolBar: function () {
        var btnGroup = this.applyTemplate('btnGroup');
        var statics = this.statics();
        var me = this;

        if (this.table_buttons.length) {
            this.el.buttons = this.el.buttons || {};
            var buttons = Box.isObject(this.table_buttons) ? [this.table_buttons] : this.table_buttons;
            Box.Array.forEach(buttons, function (btn) {
                var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_BUTTON_CONFIG));
                btnGroup.append(this.el.buttons[btn.name] = btnEl);
                this._bindBtnHandler(btnEl, 'click', btn.handler, btn);
            }, this);
        }

        if (this.enableExport) {
            var btn = {
                name: "btnExport",
                text: Box.isObject(this.enableExport) && this.enableExport.name || "导出",
                icon: "fa fa-download",
                theme: "k-info"
            };
            var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_BUTTON_CONFIG));
            btnGroup.append(btnEl);
            var handler = Box.isObject(this.enableExport) && this.enableExport.handler || function () {
                // var queryParams = this.com_toolbar.fnGetParams();
                //var option = {
                //    table: this.gridpage.wrapper,
                //    fileName: this.name,
                //    params: null,
                //    ShowTitle: true
                //};
                //Box.Common.exportToExcel(option);

                me.allData(function (data) {

                    me.tmpgrid = $("<div>").HYGrid({
                        filterable: false,
                        pageable: false,
                        columns: me.table_columns
                    }).data("kendoGrid");
                    this.tmpgrid.dataSource.data(data);

                    var option = {
                        table: me.tmpgrid.wrapper,
                        fileName: me.name,
                        ShowTitle: true,
                        format: 'xls'
                    };

                    Box.Common.exportToExcel(Box.apply({}, me.enableExport.option, option));
                });
                //Box.Common.exportToExcel(this.gridpage.wrapper, this.name);
            };

            this._bindBtnHandler(btnEl, 'click', handler, btn, this);
        }


        if (this.enableExportCsv) {
            var btn = {
                name: "btnExport",
                text: Box.isObject(this.enableExportCsv) && this.enableExportCsv.name || "CSV",
                icon: "fa fa-download",
                theme: "k-info"
            };
            var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_BUTTON_CONFIG));
            btnGroup.append(btnEl);
            var handler = Box.isObject(this.enableExportCsv) && this.enableExportCsv.handler || function () {
                // var queryParams = this.com_toolbar.fnGetParams();
                //var option = {
                //    table: this.gridpage.wrapper,
                //    fileName: this.name,
                //    params: null,
                //    ShowTitle: true
                //};
                //Box.Common.exportToExcel(option);

                me.allData(function (data) {

                    me.tmpgrid = $("<div>").HYGrid({
                        filterable: false,
                        pageable: false,
                        columns: me.table_columns
                    }).data("kendoGrid");
                    this.tmpgrid.dataSource.data(data);

                    var option = {
                        table: me.tmpgrid.wrapper,
                        fileName: me.name,
                        ShowTitle: true,
                        format: 'csv'
                    };
                    Box.Common.exportToExcel(Box.apply({}, me.enableExportCsv.option, option));
                    //Box.Common.exportToExcel(option);
                });

                //Box.Common.exportToExcel(this.gridpage.wrapper, this.name);
            };

            this._bindBtnHandler(btnEl, 'click', handler, this);
        }

        this.el.toolbar.append(btnGroup);
    },

    //在请求数据前初始化查询条件
    _initSearchFilter: function () {
        if (this.default_search_params) {
            Box.Array.forEach(this.currentSearch, function (searchItem) {
                if (this.default_search_params[searchItem.name]) {
                    if (searchItem.type == 'text' || searchItem.type == 'date') {
                        searchItem.target.find('input').val(this.default_search_params[searchItem.name]);
                    } else if (searchItem.type == 'checkbox') {
                        Box.Array.forEach(searchItem.target.find(':checkbox'), function (checkbox) {
                            if (Box.Array.contains(this.default_search_params[searchItem.name], $(checkbox).attr('value'))) {
                                $(checkbox).attr('checked', '');
                            }
                        }, this);
                    } else if (searchItem.type == 'comboBox') {
                        var comboBox = searchItem.target.find('select.' + searchItem.name).HYDropDownList().data('kendoDropDownList');
                        comboBox.value(this.default_search_params[searchItem.name]);
                    } else if (searchItem.type == 'rangeDate') {
                        var startDate = this.default_search_params[searchItem.name].startDate;
                        var endDate = this.default_search_params[searchItem.name].endDate;

                        searchItem.target.find('.' + searchItem.name + '-start').val(startDate ? startDate : '');
                        searchItem.target.find('.' + searchItem.name + '-end').val(endDate ? endDate : '');
                        //} else if (searchItem.type == 'multiselect') {
                        //    //searchItem.target.find('select.' + searchItem.name).HYMultiSelect();
                        //    searchItem.target.find('select.' + searchItem.name).HYMultiSelect('select', searchItem.value);
                    } else if (searchItem.type == 'dropdownselect') {
                        searchItem.target.find('select.' + searchItem.name).HYDropDownSelect(searchItem.option);
                    }
                }
            }, this);
        }
    },

    //刷新列表
    fnRefresh: function () {
        this.fnSearch();
    },

    //fnCustomeSearch   自定义查询, 实例参考HY.durationmgr.assetmgr.chinabond.cbcgrid(中债对账)

    //开始请求数据
    fnSearch: function () {
        ////查询之前把分页置为第一页
        //if (this.gridpage.dataSource._page > 1) {
        //    this.gridpage.pager.page(1);
        //}
        //this.gridpage.dataSource.filter(this._getFilter());

        var filters = this._getFilters();

        if (filters === false) {
            return;
        }

        if (Box.isFunction(this.fnCustomeSearch)) {
            this.fnCustomeSearch();
        } else {
            this.gridpage.dataSource.query({
                filters: filters,
                page: 1, //this.gridpage.dataSource._page, 查询默认回到第一页
                pageSize: this.gridpage.dataSource.pageSize(),
                // pageSize: this.gridpage.dataSource._pageSize != 0 ? this.gridpage.dataSource._pageSize : 999999999,//如果等于0的话,说明页面上选择的是'All',就传一个很大的值到后台去
                skip: this.gridpage.dataSource.skip(),
                take: this.gridpage.dataSource.take(),
                sorts: this.table_order,
                group: this.table_group,
                aggregate: this.table_aggregate
            });
        }


        if (this.el.advancedSearch) {
            this.el.advancedSearch.hide();
            this.el.searchLayer.hide();
        }

    },

    //重置查询条件
    fnResetSearch: function () {
        Box.Array.forEach(this.currentSearch, function (searchItem) {

            if (searchItem.type == 'text' || searchItem.type == 'date') {
                searchItem.target.find('input').val('');
            } else if (searchItem.type == 'checkbox') {
                Box.Array.forEach(searchItem.target.find(':checkbox'), function (checkbox) {

                    $(checkbox).removeAttr('checked');

                }, this);
            } else if (searchItem.type == 'comboBox') {
                var comboBox = searchItem.target.find('select.' + searchItem.name).HYDropDownList().data('kendoDropDownList');
                comboBox.value('');
            } else if (searchItem.type == 'rangeDate') {
                searchItem.target.find('.' + searchItem.name + '-start:input').val('');
                searchItem.target.find('.' + searchItem.name + '-start:input').data("kendoDatePicker").max(new Date(2999, 1, 1)); //没办法置空,只有设置一个很大的值了,也不影响使用
                searchItem.target.find('.' + searchItem.name + '-end:input').val('');
                searchItem.target.find('.' + searchItem.name + '-end:input').data("kendoDatePicker").min(new Date(1900, 1, 1));
                //} else if (searchItem.type == 'multiselect') {
                //    searchItem.target.find('select.' + searchItem.name).HYMultiSelect('deselectAll', false);
                //    searchItem.target.find('select.' + searchItem.name).HYMultiSelect('updateButtonText');
            } else if (searchItem.type == 'dropdownselect') {
                searchItem.ddselect.value([]);
            }
        });

        //this.search();
    },

    //显示(隐藏)高级搜索
    fnToggleAdvancedQuery: function () {
        this.el.advancedSearch.slideToggle();
        this.el.searchLayer.toggle();
    },

    //初始化查询条件
    _initSearch: function () {
        var me = this;

        //添加查询条件
        if (this.currentSearch) { //如果是数组就是使用的内置的查询条件,如果是字符串,就是使用的自定义的查询条件

            if (Box.isString(this.currentSearch)) {
                var customeSearchHtml = this.applyTemplate('customeSearchHtml');

                this.customSearch = Box.create(this.currentSearch, {
                    renderTo: customeSearchHtml
                });

                this.el.toolbar.append(customeSearchHtml);

            } else {
                var searchHtml = this.applyTemplate('search');
                var commonSearch = searchHtml.find('.commonSearch');
                var advancedSearch = this.el.advancedSearch = searchHtml.find('.advancedSearch');
                this.el.searchLayer = searchHtml.find('.searchLayer');
                var statics = this.statics();
                var hasAdvancedQuery = false;
                // var isResetBtnHide = false;
                // var isSearchBtnHide = false;


                var filters = Box.isObject(this.currentSearch) ? [this.currentSearch] : this.currentSearch;

                Box.Array.forEach(filters, function (filter) {

                    //判断是否有高级查询条件
                    if (filter && filter.isAdvanced) {
                        hasAdvancedQuery = true;
                    }


                    this.filters = this.filters || {};

                    //filter = Box.apply({}, filter, statics.DEFAULT_SEARCH_CONFIG);

                    //hide类型的不显示在页面上
                    if (filter.type != 'hide') {
                        if (Box.isFunction(filter.renderData)) {
                            filter.renderData = filter.renderData.call(this);
                        }

                        var filterEl = this.applyTemplate(filter.type, Box.apply({}, filter, statics.DEFAULT_SEARCH_CONFIG));
                    }

                    filter.target = this.filters[filter.name] = filterEl;

                    if (!filter.isAdvanced) {
                        commonSearch.append(filter.target);
                    } else {
                        advancedSearch.append(filter.target);
                    }

                    if (filter.type == 'date') {
                        filter.widgets = [filterEl.find('input').kendoDatePicker().data("kendoDatePicker")];
                    } else if (filter.type == 'rangeDate') {
                        filter.widgets = [];
                        var startDatePicker = filterEl.find('.' + filter.name + '-start').kendoDatePicker({
                            value: Date.today().format()
                        }).data("kendoDatePicker");
                        var endDatePicker = filterEl.find('.' + filter.name + '-end').kendoDatePicker({
                            value: Date.today().format()
                        }).data("kendoDatePicker");

                        filter.widgets.push(startDatePicker);
                        filter.widgets.push(endDatePicker);

                        // var startDate = filterEl.find('.' + filter.name + '-start:input');
                        // var endDate = filterEl.find('.' + filter.name + '-end:input');

                        //设置日期变化的时候相应的范围
                        // startDatePicker.bind('change', function (e) {
                        //     me._startDateChange.call(me, endDatePicker, startDate);
                        // });
                        // endDatePicker.bind('change', function (e) {
                        //     me._endDateChange.call(me, startDatePicker, endDate);
                        // });
                        //
                        // if (startDate.val() != null && startDate.val() != '') {
                        //     // startDatePicker.value(startDate.val());
                        //     endDatePicker.min(Box.String.trim(startDate.val()));
                        // }
                        //
                        // if (endDate.val() != null && endDate.val() != '') {
                        //     //   endDatePicker.value(endDate.val());
                        //     startDatePicker.max(Box.String.trim(endDate.val()));
                        // }


                    } else if (filter.type == 'comboBox') {
                        var comboBox = filterEl.find('select.' + filter.name).HYDropDownList().data('kendoDropDownList');
                        if (filter.value != '') {
                            comboBox.value(filter.value);
                        }
                        filter.widgets = [comboBox];
                    } else if (filter.type == 'checkbox') {
                        filter.widgets = [];
                        Box.Array.forEach(filter.target.find(':checkbox'), function (checkbox) {
                            if (filter.value && Box.Array.contains(filter.value, $(checkbox).attr('value'))) {
                                $(checkbox).attr('checked', '');
                            }
                        });
                        // } else if (filter.type == 'multiselect') {
                        //     filter.width = filter.width || 150;
                        //     filterEl.find('select.' + filter.name).HYMultiSelect({
                        //         buttonWidth: filter.width
                        //     });
                        //     if (filter.value != '') {
                        //         filterEl.find('select.' + filter.name).HYMultiSelect('select', filter.value);
                        //     }
                    } else if (filter.type == 'dropdownselect') {
                        //filter.width = filter.width || 150;
                        if (filter.renderData) {
                            filter.options = {
                                dataSource: filter.renderData,
                                name: filter.text,
                                attributes: {"width": "calc(100% + 3px)"}
                            };
                            if (!Box.isNullOrUndefined(filter.value) && filter.value != "") {
                                filter.options.selectValues = filter.value;
                            }
                            filter.ddselect = filterEl.find('input.' + filter.name).HYDropDownSelect(filter.options);
                            filter.widgets = [filter.ddselect];
                        }
                    }

                    //绑定每个搜索条件的初始化函数
                    var initFn = this['init' + Box.String.firstUpperCase(filter.name) + 'Filter'];
                    if (Box.isFunction(initFn)) {
                        filter.initFn = initFn;
                        initFn.call(this, filter);
                    }
                    filter.initFn = initFn;


                }, this);

                //添加查询按钮
                var searchBtn = null;
                if (hasAdvancedQuery) {
                    searchBtn = this.applyTemplate('advancedSearchBtn', this.searchBtn);
                } else {
                    //if (isResetBtnHide) {
                    //    searchBtn = this.applyTemplate('resetBtnHide');
                    //} else {
                    searchBtn = this.applyTemplate('searchBtn', this.searchBtn);
                    //}

                }

                //判断是否隐藏重置按钮
                if (this.reset_btn_hide) {
                    // isResetBtnHide = true;
                    searchBtn.find('.resetBtn').hide();
                }

                //判断是否隐藏查询按钮
                if (this.search_btn_hide) {
                    // isSearchBtnHide = true;
                    searchBtn.find('.searchBtn').hide();
                }

                // if (isResetBtnHide) {
                //
                // }
                //
                // if (isSearchBtnHide) {
                //
                // }


                commonSearch.append(searchBtn);

                this.el.toolbar.append(searchHtml);
            }
        }
        this._initCustomToolbar();
    },

    _initCustomToolbar: Box.emptyFn,

    //给rangeDate使用的事件
    _startDateChange: function (endDatePicker, startDate) {
        endDatePicker.min(startDate.val());
    },

    //给rangeDate使用的事件
    _endDateChange: function (startDatePicker, endDate) {
        startDatePicker.max(endDate.val());
    },

    //获取查询条件
    _getFilters: function () {
        var filters = [];

        if (Box.isString(this.currentSearch) && this.customSearch) {
            filters = this.customSearch.fnGetFilter(); //获取自定义的查询条件,需要自定义的查询模块必须有fnGetFilter方法
        } else {
            //var me = this;
            if (this.isfiltersArray) {
                Box.Array.each(this.currentSearch, function (item) { //获取内置的查询条件
                    if (item.type != 'hide' &&
                        item.type != 'rangeDate' && item.type != 'checkbox' &&
                        item.type != 'comboBox' && item.type != 'multiselect' && item.type != 'dropdownselect') {
                        var value = Box.String.trim(item.target.find('input').val());

                        if (!value && item.isRequired) {
                            Box.Notify.warning(item.text + "不能为空！");
                            filters = false;
                            return false;
                        } else if (value) {
                            filters.push({
                                field: item.name,
                                operator: item.operator,
                                value: value,
                                logic: 'and'
                            });
                        }
                    }

                    //单独处理hide
                    if (item.type == 'hide') {
                        if (Box.isArray(item.value)) { //如果是数组的情况需要单独处理

                            Box.Array.forEach(item.value, function (innerItem) {
                                filters.push({
                                    field: item.name,
                                    operator: 'eq',
                                    value: innerItem,
                                    logic: 'and'
                                });
                            }, this);


                        } else {
                            filters.push({
                                field: item.name,
                                operator: item.operator,
                                value: item.value,
                                logic: 'and'
                            });
                        }

                    }
                    //单独处理rangeDate
                    else if (item.type == 'rangeDate') {
                        var startDate = item.target.find('.' + item.name + '-start:input').val();
                        var endDate = item.target.find('.' + item.name + '-end:input').val();

                        if ((!startDate || !endDate) && item.isRequired) {
                            Box.Notify.warning(item.text + "不能为空！");
                            filters = false;
                            return false;
                        }

                        if (startDate != '') {
                            filters.push({
                                field: item.name,
                                operator: 'gte',
                                value: Box.String.trim(startDate),
                                logic: 'and'
                                //  max: Box.String.trim(endDate)
                            });
                        }
                        if (endDate != '') {
                            filters.push({
                                field: item.name,
                                operator: 'lte',
                                value: Box.String.trim(endDate + ' 23:59:59'),
                                logic: 'and'
                                //   min: Box.String.trim(startDate)
                            });
                        }
                    }
                    //单独处理checkbox
                    else if (item.type == 'checkbox') {
                        var checkboxes = item.target.find('input');
                        Box.Array.forEach(checkboxes, function (checkbox) {
                            if (checkbox.checked) {
                                filters.push({
                                    field: item.name,
                                    operator: 'eq',
                                    value: $(checkbox).val(),
                                    logic: 'or'
                                });
                            }
                        }, this);

                    }
                    //单独处理comboBox
                    else if (item.type == 'comboBox') {
                        //console.log( item.target.find('select.' + item.name).data('kendoComboBox').value());
                        var comboBoxValue = item.target.find('select.' + item.name).data('kendoDropDownList').value();

                        if (comboBoxValue != '') {
                            filters.push({
                                field: item.name,
                                operator: 'eq',
                                value: Box.String.trim(comboBoxValue),
                                logic: 'and'
                            });
                        }
                    }
                    //单独处理multiselect
                    //else if (item.type == 'multiselect') {
                    //    var multis = item.target.find('option:selected');
                    //    Box.Array.forEach(multis, function(multi) {

                    //        filters.push({
                    //            field: item.name,
                    //            operator: 'eq',
                    //            value: $(multi).val(),
                    //            logic: 'or'
                    //        });

                    //    }, this);

                    //}
                    //单独处理dropdownselect
                    else if (item.type == 'dropdownselect') {
                        var multis2 = item.ddselect.value().split(",").where("x=>x");
                        if (multis2.length) {
                            filters.push({
                                field: item.name,
                                operator: 'in',
                                value: multis2,
                                logic: 'and'
                            })
                        }

                        // Box.Array.forEach(multis2, function (it) {
                        //     filters.push({
                        //         field: item.name,
                        //         operator: item.operator,
                        //         value: it,
                        //         logic: 'or'
                        //     });
                        // }, this);
                    }
                });
            } else {
                filters = {};
                Box.Array.each(this.currentSearch, function (item) { //获取内置的查询条件

                    if (item.type != 'hide' &&
                        item.type != 'rangeDate' && item.type != 'checkbox' &&
                        item.type != 'comboBox' && item.type != 'multiselect' && item.type != 'dropdownselect') {
                        var value = Box.String.trim(item.target.find('input').val());

                        if (!value && item.isRequired) {
                            Box.Notify.warning(item.text + "不能为空！");
                            filters = false;
                            return false;
                        }
                        else if (value) {
                            filters[item.name] = value;
                        }
                    }

                    //单独处理hide
                    if (item.type == 'hide') {
                        filters[item.name] = item.value;
                    }
                    //单独处理rangeDate
                    else if (item.type == 'rangeDate') {
                        var startDate = item.target.find('.' + item.name + '-start:input').val();
                        var endDate = item.target.find('.' + item.name + '-end:input').val();

                        if ((!startDate || !endDate) && item.isRequired) {
                            Box.Notify.warning(item.text + "不能为空！");
                            filters = false;
                            return false;
                        }

                        if (startDate != '') {

                            filters[item.field[0]] = Box.String.trim(startDate);
                        }
                        if (endDate != '') {
                            filters[item.field[1]] = Box.String.trim(endDate + ' 23:59:59');
                        }
                    }
                    //单独处理checkbox
                    else if (item.type == 'checkbox') {
                        var checkboxes = item.target.find('input');
                        Box.Array.forEach(checkboxes, function (checkbox) {
                            if (checkbox.checked) {
                                filters[item.name] = $(checkbox).val();
                            }
                        }, this);

                    }
                    //单独处理comboBox
                    else if (item.type == 'comboBox') {
                        //console.log( item.target.find('select.' + item.name).data('kendoComboBox').value());
                        var comboBoxValue = item.target.find('select.' + item.name).data('kendoDropDownList').value();

                        if (comboBoxValue != '') {
                            filters[item.name] = Box.String.trim(comboBoxValue);
                        }
                    }
                    //单独处理multiselect
                    //else if (item.type == 'multiselect') {
                    //    var multis = item.target.find('option:selected');
                    //    Box.Array.forEach(multis, function (multi) {

                    //        filters[item.name] = $(multi).val();

                    //    }, this);

                    //}
                    //单独处理dropdownselect
                    else if (item.type == 'dropdownselect') {
                        var multis2 = item.ddselect.value().split(",").where("x=>x");

                        filters[item.name] = multis2;

                    }

                });
            }

        }

        if (filters.length == 0) {
            return null;
        }
        return filters;
    },

    //控制是否假分页
    _pageable: function () {
        if (this.pageabledisabled == true) {
            return true;
        } else {
            var pageable = {
                refresh: true,
                pageSizes: [10, 20, 30, "all"],
                buttonCount: 5
            };
            return pageable;
        }
    },
    //控制分页数
    _pageSize: function () {
        if (this.pageabledisabled == true) {
            return parseInt(50000);
        } else {
            return parseInt(30);
        }
    },

    _serverPaging: function () {
        if (this.pageabledisabled == true) {
            return false;
        } else {
            return true;
        }
    },

    beforeSearch: function (data) {
        return data;
    },

    //获取Grid的配置
    _getGridOption: function () {
        var me = this;
        var option = {
            autoBind: this.autoLoadData,
            pageable: this._pageable(),
//            height: this.table_height || Box.Common.fnGetGridHeight() -5, // 减去5px是为了防止出现滚动条
            resizable: true,
            scrollable: true,
            sortable: this.table_sortable,
            selecttype: this.table_selectable,
            fnEnable: this.table_fnEnable,
            showSelectAll: this.table_showselectall,
            filterable: this.table_filterable,
            columns: this.table_columns,
            groupable: this.table_groupable,
            offsetSize: this.table_offsetSize,
            fixedHeight: this.table_height ? true : false,
            selectable: this.table_selectable2
        };

        if (!this.isPopupWin) {
            option.height = this.table_height || Box.Common.fnGetGridHeight() + option.offsetSize;
        }

        if (Box.isFunction(this.fnCustomeSearch)) {
            option.dataSource =
                {
                    transport: {
                        read: function () {
                            me.fnCustomeSearch();
                        }
                    },
                    pageSize: me._pageSize(), //me.pageabledisabled?500:20,
                };
        } else {
            option.dataSource =
                {
                    transport: {
                        read: {
                            url: this.ajaxUrl,
                            type: "post",
                            dataType: "json",
                            contentType: "application/json"
                        },
                        parameterMap: function (data, action) {
                            //自定义查询参数
                            data.sorts = (data.sort && data.sort.length) ? data.sort : me.table_order;
                            data.filters = me._getFilters();

                            data = me.beforeSearch(data);
                            return Box.util.JSON.doEncode(data);
                        }
                    },
                    schema: {
                        data: "Data",
                        total: "Total",
                        model: me.dataSource_model
                    },
                    pageSize: me._pageSize(), //me.pageabledisabled?500:20,
                    serverPaging: me._serverPaging(),
                    serverFiltering: me.serverFiltering,
                    serverSorting: this.table_serverSorting,
                    group: this.table_group,
                    aggregate: this.table_aggregate
                    // sorts: me.table_order,
                    // filters: this._getFilters()
                };
        }

        //绑定事件
        if (this.onDetailInit) { //在每行初始化的时候触发
            option.detailInit = function (e) {
                me.onDetailInit.call(me, e);
            };
        }
        if (this.onChange) { //选择的行改变的时候触发
            option.change = function (e) {
                me.onChange.call(me, e);
            };
        }

        var dataBoundDefault = function (e) {
            var container = this.content || this.wrapper;
            if (container) {
                if (!this._data || this._data.length == 0 && container.find(".nodata").length == 0) {
                    container.append("<div class='nodata' >暂无数据</div>");
                } else {
                    container.find(".nodata").remove();
                }
            }
            if (option.selecttype == "multi" && option.showSelectAll) {
                me.gridpage.table.closest(".k-grid").find("th:first-child input:checkbox").prop("checked", false);
            }

            //根据成交单编号合并单元格(下面这段算法一定要把相同的成交单放在一块才行)
            var spans = me.gridpage.table.find("span[rowspan]");
            if (spans.length) {
                var fields = $.map(spans, function (sp) {
                    return $(sp).attr("field");
                }).distinct();
                var values = $.map(spans, function (sp) {
                    return $(sp).attr("value");
                }).distinct();
                fields.foreach(function (field) {
                    values.foreach(function (value) {
                        var sp = spans.filter("[field='" + field + "'][value='" + value + "']");
                        sp.first().closest("td").attr("rowspan", sp.length).css('vertical-align', 'middle');
                        sp.filter(':gt(0)').closest("td").not("[rowspan]").remove();
                        sp.remove();
                    });
                });
            }
        };
        if (this.onDataBound) { //在绑定数据的时候触发
            option.dataBound = function (e) {
                dataBoundDefault(e);
                me.onDataBound.call(me, e);
            };
        } else {
            option.dataBound = dataBoundDefault;
        }

        if (Box.isFunction(this.initDataSource)) {
            option.dataSource = Box.apply(option.dataSource, this.initDataSource());
        }

        return option;
    },

    setup: function () {
        this.table_columns = Box.isFunction(this.table_columns) ? this.table_columns.call(this) : this.table_columns;
        this.thisSetup();
    },

    thisSetup: function () {

        if (this.templates.hasOwnProperty('customshow')) {
            this.el.customshow.append(this.applyTemplate("customshow"));
        }

        this.currentSearch = Box.clone(this.table_search);
        // this.beforeSetup();

        this._initToolBar();

        //if (this.$params) {
        //    this._initParams(this.$params);
        //}

        this._initSearch();

        this._initSearchFilter();
        if (this.$params) {
            this._initParams(this.$params);
        }

        this.beforeBind();

        this.gridpage = this.el.tableBody.HYGrid(this._getGridOption()).data("kendoGrid");

        this.init();

        if (this.isPopupWin) {
            this.el.tableBody.addClass('table-body-win').css({'height': '100%'});
            this.el.tableBody.closest('.hy-gridpage').css({'height': '100%'});
            this.el.tableBody.wrapAll('<div style="height: calc(100% - 50px);"></div>');
        } else {
            if (!this.gridpage.options.fixedHeight) {
                $(this.gridpage.wrapper).css('height', (Box.Common.fnGetGridHeight() + (this.gridpage.options.offsetSize || 0)) + 'px');
                this.gridpage.resize();
            }
        }
    },

    //隐藏单个的过滤条件
    fnHideFilter: function (name) {
        this.filters[name].hide();
    },

    //显示单个的过滤条件
    fnShowFilter: function (name) {
        this.filters[name].show();
    },

    beforeSetup: Box.emptyFn, //在渲染控件之前，初始化一些东西

    init: Box.emptyFn, //可以自己在这里初始化一些东西

    beforeBind: Box.emptyFn, //可以自己在这里初始化一些东西

    initDataSource: Box.emptyFn,

    _initParams: function (params) { //对传入的$params 进行一些初始化的操作   params为url上传入的参数
        //例子:  ?AssignState=0,1&CounterParty=dd&SelfQuoterName=张三&TradeTime=2011-1-1,2013-1-1
        Box.Array.forEach(this.currentSearch, function (search) {
            if (params[search.name]) {
                if (search.type == "dropdownselect") {
                    search.ddselect.value(params[search.name]);
                } else if (search.type == "text") {
                    search.target.find('input').val(params[search.name]);
                } else if (search.type == "rangeDate") {
                    var dates = params[search.name].split(',');
                    search.target.find('input.TradeTime-start').val(dates[0] || '');
                    search.target.find('input.TradeTime-end').val(dates[1] || '');
                } else {
                    search.value = params[search.name];
                }

            }
        });
    },

    //onDetailInit: function (e) {//Fired when a detail table row is initialized.

    //},

    //onDataBound: function (e) {//Fired when the widget is bound to data from its data source.

    //},

    //onChange: function (e) {//Fired when the user selects a table row or cell in the grid.

    //}

    allData: function (fn) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: this.ajaxUrl,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json"
                },
                // parameterMap: function (data) {
                //
                //     return Box.util.JSON.doEncode(data);
                // }
                parameterMap: function (data, action) {
                    //自定义查询参数
                    data.sorts = me.table_order;
                    data.filters = me._getFilters();
                    data.page = 1;
                    data.pageSize = 999999999;
                    data.skip = 0;
                    data.take = 999999999;

                    data = me.beforeSearch(data);
                    return Box.util.JSON.doEncode(data);
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            },
            serverPaging: false,
            serverFiltering: true,
            serverSorting: this.table_serverSorting,
            // sorts: this.table_order,
            // filter: this._getFilters()
        });

        var me = this;
        dataSource.fetch(function () {
            var data = this.data();
            Box.bind(fn, me)(data);
        });
    }
});
/*
 * 用于处理页面的跳转
 */
Box.define('Box.HY.Page', {

    singleton: true,

    extend: Box.Component,

    //target: '#page-body',

    prefix: 'div_item',

    target: 'body',

    pages: [],  // 管理所有主体页面对象

    /*
     * 新增一个页面，不会删除原来主体中的dom数据，而是将其隐藏，再新加一个div。
     * 为了方便处理在前进和后退时，不用参数传递
     */
    addPage: function (classname, params) {

        var len = this.pages.length;
        if (len > 1 && this.pages[len - 2].classname && this.pages[len - 2].classname == classname) {
            // 这是一个后退操作
            $('#' + this.prefix + len).remove();
            this.pages.pop();
            this.showPage(len - 1);
            return;
        }

        var len2 = len + 1;

        var domid = this.prefix + len2;
        var $dom = $('<div id="' + domid + '"></div>');

        this.el.target.append($dom);

        try {
            var page = Box.create(Box.app.Application.name + '.' + classname, {
                renderTo: $dom,
                $params: params
            });
        } catch (e) {
            $dom.empty();
            console.log("error message:" + e);
            page = Box.create(Box.app.Application.name + '.error', {
                renderTo: $dom,
                $params: e
            });
            classname = 'error';
            throw e;
        }

        this.pages.push({
            id: domid,
            name: page.name || Box.String.EMPTY,
            classname: classname
        });

        this.hidePage(len2);
    },

    addPage2: function (hash, classname, params) {
        Box.Window.removeAll();
        if (this.replacePage(hash)) {
            return this.replacePage(hash);
        }

        var len = this.pages.length;
        /*if (len > 1 && this.pages[len - 2].hash && this.pages[len - 2].hash === hash) {
         // 这是一个后退操作
         $('#' + this.prefix + len).remove();
         this.pages.pop();
         this.showPage(len - 1);
         return;
         }*/

        var len2 = len + 1;

        var domid = this.prefix + len2;
        var $dom = $('<div id="' + domid + '" style="height: 100%;width: 100%;"></div>');

        this.el.target.append($dom);

        var page = {};

        //try {
        page = Box.create(Box.app.Application.name + '.' + classname, {
            renderTo: $dom,
            $params: params
        });

        this.pages.push({
            id: domid,
            name: page.name || Box.String.uuid(),
            classname: classname,
            hash: hash,
            component: page,
            target: $dom,
            params: params
        });

        this.hidePage(len2);
        return page;
        //} catch (e) {

        //    $dom.remove();

        //    Box.create(Box.app.Application.name + '.error', {
        //        $params: e
        //    });
        //}
    },

    //根据堆载中的页面,返回上一个页面
    goBackPage: function () {
        var len = this.pages.length;
        if (len > 1) {
            this.hidePage(len);
            this.showPage(len - 1);
            this.cleanPage(len - 1);
        }
    },

    //重新加载页面,hash可以传入页面的url,如果没有传入就默认取当前url
    reloadPage: function (hash) {
        var pageIndex = null;

        //如果有传入的url
        if (hash) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].hash == hash) {
                    pageIndex = i;
                }
            }
            if (!pageIndex) {
                return;
            }
        } else {
            pageIndex = this.pages.length - 1;//去pages最后一个就是当前的页面
        }

        this.pages[pageIndex].target.html('');
        var reloadPage = Box.create(Box.app.Application.name + '.' + this.pages[pageIndex].classname, {
            renderTo: this.pages[pageIndex].target,
            $params: this.pages[pageIndex].params
        });

        this.pages[pageIndex].component = reloadPage;

    },

    hidePage: function (seq) {
        for (var i = 0; i < seq; i++) {
            $('#' + this.prefix + i).hide();
        }
    },

    showPage: function (seq) {
        $('#' + this.prefix + seq).show();
    },

    /*
     * 清空pages对象，以及pages中对应的dom对象
     * @param index 没有就清空所有堆栈页面
     *          有就清空该index之后的堆栈页面
     */
    removePage: function (classname) {

        var index = -1;
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].classname == classname) {
                index = i;
                $('#' + this.prefix + i).remove();
            }
        }

        if (index > -1) {
            this.pages = this.pages.remove("x=>x.name=='" + classname + "'");
        }
    },

    /*
     * 清空pages对象，以及pages中对应的dom对象
     * @param index 没有就清空所有堆栈页面
     *          有就清空该index之后的堆栈页面
     */
    cleanPage: function (index) {

        var idx = index ? index + 1 : 1;
        for (var i = idx; i < this.pages.length + 1; i++) {
            $('#' + this.prefix + i).remove();
        }
        //this.pages = [];
        if (index) {
            this.pages = Box.Array.slice(this.pages, 0, idx - 1);
        } else {
            this.pages = [];
        }
    },

    afterRender: function () {
        this.callParent(arguments);
    },

    /*
     * 获取历史堆栈的长度
     */
    getLength: function () {
        return this.pages.length;
    },

    /*
     * 根据界面组件js的名称来获取历史界面组件
     * @param name  界面组件js
     */
    getPageByName: function (name) {

        var page = null;
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].name === name) {
                page = this.pages[i];
                break;
            }
        }
        return page;
    },

    /*
     * 跳转页面
     * @param name      界面组件js的name名称
     * @param callback  回调函数
     */
    gotoPage: function (name, callback) {

        var page = null;
        var index = 0;
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].name === name) {
                page = this.pages[i];
                index = i;
                break;
            }
        }

        if (page && page.component && callback) {
            index++;
            this.cleanPage(index);
            this.showPage(index);
            callback(page.component);
            if (page.hash)
                window.location = '#' + page.hash;
        }
    },

    /*
     * 跳转页面
     * @param name      界面组件js的name名称
     * @param callback  回调函数
     */
    gotoPage2: function (className, callback, params) {
        //如果有传入的url
        if (className) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].classname == className) {
                    var page = this.pages[i];
                    this.cleanPage(i + 1);
                    this.showPage(i + 1);
                    if (page.component && Box.isFunction(callback)) {
                        callback(page.component);
                        if (page.hash)
                            window.location = '#' + page.hash;
                    }
                    return;
                }
            }
        }
        var me = this;
        var hash = className.replace(/\./g, '/');
        window.location = '#' + hash;
        setTimeout(function () {//这儿把下面的加入代码队列,是为了先执行HashChange事件,再执行下面的代码
            page = me.addPage2(hash, className, params);
            Box.isFunction(callback) && callback(page.component);
        }, 10);

    },

    /*
     * 跳转页面,跳转的同时把本页面Destroy掉.
     * @param name      界面组件js的name名称
     * @param callback  回调函数
     */
    gotoPage3: function (className, callback) {

        //如果有传入的url
        if (className) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].classname == className) {
                    var page = this.pages[i];
                    if (page.component && Box.isFunction(callback)) {
                        this.cleanPage(i + 1);
                        this.showPage(i + 1);
                        callback(page.component);
                        if (page.hash)
                            window.location = '#' + page.hash;
                    }
                    return;
                }
            }
        }

        var hash = className.replace(/\./g, '/');
        window.location = '#' + hash;
        this.addPage2(hash, className);
        this.cleanPage(this.pages.length - 2);
    },

    /*
     * 根据hash来查找堆栈中是否存在，如果存在，则直接显示
     * @param url hash
     */
    replacePage: function (url) {
        var page = null;
        var index = 0;
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].hash === url) {
                page = this.pages[i];
                index = i;
                break;
            }
        }
        if (!Box.isEmpty(page)) {
            index++;
            this.cleanPage(index);
            this.showPage(index);
            return page;
        }
        return false;
    },

    //显示加载中
    // @param element   可以传一个jquery对象，进度条附在上面，如果不传，进度条就附在整个页面上
    showLoader: function (element) {
        kendo.ui.progress(element ? element : $('body'), true);

        //var loader = $('<div class="k-loading-mask" style="width: 100%; height: 100%; top: 0px; left: 0px;">' +
        //    '<div class="loader-inner ball-triangle-path">' +
        //    '<div></div>' +
        //    '<div></div>' +
        //    '<div></div>' +
        //    '</div>' +
        //    '<div class="k-loading-color">' +
        //    '</div></div>');

        //if (element) {
        //    element.prepend(loader);
        //} else {
        //    $('body').prepend(loader);
        //}
    },

    //隐藏进度条
    hideLoader: function (element) {
        kendo.ui.progress(element ? element : $('body'), false);

        //element = element ? element : $('body');
        //element.find('.k-loading-mask').remove();

    },

    //显示进度条
    // @param element   可以传一个jquery对象，进度条附在上面，如果不传，进度条就附在整个页面上
    // @param total   总共有多少个待处理对象
    // @param callBack   回调函数，处理进度
    // @param currentValue   当前处理完成的对象
    showProess: function (element, total, callBack, currentValue) {
        var parent = element || $('body');
        kendo.ui.progress(parent, true);
        $(".k-loading-mask .loader-inner").append('<span class="kendoProgressBar"  style="width:120px;top: 100px;left: -31px;"></span>');

        var progressBar = $(".k-loading-mask span.kendoProgressBar").kendoProgressBar({
            value: currentValue || 0,
            type: "percent",
            animation: {
                duration: 60
            }
        }).data('kendoProgressBar');

        Box.isFunction(callBack) && callBack.call(progressBar, progressBar.value());

    },
});

/*
 * 用于处理用户登录和权限
 */
Box.define('Box.HY.Auth', {

    singleton: true,

    urls: {
        reqLoginUrl: '/api/Auth/Login',

        reqLogoutUrl: '/api/Auth/Logout',

        reqLoginStatus: '/api/Auth/IsLogin',

        reqAutoLogin: '/api/Auth/LoginAuto'
    },

    extend: Box.Base,

    login: function (userName, password, callback) {
        var postdata = {UserName: userName, Password: password};
        $.ajax(
            {
                type: "post",
                url: this.urls.reqLoginUrl,
                data: postdata,
                success: function (data) {
                    if (data.IsSuccess) {
                        //把用户名存入cookie
                        Box.util.Cookie.set("userName", userName);

                        // 判断用户是否勾选的保存密码,再把密码存入cookie
                        //if (remember) {
                        //Box.util.Cookie.set("password", password);
                        //    Box.util.Cookie.set("isAutoLogin", "true");
                        //} else {
                        //    Box.util.Cookie.set("password", "");
                        //    Box.util.Cookie.set("isAutoLogin", "");
                        //}

                        var cookie = {
                            userName: userName,
                            userID: data.UID,
                            realName: data.RealName,
                            photo: data.Photo
                        };

                        Box.util.Cookie.set("token", data.Message);//存储token


                        Box.util.Cookie.set(userName, JSON.stringify(cookie));
                        Box.util.Cookie.set("currentUser", JSON.stringify(cookie));
                    }
                    callback(data);
                }
            });
    },

    logout: function () {
        $.ajax(
            {
                type: "post",
                url: this.urls.reqLogoutUrl,
                success: function () {
                    HY.Context = {};

                    var cookie = JSON.parse(Box.util.Cookie.get('currentUser'));

                    if (cookie) {

                        var username = cookie.userName;

                        cookie.userName = '';
                        cookie.password = '';
                        cookie.isAutoLogin = '';
                        Box.util.Cookie.set(username, JSON.stringify(cookie));
                    }

                    Box.util.Cookie.set("userName", "");
                    //Box.util.Cookie.set("password", "");
                    Box.util.Cookie.set("isAutoLogin", "");

                    location.href = "Home/Login";
                }
            });
    },

    autologin: function () {
        //$.ajax(
        //{
        //    type: "post",
        //    url: this.urls.reqAutoLogin,
        //    success: function (data) {
        //        if (data) {
        //            console.log(Date.now2().format("yyyy-MM-dd HH:mm:ss") + " - 自动登录成功。");
        //        }
        //    }
        //});
    },
});


/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.6.29
 * 描    述：封装的kendoUI,multiselect的控件
 * ======================================================================== */

$(function () {

    function bindData(obj) {
        obj.data = function () {
            return obj;
        };
        return obj;
    }

    function apply(object, config, scope) {
        if (!config) {
            return object;
        }
        if (Box.isFunction(config)) {
            config = config.apply(scope);
        }
        return Box.apply({}, config, object);
    }

    function isNull(val, defaultVal) {
        if (val == null)
            return defaultVal || null;
        return val;
    }

    var nubmers = {
        45: "-",
        46: ".",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9"
    };

    Box.global.HYNumericOptions = {
        //净价/收益率/回购利率/拆借利率：整数位最大长度3位，小数位最大长度4位
        Percent3_4: {
            format: 'n4',
            decimals: 4,
            integrals: 3,
            min: 0,
            step: 0.1
        },
        //折算比例：整数位最大长度3位，小数位最大长度2位
        Percent3_2: {
            format: 'n2',
            decimals: 2,
            integrals: 3,
            min: 0,
        },
        //券面面额：单位是万元的，整数位最大长度7位，不许输入小数位
        FaceAmt7: {
            format: 'n0',
            decimals: 0,
            integrals: 7,
            min: 0,
            showCurrency: true,
            unit: 10000,
            step: 1000,
        },
        //交易所券面面额：单位是万元的，整数位最大长度7位，允许输入两位小数位
        ExFaceAmt7: {
            format: 'n2',
            decimals: 2,
            integrals: 7,
            min: 0,
            showCurrency: true,
            unit: 10000,
            step: 1000,
        },
        //券面面额：单位是元的，整数位最大长度11位，不许输入小数位
        FaceAmt11: {
            format: 'n0',
            decimals: 0,
            integrals: 11,
            min: 0,
            showCurrency: true,
            step: 1000,
        },
        //金额（万元）：整数位最大长度7位，小数位最大长度2位
        CashAmt7: {
            format: 'n2',
            decimals: 2,
            integrals: 11,
            min: 0,
            showCurrency: true,
            unit: 10000,
            //step: 1000,
        },
        //金额（元）：整数位最大长度11位，小数位最大长度2位
        CashAmt11: {
            format: 'n2',
            decimals: 2,
            integrals: 11,
            min: 0,
            showCurrency: true,
            //step: 1000,
        },
        //回购期限：不能输入小数位，有个最大值，超过最大值输入不进去
        Days: {
            format: 'n0',
            decimals: 0,
            integrals: 3,
            max: 365,
            min: 1,
        },
        //BP：不能输入小数位，整数位最大长度4位，可以为负数
        BP: {
            format: 'n0',
            decimals: 0,
            integrals: 4,
            allowMinus: true,
        },
        //收益率
        Yield3_4: {
            format: 'n4',
            decimals: 4,
            allowMinus: true,
            integrals: 3
            //min: 0,
        }
    };

    jQuery.fn.extend({
        setCursorPosition: function (position) {
            if (this.length == 0) return this;
            return $(this).setSelection(position, position);
        },
        setSelection: function (selectionStart, selectionEnd) {
            if (this.length == 0) return this;
            var input = this[0];
            if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            } else if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
            return this;
        },
        getCursortPosition: function () {
            var caretPos = 0; // IE Support
            var input = this[0];
            if (input.selectionStart || input.selectionStart == '0')
                caretPos = input.selectionStart;
            return caretPos;
        },
        getCursortEnd: function () {
            var caretPos = 0; // IE Support
            var input = this[0];
            if (input.selectionEnd || input.selectionEnd == '0')
                caretPos = input.selectionEnd;
            return caretPos;
        },
        focusEnd: function () {
            this.setCursorPosition(this.val().length + 1);
        },

        setText: function (text) {
            var kendoNumericTextBox = $(this).data("kendoNumericTextBox");
            if (kendoNumericTextBox)
                $(this).data("kendoNumericTextBox").value(text || "");
            else
                $(this).val(text || "");
        },

        //多选控件
        HYMultiSelect: function (option, value, data) {
            if ($(this).length == 0)
                return null;

            if (Box.isString(option)) {
                $(this).multiselect(option, value, data);
            } else if (Box.isObject(option) || option === undefined || option == null) {
                option = Box.apply({}, option || {}, {
                    nonSelectedText: '请选择',
                    nSelectedText: '项已选择',
                    allSelectedText: '全部选择',
                    numberDisplayed: 1,
                    includeSelectAllOption: true,
                    selectAllText: '全选'
                });
                $(this).multiselect(option);
                $(this).parent().find("div.btn-group .multiselect.btn .caret").append('<span class="k-icon k-i-arrow-s"></span>');
            }
            var me = this;
            this.value = function (v) {
                if (Box.isEmpty(v)) {
                    return me.val();
                }
                if (Box.isString(v))
                    v = v.split(",");
                me.HYMultiSelect("select", v);
                return v;
            };
            return this;
        },

        HYTreeList: function (options) {
            if ($(this).length == 0)
                return null;

            var locked = options.columns && options.columns.count("x=>x.locked") || 0;

            //初始化grid的option
            var initOption = function (hyOption) {
                hyOption = hyOption || {};

                if (hyOption.columns) {


                    hyOption.resizable = !locked;

                    hyOption.columns.foreach(function (col) {
                        if (hyOption.editable && (col.editor || col.field)) {
                            col.headerAttributes = col.headerAttributes || {};
                            col.headerAttributes["editable"] = true;
                        }
                        if (col.noexport || col.hidden) {
                            col.headerAttributes = col.headerAttributes || {};
                            col.headerAttributes["data-noexport"] = true;
                            col.attributes = col.attributes || {};
                            col.attributes["data-noexport"] = true;
                            col.footerAttributes = col.footerAttributes || {};
                            col.footerAttributes["data-noexport"] = true;
                        } else if (col.noexport != null && col.noexport == false) {
                            col.headerAttributes = col.headerAttributes || {};
                            delete col.headerAttributes["data-noexport"];
                            col.attributes = col.attributes || {};
                            delete col.attributes["data-noexport"];
                            col.footerAttributes = col.footerAttributes || {};
                            delete col.footerAttributes["data-noexport"];
                        }
                    });

                    hyOption.columns.foreach(function (col) {
                        if (col["data-function"]) {
                            col["hidden"] = !Box.Common.hasAccess(col["data-function"]);
                        }
                    });
                    hyOption.reorderable = Box.ifNull(hyOption.reorderable, false);
                }

                var dataBound = function (e) {
                    var ths = this.wrapper.find("thead th[editable]");
                    $.each(ths, function (index, th) {
                        var icon = $(th).find("span.fa-pencil");
                        if (icon.length == 0) {
                            $(th).prepend('<span style="margin-right:3px;" class="fa fa-pencil txt-color-green2"></span>');
                        }
                    });

                    Box.Common.renderFunction(this.wrapper);

                    //添加有分组的页面,全部折叠\展开按钮,默认状态是展开状态
                    //this.wrapper.find('.k-group-cell.k-header').html('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');
                    var kHeaders = this.lockedHeader ? this.lockedHeader.find('th:first') : this.thead.find('th:first');
                    if (kHeaders.find('.expandCollapseBtn').length < 1) {
                        kHeaders.prepend('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');
                    }

                };
                if (!hyOption.nominheight) {
                    var dataBound2 = function (e) {
                        var container = this.content.next();
                        if (container) {
                            // container.css('background-color', '#ffffff');
                            container.html("<div class='nodata' >暂无数据</div>");
                        }
                    };
                    dataBound = Box.Function.postFunction(dataBound, dataBound2);
                }
                hyOption.dataBound = Box.Function.postFunction(hyOption.dataBound, dataBound);


                return hyOption;
            };

            var option = initOption(options);

            var grid = $(this).kendoTreeList(option).data("kendoTreeList");

            if (option.columns) {
                //var locked = option.columns.count("x=>x.locked");
                if (locked) {
                    grid.wrapper.find(".k-grid-content-locked").scroll(function () {
                        var stop = $(this)[0].scrollTop;
                        grid.wrapper.find(".k-grid-content").animate({scrollTop: stop}, 0);
                    });
                }
            }

            if (!option.height && !option.nominheight) {
                grid.content && grid.content.css("min-height", "100px");
                grid.lockedContent && grid.lockedContent.css("min-height", "100px");
            }
            if (option.height && Box.isNumber(option.height)) {
                // grid.content && grid.content.css("height", option.height - 39 + "px");
                // grid.lockedContent && grid.lockedContent.css("height", option.height - 39 + "px");
                $(grid.wrapper).css('height', option.height - 39 + "px");
                grid.resize();//调整后需要刷新grid
            }

            var setOption = function (setOptions) {
                //var option = initOption(setOptions);
                grid.setOptions(initOption(setOptions));
            };

            //绑定展开\折叠按钮的事件
            //todo：kendo本身针对这种图标(k-i-collapse,k-i-expand)有绑定事件，在点击这个按钮的时候会触发kendo的事件，但是执行不成功会报错
            //不影响使用，本来想找font awesome的图标代替的，但是没有找到一样的图标，暂时放一下吧
            $(grid.table).closest('.k-grid').undelegate("a.expandCollapseBtn", 'click').delegate("a.expandCollapseBtn", "click", expandCollapseGroup);

            var change = null;
            if (option.selectionChange && Box.isFunction(option.selectionChange)) {
                change = Box.bind(option.selectionChange, grid);
            }

            //展开\折叠按钮的事件
            function expandCollapseGroup(e, target) {
                var groupRows = $(grid.table).find('.k-treelist-group');
                var state = $(this).hasClass('k-i-collapse');
                Box.Array.forEach(groupRows, function (row) {
                    if (state) {
                        grid.collapse(row);
                        $(this).removeClass('k-i-collapse').addClass('k-i-expand');
                        $(this).attr('title', '展开分组');

                    } else {
                        grid.expand(row);
                        $(this).removeClass('k-i-expand').addClass('k-i-collapse');
                        $(this).attr('title', '折叠分组');
                    }
                }, this);


                //$(grid.table).closest('.k-grid').undelegate("a.expandCollapseBtn",'click');
            }

            grid.setOption = Box.bind(setOption, grid);//重新封装的方法,因为自定义了一些属性,如果直接调用原生的方法,就会使自定义的属性失效

            return bindData(grid);
        },


        //封装KendoGrid
        HYGrid: function (options) {
            if ($(this).length == 0)
                return null;

            var locked = options.columns && options.columns.count("x=>x.locked") || 0;

            //初始化grid的option
            var initOption = function (hyOption) {
                hyOption = hyOption || {};

                if (hyOption.columns) {


                    // hyOption.resizable = !locked;

                    hyOption.columns.foreach(function (col) {

                        if (!Box.isFunction(col.groupHeaderTemplate)) {
                            col.groupHeaderTemplate = function (item) { //自定义分组的模板，显示当前分组下的数量
                                var dataItem = {};
                                dataItem[item.field] = item.value;
                                var value = Box.isFunction(col.template) ? col.template(dataItem) : item.value;
                                return value + ' (' + item.items.length + ')';
                            };
                        }

                        col.headerAttributes = col.headerAttributes || {style: "text-align: center;"};//所有列头默认居中
                        if (col.columns) {
                            col.columns.foreach(function (innerCol) { //只支持到第二级了,一般也就用这么多
                                innerCol.headerAttributes = innerCol.headerAttributes || {style: "text-align: center;"};
                            });
                        }

                        if (hyOption.editable && (col.editor || col.field)) {
                            col.headerAttributes = col.headerAttributes || {};
                            col.headerAttributes["editable"] = true;
                        }
                        if (col.noexport || col.hidden) {
                            col.headerAttributes = col.headerAttributes || {};
                            col.headerAttributes["data-noexport"] = true;
                            col.attributes = col.attributes || {};
                            col.attributes["data-noexport"] = true;
                            col.footerAttributes = col.footerAttributes || {};
                            col.footerAttributes["data-noexport"] = true;
                        } else if (col.noexport != null && col.noexport == false) {
                            col.headerAttributes = col.headerAttributes || {};
                            delete col.headerAttributes["data-noexport"];
                            col.attributes = col.attributes || {};
                            delete col.attributes["data-noexport"];
                            col.footerAttributes = col.footerAttributes || {};
                            delete col.footerAttributes["data-noexport"];
                        }
                    });

                    hyOption.columns.foreach(function (col) {
                        if (col["data-function"]) {
                            col["hidden"] = !Box.Common.hasAccess(col["data-function"]);
                        }
                    });
                    hyOption.reorderable = Box.ifNull(hyOption.reorderable, false);
                }

                var dataBound = function (e) {
                    var ths = this.wrapper.find("thead th[editable]");
                    $.each(ths, function (index, th) {
                        var icon = $(th).find("span.fa-pencil");
                        if (icon.length == 0) {
                            var th = $(th).find('>a').length ? $(th).find('>a') : $(th);
                            th.prepend('<span style="margin-right:3px;" class="fa fa-pencil txt-color-green2"></span>');
                        }
                    });

                    //重现刷新table后,去掉勾选全选框
                    this.wrapper.find('th .select_checkbox input:checkbox').prop('checked', false);

                    Box.Common.renderFunction(this.wrapper);


                    //添加有分组的页面,全部折叠\展开按钮,默认状态是展开状态
                    //this.wrapper.find('.k-group-cell.k-header').html('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');
                    var kHeaders = this.wrapper.find('.k-group-cell.k-header');
                    if (kHeaders.length > 1) {
                        //for (var i = 1; i < kHeaders.length; i++) {
                        //    kHeaders[i].remove();
                        //}
                        if (kHeaders.eq(0).closest("div.k-grid-header").find("tr").length > 1) { //标题行
                            $(kHeaders[0]).html('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');


                        } else {
                            $(kHeaders[0]).html('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');
                        }


                        //清除多余的折叠\展开按钮
                        for (var i = kHeaders.length - 1; i > 0; i--) {
                            $(kHeaders[i]).html('');
                        }

                    } else {
                        this.wrapper.find('.k-group-cell.k-header').html('<a class="k-icon k-i-collapse expandCollapseBtn" title="折叠分组"></a>');
                    }
                };
                if (!hyOption.nominheight) {
                    var dataBound2 = function (e) {
                        var container = this.content || this.wrapper;
                        if (container) {
                            if (!this._data || this._data.length == 0) {
                                if (container.find(".nodata").length == 0)
                                    container.append("<div class='nodata' >暂无数据</div>");
                            } else {
                                container.find(".nodata").remove();

                                //对列里面的指定的链接进行处理
                                if (($('#currentFunctionUID').attr('data-operationtype') == 0)) {
                                    var aEl = this.wrapper.find('a[data-operationtype="1"]');
                                    // aEl.parent().html(aEl.text());
                                    aEl.replaceWith(function (index, content) {
                                        return content;
                                    });
                                }
                            }
                        }
                        if (container.closest(".k-widget.k-window").length) {
                            container.find(".nodata").css("position", "absolute");
                        }
                    };
                    dataBound = Box.Function.postFunction(dataBound, dataBound2);
                }
                hyOption.dataBound = Box.Function.postFunction(hyOption.dataBound, dataBound);

                var selectable = hyOption.selecttype;
                var fn = hyOption.fnEnable || function () {
                    return true;
                };

                var clazz = false;
                var checkColumn = {
                    attributes: {"class": "text-center", "data-noexport": true,},
                    headerAttributes: {"data-noexport": true,},
                    footerAttributes: {"data-noexport": true,},
                    width: hyOption.checkColumnWidth || 40, //这个宽度再也不要改了，需要的话在你自己的页面写这个配置，再改我诅咒你吃泡面没有调味包诅咒你改一个bug引发俩bug，哈哈~~~
                    col_select: true,
                    locked: locked,
                    title: "选择",
                    field: 'Select',
                    filterable: false,
                    sortable: false,
                    operationType: 1
                };

                if (hyOption.columns && hyOption.columns.count("footerTemplate")) {
                    checkColumn.footerTemplate = function () {
                        return '<div data-noexport="true"></div>';
                    };
                }

                if (selectable && Box.String.has(selectable, "multi")) {
                    checkColumn.template = function (item) {
                        var id = Box.String.uuid();
                        var disabled = fn(item) ? "" : "disabled";
                        return '<span class="select_checkbox"><input type="checkbox" name="single" class="k-checkbox" id="' + id + '" ' + disabled + '>' +
                            '<label class="k-checkbox-label" for="' + id + '"></label></span>';
                    };
                    if (hyOption.showSelectAll) {
                        checkColumn.headerTemplate = function () {
                            var id = Box.String.uuid();
                            return '<span class="select_checkbox"><input type="checkbox" name="single" class="k-checkbox selectAll" id="' + id + '">' +
                                '<label class="k-checkbox-label" for="' + id + '"></label></span>';
                        };
                    }
                    checkColumn.headerAttributes = {
                        style: "text-align: center;",
                        " data-noexport": true,
                    };
                    clazz = ".select_checkbox";
                    hyOption.selectable = false;
                } else if (selectable && Box.String.has(selectable, "single")) {
                    checkColumn.template = function (item) {
                        var id = Box.String.uuid();
                        var disabled = fn(item) ? "" : "disabled";
                        return '<span class="select_radio"><input type="radio" name="single" class="k-radio" id="' + id + '" ' + disabled + '>' +
                            '<label class="k-radio-label" for="' + id + '"></label></span>';
                    };
                    clazz = ".select_radio";
                    hyOption.selectable = false;
                }

                if (clazz && !hyOption.columns.count("x=>x.col_select")) {
                    var newColumns = Box.Array.clone(hyOption.columns);
                    newColumns.unshift(checkColumn);
                    hyOption.columns = newColumns;
                }

                return hyOption;
            };

            var option = initOption(options);

            var grid = $(this).kendoGrid(option).data("kendoGrid");

            if (option.columns) {
                //var locked = option.columns.count("x=>x.locked");

                //MP:下面这段代码在设置冻结列后,滚动会变得很慢,不知道当时是啥用意,先去掉了
                // if (locked) {
                //     grid.wrapper.find(".k-grid-content-locked").scroll(function () {
                //         var stop = $(this)[0].scrollTop;
                //         grid.wrapper.find(".k-grid-content").animate({scrollTop: stop}, 0);
                //     });
                // }
            }

            if (!option.height && !option.nominheight) {
                grid.content && grid.content.css("min-height", "100px");
                grid.lockedContent && grid.lockedContent.css("min-height", "100px");
            }
            // if (option.height && Box.isNumber(option.height)) {
            //     // grid.content && grid.content.css("height", option.height - 39 + "px");
            //     // grid.lockedContent && grid.lockedContent.css("height", option.height - 39 + "px");
            //     $(grid.wrapper).css('height', option.height - 39 + "px");
            //     grid.resize();//调整后需要刷新grid
            // }

            var getSelection = function (fndo, scope) {
                var g = this;
                var trs = g.table.find("tr.k-state-selected");
                var selection = [];
                Box.each(trs, function (tr) {
                    var dataItem = g.dataItem(tr);
                    if (dataItem.toJSON) {
                        dataItem = dataItem.toJSON();
                    }
                    if (Box.isFunction(fndo)) {
                        fndo.call(scope || this, dataItem, $(tr));
                    }
                    selection.push(dataItem);
                }, this);
                return selection;
            };
            var getKendoSelection = function (fndo, scope) {
                var g = this;
                var trs = g.table.find("tr.k-state-selected");
                var selection = [];
                Box.each(trs, function (tr) {
                    var dataItem = g.dataItem(tr);

                    if (Box.isFunction(fndo)) {
                        fndo.call(scope || this, dataItem, $(tr));
                    }
                    selection.push(dataItem);
                }, this);
                return selection;
            };
            var getCheckedRows = function (fndo, scope) {
                var g = this;
                var trs = g.table.find("tr.k-state-selected");
                var selection = [];
                Box.each(trs, function (tr) {
                    if (Box.isFunction(fndo)) {
                        fndo.call(scope || this, dataItem, $(tr));
                    }
                    if ($(tr).find('td:first').find('.select_checkbox .k-checkbox:checked:enabled').length && $(tr).find('td:first').find('.select_checkbox .k-checkbox:checked:visible').length) {
                        var dataItem = g.dataItem(tr);

                        selection.push(dataItem);
                    }

                }, this);
                return selection;
            };
            var setOption = function (setOptions) {
                //var option = initOption(setOptions);
                grid.setOptions(initOption(setOptions));
            };
            grid.getSelection = Box.bind(getSelection, grid); //返回的是一个纯粹的json

            grid.getKendoSelection = Box.bind(getKendoSelection, grid); //返回的是一个kendo的数据对象

            grid.getCheckedRows = Box.bind(getCheckedRows, grid); //获取有checkedbox  并且被选中的行

            grid.setOption = Box.bind(setOption, grid);//重新封装的方法,因为自定义了一些属性,如果直接调用原生的方法,就会使自定义的属性失效.

            grid.clearSelection = Box.bind(function () {
                this.table.find("tr.k-state-selected").removeClass("k-state-selected");
                this.table.find("tr input:checked").prop("checked", false);

                if (this.lockedContent) {
                    this.lockedContent.find("tr.k-state-selected").removeClass("k-state-selected");
                    this.lockedContent.find("tr input:checked").prop("checked", false);
                }
                Box.bind(option.selectionChange, grid)();
            }, grid);

            grid.setNodata = Box.bind(function (text) {
                var container = this.content || this.wrapper;
                var nodata = container.find("div.nodata");
                nodata.html(text);
            }, grid);

            if (option.selecttype) {
                //grid.table.delegate(clazz, "click", selectRow);
                $(grid.table).closest('.k-grid').delegate("td .select_checkbox input:checkbox,td .select_radio input:radio", "change", selectRow);
                $(grid.table).closest('.k-grid').delegate("th .select_checkbox input:checkbox", "change", selectAll);
            }

            //绑定展开\折叠按钮的事件
            $(grid.table).closest('.k-grid').undelegate("a.expandCollapseBtn", 'click').delegate("a.expandCollapseBtn", "click", expandCollapseGroup);

            var change = null;
            if (option.selectionChange && Box.isFunction(option.selectionChange)) {
                change = Box.bind(option.selectionChange, grid);
            }

            //展开\折叠按钮的事件
            function expandCollapseGroup(e, target) {
                var groupRows = $(grid.table).find('.k-grouping-row');
                var state = $(this).hasClass('k-i-collapse');
                Box.Array.forEach(groupRows, function (row) {
                    if (state) {
                        grid.collapseGroup(row);
                        $(this).removeClass('k-i-collapse').addClass('k-i-expand');
                        $(this).attr('title', '展开分组');

                    } else {
                        grid.expandGroup(row);
                        $(this).removeClass('k-i-expand').addClass('k-i-collapse');
                        $(this).attr('title', '折叠分组');
                    }
                }, this);

                //$(grid.table).closest('.k-grid').undelegate("a.expandCollapseBtn",'click');
            }

            function selectRow() {
                var checked = $(this).find("input").prop("checked") || $(this).prop("checked"),
                    row = $(this).closest("tr");
                if (checked) {
                    row.addClass("k-state-selected");
                    if ($(this).is(":radio")) {
                        row.siblings("tr.k-state-selected").removeClass("k-state-selected");
                    }
                } else {
                    row.removeClass("k-state-selected");
                }
                if ($(this).closest(".k-grid-content-locked").length) {
                    var rowIndex = row.prop("rowIndex");
                    var cRow = $(this).closest(".k-grid-content-locked").next(".k-grid-content").find("table tbody tr:eq(" + rowIndex + ")");
                    if (checked) {
                        cRow.addClass("k-state-selected");
                        if ($(this).is(":radio")) {
                            cRow.siblings("tr.k-state-selected").removeClass("k-state-selected");
                        }
                    } else {
                        cRow.removeClass("k-state-selected");
                    }
                }

                change && change(row);
            }

            function selectAll() {
                var checked = $(this).find("input").prop("checked") || $(this).prop("checked");
                var chks = $(this).closest(".k-grid").find("tbody td:first-child input:checkbox:not(:disabled,[disabled])");
                chks.prop("checked", checked);
                chks.change();
                //if (checked) {
                //    rows.addClass("k-state-selected");
                //} else {
                //    rows.removeClass("k-state-selected");
                //}
            }


            if (option.checked && Box.isFunction(option.checked)) {
                var trs = grid.table.find("tr");
                Box.each(trs, function (tr) {
                    var dataItem = grid.dataItem(tr);
                    if (option.checked(dataItem)) {
                        $(tr).addClass("k-state-selected");
                        $(tr).find("input").prop("checked", true);
                    } else {
                        $(tr).removeClass("k-state-selected");
                        $(tr).find("input").prop("checked", false);
                    }

                    if (grid.lockedContent && grid.lockedContent.length) {
                        var rowIndex = $(tr).prop("rowIndex");
                        var cRow = grid.lockedContent.find("table tbody tr:eq(" + rowIndex + ")");
                        if (option.checked(dataItem)) {
                            $(cRow).addClass("k-state-selected");
                            $(cRow).find("input").prop("checked", true);
                        } else {
                            $(cRow).removeClass("k-state-selected");
                            $(cRow).find("input").prop("checked", false);
                        }
                    }
                });
            }

            return bindData(grid);
        },

        HYDropDownList: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};
            option.noDataTemplate = '暂无数据'

            var dropDown = $(this).kendoDropDownList(option).data("kendoDropDownList");

            return bindData(dropDown);
        },

        //封装KendoNumericTextBox控件
        HYNumeric: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};
            if (option.option && HYNumericOptions[option.option]) {
                option = Box.apply({}, option, HYNumericOptions[option.option]);
            }

            $(this).data("unit", option.unit);
            $(this).data("option", option);

            var minus = isNull(option.allowMinus, (option.min || 1) < 0);
            if (!minus) {
                option.min = option.min || 0;
            }
            if (option.format && option.format.indexOf("p") == 0) {
                if (option.step == null) {
                    option.step = 0.01;
                }
            }

            if (option.showCurrency) {
                $(this).keyup(fnShowCurrency);
                $(this).focus(fnShowCurrency);

                $(this).blur(fnHideCurrency);

                option.spin = function () {
                    var target = $(this.element);
                    fnShowCurrency.call(target);
                };

                function fnShowCurrency() {
                    fnCurrency.call(this, true);
                }

                function fnHideCurrency() {
                    fnCurrency.call(this, false);
                }

                function fnCurrency(show) {
                    var target = this;
                    var unit = $(this).data("unit");
                    var val = $(target).val() * (unit || 1);
                    var sign = val >= 0 ? "red" : "green";
                    val = Math.abs(val);

                    var span = $(document.body).find('span.currency');
                    if (show) {
                        if (span.length == 0) {
                            span = $("<span class='currency'></span>");
                            $(document.body).append(span);
                        }
                        var currency = Box.Common.convertCurrency(val);
                        if (currency) {
                            span.css("color", sign);
                            span.html(currency);
                            Box.global.currency_timer && clearTimeout(Box.global.currency_timer);
                            var offset = $(target).offset();
                            var height = parseInt($(target).css("height"));

                            span.css("top", offset.top + height + 1 + "px");
                            span.css("left", offset.left - 1 + "px");
                            span.show();
                            Box.global.currency_timer = setTimeout(function () {
                                span.fadeOut(400);
                            }, 5000);
                        } else {
                            span.html("");
                            span.hide();
                        }
                    } else {
                        span.hide();
                    }
                }

            }

            var numeric = $(this).kendoNumericTextBox(option).data("kendoNumericTextBox");

            var max = option.max;

            $(this).off('keypress').on('keypress', function (e) {
                var opt = $(this).data("option");
                var decimals = isNull(opt.decimals, 2);
                var integrals = opt.integrals || 8;
                var inputminus = isNull(option.allowMinus, (option.min || 1) < 0);
                // var charCode = e.charCode;
                // if (charCode < 45 || charCode > 57)
                //     e.preventDefault();
                var charCode = e.keyCode || e.which || e.charCode;  //按键事件的兼容处理
                if (charCode != 8 && (charCode < 45 || charCode > 57))  // 8 代表退格键，当按下退格键时，不阻止默认行为
                    e.preventDefault();
                var si = $(this).getCursortPosition();
                var val = $(this).val();
                var se = $(this).getCursortEnd();
                if (se > si) {
                    var vall = val.substring(0, si) + val.substring(se);
                    val = vall;
                }
                var doti = val.indexOf(".");
                var hasMinus = val.indexOf("-") == 0;
                if (doti >= 0 && charCode == 46)
                    e.preventDefault();
                if ((hasMinus || si > 0 || !inputminus) && charCode == 45)
                    e.preventDefault();

                doti = val.indexOf(".");
                var vals = val.split('.');
                if (si <= doti || vals.length < 2) {
                    var alll = hasMinus ? integrals + 1 : integrals;
                    if (vals[0].length >= alll && charCode > 46)
                        e.preventDefault();
                } else {
                    if (vals[1].length >= decimals)
                        e.preventDefault();
                }
                if (max) {
                    if (Box.isNumber(max) && nubmers[charCode]) {
                        var fuval = val.substring(0, si) + nubmers[charCode] + val.substring(se);
                        if (Box.Format.toNumeric(fuval) > max) {
                            e.preventDefault();
                        }
                    }
                }
            });

            numeric.setOptions = Box.bind(function (opt) {
                var oopt = $(this).data("option");
                var nopt = Box.apply(oopt, opt);
                $(this).data("option", nopt);
                $(this).data("kendoNumericTextBox").options = nopt;
            }, this);

            return bindData(numeric);
        },

        HYAutoBox: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            $(this).removeClass("k-textbox");

            //option.clearButton = false;

            option.noDataTemplate = '无匹配数据';

            option.select = option.select || function (e) {
                if (e.item && e.item.length) {
                    e.sender.element.val(e.item[0].innerText);
                    //触发change事件
                    $(e.sender.element).trigger("change");
                }
            };
            var el = this;
            var open = function (e) {
                var list = e.sender.list;
                list.css("min-width", list.css("width"));
                list.css("width", "auto");
                list.css("overflow-x", "visible");
                list.css("overflow-y", "scroll");
                e.sender.ul.css("overflow", "visible");
                e.sender.ul.parent().css("overflow", "visible");
            };
            var close = function (e) {
                if (e.sender.needclear) {
                    e.sender.element.val("");
                    e.sender.needclear = false;
                }
            };

            option.open = Box.Function.postFunction(option.open, open);
            option.close = Box.Function.postFunction(option.close, close);

            if (option.fixValue && Box.browser.is('Chrome')) {
                el.focus(function (e) {
                    $(this).val("");
                }).blur(function (e) {
                    var value = el.attr("auto-value");
                    el.val(value);
                    if (value) {
                        el.removeAttr("required");
                        el.removeClass("k-invalid").closest(".k-invalid").removeClass("k-invalid");
                    }
                });

                var change = option.change;
                option.change = Box.emptyFn;

                option.beforeSelect = option.beforeSelect || function (e) {
                    if (e.item) {
                        var item = this.dataItem(e.item);
                        if (item) {
                            el.attr("placeholder", item[option.dataTextField]);
                            el.attr("auto-value", item[option.dataTextField]);
                        }
                    }
                    change && change.apply(this, arguments);
                },
                    option.select = Box.Function.preFunction(option.select, option.beforeSelect);
            }
            option.select = Box.Function.postFunction(option.select, function (e) {
                el.removeClass("k-invalid").closest(".k-invalid").removeClass("k-invalid");
            });
            if (option.selectFirstWhenClose) {
                option.select = Box.Function.postFunction(option.select, function (e) {
                    e.sender.selected = true;
                });
                option.open = Box.Function.postFunction(option.open, function (e) {
                    e.sender.selected = false;
                });
                option.close = Box.Function.postFunction(option.close, function (e) {
                    if (!e.sender.selected && e.sender.ul.children().length) {
                        e.sender.trigger("select", {
                            item: e.sender.ul.children().eq(0),
                            dataItem: e.sender.dataItem(0)
                        });
                    }
                });
            }

            if (option.multi) {
                $(this).focus(function () {
                    $(this).val("");
                    var pp = $(this).data("kendoAutoComplete");
                    pp.toshow && pp.toshow.data("kendoPopup") && pp.toshow.data("kendoPopup").close();
                }).blur(function () {
                    $(this).data("kendoAutoComplete").renderText();
                });
                var after = function (e) {
                    if (e.item) {
                        var item = this.dataItem(e.item);
                        if (item) {
                            var vv = item[option.dataTextField];
                            this.options.values = this.options.values || [];
                            if (!this.options.values.contains(vv))
                                this.options.values.push(vv);
                            this.element.attr("title", this.options.values);
                        }
                    }
                };
                if (option.select && Box.isFunction(option.select)) {
                    option.select = Box.Function.postFunction(option.select, after);
                } else {
                    option.select = after;
                }
            }

            if (option.afterSelect && Box.isFunction(option.afterSelect)) {
                option.select = Box.Function.postFunction(option.select, option.afterSelect);
            }

            //if (option.dataTextField && option.dataSource) {
            //    option.dataSource.sort = [
            //        { field: option.dataTextField, dir: "asc" }
            //    ];
            //}

            var auto = this.kendoAutoComplete(option).data('kendoAutoComplete');
            if (option.focus && Box.isFunction(option.focus)) {
                this.focus(function () {
                    option.focus.apply(auto);
                });
            }

            if (option.multi) {
                auto.renderText = Box.bind(function () {
                    var vvs = this.options.values;
                    if (vvs.length == 0) {
                        this.element.val("请选择");
                        this.toshow && this.toshow.data("kendoPopup") && this.toshow.data("kendoPopup").close();
                    } else if (vvs.length == 1) {
                        this.element.val(vvs[0]);
                    } else {
                        this.element.val("选择 " + vvs.length + " 项");
                    }
                }, auto);
                auto.options.values = [];
                auto.value = Box.bind(function (v) {
                    if (v == null) {
                        return this.options.values;
                    } else {
                        if (Box.isString(v))
                            v = v.split(",").where("x=>x");
                        if (Box.isArray(v)) {
                            this.options.values = v;
                            this.element.attr("title", this.options.values);
                            this.element.blur();
                        }
                        return this;
                    }
                }, auto);

                var target = $(this);
                Box.Common.addIcon({
                    element: $(target),
                    className: "k-icon k-i-arrow-60-down",
                    appendClass: "Show",
                    click: function () {
                        var a = target.data("kendoAutoComplete");
                        a.toshow = a.toshow || $("<div><ul style='list-style: none;margin: 0;padding: 5px;'></ul></div>");
                        var vvs = a.options.values;
                        var ul = a.toshow.find("ul");
                        ul.empty().css("min-width", parseInt($(target).width()) + 13);
                        if (vvs.length) {
                            vvs.foreach(function (v) {
                                this.append('<li style="border-bottom: 1px dotted #ccc;"><a class="del" style="padding-right: 5px;color:red;" title="删除"><i class="fa fa-times-circle"></i></a>' + v + '</li>');
                            }, ul);
                        }
                        ul.delegate("a.del", "click", function () {
                            var item = $(this).closest("li");
                            var txt = item.text();
                            item.remove();
                            a.options.values.removeValue(txt);
                            a.renderText();
                            if (option.itemDeleted && Box.isFunction(option.itemDeleted)) {
                                option.itemDeleted.call(auto, auto);
                            }
                        });
                        if (vvs.length) {
                            a.pop = a.pop || a.toshow.show().kendoPopup({
                                anchor: $(target),
                                origin: "bottom left",
                            }).data("kendoPopup");
                            a.pop.open();
                        }
                    }
                });

                if (option.values) {
                    auto.value(option.values);
                }
                auto.renderText();
            }
            return bindData(auto);
        },

        HYAutoBond: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetBondCodeBlur";
            var target = this;
            target.attr("auto-bondkey", "");
            option = Box.apply({}, option, {
                dataTextField: 'BondMarket',
                template: ' #=BondName  #【#= BondKey #】',
                minLength: 2,
                fixValue: true,
                selectFirstWhenClose: true,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                    marketCode: "",
                                    custodyAgency: "",
                                    secType: "", //债券类型
                                    flag: false,
                                    isAllowMat: false,
                                    settleDate: Date.today().format()
                                }, data, target);
                            }
                        }
                    }
                }
            });

            return this.HYAutoBox(option);
        },

        HYAutoFund: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetFundCodeBlur";
            var target = this;
            target.attr("auto-bondkey", "");
            option = Box.apply({}, option, {
                dataTextField: 'WindCode',
                template: ' #=BondName  #,【 #= WindCode #】',
                minLength: 2,
                fixValue: true,
                selectFirstWhenClose: true,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                    marketCode: option.marketCode || ""
                                }, data, target);
                            }
                        }
                    }
                }
            });

            return this.HYAutoBox(option);
        },
        //系统右上角的搜索控件
        HYSystemSearch: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetSystemSearchBlur";
            var target = this;
            option = Box.apply({}, option, {
                //dataTextField: 'ResultType',
                placeholder: "搜索债券",//搜索债券、中间业务组合...
                template: function (dataItem) {
                    if (dataItem.ResultType == 'Portfolio') {
                        var result = dataItem.SearchResult.PortfolioName;
                        return "<a title=" + result + ">" + result + "</a>";
                    }
                    else if (dataItem.ResultType == 'Bond') {
                        var result = dataItem.SearchResult.BondName + ',【' + dataItem.SearchResult.BondKey + '】';
                        return "<a title=" + result + ">" + result + "</a>";
                    }
                    return "";
                },
                suggest: true,
                close: function (e) {
                    e.sender.element.val('');
                },
                select: function (e) {
                    if (e != '') {
                        var dataItem = this.dataItem(e.item);
                        if (dataItem.ResultType == 'Bond') {
                            var bondkey = dataItem.SearchResult.BondKey;
                            Box.create('HY.sysmgr.bond.bondwindow', {
                                hideBack: true,
                                $params: {
                                    bondkey: bondkey,
                                },
                            });
                        }
                        else if (dataItem.ResultType == 'Portfolio') {//查看中间业务流水
                            Box.create('HY.trademgr.delegatedaily.tradetrajectory', {
                                title: dataItem.SearchResult.PortfolioName + "交易轨迹",
                                $cashbondedit: {
                                    PortfolioNo: dataItem.SearchResult.PortfolioNo
                                }
                            });
                        }

                    }
                },
                minLength: 2,
                fixValue: true,
                selectFirstWhenClose: false,
                delay: 1000,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            timeout: 10000,
                            contentType: "application/json",
                            data: function () {
                                return {
                                    blurstring: target.val(),
                                };
                            }
                        }
                    }
                }
            });

            return this.HYAutoBox(option);
        },


        HYPortfolio: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'FullName',
                template: ' #=FullName #',
                minLength: 2,
                fixValue: true,
                selectFirstWhenClose: true,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: "/api/System/GetPortBlur",
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val()
                                }, data, target);
                            }
                        }
                    }
                }
            });

            return this.HYAutoBox(option);
        },

        HYAutoKYTGCashBond: function (option, data) {
            if ($(this).length == 0)
                return null;
            var info = {};
            // option = option || {};
            switch (option.type) {
                case 'Project': {
                    info.apiUrl = "/api/IAMgr/ProjectInfo/GetProjectInfoBlur";
                    info.dataTextField = 'PortfolioName';
                    info.template = ' #= PortfolioName#';
                    break;
                }
                case 'Product': {
                    info.apiUrl = "/api/IAMgr/ProjectInfo/GetProductsInfoBlur";
                    info.dataTextField = 'PortfolioName';
                    info.template = ' #= PortfolioName#';
                    break;
                }
                case 'Agencies': {
                    info.apiUrl = "/api/IAMgr/ProjectInfo/GetAgenciesBlur";
                    info.dataTextField = 'Name';
                    info.template = ' #= Name#';
                    break;
                }
                case 'Traders': {
                    info.apiUrl = "/api/IAMgr/ProjectInfo/GetTradersBlur";
                    info.dataTextField = 'Name';
                    info.template = ' #= Name#';
                    break;
                }
                case 'Trader': {
                    info.apiUrl = "/api/IAMgr/ProjectInfo/GetTraderBlur";
                    info.dataTextField = 'Name';
                    info.template = ' #= Name#';
                    break;
                }
            }
            var target = this;
            option = Box.apply({}, option, {
                dataTextField: info.dataTextField,
                template: info.template,
                filter: "contains",
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: false,
                delay: 500,
                //highlightFirst: false,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: info.apiUrl,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                }, data, target);
                            }
                        },
                    },
                },
            });

            return this.HYAutoBox(option);
        },

        HYAutoAgency: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetAgencyBlur";
            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'ShortName',
                template: ' #= ShortName#',
                filter: "contains",
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: false,
                delay: 500,
                //highlightFirst: false,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                }, data, target);
                            }
                        },
                    },
                },
            });

            return this.HYAutoBox(option);
        },

        HYAutoAgencyFull: function (option, data) {
            option = Box.apply({}, option, {
                dataTextField: 'Name',
                template: ' #= Name#',
            });
            return $(this).HYAutoAgency(option, data);
        },

        HYAutoIssuerName: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetIssuerNameBlur";
            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'IssuerName',
                template: ' #= IssuerName#',
                filter: "contains",
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: false,
                delay: 500,
                //highlightFirst: false,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                }, data, target);
                            }
                        },
                    },
                },
            });

            return this.HYAutoBox(option);
        },

        HYAutoTrader: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var url = option.url || "/api/System/GetTraderBlur";
            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'Name',
                template: ' #= Name#',
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: false,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: url,
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                }, data, target);
                            }
                        }
                    }
                },
            });

            return this.HYAutoBox(option);
        },

        HYAutoPortfolio: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option.amtProperty = option.amtProperty || "TotalAvailableAmtDayEnd";

            function toString(item) {
                if (item[option.amtProperty]) {
                    if (item.MarketCode == "IB") {
                        return Box.Format.renderWanYuan(item[option.amtProperty]) + " 万元";
                    } else {
                        return Box.Format.renderNumric(item[option.amtProperty]) + " 元";
                    }
                } else {
                    return "";
                }
            }

            if (!option.template && (option.showAvailable !== false)) {
                option.template = function (dataItem) {
                    return "<span style='padding-right:15px;'>" + dataItem.PortfolioName + "</span> <span class='txt-color-green2'>  "
                        + toString(dataItem) + "  </span>";
                };
            }

            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'PortfolioName',
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: true,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: "/api/System/GetPortfolioBlur",
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                    bondKey: "",
                                    calDate: Box.Format.renderDate(new Date())
                                }, data);
                            }
                        }
                    }
                },
            });

            return this.HYAutoBox(option);
        },

        //升级版,可以配置是否显示关闭的组合,显示哪些组合类型
        HYAutoPortfolioPlus: function (option, data) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option.amtProperty = option.amtProperty || "TotalAvailableAmtDayEnd";

            function toString(item) {
                if (item[option.amtProperty]) {
                    if (item.MarketCode == "IB") {
                        return Box.Format.renderWanYuan(item[option.amtProperty]) + " 万元";
                    } else {
                        return Box.Format.renderNumric(item[option.amtProperty]) + " 元";
                    }
                } else {
                    return "";
                }
            }

            if (!option.template && (option.showAvailable !== false)) {
                option.template = function (dataItem) {
                    return "<span style='padding-right:15px;'>" + dataItem.PortfolioName + "</span> <span class='txt-color-green2'>  "
                        + toString(dataItem) + "  </span>";
                };
            }

            var target = this;
            option = Box.apply({}, option, {
                dataTextField: 'PortfolioName',
                minLength: 2,
                fixValue: false,
                selectFirstWhenClose: true,
                delay: 500,
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: "/api/System/GetPortfolioBlurPlus",
                            type: 'GET',
                            dataType: "json",
                            contentType: "application/json",
                            data: function () {
                                return apply({
                                    blurstring: target.val(),
                                    bondKey: "",
                                    calDate: Box.Format.renderDate(new Date()),
                                    isIncludeClosedPortfolio: false, //默认不包含关闭的组合
                                    bizTypes: '0' //组合类型,默认所有类型组合 传到后台是10012,10013,10014
                                }, data);
                            }
                        }
                    }
                },
            });

            return this.HYAutoBox(option);
        },

        HYSplitter: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var splitter = this.kendoSplitter(option).data("kendoSplitter");
            return bindData(splitter);
        },

        HYDropDownSelect: function (option) {
            //selectType为single是单选框，为multi为多选框         

            if ($(this).length == 0 || !$(this).is("input:text"))
                return null;
            var txt = $(this);
            txt.attr("style", "background-color: transparent !important;" + txt.attr("style"));
            txt.attr('data-role', 'dropdownselect');
            txt.attr('autocomplete', 'off');

            // txt.attr('readonly', ''); //去掉这一句可以让kendo的Validator识别
            txt.keydown(function () {
                return false;
            });

            txt.addClass('k-input').removeClass('k-textbox');
            option = Box.apply({}, option, {showAll: true});

            var name = Box.isString(option.name) && option.name || "";

            var click = function (e) {
                if ($(this).closest(".k-addicon-wrap").hasClass("hy-disabled"))
                    return;

                var link = $(this).attr("data-link");
                var container = $("." + link + ".hy-dropdownselect-container");
                var dropdownselectroot = container.find('ul.dropdownselectroot');
                if (container.length) {
                    container.toggleClass("open");
                    var hideOrShow = container.hasClass("open");
                    if (hideOrShow) {
                        container.show();

                        $(".hy-dropdownselect-container.open").not(container).removeClass("open").hide(200);
                        var outer = $(e.target).closest(".k-dropdown-wrap");
                        if (!outer.hasClass("k-dropdown-wrap")) {
                            outer = $(e.target).closest(".k-header");
                        }
                        var toffset = outer.offset();
                        var btop = parseFloat(outer.css("border-top-width"));
                        var bbottom = parseFloat(outer.css("border-bottom-width"));
                        var top = toffset.top + outer.height() + btop + bbottom + 1;
                        var height = parseFloat(outer.height());
                        if (top + height > $(document.body).height()) {
                            top = toffset.top - height - 2;
                        }

                        var left = toffset.left + parseFloat(outer.css("border-left-width")) - 1;

                        //判断下方空间十分足够展示下拉框，如果不够这从上面弹出
                        if (top + container.height() > $('body').height()) {//上面弹出
                            dropdownselectroot.css('top', (dropdownselectroot.height() + 2));
                            container.css("top", (top - height - container.height()) + "px");
                            container.css("left", left + "px");
                            // container.css("min-width", outer.outerWidth() + "px");
                            container.css("width", outer.outerWidth() + "px");
                            container.css("overflow", "hidden");


                            dropdownselectroot.css('transition-duration', ' 0.2s');
                            dropdownselectroot.css('transform', 'translateY(-' + dropdownselectroot.css('height') + ')');
                        }
                        else {//下面弹出
                            dropdownselectroot.css('top', -1 * (dropdownselectroot.height() + 2));
                            container.css("top", top + "px");
                            container.css("left", left + "px");
                            // container.css("min-width", outer.outerWidth() + "px");
                            container.css("width", outer.outerWidth() + "px");
                            container.css("overflow", "hidden");
                            // container.show();


                            dropdownselectroot.css('transition-duration', ' 0.2s');
                            dropdownselectroot.css('transform', 'translateY(' + dropdownselectroot.css('height') + ')');
                        }

                    } else {
                        dropdownselectroot.css('transform', 'translateY(0px)');

                        container.hide(200);
                        setTimeout(function () {
                            // dropdownselectroot.css('top', '0px');
                            dropdownselectroot.css('transition-duration', ' 0s');
                        }, 200)


                    }
                }
                e.stopPropagation();
            };

            var uid = Box.String.uuid();
            var elment = $(this);
            elment = Box.Common.addIcon({
                element: elment,
                className: "k-icon k-i-arrow-60-down",
                title: "选择" + name,
                pickAttrs: {"data-link": uid},
                wrapAttrs: option.attributes,
                click: click,
                disallowinput: true,
            });

            var ctnel = $('<div class="hy-dropdownselect-container"></div>');
            ctnel.addClass(uid);
            $(document.body).append(ctnel);

            //初始化filter
            var filter = $('<span class="k-list-filter"><input class="k-textbox" style="display: inline-block; margin-top: 5px;"><span class="k-icon k-i-zoom"></span></span>');
            //初始化输入事件
            filter.find('input').keyup(function () {
                var filterValue = $(this).val();
                //console.log(ddSelect.dataSource);
                // console.log(option);

                // var filterData=Box.clone(ddSelect.dataSource);

                var _fnFilter = function (lis, value) {
                    lis.each(function (i, li) {
                        if ($(li).find('ul').length) {
                            _fnFilter($(li).find('ul>li'), value);

                            //如果子节点都隐藏了，那就把当前父节点隐藏
                            if (filterValue && !$(li).find('ul>li[style!="display: none;"]').length) {
                                $(li).hide();
                            }
                            else {
                                $(li).show();
                            }

                        }
                        else {
                            if (filterValue && (!Box.String.has($(li).find('span>label>span:first').attr('title'), value) && !Box.String.has($(li).find('span>label>span:first').attr('abbreviation'), value))) {
                                $(li).hide();
                            }
                            else {
                                $(li).show();
                            }
                        }
                    })
                };

                _fnFilter(ddSelect.container.find('.dropdownselectroot>li'), filterValue);


            });

            var ulRoot = $('<ul class="dropdownselectroot"></ul>');
            var dataSource = option.dataSource || [];
            if (Box.isArray(option.dataSource2)) {
                dataSource = dataSource.addRange(option.dataSource2);
            }
            var dataConfig = Box.apply({}, option.dataConfig || {}, {
                "abbreviation": "abbreviation",//拼音简称
                "text": "text", //显示的文字,   新增:支持数组形式配置多个字段
                "value": "value",
                "items": "items", //子节点对应字段
                "checked": "checked",
                "disabled": 'disabled',  // 指定渲染的对象是否被禁用
            });

            var selectAll = option.selectAll;
            var isChecked;

            if (!selectAll) {
                isChecked = dataConfig.checked;
                var ex = dataConfig.checked;
                if (!Box.isFunction(ex)) {
                    if (Box.isString(ex)) {
                        if (ex.indexOf("=>") > 0) {
                            var exp = ex.replace("=>", "){ return ");
                            var fnStr = "var fn = function(" + exp + ";};";
                            eval(fnStr);
                            isChecked = fn;
                        } else if (ex.indexOf(",") == -1) {
                            isChecked = function (e) {
                                return e[ex];
                            };
                        }
                    }
                }
            }

            var plus = "fa-plus-square-o", minus = "fa-minus-square-o";
            var renderTree = function (ul, source) {
                var cnt = 0, sltCnt = 0;
                for (var i = 0; i < source.length; i++) {
                    var item = source[i];
                    var flag = Box.isObject(item);
                    var items = flag ? item[dataConfig["items"]] : null;
                    var value = flag ? item[dataConfig["value"]] : item;
                    var text = '';

                    //新增text显示字段,支持数组,配置显示多个字段
                    //例如显示带部门的用户,部门那一级需要用DepartmentName,用户那一级需要用UserName,那就配置为['DepartmentName','UserName'],参考 HYSelectTradeUserName
                    if (Box.isArray(dataConfig['text']) && flag) {
                        var textFielddList = dataConfig['text'];
                        Box.Array.each(textFielddList, function (field) {
                            if (item[field]) {
                                text = item[field];
                                return false;
                            }
                        })
                    }
                    else {
                        text = flag ? item[dataConfig["text"]] : item;
                    }


                    var abbreviation = flag ? (item[dataConfig["abbreviation"]] || item[dataConfig["text"]]) : item;    //拼音首字母 ,如果没有就用text代替
                    var disabled = flag ? item[dataConfig["disabled"]] : null;
                    var li = $("<li></li>");
                    var iid = Box.String.uuid();
                    if (items && items.length) {
                        if (option.selectDir) {
                            if (option.selectType != 'single') {
                                li.append('<label class="dropdownselect-group">' +
                                    '<span>' +
                                    '<input type="checkbox" name="item" class="k-checkbox biantai"  id="' + iid + '">' +
                                    '<label class="k-checkbox-label" for="' + iid + '">' +
                                    '<b class="collapse-sign"><em class="fa ' + minus + '"></em></b>' +
                                    '<span class="group-title"></span>' +
                                    '<span class="group-info"></span>' +
                                    '</label></span></label>');
                                li.find("input:checkbox").val(value);
                                li.find("span.group-title").attr("title", text);
                                li.find("span.group-title").attr("abbreviation", abbreviation);
                                li.find("span.group-title").html(text);

                                if (selectAll || (Box.isFunction(isChecked) && isChecked(item))) {
                                    li.find("input:checkbox").prop("checked", true);
                                    sltCnt++;
                                }
                            }
                            else {
                                li.append('<label class="dropdownselect-group">' +
                                    '<span>' +
                                    '<input type="radio" name="item_ridio_' + uid + '" class=k-radio "  id="' + iid + '">' +
                                    '<label class="k-radio-label" for="' + iid + '">' +
                                    '<b class="collapse-sign"><em class="fa ' + minus + '"></em></b>' +
                                    '<span class="group-title"></span>' +
                                    '<span class="group-info"></span>' +
                                    '</label></span></label>');
                                li.find("input:radio").val(value);
                                li.find("span.group-title").attr("title", text);
                                li.find("span.group-title").attr("abbreviation", abbreviation);
                                li.find("span.group-title").html(text);

                                if (selectAll || (Box.isFunction(isChecked) && isChecked(item))) {
                                    li.find("input:radio").prop("checked", true);
                                    sltCnt++;
                                }
                            }

                        } else {
                            li.append('<label class="dropdownselect-group">' +
                                '<b class="collapse-sign"><em class="fa ' + minus + '"></em></b>' +
                                '<span class="group-title"></span>' +
                                '<span class="group-info"></span></label>');
                            li.find("span.group-title").attr("title", text);
                            li.find("span.group-title").attr("abbreviation", abbreviation);
                            li.find("span.group-title").html(text);
                        }
                        var ulitem = $("<ul></ul>");
                        var info = renderTree(ulitem, items);
                        cnt += info.count;
                        sltCnt += info.selectCount;

                        if (option.selectType == 'single') {
                            li.find("span.group-info").html(" ( " + info.count + " )");
                        } else {
                            li.find("span.group-info").html(" ( " + info.selectCount + " / " + info.count + " )");
                        }
                        li.append(ulitem);
                    } else {
                        //控制是单选还是多选
                        if (option.selectType == 'single') {
                            li.append('<span><input type="radio"  ' + (disabled ? 'disabled' : '') + ' name="item_ridio_' + uid + '" class="k-radio" id="' + iid + '">' +
                                '<label class="k-radio-label" for="' + iid + '"><span class="item-title"></span></label></span>');
                            li.find("input:radio").val(value);
                        } else {
                            li.append('<span><input type="checkbox" ' + (disabled ? 'disabled' : '') + ' name="item" class="k-checkbox biantai" id="' + iid + '">' +
                                '<label class="k-checkbox-label" for="' + iid + '"><span class="item-title"></span></label></span>');
                            li.find("input:checkbox").val(value);
                        }


                        li.find("span.item-title").attr("title", text);
                        li.find("span.item-title").attr("abbreviation", abbreviation);
                        li.find("span.item-title").html(text);
                        if (selectAll || (Box.isFunction(isChecked) && isChecked(item))) {
                            li.find("input:checkbox").prop("checked", true);
                            sltCnt++;
                        }
                        cnt++;
                    }
                    ul.append(li);
                }
                return {count: cnt, selectCount: sltCnt};
            };

            var ddSelect = {
                element: txt,
                container: ctnel,
                wrapper: txt.closest(".k-dropdown-wrap")
            };

            var countSelect = function (ul, change) {
                if (!ul.hasClass("dropdownselectroot")) return;

                var groups = ul.find("label.dropdownselect-group");
                Box.each(groups, function (group) {
                    var tul = $(group).closest("li").find(">ul:first");
                    var schks = tul.find("input:checkbox").length || tul.find("input:radio").length;
                    var schksed = tul.find("input:checkbox:checked").length;
                    if (option.selectType == 'single') {
                        $(group).find(".group-info").html(" ( " + schks + " )");
                    } else {
                        $(group).find(".group-info").html(" ( " + schksed + " / " + schks + " )");
                    }

                });

                var aschks = ul.find("input:checkbox").not("[name=all]").length;
                var aschksed = option.selectType == 'single'
                    ? ul.find("input:radio:checked").not("[name=all]").length
                    : ul.find("input:checkbox:checked").not("[name=all]").length;

                ul.find(".all-info").html(" ( " + aschksed + " / " + aschks + " )");
                ul.find("input:checkbox[name=all]").prop("checked", aschks == aschksed);

                var val = $.map(option.selectType == 'single'
                    ? ul.find("input:radio:checked").not("[name=all]")
                    : ul.find("input:checkbox:checked").not("[name=all]"),
                    function (item) {
                        return $(item).attr("value");
                    });

                val = val.join(",");
                txt.attr("data-ms-value", val);

                if (option.selectType == 'single') {
                    if (aschksed == 0) {
                        txt.val('');
                        txt.attr('placeholder', "请选择" + name);
                    } else {
                        txt.val(ul.find("input:radio:checked").closest("li").find(".item-title").html());
                    }

                } else {
                    if (aschksed == 0) {
                        txt.val('');
                        txt.attr('placeholder', "请选择" + name);
                    } else if (aschksed == 1) {
                        txt.val(ul.find("input:checkbox:checked").closest("li").find(".item-title").html());
                        //} else if (aschksed == aschks) {
                        //    txt.val("选择了全部" + name);
                    } else {
                        if (option.showMulti) {     //显示下拉框选择项详细选项。
                            var showMultiText = '';
                            var objitems = ul.find("input:checkbox:checked").closest("li").find(".item-title");
                            if (objitems.length > 0) {
                                Box.each(objitems, function (objitem) {
                                    showMultiText = showMultiText + $(objitem).html() + ",";
                                });
                                showMultiText = showMultiText.substring(0, showMultiText.length - 1);
                                txt.val(showMultiText);
                            }
                        } else {
                            txt.val("选择了 " + aschksed + " 个" + name);
                        }


                    }
                }

                //调用value方法不触发change事件
                // if (change && Box.isFunction(option.change)) {
                //     //if (aschksed != 0)
                //     option.change.call(ddSelect);
                // }
            };

            var allInfo = renderTree(ulRoot, dataSource);

            var renderAll = function (ul, ai) {
                if (option.showAll) {
                    var id = Box.String.uuid();
                    var all = $('<li><span><input type="checkbox" name="all" class="k-checkbox" id="' + id + '">' +
                        '<label class="k-checkbox-label" for="' + id + '"><span class="all-title"></span><span class="all-info"></span></label></span></li>');
                    all.find("span.all-title").html('全部' + name).attr('title', '全部' + name).attr('abbreviation', '全部' + name);
                    all.find("input:checkbox").prop("checked", ai.selectCount == ai.count);
                    all.find("span.all-info").html(" ( " + ai.selectCount + " / " + ai.count + " )");
                    if (option.selectType != 'single') {
                        ul.prepend(all);
                    }
                }

                ulRoot.find("b.collapse-sign").click(function (e) {
                    var icon = $(this).find("em.fa");
                    var showOrHide = icon.hasClass(minus);
                    var ul = $(this).closest("li").find(">ul:first");
                    icon.toggleClass(minus).toggleClass(plus);
                    if (showOrHide) {
                        ul.hide(200);
                    } else {
                        ul.show(200);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                });


                //当是多选框的时候,点击方法
                var clickItem = function () {
                    txt.removeClass('k-invalid');

                    var currNode = $(this);
                    while (currNode.length != 0) {
                        var parent = currNode.closest("ul").closest("li").find("label input:first");
                        var currNodeLength = currNode.closest("ul").children().length;
                        var currNodeChecked = currNode.closest("ul").children().find(":checked").length;
                        if (currNode.closest("label").length != 0) {
                            currNodeChecked = currNode.closest("ul").children().children(".dropdownselect-group").find("input:checked").length;
                        }
                        if (currNodeLength == currNodeChecked) {
                            parent.prop("checked", "checked");
                        } else {
                            parent.prop("checked", "");

                        }
                        currNode = parent;
                    }
                    var ul = $(this).closest("li").find(">ul:first");
                    var schks = ul.find("input:checkbox");
                    var schksed = ul.find("input:checkbox:checked");
                    schks.prop('checked', schks.length != schksed.length);
                    countSelect($(this).closest("ul.dropdownselectroot"), true);
                    if (option.selectDir) {//是否只能选择叶子节点
                        ul.parent().find("input:checkbox").first(0).prop('checked', schks.length != schksed.length);
                    }

                    Box.isFunction(option.change) && option.change.call(this, currNode);
                };


                ulRoot.find("input.biantai").click(clickItem);
                //ulRoot.find("label.dropdownselect-group").click(clickItem);

                //点击全选框
                ulRoot.find("input:checkbox[name=all]").change(function (e) {
                    if ($(this).is("[name=all]")) {
                        var schks = $(this).closest("ul").find("input:checkbox").not("[name=all]");
                        schks.prop('checked', $(this).prop("checked"));
                    }
                    countSelect($(this).closest("ul.dropdownselectroot"), true);
                    Box.isFunction(option.change) && option.change.call(this, $(this));
                });

                //点击单选框
                ulRoot.find("input:radio").change(function (e) {
                    txt.removeClass('k-invalid');

                    if ($(this).is("[name=all]")) {
                        var schks = $(this).closest("ul").find("input:checkbox").not("[name=all]");
                        schks.prop('checked', $(this).prop("checked"));
                    }
                    // countSelect($(this).closest("ul.dropdownselectroot"), true);
                    txt.val($(this).next().find(".group-title").text() || $(this).next().find(".item-title").text());
                    txt.attr("data-ms-value", $(this).val());
                    Box.isFunction(option.change) && option.change.call(ddSelect, $(this));

                    //单选框,选择后收起来
                    var container = $(".hy-dropdownselect-container.open");
                    var dropdownselectroot = container.find('ul.dropdownselectroot');
                    dropdownselectroot.css('transform', 'translateY(0px)');

                    container.removeClass("open").hide(200);
                    setTimeout(function () {
                        // dropdownselectroot.css('top', '0px');
                        dropdownselectroot.css('transition-duration', ' 0s');
                    }, 200)
                });

                countSelect(ulRoot);
            };

            ddSelect.value = Box.bind(function (value) {
                if (value === "")
                    value = [];
                if (value) {
                    var root = this.container.find("ul.dropdownselectroot");
                    if (Box.isString(value)) {
                        value = value.split(",");
                    } else if (Box.isNumber(value)) {
                        value = [value];
                    }
                    if (Box.isArray(value)) {
                        if (option.selectType == 'single') {
                            var chks = root.find("input:radio").not("[name=all]");
                            Box.each(chks, function (chk) {
                                $(chk).prop("checked", value.contains($(chk).attr("value")));
                            });
                        } else {
                            var chks = root.find("input:checkbox").not("[name=all]");
                            Box.each(chks, function (chk) {
                                $(chk).prop("checked", value.contains($(chk).attr("value")));
                            });
                        }
                    } else if (value === true) {
                        var chks = root.find("input:checkbox").not("[name=all]");
                        chks.prop("checked", true);
                    }
                    countSelect(root, true);

                    return this;
                } else {
                    return $(this.element).attr("data-ms-value");
                }
            }, ddSelect);

            ddSelect.enable = Box.bind(function (enable) {
                if (enable) {
                    this.wrapper.removeClass("hy-disabled");
                } else {
                    this.wrapper.addClass("hy-disabled");
                }
            }, ddSelect);

            ddSelect.data = Box.bind(function (ds) {
                var root = this.container.find("ul.dropdownselectroot").empty();

                ddSelect.dataSource = ds;//保存传入的数据源，后面可以用作过滤

                var ai = renderTree(root, ds);
                renderAll(root, ai);

                //添加筛选框
                if (option.showFilter) {
                    root.prepend(filter);
                }
            }, ddSelect);

            renderAll(ulRoot, allInfo);


            ctnel.append(ulRoot);

            if (option.selectValues) {//默认选中的值
                ddSelect.value(option.selectValues);
            }

            $(this).data('HYDropDownSelect', ddSelect);//加上这句话后,以后可以使用 $("XX").data('HYDropDownSelect')来获取到当前的控件对象

            return ddSelect;
        },

        //选择交易员
        HYSelect: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            var select = $(this);
            $.ajax({
                url: option.url,
                type: 'get',
                contentType: "application/json",
                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    select = select.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelect', select);//加上这句话后,以后可以使用 $("XX").data('HYSelect')来获取到当前的控件对象

            return select;
        },

        //选择交易员
        HYSelectSelfQuoterName: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "交易员"});

            option.dataConfig = {
                "text": "RealName",
                "value": "RealName"
            };

            var selfQuoterName = $(this);
            $.ajax({
                url: '/api/Auth/GetAllUsers',///api/Auth/GetAvailableUsers
                type: 'post',
                contentType: "application/json",
//                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelectSelfQuoterName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectSelfQuoterName')来获取到当前的控件对象

            return selfQuoterName;
        },

        //选择机构类型
        HYSelectAgencyType: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "机构类型"});

            option.dataConfig = {
                "text": "Property0",
                "value": "Property0"
            };

            var AgencyType = $(this);
            $.ajax({
                url: '/api/SysMgr/Product/GetAgencyType',
                type: 'get',
                contentType: "application/json",
                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    AgencyType = AgencyType.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelectAgencyType', AgencyType);//加上这句话后,以后可以使用 $("XX").data('HYSelectAgencyType')来获取到当前的控件对象

            return AgencyType;
        },
        //选择机构区域
        HYSelectAgencyArea: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "机构区域"});

            option.dataConfig = {
                "text": "Property0",
                "value": "Property0"
            };

            var AgencyArea = $(this);
            $.ajax({
                url: '/api/SysMgr/Product/GetAgencyArea',
                type: 'get',
                contentType: "application/json",
                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    AgencyArea = AgencyArea.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelectAgencyArea', AgencyArea);//加上这句话后,以后可以使用 $("XX").data('HYSelectAgencyArea')来获取到当前的控件

            return AgencyArea;
        },

        //选择部门
        HYSelectDepartment: function (option) {
            if ($(this).length == 0) {
                return null;
            }
            option = option || {};

            option = Box.apply({}, option, {name: "部门", selectDir: true});

            option.dataConfig = {
                "text": "DepartmentName",
                "value": "DepartmentID"
            };
            //option.selectDir = true;
            var dept = $(this).HYDropDownSelect(option);
            // var IsGetBusinessDep = option.IsGetBusinessDep == null ? true : false;

            dept.refresh = function (opt) {
                $.ajax({
                    url: '/api/Department/GetDepartments',
                    type: 'get',
                    contentType: "application/json",
                    async: false,
                    success: function (result) {
                        dept.data(result);
                        if (opt.selectValues) {
                            dept.value(opt.selectValues);
                        }
                    }
                });
            };

            dept.refresh(option);

            $(this).data('HYSelectDepartment', dept);//加上这句话后,以后可以使用 $("XX").data('HYSelectDepartment')来获取到当前的控件对象

            return dept;
        },

        HYSelectRequestType: function (option) {
            if ($(this).length == 0) {
                return null;
            }
            option = option || {};

            option = Box.apply({}, option, {name: "业务类型", selectDir: true});

            option.dataConfig = {
                "text": "ItemText",
                "value": "ItemKey"
            };
            //option.selectDir = true;
            var dept = $(this).HYDropDownSelect(option);


            dept.refresh = function (opt) {
                $.ajax({
                    url: '/api/SysMgr/Setting/GetBizTypeItemKeyByType',
                    type: 'get',
                    data: 'iType=15',
                    async: false,
                    contentType: 'application/json',
                    success: function (result) {
                        if (result != null) {
                            dept.data(result);
                            if (opt.selectValues) {
                                dept.value(opt.selectValues);
                            }
                        } else {
                            dept = Box.HY.DicHelper.optionForDealType();
                        }
                    }
                });
            };

            dept.refresh(option);

            $(this).data('HYSelectRequestType', dept);//加上这句话后,以后可以使用 $("XX").data('HYSelectRequestType')来获取到当前的控件对象

            return dept;
        },


        HYSelectDealType: function (option) {
            if ($(this).length == 0) {
                return null;
            }
            option = option || {};

            option = Box.apply({}, option, {name: "交易类型", selectDir: true});

            option.dataConfig = {
                "text": "text",
                "value": "value"
            };
            //option.selectDir = true;
            var dept = $(this).HYDropDownSelect(option);

            dept.data(Box.HY.DicHelper.optionForUSEDDealType().dataSource);

            $(this).data('HYSelectDealType', dept);//加上这句话后,以后可以使用 $("XX").data('HYSelectDealType')来获取到当前的控件对象

            return dept;
        },


        HYSelectSelfTraders: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "交易员"});

            option.dataConfig = {
                "text": "RealName",
                "value": "RealName",
            };

            var filter = option.filter || {};

            Box.apply(filter, {ReturnTree: false});

            option.filter = filter;

            var traders = $(this);
            $.ajax({
                url: '/api/SysMgr/Auth/GetAllUsers',
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    traders = traders.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelectSelfTraders', traders);//加上这句话后,以后可以使用 $("XX").data('HYSelectSelfTraders')来获取到当前的控件对象

            return traders;
        },
        ///新增了DepartmentID的过滤
        HYSelectSelfTraders2: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "交易员"});

            option.dataConfig = {
                "text": "RealName",
                "value": "RealName",
            };

            var filter = option.filter || {};

            Box.apply(filter, {ReturnTree: false});

            option.filter = filter;

            var traders = $(this);
            $.ajax({
                url: '/api/SysMgr/Auth/GetAllUsers',
                async: false,
                success: function (result) {
                    if (option.DepartmentID) {
                        var datas = [];
                        for (var i = 0; i <= result.length - 1; i++) {
                            if (result[i].DepartmentID === option.DepartmentID) {
                                datas.push(result[i]);
                            }
                        }
                        option.dataSource = datas;
                    } else {
                        option.dataSource = result;
                    }
                    traders = traders.HYDropDownSelect(option);
                }
            });

            $(this).data('HYSelectSelfTraders2', traders);//加上这句话后,以后可以使用 $("XX").data('HYSelectSelfTraders2')来获取到当前的控件对象

            return traders;
        },
        ///选择合伙人
        HYSelectPartner: function (option) {
            if ($(this).length == 0) {
                return null;
            }
            option = option || {};

            option = Box.apply({}, option, {name: "合伙人", selectDir: true});

            option.dataConfig = {
                "text": "RealName",
                "value": "RealName"
            };
            //option.selectDir = true;
            var partner = $(this).HYDropDownSelect(option);

            partner.refresh = function (opt) {
                $.ajax({
                    url: '/api/SysMgr/Auth/GetDepTraders',
                    type: 'get',
                    contentType: "application/json",
                    async: false,
                    success: function (result) {
                        partner.data(result);
                        if (opt.selectValues) {
                            partner.value(opt.selectValues);
                        }
                    }
                });
            };

            partner.refresh(option);
            $(this).data('HYSelectPartner', partner);//加上这句话后,以后可以使用 $("XX").data('HYSelectPartner')来获取到当前的控件对象
            return partner;
        },

        ///选择借券人(用于债券调拨)
        HYSelectAllotted: function (option) {
            if ($(this).length == 0) {
                return null;
            }

            var bondExchgCfg = $(this);
            //option.selectDir = true;

            var datasource = [];

            var selectValue = option.selectValue;


            $.ajax({
                url: '/api/SysMgr/Auth/GetDepTraders',
                type: 'get',
                contentType: "application/json",
                async: false,
                success: function (result) {
                    if (result) {
                        datasource = result;
                    }
                }
            });

            bondExchgCfg.HYDropDownList({
                dataTextField: "RealName",
                dataValueField: "RealName",
                dataSource: datasource,
                value: selectValue
            }).data("kendoDropDownList");

            return bindData(bondExchgCfg);
        },


        //获取所有机构/产品信息
        HYSelectAgencyName: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "机构/产品", selectDir: true, showFilter: true});

            option.dataConfig = {
                "text": "AccountName",
                "value": "AccountNo",
                "items": "IID"
            };
//            var selfQuoterName = $(this);
            var selfQuoterName = $(this).HYDropDownSelect(option);
            $.ajax({
                //url: '/api/SysMgr/Auth/GetAuthUsersWithDept?IsGetTradeUser=' + IsGetTradeUser,
                url: '/api/AgencyAccount/GetAllAgencyAccount',
                type: 'get',
                async: false,
                success: function (result) {
                    option.dataSource = result;
//                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    selfQuoterName.data(result);
                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });

            $(this).data('HYSelectAgencyName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectTradeUserName')来获取到当前的控件对象

            return selfQuoterName;
        },

        //获取所有机构/产品信息,某些产品已经被使用的,会被禁用,不可选择
        HYSelectEnableAgencyName: function (option, data) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "机构/产品", selectDir: true, showFilter: true});

            option.dataConfig = {
                "text": "AliasName",//AccountName
                "value": "AccountNo",
                "items": "IID",
                disabled: 'IsUsed'
            };
//            var selfQuoterName = $(this);
            var selfQuoterName = $(this).HYDropDownSelect(option);
            $.ajax({
                //url: '/api/SysMgr/Auth/GetAuthUsersWithDept?IsGetTradeUser=' + IsGetTradeUser,
                url: '/api/AgencyAccount/GetAllAgencyAccountByAccountNo',
                type: 'get',
                async: false,
                data: Box.apply({}, data, {accountNo: ''}),
                success: function (result) {
                    option.dataSource = result;
//                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    selfQuoterName.data(result);
                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });

            $(this).data('HYSelectAgencyName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectTradeUserName')来获取到当前的控件对象

            return selfQuoterName;
        },


        //获取所有机构简称信息
        HYSelectAgencysShortName: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};
            //把dataConfig放在这里面为了可以再外面重新定义
            option = Box.apply({}, option, {
                name: "机构简称",
                selectDir: true, showFilter: true,
                dataConfig: {
                    "text": "AliasName",
                    "value": "AccountNo",
                    "items": "IID"
                }
            });

//            option.dataConfig = {
//                "text": "AliasName",
//                "value": "AccountNo",
//                "items": "IID"
//            };
//            var selfQuoterName = $(this);
            var selfQuoterName = $(this).HYDropDownSelect(option);
            $.ajax({
                //url: '/api/SysMgr/Auth/GetAuthUsersWithDept?IsGetTradeUser=' + IsGetTradeUser,
                url: '/api/AgencyAccount/GetAllAgencyAccount',
                type: 'get',
                async: false,
                success: function (result) {
                    option.dataSource = result;
//                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    selfQuoterName.data(result);

                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });

            $(this).data('HYSelectAgencysShortName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectTradeUserName')来获取到当前的控件对象

            return selfQuoterName;
        },
        //获取有权限操作的用户（交易员 or 有权限操作的用户）
        HYSelectTradeUserName: function (option) {

            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {
                name: "交易员",
                dataConfig: {
                    "text": ["RealName", 'DepartmentName'],
                    "value": "AccountID",
                    "items": "items"
                }
            });

//            option.dataConfig = {
//                "text": ["RealName", 'DepartmentName'],
//                "value": "AccountID",
//                "items": "items"
//            };
//            option.dataConfig = {
//                "text": "RealName",
//                "value": "RealName",
//            };
//            var filter = option.filter || {};
//
//            filter = Box.apply({}, filter, {IsGetTradeUser: option.IsGetTradeUser == null ? true : option.IsGetTradeUser});
//
//            option.filter = filter;

            //var IsGetTradeUser = option.IsGetTradeUser == null ? true : false;

            var selfQuoterName = $(this);
            $.ajax({
                //url: '/api/SysMgr/Auth/GetAuthUsersWithDept?IsGetTradeUser=' + IsGetTradeUser,
                url: '/api/Auth/GetAllUsers',///api/Auth/GetAuthUsersWithDept
                type: 'post',
                contentType: "application/json",
//                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result.groupBy('DepartmentName');
                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);

                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });

            $(this).data('HYSelectAgencyName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectTradeUserName')来获取到当前的控件对象

            return selfQuoterName;
        },

        //获取所有有权限操作的用户
        HYSelectAllTradeUserName: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "交易员"});

            option.dataConfig = option.dataConfig || {
//                "text": "Name",
//                "value": "Name",
//                "items": "Users"
                "text": "RealName",
                "value": "AccountID",
                "items": "items"
            };

            var selfQuoterName = $(this);
            $.ajax({
                url: '/api/Auth/GetAllUsers',///api/Auth/GetAllUsersWithDept
                type: 'post',
                contentType: "application/json",
//                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });
            $(this).data('HYSelectAllTradeUserName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectAllTradeUserName')来获取到当前的控件对象
            return selfQuoterName;
        },

        //获取有权限的部门下的所有用户
        HYSelectAuthDeptUserName: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "交易员"});

            option.dataConfig = option.dataConfig || {
                "text": "RealName",
                "value": "AccountID",
                "items": "Items"
            };

            var needTrader = option.NeedTrader == null ? false : option.NeedTrader;

            var selfQuoterName = $(this);
            $.ajax({
                url: '/api/Auth/GetAllUsers',//'api/Auth/GetAuthDeptUsers?needTrader=' + needTrader
                type: 'post',
                contentType: "application/json",
//                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });
            $(this).data('HYSelectAuthDeptUserName', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectAuthDeptUserName')来获取到当前的控件对象
            return selfQuoterName;
        },

        //获取策略类别
        HYSelectStrategyType: function (option) {
            if ($(this).length == 0)
                return null;

            option = option || {};

            option = Box.apply({}, option, {name: "策略类别"});

            option.dataConfig = option.dataConfig || {
                "text": "",
                "value": "",
                "items": ""
            };
            var selfQuoterName = $(this);
            $.ajax({
                url: '/api/TradeMgr/Trade/GetAllStrategyType',
                type: 'get',
                contentType: "application/json",
                data: JSON.stringify(option.filter || {}),
                async: false,
                success: function (result) {
                    option.dataSource = result;
                    selfQuoterName = selfQuoterName.HYDropDownSelect(option);
                    if (option.selectValues) {
                        selfQuoterName.value(option.selectValues);
                    }
                }
            });
            $(this).data('HYSelectStrategyType', selfQuoterName);//加上这句话后,以后可以使用 $("XX").data('HYSelectStrategyType')来获取到当前的控件对象
            return selfQuoterName;
        },


        //获取债券类型
        HYSelectSecType: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "债券类型", selectDir: true});

            option.dataConfig = {
                "text": "Name",
                "value": "Value",
                "items": "ChildNode"
            };
            var portfolio = $(this).HYDropDownSelect(option);

            portfolio.refresh = function (opt) {
                $.ajax({
                    url: '/api/SysMgr/Prefer/GetSecTypeTree',
                    type: 'get',
                    //contentType: "application/json",
                    //data: JSON.stringify(option.filter || {}),
                    async: false,
                    success: function (result) {
                        portfolio.data(result);
                        if (opt.selectValues) {
                            portfolio.value(opt.selectValues);
                        }
                    }
                });
            };
            portfolio.refresh(option);
            $(this).data('HYSelectSecType', portfolio);//加上这句话后,以后可以使用 $("XX").data('HYSelectSecType')来获取到当前的控件对象
            return portfolio;
        },

        //组合选择控件
        HYSelectPortfolio: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "组合", selectDir: true, showFilter: true});

            option.dataConfig = {
                "text": "PortfolioName",
                "value": "PortfolioNo",
                "items": "ChildNode",
                "abbreviation": "Abbreviation"
            };
            //option.selectDir = true;
            var portfolio = $(this).HYDropDownSelect(option);

            portfolio.refresh = function (opt) {
                var flt = opt.filter || {};
                flt = Box.apply({}, flt, {
                    DirEmptyOption: 2,
                    OnlyActive: true,
                    WithRoot: true,
                    ContainIntermediateLeaf: true
                });

                $.ajax({
                    url: '/api/Portfolio/GetPortfolioTree',
                    type: 'post',
                    contentType: "application/json",
                    data: JSON.stringify(flt),
                    async: false,
                    success: function (result) {
                        portfolio.data(result);
                        if (opt.selectValues) {
                            portfolio.value(opt.selectValues);
                        }
                    }
                });
            };

            portfolio.refresh(option);
            $(this).data('HYSelectPortfolio', portfolio);//加上这句话后,以后可以使用 $("XX").data('HYSelectPortfolio')来获取到当前的控件对象
            return portfolio;
        },


        //产品选择控件
        HYSelectProduct: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "产品", selectDir: true});

            option.dataConfig = {
                "text": "ProductShortName",
                "value": "ProductNo",
            };
            //option.selectDir = true;
            var product = $(this).HYDropDownSelect(option);

            product.refresh = function (opt) {
                // var flt = opt.filter || {};

                $.ajax({
                    url: '/api/Product/GetProductList',
                    type: 'get',
                    // contentType: "application/json",
                    // data: JSON.stringify(flt),
                    async: false,
                    success: function (result) {
                        product.data(result);
                        product.dstemp = result;
                        if (opt.selectValues) {
                            product.value(opt.selectValues);
                        }
                    }
                });
            };

            product.refresh(option);
            $(this).data('HYSelectProduct', product);//加上这句话后,以后可以使用 $("XX").data('HYSelectProduct')来获取到当前的控件对象
            return product;
        },
        // HYSelectPortfolio: function (option) {
        //     if ($(this).length == 0)
        //         return null;
        //     // option = option || {};
        //     //
        //     // option = Box.apply({}, option, {name: "组合", selectDir: true, showFilter: true});
        //     //
        //     // option.dataConfig = {
        //     //     "text": "PortfolioName",
        //     //     "value": "PortfolioNo",
        //     //     "items": "ChildNode",
        //     //     "abbreviation": "Abbreviation"
        //     // };
        //     //option.selectDir = true;
        //
        //     var flt = {DirEmptyOption: 2, OnlyActive: true, WithRoot: true};
        //     var portfolioData=[];
        //
        //     $.ajax({
        //         url: '/api/Portfolio/GetPortfolioTree',
        //         type: 'post',
        //         contentType: "application/json",
        //         data: JSON.stringify(flt),
        //         async: false,
        //         success: function (result) {
        //             portfolioData=result;
        //         }
        //     });
        //
        //     var portfolio = $(this).kendoDropDownTree({
        //         placeholder: "请选择组合",
        //         checkboxes: {
        //             checkChildren: true,
        //         },
        //         height: 300,
        //         noDataTemplate: '暂无数据',
        //         checkAll: true,
        //         autoClose: false,
        //         dataTextField: "PortfolioName",
        //         dataValueField: "PortfolioNo",
        //         tagMode: "single",
        //         messages: {
        //             singleTag: "选择了",
        //         },
        //         checkAllTemplate: "全选",
        //         filter: "contains",
        //         clearButton: false,
        //         dataSource:{
        //             data:portfolioData,
        //             schema: {
        //                 model: {
        //                     children: "ChildNode",
        //                     hasChildren:true
        //                 }
        //             }
        //         }
        //     });
        //
        //
        //     return $(this);
        // },

        //根组合选择控件
        HYSelectRootPortfolio: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "组合", selectDir: true, showFilter: true});

            option.dataConfig = {
                "text": "PortfolioName",
                "value": "PortfolioNo",
                "abbreviation": "Abbreviation"
            };
            //option.selectDir = true;
            var portfolio = $(this).HYDropDownSelect(option);

            portfolio.refresh = function (opt) {
                var flt = opt.filter || {};
                flt = Box.apply({}, flt, {DirEmptyOption: 2, OnlyActive: true, WithRoot: true});

                $.ajax({
                    url: '/api/Portfolio/GetRootPortfolios',
                    type: 'get',
                    async: false,
                    success: function (result) {
                        portfolio.data(result);
                        if (opt.selectValues) {
                            portfolio.value(opt.selectValues);
                        }
                    }
                });
            };

            portfolio.refresh(option);
            $(this).data('HYSelectPortfolio', portfolio);//加上这句话后,以后可以使用 $("XX").data('HYSelectPortfolio')来获取到当前的控件对象
            return portfolio;
        },
        HYSelectManageAreaPortfolio: function (option) {
            if ($(this).length == 0)
                return null;
            option = option || {};

            option = Box.apply({}, option, {name: "组合", selectDir: true});

            option.dataConfig = {
                "text": "PortfolioName",
                "value": "PortfolioNo",
                "items": "ChildNode"
            };
            //option.selectDir = true;
            var portfolio = $(this).HYDropDownSelect(option);

            portfolio.refresh = function (opt) {
                var flt = opt.filter || {};
                flt = Box.apply({}, flt, {DirEmptyOption: 2, OnlyActive: true, WithRoot: true});

                $.ajax({
                    url: '/api/SysMgr/Portfolio/GetManageAreaPortfolioTree',
                    type: 'post',
                    contentType: "application/json",
                    data: JSON.stringify(flt),
                    async: false,
                    success: function (result) {
                        portfolio.data(result);
                        if (opt.selectValues) {
                            portfolio.value(opt.selectValues);
                        }
                    }
                });
            };

            portfolio.refresh(option);
            $(this).data('HYSelectManageAreaPortfolio', portfolio);//加上这句话后,以后可以使用 $("XX").data('HYSelectManageAreaPortfolio')来获取到当前的控件对象
            return portfolio;
        },

        HYToolBar: function (options) {
            if ($(this).length == 0)
                return null;

            options.items.foreach(function (item) {
                if (item.name) {
                    item.attributes = item.attributes || {};
                    item.attributes["hyname"] = item.name;
                }

                if (item.buttons) {
                    item.buttons.foreach(function (btn) {
                        if (btn.name) {
                            btn.attributes = btn.attributes || {};
                            btn.attributes["hyname"] = btn.name;
                        }
                    });
                }

                if (item.menuButtons) {
                    item.menuButtons.foreach(function (btn) {
                        if (btn.name) {
                            btn.attributes = btn.attributes || {};
                            btn.attributes["hyname"] = btn.name;
                        }
                    });
                }
            });

            var toolbar = $(this).kendoToolBar(options);

            toolbar.item = Box.bind(function (name) {
                return $(this).find("[hyname=" + name + "]");
            }, this);

            Box.Common.renderFunction(this);

            return bindData(toolbar);
        },

        //交易所债券市值根据哪种市值类型计算
        HYBondExchgCfgDropDownList: function () {
            if ($(this).length == 0)
                return null;

            var bondExchgCfg = $(this);
            var datasource = [];
            var selectValue = 0;

            $.ajax({
                url: "/api/SysMgr/Setting/GetExchgMktValueType",
                type: "get",
                async: false,
                success: function (data) {
                    if (data) {
                        selectValue = data;
                    }
                }
            });

            $.ajax({
                url: '/api/SysMgr/Setting/GetAllExchgMktValueType',
                type: 'get',
                contentType: "application/json",
                async: false,
                success: function (result) {
                    if (result) {
                        datasource = result;
                    }
                }
            });

            bondExchgCfg.HYDropDownList({
                dataTextField: "Property0",
                dataValueField: "Property1",
                dataSource: datasource,
                value: selectValue
            }).data("kendoDropDownList");

            return bindData(bondExchgCfg);
        },

        //通过成本口径类型筛选
        HYBondCostTypeDropDownList: function (options) {
            if ($(this).length == 0)
                return null;

            var bondCostType = $(this);
            var datasource = [];
            var selectValue = 0;

            $.ajax({
                url: "/api/SysMgr/Setting/GetCostType",
                type: "get",
                async: false,
                success: function (data) {
                    if (data) {
                        selectValue = data;
                    }
                }
            });

            $.ajax({
                url: '/api/SysMgr/Setting/GetAllCostType',
                type: 'get',
                contentType: "application/json",
                async: false,
                success: function (result) {
                    if (result) {
                        datasource = result;
                    }
                }
            });

            //此处2017.12.6应用于analysissearch_HX
            if (options && options.filter) {
                datasource = datasource.where("x=>x.Property0=='" + options.filter + "'");
            }

            bondCostType.HYDropDownList({
                dataTextField: "Property0",
                dataValueField: "Property1",
                dataSource: datasource,
                value: (options && options.value) || selectValue
            }).data("kendoDropDownList");

            return bindData(bondCostType);
        },

        HYTradePlatFormDropDownList: function (plat, selValue) {
            if ($(this).length == 0)
                return null;

            var tradePlatForm = $(this);
            var datasource = [];
            var selectValue = '';

            $.ajax({
                url: '/api/SysCfg/GetTradePlatFormName',
                type: 'get',
                data: {type: plat},
                contentType: "application/json",
                async: false,
                success: function (result) {
                    if (result) {

                        Box.Array.forEach(result, function (plat) {
                            datasource.push({
                                key: plat.PlateformNo,
                                value: plat.PlateformName
                            });

                            if (plat.Default) {
                                selectValue = plat.PlateformNo;
                            }
                        });

                        // for (var plat in result) {
                        //     datasource.push({
                        //         key: plat,
                        //         value: result[plat]
                        //     });
                        //
                        //     if (plat == '1') {
                        //         selectValue = plat;
                        //     }
                        // }

                        // datasource = result;
                        // $(result).each(function (idx, item) {
                        //     if (item.Property2 == "1") {
                        //         selectValue = item.Property1;
                        //     }
                        // });
                    }
                }
            });

            if (selValue != '') {
                selectValue = selValue;
            }

            tradePlatForm.HYDropDownList({
                dataTextField: "value",
                dataValueField: "key",
                dataSource: datasource,
                value: selectValue
            }).data("kendoDropDownList");

            return bindData(tradePlatForm);
        }


    });
});
/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.6.29
 * 描    述：封装的数组处理的方法
 * ======================================================================== */

Box.linq = (function () {

    function formatKeys(keys, argName) {
        var config = {};
        if (Box.isString(keys)) {
            keys = keys.split(",");
        }
        if (Box.isArray(keys)) {
            Box.each(keys, function (k) {
                config[k] = k;
            });
        } else if (Box.isObject(keys)) {
            config = keys;
        } else if (Box.isFunction(keys)) {
            return keys;
        } else {
            if (argName)
                throw '错误的参数：' + argName;
            return null;
        }
        return function (e) {
            return copyObject(e, config);
        };
    }

    function copyObject(item, config) {
        if (!config)
            return item;
        var rtnObj = {};
        for (var k in config) {
            rtnObj[k] = item && item[config[k]];
        }
        return rtnObj;
    }

    function formatFilter(filter, argName) {
        if (Box.isFunction(filter)) {
            return filter;
        }
        if (Box.isString(filter)) {
            if (filter.indexOf("=>") > 0) {
                var exp = filter.replace("=>", "){ return ");
                var fnStr = "var fn = function(" + exp + ";};";
                eval(fnStr);
                return fn;
            } else if (filter.indexOf(",") == -1) {
                return function (e) {
                    return e[filter];
                };
            }
        }
        if (argName)
            throw '错误的参数：' + argName;
        return null;
    }

    function checkList(list) {
        if (!Box.isArray(list)) {
            throw '错误的数组对象。';
        }
    }

    return {
        /*
         * 分组方法
         * @params list 要进行分组的源数组
         * @params keys 分组的依据，可以是以,分割的字符串，也可以是字符串类型的数组，也可以是对象
         * @params itemsName 分组后的数据在分组项中的属性名称
         * @params itemKeys 分组子项取数据的依据
         */
        groupBy: function (list, keys, itemsName, itemKeys) {
            checkList(list);

            var group = {};

            var keyConfig = formatKeys(keys, "keys");
            if (list.length && keyConfig) {
                var itemConfig = formatKeys(itemKeys);

                itemsName = Box.isString(itemsName) && itemsName || "items";
                Box.each(list, function (item) {
                    var gitem = keyConfig(item);
                    var keystring = Box.util.JSON.encode(gitem);

                    var cgitem = group[keystring];
                    if (!cgitem) {
                        gitem[itemsName] = [];
                        cgitem = gitem;
                        group[keystring] = cgitem;
                    }
                    var nitem = itemConfig ? itemConfig(item) : item;
                    cgitem[itemsName].push(nitem);
                });

                var rtn = [];
                for (var gk in group) {
                    rtn.push(group[gk]);
                }
                return rtn;
            }
            return [];
        },

        /*
         * 字典转换方法
         * @params list 要进行分组的源数组
         * @params keys 分组的依据，可以是字符串表示的属性名称，也可以是字符串类型的数组，也可以是对象
         * @params itemKeys 分组子项取数据的依据
         */
        toDictionary: function (list, key, itemKeys) {
            checkList(list);

            var group = {};
            var keyConfig = formatFilter(key, "key");

            if (list.length && keyConfig) {
                var itemConfig = formatKeys(itemKeys);
                Box.each(list, function (item) {
                    var gitem = keyConfig(item);
                    var nitem = itemConfig ? itemConfig(item) : item;
                    if (Box.isString(gitem) || Box.isNumber(gitem)) {
                        group[gitem] = nitem;
                    }
                });
            }
            return group;
        },

        sum: function (list, selector) {
            checkList(list);

            if (list.length) {
                var vals = Box.linq.select(list, selector);
                if (Box.linq.all(vals, "x=>Box.isNumber(x)||x==null")) {
                    var rtn = 0;
                    Box.linq.foreach(vals, function (item) {
                        rtn += (item || 0);
                    });
                    return rtn;
                }
                return Number.NaN;
            }
            return 0;
        },

        max: function (list, selector, accuracy) {
            checkList(list);

            if (list.length) {
                var vals = Box.linq.select(list, selector);
                if (accuracy)
                    return Box.bind(Math.max, null, vals)();
                var m = vals[0];
                for (var i = 1; i < vals.length; i++) {
                    if (vals[i] > m)
                        m = vals[i];
                }
                return m;
            }
            return 0;
        },

        min: function (list, selector, accuracy) {
            checkList(list);

            if (list.length) {
                var vals = Box.linq.select(list, selector);
                if (accuracy)
                    return Box.bind(Math.min, null, vals)();
                var m = vals[0];
                for (var i = 1; i < vals.length; i++) {
                    if (vals[i] < m)
                        m = vals[i];
                }
                return m;
            }
            return 0;
        },

        select: function (list, selector) {
            checkList(list);

            if (list.length) {
                var itemConfig = formatFilter(selector) || formatKeys(selector);
                if (!itemConfig) {
                    itemConfig = function (x) {
                        return x;
                    };
                }

                var rtn = [];
                Box.each(list, function (item) {
                    var nitem = itemConfig(item);
                    rtn.push(nitem);
                });

                return rtn;
            }
            return [];
        },

        where: function (list, filter) {
            checkList(list);

            if (list.length) {
                filter = formatFilter(filter, "filter");
                if (list.length && filter) {
                    var rtn = [];
                    Box.each(list, function (item) {
                        if (filter(item))
                            rtn.push(item);
                    });
                    return rtn;
                }
            }
            return [];
        },

        remove: function (list, filter) {
            checkList(list);

            if (list.length) {
                var fnfilter = formatFilter(filter);
                if (fnfilter) {
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (fnfilter((list[i]))) {
                            list.splice(i, 1);
                        }
                    }
                }
            }
            return list;
        },

        removeValue: function (list, value) {
            return Box.linq.remove(list, function (x) {
                return x == value;
            });
        },

        count: function (list, filter) {
            var rst = Box.linq.where(list, filter);
            return rst.length;
        },

        all: function (list, filter) {
            var rst = Box.linq.where(list, filter);
            return rst.length == list.length;
        },

        foreach: function (list, action, scope) {
            checkList(list);

            if (list.length) {
                action = formatFilter(action, "action");
                if (Box.isFunction(action)) {
                    for (var i = 0; i < list.length; i++) {
                        var k = list[i];
                        action.call(scope || k, k, i, list);
                    }
                }
            }
            return list;
        },

        foreachInTree: function (list, action, itemsName, onlyLeaf, scope) {
            checkList(list);
            itemsName = itemsName || "items";

            if (list.length) {
                action = formatFilter(action, "action");
                if (Box.isFunction(action)) {
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        if (item[itemsName] && Box.isArray(item[itemsName])) {
                            Box.linq.foreachInTree(item[itemsName], action, itemsName, onlyLeaf, scope);
                            if (!onlyLeaf) {
                                action.call(scope, item);
                            }
                        } else {
                            action.call(scope, item);
                        }
                    }
                }
            }
            return list;
        },

        addRange: function (list, array) {
            checkList(list);

            checkList(array);

            if (array.length) {
                for (var i = 0; i < array.length; i++) {
                    list.push(array[i]);
                }
            }
            return list;
        },

        copy: function (list, start, end) {
            checkList(list);

            start = start || 0;
            start = Math.max(start, 0);

            end = end || list.length;
            end = Math.min(end, list.length);

            var rtn = [];
            for (var i = start; i < end; i++) {
                rtn.push(list[i]);
            }
            return rtn;
        },

        distinct: function (list, comparer) {
            checkList(list);

            if (list.list < 2) {
                return Box.linq.copy(list);
            }
            comparer = comparer || function (a, b) {
                return a === b;
            };

            var rtn = Box.linq.copy(list, 0, 1);
            for (var i = 1; i < list.length; i++) {
                if (rtn.all(function (r) {
                        return !comparer(r, list[i]);
                    })) {
                    rtn.push(list[i]);
                }
            }
            return rtn;
        },

        skip: function (list, count) {
            checkList(list);

            var rtn = Box.linq.copy(list, count);
            return rtn;
        },

        take: function (list, count) {
            checkList(list);
            if (!count)
                return [];

            var rtn = Box.linq.copy(list, 0, count);
            return rtn;
        },

        selectMany: function (list, filter) {
            var many = Box.linq.select(list, filter);

            var rtn = [];
            Box.linq.foreach(many, function (m) {
                if (Box.isArray(m)) {
                    rtn = rtn.concat(m);
                } else if (!Box.isNullOrUndefined(m)) {
                    rtn.push(m);
                }
            });
            return rtn;
        },

        selectLeaves: function (list, childField, onlyLeaf, removeEmpty) {
            checkList(list);

            var filter = "x=>x." + childField + "&&x." + childField + ".length";
            if (removeEmpty) {
                filter = "x=>x." + childField;
            }

            var rtn = Box.clone(list);

            do {
                if (onlyLeaf) {
                    // rtn = rtn.selectMany("x=>x." + childField + "||x");

                    rtn = rtn.selectMany(function (x) {
                        if (x[childField] && x[childField].length) {//需要判断子节点是否有数据,如果是空数组也不返回
                            return x[childField];
                        }
                        else {
                            return x;
                        }
                    });
                } else {
                    Box.linq.foreach(rtn, function (x) {
                        if (x[childField] && x[childField].length) {
                            rtn = rtn.concat(x[childField]);
                            x[childField] = null;
                        }
                    });
                }
            } while (Box.linq.count(rtn, filter));

            return rtn;
        },

        contains: function (list, value, accuracy) {
            checkList(list);

            return Box.linq.count(list, function (x) {
                return accuracy ? x === value : x == value;
            }) > 0;
        },

        first: function (list, filter) {
            checkList(list);

            if (!filter) {
                filter = function () {
                    return true;
                };
            }
            filter = formatFilter(filter, "filter");
            if (list.length && filter) {
                for (var i = 0; i < list.length; i++) {
                    if (filter(list[i]))
                        return list[i];
                }
            }
            return null;
        },

        last: function (list, filter) {
            checkList(list);

            if (!filter) {
                filter = function () {
                    return true;
                };
            }
            filter = formatFilter(filter, "filter");
            if (list.length && filter) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (filter(list[i]))
                        return list[i];
                }
            }
            return null;
        },

        indOf: function (list, filter, start) {
            checkList(list);

            start = start || 0;
            start = Math.max(start, 0);
            start = Math.min(start, list.length - 1);
            filter = formatFilter(filter, "filter");
            if (list.length && filter) {
                for (var i = start; i < list.length; i++) {
                    if (filter(list[i]))
                        return i;
                }
            }
            return -1;
        },

        lastIndOf: function (list, filter, end) {
            checkList(list);

            end = end || list.length - 1;
            end = Math.max(end, 0);
            end = Math.min(end, list.length - 1);

            filter = formatFilter(filter, "filter");
            if (list.length && filter) {
                for (var i = end; i >= 0; i--) {
                    if (filter(list[i]))
                        return i;
                }
            }
            return -1;
        },

        except: function (list, second, comparer) {
            checkList(list);
            checkList(second);

            comparer = comparer || function (a, b) {
                return a === b;
            };

            var rtn = [];
            Box.linq.foreach(list, function (it) {
                if (Box.linq.count(second, function (s) {
                        return comparer(it, s);
                    }) == 0) {
                    rtn.push(it);
                }
            });
            return rtn;
        },

        union: function (list, second, comparer) {
            checkList(list);
            checkList(second);

            var tmp = list.concat(second);
            return Box.linq.distinct(tmp, comparer);
        },

        intersect: function (list, second, comparer) {
            checkList(list);
            checkList(second);

            comparer = comparer || function (a, b) {
                return a === b;
            };

            var rtn = [];
            Box.linq.foreach(list, function (it) {
                if (Box.linq.count(second, function (s) {
                        return comparer(it, s);
                    })) {
                    rtn.push(it);
                }
            });
            return rtn;
        },

        orderBy: function (list, selector, descending) {
            checkList(list);

            if (list.length) {
                var rtn = Box.linq.copy(list);

                if (Box.isFunction(selector) && selector.length == 2) {
                    rtn.sort(selector);
                } else {
                    var itemConfig = formatFilter(selector) || formatKeys(selector);
                    if (!itemConfig) {
                        itemConfig = function (x) {
                            return x;
                        };
                    }
                    rtn.sort(function (a, b) {
                        return Box.compare(itemConfig(a), itemConfig(b));
                    });
                }
                if (descending)
                    rtn.reverse();
                return rtn;
            }
            return [];
        },
        orderByDescending: function (list, selector) {
            return Box.linq.orderBy(list, selector, true);
        },
    };
})();


//if (typeof Array.prototype.all != 'function') {
//    Array.prototype.all = function () {
//        var arr = arguments.length > 1 ? Array.apply(this, arguments) : [Box.ifNull(arguments[0],undefined)];
//        arr.unshift(this);
//        return Box.linq.all.apply(this, arr);
//    };
//}


for (var fn in Box.linq) {
    eval("if (typeof Array.prototype." + fn + " != 'function') {" +
        "   Array.prototype." + fn + " = function () {" +
        "       var arr = arguments.length > 1 ? Array.apply(this, arguments) : [Box.ifNull(arguments[0],undefined)];" +
        "       arr.unshift(this);" +
        "       return Box.linq." + fn + ".apply(this, arr);" +
        "   };" +
        "}");
}
;

/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.5.18
 * 描    述：封装的kendoUI的notify,可以弹出不同类型(info,success,error,warning)的提示消息
 示    例:
 Box.Notify.info('fdafdsafdsaf');
 Box.Notify.success('fdafdsafdsaf');
 Box.Notify.warning('fdafdsafdsaf');
 Box.Notify.error('fdafdsafdsaf');
 Box.Notify.notification('fdafdsafdsaf');  //在浏览器外的右下角弹出提示
 * ======================================================================== */

Box.define('Box.Notify', {
    statics: {
        notify: null
    },

    extend: 'Box.Component',

    templates: {
        main: ['<span></span>'],
    },

    //type: 'info',//提示的类型:"info", "success", "warning" and "error".
    //message:'',//显示的提示

    //stacking: 'down',  // 多个提示出现时,排列的方向,  ("up", "right", "down", "left" , "default")

    //autoHideAfter: 4000,  //自动隐藏的时间,如果为0表示不自动隐藏,需要用户手动关闭

    _initNotify: function () {
        var statics = this.statics();

        statics.notify = statics.notify || this.el.target.kendoNotification({
            hideOnClick: true,
            position: {
                pinned: true,
                top: null,
                left: null,
                bottom: 20,
                right: 20
            },
            templates: [
                {
                    type: "hy-notify-info",
                    template: "<div class='hy-notify hy-notify-info'>" +
                    "<i class=' fa fa-info-circle hy-notify-icon'></i>" +
                    "<div class='hy-notify-title'>信息:</div>" +
                    "<div class='hy-notify-message'>#= message #</div>" +
                    "</div>"
                },
                {
                    type: "hy-notify-success",
                    template: "<div class='hy-notify hy-notify-success'>" +
                    "<i class=' fa fa-check-circle hy-notify-icon'></i>" +
                    "<div class='hy-notify-title'>提示:</div>" +
                    "<div class='hy-notify-message'>#= message #</div>" +
                    "</div>"
                },
                {
                    type: "hy-notify-warning",
                    template: "<div class='hy-notify hy-notify-warning'>" +
                    "<i class=' fa fa-warning hy-notify-icon'></i>" +
                    "<div class='hy-notify-title'>警告:</div>" +
                    "<div class='hy-notify-message'>#= message #</div>" +
                    "</div>"
                },
                {
                    type: "hy-notify-error",
                    template: "<div class='hy-notify hy-notify-error'>" +
                    "<i class='fa fa-times-circle hy-notify-icon'></i>" +
                    "<div class='hy-notify-title'>错误:</div>" +
                    "<div class='hy-notify-message'>#= message #</div>" +
                    "</div>"
                }
            ],
            stacking: 'top',
            button: 'true',
            // autoHideAfter: 5000, //自动隐藏的时间,如果是0的话,就不自动隐藏
        }).data("kendoNotification");

        //statics.notify.show(this.message, this.type);
    },

    info: function (message) {
        this.statics().notify.show({
            message: message
        }, 'hy-notify-info');
    },

    success: function (message) {
        this.statics().notify.show({
            message: message
        }, 'hy-notify-success');
    },

    warning: function (message) {
        this.statics().notify.show({
            message: message
        }, 'hy-notify-warning');
    },

    error: function (message) {
        this.statics().notify.show({
            message: message
        }, 'hy-notify-error');
    },

    notification: function (message, onclick) { //这个提示最多只能展示3条，需要把显示的关闭后才能显示下一条
        window.Notification.permission = "granted";
        if (window.Notification) {
            if (window.Notification.permission == "granted") {
                var notification = new Notification('提示', {
                    body: message,
                    icon: '/Res/imgs/logo.png'
                });

                if (Box.isFunction(onclick)) {
                    notification.onclick = onclick;
                }
                //setTimeout(function () { notification.close(); }, 5000);
            } else {
                window.Notification.requestPermission();
            }
        } else alert('你的浏览器不支持此消息提示功能，请使用chrome内核的浏览器！');
    },

    setup: function () {
        this._initNotify();
    },
}, function () {
    //Box.Notify = Box.Notify;  //严格定义大小写，去掉这局

    Box.Notify.info = function (message) {
        new Box.Notify().info(message);
    };
    Box.Notify.success = function (message) {
        new Box.Notify().success(message);
    };
    Box.Notify.warning = function (message) {
        new Box.Notify().warning(message);
    };
    Box.Notify.error = function (message) {
        new Box.Notify().error(message);
    };
    Box.Notify.notification = function (message, onclick) {
        new Box.Notify().notification(message, onclick);
    };
});

/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.5.18
 * 描    述：可以收缩,全屏的panel

 * ======================================================================== */
Box.define('Box.Panel', {
    statics: {
        //右上角的按钮默认配置
        DEFAULT_BUTTON_CONFIG: {
            name: '', //按钮名字,必须要唯一
            text: '', //按钮显示的名字
            //theme: "k-info", //k-primary,k-info,k-success,k-warning,k-danger
            disable: false, //是否禁用按钮
            icon: '', //fontawsome的图标
            display: true, //是否显示按钮
            handler: '', //点击按钮的处理函数, 
            scope: null, //按钮事件的作用域
            ribbon: false
        }
    },

    extend: Box.Component,

    elements: {
        header: '.hy-panel-header',

        title: '.hy-panel-title',

        titleText: '.hy-panel-title-text',

        // titleIcon: '.hy-panel-title>i',

        content: '.hy-panel-content',

        toggleBtn: '.toggleBtn',

        fullscreenBtn: '.fullscreenBtn',

        buttons: '.hy-panel-buttons',

        actions: '.hy-panel-actions'
        //  btnClose: '.btnClose'
    },

    events: {
        'click toggleBtn ': '_toggele',
        'click fullscreenBtn': '_toggleFullscreen',
        'dblclick header': '_toggleFullscreen'
        // 'click btnClose': '_doclose'
    },

    templates: {
        main: [
            '<div class="hy-panel" >' +
            '<div class="hy-panel-header">' +
            '<div class="hy-panel-title"> <div  class="hy-panel-title-text"> {title}</div></div>' +
            '<div class="hy-panel-actions">' +
            '<a class="hy-panel-btn toggleBtn"><span class=" fa fa-minus"></span></a>' +
            '<a class=" hy-panel-btn fullscreenBtn" style=" border-radius: 0 3px 3px 0;"><span class=" fa fa-expand"></span></a>' +
            // '<a class="k-button k-button-icon k-group-end hy-panel-btn btnClose" style=" border-radius: 0 3px 3px 0;"><span class="k-sprite fa fa-times"></span></a>' +
            '</div>' +
            '<div class="hy-panel-buttons"></div></div>' +
            '<div class="hy-panel-content">' +
            '</div></div>'
        ],
        button: ['<a name="{name}" <tpl if="!display"> style="display:none" </tpl>  <tpl if="disable"> disabled </tpl>  class="k-info k-button hy-panel-btn" href="javascript:void(0);"><span style="margin-right: 5px;" class="fa {icon}"></span><span class="text">{text}</span></a>'],
        action: ['<a class="k-button k-button-icon k-group-end hy-panel-btn {name}"  title= "{title}"><span class="k-sprite fa {icon}"></span></a>']
    },

    title: '', //窗体的标题

    // icon: '', // 标题前面的小图标,请使用fontawesome,例如:fa-times,  MP: 没有人用,去掉这各配置了

    //contentTemplate  暂时不用这个,有个bug改不了   //有些时候直接用box.panel就需要用这个属性,不能用templates,main会被覆盖掉

    defaultStatus: 'expand', //设定默认状态是折叠(compress) 还是展开(expand)

    //actions: [
    //    "Toggle" //折叠按钮
    //],

    actions: [//自定义action
        //{
        //    name: 'chart', //按钮名字,必须要唯一
        //    icon: 'fa-pie-chart', //fontawsome的图标
        //    handler: '_showChart', //点击按钮的处理函数,
        //    title:'fdsafds',// 鼠标移动上去显示的信息
        //}
    ],

    buttons: [], //panel标题栏右边的按钮,可以直接设置为数组,还可以设置为function

    contentElements: {},

    getMainTplData: function () {
        return {
            title: this.title,
            // icon: this.icon
        };
    },

    showHeader: true, //是否显示标题头

    getContentData: Box.emptyFn, //获取渲染内容的数据,需要返回JSON对象

    _toggele: function (e, target) {
        this.fnToggle();
        return false;
    },

    //折叠(展开)content部分
    fnToggle: function (speed) {
        if (this.el.content.css('display') == 'none') { //修改toggle的图标
            this.el.toggleBtn.find('span').removeClass().addClass('k-sprite fa fa-minus');
            this.status = 'expand';

            //命中onExpand事件
            this.onExpand.call(this);
            this.trigger('onExpand', this);
        } else {
            this.el.toggleBtn.find('span').removeClass().addClass('k-sprite fa fa-plus');
            this.status = 'compress';

            //命中onCompress事件
            this.onCompress.call(this);
            this.trigger('onCompress', this);
        }
        this.el.content.slideToggle(speed || 500);

        //命中onToggle事件
        this.onToggle.call(this);
        this.trigger('onToggle', this);
    },

    _toggleFullscreen: function (e, target) {
        if ((e.type == "dblclick" && $(e.target).is(this.el.header)) || (e.type == 'click')) { //避免点到其他位置也产生效果
            this.fnToggleFullscreen();
        }

        return false;
    },

    //_doclose: function () {
    //    alert(111);
    //    this.close();
    //},
    //切换全屏
    fnToggleFullscreen: function () {
        if (this.el.target.hasClass('hy-panel-max')) { //还原
            this.el.target.removeClass('hy-panel-max');
            this.el.fullscreenBtn.find('span').removeClass().addClass('k-sprite fa fa-expand');

            this.el.toggleBtn.show();

            if (this.status == 'compress') {
                this.el.content.hide();
            }
            //命中onRestore事件
            this.onRestore.call(this);
            this.trigger('onRestore', this);

        } else {//全屏
            this.el.target.addClass('hy-panel-max');
            this.el.fullscreenBtn.find('span').removeClass().addClass('k-sprite fa fa-compress');

            this.el.content.show();
            this.el.toggleBtn.hide();

            //命中onFullscreen事件
            this.onFullscreen.call(this);
            this.trigger('onFullscreen', this);

        }

        //命中onToggleFullscreen事件
        this.onToggleFullscreen.call(this);
        this.trigger('onToggleFullscreen', this);
    },

    beforeInit: Box.emptyFn, //初始化之前执行的一些操作

    init: Box.emptyFn, //可以自己在这里初始化一些东西

    afterInit: Box.emptyFn, //初始化之后执行的一些操作

    setting: function () {
        //把contentTemplate加到templates里面
        //if (this.contentTemplate != '') {
        //    this.templates.content = this.contentTemplate;
        //}

        this.status = this.defaultStatus;
    },

    setup: function () {

        Box.Questionreminder.show({
            message: '双击标题栏,最大化该窗口',
            renderTo: this.el.title
        });

        if (this.templates.content) {
            this.el.content.append(this.applyTemplate('content', this.getContentData()));
        }

        this.applyElements(this.contentElements);
        if (this.defaultStatus != 'expand') {
            this.toggle(0);
        }

        this._initButtons();

        this._initActions();

        this.beforeInit();

        this.init();

        if (!this.showHeader) {
            this.el.header.hide();
        }
        this.afterInit();
    },


    _initActions: function () {
        if (this.actions) {
            this.el.actions = this.el.actions || {};
            if (Box.isFunction(this.actions)) {
                this.actions = this.actions();
            }
            var actions = Box.isObject(this.actions) ? [this.actions] : this.actions;
            Box.Array.forEach(actions, function (action) {
                if (action) {
                    var actionEl = this.applyTemplate('action', Box.apply({}, action));
                    this.el.actions[action.name] = actionEl;
                    this.el.actions.prepend(actionEl);
                    this._bindBtnHandler(actionEl, 'click', action.handler, action, action.scope);
                }
            }, this);
        }
    },

    _initButtons: function () {
        var statics = this.statics();

        if (this.buttons) {
            this.el.buttons = this.el.buttons || {};
            if (Box.isFunction(this.buttons)) {
                this.buttons = this.buttons();
            }
            var buttons = Box.isObject(this.buttons) ? [this.buttons] : this.buttons;
            Box.Array.forEach(buttons, function (btn) {
                if (btn) {
                    var btnEl = this.applyTemplate('button', Box.apply({}, btn, statics.DEFAULT_BUTTON_CONFIG));
                    this.el.buttons[btn.name] = btnEl;
                    this.el.buttons.append(btnEl);
                    this._bindBtnHandler(btnEl, 'click', btn.handler, btn, btn.scope);
                }
            }, this);
        }
    },

    fnShowBtn: function (name) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].show();
        }
    },

    fnHideBtn: function (name) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].hide();
        }
    },

    fnSetBtnText: function (name, text) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].find(".text").html(text);
        }
    },

    _setBtnDisable: function (name, disable) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].attr("disabled", disable);
        }
    },

    fnDisableBtn: function (name) {
        this._setBtnDisable(name, true);
    },

    fnEnableBtn: function (name) {
        this._setBtnDisable(name, false);
    },

    fnSetTitle: function (title) {
        if (title) {
            this.el.titleText.html(title);
        }
    },

    fnHideToggle: function () {
        this.el.toggleBtn.css('display', 'none');
        this.el.fullscreenBtn.css('display', 'none');
    },

    onToggle: Box.emptyFn, //当折叠或者展开的时候触发

    onExpand: Box.emptyFn, //当展开的时候触发,在这之后也会触发一次onToggle

    onCompress: Box.emptyFn, //当折叠的时候触发,在这之后也会触发一次onToggle

    onFullscreen: Box.emptyFn, //全屏时候触发,在这之后也会触发一次onToggleFullscreen

    onRestore: Box.emptyFn, //从全屏还原时候触发,在这之后也会触发一次onToggleFullscreen

    onToggleFullscreen: Box.emptyFn, //全屏状态切换触发
}, function () {
    Box.Panel.show = function (options) {
        var pnl = new Box.Panel(options);
        return pnl;
    };
});
/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.7.28
 * 描    述：通用的打印方法

 示例

 一、 可以传数组
 var print = new Box.Print({
 printContent: [
 {
 path: 'WebSource/Common/modules/traderequest/workflow/tpl/workflow.html',
 data: {
 workflowInfo: [{ "RequestNo": null,
 "TemplateName": null,
 "StateName": "开始",
 "Opinion": null,
 "ApproveTime": "2015-07-29 09:20:51",
 "ApproveState": true,
 "ApproveUser": "Administrator",
 "OpenStatus": 0,
 "Rownumber": 0,
 "RecordType": 1,
 "ApproveUserNames": null },

 { "RequestNo": null,
 "TemplateName": null,
 "StateName": "部门复审",
 "Opinion": "",
 "ApproveTime": null,
 "ApproveState": false,
 "ApproveUser": "吴思铭",
 "OpenStatus": 0,
 "Rownumber": 1, "RecordType": 0,
 "ApproveUserNames": null },
 { "RequestNo": null,
 "TemplateName": null,
 "StateName": "结束",
 "Opinion": "",
 "ApproveTime": null,
 "ApproveState": false,
 "ApproveUser": "",
 "OpenStatus": 0,
 "Rownumber": 2,
 "RecordType": 0,
 "ApproveUserNames": null }]
 }
 }
 ]
 });

 二、或者在path里面直接写模板内容

 var print = new Box.Print({
 printContent: [
 {
 path: ["<div>{[values.workflowInfo[0].StateName]}</div>"],
 data: {
 workflowInfo: [{ "RequestNo": null,
 "TemplateName": null,
 "StateName": "开始",
 "Opinion": null,
 "ApproveTime": "2015-07-29 09:20:51",
 "ApproveState": true,
 "ApproveUser": "Administrator",
 "OpenStatus": 0,
 "Rownumber": 0,
 "RecordType": 1,
 "ApproveUserNames": null },

 { "RequestNo": null,
 "TemplateName": null,
 "StateName": "部门复审",
 "Opinion": "",
 "ApproveTime": null,
 "ApproveState": false,
 "ApproveUser": "吴思铭",
 "OpenStatus": 0,
 "Rownumber": 1, "RecordType": 0,
 "ApproveUserNames": null },
 { "RequestNo": null,
 "TemplateName": null,
 "StateName": "结束",
 "Opinion": "",
 "ApproveTime": null,
 "ApproveState": false,
 "ApproveUser": "",
 "OpenStatus": 0,
 "Rownumber": 2,
 "RecordType": 0,
 "ApproveUserNames": null }]
 }
 }
 ]
 });


 三、或者直接传一个需要打印的模板
 var print=new Box.Print({
 printContent: 'WebSource/Common/modules/traderequest/tpl/commoninfo.html',
 });


 推荐用上面两种，第三种使用意义不大了。

 print.fnPrint();


 * ======================================================================== */

Box.define('Box.Print', {
    statics: {
        TRANSFER_ELEMENT_ID: 'print-transfer',

        PRINT_IFRAME_ELEMENT_ID: 'print-iframe',
    },

    extend: Box.Component,

    requires: [
        Box.dom.Helper
    ],

    templates: {
        main: ['<div></div>']
    },

    //用数组支持多个同时打印, 或者直接传入一个文件路径，直接打印
    //printContent: [
    //{
    //    data: {},//用来渲染模板用的数据
    //    path: ''//打印模板的路径
    //}
    //],

    _getPrintTransferElement: function () {

        this.transfer = $('#' + this.statics().TRANSFER_ELEMENT_ID);
        if (!this.transfer.length) {

            var helper = Box.dom.Helper; // 创建一个速记别名
            // 规范对象
            var spec = {
                tag: 'div',
                cls: 'hidden',
                id: this.statics().TRANSFER_ELEMENT_ID
            };

            this.transfer = $(helper.append(document.body, spec));


            //this.transfer = $(Box.html({
            //    tag: 'div',
            //    cls: 'hidden',
            //    id: this.statics().TRANSFER_ELEMENT_ID
            //})).appendTo(document.body);
        }
        return this.transfer;
    },

    _getPrintIfameElement: function () {
        this.frame = $("#" + this.statics().PRINT_IFRAME_ELEMENT_ID + ' iframe');
        if (!this.frame.length) {

            var helper = Box.dom.Helper; // 创建一个速记别名
            // 规范对象
            var spec = {
                tag: 'div',
                cls: 'hidden',
                id: this.statics().PRINT_IFRAME_ELEMENT_ID,
                children: [
                    {
                        tag: 'iframe',
                        src: 'about:blank'
                    }
                ]
            };

            this.frame = $(helper.append(document.body, spec)).find('iframe');


            //this.frame = $(Box.html({
            //    tag: 'div',
            //    cls: 'hidden',
            //    id: this.statics().PRINT_IFRAME_ELEMENT_ID,
            //    children: [
            //        {
            //            tag: 'iframe',
            //            src: 'about:blank'
            //        }
            //    ]
            //})).appendTo(document.body).find('iframe');
        }
        return this.frame;
    },

    setting: function () {
        this.transfer = this._getPrintTransferElement();
    },

    fnPrint: function () {
        //this.requests_info = this.getRequestsInfo();
        //this.format(this.requests_info);
        this._initTemplates();
        this._compile();

        this._framePrint();
    },

    fnCompile: function () { //获取渲染后的模板，直接返回html
        this._initTemplates();
        this._compile();


        //去掉打印的时候最后一页空白
        this.transfer.children().last().css("page-break-after", "avoid");

        var html = this.transfer.removeClass('hidden');

        return html;
    },

    fnTestPrint: function () {
        //this.requests_info = this.getRequestsInfo();
        //this.format(this.requests_info);
        this._initTemplates();
        this._compile();


        //去掉打印的时候最后一页空白
        this.transfer.children().last().css("page-break-after", "avoid");

        var html = this.transfer.removeClass('hidden');

        var me = this;
        var window = new Box.Window({
            maximize: true,
            init: function () {
                this.el.content.append(html);
            }
        });
    },


    _initTemplates: function () {

        var tpls = {}, applyFn;
        if (typeof this.printContent === 'string') {
            tpls = {
                main: {name: 'main', path: this.printContent}
            };
        } else if (Box.isArray(this.printContent)) {
            Box.Array.forEach(this.printContent, function (item, i) {
                tpls[i.toString()] = item;
            });
        }

        //if (Box.isObject(tpls)) {
        //    tpls = Box.apply({}, this.printContent, {});
        //}

        Box.Object.each(tpls, function (name, tpl) {
            if (Box.isString(tpl.path)) {
                tpls[name] = Box.String.has(tpl.path, '.') ?
                    {name: name, path: tpl.path} :
                    {name: name, id: tpl.path};
            } else if (Box.isArray(tpl.path) || Box.isFunction(tpl.path)) {
                tpls[name] = {name: name, content: tpl.path};
            }
            applyFn = 'apply' + Box.String.firstUpperCase(name) + 'Template';
            this[applyFn] = function (data, isHtml) {
                return this._applyTemplate(name, data, isHtml);
            };
        }, this);
        this.tpl = {};
        Box.ComponentTplFactory.register(this, tpls);
    },

    _applyTemplate: function (name, data, isHtml) {
        var template = this.tpl[name];
        var html = template.isTemplate ? template.apply(data) : template.call(this, data);
        this.transfer.append(isHtml ? html : Box.get(html));
    },

    _compile: function () {
        this.transfer.empty();

        if (Box.isString(this.printContent)) {
            this._applyTemplate('main');
        } else if (Box.isArray(this.printContent)) {
            Box.Array.forEach(this.printContent, function (content, i) {
                this._applyTemplate(i, content.data);
            }, this);
        }
        //else if (this.printContent instanceof jQuery) {
        //    var print = this.printContent.clone();
        //    this.transfer.append(print);
        //}
    },

    //_getTransfer: function () {
    //    this.requests_info = this.getRequestsInfo();
    //    this.format(this.requests_info);
    //    this._compile();
    //    return this.transfer;
    //},


    _printByIframe: function () {
        //去掉打印的时候最后一页空白
        this.transfer.children().last().css("page-break-after", "avoid");

        this.frame = this._getPrintIfameElement();
        this.frame.contents().find('body').html(this.transfer[0].outerHTML);
        this.frame[0].contentWindow.print();
    },

    _framePrint: function () {
        if (document.all) {
            this.printByWindowOpen();
        } else {
            this._printByIframe();
        }
        return false;
    }
});


Box.Ql = (function () {

    return {

        /*--铁三角计算------------------------------------*/

        //根据净价计算到期收益率
        calcYieldMat: function (bondKey, cleanPrice, calDate, iscleanPrice) {
            if (!bondKey || !cleanPrice || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: cleanPrice,
                item3: calDate,
                item4: !!iscleanPrice
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcYieldMat",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //根据到期收益率计算净价
        calcCleanPriceMat: function (bondKey, yld, calDate) {
            if (!bondKey || !yld || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: yld,
                item3: calDate
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcCleanPriceMat",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //根据到期收益率计算全价
        calcDirtyPriceMat: function (bondKey, yld, calDate) {
            if (!bondKey || !yld || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: yld,
                item3: calDate
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcDirtyPriceMat",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //根据净价计算行权收益率
        calcYieldOpt: function (bondKey, cleanPrice, calDate, iscleanPrice) {
            if (!bondKey || !cleanPrice || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: cleanPrice,
                item3: calDate,
                item4: !!iscleanPrice
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcYieldOpt",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //根据行权收益率计算净价
        calcCleanPriceOpt: function (bondKey, yld, calDate) {
            if (!bondKey || !yld || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: yld,
                item3: calDate
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcCleanPriceOpt",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //根据行权收益率计算全价
        calcDirtyPriceOpt: function (bondKey, yld, calDate) {
            if (!bondKey || !yld || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: yld,
                item3: calDate
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcDirtyPriceOpt",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

        //计算百元应计利息
        calcAccuredInterest: function (bondKey, calDate, isDayEnd) {
            if (typeof isDayEnd === 'undefined') {
                isDayEnd = !Box.String.has(bondKey, "IB");
            }

            if (!bondKey || !(Box.isDate(calDate) || Box.isDateString(calDate))) {
                return null;
            }
            Box.isDate(calDate) && (calDate = Box.Format.renderDate(calDate));
            var da = {
                item1: bondKey,
                item2: calDate,
                item3: !!isDayEnd
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLBond/calcAccuredInterest",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },


        /*--计算回购-------------------------------------------*/

        //计算回购到期净价
        calcExpiredCleanPrice: function (outrepo, cleanPrice, iscleanPrice) {
            if (!outrepo || !cleanPrice) {
                return null;
            }
            var da = {
                item1: outrepo,
                item2: cleanPrice,
                item3: !!iscleanPrice
            };
            var result = 0;
            Box.Common.post({
                url: "api/QLOutrepo/calcExpiredCleanPrice",
                data: da,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        },

    };
})();
/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2016.10.09
 * 描    述：页面某个地方插入一个问号,鼠标浮动上去会弹出相应的提示
 示    例:
 Box.Questionreminder.show({
 message: '以下债券详情为选填',
 renderTo: this.el.bondDetails.find('.question')
 });
 * ======================================================================== */
Box.define('Box.Questionreminder', {
    extend: 'Box.Component',

    templates: {
        main: [
            '<a class=" k-button-icon k-state-border-down" data-role="tooltip"><i class="fa {icon}" style="color: darkorange;"></i></a>'

        ]
    },

    icon: 'fa-question-circle', // 图标(保持统一不要替换)

    message: '', //需要显示的提示信息

    width: 200,//宽度,
    height: null,//高度
    autoHide: true,//是否自动隐藏

    getMainTplData: function () {
        return {
            message: this.message,
            icon: this.icon
        };
    },

    setup: function () {
        // var me = this;

        this.el.target.kendoTooltip({
            filter: 'i',
            autoHide: this.autoHide,
            content: this.message,
            width: this.width,
            height: this.height,
        });
    },

}, function () {
    Box.Questionreminder.show = function (options) {
        var reminder = new Box.Questionreminder(options);
        return reminder;
    };
});

/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2016.10.08
 * 描    述：页面某个地方插入一段提示,点击关闭后,将保存到cookie里面,下次将不再显示
 示    例:
 Box.Reminder.show({
 renderTo: this.el.reminder,
 message: '以下债券详情为选填',
 name: 'HY.traderequest.excolrepo.excolrepo.reminder'//在整个系统里面必须是唯一的,否则可能出现显示不正常的问题
 });
 * ======================================================================== */
Box.define('Box.Reminder', {
    extend: 'Box.Component',

    templates: {
        main: [
            '<div>' +
            '<div class="info-showback "style="background-color: rgba(51,51,51,0.3); border: 1px solid rgba(51,51,51,0.425);color: #f8f8f8;">' +
            '<span class="matchinfo">' +
            '<i class="fa {icon} txt-color-orangeDark " style="font-size: 19px;display: inline-block;vertical-align: middle;"></i> ' +
            '<span class="matchlabel" style="margin-left: 5px; display: inline-block;vertical-align: middle;">{message}</span>' +
            '</span>' +
            '<i class="fa fa-times closeBtn" style="float: right;font-size: 19px;display: none;cursor: pointer; margin: 10px 3px 3px;" title="关闭后将不再显示"></i>' +
            '</div>' +
            '</div>'
        ]
    },

    elements: {
        info: '.info-showback',
        closeBtn: '.closeBtn'
    },

    events: {
        'mouseenter info': '_showcloseBtn',
        'mouseleave info': '_hidecloseBtn',
        'click closeBtn': '_closeReminder'
    },

    name: '', //在整个系统里面必须是唯一的,否则可能出现显示不正常的问题

    icon: 'fa-info-circle', // 图标

    message: '', //需要显示的提示信息

    getMainTplData: function () {
        return {
            message: this.message,
            icon: this.icon
        };
    },

    setup: function () {
        //从cookie里面读取配置,检查当前的提示是否是隐藏的
        this.reminderHideList = JSON.parse(Box.util.Cookie.get('reminderHideList')) || [];

        if (Box.Array.contains(this.reminderHideList, this.name)) {
            this.el.target.hide();
        }

    },

    _showcloseBtn: function () {
        this.el.closeBtn.show();
    },

    _hidecloseBtn: function () {
        this.el.closeBtn.hide();
    },

    _closeReminder: function () {
        this.el.target.slideUp();

        this.reminderHideList.push(this.name);
        //更新到cookie
        Box.util.Cookie.set('reminderHideList', JSON.stringify(this.reminderHideList));
    }

}, function () {
    Box.Reminder.show = function (options) {
        var reminder = new Box.Reminder(options);
        return reminder;
    };
});

/* ========================================================================
 * 作    者：牟攀
 * 创建日期：2015.6.8
 * 描    述：上传控件,基于dropzone (http://www.dropzonejs.com/)

 * ======================================================================== */

Box.define('Box.Upload', {
    extend: Box.Component,

    templates: {
        main: [
            '<div>' +
            '</div>'
        ],
        zone: [
            '<div class="dropzone-box file-upload-box">'+
            '<div class="dz-default dz-message">' +
            '<i class="fa fa-cloud-upload  k-info"></i>' +
            '拖拽文件到这里<br><span class="dz-text-small">或者点击手动选择文件上传</span>' +
            '</div>' +
            '</div>'
        ],

        simple: ['<a style="{style}" class="{clazz}"><span class="k-sprite fa fa-upload"></span>{text}</a>'],

        view: [
            '<div class="dz-preview dz-file-preview">' +
            '<div class="dz-details">' +
            '<div class="dz-filename"><span data-dz-name></span></div>' +
            '<div class="dz-size">文件大小: <span data-dz-size></span></div>' +
            '<div class="dz-thumbnail-wrapper">' +
            '<div class="dz-thumbnail">' +
            '<div class="dz-success-mark"><i class="fa fa-check-circle-o"></i></div>' +
            '<div class="dz-error-mark"><i class="fa fa-times-circle-o"></i></div>' +
            '<div class="dz-error-message"><span data-dz-errormessage></span></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="progress progress-striped active">' +
            '<div class="progress-bar progress-bar-primary" data-dz-uploadprogress></div>' +
            '</div>' +
            '</div>'
        ],
    },


    uploadUrl: null, //上传文件的url,不能为空

    uploadAcceptedFiles: null, //上传文件的类型  Eg.: image/*,application/pdf,.psd

    uploadAutoProcessQueue: true, //是否自动上传,如果为false,需要手动调用fnStartUpload()

    uploadMultiple: false, //是否在一个请求同时发送多个文件

    //uploadParamName: 'file',

    uploadMaxFilesize: 200, //允许上传的最大文件,单位MB

    uploadParams: {},

    simple: null,

    bindTo: null,

    _simpleDefault: {
        text: "选择文件",
        style: "",
        clazz: "k-button k-button-icontext"
    },

    simpleenable: false,

    setting: function () {
        this.upload_queue = new Box.util.HashMap();
    },

    _getFileId: function (file) {
        return file.id = file.name + "_" + +new Date;
    },

    _initFileUpload: function () {
        var options = {
            url: this.uploadUrl,
            //paramName: this.uploadParamName,
            params: this.uploadParams,
            maxFilesize: this.uploadMaxFilesize,
            addRemoveLinks: true,
            acceptedFiles: this.uploadAcceptedFiles,
            autoProcessQueue: this.uploadAutoProcessQueue,
            parallelUploads: 5, //同时上传的文件数
            uploadMultiple: this.uploadMultiple,
            dictFileTooBig: "文件大小({{filesize}}MB)超过最大限制:{{maxFilesize}}MB",
            dictInvalidFileType: "不支持上传的文件类型",
            dictResponseError: '文件内容格式不正确',
            dictCancelUploadConfirmation: '确定要取消上传这个文件吗?',
            dictMaxFilesExceeded: "超过最大上传文件数",
            dictRemoveFile: "删除此文件",
            dictCancelUpload: "取消上传",
            // error: function (e, errormessage) {
            //     console.log(errormessage);
            //     return 'error';
            // },
            beforeClick: this.beforeClick
        };

        var me = this;

        if (this.bindTo) {
            options = Box.apply(options, {
                previewTemplate: '<div id="preview-template" style="display: none;"></div>'
            });
            this.upload = new Dropzone($(this.bindTo)[0], options);

            $($(this.bindTo)[0]).find(">*").off("click").click(function (e) {
                me.upload.hiddenFileInput.click();
            });
            return this.upload;
        } else if (this.simpleenable) {
            options = Box.apply(options, {
                previewTemplate: '<div id="preview-template" style="display: none;"></div>'
            });
            var config = Box.apply({}, this.simple, this._simpleDefault);
            var simple = this.applyTemplate("simple", config);
            this.el.target.first().append(simple);
            this.upload = new Dropzone(simple[0], options);

            $(simple[0]).find(">*").off("click").click(function (e) {
                me.upload.hiddenFileInput.click();
            });
            return this.upload;
        } else {
            options = Box.apply(options, {
                previewTemplate: this.tpl.view.html
            });
            var zone = this.applyTemplate("zone");
            this.el.target.replaceWith(zone);
            return this.upload = new Dropzone(zone[0], options);
        }
    },
    _must: function () {
        this.upload.hiddenFileInput.click();
    },
    setup: function () {
        var me = this;
        this.upload = this._initFileUpload();
        this.upload.on("addedfile", function (file) {
            me.trigger('addedfile', file);
            if (Box.isFunction(me.addedfile)) {
                me.addedfile.call(me, file);
            }
            me.upload_queue.push(me._getFileId(file), file);
        });
        this.upload.on('removedfile', function (file) {
            me.trigger('removedfile', file);
            if (Box.isFunction(me.removedfile)) {
                me.removedfile.call(me, file);
            }
            me.upload_queue.removeAtKey(file.id);
            if (!me.upload_queue.getCount()) {
                me.trigger('fileEmpty', me);
                if (Box.isFunction(me.fileEmpty)) {
                    me.fileEmpty.call(me);
                }
            }
        });
        this.upload.on('complete', function (file) {
            me.upload_queue.get(file.id).uploaded = true;
            if (me._checkAllFileLoaded()) {
                me.trigger('complete', me.upload_queue);
                if (Box.isFunction(me.complete)) {
                    me.complete.call(me, me.upload_queue);
                }
            }
        });

        this.upload.on('sending', function (file, xhr, formData) { //有一些额外的参数,需要动态赋值的可以这个方法放在formData里面  可以参考HY.durationmgr.assetmgr.financial.financialgrid
            me.trigger('sending', file, xhr, formData);
            if (Box.isFunction(me.sending)) {
                me.sending.call(me, file, xhr, formData);
            }
        });

        this.upload.on('success', function (file, response) {
            /*判断正确后显示对应提示*/
            if (typeof response == "string") {
                if (JSON.parse(response).IsSuccess == true) {
                    me.trigger('success', file, response);
                } else {
                    me.trigger('error', file, response);
                }
            } else {
                if (response.IsSuccess == true) {
                    me.trigger('success', file, response);
                } else {
                    me.trigger('error', file, response);
                }
            }
            if (Box.isFunction(me.success)) {
                me.success.call(me, file, response);
            }
        });

        this.upload.on('successmultiple', function (file, response) {
            me.trigger('successmultiple', file, response);

            if (Box.isFunction(me.successmultiple)) {
                me.successmultiple.call(me, file, response);
            }
        });

        this.upload.on('queuecomplete', function () {
            me.trigger('queuecomplete');
            if (Box.isFunction(me.queuecomplete)) {
                me.queuecomplete.call(me);
            }
        });
        this.upload.on('error', function (file, errorMessage) {
            me.trigger('error', file, errorMessage);
            if (Box.isFunction(me.error)) {
                me.error.call(me, file, errorMessage);
            }
        });
    },

    //以下是支持的事件
    addedfile: Box.emptyFn,
    removedfile: Box.emptyFn,
    fileEmpty: Box.emptyFn,
    complete: Box.emptyFn,
    sending: Box.emptyFn,
    success: Box.emptyFn,
    successmultiple: Box.emptyFn,
    queuecomplete: Box.emptyFn,
    error: Box.emptyFn,


    _checkAllFileLoaded: function () {
        var allLoaded = true;
        this.upload_queue.each(function (id, file) {
            if (!file.uploaded) {
                allLoaded = false;
                return false;
            }
        });
        return allLoaded;
    },

    //获取当前上传的文件队列
    fnGetUploadFiles: function () {
        return this.upload_queue.values();
    },

    //移除所有队列的文件
    fnRemoveAllFiles: function () {
        this.upload.removeAllFiles();
    },

    //开始上传
    fnStartUpload: function () {
        return this.upload.processQueue();
    }
});

/* ========================================================================
 * 作    者：李朋珍
 * 创建日期：2015.6.9
 * 描    述：封装的kendoUI的Validator,验证表单
 * ======================================================================== */
Box.define('Box.Validator', (function () {

    function getInputName(input) {
        return input.data("vld-name") || "元素";
    }

    function getInputTargetName(input, target) {
        return input.data("vld-" + target + "-name") || "元素";
    }

    function getMessage(input, type) {
        return input.data("vld-" + type + "-msg");
    }

    return {
        extend: 'Box.Component',

        statics: {
            //默认规则
            DEFAULT_RULES: {
                required: function (input) {
                    var required = input.attr("required");
                    if (!required) {
                        return true;
                    }
                    var val = input.val();
                    return Box.String.trim(val) != "";
                },
                regex: function (input) {
                    var val = input.val();
                    if (val == "")
                        return true;
                    var regex = eval(input.attr("data-vld-regex"));
                    var regType = input.data("vld-regex-type");
                    if (regType) {
                        regex = eval("Box.RegExp." + regType);
                    }
                    if (!regex) {
                        return true;
                    }
                    return regex.test(val);
                },
                minlength: function (input) {
                    var minlength = input.data("vld-minlength");
                    if (!minlength) {
                        return true;
                    }
                    var val = input.val();
                    return val.length >= minlength;
                },
                maxlength: function (input) {
                    var maxlength = input.data("vld-maxlength");
                    if (!maxlength) {
                        return true;
                    }
                    var val = input.val();
                    return val.length <= maxlength;
                },
                compare: function (input) {
                    var compareTarget = input.data("vld-compare");
                    if (!compareTarget) {
                        return true;
                    }
                    var target = this.element.find(compareTarget);
                    if (target.length != 1) {
                        return true;
                    }
                    var val1 = target.val();
                    var val2 = input.val();
                    return val1 == val2;
                },
                nocompare: function (input) {
                    var compareTarget = input.data("vld-nocompare");
                    if (!compareTarget) {
                        return true;
                    }
                    var target = this.element.find(compareTarget);
                    if (target.length != 1) {
                        return true;
                    }
                    var val1 = target.val();
                    var val2 = input.val();
                    return val1 != val2;
                },
                range: function (input) {
                    var range = input.attr("data-vld-range");
                    if (!range) {
                        return true;
                    }
                    var val = input.val();
                    var vldmin = true, vldmax = true;
                    var min = range.replace(/[^\.,\d]/g, '').replace(/,\d*/g, '');
                    if (min) {
                        var includeMin = range.match(/^./) == '[';
                        var expMin = '' + val + (includeMin ? '>=' : '>') + min + '';
                        vldmin = eval(expMin);
                    }
                    if (vldmin) {
                        var max = range.replace(/[^\.,\d]/g, '').replace(/\d*,/g, '');
                        if (max) {
                            var includeMax = range.match(/.$/) == ']';
                            var expMax = '' + val + (includeMax ? '<=' : '<') + max + '';
                            vldmax = eval(expMax);
                        }
                    }
                    return vldmin && vldmax;
                }
            },
            //默认消息
            DEFAULT_MESSAGES: {
                required: function (input) {
                    return getMessage(input, "required") || (getInputName(input) + "不能为空");
                },
                regex: function (input) {
                    return getMessage(input, "regex") || (getInputName(input) + "格式不正确");
                },
                minlength: function (input) {
                    return getMessage(input, "minlength") || (getInputName(input) + "长度不够");
                },
                maxlength: function (input) {
                    return getMessage(input, "maxlength") || (getInputName(input) + "超过最大长度");
                },
                compare: function (input) {
                    return getMessage(input, "compare") || (getInputName(input) + "与" + (getInputTargetName(input, "compare") || "目标") + "不一致");
                },
                nocompare: function (input) {
                    return getMessage(input, "nocompare") || (getInputName(input) + "不能与" + (getInputTargetName(input, "nocompare") || "目标") + "一致");
                },
                range: function (input) {
                    return getMessage(input, "range") || (getInputName(input) + "范围不正确");
                }
            },
        },

        target: null,

        inner: null,

        rules: null,

        messages: null,

        showTooltip: true,

        validateOnBlur: true,

        shown: false,

        //errorTemplate: '<div class="k-widget k-tooltip k-tooltip-validation"' +
        //      'style="margin:0 5px;display:inline-block;color:red;position: fixed;"><span class="txt-color-red2 fa fa-info-circle"> </span>' +
        //      '#=message#<div class="k-callout k-callout-w" style="top:5px"></div></div>',

        errorTemplate: '<span class="hide txt-color-yellow fa fa-info-circle">#=message# </span>',

        _onValitade: function (e) {
            this.shown = false;

            if (!e.valid) {
                var input = this.inner.element.find(".k-invalid:first");
                //input.focus();

                if (this.showTooltip)
                    if (!input.is("[data-role=datepicker],[data-role=autocomplete],[data-role=combobox],[data-role=dropdownlist],[data-role=numerictextbox]")) {
                        this.shown = true;
                        this.tooltip.show(input);
                    }
            }

            this.onValitade.call(this, e);
        },

        onValitade: Box.emptyFn,

        fnGetErrors: function () {
            return this.inner.errors();
        },

        fnRefresh: function () {
            this.fnHideMessages();
            this.reRender();
        },

        fnHideMessages: function () {
            this.inner.element.find(".k-invalid").removeClass("k-invalid");
            this.inner.hideMessages();
        },

        fnValidInput: function (input) {
            return this.inner.validateInput(input);
        },

        fnValidate: function () {
            return this.inner.validate();
        },

        setup: function () {
            var me = this;
            var statics = this.statics();
            var target = $(this.target);
            this.inner = target.kendoValidator({
                rules: Box.apply({}, this.rules, statics.DEFAULT_RULES),
                messages: Box.apply({}, this.messages, statics.DEFAULT_MESSAGES),
                validateOnBlur: false,
                errorTemplate: this.errorTemplate,
                validate: function (e) {
                    me._onValitade(e);
                }
            }).data("kendoValidator");

            if (this.showTooltip) {
                this.tooltip = target.kendoTooltip({
                    filter: ".k-invalid[outer]",
                    width: "auto",
                    content: function (e) {
                        var name = e.target.attr("name") || e.target.closest(".k-widget").find(".k-invalid:input").attr("name");
                        var errorMessage = target.find("[data-for=" + name + "]");
                        var msg = errorMessage.text() || "填写错误";
                        return '<span class="txt-color-yellow nowrap"><span class="fa fa-info-circle"> </span> ' + msg + '</span> ';
                    },
                    show: function () {
                        this.refresh();
                    }
                }).data("kendoTooltip");
            }

            var input = this.inner.element.find(":input:not(:button,[type=submit],[type=reset],[disabled],[readonly])");

            if (this.validateOnBlur) {
                input.blur(function () {
                    if (target.is(":visible")) {
                        var flag = me.inner.validateInput($(this));
                        if (!flag && me.showTooltip) {
                            me._onValitade(me.inner);
                        }
                    }
                });
            }
            //input = input.filter("[required],[data-vld-regex],[data-vld-regex-type],[data-vld-minlength],[data-vld-compare],[data-vld-range]");
            var elements = input.filter("[data-role=datepicker],[data-role=autocomplete],[data-role=combobox],[data-role=dropdownlist],[data-role=numerictextbox],[data-role=dropdownselect]");
            input.not(elements).attr("outer", true);

            if (elements.length) {
                //correct mutation event detection
                var hasMutationEvents = ("MutationEvent" in window),
                    mutationObserver = window.WebKitMutationObserver || window.MutationObserver;

                if (mutationObserver) {
                    var observer = new mutationObserver(function (mutations) {
                            var idx = 0,
                                mutation,
                                length = mutations.length;

                            for (; idx < length; idx++) {
                                mutation = mutations[idx];
                                if (mutation.attributeName === "class") {
                                    updateCssOnPropertyChange(mutation);
                                }
                            }
                        }),
                        config = {attributes: true, childList: false, characterData: false};

                    elements.each(function () {
                        observer.observe(this, config);
                    });
                } else if (hasMutationEvents) {
                    elements.bind("DOMAttrModified", updateCssOnPropertyChange);
                } else {
                    elements.each(function () {
                        this.attachEvent("onpropertychange", updateCssOnPropertyChange);
                    });
                }

                function updateCssOnPropertyChange(e) {
                    var element = $(e.target || e.srcElement);

                    var invalid = element.closest("span.k-autocomplete")
                        .add(element.prev("span.k-dropdown-wrap"))
                        .add(element.closest("span.k-numeric-wrap"))
                        .add(element.closest("span.k-numeric-wrap"))
                        .add(element.closest("span.k-picker-wrap"));

                    if (invalid.length) {
                        invalid.toggleClass("k-invalid", element.hasClass("k-invalid"));
                        invalid.attr("outer", true);
                        if (invalid.length && element.hasClass("k-invalid") && !me.shown) {
                            me.shown = true;
                            if (me.showTooltip)
                                me.tooltip.show(invalid);
                        }
                    }
                }
            }
        }
    };
})());
