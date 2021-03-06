/* ========================================================================
 * 描述： 打印的三种形式
 * ======================================================================== */
Box.define('Demo.print.index', {

     extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

     templates:{
         main:[
             '<div style="margin-top:50px;margin-left:30px;" class="row">'+
             '<div class="col-md-5">'+
             '<button class="button1 k-button k-info" style="margin-right:10px;">通过传数组打印</button>'+
             '<button class="button2 k-button k-info" style="margin-right:10px;">通过直接写模板内容打印</button>'+
             '<button class="button3 k-button k-info">通过传模板打印</button></div>' +
             '<div class="col-md-7">'+
             '<button class="button k-button k-primary">查看源代码</button>'+
             '<div class="text"></div></div>'+
             '</div>'
         ]
     },

    elements:{
         buttonFromArray:'.button1',
         buttonFromContent:'.button2',
         buttonFromTemplate:'.button3',
         button:'.button',
         text:'.text'
    },

    events:{
      'click buttonFromArray':'printFromArray',
        'click buttonFromContent':'printFromContent',
        'click buttonFromTemplate':'printFromTemplate',
        'click button':'checkFile'
    },

    printFromArray:function () {
            var print = new Box.Print({              //实例化Box.Prinr方法，实现打印功能
                printContent: [
                    {
                        path: '/example/app/print/printtemplates/111.html',    //通过引入模板传输数组的形式
                        data: {
                            workflowInfo: [
                                { "RequestNo": null,
                                "TemplateName": null,
                                "StateName": "陈",
                                "StateSex": "女",
                                "ApproveDate": "2015-07-29",
                                "ApproveState": true,
                                "ApproveUser": "Administrator",
                                "StateBirthday": "2000-1-1",
                                "Rownumber": 0,
                                "RecordType": 1,
                                "ApproveUserNames": null },

                                { "RequestNo": null,
                                    "TemplateName": null,
                                    "StateName":"张",
                                    "StateSex": "男",
                                    "ApproveTime": null,
                                    "ApproveState": false,
                                    "ApproveUser": "吴思铭",
                                    "StateBirthday": "1999-5-5",
                                    "Rownumber": 1, "RecordType": 0,
                                    "ApproveUserNames": null },
                                { "RequestNo": null,
                                    "TemplateName": null,
                                    "StateName": "李",
                                    "StateSex": "男",
                                    "ApproveTime": null,
                                    "ApproveState": false,
                                    "ApproveUser": "",
                                    "StateBirthday": "2001-6-6",
                                    "Rownumber": 2,
                                    "RecordType": 0,
                                    "ApproveUserNames": null }]
                        }
                    }
                ]
            });
            print.fnPrint();
        },

    printFromContent:function () {
        var print = new Box.Print({
            printContent: [
                {
                    path: ["<div>{[values.workflowInfo[0].StateName]}</div>"],          //通过直接传入打印模板内容
                    data: {
                        "ApproveDate": "2015-07-29",
                        workflowInfo: [
                            { "RequestNo": null,
                                "TemplateName": null,
                                "StateName": "陈",
                                "StateSex": "女",
                                "ApproveTime": "2015-07-29 09:20:51",
                                "ApproveState": true,
                                "ApproveUser": "Administrator",
                                "StateBirthday": "2000-1-1",
                                "Rownumber": 0,
                                "RecordType": 1,
                                "ApproveUserNames": null },

                            { "RequestNo": null,
                                "TemplateName": null,
                                "StateName":"张",
                                "StateSex": "男",
                                "ApproveTime": null,
                                "ApproveState": false,
                                "ApproveUser": "吴思铭",
                                "StateBirthday": "1999-5-5",
                                "Rownumber": 1, "RecordType": 0,
                                "ApproveUserNames": null },
                            { "RequestNo": null,
                                "TemplateName": null,
                                "StateName": "李",
                                "StateSex": "男",
                                "ApproveTime": null,
                                "ApproveState": false,
                                "ApproveUser": "",
                                "StateBirthday": "2001-6-6",
                                "Rownumber": 2,
                                "RecordType": 0,
                                "ApproveUserNames": null }]
                    }
                }
            ]
        });
        print.fnPrint();
    },

    printFromTemplate:function () {
        var print=new Box.Print({
            printContent: '/example/app/print/printtemplates/222.html'         //通过直接传入打印模板
        });
        print.fnPrint();
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/print/index.js');
    }
});
