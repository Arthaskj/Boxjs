# 组件基类

---


`Component` 是界面元素的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 `Component` 可以构建出任何你想要的 `Web` 界面组件。

## 使用说明


该类提供了大量的特性支持，可以简单方便的定义组件。

```
Box.define('App.ui.TableGrid', {
	statics: {
		...
	},
	requires: [
		"Box.util.JSON",
		"Box.util.HashMap"
	],
	mixins: {
		common: "Box.Common"
	},
	extend: 'Box.Component',
	target: '#grid',
	elements: {
		th: 'th',
		tbody: 'tbody',
		td: 'tbody@td'
		tbar: '.tbar'
	},
	events: {
		'click th': 'onClickTh'
	},
	delegates: {
		'td': 'onClickTd'
	},
	templates: {
		main: 'view/ui/grid'
	},
	setup: function () {
		...
	},
	...
});
```

### 生命周期

`Box.Component` 有一套完整的生命周期，控制着组件从创建到销毁的整个过程。主要有 `constructor`（初始化），`render`（渲染），`destroy`（销毁） 三个过程。

![生命周期](../doc/resource/images/SMZQ.png)


### DOM存储器

任何组件都是需要基于dom而构建的，在组件内部会频繁解析dom操作，为了提高 `jQuery` 对象的复用性，尽可能的减小内存的使用，在组件初始化阶段，系统自动生成一个 `el` 属性对象用来存储这些频繁使用的jQuery对象。

> **组件内部的所有dom操作都是基于jQuery**,下面描述的dom对象都称之为jQuery对象



每一个组件的实例都需要基于一个dom对象。那么我们将该dom对象称之为目标dom对象。属性 `target` 可以标注页面中的某个dom节点为目标dom对象。例如：

```
// html 代码
<body>
	<div id="target"></div>
</body>

// js 代码
Box.define('App.ui.Table', {
	target: '#target',
	...
});
```


目标dom对象也可以不存在于页面中，使用组件内解析主模板（名为main的模板）来生成目标dom对象，然后通过 `renderTo` 属性来指定将目标dom对象插入到页面什么位置，例如：


```
Box.define('App.ui.Table', {
	templates: {
		main: 'views/ui/table.html'
	},
	renderTo: document.body,
	...
});
```

在组件初始化阶段，系统会将目标dom对象自动赋值给 `this.el.target`



### DOM选择器


通过属性 `elements` 可以注册多个dom选择器。

选择器是由键值对形式组成的，其格式为：`"name": "[parentName@]selector"`（[ ]表示可选项）。下面列出这些变量的含义：

> - name：选择器的名称，也就是注册到类中的 `el` 属性对象中的名称
> - parentName@：（可选）查询范围（默认为 `this.el.target`），提高 `jQuery` 的查找性能，该值必须为一个注册在当前选择器之前的选择器名称。如："banner@.item"，对应的代码是 `this.el.banner.find('.item')`
> - selector：选择器的值，该值可使用 `jQuery` 中的所有选择器

选择器注册的过程：

> - 在类初始化阶段，会自动创建一个 `el` 属性（`this.el = {}`）
> - 遍历属性 `elements` 中的选择器，通过解析选择器值生成 `jQuery` 对象，再设置到 `this.el` 中


解析原理原理大致如下：

```
var el = {};
var elements = {
	...
};
el.target = $(...);
for (var name in selecors) {
	var selector = elements[name];
	var index = selector.indexOf('@');
	if (index > 0) {
		el[name] = el[selector.substr(0, index)].find(selector.substr(index + 1));
	} else {
		el[name] = el.target.find(selector);
	}
}
```

下面的代码中，在 `elements` 注册了4个选择器，分别为 `th`、`tbody`、`td` 和 `tbar`。

```
Box.define('App.ui.TableGrid', {
	target: '#grid',
	elements: {
		th: 'th',
		tbody: 'tbody',
		td: 'tbody@td',
		tbar: '.tbar'
	}
});
```


在类中可通过 `this.el` 来获取想要的选择器

```
Box.define('App.ui.TableGrid', {
	target: '#grid',
	elements: {
		th: 'th'
	},
	setup: function () {
		// 打印出th的值
		console.log(this.el.th);
	}
});
```



