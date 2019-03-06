[TOC]


### 设置日志

Spring Boot提供了很多默认的日志配置，所以只要将spring-boot-starter-logging作为依赖加入到当前应用的classpath，则“开箱即用”。

日志级别从低到高分为TRACE < DEBUG < INFO < WARN < ERROR < FATAL，如果设置为WARN，则低于WARN的信息都不会输出。
Spring Boot中默认配置ERROR、WARN和INFO级别的日志输出到控制台。您还可以通过启动您的应用程序–debug标志来启用“调试”模式（开发的时候推荐开启）,以下两种方式皆可：

在运行命令后加入--debug标志，如：$ java -jar springTest.jar --debug
在application.properties中配置debug=true，该属性置为true的时候，核心Logger（包含嵌入式容器、hibernate、spring）会输出更多内容，但是你自己应用的日志并不会输出为DEBUG级别。

logback-spring.xml

```xml {.line-numbers}
<?xml version="1.0" encoding="UTF-8"?>
<configuration  scan="true" scanPeriod="60 seconds" debug="false">
    <contextName>logback</contextName>
    <property name="log.path" value="/Users/tengjun/Documents/log" />
    <!--输出到控制台-->
    <appender name="console" class="ch.qos.logback.core.ConsoleAppender">
       <!-- <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>-->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} %contextName [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!--输出到文件-->
    <appender name="file" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/logback.%d{yyyy-MM-dd}.log</fileNamePattern>
        </rollingPolicy>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} %contextName [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="info">
        <appender-ref ref="console" />
        <appender-ref ref="file" />
    </root>

    <!-- logback为java中的包 -->
    <logger name="com.dudu.controller"/>
    <!--logback.LogbackDemo：类的全路径 -->
    <logger name="com.dudu.controller.LearnController" level="WARN" additivity="false">
        <appender-ref ref="console"/>
    </logger>
</configuration>
```

### 目录结构
```
src
    main
        java
            cc.siriuscloud
                controller
                dao
                domain
                service
                Application
        resource
            static
            templates
            application.properties
            application.yml


默认资源映射：
classpath:/META-INF/resources
classpath:/resources
classpath:/static
classpath:/public

```            
#### 文件输出

logging.file，设置文件，可以是绝对路径，也可以是相对路径。如：logging.file=my.log
logging.path，设置目录，会在该目录下创建spring.log文件，并写入日志内容，如：logging.path=/var/log


#### 静态文件

默认情况下，Spring Boot从classpath下一个叫/static（/public，/resources或/META-INF/resources）的文件夹或从ServletContext根目录提供静态内容。这使用了Spring MVC的ResourceHttpRequestHandler，所以可以通过添加自己的WebMvcConfigurerAdapter并覆写addResourceHandlers方法来改变这个行为（加载静态文件）。



### 模板引擎
Spring Boot支持多种模版引擎包括：

FreeMarker
Groovy
Thymeleaf(官方推荐)
Mustache

默认的模板配置路径为：src/main/resources/templates

#### Thymeleaf 支持

引入依赖：
```xml {.line-numbers}
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

application.properties  配置
```properties {.line-numbers}

# THYMELEAF (ThymeleafAutoConfiguration)
#开启模板缓存（默认值：true）
spring.thymeleaf.cache=true 
#Check that the template exists before rendering it.
spring.thymeleaf.check-template=true 
#检查模板位置是否正确（默认值:true）
spring.thymeleaf.check-template-location=true
#Content-Type的值（默认值：text/html）
spring.thymeleaf.content-type=text/html
#开启MVC Thymeleaf视图解析（默认值：true）
spring.thymeleaf.enabled=true
#模板编码
spring.thymeleaf.encoding=UTF-8
#要被排除在解析之外的视图名称列表，用逗号分隔
spring.thymeleaf.excluded-view-names=
#要运用于模板之上的模板模式。另见StandardTemplate-ModeHandlers(默认值：HTML5)
spring.thymeleaf.mode=HTML5
#在构建URL时添加到视图名称前的前缀（默认值：classpath:/templates/）
spring.thymeleaf.prefix=classpath:/templates/
#在构建URL时添加到视图名称后的后缀（默认值：.html）
spring.thymeleaf.suffix=.html
#Thymeleaf模板解析器在解析器链中的顺序。默认情况下，它排第一位。顺序从1开始，只有在定义了额外的TemplateResolver Bean时才需要设置这个属性。
spring.thymeleaf.template-resolver-order=
#可解析的视图名称列表，用逗号分隔
spring.thymeleaf.view-names=
```




在templetes 下写文件











### Spring MVC自动配置

1. 引入ContentNegotiatingViewResolver和BeanNameViewResolver beans。
2. 对静态资源的支持，包括对WebJars的支持。
3. 自动注册Converter，GenericConverter，Formatter beans。
4. 对HttpMessageConverters的支持。
5. 自动注册MessageCodeResolver。
6. 对静态index.html的支持。
7. 对自定义Favicon的支持。









### tomcat
#### 内嵌Tomcat属性配置

关于Tomcat的偶有属性都在org.springframework.boot.autoconfigure.web.ServerProperties配置类中做了定义，我们只需在application.properties配置属性做配置即可。通用的Servlet容器配置都已”server”左右前缀，而Tomcat特有配置都以”server.tomcat”作为前缀。下面举一些常用的例子。

```
#配置程序端口，默认为8080
server.port= 8080
#用户绘画session过期时间，以秒为单位
server.session.timeout=
# 配置默认访问路径，默认为/
server.context-path=
```

```
# 配置Tomcat编码,默认为UTF-8
server.tomcat.uri-encoding=UTF-8
# 配置最大线程数
server.tomcat.max-threads=1000

