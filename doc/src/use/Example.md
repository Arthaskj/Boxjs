## 一个Box的实例 ##


> 首先需要在index页面里引入box.debug.js文件
```
<script src="./resource/js/box.debug.js"></script>   
```

> 如下为一个定义为Demo.app的封装组件，主要用来定制路由规则
> Demo.app名称为自己定义，在index页面中创建实例会引用
```
Box.define('Demo.app', {
    requires: [],
   
    extend: 'Box.app.Viewport',  //继承自Viewport，实现路由机制

    target: 'body',

    //路由规则，匹配所有#路由，由parseRoute方法来调用相关页面的js组件
     
    routes: {
        '*path': 'parseRoute', // 匹配路由为所有url，即所有url发生变化时，都会调用parseRoute方法
        // 'user': 'user',
        // 'payItems': 'payItems',  //执行后面的方法
        // 'payItemsAuth': 'payItemsAuth',
    },

    delegates: {
        // 'click {.exitSystem}': '_exitSystem',  //事件代理，给exitSystem类增加点击事件_exitSystem
    },

    setup: function () {
        Box.Notify.warning('ddddd');
    },  //执行的方法，调用Notify的警告函数，弹出ddddd

    /*
     * 解析路由，将路由改为js组件名，再进行调用
     */
    parseRoute: function () {
        if (!arguments || arguments.length === 0 || arguments[0] == null) {

            location.href = "#user";
            return;
        }

    }
});

```
> 创建一个Box实例，如下，此实例引入了Demo.app js文件，继承了路由规则，并执行setup里的方法

```
Box.app.Application.create({
        name: 'Demo',     //需要引入的文件的名称的前缀
        baseFolder: './app',  //需要引入文件的存放路径
        paths: {},
        resources: [], //需要的资源
        launch: 'Demo.app'   //需要引入的文件名称
    });
```


