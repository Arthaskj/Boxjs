# Box.env.Browser (singleton)

---

提供关于当前浏览器的有用信息。

## 使用说明

`Box.browser` 是 `Box.env.Browser` 的实例，您可以直接使用 `Box.browser` 

```
if (Box.browser.is.IE) {
     ...
}

if (Box.browser.is.WebKit) {
     ...
}

console.log("当前浏览器为 " + Box.browser.name);
```

## 属性


**engineName** `String`

当前浏览器引擎的全名。 可能的值有：`WebKit`，`Gecko`，`Presto`，`Trident` 

**engineVersion** `String`

当前浏览器引擎的版本

**isStrict** `Boolean`

`document` 对象在严格模式(`strict mode`)时为 `true`

**isSecure** `Boolean`

如果网页运行在 `SSL` 时为 `true`

**name** `String`

当前浏览器的全名。 可能的值有： `IE`，`Firefox`，`Safari`，`Chrome`，`Opera`


## 方法


**is** `( String value ): Boolean`

判断浏览器类型或者版本，既可以作为方法调用，即：

```
if (Box.browser.is('IE')) { ... }
```

也可以作为布尔值对象，即：

```
if (Box.browser.is.IE) { ... }
```

版本信息也可以顺便校验。例如：


```
if (Box.browser.is.IE6) { ... }
```

支持的浏览器验证有： `IE`，`Firefox`，`Safari`，`Chrome`，`Opera`，`WebKit`，`Gecko`，`Presto`，`Trident`

