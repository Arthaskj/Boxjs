# Box.util.MixedCollection (class)

---

混合集合类，可以支持用数字型索引获取和保存数据，也可以执行 `key:value` 对的形式获取和保存数据。

## 使用说明

集合中的每个 `key` 键必须是唯一的, 同一个 `key` 不能出现两次。它是有序的， 集合中的每个 `value` 能通过索引 `index` 或者键 `key` 访问。新增的项在集合的尾部。本类类似于 `Box.util.HashMap`， 但是 `MixedCollection` 是重量级的，提供了更多的功能。使用范例：

```
var coll = new Box.util.MixedCollection();
coll.add('key1', 'val1');
coll.add('key2', 'val2');
coll.add('key3', 'val3');

console.log(coll.get('key1')); // 'val1'
console.log(coll.indexOfKey('key3')); // 2
```

`MixedCollection` 也支持对集合中的值的排序和过滤。

```
var coll = new Box.util.MixedCollection();
coll.add('key1', 100);
coll.add('key2', -100);
coll.add('key3', 17);
coll.add('key4', 0);

//过滤出值大于0的项组成一个新的集合
var biggerThanZero = coll.filterBy(function(value){
    return value > 0;
});
console.log(biggerThanZero.getCount()); // 2
```

## 配置

**getKey** `( Object item ): String/Number`

用以检索接收到的对象的键的函数

## 方法

**new Box.util.MixedCollection** `( [Function/Object config] ): Object`

创建MixedCollection对象。

> - config （可选）当传递的值为一个对象的话，代表创建实例的属性配置，如果为一个函数的话， 则为重写类的 `getKey` 方法。

```
var coll = new Box.util.MixedCollection(function (item) {
	return item.id
});

// 或者

var coll = new Box.util.MixedCollection({
	getKey: function (item) {
		return item.id
	}
});
```

**getKey** `( Object item ): String/Number`

动态获得数据项的键，默认使用数据项中的 `id` 属性值作为键，源代码如下：

```
getKey: function (item) {
    return item.id
}
```

**add** `( String/Object key, [Object object] ) : Object`

添加单个新数据到集合中。

> - key  关联到 `value` 的 `key` 值。 当只有一个参数时，代表要添加的新项。在插入新数据时，会根据类中的 `getKey` 方法自动获取 `key` 值（默认 `getKey` 方法是返回数据项中的 `id` 的字段值作为 `key` 值）
		 
> - object （可选）要添加的 `item`

```
coll.add("key", "this is value");
coll.add({id: "key", value: "this is value"});

var length = coll.getCount(); // 2
```

**addAll** `( Array/Obejct objects ) : Object`

添加单条或多条数据到集合中。

```
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
coll.addAll(arrays);
```

**replace** `( String/Object key, [Object object] ): Object`

替换集合中的对象

> - key 需要代替现集合中键为 `key` 的值为 `object`。当参数为一个时，代表它为代替的新数据，程序会通过 `getKey` 方法来自动获取键值，再根据该键来替换值。
> - object （可选）要替换的新数据

```
coll.add({id: 100, name: "张三", age: 10});
// 替换key值为1的值为 {id: 1, name: "小王", age: 19}
coll.replace(100, {id: 1, name: "小王", age: 19});
```

**each** `( Function fn, [Object scope] ): void`

使用回调函数的形式遍历集合。

> - fn 对集合中每条数据的遍历回调函数
> - scope （可选）回调函数的作用域 `this` 的指向值， 默认作用域为当前遍历到的数据。

回调函数 `fn` 中的参数如下

> - item 当前遍历到的数据对象
> - index 当前遍历的下标索引
> - length 集合的长度

```
var format = {
	substr: function (value, s, l) {
		return value.substring(s, l)
	}
};
coll.each(function (item, index, len) {
	// 使用scope作用域的substr函数做格式化
	var new_name = this.substr(item.name, 0, 10);
	...
}, format);
```


**eachKey** `( Function fn, [Object scope] ): void`

使用回调函数的方式遍历所有的键。

> - fn 对集合中每个键遍历的回调函数
> - scope （可选）回调函数的作用域 `this` 的指向值，默认作用域指向 `window` 对象

回调函数 `fn` 中的参数如下

