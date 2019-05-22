## 继承 ##

```
//开发人员
Box.define('Developer', {
     extend: 'Person',// 继承自人类这个类

     constructor: function(name, isGeek) {
         this.isGeek = isGeek;

         // 适用于从父类的原型方法
         this.callParent([name]);
     },

     code: function(language) {
         alert("I'm coding in: " + language);

         this.eat("Bugs");

         return this;
     }
});

var jacky = new Developer("Jacky", true);//杰克
jacky.code("JavaScript"); // alert("我编写的: JavaScript");
                          // alert("我消灭: Bugs");
```
