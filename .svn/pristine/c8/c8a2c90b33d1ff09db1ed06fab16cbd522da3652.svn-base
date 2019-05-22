/*========================================================================
* 描述：若姓名和年龄为空时会给出相应提示
* ======================================================================== */

Box.define('Demo.validator.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates:{
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;" class="row">'+
            '<div class="col-md-5">' +
            '<div class="reminder" style="margin-bottom: 10px;font-size: 12px;"></div> '+
            '<div style="margin-bottom: 15px"><lable>姓名：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;" required data-vld-name="姓名" name="UserName" validationMessage="请输入姓名"/> </div>' +
            '<div style="margin-bottom: 15px"><lable>年龄：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;" name="age" required validationMessage="请输入年龄"/> </div>' +
            '<div style="margin-bottom: 15px;"><lable>生日：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div style="margin-bottom: 20px"><lable>电话：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;" name="tel"  maxlength="11" data-max-msg="限制长度11位"/></div> ' +
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
        reminder:'.reminder',
        text:'.text',
        confirm:'.confirm',
        cancel:'.cancel',
        button:'.button'
    },

    events:{
        'click confirm':'confirm',
        'click cancel':'.cancel',
        'click button':'checkFile'
    },
    setup:function () {
         this.validator = new Box.Validator({      //var定义只是局部变量，若想为全局变量用this
            target: this.el.target
        });
    },

   confirm:function(){
   	    var submitMark = this.validator.fnValidate();
        if (!submitMark) {
            return;
        }
        else {
        	Box.Notify.success("提交成功")         //若验证通过则弹出提交成功的消息
        }
   },
   cancel:function(){
   },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/validator/index.js');
    }
});