> - key 当前遍历到的键
> - item 当前遍历到的键所对应的数据对象 （值）
> - index 当前遍历的下标索引
> - length 集合的长度

```
coll.eachKey(function (key, item, index, len) {
	// key对应的值为item， 当前下标为index， 数组的长度为len
	...
});
```

**insert** `( Number index, String key, [Object object] ): Object`

插入一条新数据到集合中指定的位置

> - index 待插入新数据到集合中的下标索引位置
> - key 插入数据的键，当参数为2个时，代表待插入的数据，程序会通过 `getKey` 函数来动态获取插入数据的键
> - object （可选）插入数据的键对应的数据

```
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
coll.addAll(arrays);
coll.insert(1, {id: 4, name: "小明", 26});

var keys = [];
coll.eachKey(function (key) {
	keys.push(key);
});
console.log(keys);
// 1 4 2 3
```


**remove** `( Object item ): Object`

从集合中删除一个指定数据项

> - item 待删除的数据项，该值必须和集合中一条数据完全相符才可删除， 如果该值的键可以匹配到集合中的一个键，但它们的值不能完全相等（===）， 那么不可删除

> - 返回值 当成功删除后返回当前删除项 `item`，如果失败（没能完全匹配上）返回 `false`

```
var wangwu = {id: 3, name: "王五", age: 17};
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	wangwu
];
coll.addAll(arrays);

coll.remove(wangwu); // 成功， 返回当前删除项
coll.remove({id: 3, name: "王五", age: 17}); // 失败。完全是2个对象，不能完全相等
```


**removeAt** `( Number index ): Object`

从集合中删除指定索引的数据项

> - index 待删除项在集合中的下标索引

> - 返回值 当成功删除后返回当前删除项 `item`，如果失败（没能完全匹配上）返回 `false`


```
coll.removeAt(1); // 删除集合中的第2项（下标为1）数据
```


**removeAtKey** `( String key ): Object`

从集合中删除指定键对应的数据项

> - key 待删除项的键

> - 返回值 当成功删除后返回当前删除项 `item`，如果失败（没能完全匹配上）返回 `false`


```
coll.add("001", 1);
coll.add("002", {name: "张三", age: 10});
coll.removeAtKey("002");
```

**getCount** `(): Number`

获得集合的大小

```
coll.add("001", 1);
coll.add("002", 2);
coll.getCount(); // 2
```


**indexOf** `( Object item ): Number`

获得一条数据在集合中位于什么下标索引

> - item 待判断索引位置的数据，该值必须和集合中一条数据完全相符才可正确获得到索引， 如果该值的键可以匹配到集合中的一个键，但它们的值不能完全相等，那么也获取不到索引。

> - 返回值 若数据匹配成功，那么返回该数据在集合中的下标索引位置，反之，没有匹配成功，返回-1

```
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
coll.addAll(arrays);

coll.indexOf({id: 1, name: "张三", age: 10}); // 0
coll.indexOf(3); // -1
```


**indexOfKey** `( String key ): Number`

根据一个键在集合中位于什么下标索引

> - key 待判断索引位置的键

> - 返回值 若数据匹配成功，那么返回该数据在集合中的下标索引位置，反之，没有匹配成功，返回-1

```
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
coll.addAll(arrays);

coll.indexOfKey(2); // 1
```

**first** `(): Object`

获得集合中的第一项数据



**last** `(): Object`

获得集合中的最后一项项数据



**get** `( String/Number key ): Object`

根据键或者下标索引来获取对应的数据项

> - key 键 或者 下标索引。 程序首先会将该值当做为键来处理， 如果在集合中可以找到对应的数据项，那么返回数据项，如果没有找到， 并且如果该参数值为 `Number` 类型， 程序会再次将该值看做为下标索引来查找，如果找到，返回数据项，反之返回 `null`

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17}
];
coll.addAll(arrays);

coll.get(3); 	// {id: "003", name: "王五", age: 17}
coll.get("002"); // {id: "002", name: "李四", age: 20}
```


**getAt** `( Number index ): Object`

获取集合中指定下标索引的数据项

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17}
];
coll.addAll(arrays);

coll.getAt(1);  // {id: "002", name: "李四", age: 20}
```


**getByKey** `( String/Number key ): Object`

