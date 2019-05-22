# Box.Object (singleton)

---

一个用来处理对象的静态方法集合


## 方法


**each** `( Object obj, Function fn, [Object scope] ): void`

迭代对象，在每个迭代上调用给定的回调函数，在回调函数中返回 `false` 可以停止迭代

> - obj 待迭代对象
> - fn 迭代函数，如果在函数内返回 `false`，那么停止迭代
> - scope （可选）迭代函数的作用域

迭代函数 `fn` 拥有3个参数，分别为：

> - key 当前迭代到的键 
> - value 当前迭代到的值
> - obj 待迭代对象本身

```
var person = {
    name: '张三'
    hairColor: 'black'
    loves: ['吃', '睡', '老婆']
};

Box.Object.each(person, function(key, value, myself) {
    console.log(key + ":" + value);
    if (key === 'black') {
        return false; // 停止迭代
    }
});
```


**toQueryObjects** `( String name, Object/Array value, [Boolean recursive] ): Array`

将一个 `key/value` 对转换为一个对象数组，支持内部结构的转换，对构造查询字符串非常有用

> - name 待处理的键 `key`
> - value 待处理的值 `value`
> - recursive （可选）是否递归遍历对象

```
var objects = Box.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);

// objects此时等于:
[
    { name: 'hobbies', value: 'reading' },
    { name: 'hobbies', value: 'cooking' },
    { name: 'hobbies', value: 'swimming' },
];

var objects = Box.Object.toQueryObjects('dateOfBirth', {
    day: 3,
    month: 8,
    year: 1987,
    extra: {
        hour: 4
        minute: 30
    }
}, true); // 递归

// objects此时等于:
[
    { name: 'dateOfBirth[day]', value: 3 },
    { name: 'dateOfBirth[month]', value: 8 },
    { name: 'dateOfBirth[year]', value: 1987 },
    { name: 'dateOfBirth[extra][hour]', value: 4 },
    { name: 'dateOfBirth[extra][minute]', value: 30 },
];
```

**fromQueryString** `( String queryString, [Boolean recursive] ): Object`

将查询字符串转换成对象

> - queryString 要解码的查询字符串
> - recursive （可选） 是否递归的解码字符串

不递归:

```
Box.Object.fromQueryString("foo=1&bar=2"); // {foo: 1, bar: 2}
Box.Object.fromQueryString("foo=&bar=2");  // {foo: null, bar: 2}
Box.Object.fromQueryString("some%20price=%24300"); // {'some price': '$300'}
Box.Object.fromQueryString("colors=red&colors=green&colors=blue"); // {colors: ['red', 'green', 'blue']}
```
递归：

```
Box.Object.fromQueryString(
    "username=Jacky&"+
    "dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&"+
    "hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&"+
    "hobbies[3][0]=nested&hobbies[3][1]=stuff", 
    true
);

// 返回
{
    username: 'Jacky',
    dateOfBirth: {
        day: '1',
        month: '2',
        year: '1911'
    },
    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
}
```

**toQueryString** `( Object object, [Boolean recursive] ): String`

将一个对象转换成编码的查询字符串

> - object 要编码的对象
> - recursive （可选） 是否递归的翻译对象


不递归:

```
Box.Object.toQueryString({foo: 1, bar: 2}); // "foo=1&bar=2"
Box.Object.toQueryString({foo: null, bar: 2}); // "foo=&bar=2"
Box.Object.toQueryString({'some price': '$300'}); // "some%20price=%24300"
Box.Object.toQueryString({date: new Date(2011, 0, 1)}); // "date=%222011-01-01T00%3A00%3A00%22"
Box.Object.toQueryString({colors: ['red', 'green', 'blue']}); // "colors=red&colors=green&colors=blue"
```
递归：

```
Box.Object.toQueryString({
    username: 'Jacky',
    dateOfBirth: {
        day: 1,
        month: 2,
        year: 1911
    },
    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
}, true); 

// 返回如下字符串(换行和url-decoded是为了便于阅读的目的):
// username=Jacky
//    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
//    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
```


