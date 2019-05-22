Box.define('API.Viewport', {

    requires: [
        //'API.Config',
        'API.BodyView',
        'Box.dom.Helper',
        'Box.Element'
    ],

    extend: 'Box.app.Viewport',

    target: document.body,

    config: {

        dir: null,

        title: null,

        desc: null

    },

    routes: {

        ':dir_name': 'parseDir',

        ':dir_name/:children_name': 'parseChildrenDir'

    },

    elements: {

        header_body: 'ul.amz-header-nav',

        header_items: 'header_body@li',

        banner: '#amz-banner',

        banner_title: 'banner@h1',

        banner_desc: 'banner@p',

        main: '#amz-main',

        go_top: '#amz-go-top'

    },

    events: {

        'click go_top': 'goTop'

    },

    templates: {

        header_item: 'template_header_item'

    },

    setting: function () {

        API.Config = Box.requireSync('json!config.json');

    },

    initHeader: function () {
        var items = this.applyTemplate('header_item', API.Config.header_items);
        this.el.header_body.html(items);
        this.element('header_items', items);
    },

    setup: function () {
        this.initHeader();

        if (window.location.hash == '') {//默认跳转到主页
            location.href = "#index";
        }
    },

    // 当主目录发生变化会触发该路由解析器
    parseDir: function (dir) {
        this.setDir(dir);
        var info = API.Config.body_items[dir], childrens;
        if (info && !Box.isEmpty(childrens = info.children)) {
            var first;
            Box.Array.each(childrens, function (item) {
                if (item.path) {
                    first = item;
                    return false;
                }
            });
            if (first) {
                Box.app.History.navigate('#/' + dir + '/' + first.name);
            }
        }
    },

    // 当次目录发生变化会触发该路由解析器
    parseChildrenDir: function (dir, children_name) {
        this.setDir(dir);
        if (!this.bodyView) {
            return;
        }
        this.bodyView.activeChildrenItem(children_name);
    },

    loadBodyView: function (config, dir) {
        this.el.main.empty();
        if (!Box.isEmpty(this.bodyView)) {
            this.bodyView.destroy();
        }
        this.bodyView = Box.create('API.BodyView', {
            dir: dir,
            path: config.path,
            childrens: config.children,
            renderTo: this.el.main,
            listeners: {
                'active': this.goTop
            }
        });
    },

    goTop: function () {
        $('body,html').animate({scrollTop: 0}, 250);
    },

    updateDir: function (dir) {
        var item = this.el.header_items.filter('[data-name=' + dir + ']');
        item.addClass('am-active').siblings().removeClass();

        var config = API.Config.body_items[dir];
        this.setTitle(config.title);
        this.setDesc(config.desc);
        this.loadBodyView(config, dir);
    },

    updateTitle: function (title) {
        this.el.banner_title.text(title);
    },

    updateDesc: function (desc) {
        this.el.banner_desc.text(desc);
    }


});