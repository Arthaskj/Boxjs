/* ========================================================================
 * 描述：根据收费项目的值来进行验证，若收费项目为1且新增时存在相同的用户名称则会进行提示，为0时会执行新增
 * ======================================================================== */
Box.define('Demo.validator.indexDetails', {

    extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },
    templates: {
        main: [
            '<div style="margin-left: 30px;margin-top: 50px;">' +
            '<div class="reminder"></div>'+
            '<div class="div_list"></div>' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div>' +
            '</div>'
        ]
    },

    elements: {
        list: '.div_list',
        button: '.button',
        text:'.text',
        name:'.filterUserName',
        reminder:'.reminder'
    },

    events:{
        'click button':'checkFile'
    },
    delegates: {
        'click  {button.btn_search}': 'filterItem',
        'click  {button.btn_add}':'addItem'
    },

    setup: function (){
        Box.Reminder.show({
            renderTo: this.el.reminder,
            message: '根据收费项目的值来进行验证，若收费项目为1时且新增时存在相同的用户名称则会进行提示，为0时会执行新增',
            name: 'Reminder'    //在整个系统里面必须是唯一的,否则可能出现显示不正常的问题
        });
        this.el.list.HYGrid({
            dataSource: {
                schema: {
                    model: {
                        id: "ItemCode"
                    }
                },
                // transport: {
                //     read: "api/ItemAuth/GetAllUserItemAuths"  //从数据库读取数据
                // }
                data: [
                    {UserName: "Aang", Item: 1, History: 1,CreatedTime: "2018-07-28", LastAlterTime: "2018-07-28" },
                    {UserName: "Chang", Item: 1, History: 0,CreatedTime: "2018-07-28", LastAlterTime: "2018-07-28" },
                    {UserName: "Deng", Item: 0, History: 1,CreatedTime: "2018-07-28", LastAlterTime: "2018-07-28" },
                    {UserName: "Bong", Item: 1, History: 0,CreatedTime: "2018-07-28", LastAlterTime: "2018-07-28" }

                ]
            },
            toolbar: [
                {
                    template: '<label>用户:&nbsp;&nbsp;</label><input class="filterUserName k-textbox" name="UserName" data-isexist-field="UserName" data-isexist-msg="已经存在相同的用户名称" required data-vld-name="用户名称"/>'+
                    '<lable>项目代码:&nbsp;&nbsp;</lable><input class="itemCode" name="item"/>'
                },
                {
                    template: '<button class="btn_search k-button k-primary" value="search" style="margin-left: 5px">查询</button>'+
                    '<button class="btn_add k-button k-primary k-button-icontext" value="upload" style="margin-left: 5px;"><span class="k-icon fa fa-cloud-download"></span>新增</button>'
                }
            ],
            columns: [
                {
                    field: "UserName",
                    title: '用户'

                },
                {
                    field: "Item",
                    title: "项目代码"
                },
                {
                    field: "History",
                    title: "历史"
                },
                {
                    field: "CreatedTime",
                    title: "创建时间"
                },
                {
                    field: "LastAlterTime",
                    title: "更新时间"
                }
            ],
            editable: false,
            selectable: true
        });
        var data=[
            {text:"0",value:0},
            {text:"1",value:1}
        ];
        var Item = this.el.target.find('.itemCode').HYDropDownList({          //实例化下拉列表控件
            dataTextField: "text",
            dataValueField : "value",
            dataSource:data
        }).data('kendoDropDownList');

        this.el.list.find('.btn_add').css({"float": "right"});  //把导出按钮放置到右边
        var me = this;
        this.validator = new Box.Validator({
            target: this.el.target,
            rules: {
                isexist: function (input) {
                    var checkResult = true;
                    var item_value = me.el.target.find('.filterUserName').val();
                    var itemCode_value = Item.text();    //获得下拉列表的值，因kendo中不总是支持val()，所以应用kendo的方法text()获取值
                    var grid = me.el.list.data("kendoGrid");
                    var info = grid.dataSource.data().toJSON();
                    if ((input.is('[data-isexist-field]'))&&(itemCode_value==1)) {     //若用户名称已存在并且收费项目为1时验证不通过
                        for (var i = 0; i < info.length; i++) {
                            if (info[i].UserName == item_value)
                                checkResult=!checkResult;
                        }
                        return checkResult;
                    }
                    return true;
                }
            }

        });
    },

    checkFile:function(){
        this.CheckFile(this.el.text[0],'text!app/validator/indexDetails.js');
    },

    filterItem: function () {
        var item_value = this.el.target.find('.filterUserName').val();
        var grid = this.el.list.data("kendoGrid");

        // if (item_value) { //如果用户输入了筛选值,就进行筛选,如果没有就重新请求一下数据源
        grid.dataSource.filter(
            [
                {
                    field: "UserName",
                    operator: "contains",
                    value: item_value
                }
            ]
        );
        // }
        // else {
        //     grid.dataSource.read();
        // }

    },

    addItem:function () {
        var me=this;
        if(this.validator.fnValidate()){           //若验证通过则执行添加功能
            var item_value = me.el.target.find('.filterUserName').val();
            var data=[
                {text:"0",value:0},
                {text:"1",value:1}
            ];
            var Item = this.el.target.find('.itemCode').HYDropDownList({
                dataTextField: "text",
                dataValueField : "value",
                dataSource:data
            }).data('kendoDropDownList');
            var itemCode_value = Item.text();
            var grid = me.el.list.data("kendoGrid");
            grid.dataSource.add({UserName: item_value, Item: itemCode_value, History: "1", CreatedTime: Box.Format.renderDate(new Date()), LastAlterTime: Box.Format.renderDate(new Date())});
        }
    }
});