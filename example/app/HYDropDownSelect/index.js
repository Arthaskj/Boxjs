Box.define('Demo.HYDropDownSelect.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'
    },

    templates:{
        main:[
            '<div class="row" style="margin-left: 30px;margin-top:50px;">' +
            '<div class="col-md-5">' +
            '<label>性别：</label>' +
            '<div style="display: inline-block"><input class="sex"/></div>' +
            '<div style="margin-top: 15px">' +
            '<label>爱好：</label>' +
            '<div style="display: inline-block"><input class="CustodyAgency" name="CustodyAgency" type="text"></div>' +
            '</div>' +
            '<div style="margin-top: 15px"><button class="confirm k-button k-primary">确认</button></div> ' +
            '</div>' +
            '<div class="col-md-7">' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div>' +
            '</div>' +
            '</div>'
        ]
    },

    elements:{
        sex:'.sex',
        hobby:'.hobby',
        button:'.button',
        text:'.text',
        CustodyAgency: ".CustodyAgency",
    },

    events:{
      'click button':'checkFile'
    },

    setup:function () {
        var me = this;

        this.el.sex.HYDropDownSelect({
            name:"性别",
            selectType:'single',
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                {text:"男",value:1},
                {text:"女",value:2}
            ],
            index: 0
        });

        this.custodyAgency = this.el.CustodyAgency.HYDropDownSelect({
            name: "爱好",
            selectType: 'multi',
            dataTextField: "text",
            dataValueField: "value",
            dataSource: me._getCustudyAgency()
        });
    },
    
    _getCustudyAgency: function () {
        var option = [
            {text:"唱歌", value:1},
            {text:"看书", value:2},
            {text:"跑步", value:3},
            {text:"旅行", value:4}
        ];
        return option;
    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/HYDropDownSelect/index.js')
    }
});