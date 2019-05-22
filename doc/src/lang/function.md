# Box.Function (singleton)

---

一个用来处理函数方法的静态方法集合


## 方法


**alias** `( Object obj, String methodName ): Function`

为 `object` 中的属性名为 `methodName` 的方法创建一个别名。 

> 注意：执行的作用域仍将被绑定到所提供的 `object` 本身。

```
var obj = {
    fun: function(){}
};
var fun2 = Box.Function.alias(obj, fun);
```

**clone** `( Function fn ): Function`

克隆一个函数


**flexSetter** `( Function setter ): Function`

快捷封装处理键值对的方法，灵活的在参数个数上做选择

```
var setValue = Box.Function.flexSetter(function(name, value) {
    this[name] = value;
});

// 设置单个名称-值
setValue('name1', 'value1');

// 设置多个名称-值对
setValue({
    name1: 'value1',
    name2: 'value2',
    name3: 'value3'
});
```

**bind** `( Function fn, [Object scope], [Array args], [Boolean/Number appendArgs] ): Function`

根据指定函数 `fn` 创建一个代理函数，更改 `this` 作用域为传入的作用域， 也可以选择重写调用的参数（默认为该函数的参数列表）

`Box.bind` 是 `Box.Function.bind` 的别名

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


**defer** `( Function fn, Number millis, [Object scope], [Array args], [Boolean/Number appendArgs] ): Number`

延迟调用函数

`Box.defer` 是 `Box.Function.defer` 的别名

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

**createInterceptor** `( Function fn, Function interceptor, [Object scope], [Object returnValue] ): Function`

在一个函数上绑定一个拦截器形成一个新函数。当拦截器函数 `interceptor` 返回 `false`，则原函数 `fn` 不会被执行， 拦截器函数被调用的时候， 会将原函数的参数传递给拦截器函数


> - fn 原始函数
> - interceptor 新的拦截函数
> - scope（可选） 传递的函数执行的作用域( `this引用` ) 如果省略，默认指向被调用的原函数作用域或 `window`
> - returnValue（可选）返回的值，如果传递的函数返回 `false`（默认为 `null`）

```
var sayHi = function(name){
    alert('Hi, ' + name);
}
sayHi('张三'); //  "Hi, 张三"

// 不修改原函数的前提下创建新的验证函数:
var sayHiToFriend = Box.Function.createInterceptor(sayHi, function(name){
    return name == '张三';
});

// 没执行sayHi方法
sayHiToFriend('李四'); 
// 验证通过，执行sayHi方法
sayHiToFriend('张三'); //  "Hi, 张三"
```



**createDelayed** `( Function fn, Number delay, [Object scope], [Array args], [Boolean appendArgs] ): Function`

创建一个延时执行的回调函数

> 注意：`createDelayed` 和 `defer` 的不同

> - fn 延迟执行的函数
> - delay 推迟执行的毫秒数。
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`
> - args（可选）覆盖原函数的参数列表 （默认为该函数的参数列表）
> - appendArgs（可选）如果该参数为 `true`，将参数加载到该函数的后面， 如果该参数为数字类型，则将参数将插入到所指定的位置。

```
var sayHi = function(name){
    alert('Hi, ' + name);
}

// 即刻执行的:
sayHi('张三');

var delaySayHi = Box.Function.createDelayed(sayHi, 2000);
// 延迟2秒执行sayHi函数
delaySayHi('张三');
```


**createBuffered** `( Function fn, Number buffer, [Object scope], [Array args] ): Function`

创建一个缓冲函数。延迟一定的时间 `buffer` 执行函数 `fn`，形成缓冲。

如在 `buffer` 时间内，函数 `fn` 被调用多次的话， 则上一次延迟调用被取消，并且重新开始计算缓冲时间


> - fn 需要被缓冲的原始函数
> - buffer 缓冲函数调用执行的时间，单位是毫秒
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`
> - args（可选）覆盖该次调用的参数列表 （默认为该函数的参数列表）


