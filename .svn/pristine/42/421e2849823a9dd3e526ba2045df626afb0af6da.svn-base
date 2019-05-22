Box.define('Demo.panel.index', {
//panel跟window类似
    extend: 'Box.Component',

    requires: [
        'Demo.panel.indexDetail'
    ],
    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates: {
        main: [

            '<div style="margin-left: 50px;margin-top: 50px;">' +
            '<div class="col-md-5">' +
            '<div class="panelShow "></div>' +
            '</div>' +
            '<div class="col-md-7">' +
            '<div><button class="k-button k-primary button">查看源代码</button></div>' +
            '<div class="text" style="display:inline-block;width: 100%;"></div>' +
            '</div>' +
            '</div>']
    },

    elements: {
        text: '.text',
        button: '.button',
        panelshow: '.panelShow'
    },
    events: {
        'click button': 'searchFile'
    },

    defaultStatus: 'expand',

    showHeader: true,     //是否展示标题栏

    title: 'Box.Panel',

    icon: 'fa fa-columns',

    width: '500px',

    height: '400px',

    setup: function () {
        var me = this;
        var panel = new Demo.panel.indexDetail({
            renderTo: this.el.panelshow
        });
    },

    searchFile: function () {
        this.CheckFile(this.el.text[0],'text!app/panel/indexDetail.js');
    }
});

