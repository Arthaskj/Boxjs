# Box.Number (singleton)

---

一个用来处理数字的静态方法集合

## 方法

**constrain** `( Number value, Number min, Number max ): Number`

判断数字的大小范围， 如果小于最小范围， 那么返回最小值，如果大于最大范围， 那么返回最大值

> - value 要检查的数值
> - min 范围的最小值
> - max 范围的最大值

```
var num1 = Box.Number.constrain(10, 20, 100);  // 20
var num2 = Box.Number.constrain(10, 0, 100);   // 10
var num3 = Box.Number.constrain(101, 20, 100); // 100
```

**toFixed** `( Number value, [Number precision] ): Number`

精确数字的小数位数，并且进行四舍五入处理

> - value 待精确的数字
> - precision （可选） 保留小数的位数，默认为0

```
var num = 3.1415926;
num = Box.Number.toFixed(num, 2); // 3.14
```

**num/from** `( Object value, Number defaultValue ): Number`

将一个值转换成数字类型，如果转换失败，使用默认值代替

> - value 待转换的值
> - defaultValue 当转换失败时（转换后是 `NaN` 的），使用的默认值

```
Box.Number.num('1.23', 1); // returns 1.23
Box.Number.num('abc', 1);  // returns 1
```


**randomInt** `( Number from, Number to ): Number`

随机获取一个指定范围内的整数

> - form 范围的最小值
> - to 范围的最大值

```
Box.Number.randomInt(0, 10); // 8
Box.Number.randomInt(0, 10); // 3
Box.Number.randomInt(0, 10); // 5
```

**correctFloat** `( Number value ): Number`

纠正浮点数溢出

```
var num1 = 0.1 + 0.2;	// 0.30000000000000004
var num2 = Box.Number.correctFloat(0.1 + 0.2); // 0.3
```

**snap** `( Number value, Number increment, Number minValue, Number maxValue ): Number`

根据一个增量和范围来计算出离给定值最近的增量值

> - value 给定值
> - increment 增量，比如增量为2， 那么它对应的增量值为 2, 4, 6, 8, ...
> - minValue 范围的最小值
> - maxValue 范围的最大值

```
// 增量为3， 那么在1到10之内对应的增量值为 3, 6, 9
var num1 = Box.Number.snap(5, 3, 1, 10);   // 6
var num2 = Box.Number.snap(56, 2, 55, 65); // 56
```

