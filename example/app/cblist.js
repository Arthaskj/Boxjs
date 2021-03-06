﻿/* ========================================================================
 * 作者：    牟攀
 * 创建日期：2018-4-19
 * 描述：    现券买卖界面js文件，主要用来生成现券买卖界面
 * ======================================================================== */

Box.define('App.cblist', {
    name: '银行间现券买卖交易信息',

    requires: [
        // 'HY.sysmgr.bond.bondwindow',
        // 'HY.sysmgr.bond.bonddetail',
        // // 'HY.trademgr.cashbonds.split',
        // 'HY.trademgr.commontrade.split'
    ],

    extend: 'Box.GridPage',


    // branch: {
    //     "HX": "去除合并拆分按钮",
    //     "KY": "增加波段组合调仓功能"
    // },

    ajaxUrl: "/api/IbCashBondTrade/GetTradeList",

    delegates: {
        'click {.edit-info}': 'doDetail',
        'click {a.transformToRequest}': 'fnTransformToRequest'
    },

    $params: {
        bondkey: '',
    },
    isfiltersArray: false,
    table_search: [
        {
            name: 'TradeTime', //这个name后面会用作查询条件的field,所以需要跟字段名一样
            text: '成交时间',
            type: 'rangeDate',
            field: [ ///对应的传到后台的字段，只支持两个字段
                'StartDate',
                'EndDate'
            ]
            // value: {
            //     startDate: Box.Format.renderDate(new Date().addDays(-7)),
            //     endDate: Box.Format.renderDate(new Date())
            // }
        },
        {
            name: 'ExecId',
            text: '成交单编号',
            type: 'text',
            operator: 'contains',
            isAdvanced: true,

        },
        {
            name: 'BondKey',
            text: '债券代码',
            type: 'text',
            operator: 'contains',
            isAdvanced: true

        },
        {
            name: 'CounterParty',
            text: '对手方',
            type: 'text',
            operator: 'contains',
            isAdvanced: true,

        },
        //todo:以后权限加上了 再还原
        // {
        //     name: 'Traders',
        //     text: '交易员',
        //     type: 'dropdownselect',
        //     operator: 'eq',
        //     isAdvanced: true,
        //
        // },
        {
            name: 'AgencyAccountNames',
            text: '本方机构',
            operator: 'contains',
            type: 'dropdownselect',
            isAdvanced: true
        },
        {
            name: 'Portfolios',
            text: '组合',
            operator: 'contains',
            type: 'dropdownselect',
            isAdvanced: true
        },
        {
            name: 'DealSides',
            text: '交易方向',
            type: 'dropdownselect',
            operator: 'eq',
            // renderData: Box.HY.DicHelper.getDicOfCashBondSide(),
            isAdvanced: true
        },
        {
            name: 'AssignStates', //这个name后面会用作查询条件的field,所以需要跟字段名一样
            text: '入仓状态',
            type: 'dropdownselect', // text radioBtn checkbox date
            operator: 'eq',
            // renderData: Box.HY.DicHelper.getDicOfAssignStatus().remove("x=>x.text=='申请单已生成'"),
            isAdvanced: true
        }
    ],

    //渲染机构账户选择控件
    initAgencyAccountNamesFilter: function (filter) {
        filter.ddselect = filter.target.find('input').HYDropDownSelect({
            name: "机构账户",
            selectDir: true,
            selectType: 'multi',
            showFilter: true,
            selectAll: true,
            dataConfig: {
                "text": "AliasName",
                "value": "AccountName",
                "items": "IID"
            }
        });

        $.ajax({
            type: 'get',
            async: false,
            url: '/api/AgencyAccount/GetAllAgencyAccount',
            success: function (result) {
                filter.ddselect.data(result);
            }
        });
    },

    initTradeTimeFilter: function (filter) {  //根据传入的参数初始化条件

        if (this.$params.StartDate) {
            filter.widgets[0].value(this.$params.StartDate);
        }
        if (this.$params.EndDate) {
            filter.widgets[1].value(this.$params.EndDate);
        }
    },

    //渲染组合选择控件
    initPortfoliosFilter: function (filter) {
        filter.ddselect = filter.target.find('input.' + filter.name).HYSelectPortfolio({
            attributes: {"width": "100%"},
            selectDir: true
        });
    },
    //渲染交易员选择控件
    initTradersFilter: function (filter) {
        filter.ddselect = filter.target.find('input.' + filter.name).HYSelectAuthDeptUserName({
            attributes: {"width": "88%"},
            NeedTrader: true
        });
    },


    table_order: [
        {
            field: 'AssignState',
            dir: 'ASC'
        },
        {
            field: 'TradeTime',
            dir: 'DESC'
        }
    ],
    //table_showselectall: true,
    table_selectable: 'multi',
    table_columns: [
        {
            field: "Text",
            title: "操作",
            width: "40px",
            sortable: false,
            // hidden: !HY.Context.IsDebug,
            headerAttributes: {
                "data-noexport": true,
                "style": "text-align: center;"
            },
            attributes: {
                "data-noexport": true,
                "style": "text-align: center;"
            },
            template: function (dataItem) {
                var str = "";
                str += " <a href='javascript:void(0);' class='transformToRequest td-tool-btn' title='生成申请单'  data-execId = #: ExecID#> <span class='fa fa-random' ></span></a>";
                //return (Box.HY.DicHelper.formatDicForAssignStatus(dataItem.AssignState) == "未入仓" ? str : "<a href='javascript:void(0);' class='td-tool-btn' title='不可生成申请单'  data-execId = #: ExecID#> <span class= 'fa fa-random' style='color: darkgrey;'></span></a>");
                return str;
            }
        },
        {
            field: "ExecID",
            title: "成交单编号",
            width: "140px",
            headerAttributes: {
                style: "text-align: center;"
            },
            template: '<a data-operationtype="1" href="\\#trademgr/cashbonds/cbdetail?allDisabled=true&execid=#: ExecID#">#: ExecID#</a>'

        },
        {
            field: "AssignState",
            title: "入仓状态",
            width: "80px",
            headerAttributes: {
                style: "text-align: center;"
            },
            template: function (dataItem) {
                return Box.HY.DicHelper.formatDicForAssignStatus(dataItem.AssignState);
            }
        },
        {
            field: "BondKey",
            title: "债券代码",
            width: "100px",
            headerAttributes: {
                style: "text-align: center;"
            },
            template: '<a href="javascript:void(0)" class="edit-info" title="查看债券明细">#:BondKey#</a>'
        },
        {
            field: "BondName",
            title: "债券简称",
            width: "130px",
            headerAttributes: {
                style: "text-align: center;"
            }
        },
        {
            field: "LastQty",
            title: "券面总额(万元)",
            width: "120px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N0"
            },
            // template: function (dataItem) {
            //     return Box.Format.renderWanYuan(dataItem.LastQty);
            // }
        },
        {
            field: "TradeTime",
            title: "成交时间",
            width: "150px",
            headerAttributes: {
                style: "text-align: center;"
            },
            template: function (dataItem) {
                return dataItem.TradeTime;
            }
        },
        {
            field: "SettleDate",
            title: "首次结算日",
            width: "110px",
            headerAttributes: {
                style: "text-align: center;"
            },
            // template: function (dataItem) {
            //     return Box.Format.renderDate(dataItem.SettleDate);
            // }
        },
        {
            field: "Side",
            title: "交易方向",
            width: "70px",
            headerAttributes: {
                style: "text-align: center;"
            },
            template: function (dataItem) {
                return Box.HY.DicHelper.formatDicForCashBondSide(dataItem.Side);
            }
        },
        {
            field: "ClnPrc",
            title: "净价",
            width: "80px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N4"
            }
            // template: function (dataItem) {
            //     return Box.Format.renderNumric(dataItem.ClnPrc, 4);
            // }
        },
        {
            field: "DrtPrc",
            title: "全价",
            width: "80px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N4"
            },
            // template: function (dataItem) {
            //     return Box.Format.renderNumric(dataItem.DrtPrc, 4);
            // }
        },
        {
            field: "Yield",
            title: "到期收益率(%)",
            width: "100px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N4"
            }
            // template: function (dataItem) {
            //     return Box.Format.renderPercent(dataItem.Yield, 4);
            // }
        },
        {
            field: "TradeCashAmt",
            title: "交易金额(元)",
            width: "120px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N2"
            }
            // template: function (dataItem) {
            //     return Box.Format.renderNumric(dataItem.TradeCashAmt, 2);
            // }
        },
        {
            field: "SettleCurrAmt",
            title: "结算金额(元)",
            width: "120px",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                style: "text-align: right;",
                'data-format': "N2"
            },
            // template: function (dataItem) {
            //     return Box.Format.renderNumric(dataItem.SettleCurrAmt, 2);
            // }
        },
        {
            field: "CounterParty",
            title: "对手方",
            width: "160px",
            headerAttributes: {
                style: "text-align: center;"
            },
        },
        {
            field: "SelfQuoterName",
            title: "本方交易员",
            width: "80px",
            headerAttributes: {
                style: "text-align: center;"
            }
        },
        {
            field: "SelfAgency",
            title: "本方机构",
            width: "200px",
            headerAttributes: {
                style: "text-align: center;"
            }
        }
    ],

    table_buttons: [
        {
            text: '合并', //按钮显示的文字
            icon: 'fa fa-download', //使用fontawesome的图标,
            handler: 'mergeDealInfo',//点击按钮的处理函数
            name: 'mergeCashBond', //按钮的名字,需要唯一,这个属性一定要设置
            theme: "k-info", //k-info,k-info,k-success,k-warning,k-danger
            hidden: false
        },
        {
            text: '拆分', //按钮显示的文字
            icon: 'fa fa-share-alt', //使用fontawesome的图标,
            handler: 'splitDealInfo',//点击按钮的处理函数
            name: 'splitCashBond', //按钮的名字,需要唯一,这个属性一定要设置
            theme: "k-info", //k-info,k-info,k-success,k-warning,k-danger
            hidden: false
        }
    ],

    beforeSetup: function () {
        this.table_selectable = this.$params.OperationType == 0 ? false : 'multi';
        this.table_buttons = this.$params.OperationType == 0 ? [] : this.table_buttons;
    },

    table_fnEnable: function (dataItem) {
        return dataItem.AssignState == 0;

    },

    initCounterPartyFilter: function (filter) {
        var option = Box.apply({}, null, {
            dataTextField: 'Name',
            template: ' #= Name#'
        });
        filter.target.find('input').HYAutoAgency(option, null);
    },

    initBondKeyFilter: function (filter) {
        filter.target.find('input').HYAutoBond({
            fixValue: false,
            selectFirstWhenClose: false,
            dataTextField: 'BondKey'
        }, {isAllowMat: true});
    },

    fnRefreshGrid: function () {
        this.fnRefresh();
    },

    onChange: function (e) {
        console.log(this.getSelectedRows());
    },
    onDataBound: function () { //默认全部收起来
        //this.gridpage.expandRow(this.gridpage.tbody.find("tr.k-master-row").first()); //展开首行
        //    this.gridpage.expandRow(this.gridpage.tbody.find("tr.k-master-row"));//全部打开
    },

    doDetail: function (e, target) {
        var bondkey = target.text();
        if (bondkey != "") {
            me = this;
            me.$params.bondkey = bondkey;
            var win = new HY.sysmgr.bond.bondwindow({
                hideBack: true,
                $params: this.$params,
            });
        }
    },

    init: function () {
        //当有参数传入的时候,自动刷新列表
        Box.Notify.info('fdafdsafdsaf');
        if (this.$params.StartDate || this.$params.EndDate) {
            this.fnSearch();
        }
    },

    //mergeCashBond: function () {
    //    return {
    //        name: "合并",
    //        handler: function () { this.mergeDealInfo(); }
    //    };
    //}(),

    //splitCashBond: function () {
    //    return {
    //        name: "拆分",
    //        handler: function () { this.splitDealInfo(); }
    //    };
    //}(),

    //enableExport: function() {
    //    return {
    //        name: "导出成交单",
    //        handler: function() { this.exportHandler("xls"); }
    //    };
    //}(),

    enableExport: true,

    //enableExportCsv: function() {
    //    return {
    //        name: "CSV",
    //        handler: function() { this.exportHandler("csv"); }
    //    };
    //}(),

    exportHandler: function (format) {
        this.allData(function (data) {
            var selfCountorparty = HY.Context.SelfCounterParty;

            this.tmpgrid = $("<div>").HYGrid({
                filterable: false,
                pageable: false,
                columns: [
                    {field: "ExecID", title: "成交单编号",},
                    {field: "SelfQuoterName", title: "本方交易员",},
                    {title: "本方", template: selfCountorparty},
                    {field: "CounterPartyShortName", title: "对手方",},
                    {title: "对手方主机构",},
                    {field: "CounterPartyName", title: "对手方交易员",},
                    {field: "Side", title: "交易方向", values: Box.HY.DicHelper.getDicOfCashBondSide()},
                    {field: "BondCode", title: "债券代码",},
                    {field: "BondName", title: "债券简称",},
                    {title: "对手方来源",},
                    {
                        field: "ClnPrc",
                        title: "净价(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N4"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.ClnPrc, 4, " ");
                        // },
                    },
                    {
                        field: "Yield",
                        title: "到期收益率(%)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N4"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderPercent(dataItem.Yield, 4, " ");
                        // },
                    },
                    {title: "行权收益率(%)",},
                    {
                        field: "LastQty",
                        title: "券面总额(万元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N0"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderWanYuan(dataItem.LastQty, 0, " ");
                        // },
                    },
                    {
                        field: "TradeCashAmt",
                        title: "交易金额(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N2"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.TradeCashAmt, 2, " ");
                        // },
                    },
                    {
                        field: "SettleDate",
                        title: "结算日",
                        attributes: {"data-format": "D-"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderDate(dataItem.SettleDate);
                        // }
                    },
                    {
                        field: "AccruedInterestAmt",
                        title: "应计利息(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N5"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.AccruedInterestAmt, 5, " ");
                        // },
                    },
                    {
                        field: "DrtPrc",
                        title: "全价(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N4"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.DrtPrc, 4, " ");
                        // },
                    },
                    {
                        field: "TotAcruAmt",
                        title: "应计利息总额(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N2"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.TotAcruAmt, 2, " ");
                        // },
                    },
                    {
                        field: "SettleCurrAmt",
                        title: "结算金额(元)",
                        headerAttributes: {style: "text-align: left;"},
                        attributes: {style: "text-align: right;", "data-format": "N2"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderNumric(dataItem.SettleCurrAmt, 2, " ");
                        // },
                    },
                    {field: "DeliveryType", title: "结算方式", values: Box.HY.DicHelper.getDicOfDeliveryType(),},
                    {title: "清算类型"},
                    {title: "净额清算状态"},
                    {title: "补充条款"},
                    {title: "成交状态", template: "正常"},
                    {
                        field: "TradeTime",
                        title: "成交时间",
                        attributes: {"data-format": "DT-"},
                        // template: function (dataItem) {
                        //     return Box.Format.renderDatetime(dataItem.TradeTime);
                        // },
                    },
                    {title: "成交类型",},
                    {title: "成交序列号",},
                    {field: "SecType", title: "债券类型", values: Box.HY.DicHelper.getDicOfBondType(),},
                ]
            }).data("kendoGrid");
            this.tmpgrid.dataSource.data(data);

            var option = {
                table: this.tmpgrid.wrapper,
                fileName: "现券买卖 - 本方成交明细查询",
                ShowTitle: false,
                format: format
            };
            Box.Common.exportToExcel(option);
        });
    },

    mergeDealInfo: function () {
        var me = this;
        var selectedRows = me.gridpage.getSelection();
        var bondKey = selectedRows.select('BondKey');
        var execIds = selectedRows.select('ExecID').join(',');
        var side = selectedRows.select('Side');
        var tradeTime = selectedRows.select('TradeTime');
        var settleDate = selectedRows.select('SettleDate');
        var cleanPrice = selectedRows.select('ClnPrc');

        if (!selectedRows.length) {
            Box.Notify.warning('请选择需要合并的成交单');
            return;
        }
        if (selectedRows.length < 2) {
            Box.Notify.warning('至少选择两个成交单进行合并');
            return;
        }

        if (execIds.indexOf("_HB") > 0) {
            Box.Notify.warning('已合并的成交单不能再合并！');
            return;
        }

        for (var i = 1; i < bondKey.length; i++) {
            if (bondKey[i] != bondKey[i - 1]) {
                Box.Notify.warning('请选择债券代码一致的成交单');
                return;
            }
            if (side[i] != side[i - 1]) {
                Box.Notify.warning('请选择交易方向一致的成交单');
                return;
            }
            if (tradeTime[i].substring(0, 10) != tradeTime[i - 1].substring(0, 10)) {
                Box.Notify.warning('请选择交易日期一致的成交单');
                return;
            }
            if (settleDate[i].substring(0, 10) != settleDate[i - 1].substring(0, 10)) {
                Box.Notify.warning('请选择结算日期一致的成交单');
                return;
            }
            if (cleanPrice[i] != cleanPrice[i - 1]) {
                Box.Notify.warning('请选择净价一致的成交单');
                return;
            }
        }

        Box.ConfirmDialog.show({
            message: '确定要合并选择的成交单吗?',
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: '/api/IbCashBondTrade/MergeTrades',
                        contentType: 'application/json',
                        data: JSON.stringify({Data: execIds}),
                        //async: false,
                        success: function (results) {
                            Box.HY.Page.hideLoader();
                            if (results.IsSuccess) {
                                Box.Notify.success('合并成功');
                                me.fnRefreshGrid();
                            }
                            else {
                                Box.Notify.warning("合并失败");
                            }

                        },
                        error: function (e) {
                            Box.HY.Page.hideLoader();
                        }

                    });
                }
            }
        });

    },

    splitDealInfo: function () {
        var me = this;
        var selectedRows = this.gridpage.getSelection();
        if (!selectedRows.length) {
            Box.Notify.warning('请选择需要拆分的成交单');
            return;
        }
        if (selectedRows.length > 1) {
            Box.Notify.warning('请只选择一个成交单进行拆分');
            return;
        }
        var execId = selectedRows.select('ExecID')[0];
        var lastqty = selectedRows.select('LastQty')[0];
        var url = "/api/IbCashBondTrade/SplitTrade";

        if (execId.indexOf("_CF") > 0) {
            Box.Notify.warning('已拆分的成交单不能再拆分！');
            return;
        }
        if (execId.indexOf("_HB") < 0) {
            Box.Window.show({
                init: function () {
                    this.detail = new HY.trademgr.commontrade.split({//new HY.trademgr.cashbonds.split
                        renderTo: this.el.content,
                        execId: execId,
                        lastqty: lastqty,
                    });
                },
                actions: ["Close"],
                resizable: false,
                resizeable: false,
                width: 500,
                height: 200,
                title: '拆分成交单',
                icon: 'fa-crosshairs',
                buttons: [
                    {name: 'btn_Save', text: '保存', icon: 'fa-check', theme: "k-info", handler: 'fnSave'},
                    {name: 'btn_Close', text: '关闭', icon: 'fa-times', handler: 'fnClose'}
                ],
                fnSave: function () {
                    var window = this;
                    var faceamts = this.detail.fnGetSplitList();

                    if (faceamts && faceamts.length) {
                        $.ajax({
                            url: "/api/IbCashBondTrade/SplitTrade",
                            type: 'post',
                            dataType: "json",
                            contentType: "application/json",
                            data: Box.util.JSON.doEncode({Data1: execId, Data2: faceamts}),
                            success: Box.bind(function (result) {
                                if (result.IsSuccess) {
                                    Box.Notify.success("拆分成功");
                                    window.fnClose();
                                    me.fnRefresh();
                                } else {
                                    Box.Notify.warning("拆分失败");
                                }
                            }, this),
                        });
                    }
                }
            });
        } else {
            $.ajax({
                url: "/api/IbCashBondTrade/SplitTrade",
                type: 'post',
                dataType: "json",
                contentType: "application/json",
                data: Box.util.JSON.doEncode({Data1: execId, Data2: null}),
                success: Box.bind(function (result) {
                    if (result.IsSuccess) {
                        Box.Notify.success("拆分成功");
                        me.fnRefreshGrid();
                    } else {
                        Box.Notify.warning("拆分失败");
                    }
                }, this),
            });
        }
    },

    fnTransformToRequest: function (e, target) {
        var row = $(target).closest("tr");
        var data = this.gridpage.dataItem(row); //当前行数据

        var requestInfoResult = {
            RequestType: 1,
            DealType: 223,
            TradeMarket: Box.HY.DicHelper.getKeyOfTradeMarket(Box.HY.DicHelper.formatDicForMarketCode(data.MarketCode)),
            RequestState: 0,
            RequestUser: HY.Context.UserName,
            RequestDate: Box.Format.renderDate(new Date()),
        };
        var cashBond = {
            RequestSubNo: this._generateRequestNo("PreRequestCashBond"),
            DealType: 223,
            DealSide: data.Side,
            AssignInfos: [],
            CreatedUser: HY.Context.UserName,
            CreatedTime: Box.Format.renderDate(new Date()),
            DeliveryType: data.DeliveryType,
            SettleDate: data.SettleDate,
            SettleCurrAmt: data.SettleCurrAmt,
            SelfQuoterName: data.SelfQuoterName,
            TradeDate: data.TradeTime,
            SettleType: Box.Format.renderDate(data.SettleDate) == Box.Format.renderDate(data.TradeTime) ? 1 : 2,
            Yield: data.Yield,
            BondCode: data.BondCode,
            BondName: data.BondName,
            BondKey: data.BondKey,
            BondProperty: null,
            CleanPrice: data.ClnPrc,
            DirtyPrice: data.DrtPrc,
            MarketCode: data.MarketCode,
            TotalFaceAmt: data.TradeCashAmt * 100 / data.ClnPrc,
            TradeCashAmt: data.TradeCashAmt,
            CounterParty: data.CounterParty,
            CounterPartyTrader: data.CounterPartyName,
            AccruedInterest: data.AccruedInterestAmt,
            TotalAIAmt: data.TotAcruAmt
        };

        requestInfoResult.RequestCashBonds = [cashBond];
        Box.HY.Page.gotoPage2('traderequest.partail.request', function (page) {
            page.fnSetRequestInfo(requestInfoResult, "cbtraderlist");
        });
    },

    //产生申请单编号
    _generateRequestNo: function (prefix) {

        var requestNo = "";
        $.ajaxSettings.async = false;
        //获取申请单编号
        $.getJSON('/api/RequestMgr/Request/GenerateSN/?prefix=' + prefix, function (data) {
            requestNo = data;
        });
        $.ajaxSettings.async = true;

        return requestNo; //+ this.statics().CASHBOND_IID++;
    },
});