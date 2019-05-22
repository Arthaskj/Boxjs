# Box.dom.Helper (singleton)

---

DomHelper 类提供了一套规范用来创建HTML片段，同时它也有从您的代码中创建HTML模板的能力。

## 元素规范对象

在创建元素时用到的规范对象. 此对象的属性被认为是元素属性， 除了以下4种特殊属性:

> - tag - 元素的标签名.
> - children or cn or items - 被创建和可链接的同种元素的定义对象的数组. 其可以随你愿意嵌套多深的级次.
> - cls - 元素的 `class` 属性. 根据 `DomHepler` 使用的是 `fragments` 还是 `DOM`， 决定该属性是以HTML片段中的 `"class"` 属性为结束，还是一个 `DOM` 节点的类名为结束.
> - html - 元素的 `innerHTML.`

对于其他任意属性，在构建HTML字符串前，不会自动进行HTML转义， 这意味着如果你的属性值中包含一些特殊字符时，你就必须事先手动对其进行HTML编码 (参考 `Box.String.htmlEncode`) 。

## 插入方式

下面这个例子， 有个带3个子项的无序序列要追加到已经存在的 `id` 为my_div的元素后:

```
var helper = Box.dom.Helper; // 创建一个速记别名
// 规范对象
var spec = {
    id: 'my_ul',
    tag: 'ul',
    cls: 'my-list',
    // 添加样式
    style: {
    	fontSize: '12px',
    	border: '1px solid red'
    },
    // 创建后追加其孩子
    children: [     // 也可以指定用'cn'代替'children'
        {tag: 'li', id: 'item0', html: 'List Item 0'},
        {tag: 'li', id: 'item1', html: 'List Item 1'},
        {tag: 'li', id: 'item2', html: 'List Item 2'}
    ]
};
var list = helper.append('#my_div', spec);
```
得出以下Dom结构

```
<ul id="my_ul" class="my-list" style="font-size:19px;border:1px solid red;">
	<li id="item0">List Item 0</li>
	<li id="item1">List Item 1</li>
	<li id="item2">List Item 2</li>
</ul>```

提供4种插入dom方式，分别为 `append` 、 `prepend` 、 `before` 和 `after`， 它们都拥有相同的参数和：

`( String/HTMLElement/jQuery el, Object/String obj, [Boolean returnElement] ) : HTMLElement/jQuery`

> - el 上下文元素
> - obj  DOM对象或原始HTML块
> - returnElement （可选）true时返回 `jQuery` 对象，反之返回DOM对象

上面4个插入方法的作用分别为：

> - append 创建新的节点并附加到el后
> - prepend 创建新的节点并作为el的第一个子节点
> - before 创建新的节点并插入到el前
> - after 创建新的节点并插入到el后

```
// 创建新的节点并附加到el后
helper.append('#my_div', spec);

// 创建新的节点并作为el的第一个子节点
helper.prepend('#my_div', spec);

// 创建新的节点并插入到el前
helper.before('#my_div', spec);

// 创建新的节点并插入到el后
helper.after('#my_div', spec);
```

**注意：**以上的这几种插入方法只能单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素。比如：

```
<div></div> <div></div> <div></div>
helper.append('div', spec);
// 只会插入到第一个div的内部
```



## 模板

真正强大的是在于内置的模板，我们可以通过调用 `createTemplate` 方法来创建一个模板，利用模板，可反复用于插入新元素。重温上例，我们这次可以利用模板:

```
// 创建节点
var list = helper.append('#my_div', {tag: 'ul', cls: 'my-list'});
// 获取模板
var tpl = helper.createTemplate({tag: 'li', id: 'item{0}', html: 'List Item {0}'});

for(var i = 0; i < 5, i++){
    tpl.append(list, [i]); // 使用模板附加到实际的节点
}
```

使用模板的另一个例子:

```
var html = '<a id="{0}" href="{1}" class="nav">{2}</a>';

var tpl = Box.dom.Helper.createTemplate(html);
tpl.append(document.body, ['link1', 'http://www.baidu.com/', "百度"]);
tpl.append(document.body, ['link2', 'http://www.google.com/', "谷歌"]);
```

相同的例子使用命名参数的方式:

```
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = Box.DomHelper.createTemplate(html);
tpl.append(document.body, {
    id: 'link1',
    url: 'http://www.baidu.com/',
    text: "百度"
});
tpl.append(document.body, {
    id: 'link2',
    url: 'http://www.google.com/',
    text: "谷歌"
});
```


## 编译模板

模板工作原理是使用正则表达式来操作的. 其效果是显著的， 但是你若要用同一个模板添加一堆的DOM元素，还可以通过模板的 `compile` 功能来进一步优化效率。 `compile` 方式的工作原理是在模板被解析时，获得每个变量点，然后创建输出一个动态函数，生成的函数执行方式是将这些零部件和传递的变量通过字符串连接起来， 而不是用正则表达式的方式。

```
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = Box.dom.Helper.createTemplate(html);
tpl.compile();

//... 然后在按正常方式使用模板
```

> 反复大量的执行正则去匹配的效率要小于执行一个字符串拼接方法。

