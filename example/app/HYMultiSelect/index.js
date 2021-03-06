Box.define('Demo.HYMultiSelect.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'
    },

    templates:{
        main:[
            '<div class="row" style="margin-left: 30px;margin-top:50px;">' +
            '<div class="col-md-4">' +
            '<lable>姓名：</lable><input class="name"/>' +
            '<div style="margin-top: 15px"><lable>爱好：</lable>'+
            '<select class="hobby" multiple="multiple" style="display: inline-block">' +
            '<option>唱歌</option>' +
            '<option>看书</option>' +
            '<option>旅行</option>' +
            '<option>打球</option>' +
            '<option>逛街</option>' +
            '<option>模型</option>' +
            '</select></div>' +
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
        hobby:'.hobby',
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
        var hobby = this.el.hobby.kendoMultiSelect().data("kendoMultiSelect");
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/HYMultiSelect/index.js')
    }
});