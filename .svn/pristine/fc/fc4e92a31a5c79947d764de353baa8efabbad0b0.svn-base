Box.define('Box.util.MixedCollection', {

    requires: [Box.util.Filter],

    mixins: {
        sortable: Box.util.Sortable
    },

    extend: Box.util.AbstractMixedCollection,

    constructor: function () {
        this.callParent(arguments);
        this.initSortable()
    },

    doSort: function (sorterFn) {
        this.sortBy(sorterFn)
    },

    _sort: function (property, dir, fn) {
        var dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1,
            keys = this.keys,
            items = this.items,
            c = [],
            i, len;

        fn = fn || function (a, b) {
            return a - b;
        };

        for (i = 0, len = items.length; i < len; i++) {
            c[c.length] = {
                key: keys[i],
                value: items[i],
                index: i
            };
        }

        Box.Array.sort(c, function (a, b) {
            var v = fn(a[property], b[property]) * dsc;
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        for (i = 0, len = c.length; i < len; i++) {
            items[i] = c[i].value;
            keys[i] = c[i].key;
        }

        this.trigger('sort', this);
    },

    sortBy: function (sorterFn, scope) {
        var items = this.items,
            keys = this.keys,
            length = items.length,
            temp = [],
            i;

        for (i = 0; i < length; i++) {
            temp[i] = {
                key: keys[i],
                value: items[i],
                index: i
            };
        }

        Box.Array.sort(temp, function (a, b) {
            var v = sorterFn.call(scope || this, a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }

            return v;
        }, this);

        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i] = temp[i].key;
        }

        this.trigger('sort', this, items, keys);
    },

    findInsertionIndex: function (newItem, sorterFn) {
        var items = this.items,
            start = 0,
            end = items.length - 1,
            middle,
            comparison;

        if (!sorterFn) {
            sorterFn = this.generateComparator();
        }
        while (start <= end) {
            middle = (start + end) >> 1;
            comparison = sorterFn(newItem, items[middle]);
            if (comparison >= 0) {
                start = middle + 1;
            } else if (comparison < 0) {
                end = middle - 1;
            }
        }
        return start;
    },

    reorder: function (mapping) {
        var items = this.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        //todo suspendEvents

        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }
        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }
        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        this.clear();
        this.addAll(order);

        //todo resumeEvents
        this.trigger('sort', this);
    },

    sortByKey: function (dir, fn, scope) {
        if (Box.isFunction(dir)) {
            fn = dir;
            dir = "ASC";
        }
        this._sort('key', dir, Box.Function.bind(fn || function (a, b) {
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        }, scope || this));
    }

});