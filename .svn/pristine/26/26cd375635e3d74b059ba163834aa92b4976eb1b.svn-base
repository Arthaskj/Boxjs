# Box.util.RegExp (class)

---

RegExp 类通过链式方式使得构建复杂正规表达式变得简单，一目了然。`Box.RegExp` 是它的别名。

## 使用说明



```
var regexp = new Box.util.RegExp()
    .startOfLine()
    .then("http")
    .maybe("s")
    .then("://")
    .maybe("www.")
    .anythingBut(" ")
    .endOfLine();

var url = "https://www.google.com";

if (regexp.test(url)) {
	alert("the is a correct url");
} else {
	alert("the url is incorrect");
}
```

上面的例子等价于

```
var regex = /^(http)(s)?(\:\/\/)(www\.)?([^\ ]*)$/;
var url = "https://www.google.com";
if (regex.test(url)) {
	...
}
```


## 属性


**isRegExp** `Boolean`

代表当前类是 Box.util.RegExp 的实例或者子类

**prefixes** `String` ^protected^

正则的开始字符串，当调用 startOfLine 方法时，该值为 `"^"`

**suffixes** `String` ^protected^

正则的结束字符串，当调用 endOfLine 方法时，该值为 `"$"`

**source** `String` ^protected^

动态生成的正则字符串的组要内容（除去开始和结束字符串）

**modifiers** `String` ^protected^

正则的修饰符。包含 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。这些修饰符可以叠加使用，使用字符串连接。可以通过方法 `setModifier` 进行设置。默认为 `"gm"`


**expression** `RegExp`

