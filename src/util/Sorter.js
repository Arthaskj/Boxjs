Box.define('Box.util.Sorter', {

    mixins: {
        event: Box.util.Event
    },

    property: null,

    sorterFn: null,

    root: null,

    transform: null,

    direction: "ASC",

    constructor: function (config) {
        Box.apply(this, config);
        if (Box.isEmpty(this.property) && Box.isEmpty(this.sorterFn)) {
            Box.Error("A Sorter requires either a property or a sorter function");
        }
        this.mixins.event.constructor.call(this, config);
        this.updateSortFunction();
    },

    createSortFunction: function (sorterFn) {
        var me = this,
            property = me.property,
            direction = me.direction || "ASC",
            modifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        return function (o1, o2) {
            return modifier * sorterFn.call(me, o1, o2);
        };
    },

    defaultSorterFn: function (o1, o2) {
        var me = this,
            transform = me.transform,
            v1 = me.getRoot(o1)[me.property],
            v2 = me.getRoot(o2)[me.property];

        if (transform) {
            v1 = transform(v1);
            v2 = transform(v2);
        }

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    },

    getRoot: function (item) {
        return Box.isEmpty(this.root) ? item : item[this.root];
    },

    setDirection: function (direction) {
        var me = this;
        me.direction = direction ? direction.toUpperCase() : direction;
        me.updateSortFunction();
    },

    toggle: function () {
        var me = this;
        me.direction = Box.String.toggle(me.direction, "ASC", "DESC");
        me.updateSortFunction();
    },

    updateSortFunction: function (fn) {
        var me = this;
        fn = fn || me.sorterFn || me.defaultSorterFn;
        me.sort = me.createSortFunction(fn);
    }

});