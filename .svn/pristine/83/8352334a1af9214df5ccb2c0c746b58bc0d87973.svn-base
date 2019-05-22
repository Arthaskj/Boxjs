# Box.Array (singleton)

---

一个用来处理数组的静态方法集合


## 方法

**each** `( Array array, Function fn, [Object scope], [Boolean reverse] ): Boolean/Number`

迭代一个数组或是可迭代的对象，在每个元素上调用给定的回调函数

> - array 将要迭代的值。如果这个参数不可迭代，回调函数将只调用一次
> - fn 回调函数， 如果返回 `false`，迭代将停止，方法返回当前的索引
> - scope （可选）指定函数执行的( `this` )作用域，默认为当前遍历到的元素
> - reverse （可选）是否倒叙迭代，默认为 `false`
> - 返回值 当 `fn` 方法中返回过 `false` 值，方法返回当前索引，如果没有返回过 `false`，方法返回 `true`

函数 `fn` 的参数有3个，分别为：

> - item 数组当前的索引中的元素
> - index 数组当前的索引
> - array 数组本身

```
var peoples = ['张三', '李四', '王五', '小刘'];

Box.Array.each(peoples, function(name, index) {
    console.log(name);
});
// 等价于
for (var i = 0; i < peoples.length; i++) {
	console.log(peoples[i])
}
```
```
var sum = function() {
    var sum = 0;
    Box.Array.each(arguments, function(value) {
        sum += value;
    });
    return sum;
};

sum(1, 2, 3); // 6
```

在回调函数中返回false，即可停止迭代过程。

```
Box.Array.each(peoples, function(name, index) {
    if (name === '李四') {
        return false; // 此处中止迭代
    }
});
```


**forEach** `( Array array, Function fn, [Object scope] ): void`

迭代一个数组，在每个元素上调用给定的回调函数，如果浏览器支持原生的 `Array.prototype.forEach`，这个函数将委托执行 `Array.prototype.forEach`（提高效能）。它不支持像 `each` 一样， 通过返回一个 `false` 来停止迭代。 因此，其性能会比 `each` 更好。

> - array 将要迭代的值。如果这个参数不可迭代，回调函数将只调用一次
> - fn 回调函数
> - scope （可选）指定函数执行的( `this` )作用域

函数 `fn` 的参数有3个，分别为：

> - item 数组当前的索引中的元素
> - index 数组当前的索引
> - array 数组本身

```
Box.Array.forEach(peoples, function(name, index) {
    console.log(name);
});
```


**indexOf** `( Array array, Object item, [Number from] ): Number`

查找指定元素在数组中的索引位置，如果浏览器支持原生的 `Array.prototype.indexOf`，这个函数将委托执行 `Array.prototype.indexOf`（提高效能）

> - array 要检查的数组
> - item 要查找的元素
> - from （可选）搜索的起始位置，默认为0
> - 返回值 如果查找到则返回元素的索引位置，如果没查找到，返回-1

```
var peoples = ['张三', '李四', '王五', '小刘'];
var index = Box.Array.indexOf(peoples, '王五'); // 2
```


**contains** `( Array array, Object item ): Boolean`

检查数组中是否包含给定元素

> - array 要检查的数组
> - item 要查找的元素

```
var peoples = ['张三', '李四', '王五', '小刘'];
Box.Array.contains(peoples, '王五'); // true
```


**subArray** `( Array array, [Number start], [Number end] ): Array`

获得一个数组中指定一部分的浅复制，等价于原生方法 `Array.prototype.slice.call(array, begin, end)`

```
var peoples1 = ['张三', '李四', '王五', '小刘'];
var peoples2 = Box.Array.subArray(peoples1, 0, 2);  
// peoples1: ['张三', '李四', '王五', '小刘']
// peoples2: ['张三', '李四', '王五']
```


**map** `( Array array, Function fn, [Object scope] ): Array`

通过迭代数组，在每个元素上调用给定的回调函数，并且收集回调函数中返回的结果创建一个新数组

> - array 待迭代的数组
> - fn 每个元素上的回调函数
> - scope （可选）回调函数的作用域（`this` 的指向）

函数 `fn` 的参数有3个，分别为：

> - item 数组当前的索引中的元素
> - index 数组当前的索引
> - array 数组本身

```
var array1 = [10, 20, 30, 40];
var array2 = Box.Array.map(array1, function (item, index) {
	return item + 10;
});r
// array1: [10, 20, 30, 40]
// array2: [20, 30, 40, 50]
```


**clean** `( Array array ): Array`

过滤掉数组里的空值

> 空字符串、`null`、`undefined` 会认为为 `empty`，判断空值的方法见 `Box.isEmpty`

```
var array = [10, "", 20, 30, null ,40, undefined];
array = Box.Array.clean(array); // [10, 20, 30, 40]
```


**filter** `( Array array, Function fn, [Object scope] ): Array`

