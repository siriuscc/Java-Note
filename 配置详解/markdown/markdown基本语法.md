

[TOC]


## 1. 文本部分

### 1.1 斜体和粗体，删除线

- 使用 * 和 ** 表示斜体和粗体。

	示例：这是 *斜体*，这是 **粗体**。

- 使用 ~~ 表示删除线。
	~~这是一段错误的文本。~~


### 1.2 分级标题

使用 === 表示一级标题，使用 --- 表示二级标题。

示例：

```markdown
这是一个一级标题
============================

这是一个二级标题
--------------------------------------------------
### 这是一个三级标题




# 一号标题
## 二号标题
### 三号标题

```

<br/>

你也可以选择在行首加井号表示不同级别的标题 (H1-H6)，例如：# H1, ## H2, ### H3，#### H4。





###　1.3 常用 Emoji & Font-Awesome



> alt+shift 选择多行

|   | a |  b  | c | d | e | f |
|--- | --:|--:|--:|--:|--:| --:|
| 1 |:book:	 	|:date:		|:e-mail:	|:chart_with_upwards_trend: |:star:|:rocket:
| 2 |:boom:     |:telephone_receiver:	|:cupid:	|:heart:	|:alarm_clock:  |:feet:
| 3 |:tada:		|:balloon:	|:sunny:|:wind_chime:|:hourglass:|:bulb:
| 4 |:zap:	    |:hammer:	|:mag_right:|:bug:	|:hibiscus:
| 5 |:cloud: 	|:ghost:|:partly_sunny:	|:mortar_board:|:house:	|




|    |    |   |   |   |   |    |
|:-:| :-:|:-:|:-:|:-:|:-:| :-:|
|:smile: |:smiley:|:heart_eyes:|:smirk:|:kissing_heart:|:flushed:|:stuck_out_tongue_winking_eye:
|:wink: |:unamused:|:sweat_smile:|:sweat:|:disappointed_relieved:|:cold_sweat:|:persevere:
|:sob:  |:joy:|:astonished:|:scream:|:rage:|:triumph:|:sleepy:
|:yum:|:mask:|:sunglasses:|:dizzy_face:|:+1:|:-1:|:punch:|
|:thumbsup:|:pray:|:triangular_flag_on_post:|:checkered_flag:|:anchor:|


