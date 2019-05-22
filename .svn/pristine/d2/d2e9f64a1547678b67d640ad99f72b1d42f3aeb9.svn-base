Box.define('Box.app.Store', {

    extend: Box.util.HashMap,

    singleton: true,

    get: function (key, name) {
        if (arguments.length == 1) {
            return this.callParent(arguments)
        }
        var value = this.map[key];
        if (Box.isEmpty(value)) {
            return undefined
        }
        return value[name]
    },

    set: function (key, name, value) {
        if (arguments.length < 3) {
            return this.callParent(arguments)
        }
        this.map[key] = this.map[key] || {};
        return this.map[key][name] = value
    }

});