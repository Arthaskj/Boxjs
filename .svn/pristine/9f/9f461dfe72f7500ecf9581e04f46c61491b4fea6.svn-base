Box.define("Box.util.Sortable", {

    isSortable: true,

    defaultSortDirection: "ASC",

    requires: [
        Box.util.Sorter,
        Box.util.AbstractMixedCollection
    ],

    sortRoot: null,

    initSortable: function () {
        var sorters = this.sorters;

        this.sorters = new Box.util.AbstractMixedCollection(false, function (item) {
            return item.id || item.property;
        });

        if (sorters) {
            this.sorters.addAll(this.decodeSorters(sorters));
        }
    },

    sort: function (sorters, direction, where, doSort) {
        var me = this,
            sorter, sorterFn,
            newSorters;

        if (Box.isArray(sorters)) {
            doSort = where;
            where = direction;
            newSorters = sorters;
        } else if (Box.isObject(sorters)) {
            doSort = where;
            where = direction;
            newSorters = [sorters];
        } else if (Box.isString(sorters)) {
            sorter = me.sorters.get(sorters);

            if (!sorter) {
                sorter = {
                    property: sorters,
                    direction: direction
                };
                newSorters = [sorter];
            } else if (direction === undefined) {
                sorter.toggle();
            } else {
                sorter.setDirection(direction);
            }
        }

        if (newSorters && newSorters.length) {
            newSorters = me.decodeSorters(newSorters);
            if (Box.isString(where)) {
                if (where === 'prepend') {
                    sorters = me.sorters.clone().items;

                    me.sorters.clear();
                    me.sorters.addAll(newSorters);
                    me.sorters.addAll(sorters);
                }
                else {
                    me.sorters.addAll(newSorters);
                }
            }
            else {
                me.sorters.clear();
                me.sorters.addAll(newSorters);
            }
        }

        if (doSort !== false) {
            me.onBeforeSort(newSorters);

            sorters = me.sorters.items;
            if (sorters.length) {
                me.doSort(me.generateComparator());
            }
        }

        return sorters;
    },

    generateComparator: function () {
        var sorters = this.sorters.getRange();
        return sorters.length ? this.createComparator(sorters) : this.emptyComparator;
    },

    createComparator: function (sorters) {
        return function (r1, r2) {
            var result = sorters[0].sort(r1, r2),
                length = sorters.length,
                i = 1;

            for (; i < length; i++) {
                result = result || sorters[i].sort.call(this, r1, r2);
            }
            return result;
        };
    },

    emptyComparator: function () {
        return 0;
    },

    onBeforeSort: Box.emptyFn,

    decodeSorters: function (sorters) {
        if (!Box.isArray(sorters)) {
            if (sorters === undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Box.util.Sorter,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Box.isString(config)) {
                    config = {
                        property: config
                    };
                }

                Box.applyIf(config, {
                    root: this.sortRoot,
                    direction: "ASC"
                });

                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                sorters[i] = new Box.util.Sorter(config);
            }
        }

        return sorters;
    },

    getSorters: function () {
        return this.sorters.items;
    },

    getFirstSorter: function () {
        var sorters = this.sorters.items,
            len = sorters.length,
            i = 0,
            sorter;

        for (; i < len; ++i) {
            sorter = sorters[i];
            return sorter;
        }
        return null;
    }
});