```
var index = 0;
var bufferFn = Box.Function.createBuffered(function () {
	console.log(++index);
}, 1000);


bufferFn();
// 在500毫秒后再次执行bufferFn，由于bufferFn正在缓冲时间内，所以取消上次延迟调用，重新开始计算缓冲时间
setTimeout(bufferFn, 500);
// 当最后一行代码执行完后index的值为: 1
```


**createSequence** `( Function originalFn, Function newFn, [Object scope] ): Function`

创建一个组合式函数，调用次序为：原函数 `originalFn` -> 新的组合函数 `newFn`。 该函数返回了原函数 `originalFn` 执行的结果（也就是返回了原函数的返回值）。 新的组合函数参数也是原函数的参数。

> - originalFn 原始函数
> - newFn 新的组合函数
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`

```
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('张三'); // "Hi, 张三"

var sayGoodbye = Box.Function.createSequence(sayHi, function(name){
    alert('Bye, ' + name);
});

sayGoodbye('张三'); // "Hi, 张三" "Bye, 张三"
```


**createThrottled** `( Function fn, Number interval, [Object scope] ): Function`

创建一个函数的减速代理。当减速函数被反复快速回调时，只有在上次调用完成的指定时间间隔之后才会被调用。

对于封装那些会被多次且迅速调用的函数，如鼠标移动事件或者浏览器 `resize` 事件，是可以提高效能的

> - fn 要在一个固定的时间间隔执行的函数。
> - interval 减速函数执行的时间间隔，单位为毫秒。
> - scope（可选）该函数执行的作用域(`this引用`)。 如果省略，默认指向 `window`

```
$(window).resize(Box.Function.createThrottled(function () {
	...
}, 100))
```


**pass** `( Function fn, Array args, [Object scope] ): Function`


创建当前函数的回调函数，新的参数传递到新创建的回调函数中，调用时追加到预先设定的参数之后

`Box.pass` 是 `Box.Function.pass` 的别名

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


**before** `( Object obj, String methodName, Function fn, [Object scope] ): void`

为对象 `obj` 下的 `methodName` 方法添加预处理方法


> - obj 目标对象
> - methodName 方法名称
> - fn 预处理函数。 它将与原始方法使用相同的参数
> - scope（可选）预处理函数的作用域，默认为当前对象 `obj`


```
var soup = {
    contents: [],
    add: function(ingredient) {
        this.contents.push(ingredient);
    }
};
Box.Function.before(soup, "add", function(ingredient){
    if (!this.contents.length && ingredient !== "水") {
        // 总是首先添加水
        this.contents.push("水");
    }
});
soup.add("洋葱");
soup.add("盐");
console.log(soup.contents); // ["水", "洋葱", "盐"]
```


**after** `( Object obj, String methodName, Function fn, [Object scope] ): void`


为对象 `obj` 下的 `methodName` 方法添加后处理方法

> - obj 目标对象
> - methodName 方法名称
> - fn 后处理函数。 它将与原始方法使用相同的参数
> - scope（可选）后处理函数的作用域，默认为当前对象 `obj`

```
var soup = {
    contents: [],
    add: function(ingredient) {
        this.contents.push(ingredient);
    }
};
Box.Function.after(soup, "add", function(ingredient){
    // 总是添加少量额外的盐
    this.contents.push("盐");
});
soup.add("水");
soup.add("洋葱");
console.log(soup.contents); // ["水", "盐", "洋葱", "盐"]
```


**callback** `( Function callback, [Object scope], [Array args], [Number delay] )`

在一个指定的作用域内执行一个回调函数。如果回调函数不存在，或者不是一个函数，那么调用被忽略。


```
Box.Function.callback(myFunc, this, [arg1, arg2]);
// 等价于
Box.isFunction(myFunc) && myFunc.apply(this, [arg1, arg2]);
```













