# Box.util.Format (singleton)

---

此类是一个用于格式化函数集中的单例模式的工具类。它包括要格式化的各种不同类型数据的函数，如文本、日期和数值。

## 方法

**undef** `( Object value ): Object`

检查 `value`，如果它是 `undefined` 则将它转换成空字符串


**defaultValue** `( Object value, String defaultValue ): String`

检查 `value`，如果它是 `undefined` 或者为空字符串则转换成一个默认值 `defaultValue`

```
var str = "";
str = Box.util.Format.defaultValue(str, '--');  // --

var obj = {};
var name = Box.util.Format.defaultValue(obj.name, '匿名');  // 匿名
```


**substr** `( String value, Number start, Number length ): String`

根据 `start` 和 `length` 截取字符串 `value`，返回一个新的字符串

```
var str = "hello world!";
var new_str = Box.util.Format.substr(str, 0, 3); // hel
```


**lowercase** `( String value ): String`

使得字符串中的字符都转换为小写字母

```
Box.util.Format.lowercase("ABCD123DCBA");  // abcd123dcba
```

**uppercase** `( String value ): String`

使得字符串中的字符都转换为大写字母

```
Box.util.Format.uppercase("abcd123dcba");  // ABCD123DCBA
```


**usMoney** `( Number/String value ): String`

将一个数值格式化成美元形式
```
Box.util.Format.usMoney(101);  // $101.00
```


**currency** `( Number/String value, String sign, Number decimals, Boolean end ): String`

将一个数值格式化成货币形式

>- value 需要进行格式化的数值
>- sign 使用的货币符号 (缺省值为$)
>- decimals 使用的货币值小数点后的位数 (缺省值为2）
>- end 如果为true则货币符号应追加在字符串的结尾 (缺省值为false)


```
Box.util.Format.currency(101.759213, '￥', 2, true);  // 101.76￥
```

**date** `( String/Date value, String format ) : String`

将某个值解析成为一个特定格式的日期。

>- value  需要格式化的值(字符串必须符合 `javascript Date` 对象的 `parse()` 方法期望的格式)。
>- format  (可选)任何有效的日期格式字符串。默认为 `Box.Date.defaultFormat` (yyyy-MM-dd)。

```
Box.util.Format.date(new Date);  // 2015-01-15
```

**stripTags** `( String value ) : String`

将一段HTML字符串中的标签去除掉，只留下内容。

```
var html = '<div title="标签">hello world!</div>';
Box.util.Format.stripTags(html);
// hello world!
```

**stripScripts** `( String value ) : String`

去掉字符串中的所有script标签，只留下内容。


**math** `( Number/String *value ) : String`

进行简单的匹配，对参数拼接成一个数学表单式，然后计算返回值

> - value 可接受不限个数的参数，每个参数的类型为 `Number` 或者 `String`， 并且当为字符串时候，只能是数学表单式

```
Box.util.Format.math(14, " * 2 - 1", " + 10"); // 37
```

**round** `( Number/String value, Number precision ) : Number `

将所传递的数字四舍五入到所需的精度

> - value 需要四舍五入的数值。
> - precision 用来四舍五入第一个参数值的小数位数值。

```
Box.util.Format.round(1234.5678, 2); // 1234.57
```

**number** `( Number v, String formatString ) : String`

根据传入的格式字符串将传递的数字格式化。

根据标准国际惯例，格式化字符串必须指定分隔字符 ("," 作为 千位分隔符, 和 "." 作为小数点分隔符)。

```
var number = 123456.789

Box.util.Format.number(number, '0');
// 123456 只显示整数，没有小数

Box.util.Format.number(number, '0.00');
// 123456.78 精确到两位小数

Box.util.Format.number(number, '0.0000');
// 123456.7890 精确到四位小数

Box.util.Format.number(number, '0,000');
// 123,456 显示逗号和整数，没有小数

Box.util.Format.number(number, '0,000.00');
// 123,456.78 显示逗号和两位小数

Box.util.Format.number(number, '0,0.00');
// 123,456.78 快捷方法，显示逗号和两位小数

Box.util.Format.number(number, '0,0.00%');
// 123,456.78% 可加上特殊字符串
```

**plural** `( Number value, String singular, [String plural] ): String`

根据一个数值，可对单词选用一个复数形式

> - value 需要用来对比的值
> - singular 单词的单数格式
> - plural (可选)单词的复数形式 (默认为单数格式加一个"s")

```
Box.util.Format.plural(3, 'comment'); // 3 comments
Box.util.Format.plural(1, 'woman', 'women'); // 1 woman
Box.util.Format.plural(3, 'woman', 'women'); // 3 women
```


**nl2br** `( String string ) : String`

将字符串中的换行格式化成HTML标签 <br/>


**firstUpperCase** `( String string ) : String`

将字符串中第一个字母转换为大写字母。`Box.String.firstUpperCase` 的别名

**ellipsis** `( String value, Number length, [Boolean word] ) : String`

对大于指定长度的字符串，进行裁剪，增加省略号('...')的显示。`Box.String.ellipsis` 的别名

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

**format** `( String *string ) : String`

定义带标记的字符串，并用传入的字符替换标记。 `Box.String.format` 的别名

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

**htmlDecode** `( String string ) : String`

解码。将 `&amp;`, `&gt;`, `&lt;`, `&quot;` 和 `&#39;` 从字符串中还原成html显示格式。 `Box.String.htmlDecode` 的别名

```
Box.util.Format.htmlDecode('&lt;div&gt;zhangsan&lt;/div&gt;');
// <div>zhangsan</div>
```


**htmlEncode** `( String string ) : String`

编码。转义 `&`, `<`, `>`, `'` 和 `"` 为能在html中显示的字符。 `Box.String.htmlEncode` 的别名

```
Box.util.Format.htmlEncode('<div>zhangsan</div>');
// &lt;div&gt;zhangsan&lt;/div&gt;
```

**leftPad** `( String string, Number size, [String character] ) : String`

在字符串左边填充指定字符。 `Box.String.leftPad` 的别名

> - string 源字符串
> - size 源字符串
> - character （可选的）填充字符串（默认是" "）

这对于统一字符或日期标准格式非常有用。例如：

```
Box.util.Format.leftPad('123', 5, '0');   // 00123
```

**trim** `( String string ) : String`

裁剪字符串两旁的空白符，保留中间空白符。`Box.String.trim` 的别名

```
var str = '  foo bar  ';
alert('-' + str + '-');         //"- foo bar -"
alert('-' + Box.util.Format.trim(str) + '-');  //"-foo bar-"
```
