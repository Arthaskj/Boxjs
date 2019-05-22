/* ========================================================================
 * 描述：新增字段时若验证用户名已存在，则会给出相应提示
 * ======================================================================== */
Box.define('Demo.validator.indexDetail', {

    extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates: {
        main: [
            '<div style="margin-left: 30px;margin-top: 50px;">'+
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

    setup: function () {
        Box.Reminder.show({
            renderTo: this.el.reminder,
            message: '新增时若存在相同的用户名称则会进行提示，不存在会执行新增',
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
            toolbar: [               //需要验证的输入框中需要定义name属性，因给出提示消息的函数中定义了name参数
                {
                    template: '<label>用户:&nbsp;&nbsp;&nbsp;&nbsp;</label><input class="filterUserName k-textbox" name="UserName" data-isexist-field="UserName" data-isexist-msg="已经存在相同的用户名称" required data-vld-name="用户名称"/>'
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
                    title: "收费项目"
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

        this.el.list.find('.btn_add').css({"float": "right"});      //把导出按钮放置到右边
        var me = this;
        this.validator = new Box.Validator({
            target: this.el.target,
            rules: {
                isexist: function (input) {
                    if (input.is('[data-isexist-field]')) {
                        var checkResult = true;
                        var item_value = me.el.target.find('.filterUserName').val();
                        var grid = me.el.list.data("kendoGrid");
                        var info = grid.dataSource.data().toJSON();
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
        this.CheckFile(this.el.text[0],'text!app/validator/indexDetail.js');

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
            var grid = me.el.list.data("kendoGrid");
            grid.dataSource.add({UserName: item_value, Item: "1", History: "1", CreatedTime: Box.Format.renderDate(new Date()), LastAlterTime: Box.Format.renderDate(new Date())});
        }
    }

});