### 事件绑定

通过 `events` 属性可以为已设定的选择器绑定指定的事件，例如：

```
Box.define('App.ui.TableGrid', {
	target: '#grid',
	elements: {
		th: 'th'
	},
	events: {
		'click th': 'onClickTh',
		'click td {tbody td}': 'onClickTd'
	},
	onClickTh: function (e, target) {
		...
	},
	onClickTd: function (e, target) {
		...
	}
});
```

`events` 属性中每一项的格式为：`"eventType selectorName [{selector}]": "eventFn"`（[ ]表示可选项）。

其表达的意思是：为指定选择器绑定指定的事件。下面列出这些变量的含义：

> - eventType：事件的类型，支持 jQuery 中的所有事件类型，比如：click、dblclick 等等
> - selectorName：绑定事件的选择器名称（也就是通过类中的 `elements` 属性注册的选择器）
> - selector：（可选）当 `selectorName` 没有被注册时，这里需要手动添加该选择器，比如上面的例子中 `'click td {td}': 'onClickTd'` 就是创建一个选择器名称为 `td`，选择器值为 `tbody td` 的选择器，让后在该选择器上绑定事件。
> - eventFn：事件的执行函数，可以是一个字符串，表示当前类中的方法名，也可以直接传入函数（不建议这么做）

`eventFn` 对应的方法拥有3个参数，分别为：

> - event 事件对象
> - target 当前目标的 `jQuery` 对象
> - scope 当前类本身


### 事件代理

事件代理是个非常好用的特性，将所有的事件都代理到 `this.el.target` 上。这样可以使得对应的 `DOM` 内容有修改时，无需重新绑定。在 `destroy` 的时候也会销毁这些事件。


```
Box.define('App.ui.TableGrid', {
	target: '#grid',
	elements: {
		th: 'th'
	},
	delegates: {
		'tbody td': 'onClickTd'
	},
	onClickTd: function (e, target) {
		...
	}
});
```

`delegates` 属性中的每一项格式为：`"selector": "eventFn"`，下面列出这些变量的含义：

> - selector 事件代理的 `jQuery` 选择器
> - eventFn 事件的执行函数，可以是一个字符串，表示当前类中的方法名，也可以直接传入函数（不建议这么做）

`eventFn` 对应的方法拥有3个参数，分别为：

> - event 事件对象
> - target 当前目标的 `jQuery` 对象
> - scope 当前类本身


### 模板渲染

通过 `templates` 属性可以为当前 `Component` 类注册模板，注册格式为：`"name": "content"`，`name` 为模板的名称，`content` 为模板的值。例如：

```
Box.define('App.page.User', {
	target: '#page_body',
	templates: {
		user: function (data) {
			return '<div class="user"></div>'
		},
		info: [
			'<div data-id="{id}">',
                '<span class="{cls}">{name}</span>',
            '</div>'
		],
		books: 'views/user/books.html'
	}
});
```

在类中可以通过 `applyTemplate` 方法有选择性的解析指定模板生成 `html` 字符串或者 `jQuery` 对象

```
Box.define('App.page.User', {
	target: '#page_body',
	elements: {
		book_list: '.book_list'
	},
	templates: {
		books: 'views/user/books.html'
	},
	setup: function () {
		var data = {
			title: '书本集合',
			root: [
				{name: "用于AngularJS开发下一代的Web应用", author: "Green & Seshadri"},
				{name: "基于MVC的JavaScript Web富应用开发", author: "MacCaw"}
			]
		};
		// 使用data作为数据源来解析 books 模板生成jQuery对象
		var books = this.applyTemplate('books', data, true);
		books.css({
			border: '1px solid red'
		});
		book_list.append(books);
	}
});
```

模板分为 `本地模板` 和 `远程模板` 2种。在类中直接编写模板值内容的为本地模板。而模板内容存放在于一个文件中，需要请求获得，则称为远程模板。


```
// 本地模板
books: [
	'<tpl for=".">',
		'<div data-id="{id}">',
	        '<span class="{cls}">{name}</span>',
	        '<p>{author}</p>',
	    '</div>',
    '</tpl>'
]
或者
books: function (data) {
	return '<div>'+ data.name +'</div>'
}

// 远程模板
books: 'views/user/books.html'
```

