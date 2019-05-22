# Box.ConfirmDialog #

---

一个可以给用户确认信息弹出窗口的封装组件

## 属性 ##

**title**`:String`

窗口的标题

```
title：'属性配置'，
```

**icon**

窗口标题前的图标

```
icon:'fa-edit'，
```

**actions**

窗口右上角的按钮，若值为false则不显示标题栏

```
actions: [
        //"Pin",    //固定按钮
        //"Minimize", //最小化
        //"Maximize", //最大化
        "Close" //只需要右上角的关闭按钮
    ],
```

**draggable**`：boolean`

是否可以拖动窗口

```
draggable:false, //不可拖拽窗口
```

**resizable**`：boolean`

是否可以调整窗口大小

```
resizable:true, //可调整窗口大小
```

**width**`:number`

窗口弹出时的宽度

```
width：'500px'，
```

**height**`:number`

窗口弹出时的高度

```
height：'100px'，
```

**scope**


```
scope: null,
```

**message**

需要显示的提示信息

```
message: 'success',
```

**buttons**

窗口底部的按钮

```
  buttons: [
        {
            name: '', //按钮的名字,需要唯一
            text: '', //按钮显示的文字
            icon: '', //使用fontawesome的图标
            theme: "", //k-primary,k-info,k-success,k-warning,k-danger
            disable: false, //是否禁用按钮
            display: true, //是否显示按钮
            handler: '', //点击按钮的处理函数，可以自定义函数也可直接使用封装好的函数
            scope: null, //按钮处理函数的作用域
        },
    ],
```

**示例**

```
new Box.ConfirmDialog({
    message:'确定要退出?',
    callback:function(result) {
    if (result) {
        console.log('true');
    } 
    else {
        console.log('false');
    }
    }
 });


 Box.ConfirmDialog.show({
    message: '确定要退出?',
    callback: function (result) {
    if (result) {
        console.log('true');
    } 
    else {
        console.log('false');
    }
    }
 });
```

