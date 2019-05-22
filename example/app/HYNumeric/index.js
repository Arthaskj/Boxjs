Box.define('Demo.HYNumeric.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'
    },

    templates:{
        main:[
            '<div class="row" style="margin-left: 30px;margin-top:50px;">' +
            '<div class="col-md-4">' +
            '<lable>姓名：</lable><input class="name"/>' +
            '<div style="margin-top: 15px"><lable>年龄：</lable><input class="age"></div>' +
            '<div style="margin-top: 15px"><button class="confirm k-button k-primary">确认</button></div> ' +
            '</div>' +
            '<div class="col-md-8">' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div>' +
            '</div>' +
            '</div>'
        ]
    },

    elements:{
        name:'.name',
        age:'.age',
        button:'.button',
        text:'.text'
    },

    events:{
        'click button':'checkFile'
    },

    setup:function () {

        this.el.name.HYAutoBox({
            dataSource: [ "Apples","Align","Abc","Acti", "Bil","Ben","Bp","Cc","Cang","Oranges" ,"Cindy","Doc","Eai","Fu"]
        });

        var num =this.el.age.HYNumeric({
            value:"20",
            max:100,         //使用HYNumeric的属性使最大值为100最小为0
            min:0
        }).data("kendoNumeric");

        num.focus();         //调用HYNumeric的方法focus获取焦点

        num.bind("change", function() {
            var value = this.value();
            console.log(value);    //将change事件绑定到目标节点中，值改变的时候点击确认按钮会发生事件并在后台输出当前值
        });
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/HYNumeric/index.js')
    }
});