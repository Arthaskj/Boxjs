# Box.GridPage #

---

一个添加了工具栏按钮及查询条件的可分页的封装组件

>Box.GridPage需要把它渲染到一个地方才可以展示出来需要用到renderTo属性。

## 属性 ##

默认工具栏按钮的配置

```
  DEFAULT_BUTTON_CONFIG: [
        {
            name: '', //按钮的名字,需要唯一，这个属性一定要设置
            text: '', //按钮显示的文字
            icon: '', //使用fontawesome的图标
            theme: "", //k-primary,k-info,k-success,k-warning,k-danger
            handler: '', //点击按钮的处理函数，可以自定义函数也可直接使用封装好的函数
            hidden：false
        },
    ],
```

默认查询条件的配置

```
  DEFAULT_SEARCH_CONFIG: {
            name: '', //这个name后面会用作查询条件的field,所以需要跟字段名一样
            text: '', //查询条件显示的名字
            type: 'text', 
            operator: 'contains', //The supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), "gte" (greater than or equal to), "startswith", "endswith", "contains".
            renderData: '', //渲染的时候用的数据,
            isAdvanced: false, //是否属于高级查询条件
            //  isResetBtnHide: false,
            value: '', //初始化的值,
            placeholder: '', //只有当type为text,comboBox时才有效
            width: '192px', //默认的宽度,允许的格式:数值(100),字符串("150px")
            isRequired: false //是否必填
        }
```
 
type的类型有text，checkbox,date,rangeDate,comboBox,hide(不显示在页面上)
 各自效果如下

>text:
>![text](../doc/resource/images/text.jpg)

>checkbox:
>![checkbox](../doc/resource/images/checkbox.jpg)

>date:
>![date](../doc/resource/images/date.jpg)

>rangeDate:
>![rangeDate](../doc/resource/images/rangeDate.jpg)

>comboBox:
>![comBobox](../doc/resource/images/comBobox.jpg)

查询条件实例

```
table_search:[
{
        name: 'IsForbidden',//这个name后面会用作查询条件的field,所以需要跟字段名一样
        text: '是否禁用',
        type: 'comboBox', // text radioBtn checkbox date
        isAdvanced: true, //属于高级查询条件
        value: 'false',
        renderData: [
        {
           value: 'true',
           text: '是'
        },
        {
           value: 'false',
           text: '否'
        }
        ]
}
```

**table_search**`(String)`

查询条件

> 如果是数组的话,就是内置的查询,如果是字符串的话,就是自定义的查询控件类名,自定义类一定要包含getFilter() 来返回有效的查询条件

```
table_search: null, 
```

**serverFiltering**`:boolean`

服务器过滤

```
serverFiltering: true,
```

**enableExport**`:boolean`

是否将控件数据导出

```
enableExport: true, //会增加一个导出的按钮实现导出功能
```

**ajaxUrl**`(String)`

请求后台数据的url

```
ajaxUrl: 'api/User/userProperty',
```

**autoLoadData**`:boolean`

初始化完成后是否自动加载数据,如果为false,需要手动调用search 获取数据，若为true则会自动加载数据，请求地址为ajaxUrl

```
autoLoadData: false,
```

**isfiltersArray**`:boolean`

传到后台的数据是数组还是对象

> true传到后台的filters是数组，false传到后台的filters是对象

```
isfiltersArray: false,
```

**reset_btn_hide**`:boolean`

控制是否显示重置按钮

```
reset_btn_hide: false,  //控制不显示重置按钮
```

**search_btn_hide**`:boolean`

控制是否显示查询按钮

```
search_btn_hide: false, //控制不显示查询按钮
```

**table_buttons**

工具栏里的按钮

```
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
```

**pageabledisabled**`:boolean`

控制是否显示分页

```
pageabledisabled: false, //控制不显示分页
```

**table_filterable**`:boolean`

是否显示列的过滤条件

```
table_filterable: false,
```

**table_groupable**`:boolean`

是否允许用户自己分组

```
table_groupable: false,
```

**table_group**

默认的分组选项

```
table_group: [{
        field: "DealType",
        dir: 'asc'
  }]
```

**table_aggregate**

默认的统计配置

```
table_aggregate: null,
```

**table_serverSorting**`:boolean`

是否服务端排序

```
table_serverSorting: true,
```

**default_search_params**`(String)`

在查询初始化完成后,可以默认的设置一些查询条件,或者从其他页面跳转过来的时候,需要默认加一些查询条件

```
default_search_params: null,
```

**table_columns**

自定义表格

```
table_columns: [
        {
            field: "RealName",  绑定的字段 
            title: "用户名",   字段显示的名称
            sortable: false,   是否支持排序
            attributes: {     //向列添加一些属性
                "class": "table-cell",
                style: "text-align: right; font-size: 14px"
            },
            template: function (dataItem) {  //自定义列
                return "<strong>" + kendo.htmlEncode(dataItem.name) + "</strong>";
            }
        }
    ],
```

