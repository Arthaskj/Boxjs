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

    removeAtKey: function(key) {
        if (this.containsKey(key)) {
            var value = this.map[key];
            delete this.map[key];
            --this.length;
            this.trigger('remove', this, key, value);
            return true;
        }
        return false;
    },

    containsKey: function(key) {
        return this.map[key] !== undefined;
    },

    contains: function(value) {
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