通过迭代数组，在每个元素上调用指定的回调函数，收集回调函数中返回 `true` 的元素形成一个新数组

> - array 待过滤的数组
> - fn 过滤方法
> - scope （可选）过滤方法的作用域

函数 `fn` 有3个参数，分别为：

> - item 数组当前的索引中的元素
> - index 数组当前的索引
> - array 数组本身

```
var array1 = [10, 20, 30, 40];
var array2 = Box.Array.filter(array1, function (item, i, array) {
	return item < 35
});
// array2:  [10, 20, 30]
```

**unique** `( Array array ): Array`

去掉数组中的重复元素，形成一个新数组

```
var array = [10, 20, 10, 76, 29];
var unique = Box.Array.unique(array); // [10, 20, 76, 29]
```


**clone** `( Array array ): Array`

复制克隆一个新数组

```
var array = [10, 20, 76, 29];
var clone_arr = Box.Array.clone(array);
```

**remove** `( Array array, Object item ): Array`

删除数组中指定的一项数据，元素值必须完全相等（===）才可删除

```
var array = [10, 20, 76, 29];
Box.Array.remove(array, 20);
console.log(array);  // [10, 76, 29]
```

**merge** `( Array *arrray ): Array`

合并多个数组形成一个新数组

> 参数可以是1个或多个，没有限制

```
var array1 = [1, 2, 3];
var array2 = [2, 4, 6, 8];
var array3 = Box.Array.merge(array1, array2);
// array3:  [1, 2, 3, 2, 4, 6, 8]
```


**uniqueMerge** `( Array *arrray ): Array`

合并多个数组，并且去重，形成一个新数组

> 参数可以是1个或多个，没有限制

```
var array1 = [1, 2, 3];
var array2 = [2, 4, 6, 8];
var array3 = Box.Array.merge(array1, array2);
// array3:  [1, 2, 3, 4, 6, 8]
```


**toArray** `( Object/Array iterable, [Number start], [Number end] ): Array`

将一个可迭代元素(具有数字下标和length属性)转换为一个真正的数组


> - iterable  可迭代的对象
> - start （可选）从0开始的索引，表示要转换的起始位置，默认为0
> - end （可选）从1开始的索引，表示要转换的结束位置，
默认为要迭代元素的末尾位置。


```
function test() {
    var args = Box.Array.toArray(arguments),
    var fromSecondToLastArgs = Box.Array.toArray(arguments, 1);

    alert(args.join(' '));
    alert(fromSecondToLastArgs.join(' '));
}

test('just', 'testing', 'here'); // 'just testing here';
                                 // 'testing here';

Box.Array.toArray(document.getElementsByTagName('div')); // 将把 NodeList 转换成一个数组
Box.Array.toArray('splitted'); 	// ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
Box.Array.toArray('splitted', 0, 3); // ['s', 'p', 'l']
```

**from** `( Object value, [Boolean newReference] ): Array`

将一个值转换为一个数组

> - value 给定的值
> - newReference （可选）当 `value` 本身就是数组类型的话，该值设置为 `true`，代表克隆一份返回，如果为 `false`，则使用数组本身

函数的返回分为以下几种情况

> - 一个空数组，如果给定的值是 `undefined` 或 `null`
> - 数组本身，如果已经是一个数组
> - 一个数组的拷贝，如果给定的值是 `iterable` (`arguments`， `NodeList` 等等)
> - 一个包含给定值作为唯一元素的数组



**min** `( Array array, [Function comparisonFn] ): Object`

返回数组中的最小值

> - array 数组
> - comparisonFn （可选）比较函数，如果被忽略，则使用 "<" 操作符。 注意: gt = 1; eq = 0; lt = -1

```
var array = [20, 38, 2, 72, 23];
var min = Box.Array.min(array);  // 2
```

**max** `( Array array, [Function comparisonFn] ): Object`

返回数组中的最大值

> - array 数组
> - comparisonFn （可选）比较函数，如果被忽略，则使用 ">" 操作符。 注意: gt = 1; eq = 0; lt = -1  

```
var array = [20, 38, 2, 72, 23];
var max = Box.Array.max(array);  // 72
```


**sum** `( Array array ): Object`

统计数组每项的和

```
var array = [20, 38, 2, 72, 23];
var sum = Box.Array.sum(array);  // 155
```

**mean** `( Array array ): Number`

计算数组中元素的平均值


**pluck** `( Array array, String prop ): Array`

获取数组中每个元素的指定的属性值形成一个新的数组

> - array 数组
> - prop 元素的属性名称

```
var array = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
var ages = Box.Array.pluck(array, "age");  // [10, 20, 17]
```


**flatten** `( Array array ): Array`

递归将数组和数组中的元素转换为一个一维数组

```
var array = [20, 38, ["a", "b", [9, 8]]];
var new_arr = Box.Array.flatten(array); // [20, 38, "a", "b", 9, 8]
```

**erase** `( Array array, Number index, Number removeCount ): Array`

