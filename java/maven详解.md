


[TOC]




### maven 范围

依赖范围就是用来控制依赖和三种classpath(编译classpath，测试classpath、运行classpath)的关系，Maven有如下几种依赖范围：

+ compile:编译依赖范围。如果没有指定，就会默认使用该依赖范围。使用此依赖范围的Maven依赖，对于编译、测试、运行三种classpath都有效。典型的例子是spring-code,在编译、测试和运行的时候都需要使用该依赖。
+ test: 测试依赖范围。使用次依赖范围的Maven依赖，只对于测试classpath有效，在编译主代码或者运行项目的使用时将无法使用此依赖。典型的例子是Jnuit,它只有在编译测试代码及运行测试的时候才需要。
+ provided:已提供依赖范围。使用此依赖范围的Maven依赖，对于编译和测试classpath有效，但在运行时候无效。典型的例子是servlet-api,编译和测试项目的时候需要该依赖，但在运行项目的时候，由于容器以及提供，就不需要Maven重复地引入一遍。



基本配置好了就可以启动项目，通过http://localhost:8080/learn 访问，我使用的SpringBoot是1.5.2版本，jdk1.8,以前介绍过，运行项目有三种方式，这里我都做过了一次测试，发现在maven中jasper依赖有加provided和注释掉该依赖范围运行的效果不大一样，具体对比如下：

有添加provided的情况：

右键运行启动类，访问页面报404错误
使用spring-boot:run运行正常
打包成jar，通过 java -jar demo-0.0.1-SNAPSHOT.jar 运行报错
打包成war，通过 java -jar demo-0.0.1-SNAPSHOT.war 运行正常
把provided 注释掉的情况

右键运行启动类，访问页面正常
spring-boot:run运行 访问页面正常
打包成jar，通过 java -jar demo-0.0.1-SNAPSHOT.jar 运行报错
打包成war，通过 java -jar demo-0.0.1-SNAPSHOT.war 运行正常
我测试了好几次都是这样，就是有加provided的时候，右键运行启动类访问页面的时候，提示404错误。
其他3种情况都一样， jar运行也报404，spring-boot:run以及war运行都可以


打包成jar 默认补拷贝jsp文件，所以运行找不打jsp
打包成war，能找到jsp


### maven dependencies 和 dependencyManagement 区别：


dependencies 默认全部继承，即使在子项目中不写该依赖项，那么子项目仍然会从父项目中继承该依赖项

dependencyManagement里只是声明依赖，并不实现引入。子项目需要显示的声明需要用的依赖。如果不在子项目中声明依赖，是不会从父项目中继承下来的；只有在子项目中写了该依赖项，并且没有指定具体版本，才会从父项目中继承该项，并且version和scope都读取自父pom;另外如果子项目中指定了版本号，那么会使用子项目中指定的jar版本。


-Dmaven.test.skip=true，不执行测试用例，也不编译测试用例类。





