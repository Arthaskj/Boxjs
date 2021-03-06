﻿/* ========================================================================
 * 作者：    姚磊
 * 创建日期：2015.5.18
 * 描述：    前端框架入口js文件，主要用来定制路由规则，页面布局，加载配置信息等
 * ======================================================================== */
Box.define('Demo.app', {
    requires: [],

    /*
     * 继承自Viewport，实现路由机制
     */
    extend: 'Box.app.Viewport',

    target: 'body',

    /*
     * 路由规则，匹配所有#路由，由parseRoute方法来调用相关页面的js组件
     */
    routes: {
        '*path': 'parseRoute', // 匹配路由为所有url，即所有url发生变化时，都会调用parseRoute方法
        // 'user': 'user',
        // 'payItems': 'payItems',  //执行后面的方法
        // 'payItemsAuth': 'payItemsAuth',
    },

    elements: {
        sidebar: '#sidebar'
    },

    delegates: {
        // 'click {.exitSystem}': '_exitSystem',
    },

    exampleList: [],

    setup: function () {
        this.exampleList = Box.requireSync('json!app/config.json');
        var inlineDefault = new kendo.data.HierarchicalDataSource({
            data: this.exampleList
        });

        var treeview = this.el.sidebar.kendoTreeView({
            dataSource: inlineDefault

        }).data("kendoTreeView");

        treeview.expand(".k-item"); //展开所有的项
    },

    /*
     * 解析路由，将路由改为js组件名，再进行调用
     */
    parseRoute: function () {            //l路由改变时，URL改变时会执行这个函数
        if (!arguments || arguments.length === 0 || arguments[0] == null) {

            location.href = "#index";
            return;
        }

        else {
            this.el.target.find('.page-body').empty();
            var classname = arguments[0].replace(/\//g, '.');    //arguments有两个参数，第一个指#window/index链接的路径，第二个指?fdf=567路径后的这串

            Box.create(Box.app.Application.name + '.' + classname, {   //指在创建Box实例时定义的名称前缀Demo,这句代码表示引用Demo.window.index文件
                renderTo: this.el.target.find('.page-body'),
            });
        }

    }

});

