# Box.Date (singleton)

---

提供了处理日期的常用的静态方法的集合

## 使用说明

日期的处理和格式化是仿照 `PHP Date` 的，提供的格式和转换后的结果和 `PHP` 语言一样。下面列出的是目前所有支持的格式：

> - **d** 	  月份中的天数，两位数字，不足位补“0”  
> - **D**     当前星期的缩写，三个字母  
> - **j**     月份中的天数，不补“0” 
> - **l**     当前星期的完整拼写       
> - **N**     ISO-8601 标准表示的一周之中的天数（1～7）                
> - **S**     英语中月份天数的序数词的后缀，2个字符                     
> - **w**     一周之中的天数（0～6）                                  
> - **z**     一年之中的天数(从 0 开始)                               
> - **W**     一年之中的ISO-8601周数，周从星期一开始                   
> - **F**     当前月份的完整拼写, 例如January或March                  
> - **m**     当前的月份，两位数字，不足位补“0”                        
> - **M**     当前月份的缩写，三个字母                                
> - **n**     当前的月份，不补“0”                                    
> - **t**     当前月份的总天数                                       
> - **L**     是否闰年                                              
> - **o**     ISO-8601 年数 (对于(Y)相同,但如果ISO星期数(W) 属于到上一年或下一年, 那一年则被改用)
> - **Y**     4位数字表示的当前年数                                  
> - **y**     2位数字表示的当前年数                                  
> - **a**     小写的“am”和“pm”                                     
> - **A**     大写的“AM”和“PM”                                     
> - **g**     12小时制表示的当前小时数，不补“0”                       
> - **G**     24小时制表示的当前小时数，不补“0”                       
> - **h**     12小时制表示的当前小时数，不足位补“0”                   
> - **H**     24小时制表示的当前小时数，不足位补“0”                   
> - **i**     分钟数，不足位补“0”                                   
> - **s**     秒数，不足位补“0”                                     
> - **u**     秒数的小数形式(最低1位数,允许任意位数的数字)                          
> - **O**     用小时数表示的与 GMT 差异数                            
> - **P**     以带冒号的小时和分钟表示与 GMT 差异数                   
> - **T**     当前系统设定的时区                                    
> - **Z**     用秒数表示的时区偏移量（西方为负数，东方为正数）          
> - **c**     ISO 8601 日期 注意: 1) 如果未指定,则月/日默认为当前月/日,时间默认为午夜时间, 同时时区默认为浏览器设置的时区。如果指定时间，则它必须包括小时和分钟。"T" 分隔符、秒、毫秒和时区是可选的。2) 一个秒数的小数部分,如果指定, 必须包含至少1位数字 (在这里允许位数的最大数目没有限制), 并可由一个 '.' 或一个 ',' 分隔。参见右边的例子为所支持的各级日期时间粒度，或参见http://www.w3.org/TR/NOTE-datetime查阅更多相关信息。       
> - **U**     自 Unix 新纪元(January 1 1970 00:00:00 GMT) 以来的秒数       
> - **MS**    Microsoft AJAX 序列化的日期                                 


用法举例：（注意你必须在字母前使用转意字符“\”才能将其作为字母本身而不是格式符输出）:

```
// 样本数据:
// 'Wed Jan 10 2015 15:05:01 GMT-0600 (中区标准时间)'

var dt = new Date('1/10/2015 03:05:01 PM GMT-0600');
console.log(Box.Date.format(dt, 'Y-m-d'));                 // 2015-01-10
console.log(Box.Date.format(dt, 'F j, Y, g:i a'));         // January 10, 2015, 3:05 pm
console.log(Box.Date.format(dt, 'l, \\t\\he jS \\of F Y h:i:s A')); // Wednesday, the 10th of January 2015 03:05:01 PM
```


下面有一些标准的日期/时间模板可能会对你有用。 它们不是 Date.js 的一部分，但是你可以将下列代码拷出，并放在 Date.js 之后所引用的任何脚本内， 都将成为一个全局变量，并对所有的 Date 对象起作用。 你可以按照你的需要随意增加、删除此段代码。

```
Box.Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
```
用法示例:

```
var dt = new Date();
console.log(Box.Date.format(dt, Box.Date.patterns.ShortDate));
```

开发者可以通过设置 `parseFunctions` 和 `formatFunctions` 实现自定义日期格式化与解释功能， 以满足特殊的需求。


