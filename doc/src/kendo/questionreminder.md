# Box.QuestionReminder #

---

一个可以在页面某个地方插入一个问号,鼠标浮动上去会弹出相应的提示的封装组件

## 属性 ##

**icon**

图标(尽量保持统一不要替换)

```
icon:'fa-edit'，
```

**message**

需要显示的提示信息

```
message: 'success',
```

**width**`:number`

提示窗口的宽度

```
width：500，
```

**height**`:number`

提示窗口的高度

```
height：100，
```

**autoHide**

是否自动隐藏

```
autoHide: true,//自动隐藏
```

**示例**

```
Box.Questionreminder.show({
 message: '以下用户信息为选填',
 renderTo: this.el.bondDetails.find('.question')
 });
```

