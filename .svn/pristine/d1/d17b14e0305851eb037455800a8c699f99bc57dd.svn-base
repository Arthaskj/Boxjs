Box.define('App.Tab', {

    extend: 'Box.app.Viewport',

    requires: [
        'App.Test'
    ],

    elements: {

        header: 'ul.am-tabs-nav',

        header_item: 'header@li',

        body: '.am-tabs-bd',

        body_item: 'body@.am-tab-panel',

        todo: '#todo'

    },

    events: {

        'click botton {button}': '_addTabItem',

        'click header_item': '_activeTab'

    },

    templates: {

        item: ['<li><a href="javascript:void(0);">{title}</a></li>'],

        body: ['<div class="am-tab-panel am-active">{content}</div>']

    },

    setup: function () {
        var test = new App.test({
            renderTo: this.el.todo
        });
    },

    add: function (title, content) {
        var item = this.applyTemplate('item', { title: title });
        var body = this.applyTemplate('body', { content: content });
        this.element('header_item', item);
        this.element('body_item', body);
        this.el.header.append(item);
        this.el.body.append(body);
    },

    remove: function (index) {
        this.el.header_item.eq(index).remove();
        this.el.body_item.eq(index).remove();
    },

    activeTab: function (index) {
        this.el.header_item.eq(index).addClass('am-active').siblings().removeClass('am-active');
        this.el.body_item.eq(index).addClass('am-active').siblings().removeClass('am-active');
    },

    _activeTab: function (e, target) {
        this.activeTab(target.index());
    },

    _addTabItem: function () {
        this.index = this.index || 0;
        this.add("新增Tab" + ++this.index, "新增Tab" + this.index + "的内容");
    }

});