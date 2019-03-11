[TOC]

### socket

socket是用来进行网络通信的，套接字。
java里面已经有封装好这个类了，分为客户端和服务器，通过ip：port来进行访问。

### IO，NIO，AIO，netty

什么是IO，什么是NIO，什么是AIO，什么是netty框架？


IO 逃不掉的两个步骤：

1. 等待 数据缓冲区 可读
2. 将数据从 缓冲区拷贝到内存



#### BIO and NIO and AIO

+ BIO: 等待阻塞，数据拷贝阻塞
	+ 传统的 java.io 包
	+ IO 的效率和扩展性很低,不适合大量并发
+ NIO： 等待不阻塞，数据拷贝阻塞
	+ JDK1.4, java.nio 包，Non-blocking I/O
	+ 提供了 Channel、Selector、Buffer 等新的抽象，可以构建多路复用的、同步非阻塞 IO 程序
+ AIO：不阻塞，拷贝完通知
	+ JDK1.7引入,Asynchronous IO
	+ 回调机制+系统级别异步

以socket.read()为例子：
+ 传统的BIO里面socket.read()，如果TCP RecvBuffer里没有数据，函数会一直阻塞，直到收到数据，返回读到的数据。
+ 对于NIO，如果TCP RecvBuffer有数据，就把数据从网卡读到内存，并且返回给用户；反之则直接返回0，永远不会阻塞。
+ 最新的AIO(Async I/O)里面会更进一步：不但等待就绪是非阻塞的，就连数据从网卡到内存的过程也是异步的。

关注点：
+ BIO，最关心“我要读”
+ NIO，最关心"我可以读了"，
+ AIO，更需要关注的是“读完了”。



#### NIO

+ NIO的主要事件：读就绪、写就绪、有新连接到来。
+ socket主要的读、写、注册和接收函数，在等待就绪阶段非阻塞，真正的I/O操作是同步阻塞的，消耗CPU但性能非常高
+ 可以把工作细分，在不同的线程中执行。
```java
	//选择就绪的事件和对应的连接,select 是阻塞的
	while(channel=Selector.select()){
		if(channel.event==accept){
			//如果是新连接，则注册一个新的读写处理器
			registerNewChannelHandler(channel);
		}
		if(channel.event==write){
			//如果可以写，则执行写事件
			getChannelHandler(channel).channelWritable(channel);
		}
		if(channel.event==read){
			//如果可以读，则执行读事件
			getChannelHandler(channel).channelReadable(channel);
		}
	}
```
Java的Selector对于Linux系统来说，有一个致命限制：同一个channel的select不能被并发的调用。因此，如果有多个I/O线程，必须保证：一个socket只能属于一个IoThread，而一个IoThread可以管理多个socket。


##### NIO应用：


###### 每连接顺序请求的redis：

由于redis服务端是串行的，能够保证同一连接的所有请求与返回顺序一致。这样可以使用单线程＋队列，把请求数据缓冲。然后pipeline发送，返回future，然后channel可读时，直接在队列中把future取回来，done()就可以了。

###### 多连接短连接的HttpClient：

做爬虫时，需要建立很多socket同时爬取多个站点，以socket为key，直接遍历可用事件；


###### 常见的RPC框架，如Thrift，Dubbo：
这种框架内部一般维护了请求的协议和请求号，可以维护一个以请求号为key，结果的result为future的map，结合NIO+长连接，获取非常不错的性能。


#### Reactor and Proactor

+ Reactor:NIO,
	1. 等待可用状态
	2. 分发事件给处理函数进行读写。
+ Proactor:AIO，系统级别异步。
	1. 告诉系统 对应的缓冲区 和内存，数据长度，回调函数
	2. 事件分发器调用操作系统API发起新的异步读写（新线程），由操作系统完成读写。读写完成通知分发器。
	3. 分发器呼唤处理器，处理器异步处理后通知分发器



tips:
+ Reactor 回调handler时，表示可以read/write
+ Proactor 回调handler时，表示已完成read/write



NIO（，在Java领域，也称为New I/O），


NIO存在的问题

使用NIO != 高性能，当连接数<1000，并发程度不高或者局域网环境下NIO并没有显著的性能优势。NIO并没有完全屏蔽平台差异，它仍然是基于各个操作系统的I/O系统实现的，差异仍然存在。使用NIO做网络编程构建事件驱动模型并不容易，陷阱重重。

NIO的优点：
+ 事件驱动模型
+ 避免多线程
+ 单线程处理多任务
+ 非阻塞I/O，I/O读写不再阻塞，而是返回0
+ 基于block的传输，通常比基于流的传输更高效
+ 更高级的IO函数，zero-copy
+ IO多路复用大大提高了Java网络应用的可伸缩性和实用性


参考：[Java NIO浅析-美团技术团队](https://www.zhihu.com/search?q=AIO%20NIO&type=content)



netty是用来实现非阻塞IO的一个框架，这个作为拓展点，感兴趣可以去了解一下。我在面试阿里的时候被问到过，其他公司还没问过。






#### Netty

+ 本质：JBoss做的一个Jar包
+ 目的：快速开发高性能、高可靠性的网络服务器和客户端程序
+ 优点：提供异步的、事件驱动的网络应用程序框架和工具

通俗的说：一个好使的处理Socket的东东

参考:[通俗地讲，Netty 能做什么？](https://www.zhihu.com/question/24322387/answer/78947405)