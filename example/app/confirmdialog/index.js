/*===============================================================
* 描述：调用Box.ConfirmDialog函数实现弹出确认信息框
* ======================================================================== */

Box.define('Demo.confirmdialog.index',{
    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates:{
        main:[
            '<div style="margin-left: 50px;margin-top: 50px;">'+
            '<div class="col-md-5">' +
            '<div style="margin-bottom: 15px"><lable>姓名：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px"><lable>年龄：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/> </div>' +
            '<div style="margin-bottom: 15px"><lable>生日：</lable>'+
            '<input class="k-textbox" style="margin-left: 15px;"/></div> ' +
            '<div style="margin-bottom: 20px"><lable>电话：</lable>'+
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

    setup:function () {},
    confirmConfirm:function () {
        Box.ConfirmDialog.show({                  //调用Box.ConfirmDialog组件的show方法
            message: '确定保存信息?',              //对话框中需要展示的文字
            callback: function (result) {        //返回函数
                if (result) {
                    console.log('true');
                }
                else {
                    console.log('false');
                }
            }
        });
    },
    cancelConfirm:function () {
        Box.ConfirmDialog.show({
            message: '确定要退出?',
            callback: function (result) {
                if (result) {
                    console.log('true');
                }
                else {
                    console.log('false');
                }
            }
        });
    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/confirmdialog/index.js');
    }

});




