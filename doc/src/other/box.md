# Box (singleton)

---

Box 命名空间（全局对象）封装了所有类、单例和所有提供的实用方法。


## 配置

**USE_NATIVE_JSON** `Boolean`

是否使用本地浏览器解析JSON方法。 如果浏览器不支持原生JSON方法这个选项将被忽略。默认为 false。

> 注意: 原生 JSON 方法当遇到具有函数的对象将无法工作。 此外，属性名称必须用引号，否则数据将不能解析


**TEMPLATE_TYPE** `String`

所有组件中使用的模板的类型。系统自带支持两种类型：`tpl`（即 `Box.tpl.Template`）、`handlebars` 和 `ejs`。默认为 tpl。


**TEMPLATE_SERVER_URL** `String`

组件中远程模板的服务端请求地址。当您的程序中涉及到远程模板，这时需要设置该值。默认为空。


**TEMPLATE_SERVER_METHOD** `String`

组件中远程模板的服务端请求方式。方式有两种：`GET` 和 `POST`。默认为 GET。



## 属性

**EMPTY_FUNCTION** `Function`

一个可复用的空函数。

**EMPTY_STRING** `String`

一个零长度的字符串。可以用来做是否为空的判断，或者简单的赋值。

**browser** `Box.env.Browser`

类 Box.env.Browser 的全局实例

**features** `Box.env.FeatureDetector`

类 Box.env.FeatureDetector 的全局实例



## 方法


**apply** `( Object object, Object config, [Object defaults] ) : Object`

将配置的所有属性都复制到指定的对象。 需要注意的是，如果需要深度递归合并，并且不要引用原始子对象，使用 `Box.Object.merge` 来代替。

> - object：属性接受对象
> - config：属性提供对象
> - defaults：（可选）默认对象，属性可以作为默认值被拷贝

```
var obj1 = {a: 1, b: 2, c: {c1: 1, c2: 2}};
var obj2 = {a: 0, c: {c1: 0}};
Box.apply(obj1, obj2);
console.log(obj1); // {a: 0, b: 2, c: {c1: 0}}
```

如果使用 `Box.Object.merge` 的话

```
var obj1 = {a: 1, b: 2, c: {c1: 1, c2: 2}};
var obj2 = {a: 0, c: {c1: 0}};
Box.Object.merge(obj1, obj2);
console.log(obj1); // {a: 0, b: 2, c: {c1: 0, c2: 2}}
```




**applyIf** `( Object object, Object config ) : Object`

将配置的属性拷贝到指定对象，但和 `apply` 方法有所不同的是，只拷贝指定对象中没有的属性

> - object：属性接受对象
> - config：属性提供对象

``` 
var obj1 = {a: 1, b: 2, c: {c1: 1, c2: 2}};
var obj2 = {a: 0, d: 4};
Box.applyIf(obj1, obj2);
console.log(obj1); // {a: 1, b: 2, c: {c1: 1, c2: 2}, d: 4}
```



**copyTo** `( Object dest, Object source, String[] names ) : Object`

复制源对象身上指定的属性到目标对象。

> - dest：目标对象
> - source：源对象
> - names：一个属性列表的数组，或以逗号分隔的属性名列表字符串

```
var person = {
	name: 'zhangsan',
	hairColor: 'black',
	loves: ['food', 'sleeping', 'wife']
};
var object = {};
Box.copyTo(object, person, 'name,hairColor');
console.log(object);  // {name: 'zhangsan', hairColor: 'black'}
```




**each** `( Object/Array object, Function fn, [Object scope] )`

迭代对象或者数组，在每个迭代上调用给定的回调函数 在回调函数中返回 false 可以停止迭代。

> - object：迭代对象
> - fn：迭代的回调函数
> - scope：（可选）回调函数的作用域

回调函数 `fn` 拥有三个参数：

> - key/value：如果迭代的是对象，表示为迭代的键，如果迭代的是数组，则为当前迭代到的对象
> - value/index：如果迭代的是对象，表示为迭代的值，如果迭代的是数组，则为当前迭代到的下标
> - object：当前迭代对象本身

实际上，迭代对象或者数组，分别执行的是 `Box.Object.each` 和 `Box.Array.each` 方法。

```
var person = {
    name: 'zhangsan'
    hairColor: 'black'
    loves: ['food', 'sleeping', 'wife']
};
Box.each(person, function (key, value) {
	// key为键，vlaue为值
	console.log(key + ":" + value);
});

var array = [1, 2, 3, 4, 5];
Box.each(array, function (value, index) {
	// value为当前遍历到的元素，index为下标
	console(index + ":" + value);
});
```




