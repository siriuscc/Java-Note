[TOC]


需求：
由于现在web 上有好几个项目在跑
服务器上目前有apache：80端口
tomcat：8080 端口

需要一个




tomcat server.xml 的配置详解


#`<Server>` 元素
+ 代表整个容器
+ 由org.apache.catalina.Server 接口定义
+ 顶级元素，不能作为子元素

实例：<Server port="8005" shutdown="SHUTDOWN" debug="0">

+ 省略属性className，className指定实现org.apache.catalina.Server接口的类.默认值为org.apache.catalina.core.StandardServer
+ port指定Tomcat监听shutdown命令的端口.终止服务器运行时,必须在Tomcat服务器所在的机器上发出shutdown命令.该属性是必须的.
+ shutdown指定终止Tomcat服务器运行时,发给Tomcat服务器的shutdown监听端口的字符串.该属性必须设置



## `<Service>`元素

+ 由org.apache.catalina.Service 接口定义
+ 子元素：
	+ 一个<Engine>
	+ 一个或多个<Connector>, <Connector> 共用一个引擎
实例：<Service name="Catalina">

1. className： 指定实现org.apahce.catalina.Service接口的类.默认为org.apahce.catalina.core.StandardService
2. name：定义Service的名字

### `<Engine>`元素

+ 由org.apahce.catalina.Engine接口定义.
+ 每个Service元素只能有一个Engine元素.
+ 元素处理在同一个<Service>中所有<Connector>元素接收到的客户请求.

实例：<Engine name="Catalina" defaultHost="localhost" debug="0">

1. className：指定实现Engine接口的类,默认值：StandardEngine
2. defaultHost：指定处理客户的默认主机名,在<Engine>中的<Host>子元素中必须定义这一主机
3. name定义Engine的名字
4. 子元素：在<Engine>可以包含如下元素
	+ \<Logger>
	+ \<Realm>
	+ \<Value>
	+ \<Host>


#### `<Host>`元素

+ 由Host接口定义.
+ 一个Engine元素可以包含多个<Host>元素.
+ 每个<Host>的元素定义了一个虚拟主机.它包含了一个或多个Web应用.

实例：<Host name="localhost" debug="0" appBase="webapps" unpackWARs="true" autoDeploy="true">


+ className：实现Host接口的类.默认值为StandardHost
+ appBase：虚拟主机的目录,绝对目录或相对于<CATALINA_HOME>的相对目录.默认为<CATALINA_HOME>/webapps
+ autoDeploy：是否自动发布
+ unpackWARs：是否自动解包
	+ true:	展开war为目录再运行
	+ false: 直接运行为WAR文件
+ alias: 指定主机别名,可以指定多个别名
+ deployOnStartup
	+ true:服务器启动时自动发布appBase目录下所有的Web应用.
	+ 如果Web应用中的server.xml没有相应的<Context>元素,将采用Tomcat默认的Context

+ name: 虚拟主机的名字,在<Host>元素中可以包含如下子元素		
	+ Logger
	+ Realm
	+ Value
	+ Context



#####`<Context>`元素

+ 由`Context`接口定义.
+ 是使用最频繁的元素.
+ 一个`<Host>`可以包含多个`<Context>`元素.
+ 一个`<Context>`元素代表了运行在虚拟主机上的一个Web应用.
+ servlet容器为第一个web应用创建一个ServletContext对象.


实例：`<Context path="/sample" docBase="sample" debug="0" reloadbale="true">`


1. className:实现Context的类,默认为StandardContext类
2. path指定访问Web应用的URL入口,注意/myweb,而不是myweb
3. reloadable
	+ true：Tomcat服务器在运行状态下会监视在WEB-INF/classes和Web-INF/lib目录CLASS文件的改变.监视到有class文件被更新,服务器自动重新加载Web应用
4. cookies 通过Cookies来支持Session,默认值为true
5. useNaming 是否支持JNDI,默认值为了true,
6. 在<Context>元素中可以包含如下元素

```
<Logger>, <Realm>, <Resource>, <ResourceParams>

```

