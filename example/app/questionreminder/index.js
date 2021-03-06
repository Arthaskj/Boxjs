/*===============================================================
* 描述：调用Box.QuestionReminder函数实现弹出确认信息框
* ======================================================================== */

Box.define('Demo.questionreminder.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates:{
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;">'+
            '<div class="col-md-5">' +
            '<div style="margin-bottom: 15px"><span class="questionName"></span><lable>姓名：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px"><span class="questionAge"></span><lable>年龄：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px"><span class="questionBirth"></span><lable>生日：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div style="margin-bottom: 20px"><span class="questionTel"></span><lable>电话：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div>'+
            '<button class="confirm k-button k-primary" style="">确认</button>'+
            '<button class="cancel k-button k-primary" style="margin-left: 30px">取消</button>'+
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
        name:'.questionName',
        age:'.questionAge',
        birth:'.questionBirth',
        tel:'.questionTel',
        text:'.text',
        confirm:'.confirm',
        cancel:'.cancel',
        button:'.button'
    },

    events:{
        'click confirm':'confirmConfirm',
        'click cancel':'cancelConfirm',
        'click button':'checkFile'
    },

    setup:function () {
        Box.Questionreminder.show({
            message: '姓名不能为空',
            renderTo: this.el.name       //渲染到需要展示的地方
        });
        Box.Questionreminder.show({
            message: '年龄需为0到100之间',
            renderTo: this.el.age
        });
        Box.Questionreminder.show({
            message: '生日格式应为yy/mm/dd',
            renderTo: this.el.birth
        });
        Box.Questionreminder.show({
            message: '电话应不超过11位',
            renderTo: this.el.tel
        });
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/questionreminder/index.js');
    }

});




