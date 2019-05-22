# Box.util.HashMap (class)

---

哈希表，使用键值对的形式组成的集合类。


## 使用说明

`HashMap` 中的每个键 必须是唯一的。只能通过键访问集合中的项。使用范例：

```
var store = new Box.util.HashMap();
store.add('key1', 1);
store.add('key2', 2);
store.add('key3', 3);

store.each(function(key, value, length){
    console.log(key, value, length);
});
```

`HashMap` 是无序的，无法保证遍历其中的项时，这些项是某种 特定的顺序。如果需要顺序固定，那么请使用另外一个集合类 `Box.util.MixedCollection`


## 配置

**getKey** `( Object item ): String/Number`

用以检索接收到的对象的键的函数，用法参考方法中的 `getKey`

## 方法

**new Box.util.HashMap** `( Object config ): Object`

创建HashMap对象。

> - config （可选）当传递的值为一个对象的话，代表创建实例的属性配置，如果为一个函数的话， 则为重写类的 `getKey` 方法。

```
var store = new Box.util.HashMap(function (item) {
	return item.id
});

// 或者

var store = new Box.util.HashMap({
	getKey: function (item) {
		return item.id
	}
});
```


**add/push** `( String key, [Object item] ): Object`

向哈希表中添加项。完成后触发add事件。

> - key 待添加的数据项对应的键。当只有1个参数，那么该参数代表待添加的数据项。
> - item （可选）待添加的数据项

如果为这个HashMap指定实现了 `getKey`， 或者添加的数据项的键保存在id属性中， HashMap将能取得新数据项的键。

```
var store = new Box.util.HashMap({
	// 自定义getKey方法，使用name属性值作为键
	getKey: function (item) {
		return item.name
	}
});
store.add({name: "zhangsan", age: 20});
store.add("zhangsan", {name: "zhangsan", age: 20});
```

**addAll** `( Array items ): Object`

添加单条或多条数据到集合中。

```
var arrays = [
	{id: 1, name: "张三", age: 10},
	{id: 2, name: "李四", age: 20},
	{id: 3, name: "王五", age: 17}
];
store.addAll(arrays);
```

**clear** `(): Box.util.HashMap`

清除集合中所有的数据项


**clone** `(): Box.util.HashMap`

复制当前集合形成一个新的集合


**contains** `( Object item ): Boolean`

判断一个数据项是否存在于集合中

> - item 待判断的数据项。

`contains` 不是根据值来判断， 而是根据键来判断（根据 `getKey` 方法来获取键），所以如果键可以匹配上而数据项不能完全匹配上的话，也算存在于集合中。

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);

store.contains({id: "002"}); // true
store.contains({id: "008", name: "李四", age: 20}); // false
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
store.addAll(arrays);
store.containsKey("003"); // true
```


**each** `( Function fn, [Object scope] ): Box.util.HashMap`

遍历集合，对集合中的每个数据项执行一次指定的函数。 函数返回false将停止迭代。

> - fn 对集合中每条数据的遍历回调函数
> - scope （可选）回调函数的作用域 `this` 的指向值， 默认作用域为当前遍历到的数据。

回调函数 `fn` 中的参数如下

> - key 当前遍历到的键
> - item 当前遍历到的数据项
> - length 集合的长度

```
var format = {
	substr: function (value, s, l) {
		return value.substring(s, l)
	}
};
store.each(function (key, item) {
	// 使用scope作用域的substr函数做格式化
	var new_name = this.substr(item.name, 0, 10);
	...
}, format);
```


**get** `( String key ): Object`

根据键来获取值，如果没有对应的数据项，那么返回undefined

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);
store.get("002"); // {id: "002", name: "李四", age: 20}
```

**getKey** `( Object item ): String`

根据数据项自动获取对应的键

> - item 数据项，其中必须包含键对应的属性，默认为属性名为 `id`

系统默认 `getKey` 方法：

```
getKey: function (item) {
	return item.id
}
```

如果您的集合使用非 `id` 属性值作为键，那么您就需要在创建集合时，加入 `getKey` 的配置

```
var map = new Box.util.HashMap({
	getKey: function (item) {
		return item.name
	}
});
```


**getKeys** `(): Array`

获得集合中所有的键

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);

var keys = store.getKeys(); 
// keys: ["001", "002", "003", "004"]
```

**getValues** `(): Array`

获得集合中所有的数据项

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);
var values = store.getValues(); 
// values: 
// [
//    {id: "001", name: "张三", age: 10},
//	{id: "002", name: "李四", age: 20},
//	{id: "003", name: "王五", age: 17},
//	{id: "004", name: "Jack cheng", age: 17}
// ]
```

**getCount** `(): Number`

获取集合的长度

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);
var len = store.getCount(); // 4
```


**remove** `( Object/String item, [Boolean byKey]): Boolean`

删除集合中的一个数据项

> - item 待删除的数据项或者数据项对应的键，如果是数据项，那么必须完全相当（===）才可成功删除。
> - byKey （可选）是否根据键来删除，默认为 `false`，如果设置为 `true`， `item` 参数必须为键。


```
var wangwu = {id: "003", name: "王五", age: 17};
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	wangwu,
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);

// 删除 wangwu 这条数据
store.remove(wangwu);
// 删除键值为003的数据项
store.remove("003", true)
```

**removeAtKey** `( String key ): Boolean`

根据键来删除一个数据项，等同于 `remove(key, true)`

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);

// 删除键值为003的数据项
store.removeAtKey("003")
```


**replace** `( String key, [Object item] ): Object`

替换指定键对应的数据项

> - key 需替换数据项对应的键 或者 整个数据项（数据项中必须包括键对应的属性）
> - item （可选）数据项

```
var arrays = [
	{id: "001", name: "张三", age: 10},
	{id: "002", name: "李四", age: 20},
	{id: "003", name: "王五", age: 17},
	{id: "004", name: "Jack cheng", age: 17}
];
store.addAll(arrays);

store.replace("002", {id: "002", name: "lucy", age: 18});
// 或者
store.replace({id: "002", name: "lucy", age: 18})
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
