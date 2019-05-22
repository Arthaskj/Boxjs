# Box.util.Event (class)

---

该类提供了事件的发布和触发的公共接口。组要用于混入到其他类中为类提供事件监听功能。


## 使用说明

```
Box.define('Employee', {
    mixins: {
        event: 'Box.util.Event'
    },
    constructor: function (config) {
        this.mixins.event.constructor.call(this, config);
    },
    working: function () {
        ...
        this.trigger('working');
    }
});
```

接着这样使用:

```
var newEmployee = new Employee({
    name: 'zhangsan',
    listeners: {
        working: function() {
            alert(this.name + " working!");
        }
    }
});

newEmployee.working();   // "zhangsan working"
```

## 配置

**listeners** `Object`

一个配置对象，包含一个或多个事件处理函数，在对象初始化时自动初始化事件监听。 它应该是方法 on 指定的一个有效的监听器配置对象。

```
new Employee({
    name: 'zhangsan',
    listeners: {
        working: function() {
             alert(this.name + " working!");
        }
    }
});
```

## 方法


**on** `( String event, Function callback, [Object scope]): void`

为对象添加事件监听器。

> - event： 事件名称
> - callback： 事件触发时执行的函数
> - scope：（可选）事件函数的作用域

```
object.on('saved', function () {
    ...
});
```

`event` 参数有个特殊取值：`all`。 对象上触发任何事件，都会触发 `all` 事件的回调函数，传给 `all` 事件回调函数的第一个参数是事件名。例如，下面的代码可以将一个对象上的所有事件代理到另一个对象上：

```
object.on('all', function(eventName) {
    other.trigger(eventName);
});
```




**off** `( [String event], [Function callback], [Object scope]): void`

从对象上移除一个事件监听器。

> - event：（可选）事件名称
> - callback：（可选）事件触发时执行的函数
> - scope：（可选）事件函数的作用域

三个参数都是可选的，当省略某个参数时，表示取该参数的所有值。例子：

```
// 移除 change 事件上名为 onChange 的回调函数
object.off('change', onChange);

// 移除 change 事件的所有回调函数
object.off('change');

// 移除所有事件上名为 onChange 的回调函数
object.off(null, onChange);

// 移除上下文为 scope 的所有事件的所有回调函数
object.off(null, null, scope);

// 移除 object 对象上所有事件的所有回调函数
object.off();
```




**trigger/emit** `( String event, [Object *args])`

触发一个或多个事件监听器（用空格分隔）。*args 参数会依次传给回调函数。

> - event： 事件名称
> - args1：（可选）事件触发的第一个参数
> - args2：（可选）事件触发的第二个参数
> - argsn：（可选）事件触发的第N个参数


```
obj.on('event', function(arg1, arg2) {
    ...
});

obj.trigger('event', arg1, arg2);
```

`trigger` 的返回值是一个布尔值，会根据所有 `callback` 的执行情况返回。只要有一个 `callback` 返回 `false`，`trigger` 就会返回 `false`。

```
obj.on('event', function() {
    ...
});
obj.on('event', function() {
    ...
    return false;
});
obj.on('event', function() {
    ...
});

obj.trigger('event'); // return false
```


**suspendEvents** `()`

挂起所有事件的触发

**resumeEvents** `()`

继续事件的触发