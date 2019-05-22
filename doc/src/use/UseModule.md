## 模板定义 ##

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