移除数组中的多个元素

> - array 数组
> - index 开始移除元素的索引位置
> - removeCount 要移除的元素数量

```
var array = [20, 38, 2, 72, 23];
Box.Array.erase(array, 0, 2);  // [2, 72, 23]
```


**replace** `( Array array, Number index, Number removeCount, [Array insert] ): Array`

替换数组里的多个元素

> - array 数组
> - index 开始替换元素的索引位置
> - removeCount 要替换的元素数量（可以为0）
> - insert （可选）要插入的数组

```
var array = [20, 38, 2, 72, 23];
Box.Array.replace(array, 0, 2, [1, 2]); // [1, 2, 2, 72, 23]
```


**insert** `( Array array, Number index, Array items ) : Array`

往数组中插入多个元素

> - array 数组
> - index 插入的位置索引
> - items 要插入的多个元素

```
var array = [20, 38, 2, 72, 23];
Box.Array.insert(array, 1, [1, 2]); //  [20, 1, 2, 38, 2, 72, 23]
```

**sort** `( Array array, [Function sortFn] ): Array`

排序数组中的元素 默认按升序排序

> - array 数组
> - sortFn （可选）排序比较函数

函数 `sortFn` 方法有2个参数，分别为item1和item2，分别代表相比较的2个元素项

```
var array = [20, 38, 2, 72, 23];

Box.Array.sort(array); 
// [2, 20, 23, 38, 72]

Box.Array.sort(array, function (item1, item2) {
    if (item1 > item2) {
        return -1
    } else if (item1 < item2) {
        return 1
    } else {
        return 0
    }
}); 
// [72, 38, 23, 20, 2]
```

**some** `( Array array, Function fn, [Object scope] ): Boolean`

判断数组中是否有数据满足要求。

循环数组，在数组的每个元素上执行指定函数，直到遇到函数返回 `true` 停止迭代，并立即返回 `true`， 如果一直没有返回 `true`， 那么方法返回 `false`

> - array 数组
> - fn 用于判断的回调函数，当函数返回 `true` 时，停止迭代
> - scope （可选）回调函数的作用域

```
var scores = [5, 8, 3, 10];

var has = Box.Array.some(scores, function (score) {
    return score > 7;
});
if (has) {
  alert("数组中存在大于7的数字");
}
```



**every** `( Array array, Function fn, [Object scope] ): Boolean`

判断数组中是否都符合要求（一项不符合也不行）。

迭代数组，在数组的每个元素上执行指定函数，直到函数返回一个 `false` 值 如果某个元素上返回了 `false` 值，本函数立即返回 `false` 否则函数返回 `true`

> - array 数组
> - fn 用于判断的回调函数，当函数返回 `false` 时，停止迭代
> - scope （可选）回调函数的作用域

```
var scores = [5, 8, 3, 10];

var has = Box.Array.every(scores, function (score) {
    return score > 7;
});
if (has) {
    alert("数组中所有的数字都大于7");
} else {
    alert("数组中含有比7小的数字");
}
// 数组中含有比7小的数字
```



**difference** `( Array arrayA, Array arrayB ): Array`

比较2个数组，去除被比较数组（`arrayA`）中2个数组的相同元素，留下不同的元素形成一个新的数组

简单点：从 `arrayA` 中删除所有 `arrayB` 中存在的元素，然后形成新数组


```
var arrayA = [1, 2, 3, 4, 5, 6];
var arrayB = [2, 4, 6];     
var arrayC = Box.Array.difference(arrayA, arrayB); // [1, 3, 5]
```

**include** `( Array array, Object item ): Array`

向数组中添加元素项，如果它不存在于这个数组

```
var array = [1, 2, 3, 4, 5];
Box.Array.include(array, 2); // [1, 2, 3, 4, 5]
Box.Array.include(array, 9); // [1, 2, 3, 4, 5, 9]
```



**intersect** `( Array *array ): Array`

收集多个数组的公共交集形成一个新数组

```
var arrayA = [1, 2, 3, 4, 5, 6];
var arrayB = [2, 4, 6, 8, 10];     
var arrayC = Box.Array.intersect(arrayA, arrayB); // [2, 4, 6]
```



**invoke** `( Array array, String method, [Object *args] )`

执行数组中每项中的指定函数，并且将每次执行的返回值存储在一个新数组中。 注意：数组里的每一项必须为一个对象。

> - array：待执行函数的数组载体
> - method：执行函数的方法名
> - args1：（可选）执行函数的第一个参数
> - args2：（可选）执行函数的第二个参数
> - argsn：（可选）执行函数的第N个参数

```
var array = [
    {
        name: "zhangsan",
        age: function (n) {
            return 10 * n
        }
    },
    {
        name: 'lisi',
        age: function (n) {
            return 20 * n
        }
    }
];
var ages = Box.Array.invoke(array, 'age', 0.5);
console.log(ages);  // [5, 10]
```

















