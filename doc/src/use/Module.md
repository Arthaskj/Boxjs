## 模块定义 ##


Box.ClassManager 是一个管理类对象的单例。 她提供了一系列方法让开发者可以方便的构建出一套完善的基于模块化开发的应用，一般不直接访问它，而是通过以下这些方法（方便记忆）：

- Box.define
- Box.create
- Box.getClass
- Box.getClassName


**使用说明** 

基本用法：

```
Box.define(className, properties);
```

在 Box.ClassManager 中，使用 Box.Class 做为工厂来生成新类。所以生成的类都具有继承、混入、属性配置、静态等特性。

**继承**

```
//开发人员
Box.define('Developer', {
     extend: 'Person',// 人类

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

**混**

```
Box.define('CanPlayGuitar', {
     playGuitar: function() {
        alert("F#...G...D...A");
     }
});
//写歌词
Box.define('CanComposeSongs', {
     composeSongs: function() { ... }
});
//唱歌
Box.define('CanSing', {
     sing: function() {
         alert("你知道不知道 知不知道 我等到花儿也谢了...")
     }
});
//音乐家
Box.define('Musician', {
     extend: 'Person',//人类

     mixins: {
         canPlayGuitar: 'CanPlayGuitar',//弹吉他
         canComposeSongs: 'CanComposeSongs',//写歌词
         canSing: 'CanSing'//唱歌
     }
})
//很酷的人
Box.define('CoolPerson', {
     extend: 'Person',//人类
     mixins: {
         canPlayGuitar: 'CanPlayGuitar',//弹吉他
         canSing: 'CanSing'//唱歌
     },
     sing: function() {
         alert("啊哈....");
         this.mixins.canSing.sing.call(this);
         alert("[在同一时间玩吉他...]");
         this.playGuitar();
     }
});

var me = new CoolPerson("Jacky");//杰克

me.sing(); // alert("啊哈...");
           // alert("你知不知道 知不知道 我等到花儿也谢了...");
           // alert("[在同一时间玩吉他...]");
           // alert("F#...G...D...A");
```


**配置**

```
//智能手机
Box.define('SmartPhone', {
     config: {
         hasTouchScreen: false,//触摸屏
         operatingSystem: 'Other',//操作系统
         price: 500
     },
     isExpensive: false,//价格昂贵
     constructor: function(config) {
         this.initConfig(config);
     },
     applyPrice: function(price) {
         this.isExpensive = (price > 500);
         return price;
     },
     //应用操作系统
     applyOperatingSystem: function(operatingSystem) {
         if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {//苹果iOS/安卓/黑莓
             return 'Other';
         }
         return operatingSystem;
     }
});
//iPhone手机
var iPhone = new SmartPhone({
     hasTouchScreen: true,//智能手机
     operatingSystem: 'iOS'//操作系统
});

iPhone.getPrice(); // 500;
iPhone.getOperatingSystem(); // 'iOS'
iPhone.getHasTouchScreen(); // true;

iPhone.isExpensive; // false;
iPhone.setPrice(600);
iPhone.getPrice(); // 600
iPhone.isExpensive; // true;

iPhone.setOperatingSystem('AlienOS');
iPhone.getOperatingSystem(); // 'Other' 其他
```


**静态**

```
Box.define('Computer', {
     statics: {
         factory: function(brand) {
            // 'this' 在静态方法中指向类本身
             return new this(brand);
         }
     },
     constructor: function() { ... }
});
//戴尔电脑
var dellComputer = Computer.factory('Dell');
```

**方法**


**define** `( String namespace, Object properties, [Function callback])` 

通过 `Box.define` 可以定义一个模块，它提供了三个参数： 

> - namespace 模块的命名空间，也是模块的名字
> - properties 模块的属性，方法对象
> - callback [可选] 模块定义完成后的回调函数

```
Box.define('MyApp.ui.GridTable', {
	...
}, function () {
	alert('MyApp.ui.GridTable defined');
});
```

**create** `( [String name], [Object... args] )`

通过类的全名、别名或者备用名来实例化对象。如果被检测到要实例化的类尚未加载， 它会尝试通过同步加载该类。

```
Box.define('Box.window.Window', {
    extend: 'Box.Component',
    alternateClassName: 'Box.Window',
    alias: 'widget.window',
    ...
});

// alias 别名
var window = Box.create('widget.window', {
    width: 600,
    height: 800,
    ...
});

// alternate name 备用名
var window = Box.create('Box.Window', {
    width: 600,
    height: 800,
    ...
});

// full class name 完整的类名
var window = Box.create('Box.window.Window', {
    width: 600,
    height: 800,
    ...
});

//单个对象与xclass属性:
var window = Box.create({
    xclass: 'Box.window.Window', // 任何有效的'name' (以上)
    width: 600,
    height: 800,
    ...
});
```


**getClass** `( Object object ): Box.Class`

获取所提供的对象类。如果它不是任意 `Box.define` 创建的类的一个实例，则返回null。

```
var component = new Box.Component();
Box.getClass(component); // returns Box.Component
```


**getClassName** `( Object object ): Box.Class`

根据其引用的类或它的实例获取名称

```
Box.getClassName(Box.Component); // returns "Box.Component"
```


