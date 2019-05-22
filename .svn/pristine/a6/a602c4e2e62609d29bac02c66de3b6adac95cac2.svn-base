# Box.util.ListenerProxy (class)

---


ListenerProxy 致力于解决事件嵌套问题，让大家对事件式编程的思维发生变化。它有以下几个特点

> - 利用事件机制解耦复杂业务逻辑
> - 移除被广为诟病的深度callback嵌套问题
> - 将串行等待变成并行等待，提升多异步协作场景下的执行效率
> - 友好的Error handling


## 过去

世界上本没有嵌套回调，写得人多了，也便有了。回忆下以前我们是怎么处理多异步事件的

```
var render = function(template, user, list) {
    ...
};
$.get("template.do", function(template) {
    ...
    $.get("user.do", function(user) {
        ...
        $.get("list.do", function(list) {
            ...
            render(template, user, list);
        });
    });
});
```

过去的，深度嵌套的，串行的。 

## 现在

如果使用 `ListenerProxy`，那么我们的代码就不会存在深度嵌套，而是并行的

```
var proxy = Box.util.ListenerProxy.create("template", "user", "list", function (template, user, list) {
    ...
});

$.get("template.do", function (template) {
    ...
    proxy.emit("template", template);
});
$.get("user.do", function (user) {
    ...
    proxy.emit("user", user);
});
$.get("list.do", function (list) {
    ...
    proxy.emit("list", list);
});
```


## 异步协作

### 多类型异步协作

此处以页面渲染为场景，渲染页面需要模板、数据。假设都需要异步读取 （这个例子是以 `nodejs` 为环境，但是不影响表达）。

```
var proxy = new Box.util.ListenerProxy();
proxy.all('tpl', 'data', function (tpl, data) {
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名
});
fs.readFile('template.tpl', 'utf-8', function (err, content) {
    proxy.emit('tpl', content);
});
db.get('some sql', function (err, result) {
    proxy.emit('data', result);
});
```

`all` 方法将 `handler` 注册到事件组合上。当注册的多个事件都触发后，将会调用 `handler` 执行，每个事件传递的数据，将会依照事件名顺序，传入 `handler` 作为参数。

### 快速创建

`ListenerProxy` 提供了 `create` 静态方法，可以快速完成注册 `all` 事件。

```
var proxy = Box.util.ListenerProxy.create('tpl', 'data', function (tpl, data) {
    ...
});
```

以上方法等效于

```
var proxy = new Box.util.ListenerProxy();
proxy.all('tpl', 'data', function (tpl, data) {
    ...
});
```



### 重复异步协作

此处以读取目录下的所有文件为例，在异步操作中，我们需要在所有异步调用结束后，执行某些操作。

```
var proxy = new Box.util.ListenerProxy();
proxy.after('got_file', files.length, function (list) {
    // 在所有文件的异步执行结束后将被执行
    // 所有文件的内容都存在list数组中
});
for (var i = 0; i < files.length; i++) {
    fs.readFile(files[i], 'utf-8', function (err, content) {
        // 触发结果事件
        proxy.emit('got_file', content);
    });
}
```

`after` 方法适合重复的操作，比如读取10个文件，调用5次数据库等。将 `handler` 注册到N次相同事件的触发上。达到指定的触发数，`handler` 将会被调用执行，每次触发的数据，将会按触发顺序，存为数组作为参数传入。



### 持续型异步协作

此处以股票为例，数据和模板都是异步获取，但是数据会持续刷新，视图会需要重新刷新

```
var proxy = new Box.util.ListenerProxy();
proxy.tail('tpl', 'data', function (tpl, data) {
    // 在所有指定的事件触发后，将会被调用执行
    // 参数对应各自的事件名的最新数据
});
fs.readFile('template.tpl', 'utf-8', function (err, content) {
    proxy.emit('tpl', content);
});
setInterval(function () {
    db.get('some sql', function (err, result) {
        proxy.emit('data', result);
    });
}, 2000);
```

`tail` 与 `all` 方法比较类似，都是注册到事件组合上。不同在于，指定事件都触发之后，如果事件依旧持续触发，将会在每次触发时调用 `handler`，极像一条尾巴。


## 基本事件

通过事件实现异步协作是 `ListenerProxy` 的主要亮点。除此之外，它还是一个基本的事件库。携带如下基本API

> - on/addListener，绑定事件监听器
> - emit，触发事件
> - once，绑定只执行一次的事件监听器
> - removeListener，移除事件的监听器
> - removeAllListeners，移除单个事件或者所有事件的监听器
为了照顾各个环境的开发者，上面的方法多具有别名。

[`YUI3`](http://yuilibrary.com/) 使用者，`subscribe` 和 `fire` 你应该知道分别对应的是 `on/addListener` 和 `emit`。
[`ExtJs`](http://www.sencha.com/) 使用者，`on` 和 `trigger` 分别对应的是 `addListener` 和 `emit`。
`jQuery` 使用者，`trigger` 对应的方法是 `emit`，`bind` 对应的就是 `on/addListener`。
`removeListener` 和 `removeAllListeners` 其实都可以通过别名 `unbind` 完成。
所以在你的环境下，选用你喜欢的API即可。


## 异常处理

在异步方法中，实际上，异常处理需要占用一定比例的精力。我们需要通过额外添加 `error` 事件来进行处理的，代码大致如下：

```
var proxy = new Box.util.ListenerProxy();
proxy.all('tpl', 'data', function (tpl, data) {
    // 成功回调
});
// 侦听error事件
proxy.bind('error', function (err) {
    // 卸载掉所有handler
    proxy.unbind();
    // 处理异常
    ...
});
fs.readFile('template.tpl', 'utf-8', function (err, content) {
    if (err) {
      // 一旦发生异常，一律交给error事件的handler处理
      return proxy.emit('error', err);
    }
    proxy.emit('tpl', content);
});
db.get('some sql', function (err, result) {
    if (err) {
      // 一旦发生异常，一律交给error事件的handler处理
      return proxy.emit('error', err);
    }
    proxy.emit('data', result);
});
```