## 属性

**DAY** `String`

日期间隔常量，默认值为 `d`

**HOUR** `String`

日期间隔常量，默认值为 `h`

**MILLI** `String`

日期间隔常量，默认值为 `ms`

**MINUTE** `String`

日期间隔常量，默认值为 `mi`

**MONTH** `String`

日期间隔常量，默认值为  `mo`

**SECOND** `String`

日期间隔常量，默认值为 `s`

**YEAR** `String`

日期间隔常量，默认值为 `y`

**dayNames** `String[]`

天的文本名称的数组。 日期国际化需重写这些值。 示例:

```
Box.Date.dayNames = [
    'SundayInYourLang',
    'MondayInYourLang',
    ...
];
```

默认为: 

```
["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
```

**defaultFormat** `String`

`Box.util.Format.dateRenderer` 和 `Box.util.Format.date` 函数使用的日期格式的字符串。参见 `Box.Date` 的详细信息

这可能被覆盖在区域设置文件中。

默认值为： "m/d/Y"

**defaults** `Object`

对象哈希值中包含的默认日期值会在日期解析过程中使用。

可用的属性如下:

> - y 默认年份值
> - m 默认的从1开始的月份值
> - d 默认的日期值
> - h 默认的小时值
> - i 默认的分钟值
> - s 默认的秒值
> - ms 默认的毫秒值

重写这些属性自定义parse方法中所使用的默认日期值。

> 注意: 在一些国家遇到夏令时间(即 `DST`)，`h`，`i`，`s` 和 `ms` 属性可能会配合 `DST` 生效的确切时间。 它是开发人员考虑此情况的责任

用法示例:

```
// 将默认天的值设置为该月的第一天
Box.Date.defaults.d = 1;

// 解析一个包含只有年份和月份值的2月份的日期字符串
// 当试图解析下面的日期字符串,例如, March 31st 2009，
// 将一天的默认值设置为 1 可防止日期转换时的怪异问题。
Box.Date.parse('2009-02', 'Y-m'); // 返回一个表示 February 1st 2009 的日期对象
```

默认值为： {}

**formatCodes** `Object`

通过 `format` 方法使用的格式函数哈希映射的基本格式代码。 格式函数是字符串(或返回字符串的函数)， 当 `format` 方法被调用时， 从日期对象的上下文中计算后返回相应的值。 添加/重写这些映射为自定义的日期格式。 注意:如果不能找到适当的映射，`Box.Date.format()` 会将字符视为文字， 示例:

```
Box.Date.formatCodes.x = "Box.util.Format.leftPad(this.getDate(), 2, '0')";
console.log(Box.Date.format(new Date(), 'X'); // 返回当前月的第几天
```

**formatFunctions** `Object`

在其中每个属性是一个日期格式函数对象哈希值。 属性的名称作为格式字符串，与生成的格式化日期字符串相对应。

此对象会自动填充日期格式化函数并满足 `Box` 标准格式化字符串要求的日期格式。

自定义格式函数可被插入到该对象中， 键入的名称由此可能被 `format` 用作一个格式字符串。示例:

```
Box.Date.formatFunctions['x-date-format'] = myDateFormatter;
```
格式化函数应该返回一个字符串表示传递的日期对象，并传递以下参数:

> - date 要进行格式化的日期对象。

若要使用日期字符串，也是按照这种格式进行解析， 相应的解析函数必须被注入到 `parseFunctions` 属性中。

**monthNames** `String[]`

月份文本名称的数组。 日期国际化需重写这些值。 示例:

```
Box.Date.monthNames = [
    'JanInYourLang',
    'FebInYourLang',
    ...
];
```

默认值为：

```
["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
```

**monthNumbers** `Object`

一个对象关于从零开始的 `javascript` 月份数的哈希值(使用月份短名作为键。 注意:键值区分大小写)。 日期国际化需重写这些值。 示例：

```
Box.Date.monthNumbers = {
    'LongJanNameInYourLang': 0,
    'ShortJanNameInYourLang':0,
    'LongFebNameInYourLang':1,
    'ShortFebNameInYourLang':1,
    ...
};
```

默认值为：

