# Box.tpl.Base (class)

---

HTML片段模板，这个类可以由一个参数或多个参数来实例化。


## 使用说明 

如下一段代码，在页面上显示某人的一些信息（`name` 和 `birthday`）


    <div style="...">小王</div><div style="...">1983-09-24</div>


很多时间我们需要变化的仅仅是 `name`、`birthday` 这两个部分。如果对于小王，小李等不同的人，每次都要完全重写这一段内容。首先很烦琐，修改起来也麻烦，`style` 是统一的，是否能有一种方案让我们只要修改一个地方就能完整所有的情况。 

**模板！** 把静态不变的内容做成模板，把动态变化的内容采用插值（比如 `${}`、`<%= %>`、`{{}}` 等等）的形式插入。构成我们要的内容。（`JSP` 就是一个模板）

对于上面的需求，我们使用模板来实现：

    <div style="...">{name}</div><div style="...">{birthday}</div>

但是，对于模板有几个问题：

> - 对于 `Javascript` 模板，其最终的结果就是生成在浏览器中能显示的内容。对于显示的内容来说，模板静态部分可以写死格式，动态部分怎么办呢？
> - 比如出生年月不想采用 1983-09-24 而是采用 1983年9月24日。对于这样的格式转换，很多类库都会有通用的格式化函数。现在的问题是如何把这一些函数引入进来？
> - 还有一些不通用的格式转换，这部分涉及到业务逻辑。比如：小王，我们想把 `name` 的动态值部分改成王先生，或王小姐，这就是和性别相关了。这种格式转换的代码只能用户自己写。那么又如何加入呢？ 


`Box.tpl.Base` 就是解决上面一些问题的。它的插值符号采用 `{}`，其格式采用

```
{name[:][formatFn][(params)]}
```

`[]` 表示可选的。可以分成两部分：

> - name 动态值属性名
> - formatFn 格式化的函数


### 属性格式化 

格式化函数 `formatFn` 分为默认和自定义两种

#### 默认

默认的格式化函数都是 `Box.util.Format` 中的函数，如下面的模板使用 `Box.util.Format.date` 函数对 `birthday` 进行格式化

    <div style="...">{name}</div><div style="...">{birthday:date('y-M-d')}</div>

对于默认格式化函数，参数设置如下：

> - 第一个参数是默认的后台传入的，也就是 `name`（动态属性）的值。对于 `Box.util.Format` 中的函数来说，如 `ellipsis(10)`，只要函数名就可以，而不能用 ` Box.util.Format.ellipsis`。
> - 之后的参数传入就是该调用的参数的顺序，如 `ellipsis` 第二个参数就是10。如果只有一个参数（默认的第一个参数），函数的 `()` 可省，如 `{name:trim}`。 


比如，上面的例子，`Box.util.Format.date` 函数有2个参数：`( value, format )`，第一个参数 `value` 为 当前 `birthday` 的值， 第二个参数 `format` 为格式化字符串。

