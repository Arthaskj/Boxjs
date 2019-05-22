# Box.util.KeyNav (class)

----

提供一个便捷的正规的键盘导航包装类。KeyNav允许你将导航键绑定到 函数上。当这些键被按下时，函数被调用。 这提供了为任何 UI 组件实现自定义导航模式的简单方式。

## 使用说明

KeyNav 必须配置一个 `target` 作为事件源，然后会监听该 target 的 `keypress` 事件。以下是所有可能被实现的键： 回车键、空格键、左方向键、右方向键、上方向键、下方向键、tab键、pageUp键、pageDown键、del键、退格键、home键和 end键。

```
var nav = new Box.util.KeyNav({
    target: "#my-element",
    left: function(e){
        this.moveLeft(e.ctrlKey);
    },
    right: function(e){
        this.moveRight(e.ctrlKey);
    },
    enter: function(e){
        this.save();
    },
    esc: {
        fn: this.onEsc,
        defaultEventAction: false
    },
    onEsc: function () {
        ...
    },
    scope : this
});
```

## 配置

**eventName** `String`

以什么事件方式来监听键盘事件，默认为 keypress。

**ignoreInputFields** `Boolean`

是否忽略对可编辑元素进行监听（input，textarea 或者dom元素的 withcontentEditable 属性值为 true）， 默认为 false。

**target** `Box.Component/String/jQuery/DOM Element`

被监听的对象，它触发 eventName 配置选项声明的事件。

**defaultEventAction** `String`

在拦截按键事件时，调用 event 对象中的某个方法。有效的值有 stopPropagation、preventDefault 和 stopEvent。如果指定为 false，不会调用任何方法。

## 方法

**enable** `()`

启用键盘事件监听。

**disable** `()`

禁止键盘事件监听。

**setDisabled** `( Boolean disabled )`

设置键盘事件监听的启用或禁用。
