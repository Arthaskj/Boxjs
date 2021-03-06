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