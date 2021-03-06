/* ========================================================================
 * 描述：上传控件,基于dropzone (http://www.dropzonejs.com/)
 * ======================================================================== */
Box.define('Demo.upload.index', {

    extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates: {
        main: [
            '<div style="margin-left: 30px;margin-top: 50px;">' +
            '<div class="div_list"></div>' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div>' +
            '</div>'
        ]
    },

    elements: {
        list: '.div_list',
        button: '.button',
        text:'.text'
    },

    events:{
        'click button':'checkFile'           //button是通过主模板渲染的，主模板里渲染的元素发生事件需要在events里定义
    },
    delegates: {
        'click  {button.btn_search}': 'filterItem'     //查询按钮是在工具栏中渲染出来的，发生事件时需要使用事件代理
    },

    setup: function () {
        this.el.list.HYGrid({
            dataSource: {
                schema: {
                    model: {
                        id: "ItemCode"
                    }
                },
                // transport: {
                //     read: "api/ItemAuth/GetAllUserItemAuths"  //远程读取数据
                // }
                data: [
                    {UserName: "Aang", Item: 1, History: 1,CreatedTime: "2018-07-28 09:46:09", LastAlterTime: "2018-07-28 09:46:09" },
                    {UserName: "Chang", Item: 1, History: 0,CreatedTime: "2018-07-28 09:46:09", LastAlterTime: "2018-07-28 09:46:09" }

                ]
            },
            toolbar: [
                {
                    template: '<label>用户:&nbsp;&nbsp;&nbsp;&nbsp;</label><input class="filterUserName k-textbox"/>'
                },
                {
                    template: '<button class="btn_search k-button k-primary" value="search" style="margin-left: 5px">查询</button>'+
                    '<button class="btn_upload k-button k-primary k-button-icontext" value="upload" style="margin-left: 5px;"><span class="k-icon fa fa-cloud-download"></span>上传</button>'
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
            editable: false,          //是否可编辑
            selectable: true          //是否为可选择行
        });

        var hasError = false;
        var me = this;
        this.upload = new Box.Upload({     //实例化Box.upload方法实现上传功能
            uploadUrl: "api/PayItem/Import",
            uploadAutoProcessQueue: true,
            uploadAcceptedFiles: '.xlsx,.xls',
            bindTo: this.el.list.find('.btn_upload'),       //通过绑定到按钮上实现上传的文件选择

            error: function (e,result) {                //上传失败发生的函数
                Box.Notify.warning(result);
                console.log(result);
            },
            sending: function () {                     //上传中发生的函数
                Box.HY.Page.showLoader();
            },
            success: function(){                       //上传成功发生的函数
                if (hasError) {
                    Box.Notify.error('上传出现错误!');
                } else {
                    Box.Notify.success('上传成功!');
                    me.el.list.data('kendoGrid').dataSource.read();
                }
            },
            complete: function () {                    //上传成功或失败都会发生的函数
                Box.HY.Page.hideLoader();
            }
        });

         this.el.list.find('.btn_upload').css({"float": "right"});  //把导出按钮放置到右边
    },

    checkFile:function(){
        this.CheckFile(this.el.text[0],'text!app/upload/index.js');
    
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

    }
});