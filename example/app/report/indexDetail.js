
Box.define('Demo.report.indexDetail', {
    requires: [
        'Demo.report.checkin'
    ],

    name: "持仓分析",

    extend: 'Box.Component', //只能继承一个

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    elements: {
        search: '.search',
        cont: '.cont',
        button:'.button',
        text:'.text'
    },

    events:{
        'click button':'checkFile'
    },

    groupName: "PortfolioName",

    templates: {
        main: [
            '<div class="hyreport" style="margin-left: 50px;margin-top: 30px;">' +
            '<div class="search"></div>' +
            '<div class="cont"></div>' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div> ' +
            '</div>'
        ]
    },
    sortColumn: "BondKey",
    dir: "desc",

    groupConfig: [
        "FaceAmt",
        "HoldAmt",
        "MarketValueByCleanPrice",
        "MarketValueByDrityPrice"
    ],
    com_radios: null,
    com_toolbar: null,
    com_detail: null,

    com_chart: null,
    com_window: null,
    chartValues: null,
    choice: "PortfolioName",

    setup: function () {
        var me = this;

        this.com_radios = new Box.Panel({
            $params: this.$params,
            title: '持仓分析明细',
            icon: 'fa-user',
            buttons:[
                {
                    name:"export",
                    text:"导出",
                    disable: false, //是否禁用按钮
                    icon: 'fa fa-download', //fontawsome的图标
                    display: true,//是否显示按钮
                    scope:me,
                    handler:me.fnExport//点击按钮的处理函数,
                }
            ],
            renderTo: this.el.cont,
            onFullscreen: function () {//全屏的时候,让报表撑满整个屏幕
                me.com_detail.grid.wrapper.css('height', '100%');
                me.com_detail.grid.resize();
            },
            onRestore: function () { //还原的时候,回归最初设置的高度
                me.com_detail.grid.wrapper.css('height',  Box.Common.fnGeReportDetailHeight(me.com_detail.isPageHead) + me.com_detail.adjustHeight);
                me.com_detail.grid.resize();
            }

        });


        this.com_detail = new Demo.report.checkin({
            $params: this.$params,
            renderTo: this.com_radios.el.content,
            groupName: this.groupName,
            sortColumn: this.sortColumn,
            dir: this.dir,
            data:[
                {BondKey:"Z001",BondName:"14国债",HoldAmt:3,PortfolioName:"",L2SecType:"0",MarketValueByCleanPrice:5},
                {BondKey:"Z002",BondName:"15国债",HoldAmt:5,PortfolioName:"",L2SecType:"1",MarketValueByCleanPrice:5},
                {BondKey:"Z003",BondName:"16国债",HoldAmt:3,PortfolioName:"",L2SecType:"1",MarketValueByCleanPrice:5},
                {BondKey:"Z004",BondName:"17国债",HoldAmt:6,PortfolioName:"",L2SecType:"0",MarketValueByCleanPrice:5},
                {BondKey:"Z005",BondName:"18国债",HoldAmt:3,PortfolioName:"",L2SecType:"1",MarketValueByCleanPrice:5},
                {BondKey:"Z006",BondName:"19国债",HoldAmt:2,PortfolioName:"",L2SecType:"0",MarketValueByCleanPrice:5}
            ],
            filter:{},

            groupConfig: this.groupConfig
        });

    },

    fnExport: function () {
        var queryParams = this.com_toolbar.fnGetParams();
        var option = {
            grid: this.com_detail.grid,
            fileName: this.name,
            params: [queryParams.calDateTimeS],
            ShowTitle: true
        };
        Box.Common.exportToExcel(option);

    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/report/common/groupreport.js');
    }
});