#### `<Connector>`元素

+ 由Connector接口定义.
+ `<Connector>`元素代表与客户程序实际交互的构建
+ 它负责接收客户请求,以及向客户返回响应结果


实例：
```
<Connector port="8080" maxThread="50" minSpareThreads="25" maxSpareThread="75" enableLookups="false" redirectPort="8443" acceptCount="100" debug="0" connectionTimeout="20000" disableUploadTimeout="true" />
<Connection port="8009" enableLookups="false" redirectPort="8443" debug="0" protocol="AJP/1.3" />
```
+ 第一个Connector元素定义了一个HTTP Connector,它通过8080端口接收HTTP请求;
+ 第二个Connector元素定义了一个JD Connector,它通过8009端口接收由其它服务器转发过来的请求.




Connector元素共用属性:

1. `className`: 实现Connector接口的类
2. `enableLookups`:
	+ true: 表示支持域名解析,可以把IP地址解析为主机名.
	+ WEB应用中调用request. getRemoteHost方法返回客户机主机名.默认值为true

3. `redirectPort`:转发端口.如果当前端口只支持non-SSL请求,在需要安全通信的场景,将把客户请求转发至SSL的redirectPort端口
	
HttpConnector元素的属性

1. `className`实现`Connector`的类
2. port设定Tcp/IP端口,默认值为8080
3. address如果服务器有二个以上ip地址,此属性可以设定端口监听的ip地址.默认情况下,端口会监听服务器上所有的ip地址
4. bufferSize设定由端口创建的输入流的缓存大小.默认值为2048byte
5. protocol Http协议,默认值为HTTP/1.1
6. maxThreads 监听端口的线程的最大数目,这个值也决定了服务器可以同时响应客户请求的最大数目.默认值为200
7. acceptCount设定在监听端口队列的最大客户请求数量,默认值为10.如果队列已满,客户必须等待.
8. connectionTimeout定义建立客户连接超时的时间.如果为-1,表示不限制建立客户连接的时间

JkConnector的属性:

1. `className` :实现Connector的类
2. `port`:设定AJP端口号
3. `protocol`:必须设定为AJP/1.3





# Tomcat管理


## 1. 配置用户

conf/tomcat-users.xml中配置用户

```xml
<user name="username" password="passwd" roles="standard,manager"/>
<!-- 必须是/> 结尾 -->
```
重启后再
http://localhost:8080/manager/



参考：


[tomcat配置详解](https://blog.csdn.net/shanpeng238/article/details/2491501)


## 2. 应用列表

http://localhost:8080/manager/list


##　3. 重新装载应用程序
http://localhost:8080/manager/reload?path=/examples


## 4. 显示session信息

在浏览器中输入http://localhost:8080/manager/sessions?path=/examples



## 5. 启动和关闭应用程序
在浏览器中输入
```
http://localhost:8080/manager/start?path=/examples
http://localhost:8080/manager/stop?path=/examples
```

分别启动和关闭examples应用程序。


6：部署及撤销部署
WAR有两种组织方式，一种是按一定的目录结构组织文件，一种是一个后缀为WAR的压缩包，因此它的部署方式也有两种：
1. 直接上传目录
```
http://localhost:8080/manager/install?path=/examples&war=file:/c:/examples

```
2. 上传war包
```
http://localhost:8080/manager/install?path=/examples&war=jar:file:/c:/examples.war!/
```
将按压缩包组织的WAR部署，注意此url后半部分一定要有!/号。

3. 撤销刚才部署的应用程序:
```
http://localhost:8080/manager/remove?path=/examples
```



在conf/server.xml 中配置多host

```xml
	<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />
    </Host>

    <Host name="xiaoy.siriuscloud.cc" unpackWARs="true" autoDeploy="true">
        <Context path="" docBase="/var/lib/tomcat8/webapps/xiaoY" reloadable="true"/>
    </Host>

	
```

注:这里path 会影响到${pageContext.request.contextPath}，如果是根目录，应该写""，而不是"/"



