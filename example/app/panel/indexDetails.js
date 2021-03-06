Box.define('Demo.panel.indexDetails',{

    extend:'Box.Component',

    requires:[                //加载当前模块的依赖模块,通过调用实现该模块定义的属性或方法
        'Demo.reminder.index'
    ],
    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates:{
        main:[
            '<div style="margin-top: 50px;margin-left: 30px">' +
            '<div class="showPanel"></div> ' +
            '<div><button class="button k-button k-primary">查看源代码</button></div>' +
            '<div class="text"></div> ' +
            '</div>'
        ]
    },
    elements:{
        button:'.button',
        text:'.text',
        panel:'.showPanel'
    },
    events:{
      'click button':"checkFile"
    },
    setup:function () {
        Box.Panel.show({
            renderTo:this.el.panel,   //需要渲染到页面中某个位置
            init: function () {
                new Demo.reminder.index({   //在panel中使用reminder组件
                    renderTo:this.el.content
                })
            },
            title: " 新增",
            width: '700px',
            height: '400px'
        });
    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/panel/indexDetails.js');
    }

});