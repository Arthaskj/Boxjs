# Box.util.Cookie (singleton)

---

提供 `Cookie` 操作方法。是一个单例模式的工具类

## 方法

**get** `( String name ): String`

```
document.cookie = 'foo=1';
document.cookie = 'bar=2';

Box.util.Cookie.get('foo');
// returns '1'
```

> 注：如果要获取的 cookie 键值不存在，则返回 undefined.

**set** `( String name, String value )`

```
Box.util.Cookie.set('foo', 3);
```