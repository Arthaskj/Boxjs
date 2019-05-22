Box.define('Demo.window.index',{

    requires:[
          'Demo.window.indexDetail'   //加载当前模块的依赖模块,通过后期调用实现所展示的功能
    ],
    extend:'Box.Component',     //继承Component对象

    mixins:{
         checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates: {
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;height: 100vh;">' +
            '<div class="col-md-4">' +
            '<button class="button k-button">点击弹出窗口</button>' +
            '</div>' +
            '<div class="col-md-8">' +
            '<button class="check k-button k-primary">查看源代码</button>' +
            '<div class="text" style="width:100%;"></div>' +
            '</div>' +
            '</div>'
         ]
    },

    elements:{               //定义主模板中渲染的元素
        button: '.button',
        text: '.text',
        check:'.check'
    },

    events:{                //定义主模板中渲染的元素发生的事件
        'click button': 'window',
        'click check': 'checkFile'
    },
    name:'窗口的实例',
    setup:function () {
    },

    window:function(){
        var index = new Demo.window.indexDetail();
    },
    checkFile: function () {
        this.CheckFile(this.el.text[0],'text!app/window/indexDetail.js');
    }

});