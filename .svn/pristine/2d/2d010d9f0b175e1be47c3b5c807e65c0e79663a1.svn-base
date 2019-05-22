/* ========================================================================
 * 描述：导出功能需要有后台支持，所以仅实现前台页面功能
 * ======================================================================== */

Box.define('Demo.export.index',{

    extend:'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'
    },

    templates:{
        main:[
            '<div style="margin-left: 30px;margin-top: 50px;" class="row">' +
            '<div class="grid"></div>' +
            '<div><button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div></div>' +
            '</div>'
        ]
    },

    elements: {
        grid: '.grid',
        button:'.button',
        text:'.text'
    },
    events:{
        'click button':'checkFile'
    },

    delegates: {
        'click  {button.btn_search}': 'filterItem',      //不是在主模板中渲染的元素不在elements中定义
        'click  {button.btn_add}':'addItem',
        'click  {button.btn_export}':'exportItem'
    },
    setup:function () {
        var grid = this.el.grid.HYGrid({
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
                    {UserName: "Aang", Item: 1, History: 1,CreatedTime: "2018-9-3", LastAlterTime: "2018-9-4"},
                    {UserName: "Chang", Item: 1, History: 0,CreatedTime: "2018-9-3", LastAlterTime: "2018-9-4"},
                    {UserName: "Deng", Item: 0, History: 1,CreatedTime: "2018-9-3", LastAlterTime: "2018-9-4"},
                    {UserName: "Bong", Item: 1, History: 0,CreatedTime: "2018-9-3", LastAlterTime: "2018-9-4"}

                ]
            },
            toolbar: [               //需要验证的输入框中需要定义name属性，因给出提示消息的函数中定义了name参数
                {
                    template: '<label>用户:&nbsp;&nbsp;&nbsp;&nbsp;</label><input class="filterUserName k-textbox" name="UserName" data-isexist-field="UserName" data-isexist-msg="已经存在相同的用户名称" data-vld-name="用户名称"/>'
                },
                {
                    template: '<button class="btn_search k-button k-primary" value="search" style="margin-left: 5px">查询</button>'+
                    '<button class="btn_add k-button k-primary k-button-icontext" value="upload" style="margin-left: 5px;text-align: right"><span class="k-icon fa fa-cloud-download"></span>新增</button>'+
                    '<button class="btn_export k-button k-primary" value="export" style="float: right;"><span class="k-icon fa fa-cloud-download"></span>导出</button> '
                }
            ],
            columns: [
                {
                    field: "UserName",
                    title: '用户'

                },
                {
                    field: "Item",
                    title: "收费项目",
                    width:'100px'
                },
                {
                    field: "History",
                    title: "历史",
                    width:'100px'
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
            editable: true,          //当前行是否可编辑
            selectable: "row",        //定义选择行
            resizable:true,          //当前行是否可进行拖动
            pageable:false           //是否使表格分页

        }).data("kendoGrid");

        // grid.addRow();              //调用addRow方法，增加一行表格

        function grid_change(e) {                  //触发事件会在后台输出当前行的内容
            var data = grid.dataItem(grid.select());
            console.log(data);
        }

        grid.bind("change", grid_change);          //当用户选择网格中的表格行或单元格时触发

        this.validator = new Box.Validator({
            target: this.el.target
        });

    },
    filterItem: function () {
        var item_value = this.el.target.find('.filterUserName').val();
        var grid = this.el.grid.data("kendoGrid");

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
            var grid = me.el.grid.data("kendoGrid");
            grid.dataSource.add({UserName: item_value, Item: "1", History: "1", CreatedTime: Box.Format.renderDate(new Date()), LastAlterTime: Box.Format.renderDate(new Date())});
        }
    },

    exportItem:function () {
        var me= this;
        var option = {
            fileName: "grid_export",
            grid: me.el.grid
        };

        Box.Common.exportToExcel(option);

    },

    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/export/index.js')
    }

});