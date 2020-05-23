1. 配置tomcat:
	+ 两个tomcat 准备好
	+ 修改项目路径为同一个:apache-tomcat1\conf\Catalina\localhost\ROOT.xml
	+ 两个tonmcat的端口错开，有三个
	+ 分别启动访问



```xml
	<?xml version="1.0" encoding="utf-8"?>
	<Context docBase="E:\tomcat_nginx\myApp"/>
```

```xml
	<Server port="8205" shutdown="SHUTDOWN">
	     <Connector URIEncoding="UTF-8" connectionTimeout="20000" port="8280" protocol="HTTP/1.1" redirectPort="8443"/>
    <Connector executor="tomcatThreadPool"
               port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />

    <Connector port="8209" protocol="AJP/1.3" redirectPort="8443"/>
```
2. 配置nginx
	+ conf

```
	upstream server_lb{
		server 127.0.0.1:8180;
		server 127.0.0.1:8280;
	}
	server{
		listen 	80;
		server_name 	localhost;
	    location / {
            root   html;
            proxy_pass http://server_lb;
            index  index.jsp index.html index.htm;
        }
	}

```

当出现403跨域错误的时候 No 'Access-Control-Allow-Origin' header is present on the requested resource，需要给Nginx服务器配置响应的header参数：

```
location / {  
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
  add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
} 
```


1. Access-Control-Allow-Origin

服务器默认是不被允许跨域的。给Nginx服务器配置Access-Control-Allow-Origin *后，表示服务器可以接受所有的请求源（Origin）,即接受所有跨域的请求。

2. Access-Control-Allow-Headers 是为了防止出现以下错误：

Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

这个错误表示当前请求Content-Type的值不被支持。其实是我们发起了"application/json"的类型请求导致的。这里涉及到一个概念：预检请求（preflight request）,请看下面"预检请求"的介绍。


3. Access-Control-Allow-Methods 是为了防止出现以下错误：
Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

发送"预检请求"时，需要用到方法 OPTIONS ,所以服务器需要允许该方法。

三、 预检请求（preflight request）
其实上面的配置涉及到了一个W3C标准：CROS,全称是跨域资源共享 (Cross-origin resource sharing)，它的提出就是为了解决跨域请求的。

> 跨域资源共享(CORS)标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 Cookies 和 HTTP 认证相关数据）。


其实Content-Type字段的类型为application/json的请求就是上面所说的搭配某些 MIME 类型的 POST 请求,CORS规定，Content-Type不属于以下MIME类型的，都属于预检请求：

```
application/x-www-form-urlencoded
multipart/form-data
text/plain
```

所以 application/json的请求 会在正式通信之前，增加一次"预检"请求，这次"预检"请求会带上头部信息 Access-Control-Request-Headers: Content-Type：
```
OPTIONS /api/test HTTP/1.1
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
... 省略了一些
```

服务器回应时，返回的头部信息如果不包含Access-Control-Request-Headers: Content-Type则表示不接受非默认的的Content-Type。即出现以下错误：

Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

参考[Nginx配置跨域请求 Access-Control-Allow-Origin *](http://blog.51cto.com/13523664/2060430)


重启
nginx -s reload


master会重新加载配置文件，通知老的worker 不再接收新请求，处理完当前任务后自动结束进程。 新建新的一批worker进程。



参考[Nginx及其相关配置详解（一）](http://www.178linux.com/78370)




