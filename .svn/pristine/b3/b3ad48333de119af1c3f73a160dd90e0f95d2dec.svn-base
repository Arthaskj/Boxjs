/**
 * Created by haiyi on 2015/3/30.
 */
Box.define('App.WindowTest', {
    extend: 'Box.app.Viewport',

    elements: {
        btnTest: '.btn_test'
    },

    requires: [
        'App.Window',
        'App.Test'
    ],

    events: {
        'click btnTest': 'test'
    },

    templates: 'windowTest.html',

    delegates: {
        'click {.btn_test2}': 'test2'
    },

    setup: function () {
        var window = new App.Window({
            renderTo: this.el.target,
            title: '测试窗口',
            refreshable: true
        });

        window.open();
    },

    test: function () {
        var window = new App.Window({
            renderTo: this.el.target
        });

//        var test = new App.test({
//            renderTo: this.el.target
//        });
    },
    test2: function () {
        alert('ddd');
    }
});