在类的初始化阶段，会对模板进行注册和编译。下面列出注册和遍历的步骤：

> - 判断类中所有的模板，区分出哪些模板是本地模板，哪些是远程模板
> - 通过一个固定的同步请求批量获得远程模板的内容，然后将内容赋值给对应的模板
> - 通过模板内容编译各个模板



对于远程模板，系统会根据 `Box.TEMPLATE_SERVER_URL` 来请求服务端获取模板内容，请求会根据远程模板自动生成JSON参数，例如下列模板：

```
templates: {
	info: "views/user/info.html",
	books: "views/user/books.html"
}
```

为请求生成的参数为：

```
{"info": "views/user/info.html", "books": "views/user/books.html"}
```

服务端的返回模板内容也是一个特定的JSON数据格式，还是上面的例子，服务端返回的应该是：

```
// 这里的 ... 代表模板的内容
{
	"info": ...,
	"books": ...
}
```



在模板编译过程中，系统会根据模板类型来编译模板，默认模板类型为 `tpl`（也就是采用 [Box.tpl.Template](#/api/Template) 来编译）。所以模板内容则要是符合 `Box.tpl.Template` 的模板内容规则。您也可以通过 `Box.TEMPLATE_TYPE` 来设置模板类型，目前系统自带支持 `tpl` 和 `ejs` （您可以通过 [http://www.embeddedjs.com/](http://www.embeddedjs.com/) 来了解ejs） 两种。

> 注意：在本地模板中，可以自定义编译函数，这时模板类型则不受 `tpl` 和 `ejs` 控制，您可以使用字符串拼接的方式来解析模板。如上面例子中的第二个模板


**当采用默认模板类型时**，在模板中定义的格式化函数和判断函数可以设置到类中。这时，函数的作用域为类本身。例如：

```
Box.define('App.page.User', {
	target: '#page_body',
	templates: {
		info: [
			'<div data-id="{id}">',
                '<span class="{cls}">{name:formatName()}</span>',
            '</div>'
		]
	},
	formatName: function (name) {
		return "姓名：" + name
	}
});
```

也可以设置这些函数到该模板的指定区域对象内（类中属性名为 `模板名 + "TemplateHelpers"` 对象）。这时，函数的作用域就指向到该区域对象本身。例如：

```
Box.define('App.page.User', {
	target: '#page_body',
	templates: {
		info: [
			'<div data-id="{id}">',
                '<span class="{cls}">{name:formatName()}</span>',
            '</div>'
		]
	},
	infoTemplateHelpers: {
		formatName: function (name) {
			// this为infoTemplateHelpers本身
			return "姓名：" + name
		}
	}
});
```

名称为 `main` 的模板称为主模板，用来构建组件基本内容。在组件渲染的开始阶段（`beforeRender`）中，如果检查到模板中含有主模板，则立即解析主模板生成对应的 jQuery 对象并且赋值给 `this.el.target`。

在解析主模板时，会调用 `getMainTplData` 方法来获得模板数据源，例如：

```
Box.define('App.page.User', {
	target: '#page_body',
	templates: {
		main: [
			'<div data-id="{id}">',
                '<span class="{cls}">{name}</span>',
            '</div>'
		]
	},
	getMainTplData: function () {
		return { id: '001', cls: 'user', name: '张三' }
	},
	...
});
```




## 配置


**autoRender** `Boolean`

是否立即渲染，如果设置为false，则需要手动执行 `render` 方法来渲染。默认为true


**elements** `Object`

DOM选择器，提高jQuery对象的复用性，尽可能的减小内存的使用。并且可以结合DOM事件一起使用。

```
elements: {
	items: '.list li.item'
},
events: {
	'click items': 'clickItemsFn'
}
```

**events** `Object`

提供简单明了的方式为组件内任意选择器DOM元素绑定事件，也可以为非选择器DOM元素绑定事件。

```
elements: {
	items: '.list li.item'
},
events: {
	'click items': 'clickItemsFn',
	'mouseover items': 'mouseoverItemsFn',
	'dblclick books {.books}': 'dblclickBooksFn'
}
```


**delegates** `Object`

将所有的事件都代理到 `this.el.target` 上，代理是通过jQuery的 `delegate` 方法处理的，但只能代理 `click` 事件


**templates** `Object`

注册一系列模板，提供给组件内部使用。详细请见上面说明


**listeners** `Object`

一个配置对象，包含一个或多个事件处理函数，在对象初始化时注册到对象中（实际上是调用了 `on` 方法）。在对象内部方法中通过 `trigger` 方法触发监听。

```
Box.define('App.page.User', {
    extend: 'Box.Base',
    sat: function () {
        this.trigger('eat');
    }
});

// 实例化
var user = new App.page.User({
    ...
    listeners: {
        // 监听eat事件
        'eat': function () {
            alert('user eat');
        }
    }
});
user.eat();
```

**target** `String/jQuery/HTML Element`

设置组件的目标对象。初始化时，系统会自动转换成jQuery对象


**renderTo** `String/jQuery/HTML Element`

设置组件的目标dom对象要插入到的dom对象。初始化时，系统会自动转换成jQuery对象


## 属性


**isComponent** `Boolean`

代表当前类是 `Box.Component` 的实例或者子类

**rendered** `Boolean`

当前组件是否已经渲染

**destroyed** `Boolean`

当前组件是否已经销毁

**hasListeners** `Object`

对象内包含所有监听器事件的键。该属性的设计目的是避免没有监听器时调用 `trigger` 的开销。 如果 `trigger` 要调用成百上千次，这尤其有用。 用法:

```
// 判断是否注册了add这个监听事件
if (this.hasListeners.add) {
    this.trigger('add', this, arg1);
}
```

**el** `Object`

存储组件内部所有选择器对应的jQuery对象，也可以手动设置任何jQuery对象到该属性对象中

```
this.el.list.css("border", "1px solid red");
this.el.table = $('table');
```

另外也可以通过 `element` 方法为 `el` 对象添加属性

```
var item = $('<div></div>');
item.appendTo(this.el.list);
// 往this.el.items中添加新的元素
// 如果this.el中不存在items，那么就新创建
this.element("items", item);
```


**tpl** `Object` ^protected^

存储组件中所有模板的编译函数。方法 `applyTemplate` 实际上也是调用 `tpl` 中对应的模板编译函数进行解析的。



## 方法


**constructor** `( [Object config] )` ^protected^

类的构造方法，当通过 `new` 关键字来创建新的实例时，会执行该方法，并且会将参数传递过来。

> - config：（可选）初始化配置

```
new App.ui.Window({
	title: 'window title',
	width: 1000,
	height: 500,
	...
});
```


**setting** `()` ^protected^

初始化组件的一个重要方法，该方法在组件实例化的时候被执行。它的目的是为 `Box.Component` 的子类提供所需的任何自定义构造逻辑。在重写该方法的时候，必须使用 `callParent` 方法来调用父类的方法。

下面的例子演示了如何动态的设置组件内部属性：

```
Box.define('App.DynamicButtonText', {
    extend: 'Box.Button',
    setting: function() {
        this.text = new Date();
        this.renderTo = document.body;
        this.callParent();
    }
});
// 实例化
new App.DynamicButtonText();
```


**beforeRender** `()` ^protected^

在组件渲染之前执行，根据 `target` 或 `renderTo` 属性生成 `this.el.target`。如果监听器 `beforerender` 事件中返回 `false`，则可以停止渲染。



**render** `()`

执行组件的渲染工作，在渲染阶段执行了主模板的渲染、选择器的初始化、事件绑定、事件代理等任务，并且自定义的 `setup` 函数也会在这些任务执行完后执行。

如果设置了 `autoRender` 为true，组件在初始化后就会立马执行改方法来渲染。否则你需要手动调用该方法来渲染组件。例如：

```
Box.define('App.ui.Comp', {
	extend: 'Box.Component',
	attrs: {
		renderTo: document.body,
		autoRender: false,
		...
	},
	...
});

var comp = new App.ui.Comp();
comp.render();
```




**onRender** `()` ^protected^

此时，组件的DOM已经插入到指定位置，并且也处理了 `elements` 属性的解析、事件绑定、事件代理等任务。最后会触发 `render` 监听器。




**afterRender** `()` ^protected^


在组件渲染完成后执行，在这个阶段，会触发 `afterrender` 监听器和调用自定义操作 `setup` 方法，并且将属性 `rendered` 设置为 `true`。



**query** `( String/HTML Element/jQuery selector, [String/HTML Element/jQuery context] ): jQuery`


jQuery 的别名，参数一样

```
this.query('ul li', this.el.body);
// 等价于
$('ul li', this.el.body)
```



**initTemplates** `()` ^private^

初始化编译模板，发生在类的初始化阶段。如遇到远程模板，使用同步请求从服务端拉取模板内容。

**applyElements** `()` ^private^

解析注册的选择器生成对应的jQuery对象到 `el` 属性中。



**initEvents** `()` ^private^

初始化配置属性 `events` 的DOM事件绑定。

**initDelegates** `()` ^private^

初始化配置属性 `delegates` 的DOM事件代理。

**initListeners** `()` ^private^

初始化配置属性 `listeners` 的事件监听。


**beforeDestroy** `()`  ^protected^

在组件销毁之前执行，这个阶段会解除所有的事件绑定、事件代理和销毁模板。如果监听器 `beforedestroy` 事件中返回 false，则可以停止销毁。

**destroy** `()`

销毁组件。


**onDestroy** `()` ^protected^

在 `beforeDestroy` 方法之后执行，在此阶段，会逐个销毁 `el` 属性中的 jQuery 对象。最后会触发 `destroy` 监听器

**afterDestroy** `()` ^protected^

在组件销毁之后执行，在这个阶段，会触发 `afterdestroy` 监听器，并且将属性 `destroyed` 设置为 true。

**applyTemplate** `( String name, Object/Array data, [Boolean retHtml] ): String/jQuery`

根据数据源解析指定的模板

> - name：模板名称
> - data：模板对应的数据源
> - retHtml：（可选）是否返回HTML字符串，如果为 false，返回值为解析后生成的jQuery对象

```
var info = {
	name: "张三",
	age: 30
};
var el = this.applyTemplate('info', info);
```


**applyTemplateTo** `( String name, Object/Array data, String/jQuery el, String type, [Boolean retHtml] ): String/jQuery`

根据数据源解析指定的模板，并且根据插入方式立即插入到指定jQuery对象中

> - name：模板名称
> - data：模板对应的数据源
> - el：jQuery对象，模板解析后的内容将插入到其中，当该参数为字符串类型时，代表DOM选择器的名称，也就是 `this.el` 中对应的jQuery对象。
> - type：插入方式，有 `append`、`prepend`、`after`、`before`、`overwrite` 五种方式
> - retHtml：（可选）是否返回HTML字符串，如果为 false，返回值为解析后生成的jQuery对象

参数 `type` 对应的值意思分别为：

> - append：将模板内容追加到指定节点的内部
> - prepend：将模板内容前置到指定节点内部
> - after：将模板内容添加到指定节点的后面
> - before：将模板内容添加到指定节点的前面
> - overwrite：将模板内容覆盖指定的节点内容

```
var info = {
	name: "张三",
	age: 30
};
var el = this.applyTemplateTo('info', info, 'target', 'append');
```


**getMainTplData** `(): Object/Array` ^protected^

重写该方法获取主模板的数据源

```
Box.define('App.page.User', {
    target: '#page_body',
    templates: {
        main: [
            '<div data-id="{id}">',
                '<span class="{cls}">{name}</span>',
            '</div>'
        ]
    },
    getMainTplData: function () {
        return { id: '001', cls: 'user', name: '张三' }
    },
    ...
});
```


**setup** `()` ^protected^

提供给开发者处理组件的自定义业务逻辑的函数，在组件完成渲染之后执行，但是 `rendered` 属性会再该方法执行后再设置为true。默认为一个空函数，开发者需要覆盖该函数来自定义。


```
Box.define('App.page.User', {
    renderTo: '#page_body',
    templates: {
        main: "views/page/user.html"
    },
    getMainTplData: function () {
        return { id: '001', cls: 'user', name: '张三' }
    },
    setup: function () {
    	this.eat();
    	...
	},
	eat: function () {
		alert('吃饭');
	}
});
```


**renderToFn** `( jQuery target, jQuery renderTo )` ^protected^

自定义目标dom对象如何插入到指定dom对象中。

> - target：目标dom对象，对应的值为 `this.el.target`
> - renderTo： 目标dom对象要插入到的dom对象，对应的值为属性 `renderTo` 对应的jQuery对象

```
Box.define('App.page.User', {
    renderTo: '#page_body',
    templates: {
        main: "views/page/user.html"
    },
    getMainTplData: function () {
        return { id: '001', cls: 'user', name: '张三' }
    },
    renderToFn: function (target, renderTo) {
    	// 将target插入到renderTo的内部的开始位置
    	renderTo.prepend(target);
    },
    setup: function () {
    	...
	}
});
```


**element** `( String name, String/jQuery/Element selector, [Boolean ignoreEvents] ): jQuery`

添加 jQuery 对象到 `el` 属性中，提高 jQuery 对象的复用性，尽可能的减小内存的使用（相当于缓存对象供后续使用）

> - name：注册到 `el` 属性中的名称
> - selector：jQuery 选择器，也可以是 jQuery 对象或 DOM 对象。写法格式请参考 `elements` 属性详解
> - ignoreEvents：（可选）是否忽略对添加的 jQuery 对象绑定已有的事件，默认为false

如在添加之前，`el` 属性中已包括要注册的名称（也就是通过 `this.el[name]` 可以获取到），那么会将通过 `selector` 参数生成的 jQuery 对象添加到该名称对应的对象中。

```
Box.define('App.page.User', {
    target: '#page_body',
    elements: {
    	td: 'table td'
    },
    events: {
    	'click td': 'onClickTd'
    },
    setup: function () {
    	var ele = $('<td></td>');
    	// 往this.el.td中添加新对象，并且也为新的jquery对象注册了click事件
    	this.element('td', ele);
	},
	onClickTd: function () {
		...
	}
});
```







**mon** `( String/jQuery target, String type, Function handler, [Object scope] ): void`

为 jQuery 对象绑定指定类型的事件，在组件销毁时，自动移除绑定

> - target： 待绑定事件的对象。当该参数为字符串类型时，代表DOM选择器的名称，也就是 `this.el` 中对应的jQuery对象。
> - type： 事件的类型，例如：`click`、`mouseover` 等等
> - handler： 事件触发执行的函数
> - scope：（可选） 事件函数的作用域，默认为当前类本身

当 `target` 为字符串类型时

```
this.mon("items", "click", function () {
	...
});
```

或者是一个jQuery对象

```
var lis = $('ul>li');
this.mon(lis, 'click', function () {
	...
});
```




**unmon** `( String/jQuery target, [String type] ): void`

为 jQuery 对象移除事件绑定

> - target： 待绑定事件的对象。当该参数为字符串类型时，代表DOM选择器的名称，也就是 `this.el` 中对应的jQuery对象。
> - type：（可选）事件的类型，例如：`click`、`mouseover` 等等。如果不设置该参数，则表示移除所有类型的事件

例如:

```
// 移除this.el.items的所有 `click` 事件
this.unmon('items', 'click');
// 移除this.el.items的所有事件
this.unmon('items');
```


**don** `( String selector, Function handler, [Object scope] ): void`

为组件内指定 jQuery 选择器对应的元素注册 `click` 事件代理。这样可以使得对应的 DOM 内容有修改时，无需重新绑定事件。在组件销毁时，自动移除代理

> - selector：jQuery选择器字符串，并且可以在 `this.el.target` 内部查找到的（所有的事件都是代理在this.el.target上）
> - handler：代理事件函数
> - scope：（可选）事件函数的作用域，默认为当前类本身

```
this.don(".li a", function () {
	...
});
```


**undon** `( String selector ): void`

移除指定 jQuery 选择器对应元素的 `click` 事件代理。

> - selector：jQuery选择器字符串，并且可以在 `this.el.target` 内部查找到的（所有的事件都是代理在this.el.target上）

```
this.undon(".li a");
```




## 事件


**beforerender** ``

**render** ``

**afterrender** ``

**beforedestroy** ``

**destroy** ``

**afterdestroy** ``

