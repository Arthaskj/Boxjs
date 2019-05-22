Box.define('Box.util.Filter', {

    mixins: {
        event: Box.util.Event
    },

    statics: {

        createFilterFn: function (filters) {
            return filters && filters.length ? function (candidate) {
                var isMatch = true,
                    length = filters.length,
                    i, filter;

                for (i = 0; isMatch && i < length; i++) {
                    filter = filters[i];
                    if (!filter.disabled) {
                        isMatch = isMatch && filter.filterFn.call(filter.scope || filter, candidate);
                    }
                }
                return isMatch;
            } : function () {
                return true;
            };
        }

    },

    anyMatch: false,

    exactMatch: false,

    caseSensitive: false,

    root: null,

    filterFn: null,

    property: null,

    value: null,

    // < <= = >= > !=
    operator: null,

    operatorFns: {
        "<": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) < this.value;
        },
        "<=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) <= this.value;
        },
        "=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) == this.value;
        },
        "==": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) == this.value;
        },
        ">=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) >= this.value;
        },
        ">": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) > this.value;
        },
        "!=": function (candidate) {
            return Box.coerce(this.getRoot(candidate)[this.property], this.value) != this.value;
        }
    },

    constructor: function (config) {
        this.initialConfig = config;
        Box.apply(this, config);
        this.mixins.event.constructor.call(this, config);
        this.filter = this.filter || this.filterFn;
        if (Box.isEmpty(this.filter)) {
            this.setValue(config.value);
        }
    },

    setValue: function (value) {
        this.value = value;
        if (this.property === undefined || this.value === undefined) {

        } else {
            this.filter = this.createFilterFn();
        }
        this.filterFn = this.filter;
    },

    setFilterFn: function (filterFn) {
        this.filterFn = this.filter = filterFn;
    },

    createFilterFn: function () {
        var me = this, matcher = this._createValueMatcher(),
            property = this.property;

        if (this.operator) {
            return this.operatorFns[this.operator];
        } else {
            return function (item) {
                var value = me.getRoot.call(me, item)[property];
                return matcher === null ? value === null : matcher.test(value);
            };
        }
    },

    getRoot: function (item) {
        var root = this.root;
        return Box.isEmpty(root) ? item : item[root];
    },

    _createValueMatcher: function () {
        var value = this.value,
            anyMatch = this.anyMatch,
            exactMatch = this.exactMatch,
            caseSensitive = this.caseSensitive,
            escapeRe = Box.String.escapeRegex;

        if (value === null) {
            return value;
        }

        if (!value.exec) {
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
        }

        return value;
    },

    serialize: function () {
        var result = Box.apply({}, this.initialConfig);
        result.value = this.value;
        return result;
    }

});