根据键来获取集合中对应的数据项

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17}
];
coll.addAll(arrays);

coll.getByKey("003");  // {id: "003", name: "王五", age: 17}
```




**findBy** `( Function fn, [Object scope] ): Object`

使用遍历集合的形式逐个判断的方式获取第一个符合要求的数据项

> - fn 判断数据项是否符合要求的函数，当遇到函数返回 `true` 时，代表已经找到符合要求的数据项，停止往下循环判断
> - scope （可选）判断函数的作用域，默认为 `window`
> - 返回值 当遇到 `fn` 执行返回 `true` 时， 返回当前循环到的数据项， 如果遍历完整个集合也没有遇到返回 `true` 的话， 那么程序返回 `null`。 

判断函数 `fn` 的参数为：

> - item 当前循环到的数据项
> - key 当前循环到的数据项对应的键

如若集合中有多条数据符合要求，但 `findBy` 方法始终只会返回第一个符合要求的数据

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17}
];
coll.addAll(arrays);

var ret = coll.findBy(function (item, key) {
	return item.name == "李四"
});
// ret: {id: "002", name: "李四", age: 20}
```


**findIndexBy** `( Function fn, [Object scope], [Number start] ): Number`

使用遍历集合的形式逐个判断的方式获取第一个符合要求的数据项在集合中的下标索引

> - fn 遍历判断函数，当遇到函数手动返回 `true` 时，代表已经找到符合要求的数据项，停止往下循环判断
> - scope （可选）判断函数作用域，默认为 `window`
> - start （可选）指定从集合中的下标索引来开始判断

判断函数 `fn` 的参数为：

> - item 当前循环到的数据项
> - key 当前循环到的数据项对应的键

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17}
];
coll.addAll(arrays);

var index = coll.findIndexBy(function (item, key) {
	return item.name == "李四"
});
// index: 1
```


**findIndex** `( String property, String/RegExp value, [Number start], [Boolean anyMatch], 
[Boolean caseSensitive] ): Number`

根据指定的属性（`property`）和值（`value`）来获取第一个符合要求的数据项在集合中的下标索引

> - property 待查找属性的名称
> - value 待查询属性值，可以为模糊值，也可以为一个正则表达式
> - start （可选）指定从集合中的下标索引开始查找
> - anyMatch （可选）如果设置为 `true`，可以匹配值 `value` 的任何一部分，如果设置为 `false`，则只能从值 `value` 的开始匹配，默认为 `false`
> - caseSensitive （可选）匹配值 `value` 时，是否区分大小写，默认为 `false` 

> - 返回值 若数据匹配成功，那么返回该数据在集合中的下标索引位置，反之，没有匹配成功，返回-1

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "003", name: "Jack cheng", age: 17}
];
coll.addAll(arrays);

coll.findIndex("name", "王五"); // 2
coll.findIndex("name", "五"); // -1
coll.findIndex("name", "五", 0, true); // 2
coll.findIndex("name", "Cheng", 0, true); // 3
coll.findIndex("name", "jack", 0, true, true); // -1
```



**contains** `( Object item ): Boolean`

判断一个数据项是否存在于集合中

> - item 待判断的数据项。

和 `indexOf` 方法不一样，`contains` 不是根据值来判断， 而是根据键来判断（根据 `getKey` 方法来获取键），所以如果键可以匹配上而数据项不能完全匹配上的话，也算存在于集合中。

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
coll.addAll(arrays);

coll.contains({id: "002"}); // true
coll.contains({id: "008", name: "李四", age: 20}); // false
```

**containsKey** `( String key ): Boolean`

判断一个键是否存在于集合中

> - key 待判断的键

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
coll.addAll(arrays);

coll.containsKey("003"); // true
```


**clear** `(): void`

清空集合，并且当清空完成后，会出发 `clear` 事件

```
coll.addAll([...]);
coll.getCount(); // 2
coll.clear();
coll.getCount(); // 0
```

**clone** `(): Box.util.MixedCollection`

创建此集合的一个浅拷贝副本


**sum** `( String property, [String root], [Number start], [Number end] ): Number`

计算集合中每条数据指定属性值的和