[更多emoji查看](https://www.webpagefx.com/tools/emoji-cheat-sheet/)

### 1.4 引用和注脚

使用 [^keyword] 表示注脚。

#### 标注
- 上标：30^th^
- 下标：H~2~O
- 脚注：Content [^1]

[^1]:Hi 这里是一个注脚，会自动拉到最后面排版





#### 缩略：


*[HTML]: 超文本标记语言
*[W3C]:  World Wide Web Consortium
The HTML specification
is maintained by the W3C.

<br>
这里要有空格隔开中文

*[月]: yue4
*[辍]: chuo4
明 明 如 月，何 时 可 辍 

#### 标记
==marked==

### 1.5 外链接


这是去往 [百度](http://baidu.com) 的链接。
我的邮箱：<siriusing.cc@qq.com>


### 1.6 文字引用

使用 > 表示文字引用。

示例：

> 野火烧不尽，春风吹又生。


### 1.7 内容目录

在段落中填写 `[TOC]` 以显示全文内容的目录结构。

> [TOC]

### 2. 标签分类

在编辑区任意行的列首位置输入以下代码给文稿标签：

标签： 数学 英语 Markdown
Tags： 数学 英语 Markdown



## 2.0 常用布局
### 2.1 无序列表
使用 *，+，- 表示无序列表。

示例：
- 无序列表项 一
- 无序列表项 二
- 无序列表项 三

### 2.2 有序列表

使用数字和点表示有序列表。
示例：

1. 有序列表项 一
2. 有序列表项 二
3. 有序列表项 三



### 2.3 行内代码块

使用 \`代码` 表示行内代码块。

示例：

让我们聊聊 `html`。


    这是一个代码块，此行左侧有四个不可见的空格。

### 2.4 插入图像

使用 \!\[描述](图片链接地址) 插入图像。


![我的头像](https://www.zybuluo.com/static/img/my_head.jpg)



### 2.5 表格支持

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机     | \$1600 |   5     |
| 手机        |   \$12   |   12   |
| 管线        |    \$1    |  234  |
| > | ce	|	ce|





colspan `>` or `empty cell`:

| a | b |
|---|---|
| >		| 1 |
| 2		||





### 2.6 定义型列表

名词 1
:   定义 1（左侧有一个可见的冒号和四个不可见的空格）

代码块 2
:   这是代码块的定义（左侧有一个可见的冒号和四个不可见的空格）

    代码块（左侧有八个不可见的空格）

### 2.7 Html 标签

本站支持在 Markdown 语法中嵌套 Html 标签，譬如，你可以用 Html 写一个纵跨两行的表格：
设置colspan，rowspan
<table>
    <tr>
        <th rowspan="2">值班人员</th>
        <th>星期一</th>
        <th>星期二</th>
       <th>星期三</th>
    </tr>
    <tr>
        <td>李强</td>
        <td>张明</td>
        <td>王平</td>
    </tr>
</table>




### 2.8 待办事宜 Todo 列表

使用带有 [ ] 或 [x] （未完成或已完成）项的列表语法撰写一个待办事宜列表，并且支持子列表嵌套以及混用Markdown语法，例如：

对应显示如下待办事宜 Todo 列表：
        

- [ ] **七月旅行准备**
    - [ ] 准备邮轮上需要携带的物品
    - [ ] 浏览日本免税店的物品
    - [x] 蓝宝石公主号的[船票](https://www.baidu.com)
        - [ ] 2000人民币
        - [ ] 两个人






## 编程



### 支持直接运行代码



```python {cmd=true id="izdlk700"}
x = 1;
print x;
```



## 自定义css


ctrl+shift+p

Markdown Preview Enhanced:Customize CSS


```css


/* Please visit the URL below for more information: */
/*   https://shd101wyy.github.io/markdown-preview-enhanced/#/customize-css */ 

.markdown-preview.markdown-preview {
  // modify your style here
  // eg: background-color: blue;  

  p>code,li>code{
    background: #ffebeb;
    color: #c7254e;
    border-radius: 3px;
    border: 1px;
  }

  img{
    margin: 0 auto;
    display: block;
  }

  img::after{
    content:attr(alt);
  }

  span.s-img-alt{
    display: inline-block;
    margin: 0 auto;
    line-height: 1.7;
    font-size: 14px;
    color: #969696;
    border-bottom: 1px solid #d9d9d9;
    padding: 10px;
  }

}

```


## 导入文件



@import "你的文件"

就可以了，很简单对吧～ d(`･∀･)b

<!-- @import "your_file" --> 的写法也是支持的。


支持的文件类型
.jpeg(.jpg), .gif, .png, .apng, .svg, .bmp 文件将会直接被当作 markdown 图片被引用。
.csv 文件将会被转换成 markdown 表格。
.mermaid 将会被 mermaid 渲染。
.dot 文件将会被 viz.js (graphviz) 渲染。
.plantuml(.puml) 文件将会被 PlantUML 渲染。
.html 将会直接被引入。
.js 将会被引用为 <script src="你的 js 文件"></script>。
.less 和 .css 将会被引用为 style。目前 less 只支持本地文件。.css 文件将会被引用为 <link rel="stylesheet" href="你的 css 文件">。
.pdf 文件将会被 pdf2svg 转换为 svg 然后被引用。
markdown 将会被分析处理然后被引用。
其他所有的文件都将被视为代码块。



设置图片
```
@import "test.png" {width="300px" height="200px" title="图片的标题" alt="我的 alt"}
```

引用外部文件
```
@import "https://raw.githubusercontent.com/shd101wyy/markdown-preview-enhanced/master/LICENSE.md"
```

As（作为）代码块
```
@import "test.json" {as="vega-lite"}

```


引用文件作为 Code Chunk
```
@import "test.py" {cmd="python3"}
```