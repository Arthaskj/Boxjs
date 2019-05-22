# Box.Class (class)

---

在框架中负责类的创建。通过该类创建出的类都具有继承、混入、属性配置、静态等特性。 该类主要是由 `Box.ClassManager` 作为类的创建使用，不宜单独直接使用。如果您选择使用 `Box.Class`，您将失去命名空间功能。另外混淆和依赖加载等功能必须依赖 Box.ClassManager 来完成。

Box.Class 仅仅是作为工厂一样的创建类，它不是所有类的超类。 所有 Box 类都是继承于 `Box.Base` 类，请参阅 [Box.Base](#/api/Base)。



## 配置 ## (options)


**extend** `String`

通过 `Box.define` 定义的模块，实际上是定义一个对象。 通过设置 `extend` 属性，可以创建继承于 `extend` 指向对象的新对象（模块）。 默认 `extend` 的值为 `Box.Base`。

```
//构造人类
Box.define('Person', {
    say: function(text) { alert(text); }//具有说的方法
});
//构造开发人员
Box.define('Developer', {
    extend: 'Person',//继承人类
    say: function(text) { this.callParent(["print "+text]); }//继承了说的方法
});
```

> `extend` (继承的对象) 必须是一个 `Box.Base` 类或者它的子类，并且 `extend` 的值必须为继承对象的命名空间的字符串名称，比如上面例子的 `MyApp.ui.GridTable` 的命名空间为 "MyApp.ui.GridTable"



**mixins** `String/Array`

多态混入。`mixins` 属性可以将一个或多个模块的属性、方法混入到当前模块下。

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

**requires** `Array`

通过 `requires` 属性可以动态程序加载当前模块的依赖模块

```
Box.define('MyApp.ui.Widget', {
	requires: [
		'Box.util.Format',
		'Box.util.HashMap'
	],
	extend: 'Box.Base',
	constructor: function (config) {
		...
		this.setting();
	},
	setting: function () {
		this.map = new Box.util.HashMap("name");
		..
	}
});
```

依赖的模块最好为通过 `Box.define` 定义出的模块，如果依赖的对象为全局对象， 那么就不需要加入到依赖列表中。比如：

```
<script type="text/javascript" src="resource/js/jquery.min.js"></script>```

```
var top_config = {
	...	
};
Box.define('MyApp.ui.Widget', {
	// 不需要将已经在内存中的模块对象加入到依赖列表
	requires: [
		'$',
		'top_config'  
	]
});
```

> 当然在不确定模块是否加载过，那么你就需要将它加入到依赖中去。另外，通过 `requires` 动态加载的模块（未加载过）必须为通过 `Box.define` 定义的模块。


**statics** `Object`

如果要为类添加静态方法的话，可以通过 `statics` 属性来设置，比如：

```
Box.define('MyApp.ui.Widget', {
	statics: {
		manager: [],
		register: function (obj) {
			this.manager.push(obj);
		},
		getCount: function () {
			return this.manager.length;
		}
	},
	requires: [
		'Box.util.Format',
		'Box.util.HashMap'
	],
	extend: 'Box.Base',
	constructor: function (config) {
		// 通过 statics 方法获取到静态属性和方法
		var statics = this.statics();
		statics.register(this);
		...
	}
});

MyApp.ui.Widget.getCount();
```

在创建模块时，系统会自动为当前模块添加一个 `statics` 方法，提供给模块内部调用模块的静态属性和方法。 但是，实例化的模块不拥有静态属性和方法。

```
var widget = new MyApp.ui.Widget();
widget.getCount(); // 这是错误的， 
```


**singleton** `Boolean`

存在对象就存在单例， 可以通过 `singleton` 来设置模块是否有单例模式， 单例的模块不需要实例化就可以直接使用。

```
Box.define('MyApp.util.Format', {
	singleton: true,
	undef: function (value) {
		...
	},
	substr: function (str) {
		...
	},
	...
});

var str = "hello world!";
MyApp.util.Format.substr(str);
```


**config** `Object`

设置配置，提供 `getter`、`setter` 和监听变化等方法。

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
        ...
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
iPhone.getHasTouchScreen(); // true

iPhone.isExpensive; // false;
iPhone.setPrice(600);
iPhone.getPrice(); // 600
iPhone.isExpensive; // true;

iPhone.setOperatingSystem('AlienOS');
iPhone.getOperatingSystem(); // 'Other'
```


**statics** `Object`

获得类的静态属性对象。

```
Box.define("App.Cat", {
    statics: {
        totalCreated: 0,
        speciesName: "Cat"
    },
    constructor: function () {
        var statics = this.statics();
        alert(statics.speciesName);  // Cat
        statics.totalCreated++;
    }
});

var cat = new App.Cat();
alert(App.Cat.totalCreated); // 1
```


**alternateClassName** `String/String[]`

备用类名 这个类定义备用名称。例如：

```
Box.define('Developer', {
    alternateClassName: ['Coder', 'Hacker'],
    code: function(msg) {
        alert('Typing... ' + msg);
    }
});

var joe = Box.create('Developer');
joe.code('stackoverflow'); //栈溢出

var rms = Box.create('Hacker');//黑客
rms.code('hack hack');
```




## 方法

**new Box.Class** `( Object data, [Function callback] ): Box.Base` ^protected^

构造新的匿名类

> - data 类的对象属性
> - callback （可选）类创建完成时要执行的回调函数





**set[`Name`]** `( Object value ): void` ^private^

属性的 `setter` 方法，通过 `set` 方法设置属性值的时候，会调用该方法。（属性名的首字母需要大写）



**get[`Name`]** `(): Object` ^private^

属性的 `getter` 方法，通过 `get` 方法获取属性值的时候，会调用该方法。（属性名的首字母需要大写）



**update[`Name`]** `( Object new_val, Object old_val ): void` ^private^

属性值改变监听方法，当 `Name` 对应的属性值发生变化时，程序会自动触发 `"update" + Name` （属性名的首字母需要大写）的方法，方法有2个参数：

> - new_val：变化后的新值
> - old_val：发生本次变化之前的值

```
Box.define('App.ui.Comp', {
    extend: 'Box.Component',
    config: {
    	index: 0,
    },
    setup: function () {
        this.setIndex(1);
        console.log(this.count); // 1
    },
    updateIndex: function (value, old) {
        this.count = this.count || 0;
        this.count++;
    }
});
```