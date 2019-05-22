# Box.String (singleton)

---

一个用来处理字符串的静态方法集合


## 方法

> 注：以下方法中，只要返回值是 `String` 类型的，都是代表新的字符串，而不是原字符串

**has** `( String str, String chars ): Boolean`

判断字符串中是否包含指定的字符串

```
var str = "the element in which the view element will be appended.";
Box.String.has(str, 'element'); // true
```

**insert** `( String str, String value, [Number index] ): String`

往字符串的指定位置添加一段字符串

> - str 原字符串
> - value 待插入的字符串
> - index （可选）待插入的下标位置，默认插入到 `str` 的后面。如果设置为负数，则从右往左计数下标插入

```
Box.String.insert("12345", "098", 2);  // 12098345
Box.String.insert("abcdefg", "h", -1); // abcdefhg
```

**startsWith** `( String str, String start, [Boolean ignoreCase] ): Boolean`

判断字符串是否是以某段指定的字符串开始

> - str 待判断的字符串
> - start 开始的字符串
> - ignoreCase （可选）是否忽略字母的大小写，默认为 `false`

```
var str = "hello world!";
Box.String.startsWith(str, "hel");  // true
Box.String.startsWith(str, "HEL");  // false
Box.String.startsWith(str, "HEL", true);  // true
```

**endsWith** `( String str, String end, [Boolean ignoreCase] ): Boolean`

判断字符串是否是以某段指定的字符串结束、

> - str 待判断的字符串
> - start 结束的字符串
> - ignoreCase （可选）是否忽略字母的大小写，默认为 `false`

```
var str = "hello world!";
Box.String.endsWith(str, "rld!");  // true
Box.String.endsWith(str, "wor");   // false
```


**htmlEncode** `( String str ): String`

编码。转义 `&`, `<`, `>`, `'` 和 `"` 为能在html中显示的字符

```
Box.String.htmlEncode('<div>zhangsan</div>');
// &lt;div&gt;zhangsan&lt;/div&gt;
```

**htmlDecode** `( String str ): String`

解码。将 `&amp;`, `&gt;`, `&lt;`, `&quot;` 和 `&#39;` 从字符串中还原成html显示格式

```
Box.String.htmlDecode('&lt;div&gt;zhangsan&lt;/div&gt;');
// <div>zhangsan</div>
```

**urlAppend** `( String url, String str ): String`

将内容追加到url字符串中， 并且根据逻辑处理判断增加 `'?'` 或 `'&'` 符号

```
var url = "http://192.168.0.1:8080/index.html";
url = Box.String.urlAppend(url, "name=zhangsan"); 
// url: http://192.168.0.1:8080/index.html?name=zhangsan
```


**trim** `( String str ): String`

裁剪字符串两旁的空白符，保留中间空白符

```
var str = '  foo bar  ';
alert('-' + str + '-');         //"- foo bar -"
alert('-' + Box.util.Format.trim(str) + '-');  //"-foo bar-"
```

**capitalize/firstUpperCase** `( String str ): String`

将字符串中第一个字母转换为大写字母

```
var name = Box.String.capitalize("zhangsan"); // "Zhangsan"
```

**uncapitalize** `( String str ): String`

将字符串中第一个字母转换为小写字母

```
var name = Box.String.capitalize("ZhangSan"); // "zhangSan"
```

**ellipsis** `( String str, Number len, String word ): String`


对大于指定长度的字符串，进行裁剪，增加省略号('...')的显示

> - value 要裁剪的字符串
> - length 要裁剪允许的最大长度
> - word (可选) 如果为 true，则试图找到一个共同的词符 (比如空格、逗号、感叹号等) 避免英文截取的时候，把一个完整的单词截断。


```
var sentence = "The tag used for the root element of the view.";
Box.util.Format.ellipsis(sentence, 15);
// The tag used for the r...

Box.util.Format.ellipsis(sentence, 15, true);
// The tag used for the...
```


**escapeRegex** `( String str ): String`

避免所传递的字符串在正则表达式中使用

**escape** `( String str ): String`

将字符串中的 `'` 与 `\` 字符转义

**toggle** `( String str, String value, String other ): String`

比较并交换字符串的值。 参数中的第一个值与当前字符串对象比较， 如果相等则返回传入的第一个参数，否则返回第二个参数。 

```
// 可供选择的排序方向。
sort = Box.String.toggle(sort, 'ASC', 'DESC');
// 等价判断语句：
sort = (sort == 'ASC' ? 'DESC' : 'ASC');
```

**leftPad** `( String str, Number size, String character ): String`

在字符串左边填充指定字符

> - string 源字符串
> - size 源字符串
> - character （可选的）填充字符串（默认是" "）

这对于统一字符或日期标准格式非常有用。例如：

```
Box.util.Format.leftPad('123', 5, '0');   // 00123
```

**format** `( String str ): String`

定义带标记的字符串，并用传入的字符替换标记

每个标记必须是唯一的，而且必须要像 `{0}, {1} ... {n}` 这样地自增长。

> - string 带标记的字符串
> - value1 第一个值，替换{0}
> - value2 第二个值，替换{1}
> - value{n} ...等等（可以有任意多个）

```
var cls = 'my-class';
var text = 'Some text';
var html = Box.util.Format.format('<div class="{0}">{1}</div>', cls, text);
// '<div class="my-class">Some text</div>'
```

**repeat** `( String str, Number count, [String sep] ): String`


根据给定格式的字符串与指定的重复次数来获得一个新的格式字符串

> - str 原字符串 
> - count 重复的次数
> - sep （可选）每次重复的分割字符串，默认为空

```
var s = Box.String.repeat('---', 4); 	// '------------'
var t = Box.String.repeat('--', 3, '/'); // '--/--/--'
```

**splitWords** `( String words ): String`

按照一个或多个空格分割一个字符串，并将返回的词存到数组中， 如果词已经是一个数组,它将被返回。

```
var str = "hello world!";
var arr = Box.String.splitWords(str); // ["hello", "world!"]
```

**parseVersion** `( String version ): Object`

解析版本号

> 返回值 返回解析后的版本对象，包括以下属性

> - major 主版本号
> - minor 次版本号
> - patch 补丁版本号
> - build 构建版本号
> - release 发布版本号

```
var version = Box.String.parseVersion('1.0.2beta');

console.log(version.major); // 1
console.log(version.minor); // 0
console.log(version.patch); // 2
console.log(version.build); // 0
console.log(version.release); // beta
```



