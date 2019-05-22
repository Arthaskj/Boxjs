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

    indexOfKey : function(key) {
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
        } else if (Box.isArray(property) || property instanceof  Box.util.Filter) {
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