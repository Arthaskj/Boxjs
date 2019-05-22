/*========================================================================
* 描述：继承分页查询组件，实现展示有查询和分页功能的表格
* ======================================================================== */

Box.define('Demo.gridpage.indexDetail', {

    name: "Box.GridPage",

    extend: 'Box.GridPage',

    delegates: {},   //事件代理，用于给不属于主模板渲染的元素增加事件
    /*
     * 查询url
     */
    ajaxUrl: "",

    table_buttons: [
        {
            text: '新增', //按钮显示的文字
            icon: 'fa-plus', //使用fontawesome的图标,
            handler: '_doCreate',//点击按钮的处理函数
            name: 'doCreate', //按钮的名字,需要唯一,这个属性一定要设置
            theme: "k-primary",//k-info,k-info,k-success,k-warning,k-danger
            operationType: 1
        }
    ],

    table_order: [            //一定要有排序，后台才能返回数据
        {}
    ],

    autoLoadData: true,      //初始化完成后是否自动加载数据,如果为false,需要手动调用search 获取数据

    isfiltersArray: true,    //传到后台的数据是数组还是对象

    pageabledisabled: false, //控制是否显示分页
    /*
     * 查询条件
     */
    table_search: [
        {
            name: 'Name',
            text: '姓名',
            type: 'text',
            operator: 'contains'
        },
        {
            name: 'Sex',
            text: '性别',
            type: 'comboBox',
            width: 100,
            isAdvanced: true,
            operator: 'contains',
            renderData: [
                {
                    value: 'true',
                    text: '男'
                },
                {
                    value: 'false',
                    text: '女'
                }
            ]
        },
        {
            name:'birthday',
            type: 'date',
            text:'生日',
            isAdvanced:true,
            operator: 'contains'
        },
        {
            name:'workdays',
            type:'rangeDate',
            text:'工作时间',
            isAdvanced:false
        }
    ],
    /*
     * 界面显示属性列
     */

    table_columns: [
        {
            field: "Name",  //绑定的字段
            title: "姓名",    //字段显示的名称
            sortable: false,   //是否支持排序
            attributes: {       //向列添加一些属性
                style: "text-align: center; font-size: 14px"
            }
        },
        {
            field: "Sex",
            title: "性别",
            sortable: false,
            attributes: {
                style: "text-align: center; font-size: 14px"
            }
        },
        {
            field: "Birthday",
            title: "生日",
            sortable: false,
            attributes: {
                style: "text-align: center; font-size: 14px"
            }
        },
        {
            field: "Tel",
            title: "电话",
            sortable: false,
            attributes: {
                style: "text-align: center; font-size: 14px"
            }
        }
    ],

    _doCreate:function () {
        Box.Window.show({
            init: function () {
            },

            title: " 新增",
            autoOpen: false,
            closeAction: 'destroy',
            width: 400,
            height: 200,
            buttons: [
                {
                    name: 'btn_Add',
                    text: '新增',
                    icon: 'fa-check',
                    theme: "k-info",
                    handler: ''
                },
                {
                    name: 'btn_Close',
                    text: '关闭',
                    icon: 'fa-times',
                    handler: function () {
                        this.fnClose();
                    }
                }
            ]
        });
    }

});