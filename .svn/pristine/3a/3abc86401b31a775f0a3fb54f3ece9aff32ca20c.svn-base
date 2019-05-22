Box.define('Box.app.View', {

    requires: [Box.tpl.Template],

    attrs: {

        html: null,

        data: null,

        change: false,

        scope: null

    },

    constructor: function (config) {
        this.callParent(arguments);
        this.tpl = Box.create('Box.tpl.Template', {
            html: this.get('html'),
            disableFormats: false,
            scope: this.get('scope')
        })
    },

    apply: function (data) {
        if (Box.isEmpty(data)) {
            data = this.get('data')
        } else {
            this.set('data', data, {
                silent: true
            })
        }
        var dom = Box.query(this.tpl.apply(data));
        if (!Box.isEmpty(this.dom)) {
            this.dom.replaceWith(dom)
        }
        return this.dom = dom;
    },

    _onChangeData: function (data) {
        this.get('change') && this.apply(data)
    }

});
