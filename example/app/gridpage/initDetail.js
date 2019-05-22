/* ========================================================================
 *描述：根据URL中传递的参数来初始化查询条件
 * ======================================================================== */

Box.define('Demo.gridpage.initDetail', {

    //继承自GridPage
    extend: 'Box.GridPage',

    table_buttons: [],
    isfiltersArray: false,
    //enableExport: true,
    // $params: {
    //     bondkey: '',
    // },
    table_search: [
        {
            name: 'TradeTime', //这个name后面会用作查询条件的field,所以需要跟字段名一样
            text: '通知时间',
            type: 'rangeDate',
            field: [ ///对应的传到后台的字段，只支持两个字段
                'StartDate',
                'EndDate'
            ],
            value: {
                StartDate: Box.Format.renderDate(new Date().addDays(-7)),
                EndDate: Box.Format.renderDate(new Date())
            }
        },
        {
            name: 'ExecId',
            text: '成交单编号',
            type: 'text',
            operator: 'contains',
            isAdvanced: true,

        },
        {
            name: 'CounterParty',
            text: '对手方',
            type: 'text',
            operator: 'contains',
            isAdvanced: true,

        }
    ],

    table_order: [
        {
            field: 'TradeTime',
            dir: 'DESC'
        }
    ],

    initTradeTimeFilter: function (filter) {  //根据传入的参数初始化条件

        var search =document.location.hash.split('?');
        var params = Box.Object.fromQueryString(search[1]);

        if (params.StartDate) {
                filter.widgets[0].value(params.StartDate);
            }
            if (params.EndDate) {
                filter.widgets[1].value(params.EndDate);
            }

        // if (this.getParams('StartDate')) {
        //     filter.widgets[0].value(this.getParams('StartDate'));
        // }
        // if (this.getParams('EndDate')) {
        //     filter.widgets[1].value(this.getParams('EndDate'));
        // }
    },

    init: function () {
        //当有参数传入的时候,自动刷新列表
        // if (this.getParams('StartDate') || this.getParams('EndDate')) {
        //     this.fnSearch();
        // }
        //
    },

    //name为参数名，返回的是参数值

    getParams:function (name) {
        var search = document.location.href;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
        // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        // var r = window.location.href.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配  只能识别EndDate不能识别StartDate不知道什么原因
        // var context = "";
        // if (r != null)
        //     context = r[2];
        // reg = null;
        // r = null;
        // return context == null || context == "" || context == "undefined" ? "" : context;
    },

    table_columns: function () {
        return [
            {
                field: "TradeTime",
                title: "通知时间",
                width: "150px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "OrderCode",
                title: "委托单号",
                width: "200px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "OutOrderNo",
                title: "外围系统指令单",
                width: "180px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "Creater",
                title: "指令订单创建者",
                width: "100px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "OrderStatus",
                title: "订单状态",
                width: "80px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "OperateStatus",
                title: "操作状态",
                width: "80px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "OurPartyId",
                title: "本方机构编码",
                width: "100px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "QuoteType",
                title: "报价类型",
                width: "90px",
                headerAttributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "ValidTime",
                title: "订单有效时间",
                width: "150px",
                headerAttributes: {  style: "text-align: center;" }
            }
        ];
    }

});