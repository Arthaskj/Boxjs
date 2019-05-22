 /*========================================================================
 * 描述：继承面板组件，实现展示面板
 * ======================================================================== */

Box.define('Demo.panel.indexDetail', {

    name: "Box.Panel",

    extend: 'Box.Panel',

    templates:{
        content:[
            '<div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>姓名：</label><input class="name" /></div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>生日：</label><input class="date" /></div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>性别：</label><input class="sex" /></div>' +
            '<div style="margin-left: 20px"><button class="submit">提交</button><button class="cancel">取消</button></div>' +
            '</div>'
        ]
    },

    contentElements:{
        name:'.name',
        date:'.date',
        sex:'.sex',
        submit:'.submit',
        cancel:'.cancel'
    },

    defaultStatus: 'expand',           //设置默认状态是折叠(compress)还是展开(extend)

    showHeader: true,                 //是否显示标题头

    title: 'Box.Panel',

    icon:'fa fa-columns',

    init:function () {
        this.el.name.kendoAutoComplete({     //初始化自动补全控件
            separator: [", "],
            dataSource: [ "Apples", "Oranges" ]
        });
        this.el.sex.HYDropDownList({
            dataSource: [
                { text: "男", value: "male" },
                { text: "女", value: "female" }
            ],
            dataTextField: "text",
            dataValueField: "value",
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 300
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 300
                }
            }
        });
        this.el.date.kendoDatePicker();
        this.el.submit.kendoButton();
        this.el.cancel.kendoButton();

    }

});