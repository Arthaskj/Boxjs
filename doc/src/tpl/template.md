# Box.tpl.Template (class)

---

继承于 `Box.tpl.Template` 类（拥有它的所有特性），支持更高级功能的模板类，如：

> - 数组循环
> - 支持条件判断运算
> - 支持基础数学运行
> - 可执行特殊内建模板变量的任意内联代码
> - 支持常用的功能方法
> - 提供很多特殊的标签和内置运算符


## 使用说明

`Box.tpl.Template` 的构造方式和 `Box.tpl.Template` 是一样的，这里就不做复述了。

下面一一介绍该类的模板特性，提供一个数据源以供下面例子使用

```
var data = {
    name: '王二麻',
    title: '人员信息',
    company: '合肥xxx信息技术有限公司',
    drinks: ['咖啡', '可口可乐', '百事可乐'],
    kids: [
        { name: '王晓春',  age: 17 },
        { name: '王晓夏',  age: 13 },
        { name: '王晓秋',  age: 10 },
        { name: '王晓冬',  age: 5 }
    ],
    friends: ["张三", "李四", "王五", "小黄"]
};
```

### 数组的循环

标签 `tpl` 和操作符 `for` 可以用来循环数组。

> - 如果操作符 `for` 中的值对应到数据源中是一个数组，则循环解析 `tpl` 标签下的子模板
> - 如果操作符 `for` 的值为"`.`"，则可以遍历数据源（此时数据源必须是一个数组）
> - 在循环一个数组时，我们可以通过特殊的变量 `{#}` 来获得数组遍历的索引值（由1开始，不是0）

例如：

```
<tpl for=".">...</tpl>       // 遍历根节点数组
<tpl for="foo">...</tpl>     // 遍历数组foo
<tpl for="foo.bar">...</tpl> // 遍历foo下的数组bar
```

使用上面的数据源

```
var tpl = new Box.tpl.Template(
    '<p>孩子: ',
	    '<tpl for=".">',       
	        '<p>{#}. {name}</p>', 
	    '</tpl>',
    '</p>'
);
tpl.overwrite('#div', data.kids); 
```

下面的例子展示了在循环数组中，可通过 `{属性名}` 在当前的循环中输出属性值

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>标题: {title}</p>',
    '<p>公司: {company}</p>',
    '<p>孩子: ',
	    '<tpl for="kids">',     
	        '<p>{name}</p>',
	    '</tpl>',
    '</p>'
);
tpl.overwrite('#div', data);  
```

当一个数组里的元素都是字符串或者数字的话，遍历该数组的时候，可以使用特殊变量 `{.}` 来输出元素

```
var tpl = new Box.tpl.Template(
    '<p>{name}的朋友：</p>',
    '<tpl for="friends">',
        '<div>{.}</div>',
    '</tpl>'
);
tpl.overwrite('#div', data);
```

你可以在循环体中使用 `parent` 对象来获取和数组平级的其他属性值

```
var tpl = new Box.tpl.XTemplate(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
	    '<tpl for="kids">',
	        '<p>{name}</p>',
	        '<p>父亲: {parent.name}</p>',
	    '</tpl>',
    '</p>'
);
tpl.overwrite('#div', data);
```




### 条件运算符


标签 `tpl` 和操作符 `if`，可用来执行条件判断，以决定模板的哪一部分需要被渲染出来。

基本语法如下，使用上面提供的数据：

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<tpl if="age &gt; 1">',
                '<p>{name}</p>',
            '</tpl>',
        '</tpl>',
    '</p>'
);
tpl.overwrite('#div', data);
```

也支持 `if ... else ...` 、`... else if ...` 和 `switch` 语法，如下：

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<p>{name} is a ',
            '<tpl if="age &gt;= 13">',
                '<p>大于等于13岁</p>',
            '<tpl elseif="age &gt;= 2">',
                '<p>小于等于2岁</p>',
            '<tpl else">',
                '<p>13岁到2岁之间</p>',
            '</tpl>',
        '</tpl>',
    '</p>'
);
```

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<p>{name} 是一个 ',
            '<tpl switch="name">',
                '<tpl case="王晓春" case="王晓秋">',
                    '<p>女孩</p>',
                '<tpl default">',
                    '<p>男孩</p>',
            '</tpl>',
        '</tpl>',
    '</p>'
);
```

