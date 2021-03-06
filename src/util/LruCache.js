Box.define('Box.util.LruCache', {

    extend: Box.util.HashMap,

    maxSize: null,

    constructor: function (config) {
        Box.apply(this, config);
        this.callParent([config]);
    },

    add: function (key, newValue) {
        var me = this,
            existingKey = me.findKey(newValue),
            entry;

        if (existingKey) {
            me.unlinkEntry(entry = me.map[existingKey]);
            entry.prev = me.last;
            entry.next = null;
        } else {
            entry = {
                prev: me.last,
                next: null,
                key: key,
                value: newValue
            };
        }

        if (me.last) {
            me.last.next = entry;
        } else {
            me.first = entry;
        }
        me.last = entry;
        me.callParent([key, entry]);
        me.prune();
        return newValue;
    },

    insertBefore: function (key, newValue, sibling) {
        var me = this,
            existingKey,
            entry;

        if (sibling = this.map[this.findKey(sibling)]) {
            existingKey = me.findKey(newValue);

            if (existingKey) {
                me.unlinkEntry(entry = me.map[existingKey]);
            } else {
                entry = {
                    prev: sibling.prev,
                    next: sibling,
                    key: key,
                    value: newValue
                };
            }

            if (sibling.prev) {
                entry.prev.next = entry;
            } else {
                me.first = entry;
            }
            entry.next = sibling;
            sibling.prev = entry;
            me.prune();
            return newValue;
        } else {
            return me.add(key, newValue);
        }
    },

    get: function (key) {
        var entry = this.map[key];
        if (entry) {
            if (entry.next) {
                this.moveToEnd(entry);
            }
            return entry.value;
        }
    },

    removeAtKey: function (key) {
        this.unlinkEntry(this.map[key]);
        return this.callParent(arguments);
    },

    clear: function (initial) {
        this.first = this.last = null;
        return this.callParent(arguments);
    },

    unlinkEntry: function (entry) {
        if (entry) {
            if (entry.next) {
                entry.next.prev = entry.prev;
            } else {
                this.last = entry.prev;
            }
            if (entry.prev) {
                entry.prev.next = entry.next;
            } else {
                this.first = entry.next;
            }
            entry.prev = entry.next = null;
        }
    },

    moveToEnd: function (entry) {
        this.unlinkEntry(entry);
        if (entry.prev = this.last) {
            this.last.next = entry;
        } else {
            this.first = entry;
        }
        this.last = entry;
    },

    getArray: function (isKey) {
        var arr = [],
            entry = this.first;

        while (entry) {
            arr.push(isKey ? entry.key : entry.value);
            entry = entry.next;
        }
        return arr;
    },

    each: function (fn, scope, reverse) {
        var me = this,
            entry = reverse ? me.last : me.first,
            length = me.length;

        scope = scope || me;
        while (entry) {
            if (fn.call(scope, entry.key, entry.value, length) === false) {
                break;
            }
            entry = reverse ? entry.prev : entry.next;
        }
        return me;
    },

    findKey: function (value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key].value === value) {
                return key;
            }
        }
        return undefined;
    },

    clone: function () {
        var newCache = new this.self(this.initialConfig),
            map = this.map,
            key;

        newCache.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                newCache.add(key, map[key].value);
            }
        }
        newCache.resumeEvents();
        return newCache;
    },

    prune: function () {
        var me = this,
            purgeCount = me.maxSize ? (me.length - me.maxSize) : 0;

        if (purgeCount > 0) {
            for (; me.first && purgeCount; purgeCount--) {
                me.removeAtKey(me.first.key);
            }
        }
    }
});