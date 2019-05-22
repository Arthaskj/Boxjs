# Box.util.KeyMap (class)

----

该类用于处理元素的键盘事件。


## 使用说明

KeyMap 必须配置一个 `target` 作为事件源，然后会监听该 target 的 `keydown` 事件。

```
var map = new Box.util.KeyMap({
    target: "#my-element",
    key: 13,
    fn: myHandler,
    scope: myObject
});

var map = new Box.util.KeyMap({
    target: "#my-element",
    key: "a\r\n\t",
    fn: myHandler,
    scope: myObject
});

var map = new Box.util.KeyMap({
    target: "#my-element",
    binding: [{
        key: [10,13],
        fn: function(){ alert("Return was pressed"); }
    }, {
        key: "abc",
        fn: function(){ alert('a, b or c was pressed'); }
    }, {
        key: "\t",
        ctrl:true,
        shift:true,
        fn: function(){ alert('Control + shift + tab was pressed.'); }
    }]
});
```


## 配置

**binding** `Object/Object[][]`

一个或一组描述特定键或者键集合的处理函数的对象

> -  key: String/String[] 待处理的单个或一组按键码
> -  shift: Boolean 设置为True只处理按键和shift同时按下时, 设置为false只处理 shift没有按下时的按键(默认为undefined)
> -  ctrl: Boolean 设置为True只处理按键和ctrl同时按下时, 设置为false只处理 ctrl没有按下时的按键(默认为undefined)
> -  alt: Boolean 设置为True只处理按键和alt同时按下时, 设置为false只处理 alt没有按下时的按键(默认为undefined)
> -  handler: Function 当KeyMap找到了期望的按键组合时调用的函数
> -  fn: Function 处理函数别名(为了向后兼容)
> -  scope: Object 处理函数的作用域
> -  defaultEventAction: String 事件激发的默认动作。 可能的值为: stopEvent, stopPropagation, preventDefault. 如果没有设置值，就没有任何动作。


**eventName** `String`

以什么事件方式来监听键盘事件，默认为 keydown。

**ignoreInputFields** `Boolean`

是否忽略对可编辑元素进行监听（input，textarea 或者dom元素的 withcontentEditable 属性值为 true）， 默认为 false。


**target** `Box.Component/String/jQuery/DOM Element`

被监听的对象，它触发 eventName 配置选项声明的事件。

## 方法

**addBinding** `( Object/Object[] binding )`

添加一个或一组键盘监听。

```
var map = new Box.util.KeyMap(document, {
    key: 13,
    fn: handleKey
});

map.addBinding({
    key: 'abc',
    shift: true,
    fn: handleKey,
    scope: this
});
```

**removeBinding** `( Object binding )`

删除一个键盘监听。


**on** `( Number/Number[]/Object key, Function fn, [Object scope] )`

添加单个按键监听器的简化方法

> - key 数值按键码，数值按键码数组或者一个 包含以下参数的对象: {key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
> - fn 事件处理函数
> - scope（可选）事件处理函数执行的作用域(this引用的作用域) 默认为 window。

**un** `( Number/Number[]/Object key, Function fn, [Object scope] )`

删除单个按键监听器的简化方法，参数请参考 on 方法

**isEnabled** `(): Boolean`

获取当前类是否开启键盘监听。

**enable** `()`

启用键盘事件监听。

**disable** `()`

禁止键盘事件监听。

**setDisabled** `( Boolean disabled )`

设置键盘事件监听的启用或禁用。