> - property 指定计算和的属性名称
> - root （可选）如果需要统计的字段处于每条数据项中一个字段下，那么就需要设置该值为数据项下的某个字段名称
> - start （可选）从集合的指定下标索引位置开始统计，默认为0
> - end （可选）终止统计于指定下标索引位置，默认为集合的长度减1

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 20}
];
coll.addAll(arrays);
coll.sum("age"); // 67
```

如果统计的字段是在属性下另外一个属性，即存在 `root` 参数

```
var arrays = [
	{id: "001", info: {name: "张三", age: 10}},
	{id: "002", info: {name: "李四", age: 20}},
	{id: "003", info: {name: "王五", age: 17}},
	{id: "004", info: {name: "Jack cheng", age: 20}}
];
coll.addAll(arrays);
coll.sum("age", "info"); // 67
```

**collect** `( String property, [String root], [Boolean isUnique], [Boolean allowBlank] ): Array`

收集集合中指定字段的值形成一个数组

> - property 待收集的字段名称
> - root （可选）如果需要收集的字段处于每条数据项中一个字段下，那么就需要设置该值为数据项下的某个字段名称
> - isUnique （可选）收集的值是否去重，默认为 `false`
> - allowBlank （可选） 收集时是否允许值为 `null` 或者 `undefined`，默认为 `false`

```
var arrays = [
	{id: "001", info: {name: "张三", age: 10}},
	{id: "002", info: {name: "李四", age: 20}},
	{id: "003", info: {name: "王五", age: 17}},
	{id: "004", info: {name: "Jack cheng", age: 17}},
	{id: "004", info: {name: "lucy"}}
];
coll.addAll(arrays);
coll.collect("age", "info"); // [10, 20, 17, 17]
coll.collect("age", "info", true); // [10, 20, 17]
coll.collect("age", "info", false, true); // [10, 20, 17, 17, undefined]
```


**getRange** `( [Number startIndex], [Number endIndex] ): Array`

根据下标索引来获取一个范围内的新数组

> - startIndex （可选）范围的开始下标索引，默认为0
> - endIndex （可选）范围的结束下标索引，默认为集合的最后一项的索引

```
var arrays = [
	{id: "001", info: {name: "张三", age: 10}},
	{id: "002", info: {name: "李四", age: 20}},
	{id: "003", info: {name: "王五", age: 17}},
	{id: "004", info: {name: "Jack cheng", age: 17}},
	{id: "004", info: {name: "lucy"}}
];
coll.addAll(arrays);

var arr = coll.getRange(1, 3);
// [
//	 {id: "002", info: {name: "李四", age: 20}},
//	 {id: "003", info: {name: "王五", age: 17}},
//	 {id: "004", info: {name: "Jack cheng", age: 17}}
// ]
```


**filter** `( Box.util.Filter[]/String property, [String/RegExp value], [Boolean anyMatch], 
[Boolean caseSensitive] ) : Box.util.MixedCollection`

通过一对键值对或者一个 `Box.util.Filter` 实例的形式来过滤集合

> - property 作为 `String` 类型时代表需要过滤的键。该值若是 `Box.util.Filter` 的一个实例，那么则是通过这个 `Filter` 实例来过滤
> - value （可选）待查询属性值，可以为模糊值，也可以为一个正则表达式。 
> - anyMatch （可选）如果设置为 `true`，可以匹配值 `value` 的任何一部分，如果设置为 `false`，则只能从值 `value` 的开始匹配，默认为 `false`
> - caseSensitive （可选）匹配值 `value` 时，是否区分大小写，默认为 `false`
> - 返回值 通过过滤符合条件的数据项组建成一个新的组合（`Box.util.MixedCollection` 的实例）

```
var people = new Box.util.MixedCollection();
people.addAll([
    {id: 1, name: '张三', age: 25},
    {id: 2, name: '李四', age: 37},
    {id: 3, name: '王五', age: 32},
    {id: 4, name: 'Aaron', age: 26},
    {id: 5, name: 'David', age: 32}
]);
// 过滤people集合中age为32的数据项形成一个新的集合
var middleAged = people.filter('age', 32);