**ns/namespace** `( String ... ): Object`

创建命名空间，避免污染全局。

```
Box.ns('Company.data');
console.log('Company'); // {data: undefined}
Company.Widget = function() { ... };
Company.data.CustomStore = function(config) { ... }; 
```




**log** `( String level, String message )`

根据不同的日志级别输出日志信息。日志级别有：error，warn，info 和 log 四种，默认为 log 级别。





**Error** `( Object config ): throw new Error`

输出详细的错误信息，并且抛出异常。

> - config：异常详细，当是个字符串时，则直接将该字符串作为异常信息抛出。如果是个对象，则会根据特定的格式来输出

当参数 `config` 为对象时，它的配置项如下： 

> - className：发生错误的类名称
> - methodName：发生错误的方法名
> - error：异常信息内容

```
Box.Error({
    className: "App.ui.TableGrid",
    methodName: "show",
    error: "参数类型不正确"
});
// throw Error [App.ui.TableGrid.show]: 参数类型不正确
```


当在通过 `Box.define` 定义的类中任何函数中使用该方法时，可不用手动检索设置 className 和 methodName，程序会自动设置。例如：

```
Box.define('App.User', {
	eat: function (n) {
		if (n > 10) {
			Box.Error('吃的太多了');
		}
	}
});
// 初始化
var user = new App.User();
user.eat(20);  // throw Error [App.User.eat]: 吃的太多了
```



**isEmpty** `( Object value, [Boolean allowEmptyString] ) : Boolean`

判断传入的值是否为空。

> - value：待判断的值
> - allowEmptyString：（可选）当带判断的值为字符串类型时，是否允许空字符串不为空，默认为 false

满足以及几种条件中任何一种就会判断为空:

> - null
> - undefined
> - 空数组
> - 空字符串 (除非 `allowEmptyString` 参数设置为 true， 此条件不成立)

以下的几个判断都返回 true

```
var name;
Box.isEmpty(name);
Box.isEmpty(age);
Box.isEmpty("");
Box.isEmpty([]); 
```

**isArray** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 Array 对象。

```
Box.isArray([1, 2, 3]); // true 
```


**isObject** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 Object 对象。

```
Box.isObject({name: 'zhangsan'});  // true
Box.isObject(document);  // false

function Person (name) {
	this.name = name;
}
Person.prototype = {
	eat: function () {}
}
Box.isObject(Person);  // false
```



**isEmptyObject** `( Object value ): Boolean`

判断传入的值是否是一个空对象，即对象中没有任何键值。前提是该对象必须满足 `Box.isObject` 方法的判断

```
Box.isEmptyObject({}); // true
Box.isEmptyOjject(document); // false
Box.isEmptyOjject({name: 'zhangsan'}); // false
```




**isFunction** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 Function 对象。

```
var fn = function () {}
Box.isFunction(fn); // true
Box.isFunction(String.prototype.toString); // true
```

**isString** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 String 对象。

```
Box.isString(123); // false
Box.isString("zhangsan"); // true
```

**isNumber** `( Object value ): Boolean`

判断传入的值是否是一个数字，包括整数和小数，正数和负数。

```
// return true
Box.isNumber(100); 
Box.isNumber(100.001); 
Box.isNumber(-100);
// return false
Box.isNumber("100");
```

**isNumeric** `( Object value ): Boolean`

判断传入的值是否是一个数值，该方法和 `Box.isNumber` 有所不同的是：该方法允许字符串的强制转换。

```
// return true
Box.isNumeric(100);
Box.isNumeric(100.001);
Box.isNumeric(-100);
Box.isNumeric("100.98"); 
```

**isDate** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 Date 对象

```
Box.isDate(new Date()); // true
```

**isBoolean** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 Boolean 对象

```
Box.isBoolean(false); // true
```

**isPrimitive** `( Object value ): Boolean`

判断传入的值是否是一个原生的 JavaScript 字符串、数字或布尔值。

```
// return false
Box.isPrimitive({}); 
Box.isPrimitive([]); 
// return true
Box.isPrimitive("zhangsan"); 
Box.isPrimitive(10002.98); 
Box.isPrimitive(false); 
```

**isElement** `( Object value ): Boolean`

判断传入的值是否是一个 `HTMLElement` 对象（DOM对象）

