Box.define('Demo.checkFile',{

    CheckFile:function (place,url) {
        var me = this;
        var myCodeMirror = CodeMirror(place, {
            mode: "javascript",
            theme: 'dracula'
        });
        Box.require(url, function (text) {
            myCodeMirror.setValue(text)
        });
         this.el.button.attr('disabled','disabled');
    }
});