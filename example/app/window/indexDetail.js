/* ========================================================================
 * 描述：继承窗口组件，实现弹出窗口
 * ======================================================================== */
Box.define('Demo.window.indexDetail', {

    extend: 'Box.Window',           //继承Box.Window窗口组件

    title: 'window',                //窗口的标题
    width: 500,
    height: 300,
    icon: 'fa-edit',                //窗口标题前的图标

    templates: {                    //主模板中渲染元素必须以一对div来包围
        content: [
            '<div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>姓名：</label><input class="name" /></div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>生日：</label><input class="date" /></div>' +
            '<div style="margin-bottom: 15px;margin-left: 20px"><label>性别：</label><input class="sex" /></div>' +
            '</div>'
        ]
    },

    contentElements: {             //定义content模板中渲染的元素
        name:'.name',
        date:'.date',
        sex:'.sex',
        submit:'.submit',
        cancel:'.cancel'
    },

    buttons: [                     //窗口右下角的按钮
        {
            name: 'btnConfirm',
            text: '确定',
            theme: "k-primary",
            handler: 'fnClose'   //Box中封装好的函数
        },
        {
            name: 'btnClose',
            text: '取消',
            theme: "k-primary",
            handler: 'fnClose'   //Box中封装好的函数
        }
    ],

    actions: [
        //"Pin",    //固定按钮
        "Minimize", //最小化
        "Maximize", //最大化
        "Close" //关闭
    ],

    draggable: true,   //定义可以拖动窗口

    init: function () {
        this.el.name.kendoAutoComplete({      //初始化自动补全控件
            //height : 200,
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
    }
});
