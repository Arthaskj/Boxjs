Box.define('Demo.window.indexDetails',{

    extend:'Box.Component',
    requires:[
        'Demo.reminder.index'
    ],

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates:{
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;height: 100vh;">' +
            '<div class="col-md-4">' +
            '<button class="check k-button">点击弹出窗口</button> '+
            '</div>' +
            '<div class="col-md-8">' +
            '<button class="button k-button k-primary">查看源代码</button> '+
            '<div class="text" style="width:100%;"></div>'+
            '</div>' +

            '</div>'
        ]
    },

    elements:{
        button:'.button',
        check:'.check',
        text:'.text'
    },

    events:{
      'click button':'checkFile',
      'click check':"showWindow"
    },
    setup:function () {
    },

    showWindow:function () {
        Box.Window.show({
            init: function () {
                new Demo.reminder.index({
                    renderTo:this.el.content
                })
            },
            title: " window",
            autoOpen: false,
            closeAction: 'destroy',
            width: 800,
            height: 450,
            buttons: [
                {
                    name: 'btn_Close',
                    text: '关闭',
                    icon: 'fa-times',
                    handler: function () {
                        this.fnClose();
                    }
                }
            ]
        });
    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/window/indexDetails.js');
    }

});