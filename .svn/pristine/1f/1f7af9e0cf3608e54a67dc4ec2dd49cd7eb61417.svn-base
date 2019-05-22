/*===============================================================
* 描述：调用Box.Reminder函数实现弹出提示信息框
* ======================================================================== */

Box.define('Demo.reminder.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates:{
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;" class="row">'+
            '<div class="col-md-5">' +
            '<div class="reminder" style="margin-bottom: 10px;font-size: 12px;"></div>'+
            '<div style="margin-bottom: 15px"><lable>姓名：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px"><lable>年龄：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px;"><lable>生日：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div style="margin-bottom: 20px"><lable>电话：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div>'+
            '<button class="confirm k-button k-info" style="">确认</button>'+
            '<button class="cancel k-button k-info" style="margin-left: 30px">取消</button>'+
            '</div>'+
            '</div>'+
            '<div class="col-md-7">' +
            '<button class="button k-button k-primary">查看源代码</button> ' +
            '<div class="text"></div>'+
            '</div>'+
            '</div>'
        ]
    },

    elements:{
        reminder:'.reminder',
        text:'.text',
        confirm:'.confirm',
        cancel:'.cancel',
        button:'.button'
    },

    events:{
        'click confirm':'confirmReminder',
        'click cancel':'.cancelReminder',
        'click button':'checkFile'
    },

    setup:function () {
        Box.Reminder.show({
            renderTo: this.el.reminder,
            message: '以下姓名信息，以及电话信息为必填,年龄信息生日信息选填，注意生日信息格式为yy-mm-dd',
            name: 'Reminder'    //在整个系统里面必须是唯一的,否则可能出现显示不正常的问题
        });
    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/reminder/index.js');
    }

});