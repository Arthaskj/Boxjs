Box.define('Demo.gridpage.index', {

    requires: [
        'Demo.gridpage.indexDetail'
    ],

    extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates: {
        main: [
            '<div style="margin-left: 30px;margin-top: 50px;">' +
            '<div class="grid"></div> ' +
            '<div><button class="k-button k-primary button">查看源代码</button></div>' +
            '<div class="text" style="display:inline-block;width: 100%;"></div>' +
            '</div>'
        ]
    },

    elements: {
        grid: '.grid',
        text: '.text',
        button: '.button'
    },
    events: {
        'click button': 'searchFile'
    },

    setup: function () {
        var me = this;
        var gridPage = new Demo.gridpage.indexDetail({
            renderTo: me.el.grid      //gridpage需依赖某个定义好的模板并渲染到当前模板才能展示出来，而window不需依赖任何东西就可弹出来
        });


    },

    searchFile: function () {
        this.CheckFile(this.el.text[0],'text!app/gridpage/indexDetail.js');
    }

});