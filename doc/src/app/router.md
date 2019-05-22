# Box.app.Router (class)

---

客户端的路由解析器


## 使用说明

路由注册在URL里的体现是用 `"#"` 符号来标识路由的开始，再利用 `"/"` 分隔符（分隔符可自定义，后面会讲到）来定义路由片段。客户端路由其实就是通过URL来区分应用程序的不同状态，并且定义在不同的状态下应该做什么事情。当用户访问不同的URL时，Box.app.Router 会解析路由信息并告知应用程序需要做什么事情。

路由格式具体可参考下图：

![路由解析](../doc/resource/images/hashRoute.png)

下面是一个简单的例子：

```
Box.create('Box.app.Router', {
    routes: {
    	"help": "help",  
	    "search/:query": "search", 
	    "search/:query/p:page": "search",
	    "search/*path": "searchPath"
	},
	help: function () {
		...
	},
	search: function (query, page) {
		...
	},
	searchPath: function (path) {
		...
	}
});
```

单个路由规则的定义方式为：`route: action`。 route 表示规则的表达式， action 表示该规则对应的执行动作函数（当 action 为一个字符串时，会根据类中的 scope 属性对象来查找执行函数）。 在规则表达式中，我们可以定义完全字符串匹配，还需要注意两种特别的动态规则：

> - 规则中以 `/`（斜线）为分隔的一段字符串，在 Router 类内部会被转换为表达式 ([^\/]+)，表示以 `/`（斜线）开头的多个字符，如果在这一段规则中设置了 `:`（冒号），则表示 URL 中这一段字符串将被作为参数传递给 `action` （对应的处理函数）。例如我们设置了规则 `topic/:id`，当锚点为 `#topic/1023` 时，1023 将被作为参数 id 传递给 action，规则中的参数名（:id）一般会和 action 方法的形参名称相同，虽然 Router 并没有这样的限制，但使用相同的参数名更容易让人理解。
> - 规则中的 `*`（星号）会在 Router 内部被转换为表达式 (.*?)，表示零个或多个任意字符，与 `:`（冒号）规则相比，`*`（星号）没有 `/`（斜线）分隔的限制，就像我们在上面的例子中定义的 `search/*path` 规则一样。Router 中的 `*`（星号）规则在被转换为正则表达式后使用非贪婪模式，因此你可以使用例如这样的组合规则：`*type/:id`，它能匹配 `#hot/1023`，同时会将 hot 和 1023 作为参数传递给 action 方法。


## 配置


**routes** `Object`

定义路由规则的对象，路由规则的定义请看上面的使用说明。

**scope** `Object`

执行函数的作用域，默认为类自身。

```
var routerFns = {
	help: function () { ... },
	download: function () { ... },
	openFolder: function () { ... }
};

Box.create('Box.app.Router', {
    routes: {
	     "help/:page": "help",
         "download/*path": "download",
         "folder/:name": "openFolder",
         "folder/:name-:mode": "openFolder"
	},
	scope: routerFns
});
```



## 方法


**set** `( String/Object route, [Function/String action] )`

设置一个或多个路由监听。

```
var router = Box.create('Box.app.Router', {
    routes: {
         "download/*path": "download",
         "folder/:name": "openFolder"
	},
	scope: routerFns
});
router.set("folder/:name-:mode", 'openFolder');
```

**navigate** `( String path )`

手动设置导航到一个路由下。