**table_sortable**`:boolean`

是否允许排序

```
table_sortable: true, 
```

**search_btn_hide**`:boolean`

控制是否显示查询按钮,为true则不显示

```
search_btn_hide: true, 
```

**table_height**`:number`

定义表格的高度

```
table_height: null, 
```

**table_selectable**`(String)`

> "multi" 多选框. "single"单选框，  false  不需要选择

```
table_selectable: false, 
```

**table_showselectall**`:boolean`

展示所有选项

```
 table_showselectall: false,
```

**table_order**

排序字段 
> 必须要有排序字段，否则数据加载不出来

```
 table_order: { field: "age", dir: "desc" }，
```

**dataSource_model**

数据的模型

> 遇到数据有枚举值的，需要把这个字段改为string类型，否则枚举值有0的时候，过滤筛选的时候会出现错误

```
 dataSource_model: null，
```

**isPopupWin**`：boolean`

是否在window弹窗中

> 如果是在弹窗中显示，会加入 “table-body-win” 控制grid不随着浏览器大小而改变

```
 isPopupWin: false，
```

**table_offsetSize**

偏移量

```
 table_offsetSize: -5，
```

## 方法 ##

**fnGetSelectedRows**`:function`

获取选择的行,返回选择的行的数据

```
//通过实例化来调用方法
var gridpage=new Box.GridPage();  //Box.GridPage 代表继承自Box.Panel的任意组件
gridpage.fnGetSelectedRows();


//通过继承组件来直接调用
Box.define('HY.user.userProperty', {
 extend: 'Box.GridPage',
 init: function () {
       this.fnGetSelectedRows();
 }
});
```

**fnRefresh**`:function`

刷新列表

```
var gridpage=new Box.GridPage(); 
gridpage.fnRefresh();

```

**fnToggleAdvancedQuery**`:function`

显示(隐藏)高级搜索

```
fnToggleAdvancedQuery: function () {
        this.el.advancedSearch.slideToggle();
        this.el.searchLayer.toggle();
    },
```

**fnHideFilter**`(String name):function`

隐藏单个的过滤条件

```
fnHideFilter: function (name) {
        this.filters[name].hide();
    },

```

**fnShowFilter**`(String name):function`

显示单个的过滤条件

```
fnShowFilter: function (name) {
        this.filters[name].show();
    },

```

**fnSearch**`：function`

请求数据

```
fnSearch: function () {
        var filters = this._getFilters();

        if (filters === false) {
            return;
        }

        if (Box.isFunction(this.fnCustomeSearch)) {
            this.fnCustomeSearch();
        } else {
            this.gridpage.dataSource.query({
                filters: filters,
                page: 1, //this.gridpage.dataSource._page, 查询默认回到第一页
                pageSize: this.gridpage.dataSource.pageSize(),
                // pageSize: this.gridpage.dataSource._pageSize != 0 ? this.gridpage.dataSource._pageSize : 999999999,//如果等于0的话,说明页面上选择的是'All',就传一个很大的值到后台去
                skip: this.gridpage.dataSource.skip(),
                take: this.gridpage.dataSource.take(),
                sorts: this.table_order,
                group: this.table_group,
                aggregate: this.table_aggregate
            });
        }

        if (this.el.advancedSearch) {
            this.el.advancedSearch.hide();
            this.el.searchLayer.hide();
        }

    },
```
**fnResetSearch**`：function`

重置查询条件

```
 fnResetSearch: function () {
        Box.Array.forEach(this.currentSearch, function (searchItem) {

            if (searchItem.type == 'text' || searchItem.type == 'date') {
                searchItem.target.find('input').val('');
            } else if (searchItem.type == 'checkbox') {
                Box.Array.forEach(searchItem.target.find(':checkbox'), function (checkbox) {

                    $(checkbox).removeAttr('checked');

                }, this);
            } else if (searchItem.type == 'comboBox') {
                var comboBox = searchItem.target.find('select.' + searchItem.name).HYDropDownList().data('kendoDropDownList');
                comboBox.value('');
            } else if (searchItem.type == 'rangeDate') {
                searchItem.target.find('.' + searchItem.name + '-start:input').val('');
                searchItem.target.find('.' + searchItem.name + '-start:input').data("kendoDatePicker").max(new Date(2999, 1, 1)); //没办法置空,只有设置一个很大的值了,也不影响使用
                searchItem.target.find('.' + searchItem.name + '-end:input').val('');
                searchItem.target.find('.' + searchItem.name + '-end:input').data("kendoDatePicker").min(new Date(1900, 1, 1));
                //} else if (searchItem.type == 'multiselect') {
                //    searchItem.target.find('select.' + searchItem.name).HYMultiSelect('deselectAll', false);
                //    searchItem.target.find('select.' + searchItem.name).HYMultiSelect('updateButtonText');
            } else if (searchItem.type == 'dropdownselect') {
                searchItem.ddselect.value([]);
            }
        });

    },
```