```

#### 修改为 外部tomcat 启动



1. 修改pom

添加依赖：

```xml {.line-numbers}
<!-- tomcat支持 provided 编译测试有效，运行时无效，-->
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
    <scope>provided</scope>
</dependency>
```

在pom首部，项目打包方式设置为war


2. 应用入口类 继承SpringBootServletInitializer 并实现 configure方法

```java {.line-numbers}
	// 继承 SpringBootServletInitializer 并实现confugure 方法 ，支持外部tomcat 启动

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Sbdemo01Application.class);
	}

    public static void main(String[] args) {
        SpringApplication.run(Sbdemo01Application.class, args);
    }

```
3. 配置tomcat


解决tomcat 控制台日志乱码

把所有文件编码都改为utf-8
如果还乱码 ，在tomcat启动参数上加上-Dfile.encoding=UTF-8

On update action 设为 更新classes and resources
On frame deactivation 设为 更新...

部署项目到tomcat

#### 外部的Tomcat服务器部署war包

修改pom

入口类继承initializer 并实现confige... 方法

mvn clean package -D maven.test.skip=true
tomcat 部署





优先级由上往下降低


### 接管Spring Boot的Web配置

如果Spring Boot提供的Sping MVC不符合要求，则可以通过一个配置类（注解有@Configuration的类）加上@EnableWebMvc注解来实现完全自己控制的MVC配置。

既需要保留Spring Boot提供的便利，又需要增加自己的额外的配置：定义一个配置类并继承WebMvcConfigurerAdapter,无需使用@EnableWebMvc注解。

这里我们提到这个WebMvcConfigurerAdapter这个类，重写这个类中的方法可以让我们增加额外的配置，这里我们就介绍几个常用的。

自定义资源映射路径：

```java
@Configuration
public class MyWebMvcConfigurerAdapter extends WebMvcConfigurerAdapter {
    /**
     * 配置静态访问资源
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/my/**").addResourceLocations("classpath:/my/");
        super.addResourceHandlers(registry);
    }

    // 指向到外部文件
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/my/**").addResourceLocations("file:E:/my/");
        super.addResourceHandlers(registry);
    }
}

```


页面跳转addViewControllers ，不需要为了跳转页面而专门写controller


其实重写WebMvcConfigurerAdapter中的addViewControllers方法即可达到效果了

```java {.line-numbers}
/**
     * 以前要访问一个页面需要先创建个Controller控制类，再写方法跳转到页面
     * 在这里配置后就不需要那么麻烦了，直接访问http://localhost:8080/toLogin就跳转到login.jsp页面了
     * @param registry
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/toLogin").setViewName("login");
        super.addViewControllers(registry);
    }
```



### 拦截器

拦截器实现
```java {.line-numbers}
package com.dudu.interceptor;
public class MyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        boolean flag =true;
        User user=(User)request.getSession().getAttribute("user");
        if(null==user){
            response.sendRedirect("toLogin");
            flag = false;
        }else{
            flag = true;
        }
        return flag;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
```

重写WebMvcConfigurerAdapter中的addInterceptors方法如下：

```java {.line-numbers}
/**
* 拦截器
* @param registry
*/
@Override
public void addInterceptors(InterceptorRegistry registry) {
    // addPathPatterns 用于添加拦截规则
    // excludePathPatterns 用户排除拦截
    registry.addInterceptor(new MyInterceptor()).addPathPatterns("/**").excludePathPatterns("/toLogin","/login");
    super.addInterceptors(registry);
}
```






### controller 

#### @Consumes and @Produces注解：
consumes 指定请求 Content-Type 
produces 指定响应 Content-Type 

```java
@Consumes({ MediaType.APPLICATION_JSON, MediaType.TEXT_XML })
@Produces({ ContentType.APPLICATION_JSON_UTF_8, ContentType.TEXT_XML_UTF_8 })
```

#### controller 路径参数

```java
@RequestMapping(value="/user",method=RequestMethod.GET)
public User getUser(@PathVariable Long user){
    /*..*/
}
```