> `switch` 语法中，一个 `case` 对应一个 `break`


### 基础数学支持



`Template` 也支持以下基础的数学操作

```
+ - * /
```

用法如下：

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<tpl if="age &gt; 1">',   
                '<p>{#}: {name}</p>',  
                '<p>年龄: {age+5}</p>',  
                '<p>父亲: {parent.name}</p>',
            '</tpl>',
        '</tpl>',
    '</p>'
);
tpl.overwrite('#div', data);
```



### 在模板内支持内联代码和代码块

在 `Template` 的框架内，可以通过 `{[ ... ]}` 来执行任意内联代码。 在内联代码中可使用以下几个特殊变量：


> - values: 当前作用域下的值
> - parent: 当前作用域下的父级对象
> - xindex: 如在循环模板中，代表当前循环到的的索引(从1开始)
> - xcount: 如在循环模板中，代表循环的数组的长度

使用内联代码和索引改变行的颜色的例子：

```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>公司: {[values.company.toUpperCase() + ", " + values.title]}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<div class="{[xindex % 2 === 0 ? "even" : "odd"]}">{name}</div>',
        '</tpl>',
    '</p>'
);
```



我们也可以使用 `{% ... %}` 来执行任意内联代码块，这些代码只处理不输出，比如：


```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>公司: {[values.company.toUpperCase() + ", " + values.title]}</p>',
    '<p>孩子: ',
    '<tpl for="kids">',
        '{% if (xindex > 1) { continue; } %}',
        '<div>{name}</div>',
    '</tpl></p>'
);
```


### 自定义模板成员函数


在 `Template` 中，自定义的模板函数和格式化函数可通过构造函数的配置来设置


```
var tpl = new Box.tpl.Template(
    '<p>姓名: {name}</p>',
    '<p>孩子: ',
        '<tpl for="kids">',
            '<tpl if="this.isGirl(name)">',
                '<p>女孩: {name} - {age}</p>',
            '<tpl else>',
                '<p>男孩: {name} - {age}</p>',
            '</tpl>',
            '<tpl if="this.isBaby(age)">',
                '<p>{name} 是一个男孩!</p>',
            '</tpl>',
        '</tpl>',
    '</p>',
    {
        isGirl: function(name){
           return name == '王晓春';
        },
        isBaby: function(age){
           return age > 10;
        }
    }
);
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

代表当前类是 `Box.tpl.Template` 的实例或者子类

## 方法

**new Box.tpl.Template** `( String... html, Object config ): Object`

创建新的模板，用法参考上面的说明

**apply** `( Object/Array values ): String`

根据数据源解析模板生成一段 `HTML` 字符串，数据源可以是一个数字数组：

```
var tpl = new Box.tpl.Template('<span>name: {0}, age: {1}</span>');
var html = tpl.apply(['张三', 25]); // '<span>name: 张三, age: 25</span>'
```

或者一个对象：

```
var tpl = new Box.tpl.Template('<span>name: {name}, age: {age}</span>');
var html = tpl.apply({name: '张三', age: 25}); // '<span>name: 张三, age: 25</span>'
```


**applyTemplate** `( Object/Array values ): String`

方法 `apply` 的别名，用法请看它的描述说明


**compile** `(): Box.tpl.Template`

编译模板，并且设置为内部函数。返回自身模板对象

> 注意：没通过 `compile` 进行编译的模板，在解析的时候， 都是通过正则表达式进行解析。如果在解析量大，结构复杂的情况下，再使用正则解析的话，会降低解析效率。这种情况下，我们可以手动调用 `compile` 方法或者在创建模板对象的时候设置 `compiled` 属性为 `true`，来编译模板形成一个内置函数提供每次解析使用，以提高效率。

```
var tpl = new Box.tpl.Template(
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
var tpl = new Box.tpl.Template({
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













