[TOC]

### Linux 上Java 进程消失，可能的原因是什么？ 

#### 可能的原因：

+ OutOfMemoryError 
+ 守护线程kill Java 进程



#### 解决OOM 导致的进程消失:

+ 启动参数中，-XX:+HeapDumpOnOutOfMemoryError  内存溢出的时候dump内存
+ 定期使用jmap 记录一下内存情况，分析一下也是有必要的
+ 增加 ulimit -c unlimited 如果是jdk崩溃的话，也会有core文件在


+ 程序方面，关键地方还是要搞日志，即使是nohup也最好把输出流和错误流重定向到其他文件。更好的做法使用log4j之内的日志框架而不是System.out，日志要异步打印
+ 可以使用docker 之类的容器，在容器角度监控进程并记录日志



参考：[消失的Java进程-Linux OOM Killer](https://blog.csdn.net/liu251/article/details/51181847)


#### JVM 启动需要的参数：

-Xms\<n>: 内存池的初始化值（）
-Xmx\<n>： 内存池的最大值（maximum）
-Xssn：Set thread stack size.