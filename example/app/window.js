/**
 * Created by haiyi on 2015/3/30.
 */
Box.define('App.Window', {

    extend: 'Box.Component',

    statics: {
        WINDOW_Z_INDEX: 2010,

        MAX_WINDOW_Z_INDEX: 99999,

        PREFIX_FOR_WINDOW: 'window_name_',

        WINDOW_TEMPLATE_URL: '/views/html/template',

        TEMPLATE_TO_GET_OPTIONS: [
            'title', 'icon', 'toggleable', 'closeable', 'refreshable', 'buttons'
        ],

        DEFAULT_BUTTON_CONFIG: {
            name: Box.emptyString,
            title: "按钮",
            icon: Box.emptyString,
            theme: "btn-default",
            disable: false,
            handler: Box.emptyString,
            display: 'inline-block'
        },

        WINDOW_LAYER: null,

        modalZIndex: {},

        registerModalZIndex: function (window) {
            this.modalZIndex[window.get('name')] = window.get('zIndex')
        },

        removeModalZIndex: function (window) {
            delete this.modalZIndex[window.get('name')];
            this.modalZIndex[window.get('name')] = null;
        },

        getMaxModalZIndex: function () {
            var max = 0;
            lang.Object.each(this.modalZIndex, function (name, zindex) {
                if (!max || max < zindex) {
                    max = zindex;
                }
            });
            return max
        }
    },

    config: {
        manual_close_loader: false,

        cls: 'window',

        icon: null,

        title: null,

        x: null,

        y: null,

        xy: {
            getter: function () {
                return [this.get('x'), this.get('y')]
            },
            setter: function (value) {
                this.set('x', value[0]);
                this.set('y', value[1])
            }
        },

        width: 500,

        height: 400,

        size: {
            getter: function () {
                return [this.get('width'), this.get('height')]
            },
            setter: function (value) {
                this.set('width', value[0]);
                this.set('height', value[1])
            }
        },

        body_padding: 10,

        zIndex: 2000,

        toggleable: true,

        closeable: true,

        refreshable: false,

        draggable: true,

        resizable: true,

        topable: true,

        closeAction: 'hide',

        modal: true,

        maxed: false,

        autoRender: false,

        url: null,

        buttons: []
    },

    elements: {
        header: '>.header',
        title: 'header@span.title',
        content: '>.content',
        body: 'content@.inner',
        footer: '>.footer',
        tools: 'ul.tools',
        toggleBtn: 'tools@li.toggle',
        closeBtn: 'tools@li.close',
        refreshBtn: 'tools@li.refresh',
        loader: '.loader'
    },
//{
//    el: 'header',
//        type: 'dblclick',
//    handler: 'toggle'
//},
//{
//    el: 'toggleBtn',
//        handler: 'toggle'
//},
//{
//    el: 'closeBtn',
//        handler: 'cancel'
//},
//{
//    el: 'refreshBtn',
//        handler: 'refresh'
//},
//{
//    auto: false,
//        handler: 'buttonClick'
//}
    events: {
        'dbclick header': 'toggle',
        'click toggleBtn': 'toggle',
        'click closeBtn': 'cancel',
        'click refreshBtn': 'refresh'
    },

    templates: 'window.html',

    delegates: {

    },

    setup: function () {

        this.hasTitle = !Box.isEmpty(this.title);

        this.hasButton = !Box.isEmpty(this.buttons);

        var centerXy = this.getCenterXY();

        if (Box.isEmpty(this.x)) {
            this.setX(centerXy.x);
        }

        if (Box.isEmpty(this.y)) {
            this.setY(centerXy.y);
        }

        this.setZIndex(++App.Window.WINDOW_Z_INDEX);

    },

    getCenterXY: function () {
        var body = $(document.body);
        return {
            x: (body.width() - parseInt(this.width)) / 2,
            y: (body.height() - parseInt(this.height)) / 2
        }
    },


    open: function () {
        if (this.isDestroyed) {
            throw new Error('window is destroyed')
        }
        if (!this.rendered) {
            this.render();
            return;
        }
        if (this.isHidden) {
            this.show()
        }
    },

    getMainTplData: function () {
        var config = {
            cls: this.cls,
            body_padding: this.body_padding
        };
        Box.Array.forEach(App.Window.TEMPLATE_TO_GET_OPTIONS, function (name) {
            config[name] = this[name];
        }, this);
        return Box.apply({}, config);
    },

    applyX: function (value) {
        this.el.target.css('left', value)
    },

    applyY: function (value) {
        this.el.target.css('top', value)
    },

    applyWidth: function (value) {
        this.el.target.width(value);
        Box.isFunction(this.resize) && this.resize()
    },

    applyHeight: function (value) {
        var otherHeight = (this.hasTitle ? this.el.header.outerHeight() : 0)
            + (this.hasButton ? this.el.footer.outerHeight() : 0);

        this.el.content.innerHeight(value - otherHeight);
        this.el.target.innerHeight(value);
        Box.isFunction(this.resize) && this.resize()
    },

    applyZIndex: function (zindex) {
        this.el.target.css('z-index', zindex)
    },

    applyTitle: function (title) {
        this.el.title.html(title)
    }
});