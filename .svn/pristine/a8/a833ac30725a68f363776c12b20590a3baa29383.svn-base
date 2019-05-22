### 事件绑定

通过 `events` 属性可以为已设定的选择器绑定指定的事件，例如：
> 如果只绑定一个事件则使用event属性，若绑定多个事件则使用events属性

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
> - eventFn：事件的执行函数，可以是一个字符串，表示当前类中的方法名，也可以直接传入封装好的函数（不建议这么做）

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
> - eventFn 事件的执行函数，可以是一个字符串，表示当前类中的方法名，也可以直接传入封装好的函数（不建议这么做）

`eventFn` 对应的方法拥有3个参数，分别为：

> - event 事件对象
> - target 当前目标的 `jQuery` 对象
> - scope 当前类本身