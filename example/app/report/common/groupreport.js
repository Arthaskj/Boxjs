/* ========================================================================
 * 作者：    牟攀
 * 创建日期：2018.1.22
 * 描述：    分组报表,新支持钻取功能
 * DataSource的aggregates属性已经被我征用,请不要使用
 * todo: 已经可以支持grid的Multi-column headers功能,但是子columns不能进行从排序,没有保存这个信息
 * ======================================================================== */
Box.define('Demo.report.common.groupreport', {
    extend: 'Box.Component',

    flag: null,

    grid: null,

    data: null,

    templates: {
        main: [
            '<div ><div class="search"></div>' +
            '<div class="reportlist"></div>' +
            '<div style="margin-top: 10px"></div>'+
            '</div>'
        ]
    },

    elements: {
        search: ".search",
        list: '.reportlist'
    },

    dir: null,
    sortColumn: null,

    sortable: true,

    sortFields: null,

    showFooter: true,

    groupData: null,

    filterable: false,

    isSupportCustom: true,//这个属性设置是否支持用户自定义(包含自定义分组、列的数量和列的排序),
    //注意:如果启用了,列就不能支持locked属性,因为现在加了locked列,kendo自己也会处理相应的列,会有冲突,等kendo什么时候加上了列调整完成后触发的事件可以解决这个问题,现在的columnReorder事件是在调整完成之前触发的,不能满足要求

    isPortfolioTree: true, //设置个该报表是否是组合数报表，只有在isSupportCustom为true的时候才有效，控制切换组合数报表和用户自定义分组，组合数报表跟用户自定义分组是冲突的，不能同时支持。

    groupConfig: [],//注意：有些分组求和的项是分格显示的，需要特殊处理，见HY.report.expireback.expireback
    // 加权示例

    groupName: null, // 这个配置以前是字符串,只能传入一个字段,现在为了能支持数据钻取,改成了支持数组
    //支持数组如下
    // groupName: [
    //     {
    //         dir: "asc",
    //         field: "PortfolioName"
    //     },
    //     {
    //         dir: "asc",
    //         field: "BondType"
    //     }
    // ],

    gridColumns: [],

    // 示例:
// {
//     field: "BondKey",
//     title: "债券代码、市场",
//     sortable: true,
//     locked: true,
//     width: "120px",
//     default:true,  //其中的default参数,控制是否默认显示
//
// },

    isPageHead: true,

    isTotalDisplay: false,

    expand: true,

    adjustHeight: -33,//调整table的高度适应不同的页面

    delegates: {
        ".customColumns": "_customColumns",
        ".resetColumns": "_resetColumns"
    },

    _saveUserReportPrefer: function (saveColumns, callback) {
        var me = this;
        if (!saveColumns) {
            saveColumns = [];
            Box.Array.forEach(me.gridColumns, function (col) {
                if (col && col.title && col.hidden != true) { //只存储有title的列，没有的代表不需要展示，可能有其他作用的
                    saveColumns.push({
                        field: col.field,
                        title: col.title,
                        hidden: false
                    });
                }
            })
        }
        //发送保存请求
        $.ajax({
            //url: 'api/System/SaveUserReportPrefer',
            type: 'POST',
            async: false,
            data: {
                IID: me.__preferID,
                ReportName: me.$className,//用className作为报表的唯一名字,
                PreferName: '偏好1',
                ColumnStyle: JSON.stringify(saveColumns),
                GroupStyle: me.isPortfolioTree ? '{}' : JSON.stringify(me.groupName),
            },
            success: function (result) {
                if (result) {
                    me.__preferID = result;
                }
                Box.isFunction(callback) && callback.call(this, result);
            }
        });
    },

    _resetColumns: function () {
        var me = this;

        Box.ConfirmDialog.show({
            message: '重置将删除当前配置的报表偏好，确定要重置吗?',
            callback: function (result) {
                if (result) {
                    me.gridColumns = Box.clone(me.__gridColumns);
                    me.groupName = Box.clone(me.__groupName);
                    me.isPortfolioTree = me.__isPortfolioTree;

                    //删除存储的用户偏好
                    $.ajax({
                        //url: 'api/System/DeleteUserReportPrefer',
                        async: false,
                        type: 'get',
                        data: {
                            id: me.__preferID
                        },
                        success: function (result) {
                            me.__preferID = 0;
                        }
                    });

                    me.fnRefresh();
                }
            }
        });
    },

    //自定义列的显示与顺序
    _customColumns: function () {
        var me = this;
        Box.Window.show({
            init: function () {
                var listBoxTpl = $('<div>' +
                    '<div class="reminder"  style="margin-bottom: 6px"></div>' +
                    '<label style="width: 50%;display: inline-block;">显示列</label>' +
                    '<label >隐藏列</label> <br/>' +
                    '            <select style="width:50%;height: 360px" id="CustomColumnsSelected"></select>' +
                    '            <select style="width:49%;height:360px" id="CustomColumnsHide" ></select>' +
                    '        </div>');
                this.el.content.append(listBoxTpl);

                Box.Reminder.show({
                    renderTo: this.el.content.find('.reminder'),
                    message: '左右拖动定制显示/隐藏列，上下拖动调整列的显示顺序',
                    name: 'HY.report.common.groupreport.customColumnsReminder'//在整个系统里面必须是唯一的,否则可能出现显示不正常的问题
                });


                //先去数据库请求看看当前用户之前是否定制过列,如果没有的话,就根据代码的配置默认显示
                var selectedColumns = [];
                var hideColumns = [];

                //ajax请求配置
                $.ajax({
                    //url: 'api/System/GetUserReportPrefers',
                    async: false,
                    data: {
                        reportName: me.$className//用className作为报表的唯一名字
                    },
                    success: function (result) {
                        if (result.length) {
                            selectedColumns = JSON.parse(result[0].ColumnStyle);
                        }
                    }
                });

                if (selectedColumns.length) {
                    Box.Array.forEach(me.__gridColumns, function (col) {
                        if (!selectedColumns.first('x=>x.title=="' + col.title + '"')) {
                            hideColumns.push({
                                field: col.field,
                                title: col.title,
                                hidden: true
                            });
                        }
                    }, this)
                } else {
                    Box.Array.forEach(me.__gridColumns, function (col) {
                        if (Box.isDefined(col.default) && !col.default) {  //如果没有指定default属性,就默认为展示
                            hideColumns.push({
                                field: col.field,
                                title: col.title,
                                hidden: true
                            });
                        }
                        else {
                            selectedColumns.push(
                                {
                                    field: col.field,
                                    title: col.title,
                                    hidden: false
                                }
                            )
                        }
                    }, this)

                }

                //显示列
                this.selected = listBoxTpl.find('#CustomColumnsSelected').kendoListBox({
                    draggable: true,
                    connectWith: "CustomColumnsHide",
                    dropSources: ["CustomColumnsHide"],
                    dataSource: selectedColumns,
                    dataTextField: "title",
                    dataValueField: "field",
                    add: function (e) {
                        // handle event
                        Box.Array.forEach(e.dataItems, function (item) {
                            item.hidden = false;
                        })
                    }
                }).data('kendoListBox');

                //隐藏列
                this.hide = listBoxTpl.find('#CustomColumnsHide').kendoListBox({
                    draggable: true,
                    connectWith: "CustomColumnsSelected",
                    dropSources: ["CustomColumnsSelected"],
                    dataSource: hideColumns,
                    dataTextField: "title",
                    dataValueField: "field",
                    add: function (e) {
                        Box.Array.forEach(e.dataItems, function (item) {
                            item.hidden = true;
                        })
                    }
                    // toolbar: {
                    //     tools: ["moveUp", "moveDown", "transferTo", "transferFrom", "transferAllTo", "transferAllFrom", "remove"]
                    // }
                }).data('kendoListBox');
            },
            actions: [
                "Close"
            ],
            title: "定制列",
            // autoOpen: false,
            resizable: false,
            closeAction: 'destroy',
            width: 633,
            height: 500,
            buttons: [
                {
                    name: 'btn_Save',
                    text: '保存',
                    icon: 'fa-check',
                    theme: "k-info",
                    // disable: true,
                    handler: function () {
                        var wid = this;
                        var saveColumns = [];

                        var selectedColumns = [];

                        //对选择的列进行排序
                        Box.Array.forEach(this.selected.items(), function (i) {
                            selectedColumns.push(this.selected.dataItem(i).toJSON());
                        }, this);

                        saveColumns = Box.Array.insert(saveColumns, 0, selectedColumns);
                        // saveColumns = Box.Array.insert(saveColumns, 0, this.hide.dataItems().toJSON());

                        //判断当前的分组设置是否有相应的column,如果没有就删除相应的分组
                        Box.Array.forEach(me.groupName, function (group) {
                            if (!saveColumns.first('x=>x.title=="' + group.title + '"')) {
                                Box.Array.remove(me.groupName, group);
                            }
                        });

                        me._saveUserReportPrefer(saveColumns, function (result) {
                            if (result) {
                                Box.Notify.success('保存成功!');

                                // Box.Notify.error('数据有重复，更新失败');


                                //控制列的显示隐藏,同时调整列的顺序,   同时控制分组的显示隐藏
                                // var __gridColumns = Box.Array.clone(me.gridColumns);
                                me.gridColumns = [];
                                // me.groupName = [];

                                Box.Array.forEach(selectedColumns, function (col) {
                                    var gridCol = me.__gridColumns.first('x=>x.title=="' + col.title + '"');
                                    // if (gridCol && !gridCol.hidden) {
                                    me.gridColumns.push(gridCol);

                                    // var gName = me.__groupName.first('x=>x.title=="' + col.title + '"');
                                    // gName && me.groupName.push(gName);

                                }, this);

                                me.fnRefresh();

                                wid.fnClose();
                            }
                            else {
                                Box.Notify.warning('保存失败!');
                            }

                        });

                    }
                },
                {
                    name: 'btn_ Close',
                    text: '关闭',
                    handler: 'fnClose'
                }
            ]
        });
    },

    setup: function () {
        var me = this;

        this.groupName = Box.isString(this.groupName) && this.groupName ? [{field: this.groupName}] : this.groupName;//groupName统一为数组处理

        //备份gridColumns和groupName以便后面重置
        this.__gridColumns = Box.clone(this.gridColumns);
        this.__groupName = Box.clone(this.groupName);
        this.__isPortfolioTree = this.isPortfolioTree;


        this.fnCustomeInit();


        //用于无分组
        if (this.groupName && !this.isSupportCustom) {
            this.gridColumns.push({
                field: "noGroup",
                absHidden: true,
                headerAttributes: {"data-noexport": true},
                attributes: {"data-noexport": true},
                hidden: true
            });
        }

        this.fnRefresh();
    },

    //可以自己初始化一些东西
    fnCustomeInit: Box.emptyFn,

    _calcGroupAggregates: function (aggregate) {
        if (aggregate.hasSubgroups) {

            // this._calcGroupAggregates(aggregate.items)
            Box.Array.forEach(aggregate.items, function (item) {
                this._calcGroupAggregates(item);
            }, this);

            //对分组的结果进行计算,目前支持累计求和和加权平均
            for (var j = 0; j < this.groupConfig.length; j++) {
                var cfg = this.groupConfig[j];
                //累计求和
                if (Box.isString(cfg)) {
                    if (Box.String.has(cfg, '.')) {//这儿主要是针对单元格里面分格的,具体使用见HY.report.expireback.expireback
                        var cfgArray = cfg.split('.');

                        // aggregate.aggregates[key][cfg] = (this.groupData[key][cfg] || 0) + parseFloat(dataItem[cfgArray[0]].sum('x=>x.' + cfgArray[1]));
                        //
                        // this.total[cfg] = (this.total[cfg] || 0) + parseFloat(dataItem[cfgArray[0]].sum('x=>x.' + cfgArray[1]));

                        if (!aggregate.aggregates[cfg]) {
                            aggregate.aggregates[cfg] = {};
                        }

                        aggregate.aggregates[cfg].sum = aggregate.items.sum('x=>x.aggregates["' + cfgArray[0] + '.' + cfgArray[1] + '"].sum');
                    } else {
                        if (!aggregate.aggregates[cfg]) {
                            aggregate.aggregates[cfg] = {};
                        }
                        aggregate.aggregates[cfg].sum = aggregate.items.sum('x=>x.aggregates.' + cfg + '.sum');
                    }
                }
                //加权求和
                if (Box.isObject(cfg)) {
                    //先计算权重求和
                    if (!aggregate.aggregates[cfg.weight]) {
                        aggregate.aggregates[cfg.weight] = {};
                    }
                    if (!aggregate.aggregates[cfg.weight].sum) {//如果已经有了就不再重复计算
                        aggregate.aggregates[cfg.weight].sum = aggregate.items.sum('x=>x.aggregates.' + cfg.weight + '.sum');
                    }

                    //再计算加权平均
                    if (!aggregate.aggregates[cfg.name]) {
                        aggregate.aggregates[cfg.name] = {};
                    }
                    aggregate.aggregates[cfg.name].weightAverage = aggregate.items.sum('x=>x.aggregates.' + cfg.name + '.weightAverage * x.aggregates.' + cfg.weight + '.sum') / aggregate.aggregates[cfg.weight].sum;
                }
            }
        }
        else if (aggregate.hasSubgroups == false) {

            //对分组的结果进行计算,目前支持累计求和和加权平均
            for (var j = 0; j < this.groupConfig.length; j++) {
                var cfg = this.groupConfig[j];
                //累计求和
                if (Box.isString(cfg)) {
                    if (Box.String.has(cfg, '.')) {//这儿主要是针对单元格里面分格的,具体使用见HY.report.expireback.expireback
                        var cfgArray = cfg.split('.');

                        if (!aggregate.aggregates[cfg]) {
                            aggregate.aggregates[cfg] = {};
                        }
                        aggregate.aggregates[cfg].sum = 0;

                        Box.Array.forEach(aggregate.items, function (aggItem) {
                            aggregate.aggregates[cfg].sum += aggItem[cfgArray[0]].toJSON().sum('x=>x.' + cfgArray[1]);
                        });

                        // aggregate.aggregates[cfg].sum = aggregate.items.sum('x=>x.' + cfgArray[0]+'.'+cfgArray[1]);

                    } else {
                        if (!aggregate.aggregates[cfg]) {
                            aggregate.aggregates[cfg] = {};
                        }
                        aggregate.aggregates[cfg].sum = aggregate.items.sum('x=>x.' + cfg);


                    }

                }
                //加权求和
                if (Box.isObject(cfg)) {

                    //先计算权重求和
                    if (!aggregate.aggregates[cfg.weight]) {
                        aggregate.aggregates[cfg.weight] = {};
                    }
                    if (!aggregate.aggregates[cfg.weight].sum) {//如果已经有了就不再重复计算
                        aggregate.aggregates[cfg.weight].sum = aggregate.items.sum('x=>x.' + cfg.weight);
                    }

                    //再计算加权平均
                    if (!aggregate.aggregates[cfg.name]) {
                        aggregate.aggregates[cfg.name] = {};
                    }
                    aggregate.aggregates[cfg.name].weightAverage = aggregate.items.sum('x=>x.' + cfg.name + '*x.' + cfg.weight) / aggregate.aggregates[cfg.weight].sum;

                }
            }
        }
    },

    initGrid: function () {
        this.fnBeforeGroup();

        var me = this;

        var gridHeight = this.grid ? this.grid.wrapper.height() : 0;
        //下面这段代码不要修改,否则在切换分组的时候会出现问题
        this.el.list = $('<div class="reportlist" style="margin-top: -1px;" data-ispagehead="' + this.isPageHead + '" data-adjustheight="' + this.adjustHeight + '"></div>');
        this.el.target.find('.reportlist').remove();
        this.el.target.append(this.el.list);

        var toolbarTpl = this.isSupportCustom ? '<div>' +
            '            <a class="k-button k-button-icontext k-grid-add resetColumns" style="float: right" href="javascript:void(0);"><span class="fa fa-retweet" style="padding-right: 5px;"></span>重置</a>' +
            '            <a class="k-button k-button-icontext k-grid-add customColumns" style="float: right" href="javascript:void(0);"><span class="fa fa-briefcase" style="padding-right: 5px;"></span>定制列</a>' +
            '             <div style="float: right;"><label >分组方式</label>  <div class="isPortfolioTree" style="width: 190px;margin-right:3px;display: inline-block;"></div> </div> ' +
            '<div class=""></div>' +
            '            </div>' : '';

        this.grid = this.el.list.HYGrid({
            toolbar: toolbarTpl,
            groupable: this.isSupportCustom && !this.isPortfolioTree,
            resizable: true,
            reorderable: this.isSupportCustom,
            scrollable: true,
            filterable: this.filterable,
            sortable: this.sortable,
            columns: this.gridColumns,
            height: gridHeight || (this.height ? this.height : Box.Common.fnGeReportDetailHeight(this.isPageHead) + this.adjustHeight),
            group: function (e) {
                // console.log(e);
                me.groupName = e.groups;
                // me.fnBeforeGroup();
                // me.fnRefresh();

                //保存分组
                if (me.isSupportCustom) {

                    me._saveUserReportPrefer();
                }
            },
            columnReorder: function (e) {
                console.log('columnReorder');
                var reorderCol = me.gridColumns[e.oldIndex];
                me.gridColumns = Box.Array.remove(me.gridColumns, reorderCol);
                me.gridColumns = Box.Array.insert(me.gridColumns, e.newIndex, [reorderCol]);
                // me.fnRefresh();

                //获取当前冻结列的列数,因为列的顺序改变,可能改变了冻结列的列数,所以放在这儿判断
                var lockedCount = this.columns.count('locked');
                //从冻结列区域拖动到非冻结列区域
                if (e.oldIndex < lockedCount && e.newIndex >= lockedCount) {
                    lockedCount--;
                } else if (e.oldIndex >= lockedCount && e.newIndex < lockedCount) { //从非冻结区域拖动到冻结区域
                    lockedCount++;
                }


                var groupCount = e.sender._groups();//当前分组字段的个数
                if (me.groupName) {
                    var groups = this.table.find("tr.k-grouping-row:not(.total)");
                    $.each(groups, function () {
                        me.fnRenderGroupRow($(this), groupCount, lockedCount);
                    });
                }
                if (me.groupConfig && me.groupConfig.length && groupCount) {
                    me.fnRenderTotalRow(this, groupCount, lockedCount);
                }

                //保存列的顺序
                if (me.isSupportCustom) {
                    me._saveUserReportPrefer();
                }
            },
            dataBinding: function (e) {
                //在绑定数据前,先把各种分组求和,加权平均等数据算好
                if (this.dataSource.group().length) {
                    console.log('start ' + Box.Format.renderDatetime(new Date()));
                    Box.Array.forEach(this.dataSource.view(), function (aggregate) {
                        me._calcGroupAggregates(aggregate);
                    }, this);

                    console.log('end ' + Box.Format.renderDatetime(new Date()));
                }

            },
            dataBound: function (e) {
                //在重新设置分组的时候,这个事件会命中3次,前两次都可以理解,第三次很奇怪
                //在有冻结列的情况下,实际渲染出来的列,会把冻结列统一渲染到最左边,所以渲染出来的列的顺序跟 最初设置的列顺序 (me.gridColumns)可能会不一样,这里就重新设置一下顺序
                me.gridColumns = Box.clone(this.columns);


                var groupCount = e.sender.dataSource.group().length;//当前分组字段的个数
                if (me.groupName) {
                    var groups = this.table.find("tr.k-grouping-row:not(.total)");
                    $.each(groups, function () {
                        me.fnRenderGroupRow($(this), groupCount);
                    });
                }
                if (me.groupConfig && me.groupConfig.length) {
                    me.fnRenderTotalRow(this, groupCount);
                }
                if (me.fnDataBound && Box.isFunction(me.fnDataBound)) {
                    Box.bind(me.fnDataBound, this)(this);
                }

                me.onAfterDataBound(me);

                //添加Grid行序号
                var rows = this.items();
                $(rows).each(function () {
                    var index = $(this).index() + 1;
                    var rowLabel = $(this).find(".row-number");
                    $(rowLabel).html(index);
                });


                //调整工具栏的位置和样式
                if (me.isSupportCustom && !me.isPortfolioTree) {
                    this.wrapper.find('.k-grouping-header').css('width', '68%').css('display', 'inline-block').css('padding', '10px 0').css('vertical-align', 'top');
                    this.wrapper.find('.k-header.k-grid-toolbar').css('width', '32%').css('display', 'inline-block').css('padding', '9px 0px 11px 0').insertAfter(this.wrapper.find('.k-grouping-header'));
                    this.wrapper.find('.k-grid-content').css('height', '+=50px');
                }

                //初始化分组方式切换工具
                this.wrapper.find(".isPortfolioTree").empty();//这样搞是为了窗体大小变化的时候能正常显示
                this.wrapper.find(".isPortfolioTree").append($('<input/>'));

                Box.Questionreminder.show({
                    message: '自定义：用户可以自己定制根据哪个字段分组<br/>' +
                    '组合树：系统根据组合的父级结构显示报表，不可再根据其他字段分组',
                    renderTo: this.wrapper.find(".isPortfolioTree"),
                    width: 400
                });

                this.wrapper.find(".isPortfolioTree > input").kendoDropDownList({
                    dataSource: [
                        {text: "自定义", value: false},
                       {text: "组合树", value: true}
                        ],
                    dataTextField: "text",
                    dataValueField: "value",
                    value: me.isPortfolioTree,
                    change: function (e) {
                        me.isPortfolioTree = this.value() == "false" ? false : true;
                        me.groupName = [];

                        me._saveUserReportPrefer();
                        me.fnRefresh();
                    }
                });
            }
        }).data("kendoGrid");

    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/report/common/groupreport.js');
    },

    fnRefresh: function (options) {
        var me = this;
        options = options || {};

        this.gridColumns = options.gridColumns || this.gridColumns;

        this.data = options.data || this.data;

        //获取用户自定义偏好
        if (this.isSupportCustom) {
            me.__preferID = 0;
            $.ajax({
                url: 'api/System/GetUserReportPrefers',
                data: {
                    reportName: me.$className//用className作为报表的唯一名字
                },
                async: false,
                success: function (result) {
                    if (result.length) {
                        me.__preferID = result[0].IID;
                        me.gridColumns = [];
                        me.groupName = [];

                        var columnStyle = JSON.parse(result[0].ColumnStyle);
                        var groupStyle = JSON.parse(result[0].GroupStyle);

                        Box.Array.forEach(columnStyle, function (col) {
                            var gridCol = me.__gridColumns.first('x=>x.title=="' + col.title + '"');
                            // if (gridCol && !gridCol.hidden) {
                            gridCol && me.gridColumns.push(gridCol);


                        }, this);

                        if (Box.isArray(groupStyle)) {
                            Box.Array.forEach(groupStyle, function (group) {
                                var gridCol = me.__gridColumns.first('x=>x.field=="' + group.field + '"');
                                if (gridCol && !gridCol.hidden) {
                                    me.groupName.push(group);
                                }

                            }, this);
                            me.isPortfolioTree = false;
                        }
                        else if (Box.isObject(groupStyle)) {
                            me.isPortfolioTree = true;
                        }
                    }
                    else {
                        //把default设置为false的列隐藏
                        Box.Array.forEach(me.gridColumns, function (col) {
                            if (Box.isDefined(col.default) && !col.default) {
                                col.hidden = true;
                            }

                        }, this);
                    }
                }
            })

            //如果设置为组合数报表，处理相应的数据
            if (this.isPortfolioTree) {
                // 如果外面传入的数据，说明数据更新了，需要重新计算数据
                // this.data = options.data;

                //把data处理为支持树状结构的数据
                if (!this._allPortfolios) {
                    $.ajax({
                        url: "api/Portfolio/GetAllPortfolios",
                        async: false,
                        type: 'post',
                        data: {
                            WithRoot: true,
                            OnlyActive: false,
                            IsOrAsAdmin: true
                        },
                        success: function (result) {
                            me._allPortfolios = result.orderBy('x=>x.Level', true); //先把叶子节点排在前面处理
                        }
                    })
                }

                var maxParentPortfolioCount = 1;

                function GetParentPortfolio(portfolioItem, portfolioNo, index) {
                    var port = me._allPortfolios.first('x=>x.PortfolioNo=="' + portfolioNo + '"');

                    if (port.ParentPortfolioNo) {
                        maxParentPortfolioCount = index;
                        portfolioItem['ParentPortfolioNo' + index] = port.ParentPortfolioNo;
                        portfolioItem['ParentPortfolioName' + index] = me._allPortfolios.first('x=>x.PortfolioNo=="' + port.ParentPortfolioNo + '"').PortfolioName;
                        GetParentPortfolio(portfolioItem, port.ParentPortfolioNo, index + 1);
                    }
                }

                //把已经有的数据添加上ParentPortfolioNo
                Box.Array.forEach(this.data, function (item) {
                    if (item.PortfolioNo) {
                        // 后面的 ParentPortfolioNo+index  列都是为了分组用的
                        item.ParentPortfolioNo0 = item.PortfolioNo;
                        item.ParentPortfolioName0 = item.PortfolioName;
                        GetParentPortfolio(item, item.PortfolioNo, 1);
                    }
                }, this);

                //按照 ParentPortfolioNo+index 来分组显示
                this.groupName = [];

                for (var i = maxParentPortfolioCount; i >= 0; i--) {
                    this.groupName.push({
                        dir: "asc",
                        field: "ParentPortfolioName" + i,
                    });

                    this.gridColumns.push({
                        field: "ParentPortfolioName" + i,
                        hidden: true,
                    });
                }
            }
        }
        else {

            if (options.groupName === undefined)
                options.groupName = this.groupName;
            else if (Box.isString(options.groupName) && options.groupName != '') {
                options.groupName = [{field: options.groupName}];//groupName统一为数组处理
            }

            this.groupName = options.groupName || null;
        }

        var opt = {
            data: this.data
        };

        if (this.sortColumn) {
            opt.sort = {
                field: this.sortColumn,
                dir: this.dir
            };
        } else if (this.sortFields) {
            opt.sort = this.sortFields;
        }

        if (this.groupName) {
            opt.group = this.groupName;
            this.groupColumn = [];
            Box.Array.forEach(this.groupName, function (group) {
                this.groupColumn.push(this.gridColumns.selectMany("x=>x.columns||x").first("x=>x.title=='" + group.title + "'"));
            }, this);
            // }
        }

        //获取之前的筛选配置,如果外部有筛选传入,就以外部为准
        var oldFilter = options.filter || this.grid && this.grid.dataSource.filter();

        // if (this.groupConfig && this.groupConfig.length) {
        //     this.fnGroup();
        // } else {
        this.initGrid();
        // }
        var griddatasource = new kendo.data.DataSource(opt);

        this.grid.setDataSource(griddatasource);

        //如果之前有筛选配置,那么这儿就筛选一下
        if (oldFilter && !Box.isEmptyObject(oldFilter)) {
            this.grid.dataSource.filter(oldFilter);
        }

        this.onAfterRefresh(this, griddatasource);
        if (this.sortable && options.orderby) {
            this.el.target.find("th[data-field='" + options.orderby + "']").trigger("click");
        }
        if (!this.expand) {
            this.grid.wrapper.find("th a.k-i-collapse").click();
            //this.grid.wrapper.find("td a.k-i-collapse").click();
            //this.grid.wrapper.find("td a.k-i-collapse").removeClass("k-i-collapse");
            //this.grid.wrapper.find("td a.k-icon").addClass("k-i-expand");

        }
    },


    fnBeforeGroup: function () {
        var me = this;
        var hiddenrows = this.gridColumns.where("x=>x.hidden==true").select("field");


        Box.Array.forEach(this.gridColumns, function (group) {
            me.isSupportCustom && (group.locked = false);
            group.groupHeaderTemplate = Box.bind(function (e) {
                var value = "";
                if (e.value && Box.isFunction(this.template)) {
                    var item = {};
                    item[this.field] = e.value;
                    var v = this.template(item);
                    if (e.value == "--")
                        value = "其他";
                    value = v || "其他";
                }
                else {
                    value = e.value || "其他";
                }
                return '<div style="display: inline-block;"  class="GroupValue"  data-group = \'' + JSON.stringify(e) + '\'> ' + value + ' (' + e.items.length + ')' + '</div>';
            }, group);
        });

        this.gridColumns.foreach(function (d) {
            if (hiddenrows.contains(d.field)) {
                d.hidden = true;
                d.noexport = true;
            }
        });
    },

    fnRenderGroupRow: function (tr, groupCount, lockedCount) {

        var lockedRow = this.grid.lockedContent && this.grid.lockedContent.find("tr").eq($(tr).prop("rowIndex")) || false;

        //清空了,以便后面重新插入
        tr.find('td:not(.k-group-cell):not([aria-expanded])').remove();
        lockedRow && lockedRow.find('td:not(.k-group-cell):not([aria-expanded])').remove();

        var thistr = lockedRow || tr;
        var aggregates = thistr.find('.GroupValue').data('group');

        if (aggregates) {
            var cols = this.gridColumns.selectMany("x=>x.columns||x").where("x=>!x.hidden");

            // var lockedCount = cols.count("x=>x.locked") || 0;
            lockedCount = lockedCount || (lockedRow && lockedRow.closest('table').find('col:not(".k-group-col")').length) || 0; //以前那种方法不再试用,因为现在固定列的顺序可以跳转,是动态变化的

            var lasttr;
            var td = $(thistr).find("td:not(.k-group-cell):first");

            var key = Box.String.trim(td.text());
            if (Box.isEmpty(key))
                return;
            // if (this.groupColumn && this.groupColumn.groupSort) {
            //     //key = this.groupColumn.groupSort[parseInt(key)];
            //     var a = td.find("p>.k-icon");
            //     td.find("p.k-reset").empty().append(a).append(key);
            // }
            var data = aggregates.aggregates;

            //console.log(data);

            //对于合并单元格的列的分组，形如：<span rowspan="true" field="Owner" value="远期-全大豪-12伊城投债-PR伊春债-海通证券-20160725"></span>全大豪:Object {HoldAmtDayEnd: 40000000, count: 1}
            if (typeof (data) == "undefined") {
                $.each(this.groupData, function (key1, value1) {
                    if (key1.indexOf(">" + key) >= 0) {
                        data = value1;
                        return false;
                    }
                });
            }

            //console.log(data);

            var colspan = groupCount - thistr.find('td.k-group-cell').length;
            var colspan = groupCount - thistr.find('td.k-group-cell').length;
            var lastTd = td;
            var thisTd;
            for (var i = 0; i < cols.length; i++) {
                lasttr = thistr;
                thistr = (lockedRow && i < lockedCount) ? lockedRow : tr;
                if (lasttr != thistr) {
                    thistr.css("height", lasttr.css("height"));
                    if (lastTd) {
                        if (!lastTd[0].parentElement) { //如果这个元素不在页面上,才添加到页面上
                            lasttr.append(lastTd);
                        }
                        lastTd.attr("colspan", colspan);
                        lastTd = null;
                    }

                    colspan = 0;
                    thisTd = tr.find("td:first");
                    thisTd.removeAttr("colspan");
                    lastTd = thisTd;
                } else {
                    thisTd = null;
                }

                var col = cols[i];
                var name = col.field;

                if (!Box.isNullOrUndefined(data[name])) {
                    var cfg = this.groupConfig.first("x=>x=='" + name + "' || x.name=='" + name + "'");
                    if (cfg) {
                        if (lastTd) {
                            if (!lastTd[0].parentElement) { //如果这个元素不在页面上,才添加到页面上
                                thistr.append(lastTd);
                            }
                            lastTd.attr("colspan", colspan || 1);
                            lastTd = null;
                        }
                        colspan = 0;

                        if (!thisTd) {
                            thisTd = $("<td></td>");
                            if (!thisTd[0].parentElement) {
                                thistr.append(thisTd);
                            }
                        }

                        if (Box.isObject(col.attributes)) {
                            for (var attrkey in col.attributes) {
                                thisTd.attr(attrkey, col.attributes[attrkey]);
                            }
                        }

                        var obj = {};

                        //累计求和
                        if (Box.isString(cfg)) {
                            if (Box.String.has(cfg, '.')) { //这儿主要是针对单元格里面分格的
                                var cfgArray = cfg.split('.');
                                obj[cfgArray[0]] = [];
                                var item = {};
                                item[cfgArray[1]] = data[name].sum;
                                obj[cfgArray[0]].push(item);
                            } else {
                                obj[name] = data[name].sum;
                            }
                        }
                        //加权求和
                        var tmp = col.template;
                        if (Box.isObject(cfg)) {
                            if (Box.isFunction(cfg.formula)) {
                                obj[name] = cfg.formula(data);
                            }
                            else {
                                obj[name] = data[name].weightAverage;
                            }
                            if (cfg.useTemplate === true) {
                                obj = data;
                            }
                        }

                        var dv = obj[name];
                        if (col.attributes && col.attributes["data-precision"]) {
                            thisTd.attr("data-value", Box.Format.toNumeric(dv));
                        }
                        if (Box.isFunction(tmp)) {
                            thisTd.html(tmp(obj));
                        } else {
                            thisTd.html(dv);
                        }
                    }
                } else {
                    if (!lastTd)
                        lastTd = $("<td></td>");
                    colspan++;
                }
            }
            if (lastTd) {
                if (!lastTd[0].parentElement) { //如果这个元素不在页面上,才添加到页面上
                    thistr.append(lastTd);
                }
                lastTd.attr("colspan", colspan);
            }

            this.onRenderedGroup(tr, data);
        }
    },

    fnCustomeTotalRow: null,//自定义总计行的文字

    fnRenderTotalRow: function (grid, groupCount, lockedCount) {
        var lockedTable = grid.lockedContent && grid.lockedContent.find("table") || false;
        var cols = this.gridColumns.selectMany("x=>x.columns||x").where("x=>!x.hidden && x.field!='" + this.groupName + "'");

        // var lockedCount = cols.count("x=>x.locked") || 0;
        var lockedCount = lockedCount || (lockedTable && lockedTable.find('col:not(".k-group-col")').length) || 0; //以前那种方法不再试用,因为现在固定列的顺序可以跳转,是动态变化的

        var table = grid.table;
        table.find("tfoot.k-grid-footer tr.k-footer-template").remove();

        var group = grid.dataSource.view().toJSON();
        if (group && group.length) {
            if (this.showFooter) {
                if (lockedTable) {
                    if (lockedTable.find("tr.total").length == 0) {
                        if (this.isTotalDisplay && this.groupName) {
                            lockedTable.find("tbody").prepend($('<tr class="total k-grouping-row"></tr>'));
                        } else if (this.isTotalDisplay && this.groupName == null) {
                            lockedTable.find("tbody").prepend($('<tr class="total k-grouping-row noGroup"></tr>')); //noGroup用来判断当前是不是选择的无分组,在导出的时候会用到
                        } else {
                            lockedTable.find("tbody").prepend($('<tr class="total k-grouping-row" style ="display:none"></tr>'));
                        }
                    }
                }
                if (table.find("tr.total").length == 0) {
                    if (this.isTotalDisplay && this.groupName) {
                        table.find("tbody").prepend($('<tr class="total k-grouping-row"></tr>'));
                    } else if (this.isTotalDisplay && this.groupName == null) {
                        table.find("tbody").prepend($('<tr class="total k-grouping-row noGroup"></tr>'));
                    } else {
                        table.find("tbody").prepend($('<tr class="total k-grouping-row" style ="display:none"></tr>'));
                    }
                }
                var lockedRow = lockedTable && lockedTable.find("tr.total:first") || false;
                var tr = table.find("tr.total:first");
                lockedRow && lockedRow.empty();
                tr.empty();

                var td = this.fnCustomeTotalRow ? this.fnCustomeTotalRow() : $("<td></td>").html("总计");
                // var data = this.total;

                var thistr = lockedRow || tr, lasttr;

                var colspan = groupCount - thistr.find('td').length;
                if (!this.groupName) {
                    colspan = 0;
                }
                var lastTd = td;
                for (var i = 0; i < cols.length; i++) {
                    lasttr = thistr;
                    thistr = (lockedRow && i < lockedCount) ? lockedRow : tr;
                    if (lasttr != thistr) {
                        if (lastTd) {
                            lasttr.append(lastTd);
                            lastTd.attr("colspan", colspan);
                            lastTd = null;
                            colspan = 0;
                        }
                    }
                    var col = cols[i];
                    var name = col.field;

                    var obj = {};
                    var cfg = this.groupConfig.first("x=>x=='" + name + "' || x.name=='" + name + "'");
                    if (cfg) {
                        if (Box.isString(cfg)) {
                            if (Box.String.has(cfg, '.')) { //这儿主要是针对单元格里面分格的
                                // obj[name] = group.sum('x=>x.aggregates["' + name + '"].sum')

                                var cfgArray = cfg.split('.');
                                obj[cfgArray[0]] = [];
                                var item = {};
                                item[cfgArray[1]] = groupCount ? group.sum('x=>x.aggregates["' + name + '"].sum') : group.sum('x=>x.' + name);
                                obj[cfgArray[0]].push(item);

                            } else {
                                obj[name] = groupCount ? group.sum('x=>x.aggregates.' + name + '.sum') : group.sum('x=>x.' + name);
                            }
                        }

                        //加权求和
                        if (Box.isObject(cfg)) {
                            // if (data[name].weight > 0) {
                            //当前有分组跟无分组的计算方式不一样
                            obj[name] = groupCount ? (group.sum('x=>x.aggregates.' + name + '.weightAverage*x.aggregates.' + cfg.weight + '.sum') / group.sum('x=>x.aggregates.' + cfg.weight + '.sum')) : (group.sum('x=>x.' + name + ' * x.' + cfg.weight) / group.sum('x=>x.' + cfg.weight));
                            // } else if (Box.isFunction(cfg.formula)) {
                            //     obj[name] = cfg.formula(data);
                            // }
                            // if (cfg.useTemplate === true) {
                            //     obj = data;
                            // }
                        }
                    }
                    if (!Box.isNullOrUndefined(obj[name.split('.')[0]])) {

                        if (cfg) {
                            if (lastTd) {
                                lasttr.append(lastTd);
                                lastTd.attr("colspan", colspan);
                                lastTd = null;
                            }
                            colspan = 0;

                            var thisTd = $("<td></td>");

                            if (Box.isObject(col.attributes)) {
                                for (var attrkey in col.attributes) {
                                    thisTd.attr(attrkey, col.attributes[attrkey]);
                                }
                            }
                            thistr.append(thisTd);

                            var tmp = col.template;
                            var dv = obj[name];
                            if (Box.isObject(dv))
                                dv = dv.value;
                            if (col.attributes && col.attributes["data-precision"]) {
                                thisTd.attr("data-value", Box.Format.toNumeric(dv));
                            }
                            if (Box.isFunction(tmp)) {
                                thisTd.html(tmp(obj));
                            } else {
                                thisTd.html(dv);
                            }
                        }
                    } else {
                        if (!lastTd)
                            lastTd = $("<td></td>");
                        colspan++;
                    }
                }
                if (lastTd) {
                    thistr.append(lastTd);
                    //if (this.groupName == null) {
                    //colspan--;
                    //}
                    lastTd.attr("colspan", colspan);
                }
            }
            this.onRenderedTable(table, group);
        }
    },

    onRenderedGroup: function (tr, data) {
    },

    onRenderedTable: function (table, total) {
    },

    onAfterRefresh: function (table, datasource) {
    },

    onAfterDataBound: function (table) {
    },

    fnDataBound: function (table) {

    },

    fnRefreshGrid: function () {
        Box.HY.Page.reloadPage();
    },

    fnGetData: function (option) {
        var options = {
            type: 'post',
            contentType: "application/json",
            url: option.url,
            beforeSend: function () {
                Box.HY.Page.showLoader(option.loaderElement); //可以传一个jquery对象，进度条附在上面，如果不传，进度条就附在整个页面上
            },
            success: function (data) {
                Box.HY.Page.hideLoader(option.loaderElement);
                if (Box.isFunction(option.callback)) {
                    option.callback.call(option.scope || window, data);
                }
            },
            error: function () {
                Box.HY.Page.hideLoader(option.loaderElement);
            }
        };
        if (option.params) {
            options.data = JSON.stringify(option.params);
        }

        if (option.type == 'get') {
            options = {
                type: 'get',
                contentType: "application/json",
                url: option.url,
                data: option.params,
                beforeSend: function () {
                    Box.HY.Page.showLoader(option.loaderElement);
                },
                success: function (data) {
                    Box.HY.Page.hideLoader(option.loaderElement);
                    if (Box.isFunction(option.callback)) {
                        option.callback.call(option.scope || window, data);
                    }
                },
                error: function () {
                    Box.HY.Page.hideLoader(option.loaderElement);
                }
            };
        }

        $.ajax(options);
    },
});