```
Box.isElement(document.body); 
```

**isDefined** `( Object value ): Boolean`

判断传入的值是否是已经被定义


**isIterable** `( Object value ): Boolean`

判断传入的值是否能够被迭代，满足以下几种情况中的一种就可以判断为可迭代：

> - 数组类型
> - Function 的 arguments 数组
> - 节点数组（DOM对象集合）或者 jQuery 对象

```
// return true
Box.isIterable([1, 2, 3, 4, 5]);
Box.isIterable(document.getElementsByTagName('div'));
Box.isIterable($("div"));
function (a, b, c) {
	Box.isIterable(arguments);
}
```


**isRegExp** `( Object value ): Boolean`

判断传入的值是否是一个 JavaScript 的 RegExp 对象

```
Box.isRegExp(/^.*&/); // true
```




**typeOf** `( Object value ): String`

获得指定对象的类型，并且以字符串的时候返回类型名称，下面列出所有类型名称：

> - undefined：如果给定的值是 undefined
> - null：如果给定的值是 null
> - string：如果给定的值是一个字符串
> - number：如果给定的值是一个数值
> - boolean：如果给定的值是一个布尔值
> - date：如果给定的值是一个 Date 对象
> - function：如果给定的值是function的引用
> - object：如果给定的值是一个对象
> - array：如果给定的值是一个数组
> - regexp：如果给定的值是一个正则表达式
> - element：如果给定的值是一个 DOM 元素
> - textnode：如果给定的值是一个 DOM 文本节点和包含空格以外的东西
> - whitespace：如果给定的值是一个 DOM 文本节点和包含只有空格



**clone** `( Object item ): Object`

深度复制克隆指定对象（非对象引用），返回一个新的对象

```
var array = [1, 2, 3, 4, 5];
var newArray = Box.clone(array);
console.log(newArray);  // [1, 2, 3, 4, 5]

var person = {
	name: 'zhangsan',
    hairColor: 'black',
    loves: ['food', 'sleeping', 'wife']
};
var newPerson = Box.clone(person);
newPerson.name = "lisi";
console.log(person.name);  // "zhangsan"
console.log(newPerson.name);  // "lisi"
```


**isEqual** `( Object a, Object b ): Boolean`

判断两个对象是否完全相等（===）

```
var person = {
	name: 'zhangsan',
	hairColor: 'black',
	loves: ['food', 'sleeping', 'wife']
};
var newPerson = person;
console.log(Box.isEqual(person, newPerson)); // true

newPerson = Box.clone(person);
console.log(Box.isEqual(person, newPerson)); // false
```

**coerce** `( Object from, Object to ): Object`

强制转换类型，只支持强制转换成字符串、布尔值、数字、日期、空（null）和未定义（undefined）。当以数字强制转换成日期，会将数字当做毫秒值计算转换成日期。另外如果以字符串类型日期转换成日期，将会使用 `Box.Date.defaultFormat` 来解析生成日期。

```
var boo = Box.coerce('false', Boolean); // false
var date1 = Box.coerce(1422937881179, Date); // Tue Feb 03 2015 12:38:12 GMT+0800
var date2 = Box.coerce("2015-01-29", Date); // Thu Jan 29 2015 00:00:00 GMT+0800
```



**define** `( String namespace, Object properties, [Function callback])` 

通过 `Box.define` 可以定义一个模块，它提供了三个参数： 

> - namespace 模块的命名空间，也是模块的名字
> - properties 模块的属性，方法对象
> - callback [可选] 模块定义完成后的回调函数

```
Box.define('MyApp.ui.GridTable', {
	...
}, function () {
	alert('MyApp.ui.GridTable defined');
});
```

