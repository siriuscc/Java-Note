[TOC]

### chrome 的一些小技巧

+ 管理已保存的秘密：chrome://settings/passwords

+ 版本：chrome://version/

+ List of Chrome URLs:chrome://chrome-urls/

####  显示全部网址

编辑的时候显示全部网址 http://、https:// 等网络协议以及www.、m.等常见前缀。修改chrome://flags/#omnibox-ui-hide-steady-state-url-scheme-and-subdomains  为Disabled
#### 加快开关标签速度

设置chrome://flags/#enable-fast-unload的值为Enabled来加快关闭标签页和窗口的速度，当然只是视觉上的加快，一些关闭必须的工作并不会减少，只是会在后台进行。

#### 密码自动生成

设置chrome://flags/#automatic-password-generation的值为Enabled

启用密码自动生成，启用后在密码框点击右键会出现生成密码菜单项。

#### 快速静音的小喇叭
设置chrome://flags/#enable-tab-audio-muting的值为Enabled来启用标签快速静音，启用后，正在播放声音的标签页上的小喇叭图标可以直接点击来切换静音状态了。

#### 设置搜索引擎的关键字
 chrome://settings/searchEngines
编辑，关键字，输入关键字如：bai,在url框输入bai，tab，就可以指定搜索引擎
![](.images/chrome.cmd/2019-03-02-21-17-21.png)


####  上下翻页

+ space：下一页
+ shift+space 上一页

#### 拖动搜索

将要搜索的keyword 拖拽到最右tab的右边，立即打开新的tab搜索之


#### 网页快照


![](.images/chrome.cmd/2019-03-02-21-24-12.png)


#### 保存现场到文件夹

当你打开一堆选项卡并想把这些页面都保存起来以供之后使用，按Ctrl+Shift+D。这样就可以将所有打开的选项卡保存到一个文件夹中，方便以后访问。要恢复它们，你只需右键单击书签内的文件夹，选择“打开所有新窗口”。

#### 主动重启

主动重启并恢复所有tab
Chrome://restart


#### 主动崩溃
chrome://kill/


#### 打开QUIC,高科技带来的加速


chrome://flags/#enable-quic，enable




参考：[超好用的27个谷歌Chrome浏览器使用技巧](http://www.techug.com/post/27-incredibly-useful-things-you-didnt-know-chrome-could-do.html)
