/**
 * Created by haiyi on 2015/3/30.
 */
Box.define('App.test', {
    extend: 'Box.Component',

    elements: {
        btnTest: '.btn_test'
    },

    require:[

    ],

    events: {
        'click btnTest': 'test'
    },

    templates: 'test.html',

    delegates: {
        'click {.btn_test2}': 'test2'
    },

    test: function () {
        this.el.target.append(' <button type="button" class="am-btn am-btn-default btn_test2">test2</button>');
    },
    test2: function () {
        alert('ddd');
    }
});