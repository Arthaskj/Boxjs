Box.define('Demo.HYAutoBox.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'
    },

    templates:{
        main:[
            '<div class="row" style="margin-left: 30px;margin-top:50px;">' +
            '<div class="col-md-4">' +
            '<div class="reminder" style="margin-bottom: 10px;font-size: 12px;"></div>'+
            '<lable>姓名：</lable><input class="name"/>' +
            '<div style="margin-top: 15px"><lable>爱好：</lable><input class="hobby"></div>' +
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
        reminder:'.reminder',
        name:'.name',
        hobby:'.hobby',
        button:'.button',
        text:'.text'
    },

    events:{
        'click button':'checkFile'
    },

    setup:function () {

        Box.Reminder.show({
            renderTo:this.el.reminder,
            message:"输入姓名首字母会自动补全,并且姓名更改时会在后台输出当前值"
        });

        var auto = this.el.name.HYAutoBox({
            height: 200,              //定义自动补全框高度为200
            dataSource: ["Apples", "Align", "Abc", "Acti", "Bil", "Ben", "Bp", "Cc", "Cang", "Oranges", "Cindy", "Doc", "Eai", "Fu"],
            change: function (e) {        //调用kendoAutoComplete的change事件，当value值改变的时候会发生该事件并且会在后台输出当前值
                var value = this.value();
                console.log(value);
            }
        }).data("kendoAutoComplete");

       auto.value("Cindy");        //调用kendoAutoComplete的value方法，设置值

        var datahob = [
            { text:"唱歌",value:'1'},
            { text:"看书",value:"2"},
            { text:"打球",value:"3"}
        ];

        this.el.hobby.HYDropDownList({
            dataTextField:"text",
            dataValueFiled:"value",
            dataSource:datahob,
            index:0
        })
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/HYAutoBox/index.js')
    }
});