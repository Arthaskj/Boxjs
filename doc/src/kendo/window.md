# Box.Window #

---

一个用来弹出窗口编辑的封装组件

## 属性 ##

**templates**

window的主体模板，包含主体内容和下面的按钮区域
>kendoUI的window是不包含按钮的，按钮是自己添加的，使用tempaltes的时候,不能再设置main、body、button，这三个模板名字在封装的时候已经被占用，否则templates里定义的模板会直接覆盖Box.Window组件下的templates定义的内容。
>
>需要在window里面渲染的内容可以模板命名为content，并且应在contentElements指定元素，getContentData里可以获取渲染的内容元素，初始化内容应在init里定义。
>另外，Box.Window是一个可以继承的组件，不需要依赖任何东西就可以弹出来。

以下是封装的源码：

```
templates: {
        main: ['<div></div>'],
        
        body: [
            '<div class="window-body">' +
            '<div class="window-content"></div>' +
            '<div class="window-footer k-edit-buttons k-state-default"></div>' +
            '</div>'
        ],

        //右下角按钮模板
        button: ['<a name="{name}" <tpl if="!display"> style="display:none" </tpl> 
        <tpl if="disable"> disabled </tpl>  class="window-btn k-button k-button-icontext {theme}" href="javascript:void(0);">
        <span style="margin-right: 5px;" class="fa {icon}">
        </span>{text}</a>']
    },
```  
使用实例：
```
templates:{
    content:['<div class="editInfo">{Message}</div>']
},

contentElements:{
	editInfo: '.editInfo',   //在之后的代码可以使用this.el.editInfo调用这个对象
},

getContentData:function(){
  return {
	Message:'这是内容'
	}
}

```

**maximize** `:boolean`

默认弹出的时候是否是最大化的
   
``` 
maximize:false，  //默认弹出窗口不为最大化
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

**width**`:number`

窗口弹出时的宽度

```
width：500，
```

**height**`:number`

窗口弹出时的高度

```
height：500，
```

**minWidth**`:number`

窗口的最小宽度

```
minWidth：100，
```

**minHeight**`:number`

窗口的最小高度

```
minHeight：200，
```

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
        "Minimize", //最小化
        "Maximize", //最大化
        "Close" //关闭
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

**autoOpen**`：boolean`

是否可以自动打开窗口

> 若为false，则需手动调用open打开窗口

```
resizable:true, //可调整窗口大小
```

**animation**

设置窗口出现和关闭的动画

```
animation: {
        close: {
            duration: 200,
            effects: "fade:out"
        },
        open: {
            duration: 200
        }
    },

```


**closeAction**

设置窗口关闭的方式

```
closeAction: 'destroy',  //关闭时销毁
             //'hide'    //关闭时隐藏
```

**contentElements**

窗体里面的元素选择器

> 在用窗体的时候元素选择器属性名为contentElements而不是elements，里面存放的数据只能是主模板渲染过的数据并且执行事件时可以使用事件绑定，而后期通过渲染生成的元素不可以直接在这里指定，并且发生事件时只能使用事件代理

```
contenElements:{
     name: '.class'
}
```

**getContentData**

获取渲染内容的数据,需要返回JSON对象


```
getContentData: function(){
	return {
	 	Name:'xxx',
		Age:21,
		....
	}
}
```
**init**

初始化函数,会在窗体初始化完成后调用,继承自Box.Window的组件可以在这里面初始化自己的东西


```
init: function(){
	this.el.calDate.kendoDatePicker();
}
```

## 方法 ##

**fnTitle**`(String title):function`

设置或者获取窗口的标题
>title参数不为空时,是设置title,当不传入参数时,是获取title

```
//通过实例化来调用方法
var window=new Box.Window();  //Box.Window 代表继承自Box.Window的任意组件
window.fnTitle('自定义标题');


//通过继承组件来直接调用
Box.define('HY.user.userProperty', {
 extend: 'Box.Window',
 init: function () {
       this.fnTitle('自定义标题');
 }
});

```

**fnOpen**`:function`

打开窗口

```
fnOpen: function () {
        for (var i = 0; i < this.disabledBtns.length; i++) {
            this.fnEnableBtn(this.disabledBtns[i]);
        }
        this.disabledBtns = [];
        this.window.open();
    },
```

**fnClose**`:function`

关闭窗口

```
fnClose: function () {
        this.window.close();
    },
```

**fnShowBtn**`(String name):function`

显示右下角的按钮
    `name`为要显示按钮的名称

```
fnShowBtn: function (name) {
        this.el.buttons[name].show();
    },
```

**fnHideBtn**`(String name):function`

隐藏右下角的按钮
    `name`为要显示按钮的名称

```
fnHideBtn: function (name) {
        this.el.buttons[name].hide();
    },

```

**fnDisableBtn**`(String name):function`

禁用按钮

```
fnDisableBtn: function (name) {
        this._setBtnDisable(name, true);
    },

```

**fnEnableBtn**`(String name):function`

启用按钮

```
fnEnableBtn: function (name) {
        this._setBtnDisable(name, false);
    },

```

## 事件 ##

**beforeInit**

在初始化之前触发这个事件,需要在编写的组件的时候设置


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	beforeInit:function(){
		console.log('触发beforeInit事件');
	}
})
```

**onActivate**

在窗口完成开始动画时触发


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onActivate:function(){
		console.log('触发onActivate事件');
	}
})
```

**onDeActivate**

在窗口完成关闭动画时触发

```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onDeActivate:function(){
		console.log('触发onDeActivate事件');
	}
})
```

**onOpen**

打开窗口时并且在init之前触发


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onOpen:function(){
		console.log('触发onOpen事件');
	}
})
```

**afterInit**

初始化结束后触发

```
Box.define('Box.Window', {
	extend: 'Box.Component',

	afterInit:function(){
		console.log('触发afterInit事件');
	}
})
```

**onClose**

窗口关闭时触发（通过用户关闭或调用关闭方法都会触发）

> e.userTriggered Boolean
指示用户是否已触发关闭操作（通过单击关闭按钮或调用关闭方法），调用onClose方法时，此字段为false。

```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onClose:function(){
		console.log('触发onClose事件');
	}
})
```

**onDragstart**

拖动窗口开始的时候触发


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onDragstart:function(){
		console.log('触发onDragstart事件');
	}
})
```

**onDragend**

拖动窗口结束的时候触发


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onDragend:function(){
		console.log('触发onDragend事件');
	}
})
```

**onResize**

窗口大小改变时触发


```
Box.define('Box.Window', {
	extend: 'Box.Component',

	onResize:function(){
		console.log('触发onResize事件');
	}
})
```