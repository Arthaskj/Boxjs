Box.define('Demo.index', {
    extend: 'Box.Component',

    templates: {
        main: [
            '<div>' +
            '<h1>Examples</h1>' +
            '<tpl for="exampleList"> ' +
            '   <ul class="{group}">{text}' +
            '   <tpl for="items">' +
            '       <li class="page"> <a href="{url}">{text}</a></li>' +
            '   </tpl>' +
            '   </ul>' +
            '</tpl>' +
            '</div>'
        ]

    },

    exampleList:[],

    getMainTplData: function () {
        this.exampleList = Box.requireSync('json!app/config.json');
        return {
            exampleList: this.exampleList
        };
    }
});