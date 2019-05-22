# Box.Panel #

---

一个用来展示面板编辑的封装组件

## 属性 ##

**templates**

>使用tempaltes的时候,不能再设置main、body、button，这三个模板名字在封装的时候已经被占用，否则templates里定义的模板会直接覆盖Box.Panel组件下的templates定义的内容。
>
>需要在panel里面渲染的内容可以模板命名为content，并且应在contentElements指定元素，getContentData里可以获取渲染的内容元素，初始化内容应在init里定义。
>另外，Box.Panel是一个可以继承的组件，并且需要把它渲染到一个地方才可以展示出来需要用到renderTo属性。

以下是封装的源码

```
templates: {
        main: [
            '<div class="hy-panel" >' +
            '<div class="hy-panel-header">' +
            '<div class="hy-panel-title"> <i class ="fa {icon}" style="margin-right: 5px;"></i> {title}</div>' +
            '<div class="hy-panel-actions">' +
            '<a class="k-button k-button-icon k-group-end hy-panel-btn toggleBtn"><span class="k-sprite fa fa-minus"></span></a>' +
            '<a class="k-button k-button-icon k-group-end hy-panel-btn fullscreenBtn" style=" border-radius: 0 3px 3px 0;"><span class="k-sprite fa fa-expand"></span></a>' +
            // '<a class="k-button k-button-icon k-group-end hy-panel-btn btnClose" style=" border-radius: 0 3px 3px 0;"><span class="k-sprite fa fa-times"></span></a>' +
            '</div>' +
            '<div class="hy-panel-buttons"></div></div>' +
            '<div class="hy-panel-content">' +
            '</div></div>'
        ],
        button: ['<a name="{name}" <tpl if="!display"> style="display:none" </tpl>  <tpl if="disable"> disabled </tpl>  class=" k-info hy-panel-btn" href="javascript:void(0);"><span style="margin-right: 5px;" class="fa {icon}"></span><span class="text">{text}</span></a>'],
        action: ['<a class="k-button k-button-icon k-group-end hy-panel-btn {name}"  title= "{title}"><span class="k-sprite fa {icon}"></span></a>']
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

**defaultStatus** 

设定默认状态是折叠(compress) 还是展开(expand)
   
``` 
defaultStatus: 'expand', //设定默认状态是展开
``` 

**buttons**

panel标题栏右边的按钮,可以直接设置为数组,还可以设置为function

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

**showHeader**`:boolean`

是否显示标题头

```
showHeader: true, //显示标题头
```

**title**`:String`

panel的标题

```
title：'属性配置'，
```

**icon**

标题前的图标

```
icon:'fa-edit'，
```

**contentElements**

panel里面的元素选择器

> 在用面板的时候元素选择器属性名为contentElements而不是elements，里面存放的数据只能是主模板渲染过的数据并且执行事件时可以使用事件绑定，而后期通过渲染生成的元素不可以直接在这里指定，并且发生事件时只能使用事件代理

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

**fnToggle**`(Number speed)`

折叠(展开)content部分
`speed`为折叠或展开过程中需要的时间

```
fnToggle: function (speed) {
        if (this.el.content.css('display') == 'none') { //修改toggle的图标
            this.el.toggleBtn.find('span').removeClass().addClass('k-sprite fa fa-minus');
            this.status = 'expand';

            //命中onExpand事件
            this.onExpand.call(this);
            this.trigger('onExpand', this);
        } else {
            this.el.toggleBtn.find('span').removeClass().addClass('k-sprite fa fa-plus');
            this.status = 'compress';

            //命中onCompress事件
            this.onCompress.call(this);
            this.trigger('onCompress', this);
        }
        this.el.content.slideToggle(speed != undefined ? speed : 500);

        //命中onToggle事件
        this.onToggle.call(this);
        this.trigger('onToggle', this);
    },
```

**fnToggleFullscreen**

切换全屏

```
fnToggleFullscreen: function () {
        if (this.el.target.hasClass('hy-panel-max')) {
            this.el.target.removeClass('hy-panel-max');
            this.el.fullscreenBtn.find('span').removeClass().addClass('k-sprite fa fa-expand');

            this.el.toggleBtn.show();

            if (this.status == 'compress') {
                this.el.content.hide();
            }

            //命中onFullscreen事件
            this.onFullscreen.call(this);
            this.trigger('onFullscreen', this);
        } else {
            this.el.target.addClass('hy-panel-max');
            this.el.fullscreenBtn.find('span').removeClass().addClass('k-sprite fa fa-compress');

            this.el.content.show();
            this.el.toggleBtn.hide();

            //命中onRestore事件
            this.onRestore.call(this);
            this.trigger('onRestore', this);
        }

        //命中onToggleFullscreen事件
        this.onToggleFullscreen.call(this);
        this.trigger('onToggleFullscreen', this);
    },
```

**fnSetTitle**`(String title):function`

设置panel的标题

> >title参数不为空时,是设置title,当不传入参数时,是获取title

```
//通过实例化来调用方法
var panel=new Box.Panel();  //Box.Panel 代表继承自Box.Panel的任意组件
panel.fnSetTitle('自定义标题');


//通过继承组件来直接调用
Box.define('HY.user.userProperty', {
 extend: 'Box.Panel',
 init: function () {
       this.fnSetTitle('自定义标题');
 }
});
```

**fnShowBtn**`(String name):function`

显示右下角的按钮
    `name`为要显示按钮的名称

```
fnShowBtn: function (name) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].show();
        }
    },
```

**fnHideBtn**`(String name):function`

隐藏右下角的按钮
    `name`为要显示按钮的名称

```
fnHideBtn: function (name) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].hide();
        }
    },

```

**fnSetBtnText**`(String name,String text):function`

设置按钮的名称
    `name`为要显示按钮的名称`text`为要设置按钮的名称

```
fnSetBtnText: function (name, text) {
        if (this.el.buttons[name]) {
            this.el.buttons[name].find(".text").html(text);
        }
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

**fnHideToggle**

隐藏panel
```
fnHideToggle: function () {
        this.el.toggleBtn.css('display', 'none');
        this.el.fullscreenBtn.css('display', 'none');
    },
```

## 事件 ##

**onToggle**

当折叠或者展开的时候触发


```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onToggle:function(){
		console.log('触发onToggle事件');
	}
})
```

**onExpand**

当展开的时候触发,在这之后也会触发一次onToggle


```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onExpand:function(){
		console.log('触发onExpand事件');
	}
})
```

**onCompress**

当折叠的时候触发,在这之后也会触发一次onToggle

```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onCompress:function(){
		console.log('触发onCompress事件');
	}
})
```

**onFullscreen**

全屏时候触发,在这之后也会触发一次onToggleFullscreen


```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onFullscreen:function(){
		console.log('触发onFullscreen事件');
	}
})
```

**onRestore**

从全屏还原时候触发,在这之后也会触发一次onToggleFullscreen

```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onRestore:function(){
		console.log('触发onRestore事件');
	}
})
```

**onToggleFullscreen**

全屏状态切换触发


```
Box.define('Box.Panel', {
	extend: 'Box.Component',

	onToggleFullscreen:function(){
		console.log('触发onToggleFullscreen事件');
	}
})
```