```
{
	January: 0, 
	Jan: 0, 
	February: 1, 
	Feb: 1, 
	March: 2, 
	Mar: 2, 
	April: 3, 
	Apr: 3, 
	May: 4, 
	June: 5, 
	Jun: 5, 
	July: 6, 
	Jul: 6, 
	August: 7, 
	Aug: 7, 
	September: 8, 
	Sep: 8, 
	October: 9, 
	Oct: 9, 
	November: 10, 
	Nov: 10, 
	December: 11, 
	Dec: 11
}
```


**parseFunctions** `Object`


在其中每个属性是一个日期解析函数对象哈希值。 属性名称是该函数解析的格式字符串。

此对象会自动填充日期解析函数并满足 `Box` 标准格式化字符串要求的日期格式。

自定义解析函数可被插入到该对象中, 键入的名称由此可能被 `parse` 用作一个格式字符串。

示例:

```
Box.Date.parseFunctions['x-date-format'] = myDateParser;
```

解析函数应返回一个日期对象，并传递下列参数:

> - date 要解析的日期字符串。 
> - strict 如果为true，在解析时验证日期字符串 (即防止 `javascript` 日期转换) (默认值必须是 `false`)。 无效的日期字符串在解析时返回 `null`。

若要使用日期对象，也是按照这种格式进行格式化， 相应的格式化函数必须被注入到 `formatFunctions` 属性中。


**useStrict** `Boolean`

全局标志，确定是否应使用严格的日期解析。 严格的日期解析将不会转换无效的日期， 这是 `JavaScript` 日期对象的默认行为。 (更多的信息，请参见 `parse`) 默认值为 `false`.


## 方法



**add** `( Date date, String interval, Number value ): Date`

提供执行基本日期运算的简便方法。 此方法不修改被调用的日期实例 - 它将创建并返回生成的日期值的一个新的日期对象实例。

> - date 日期对象
> - interval 一个有效的日期间隔枚举值
> - value 向当前日期上增加的总数
> - 新的日期对象实例

```
// 基本用法：
var dt = Box.Date.add(new Date('10/29/2015'), Box.Date.DAY, 5);
console.log(dt); //返回 'Fri Nov 03 2015 00:00:00'

// 负数将按照减法运算：
var dt2 = Box.Date.add(new Date('10/1/2015'), Box.Date.DAY, -5);
console.log(dt2); //返回 'Tue Sep 26 2015 00:00:00'
```

**between** `( Date date, Date start, Date end ): Boolean`

检查一个日期是否处在给定的开始日期和结束日期之间（包含这两个日期）

> - date 要检查的日期对象
> - start 开始日期对象
> - end 结束日期对象
> - 返回值 如果这个日期在给定的开始和结束日期之间（包含边界值）则返回 `true`


```
var start = new Date(1/1/2014);
var end = new Date(1/1/2015);
if (Box.Date.between(new Date(), start, end)) {
	...
}
```


**clearTime** `( Date date, [Boolean clone] ): Date`

将时间设置为当天的午夜时间

> - date 日期对象
> - clone（可选）如果值为 `true`，则创建一个当前日期对象的克隆版，清除克隆对象的时间信息后返回，默认为 `false`
> - 返回值 实例本身或实例的克隆



**clone** `( Date date ): Date`

创建并返回一个具有完全相同的日期值作为调用实例的新日期实例

```
//错误方式:
var orig = new Date('10/1/2014');
var copy = orig;
copy.setDate(5);
console.log(orig);  // 'Thu Oct 05 2014'!

//正确方式:
var orig = new Date('10/1/2014'),
    copy = Box.Date.clone(orig);
copy.setDate(5);
console.log(orig);  // 'Thu Oct 01 2014'
```

**format** `( Date date, String format ): String`

根据指定的格式将对象格式化

> - date 需要格式字符串格式化的日期对象
> - format 日期格式字符串
> - 返回值 格式化后的日期字符串或''（如果日期参数不是一个 `JavaScript` 日期对象）


```
Box.Date.format({}, 'Y-m-d');  // ""
Box.Date.format(new Date, 'Y-m-d');  // "2015-01-22"
```


**formatContainsDateInfo** `( String format ): Boolean`

检查格式字符串中是否包含日期信息

> - format 要检查的格式字符串
> - 返回值 如果格式字符串包含关于 `date` 或者 `day` 的信息则返回 `true`


```
Box.Date.formatContainsDateInfo("y-m-d"); // true 
```


**formatContainsHourInfo** `( String format ): Boolean`

检查格式字符串中是否包含钟点信息