参数 `properties` 的配置请查看 [Box.ClassManager](#/api/Module) 的说明。





**create** `( [String name], [Object... args] )`

通过类的全名、别名或者备用名来实例化对象。如果被检测到要实例化的类尚未加载， 它会尝试通过同步加载该类。

```
Box.define('Box.window.Window', {
    extend: 'Box.Component',
    alternateClassName: 'Box.Window',
    alias: 'widget.window',
    ...
});

// alias 别名
var window = Box.create('widget.window', {
    width: 600,
    height: 800,
    ...
});

// alternate name 备用名
var window = Box.create('Box.Window', {
    width: 600,
    height: 800,
    ...
});

// full class name 完整的类名
var window = Box.create('Box.window.Window', {
    width: 600,
    height: 800,
    ...
});

//单个对象与xclass属性:
var window = Box.create({
    xclass: 'Box.window.Window', // 任何有效的'name' (以上)
    width: 600,
    height: 800,
    ...
});
```


**getClass** `( Object object ): Box.Class`

获取所提供的对象类。如果它不是任意 `Box.define` 创建的类的一个实例，则返回null。

```
var component = new Box.Component();
Box.getClass(component); // returns Box.Component
```


**getClassName** `( Object object ): Box.Class`

根据其引用的类或它的实例获取名称

```
Box.getClassName(Box.Component); // returns "Box.Component"
```




**regexp** `(): Box.util.RegExp`

创建一个 Box.util.RegExp 实例。具体使用方法请查看 [Box.util.RegExp](#/api/RegExp)




**num** `( Object value, Number defaultValue ): Number`

将一个值转换成数字类型，如果转换失败，使用默认值代替。该方法是 `Box.Number.num` 的别名

> - value 待转换的值
> - defaultValue 当转换失败时（转换后是 `NaN` 的），使用的默认值

```
Box.num('1.23', 1); // returns 1.23
Box.num('abc', 1);  // returns 1
```


**merge** `( Object destination, Object... object ): Object`

递归的合并任意数量的对象，但是不引用他们或他们的子对象。该方法是 `Box.Object.merge` 的别名

```
var xx_company = {
    companyName: '合肥XX科技公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统'],
    isSuperCool: true,
    office: {
        size: 2000,
        location: '合肥高新区',
        isFun: true
    }
};

var yy_company = {
    companyName: '上海YY总公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统', '舆情监控系统'],
    office: {
        size: 40000,
        location: '上海'
    }
};

var merge_company = Box.merge(extjs, newStuff);

// 此时merge_company等于
{
    companyName: '上海YY总公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统', '舆情监控系统'],
    isSuperCool: true,
    office: {
        size: 40000,
        location: '上海',
        isFun: true
    }
}
```


**htmlEncode** `( String str ): String`

编码。转义 `&`, `<`, `>`, `'` 和 `"` 为能在html中显示的字符。该方法是 `Box.String.htmlEncode` 的别名

```
Box.String.htmlEncode('<div>zhangsan</div>');
// &lt;div&gt;zhangsan&lt;/div&gt;
```

**htmlDecode** `( String str ): String`

解码。将 `&amp;`, `&gt;`, `&lt;`, `&quot;` 和 `&#39;` 从字符串中还原成html显示格式。该方法是 `Box.String.htmlDecode` 的别名

```
Box.String.htmlDecode('&lt;div&gt;zhangsan&lt;/div&gt;');
// <div>zhangsan</div>
```


**urlEncode** `( Object object, [Boolean recursive] ): String`

将一个对象转换成编码的查询字符串

> - object 要编码的对象
> - recursive （可选） 是否递归的翻译对象


不递归:

```
Box.urlEncode({foo: 1, bar: 2}); // "foo=1&bar=2"
Box.urlEncode({foo: null, bar: 2}); // "foo=&bar=2"
Box.urlEncode({'some price': '$300'}); // "some%20price=%24300"
Box.urlEncode({date: new Date(2011, 0, 1)}); // "date=%222011-01-01T00%3A00%3A00%22"
Box.urlEncode({colors: ['red', 'green', 'blue']}); // "colors=red&colors=green&colors=blue"
```
递归：

```
Box.urlEncode({
    username: 'Jacky',
    dateOfBirth: {
        day: 1,
        month: 2,
        year: 1911
    },
    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
}, true); 

// 返回如下字符串(换行和url-decoded是为了便于阅读的目的):
// username=Jacky
//    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
//    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
```

**urlDecode** `( String queryString, [Boolean recursive] ): Object`

将查询字符串转换成对象

> - queryString 要解码的查询字符串
> - recursive （可选） 是否递归的解码字符串

不递归:

```
Box.urlDecode("foo=1&bar=2"); // {foo: 1, bar: 2}
Box.urlDecode("foo=&bar=2");  // {foo: null, bar: 2}
Box.urlDecode("some%20price=%24300"); // {'some price': '$300'}
Box.urlDecode("colors=red&colors=green&colors=blue"); // {colors: ['red', 'green', 'blue']}
```
递归：

```
Box.urlDecode(
    "username=Jacky&"+
    "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
    "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
    "hobbies[3][0]=nested&hobbies[3][1]=stuff", 
    true
);

// 返回
{
    username: 'Jacky',
    dateOfBirth: {
        day: '1',
        month: '2',
        year: '1911'
    },
    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
}
```








**defer** `( Function fn, Number millis, [Object scope], [Array args], [Boolean/Number appendArgs] ): Number`

延迟调用函数。该方法是 `Box.Function.defer` 的别名

> - fn 要延迟执行的函数
> - millis 延迟时间，以毫秒为单位 (如果小于或等于0函数则立即执行)
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`
> - args（可选）覆盖原函数的参数列表 （默认为该函数的参数列表）
> - appendArgs（可选）如果该参数为 `true`，将参数加载到该函数的后面， 如果该参数为数字类型，则将参数将插入到所指定的位置。

```
var sayHi = function(name){
    alert('Hi, ' + name);
}

// 即刻执行的:
sayHi('张三');

// 两秒过后执行的:
Box.Function.defer(sayHi, 2000, this, ['张三']);

// 有时候加上一个匿名函数也是很方便的:
Box.Function.defer(function(){
    alert('张三');
}, 100);
```

**pass** `( Function fn, Array args, [Object scope] ): Function`


创建当前函数的回调函数，新的参数传递到新创建的回调函数中，调用时追加到预先设定的参数之后。该方法是 `Box.Function.pass` 的别名

> - fn 原始函数
> - args 要传递给新的回调函数的参数
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`

```
var originalFunction = function(){
    alert(Box.Array.from(arguments).join(' '));
};

var callback = Box.Function.pass(originalFunction, ['Hello', 'World']);

callback(); // 'Hello World'
callback('by me'); // 'Hello World by me'
```


**bind** `( Function fn, [Object scope], [Array args], [Boolean/Number appendArgs] ): Function`

根据指定函数 `fn` 创建一个代理函数，更改 `this` 作用域为传入的作用域， 也可以选择重写调用的参数（默认为该函数的参数列表）。该方法是 `Box.Function.bind` 的别名

> - fn 需要被代理的原始函数
> - scope（可选）该函数执行的作用域( `this引用` )。 如果省略，默认指向默认的全局环境对象(通常是 `window`)
> - args（可选）覆盖原函数的参数列表（默认为该函数的参数列表）
> - appendArgs（可选）如果该参数为 `true`，将参数加载到该函数的后面， 如果该参数为数字类型，则将参数将插入到所指定的位置

```
Box.define('App.ui.xxx', {
	template: [
		'<tpl for=".">',
			'<div>{name}</div>',
		'</tpl>'
	],
	init: function () {
		this.post('getUsers.do')
	},
	post: function (url) {
		$.ajax({
			url: url,
			success: Box.Function.bind(this.successCallback, this)
		})
	},
	successCallback: function (data) {
		this.tpl = new Box.tpl.Template(this.template);
		...
	}
});

var ui = new App.ui.xxx();
ui.init();
```

为函数添加参数

```
function sum (a, b) {
	var args = Box.Array.toArray(arguments);
	return Box.Array.sum(args);
}
sum(1, 2); // 3
sum = Box.Function.bind(sum, null, [100, 200], true);
sum(1, 2); // 303
```


**callback** `( Function callback, [Object scope], [Array args], [Number delay] )`

在一个指定的作用域内执行一个回调函数。如果回调函数不存在，或者不是一个函数，那么调用被忽略。该方法是 `Box.Function.callback` 的别名。

```
Box.callback(myFunc, this, [arg1, arg2]);
// 等价于
Box.isFunction(myFunc) && myFunc.apply(this, [arg1, arg2]);
```




**query/get** `( Object selector, [Object context] ): jQuery`

jQuery的引用，具体用法请查考 [jQuery API](http://hemin.cn/jq)

```
var dom = $('li');
// 等价于
var dom = Box.get('li');
```



**ajax** `( Object config )`

jQuery的ajax方法的引用，具体用法请查考 [jQuery API](http://hemin.cn/jq/jQuery.ajax.html)




**getDom** `( HTMLElement/jQuery/String el ): HTMLElement`

根据给定的内容获取DOM对象，当给定的值为jQuery对象时，直接返回对象的第一个DOM节点。若为字符串时，则会先把该字符串当做jQuery选择器生成jQuery对象，然后再返回它的第一个DOM节点。

```
var li = $('li');
var dom = Box.getDom(li);
var dom2 = Box.getDom('.item');
```