**merge** `( Object destination, Object... object ): Object`

递归的合并任意数量的对象，但是不引用他们或他们的子对象

```
var xx_company = {
    companyName: '合肥XX科技公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统'],
    isSuperCool: true,
    office: {
        size: 2000,
        location: '合肥高新区',
        isFun: true
    }
};

var yy_company = {
    companyName: '上海YY总公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统', '舆情监控系统'],
    office: {
        size: 40000,
        location: '上海'
    }
};

var merge_company = Box.Object.merge(extjs, newStuff);

// 此时merge_company等于
{
    companyName: '上海YY总公司',
    products: ['金融分析产品', '办公OA系统', '进销存系统', '舆情监控系统'],
    isSuperCool: true,
    office: {
        size: 40000,
        location: '上海',
        isFun: true
    }
}
```

**mergeIf** ``

**getKey** `( Object obj, Object value ): String`

根据指定的值，查找对象中第一个匹配到的值对应的 `key`，如果没有匹配的值，将返回null

> - obj 指定对象
> - value 要查找的值

```
var person = {
    name: '张三',
    loves: '吃零食'
};
var key = Box.Object.getKey(person, '吃零食'); // 'loves'
```

**getValues** `( Object object ): Array`

获取对象所有的值然后组成一个数组。

```
var values = Box.Object.getValues({
    name: '张三',
    loves: '吃零食'
}); 
// ['张三', '吃零食']
```

**getKeys** `( Object object ): Array`

获取对象所有的键然后组成一个数组。

```
var keys = Box.Object.getValues({
    name: '张三',
    loves: '吃零食'
}); 
// ['name', 'loves']
```

**getSize** `( Object object ): Number`

获取此对象的所有自有属性的数目

```
var size = Box.Object.getSize({
    name: '张三',
    loves: '吃零食'
}); 
// 2
```

**clone** `( Object obj ): Object`

深度克隆对象

```
var obj = {
	username: 'Jacky',
    dateOfBirth: {
        day: 1,
        month: 2,
        year: 1911
    },
    hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
};

var clone_obj = Box.Object.clone(obj);
obj.dateOfBirth.day = 2;
console.log(clone_obj.dateOfBirth.day);  // 1
```


**equals** `( Object obj1, Object obj2 ): Boolean`

判断2个对象是否相等

```
var obj1 = {
	foo: 1,
    bar: 2
};
var obj2 = {
	foo: 1,
    bar: 2
};

Box.Object.equals(obj1, obj2);
```
使用严格（===）的检验，源码如下：

```
equals: (function() {
    var check = function(o1, o2) {
        var key;
            
        for (key in o1) {
            if (o1.hasOwnProperty(key)) {
                if (o1[key] !== o2[key]) {
                    return false;
                }    
            }
        }    
        return true;
    };
            
    return function(object1, object2) {
                
        if (object1 === object2) {
            return true;
        } 

        if (object1 && object2) {
            return check(object1, object2) && check(object2, object1);  
        } else if (!object1 && !object2) {
            return object1 === object2;
        } else {
            return false;
        }
    };
})()
```

**isEmpty** `( Object obj ): Boolean`

判断对象是不是空对象，即对象中没有任何数据

```
var obj = {};
if (Box.Object.isEmpty(obj)) {
	...
}
```


**toStringBy** `( Object obj, String by1, String by2 ): String`

通过指定键值分割符和字段分隔符来格式化对象成字符串

> - obj 待格式化的对象
> - by1 键值分割符，默认值为" `:` "
> - by2 字段分隔符，默认值为" `|` "

```
var obj = {a: 1, b: 2, c: 3};
var str = Box.Object.toStringBy(obj, ":", "|"); // "a:1|b:2|c:3"
```


**chain** `( Object object ): Object`

创建一个具有指定原型且可选择性地包含指定属性的对象