下面列出 `Box.util.Format` 中的格式化方法列表： undef，defaultValue，substr，lowercase，uppercase，usMoney，currency，date，stripTags，stripScripts，fileSize，math，round，number，plural，nl2br，ellipsis，format，htmlDecode，htmlEncode，leftPad，trim。（具体详情请看[Box.util.Format](#/api/Format)）


#### 自定义

对于自己实现的模式化函数，需要在方法名前加上 `this.`

    <div style="...">{name}</div><div style="...">{birthday:this.date('y-M-d')}</div>

自定义格式化函数只有两个参数

> - 一是该 `name`（动态属性）的值
> - 二是该模板传入的所有的动态值（`values`）


这也就是说我们在实现自己的格式化函数时，只能按这样的格式去写



### 如何创建


构建一个模板的操作非常简单。首先我们得定义模板内容，定义模板内容其实就是定义Html标签内容，把动态的部分采用插值形式书写就可以。如：

```
<span class="{cls}">{name:trim} {value:ellipsis(10)}</span>
```

`Box.tpl.Base` 的构建函数采用更灵活的方式让我们定义模板。分为2种创建方式：

#### 通过一个配置对象来创建模板（并且只能有一个参数）

在配置项中，我们可以设置 `html` 属性来设置模板内容，该值可以是一个数组或者一个字符串，例如：

```
var template = new Box.tpl.Base({
    html: "<div>Hello {0}.</div>"
});
```

> 注意：如上，模板处理可以使用 `{属性名}`，也可以使用类似于 `Box.String.format` 方法那样的 `{下标}`（代表下标索引）。

或者

```
var template = new Box.tpl.Base({
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name:trim} {value:ellipsis(10)}</span>',
        '</div>'
    ]
});
```

#### 通过非对象性质的配置参数来创建模板（可以有多个参数）

```
var template = new Box.tpl.Base("<div>Hello {0}.</div>");
```

或者

```
var template = new Box.tpl.Base(
    '<div name="{id}">',
        '<span class="{cls}">{name:trim} {value:ellipsis(10)}</span>',
    '</div>'
);
```

### 属性配置


传入了模板内容，可能我们还要进行一些配置。 比如：是否需要编译，是否使用默认格式化，以及自己实现的格式化函数。我们可能通过往 `Box.tpl.Base` 的构造函数参数最后添加一个对象来设置我们需要的配置。如：

通过第一种方式创建

```
var template = new Box.tpl.Base(
    '<div name="{id}">',
        '<span class="{cls}">{name} {value}</span>',
    '</div>',
    {
        compiled：true, 
        disableFormats：true
    }
);
```


通过第二种方式创建

```
var template = new Box.tpl.Base({
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name} {value}</span>',
        '</div>',
    ],
    compiled：true, 
    disableFormats：true
});
```

如果您在模板中使用了自定义的格式化函数的话，您需要配置这些函数到类中

```
var template = new Box.tpl.Base({
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name:this.formatName()} {value}</span>',
        '</div>',
    ],
    compiled：true, 
    disableFormats：true, 
    // 自定义格式化方法
    formatName:function(value, values){
        ...
    },
    ...
});
```

或者您也可以把这些函数设置到一个 `scope` 属性中：

```
var scope = {
    // 自定义格式化方法
    formatName:function(value){
        ...
    },
    ...
};

var template = new Box.tpl.Base({
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name:this.formatName()} {value}</span>',
        '</div>',
    ],
    compiled：true, 
    disableFormats：true,
    scope: scope
});
```

自定义函数拥有一个默认参数，也是第一个参数，就是当前格式化对应的属性的值，比如 `{name:this.formatName()}` 对应的方法为：

```
formatName: function (value) {
    // 这个value就是name属性的值
}
```

您也可以为自定义函数添加额外数量的参数，比如 `{date:this.formatDate("y-M-d")}` 对应的方法为：

```
formatDate: function (value, format) {
    // 这个value就是date属性的值, format的值为"y-M-d"
}
```



## 配置

**html** `Array/String`

模板内容，可以是 `Array` 类型也可以是 `String` 类型，默认为空

**scope** `Object`

自定义函数对象，当不设置该值的话，自定义的函数都会从当前类中寻找方法。

**compiled** `Boolean`

是否将立编译模板，默认为 `false`

**disableFormats** `Boolean`

是否在模板中禁用格式化函数。如果模板没有设置自定义格式化函数，设置 `disableFormats` 为 `true`，程序会执行 `Box.util.Format` 中对应的方法。默认为 `false`

> 注意：当在一个模板中，没有用到默认的格式化函数的时候，设置 `disableFormats` 为 `false` 是可以减少 `apply` 的时间

## 属性


**isTemplate** `Boolean`

代表当前类是 `Box.tpl.Base` 的实例或者子类

## 方法

**new Box.tpl.Base** `( String... html, Object config ): Object`

创建新的模板，用法参考上面的说明

**apply** `( Object/Array values ): String`

根据数据源解析模板生成一段 `HTML` 字符串，数据源可以是一个数字数组：

```
var tpl = new Box.tpl.Base('<span>name: {0}, age: {1}</span>');
var html = tpl.apply(['张三', 25]); // '<span>name: 张三, age: 25</span>'
```

或者一个对象：

```
var tpl = new Box.tpl.Base('<span>name: {name}, age: {age}</span>');
var html = tpl.apply({name: '张三', age: 25}); // '<span>name: 张三, age: 25</span>'
```


**applyTemplate** `( Object/Array values ): String`

方法 `apply` 的别名，用法请看它的描述说明


**compile** `(): Box.tpl.Base`

编译模板，并且设置为内部函数。返回自身模板对象

> 注意：没通过 `compile` 进行编译的模板，在解析的时候， 都是通过正则表达式进行解析。如果在解析量大，结构复杂的情况下，再使用正则解析的话，会降低解析效率。这种情况下，我们可以手动调用 `compile` 方法或者在创建模板对象的时候设置 `compiled` 属性为 `true`，来编译模板形成一个内置函数提供每次解析使用，以提高效率。

```
var tpl = new Box.tpl.Base(
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name} {value}</span>',
        '</div>'
    ]
);
tpl.coompile();
...
```

或者

```
var tpl = new Box.tpl.Base({
    html: [
        '<div name="{id}">',
            '<span class="{cls}">{name} {value}</span>',
        '</div>'
    ],
    // compiled值为true，立即编译模板
    compiled: true 
});
...
```


**append** `( String/HTMLElement/jQuery el, Object/Array values, [Boolean returnElement] ): HTMLElement/jQuery`

根据数据源解析模板，并将结果**追加**到指定节点的内部

> - el 上下文元素
> - values 模板数据源
> - returnElement（可选）是否返回一个 `jQuery` 对象，如果为 `false`，返回值为 `DOM` 对象

> 注意：属于单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素

```
var dom = tpl.append($(document.body), {name: "张三", age: 30}, true);
```



**prepend** `( String/HTMLElement/jQuery el, Object/Array values, [Boolean returnElement] ): HTMLElement/jQuery`

根据数据源解析模板，并将结果**前置**到指定节点内部

> - el 上下文元素
> - values 模板数据源
> - returnElement（可选）是否返回一个 `jQuery` 对象，如果为 `false`，返回值为 `DOM` 对象

> 注意：属于单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素

```
var dom = tpl.prepend($(document.body), {name: "张三", age: 30}, true);
```



**after** `( String/HTMLElement/jQuery el, Object/Array values, [Boolean returnElement] ): HTMLElement/jQuery`

根据数据源解析模板，并将结果添加到指定节点的后面

> - el 上下文元素
> - values 模板数据源
> - returnElement（可选）是否返回一个 `jQuery` 对象，如果为 `false`，返回值为 `DOM` 对象

> 注意：属于单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素

```
var dom = tpl.after($(document.body), {name: "张三", age: 30}, true);
```


**before** `( String/HTMLElement/jQuery el, Object/Array values, [Boolean returnElement] ): HTMLElement/jQuery`

根据数据源解析模板，并将结果添加到指定节点的前面

> - el 上下文元素
> - values 模板数据源
> - returnElement（可选）是否返回一个 `jQuery` 对象，如果为 `false`，返回值为 `DOM` 对象

> 注意：属于单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素

```
var dom = tpl.before($(document.body), {name: "张三", age: 30}, true);
```


**overwrite** `( String/HTMLElement/jQuery el, Object/Array values, [Boolean returnElement] ): HTMLElement/jQuery`

根据数据源解析模板，并使结果覆盖指定的节点内容

> - el 上下文元素
> - values 模板数据源
> - returnElement（可选）是否返回一个 `jQuery` 对象，如果为 `false`，返回值为 `DOM` 对象

> 注意：属于单插入，即 `el` 对应的 `element` 元素只能为1个，如果参数 `el` 为一个 `jQuery` 对象，并且该对象是一个集合，那么程序只会识别第一个 `element` 元素

```
var dom = tpl.overwrite($(document.body), {name: "张三", age: 30}, true);
```