> - format 要检查的格式字符串
> - 返回值 如果格式字符串包含钟点信息则返回 `true`

```
Box.Date.formatContainsHourInfo("h:i:s"); // true 
```

**getDayOfYear** `( Date date ): Number`

返回当前年份中天数的数值，并且会根据闰年进行调整，范围从0 到 364 (闰年为365)


```
Box.Date.getDayOfYear(new Date("10/1/2014")); // 273
Box.Date.getDayOfYear(new Date("1/10/2015")); // 9 
```


**getDaysInMonth** `( Date date ): Number`

返回当前月份中天数的数值，并且会根据闰年进行调整

**getElapsed** `( Date dateA, Date dateB ): Number`

返回两个日期相差的毫秒数

**getFirstDateOfMonth** `( Date date ): Date`

返回当前月份中第一天的日期对象

**getFirstDayOfMonth** `( Date date ): Number`

获得当前月份中的第一天在一周中为第几天，范围为0～6

```
var dt = new Date('1/10/2007'),
    firstDay = Box.Date.getFirstDayOfMonth(dt);
console.log(Box.Date.dayNames[firstDay]); // '星期一'
```

**getLastDateOfMonth** ` Date date ): Date`

返回当前月份中最后一天的日期对象

**getLastDayOfMonth** `( Date date ): Number`

获得当前月份中的最后一天在一周中为第几天，范围为0～6

```
var dt = new Date('1/10/2007'),
    lastDay = Box.Date.getLastDayOfMonth(dt);
console.log(Box.Date.dayNames[lastDay]); // '星期三'
```


**getGMTOffset** `( Date date, Boolean colon ): String`

返回 GMT 到当前日期的偏移量（等同于指定输出格式 "O"）


**getMonthNumber** `( String name ): Number`

根据月份的短名或全名返回从零开始的月份数值

**getShortDayName** `( Number day ): String`

根据星期数返回对应的星期短名

**getShortMonthName** `( Number month ): String`

根据月份数返回对应的月份短名

**getSuffix** `( Date date ): String`

返回当天的英文单词的后缀（等同于指定输出格式 "S"）

**getWeekOfYear** `( Date date ): Number`

返回当前日期在当前年份中处于第几个星期

```
Box.Date.getWeekOfYear(new Date("2/12/2012")); // 6
```

**isEqual** `( Date date1, Date date2 ): Boolean`

通过比较两个日期对象的值来判断两个日期是否相等。

```
var date1 = new Date("2/12/2012");
var date2 = new Date("1/3/2012");
var equal = Box.Date.isEqual(date1, date2); // false
```


**isLeapYear** `( Date date ): Boolean`

返回当前日期是否闰年。

**isValid** `( Number year, Number month, Number day, [Number hour], [Number minute], [Number second], 
[Number millisecond] ): Boolean`

检查传递的参数是否可以转换为一个有效的的 `javascript` 日期对象。

> - year 4位年份
> - month 从1开始的月份
> - day 月份中的天数
> - hour（可选）小时
> - minute（可选）分钟
> - second（可选）秒
> - millisecond（可选）毫秒


**now** `(): Number`

返回当前的时间戳

**parse** `( String input, String format, Boolean strict ): Date`

使用指定的日期格式来解析传递的字符串。 

> - input 将被解析的日期字符串
> - format 预期的日期字符串格式
> - strict（可选）设置为 `true` 时，校验日期格式字符串，默认为 `false`。 无效的日期字符串解析时将返回 `null`

```
//dt = Fri May 25 2007 (当前日期)
var dt = new Date();

//dt = Thu May 25 2006 (今天月份/日期在2006年中的日期)
dt = Box.Date.parse("2006", "Y");

//dt = Sun Jan 15 2006 (指定日期所有部分)
dt = Box.Date.parse("2006-01-15", "Y-m-d");

//dt = Sun Jan 15 2006 15:20:01
dt = Box.Date.parse("2006-01-15 3:20:01 PM", "Y-m-d g:i:s A");

// 严格模式下解析 Sun Feb 29 2006 03:20:01
// 实际上2006年2月只有28天，在严格模式下是解析不出来的，返回null
dt = Box.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s", true); // null
dt = Box.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s"); // Wed Mar 01 2006 03:20:01
```

**unescapeFormat** `( String format ): String`

移除所有的转义的日期格式字符串。在日期格式中， 使用一个'\'可以用来转义特殊字符













