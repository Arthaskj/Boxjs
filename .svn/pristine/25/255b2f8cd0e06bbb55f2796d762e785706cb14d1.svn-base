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