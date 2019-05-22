/* ========================================================================
 *描述：可以通过拖动文件进来实现上传
 * ======================================================================== */
Box.define('Demo.upload.indexDetail', {

    extend: 'Box.Component',

    mixins:{
        checkfile:'Demo.checkFile'   //将Demo.checkFile下的属性或方法混入到当前模块下
    },

    templates: {
        main: [
            '<div style="margin-left: 30px;margin-top: 50px" class="row">' +
            '<div class="importBody col-md-5" style="height: 550px;background-color: rgba(51, 51, 51, 0.425)"></div>' +
            '<div class="col-md-7"> ' +
            '<button class="button k-button k-primary">查看源代码</button>' +
            '<div class="text"></div></div> ' +
            '</div>'
        ]
    },

    uploadUrl: '/api/Trade/ImportTradeContracts',      //上传方法的URL

    elements: {
        importBody: '.importBody',
        button:'.button',
        text:'.text'
    },
    events:{
      'click button':'checkFile'
    },

    setup: function () {
        this._initFileUpload();
    },

    _startUpload: function () {
        this.upload.fnStartUpload();
    },

    _clearFiles: function () {
        this.upload.fnRemoveAllFiles();
    },

    _initFileUpload: function () {           //在初始化就会执行的函数
        var me = this;
        this.upload = new Box.Upload({       //调用上传方法
            uploadUrl: this.uploadUrl,
            uploadAutoProcessQueue: true,
            uploadAcceptedFiles: '.xlsx,.xls',
            renderTo: this.el.importBody
        });

        var hasError = false;

        this.upload.on('addedfile', function () {
            me.fnEnableBtn('startUpload');
            me.fnEnableBtn('clearFiles');
            hasError = false;
        });
        this.upload.on('fileEmpty', function () {
            me.fnDisableBtn('startUpload');
            me.fnDisableBtn('clearFiles');
            hasError = false;
        });
        this.upload.on('sending', function () {
            me.fnDisableBtn('startUpload');
            me.fnDisableBtn('clearFiles');
        });
        this.upload.on('error', function () {
            hasError = true;
        });
        this.upload.on('queuecomplete', function () {
            if (hasError) {
                Box.Notify.error('部分文件上传出现错误!');
            } else {
                Box.Notify.success('全部文件上传成功!');
            }
            me.fnDisableBtn('startUpload');
            me.fnEnableBtn('clearFiles');
        });
    },
    checkFile:function () {
        this.CheckFile(this.el.text[0],'text!app/upload/indexDetail.js');
    }

});
