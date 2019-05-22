
Box.define('Demo.report.checkin', {

    name: "持仓组合分析报表",
    extend: 'Demo.report.common.groupreport',
    delegates: {
        'click {td a.k-icon}': '_ExpandRows'
    },
    gridColumns: [
        {
            field: "BondKey",
            title: "债券代码",
            sortable: true,
            locked: true,
            headerAttributes: {
                style: "text-align: center;"
            },
            width: "240px"
        },
        {
            field: "BondName",
            title: "债券简称",
            locked: true,
            headerAttributes: {
                style: "text-align: center;"
            },
            width: "240px"
        },
        {
            field: "HoldAmt",
            title: "面额(万元)",
            locked: true,
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                "data-format": "N2",
                "style": "text-align: right;"
            },
            template: function (dataItem) {
                return '<div align="right">' + Box.Format.renderWanYuan(dataItem.HoldAmt, 2) + '</div>';
            },
            width: "230px"
        },

        {
            field: "PortfolioName",
            title: "组合",
            locked: true,
            headerAttributes: {
                style: "text-align: center;"
            },
            width: "250px"
        },


        {
            field: "L2SecType",
            title: "债券类型",
            locked: true,
            headerAttributes: {
                style: "text-align: center;"
            },
            template: function (dataItem) {
                if (dataItem.L2SecType) {
                    return dataItem.L2SecType;
                } else if (dataItem.L2SecType == null) {
                    return Box.HY.DicHelper.formatDicForBondType(dataItem.L2SecType || 0);
                }
            },
            width: "250px"
        },

        {
            field: "MarketValueByCleanPrice",
            title: "净价市值(万元)",
            headerAttributes: {
                style: "text-align: center;"
            },
            attributes: {
                "data-format": "N2",
                "style": "text-align: right;"
            },
            template: function (dataItem) {
                return '<div align="right">' + Box.Format.renderWanYuan(dataItem.MarketValueByCleanPrice, 2, '--') + '</div>';
            },
            width: "230px"
        }
    ],

    _ExpandRows: function (e, target) {

        var tr = $(target).closest('tr');

        tr.nextUntil(".k-grouping-row").toggle();
        var a = tr.find("a.k-icon");
        if ($(a).attr("class").indexOf("k-i-expand") >= 0) {
            a.removeClass("k-i-expand");
            a.addClass("k-i-collapse");
        } else {
            a.removeClass("k-i-collapse");
            a.addClass("k-i-expand");
        }

        var index = tr.prop("rowIndex");
        var ctr = this.grid.table.find("tr:eq(" + index + ")");
        ctr.nextUntil(".k-grouping-row").toggle();
        return false;

    }
});