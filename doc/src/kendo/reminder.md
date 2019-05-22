# Box.Reminder #

---

一个可以在页面某个地方插入一段提示,点击关闭后,将保存到cookie里面,下次将不再显示的封装组件

## 属性 ##

**name**`:String`

在整个系统里面必须是唯一的,否则可能出现显示不正常的问题

```
name：''，
```

**icon**

提示前的图标

```
icon:'fa-edit'，
```

**message**

需要显示的提示信息

```
message: 'success',
```

**示例**

```
Box.Reminder.show({
   renderTo: this.el.reminder,
   message: '以下用户信息为选填',
   name: 'HY.traderequest.excolrepo.excolrepo.reminder'//在整个系统里面必须是唯一的,否则可能出现显示不正常的问题
 });
```

