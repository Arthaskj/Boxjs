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