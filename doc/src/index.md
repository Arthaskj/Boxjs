# 前后端分离


```
{
    "name": "",
    "author": "",
    "copyright":"",
    "keywords":"",
    "description":""
}
```

##### 什么是前后端分离

在业界大家一致的认同前后端分离的经典例子就是SPA（single page application），所有用到的展现数据都是后端通过异步接口（ajax或者jsonp）的方式来提供,q前端值负责展现。

* web服务中，SPA类占的比例很少，很多场景下还是有同步/同步+异步混合的模式（后端动态标签），SPA不能作为一种通用的解决方案。
* 现阶段的SPA开发模式，接口通常是按照展现逻辑来提供的，有时候为了提高效率，后端会帮前端处理一些展现的逻辑，这就意味这后端还是涉足了view层的工作，不是真正的前后端分离。

SPA式的前后端分离，是从物理层做区分（认为只要是客户端的就是客户端，服务器端就是后端），这种分享已经无法满足我们前后端分离的需求，我们认为从职责上划分才能满足目前我们的使用场景：

* 前端：负责view和controller层
* 后端：只负责model层，业务处理和数据处理等。


##### 为什么要前后端分离

1. 现有的几种开发模式的使用场景

 	后端为主的MVC，做一些同步展现的业务效率很高，但是遇到同步异步结合的页面，与后端开发沟通起来就会比较麻烦。
	ajax为主的SPA形式的开发模式，比较适合APP类型的场景，但是只适合做APP。

2. 前后端职责不清

	在业务逻辑负责的系统中，我们最怕维护前后端混杂在一起的代码，因为没有约束，MVC每一层的代码都可能出现别的层代码，日积月累，完全没有维护性可言。
虽然前后端分离没有办法完全解决这个问题，单是可以大大缓解。因为从物理层次上保证了你不可能这么做。

3. 开发效率问题
	
    由于前后端职责的不清楚， 导致前端开发人员不能专心于业务逻辑层的开发。


##### 怎么做前后端分离

前段负责view和controller，后端负责model、业务处理和数据处理。

![mvc icon](http://gtms01.alicdn.com/tps/i1/T1qg9oFu4iXXXk_Dc5-555-263.png)

###### 1. 基于nodejs全栈式开发
如果想实现上图的分层，就必然需要一种web服务帮我们实现以前后端做的事情。

![nodejs icon](http://gtms03.alicdn.com/tps/i3/T1xW8OFrXkXXXK71TW-590-611.png)


###### 2. 为什么要增加一层NodeJs

现阶段我们主要以后端MVC的模式进行开发，这种模式严重阻碍了前端开发效率，也让后端不能专注于业务开发。
解决方案是让前端能控制Controller层，但是如果在现有技术体系下很难做到，因为不可能让所有前端都学java、.net，安装后端的开发环境，写VM（View-Moduel）。NodeJS就能很好的解决这个问题，前端开发人员无需学习一门新的语言，就能做到以前开发帮我们做的事情，一切都显得那么自然。

###### 3. 加一层后的性能问题

分层就涉及每层之间的通讯，肯定会有一定的性能损耗。但是合理的分层能让职责清晰、也方便协作，会大大提高开发效率。分层带来的损失，一定能在其他方面的收益弥补回来。
另外，一旦决定分层，我们可以通过优化通讯方式、通讯协议，尽可能把损耗降到最低。


## 欢迎使用 MarkdownPad 2 ##

**MarkdownPad** 是 Windows 平台上一个功能完善的 Markdown 编辑器。

### 专为 Markdown 打造 ###

提供了语法高亮和方便的快捷键功能，给您最好的 Markdown 编写体验。

来试一下：

- **粗体** (`Ctrl+B`) and *斜体* (`Ctrl+I`)
- 引用 (`Ctrl+Q`)
- 代码块 (`Ctrl+K`)
- 标题 1, 2, 3 (`Ctrl+1`, `Ctrl+2`, `Ctrl+3`)
- 列表 (`Ctrl+U` and `Ctrl+Shift+O`)

### 实时预览，所见即所得 ###

无需猜测您的 [语法](#/123) 是否正确；每当您敲击键盘，实时预览功能都会立刻准确呈现出文档的显示效果。

### 自由定制 ###
 
100% 可自定义的字体、配色、布局和样式，让您可以将 MarkdownPad 配置的得心应手。

### 为高级用户而设计的稳定的 Markdown 编辑器 ###
 
 MarkdownPad 支持多种 Markdown 解析引擎，包括 标准 Markdown 、 Markdown 扩展 (包括表格支持) 以及 GitHub 风格 Markdown 。
 
 有了标签式多文档界面、PDF 导出、内置的图片上传工具、会话管理、拼写检查、自动保存、语法高亮以及内置的 CSS 管理器，您可以随心所欲地使用 MarkdownPad。


> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.