根据设置规则而生成的动态原生 RegExp 对象。本类中所有的操作都是基于该对象。当使用方法追加规则时，该对象会通过 `RegExp.prototype.compile` 自动重新编译。具体请看 [JavaScript正则表达式](http://www.w3school.com.cn/js/js_obj_regexp.asp)。


## 方法


**create** `(): Box.util.RegExp` ^static^

创建一个 Box.util.RegExp 实例。另外，Box.regexp 为 Box.util.RegExp.create 的别名。


**startOfLine** `(): Box.util.RegExp`

标识正则开始匹配符，会设置属性 prefixes 为 `"^"`

```
var str = "zhangsan\nlishi";
str = Box.regexp().startOfLine().replace(str, "name: ");
console.log(str);
/*
name: zhangsan
name: lisi
*/
```


**endOfLine** `(): Box.util.RegExp`

标识正则结束匹配符，会设置属性 suffixes 为 `"$"`

```
var str = "zhangsan\nlishi";
str = Box.regexp().endOfLine().replace(str, ";");
console.log(str);
/*
zhangsan;
lisi;
*/
```

**then/find** `( String/Box.util.RegExp expr ): Box.util.RegExp`

追加新的规则。当参数为 Box.util.RegExp 的实例，则使用它的规则。

> 所有规则设置方法都会调用该方法为原生 RegExp 对象（expression属性）追加规则。

```
var str = Box.regexp().then("abc").replace(123456abc456123, "<br>"); // "123456<br>456123"
// 参数为 Box.util.RegExp 的实例
Box.regexp().then(
	Box.regexp().then('http').maybe('s').or().then('ftp')
).then("://");
```

**reset** `(): Box.util.RegExp` ^protected^

重新编译正则。当使用方法追加规则时，会通过 RegExp.prototype.compile 自动重新编译。具体请看 [JavaScript正则表达式](http://www.w3school.com.cn/js/js_obj_regexp.asp)。



**sanitize** `( String/Box.util.RegExp value ): String`  ^protected^ 

审查通过方法传人的规则内容，当传入的是字符串规则时，将特殊字符（`/[^\w]/`）进行转义。当传入的是 Box.util.RegExp 类型的话，将该对象中的 source 属性值作为规则内容。类中所有需要输入参数来设置规则的方法内部都会使用该方法来审查。


**add** `( String value ): Box.util.RegExp`

往属性 source 值后追加新的内容，然后根据属性 prefixes、suffixes 和 source 重新编译正则，类中所有的规则方法都回执行该方法。

您可以使用该方法追加 `字符串型正则`，比如：

```
var regexp = Box.regexp().add("\\d{1,3}");
console.log(regexp.test(12));  // true
```



**maybe** `( String expr ): Box.util.RegExp`

匹配字符串，并且可能此字符串不出现。即可能会出现也可能不会出现。相当于 `?`

```
var str = "Take a look at the link http://google.com and the secured version https://www.google.com";
var regexp = Box.regexp().then("http").maybe("s").then("://").anythingBut(" ");

str = regexp.replace(str, function(link) {
    return "<a href='" + link + "'>" + link + "</a>";
});
// Take a look at the link <a href='http://google.com'>http://google.com</a> and the secured version <a href='https://www.google.com'>https://www.google.com</a>
```


**anything** `(): Box.util.RegExp`

匹配出现任意次数（零次、一次、多次）且除了换行和回车以外的任何字符，相当于 `.*`

```
var regexp = new Box.util.RegExp();
regexp.then('abc').anything().then('123');
regexp.test("abc123.");    // true
regexp.test("abc0123.");   // true
regexp.test("abc\n123.");  // false
```



**anythingBut** `( String expr ): Box.util.RegExp`

匹配出现任意次数（零次、一次、多次）且除了指定字符以外的任何字符，相当于 `[^]*`

```
var regexp = new Box.util.RegExp();
regexp.then('abc').anythingBut("@").then('123');
regexp.test("abc@123."); 	// false
regexp.test("abc\n123."); 	// true
```


**something** `(): Box.util.RegExp`

匹配出现一次或多次（至少一次）且除了换行和回车以外的任何字符，相当于 `.+`

```
var regexp = new Box.util.RegExp();
regexp.then('abc').something().then('123');
regexp.test("abc123."); 	// false
regexp.test("abc\n123."); 	// false
regexp.test("abc+-123."); 	// true
```


**somethingBut** `( String expr ): Box.util.RegExp`

匹配出现一次或多次（至少一次）且除了指定字符以外的任何字符，相当于 `[^]+`

```
var regexp = new Box.util.RegExp();
regexp.then('abc').somethingBut("@").then('123');
regexp.test("abc@123."); 	// false
regexp.test("abc123."); 	// false
regexp.test("abc1\n123."); 	// true
```


**lineBreak/br** `(): Box.util.RegExp`

匹配换行和回车，相当于 `\\r\\n|\\r|\\n`

**tab** `(): Box.util.RegExp`

匹配Tab，相当于 `\\t`

**word** `(): Box.util.RegExp`

匹配出现一次或多次（至少一次）且为任意字母、数字或下划线的字符，相当于 `[0-9a-zA-Z_]+`

```
var regexp = new Box.util.RegExp();
regexp.then('abc').word().then('123');
regexp.test("abc__zhangsan123."); 	// true
regexp.test("abc__zhangsan#123."); 	// false
```

**whitespace** `(): Box.util.RegExp`

匹配空格，相当于 `\\s`



**number** `(): Box.util.RegExp`

匹配数字，相当于 `\\d`



**any** `( String expr ): Box.util.RegExp`

匹配指定字符中的一个字符，相当于在 `[]` 中设置非范围性字符

```
var regexp = new Box.util.RegExp();
regexp.then('abc').any('@#%').then('123');
regexp.test("abc#123.");    // true
regexp.test("abc#%123.");   // false
regexp.test("abc*123.");    // false
```

**range** `( String ... ): Box.util.RegExp`

匹配一个范围内的任何一个字符，范围都是成双成对的出现，随意该方法参数的个数必须为偶数。相当于在 `[]` 中设置范围

> - args1：第一个范围的开始字符
> - args2：第一个范围的结束字符
> - argsn：第 N 个范围的开始字符
> - argsn + 1：第 N 个范围的结束字符

```
var regexp = new Box.util.RegExp();
regexp.then('abc').range('A', 'Z').then('123');
regexp.test("abcH123.");    // true
regexp.test("abch123.");    // false
```

**repeat** `( Number min, [Number max] ): Box.util.RegExp`

设置重复匹配次数，相当于 `{n, m}`

> - min：最少重复几次，当只有一个参数的时候，代表重复几次
> - max：（可选）最多重复几次

```
var regexp = new Box.util.RegExp();
regexp.startOfLine().range("0","9").repeat(1, 5).any("-").range("0","9").repeat(3);   
regexp.test("012-987");      // true
regexp.test("012345-987");   // false
```

**or** `(): Box.util.RegExp`

设置一个或选项，相当于 `|`

```
var regexp = new Box.util.RegExp();
regexp.then("http").maybe("s").then("://").or().then("ftp://");
regexp.test('http://www.google.com/');  // true
regexp.test('ftp://ftp.google.com/');   // true
```

对于上面的例子，我们可以优化一下：

```
regexp.then(
	Box.regexp().then('http').maybe('s').or().then('ftp')
).then("://");
```

**orBy** `( String/Box.util.RegExp ... ): Box.util.RegExp`

设置一个有范围的或选项，相当于 `( | )`

```
var regexp = new Box.util.RegExp();
regexp.word().then(".").orBy("jpg", "jfif", "jpeg", "png", "gif", "bmp");
regexp.test('tupian.png');  // true
```


**multiple** `( String/Box.util.RegExp expr, [Number count] ): Box.util.RegExp`

匹配出现指定次数或者任意次数（零次、一次、多次）的字符串或者 Box.util.RegExp 实例的规则。当只有一个参数时，代表重复匹配任意次（零次、一次、多次）。相当于 `()*` 或者 `(){n}` 

> - expr：匹配的字符串或者 Box.util.RegExp 的实例
> - count：（可选）重复匹配次数

```
var regexp = new Box.util.RegExp();
regexp.then("abc").multiple('01', 2).then('abc');
regexp.test('abc01abc');    // false
regexp.test('abc0101abc');  // true
```



**beginCapture** `(): Box.util.RegExp`

设置捕捉开始位置，相当于 RegExp 中设置 `()`，需要配合 endCapture 方法使用

```
var str = "abczhangsan|lishi123";
var regexp = Box.regexp().then('abc')
	.beginCapture().something().endCapture()
	.any('-_|')
	.beginCapture().something().endCapture()
	.then('123');

regexp.replace(str, function (all, m1, m2) {
	console.log(m1, m2); // zhangsan  lishi
	...
});
```


**endCapture** `(): Box.util.RegExp`

设置捕捉结束位置，相当于 RegExp 中设置 `()`，需要配合 beginCapture 方法使用

```
var str = "abczhangsan|lishi123";
var regexp = Box.regexp().then('abc')
	.beginCapture().something().endCapture()
	.any('-_|')
	.beginCapture().something().endCapture()
	.then('123');

regexp.replace(str, function (all, m1, m2) {
	console.log(m1, m2); // zhangsan  lishi
	...
});
```

**toRegExp** `(): RegExp`

转换生成 RegExp 对象。


**setModifier** `( String modifier ): Box.util.RegExp`

设置修饰符，可一次性通过字符串形式设置多个修饰符，下面列出所有修饰符：

> - i：执行对大小写不敏感的匹配
> - g：执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
> - m：执行多行匹配


**replace** `( String string, String/Function expr ): String`

根据当前规则替换指定字符串返回一个新字符串。实际上是执行字符串的 replace 方法。具体使用方法请查看 [String replace](http://www.w3school.com.cn/jsref/jsref_replace.asp)

> - string：待匹换的字符串
> - expr：一个字符串值。规定了替换文本或生成替换文本的函数

```
var str = "zhangsan@lisi#wangwu";
str = Box.regexp().any("@#%").replace(str, " ");
console.log(str);  // "zhangsan lisi wangwu"
```

使用函数来生产替换文本

```
var str = "zhangsan@lisi#wangwu";
str = Box.regexp().any("@#%").replace(str, function (m) {
	return "_" + m + "_";
});
console.log(str);  // "zhangsan_@_lisi_#_wangwu"
```



**test** `( String string ): Boolean`

检索字符串中是否有指定值，实际上就是执行 this.expression.test。具体使用方法请查看 [RegExp test](http://www.w3school.com.cn/jsref/jsref_test_regexp.asp)

```
var str = "zhangsan lisi";
var regexp = Box.regexp().whitespace();
if (regexp.test(str)) {
	console.log('has whitespace');
}
```



**exec** `( String string ): Array`

检索字符串，并且返回检索结果，实际上就是执行 this.expression.exec。具体使用方法请查看 [RegExp exec](http://www.w3school.com.cn/jsref/jsref_exec_regexp.asp)









