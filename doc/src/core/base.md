# Box.Base (class)

---

Box 中的所有类都从 `Box.Base` 继承而来。 所有的类都继承了该类的所有原型和静态成员。

## 属性

**self** `Box.Class`

当前类的本身。注意它和 statics 方法不一样，详细请留意 statics 方法的实例。

## 方法

**statics** `(): Box.Class` ^protected^

获得类的静态属性对象。

```
Box.define('My.Cat', {
    statics: {
        totalCreated: 0,
        speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
    },

    constructor: function() {
        var statics = this.statics();
        alert(statics.speciesName);         // 总是等于'Cat'，无论'this'是什么
                                            // 相当于：My.Cat.speciesName
        alert(this.self.speciesName);       // 依赖 'this'
        statics.totalCreated++;
    },

    clone: function() {
        var cloned = new this.self;
        cloned.groupName = this.statics().speciesName;
        return cloned;
    }
});

Box.define('My.SnowLeopard', {
    extend: 'My.Cat',
    statics: {
        speciesName: 'Snow Leopard'
    },
    constructor: function() {
        this.callParent();
    }
});

var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'
var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'

var clone = snowLeopard.clone();
alert(Box.getClassName(clone));         // alerts 'My.SnowLeopard'
alert(clone.groupName);                 // alerts 'Cat'

alert(My.Cat.totalCreated);             // alerts 3
```



**callParent** `( Array/Arguments args )` ^protected^

调用父类中的当前方法，参数必须为一个数组类型，数组中的元素则是父类方法接受的参数。

```
Ext.define('My.Base', {
    constructor: function (x) {
        this.x = x;
    },
    statics: {
        method: function (x) {
            return x;
        }
    }
});

Ext.define('My.Derived', {
    extend: 'My.Base',
    constructor: function () {
        this.callParent([21]);
    }
});

var obj = new My.Derived();
alert(obj.x);  // alerts 21
```

如果当使用 `override` 特性来覆盖 My.Derived 类的方法:

```
Box.define('My.DerivedOverride', {
    override: 'My.Derived',
    constructor: function (x) {
        this.callParent([x*2]); // 调用原来的My.Derived构造
    }
});

var obj = new My.Derived();
alert(obj.x);  // 现在提示 42
```

同样 callParent 也可以用于静态方法（statics）中:

```
Box.define('My.Derived2', {
    extend: 'My.Base',
    statics: {
        method: function (x) {
            return this.callParent([x*2]); // 调用 My.Base.method
        }
    }
});

alert(My.Base.method(10);     // alerts 10
alert(My.Derived2.method(10); // alerts 20
```

当使用 `override` 来重写静态方法时

```
Box.define('My.Derived2Override', {
    override: 'My.Derived2',
    statics: {
        method: function (x) {
            return this.callParent([x*2]); // 调用 My.Derived2.method
        }
    }
});

alert(My.Derived2.method(10); // 现在提示 40
```


**destroy** `()` ^protected^

类的销毁方法。在您自定义类中，应该重写该方法，以适应当前类的销毁需求


## 静态方法 ## (methods)


**create** `( Object ... )` ^static^

创建这个类的新实例。

```
Box.define('My.cool.Class', {
    ...
});

My.cool.Class.create({
    someConfig: true
});
```

**addStatics** `( Object members ): Box.Base` ^static^

添加或者重写这个类的静态属性。

```
Box.define('My.cool.Class', {
    ...
});

My.cool.Class.addStatics({
    someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
    method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
    method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
});
```

**addMembers** `( Object members ): Box.Base` ^static^

将方法或者属性添加到这个类的原型中。

```
Box.define('My.awesome.Cat', {
    constructor: function() {
        ...
    }
});

 My.awesome.Cat.implement({
     meow: function() {
        alert('Meowww...');
     }
 });

 var kitty = new My.awesome.Cat;
 kitty.meow();
```

**borrow** `( Box.Base fromClass, Array/String members ): Box.Base` ^private^ ^static^

借用指定类中的指定成员到当前类中。

```
Box.define('Bank', {
    money: '$$$',
    printMoney: function() {
        alert('$$$$$$$');
    }
});

Box.define('Thief', {
    ...
});

Thief.borrow(Bank, ['money', 'printMoney']);

var steve = new Thief();
alert(steve.money); // alerts '$$$'
steve.printMoney(); // alerts '$$$$$$$'
```





**override** `( Object members ): Box.Base`

重写这个类的成员。通过callParent重写的方法可以调用。

```
Box.define('My.CatOverride', {
    override: 'My.Cat',
    constructor: function() {
        alert("I'm going to be a cat!");
        this.callParent(arguments);
        alert("Meeeeoooowwww");
    }
});
```

**mixin** `( String name, Box.Base mixinClass )` ^private^ ^static^

将指定的类的方法和变量混入到当前类中。


**getName** `` ^static^

以字符串格式，获取当前类的名称

```
Box.define('My.cool.Class', {
    constructor: function() {
        alert(this.self.getName()); // alerts 'My.cool.Class'
    }
});

My.cool.Class.getName(); // 'My.cool.Class'
```

**createAlias** `( String/Object alias, [String origin] )` ^static^

创建现有的原型方法的别名。例如：

```
Box.define('My.cool.Class', {
    method1: function() { ... },
    method2: function() { ... }
});

var test = new My.cool.Class();

My.cool.Class.createAlias({
    method3: 'method1',
    method4: 'method2'
});

test.method3(); // test.method1()

My.cool.Class.createAlias('method5', 'method3');

test.method5(); // test.method3() -> test.method1()
```