var ageFilter = new Box.util.Filter({
    property: 'age',
    value   : 32
});
var longNameFilter = new Box.util.Filter({
    filterFn: function(item) {
        return item.name.length > 4;
    }
});
// 拥有2个people的姓名长度大于4
var longNames = people.filter(longNameFilter);
// 含有2个年龄为32岁的people
var youngFolk = people.filter(ageFilter);
```

**filterBy** `( Function fn, [Object scope] ): Box.util.MixedCollection`

通过遍历执行函数来过滤集合形成一个新集合。

> - fn 过滤函数，如果函数返回 `true` 则表示过滤通过，反之则不符合过滤条件
> - scope （可选）过滤函数的作用域，默认为当前集合对象

参数 `fn` 的参数有2个

> - item 当前遍历到的数据项
> - key 当前遍历到的数据项对于的键

```
var people = new Box.util.MixedCollection();
people.addAll([
    {id: 1, name: '张三', age: 25},
    {id: 2, name: '李四', age: 37},
    {id: 3, name: '王五', age: 32},
    {id: 4, name: 'Aaron', age: 26},
    {id: 5, name: 'David', age: 32}
]);

// 过滤年龄大于30的人
var new_coll = people.filterBy(function (item, key) {
	return item.age > 30
});
var len = new_coll.getCount(); // 3
```

**sort** `( String/Box.util.Sorter[] sorters, String direction ): Box.util.Sorter`

通过一个属性或者多个属性或者也可以通过 `Box.util.Sorter` 的实例来排序集合

> - sorters 排序的字段。若该参数值为一个数组，那么代表通过多个字段来排序，数组的每一项需要包括2个字段，分别为 `property`（属性名） 和 `direction` （排序类型）。如果该参数为 `Box.util.Sorter` 的一个实例，那么代表使用该实例进行排序集合
> - direction 排序的方式，分为2个值，`DESC` 为倒叙 `ASC` 为正序

```
// 通过单个属性来排序
store.sort('age', 'DESC');
// 通过过个属性来排序
store.sort([
    {
        property : 'age',
        direction: 'ASC'
    },
    {
        property : 'name',
        direction: 'DESC'
    }
]);

// 通过Box.util.Sorter来过滤
var sorter = new Box.util.Sorter({
	sorterFn: function(item1, item2){
		var getAge = function (record) {
			return record.age || 0;
		};
        var age1 = getAge(item1);
        var age2 = getAge(item2);
        if (age1 === age2) {
            return 0;
        }
        return age1 < age2 ? -1 : 1;
    }
});
sort.sort(sorter)
```


**sortBy** `( Function sorterFn, [Object scope] ): void`

使用排序函数为集合排序

> - sorterFn 排序函数，函数拥有2个字段item1和item2，分别是排序比较的2个数据项
> - scope （可选）排序函数的作用域，默认为当前集合对象


```
store.sortBy(function (item1, item2) {
	var getAge = function (record) {
		return record.age || 0;
	};
	var age1 = getAge(item1);
    var age2 = getAge(item2);
    if (age1 === age2) {
        return 0;
    }
    return age1 < age2 ? -1 : 1;
});
```

**sortByKey** `( [String direction], [Function fn], [Object scope] ): void`

根据键为集合排序。

> - direction（可选） 排序的类型，2种类型，`DESC` 为倒叙 `ASC` 为正序，默认为'ASC'
> - fn （可选）定义排序比较函数。函数拥有2个字段key1和key2，分别是排序比较的2个数据项对应的键。默认排序不区分大小写
> - scope （可选）排序函数的作用域，默认为集合对象

```
// 简单的通过排序方式进行排序
store.sortByKey('DESC');
// 通过自定义排序函数进行排序
store.sortByKey(function (key1, key2) {
	if (key1 === key2) {
        return 0;
    }
    return key1 < key2 ? -1 : 1;
})
```

**on** `( String event, Function callback, [Object scope] ): void`

注册监听事件，用法请看 [Box.Events](#/api/Events)

**off** `( [String event], [Functin callback], [Ojbect scope] ): void`

销毁监听事件，用法请看 [Box.Events](#/api/Events)

**once** `( String event, Function callback, [Object scope] ): void`

注册一次性监听事件，用法请看 [Box.Events](#/api/Events)
 
**tigger** `( String event, [Object *args] ): void`

触发监听指定的事件，用法请看 [Box.Events](#/api/Events)


## 事件

**add**

**remove**

**replace**

**clear**

