/*========================================================================
* 描述：调用Box.Notify函数实现弹出提示信息框
* ======================================================================== */

Box.define('Demo.notify.index',{

    extend:'Box.Component',
    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates:{
        main:[
            '<div style="margin-top: 50px;margin-left: 50px;">' +
            '<div class="col-md-5">' +
            '<button  class="info k-button k-primary">点击弹出提示</button>&nbsp;&nbsp;&nbsp;' +
            '<button  class="warning k-button k-warning">点击弹出警告</button>&nbsp;&nbsp;&nbsp;' +
            '<button  class="success k-success k-button">点击提示成功</button>&nbsp;&nbsp;&nbsp;' +
            '<button  class="error k-button" style="background-color: #FF124E">点击提示错误</button>' +
            '</div>' +
            '<div class="col-md-7"><button class="button k-primary k-button">查看源代码</button>' +
            '<div class="text"></div></div>' +
            '</div>'
        ]
    },

  elements:{
        info:'.info',
        warning:'.warning',
        success:'.success',
        error:'.error',
        button:".button",
        text:'.text'
    },

    events:{
        'click info':'infoNotify',
        'click warning':'warningNotify',
        'click success':'successNotify',
        'click error':'errorNotify',
        'click button':'searchFile'
    },

    setup:function () {
    },

    infoNotify:function () {
        Box.Notify.info("弹出提示消息");      //调用Box.Notify中的info方法弹出提示消息
    },
    warningNotify:function () {
        Box.Notify.warning("弹出警告消息");   //调用Box.Notify中的info方法弹出警告消息
    },
    successNotify:function () {
        Box.Notify.success("弹出成功消息");   //调用Box.Notify中的info方法弹出成功消息
    },
    errorNotify:function () {
        Box.Notify.error("弹出错误消息");     //调用Box.Notify中的info方法弹出错误消息
    },
    searchFile:function () {
        this.CheckFile(this.el.text[0],'text!app/notify/index.js');
    }

});