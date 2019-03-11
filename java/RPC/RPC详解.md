



## RPC

**RPC（Remote Procedure Call）：远程过程调用**。


+ 以服务端-客户端形式，服务端对外暴露接口以供客户端调用
+ 客户端不需要了解服务的实现，通过网络调用远程服务；
+ RPC 框架 跨越 传输层到应用层，对开发者透明；
+ RPC 依赖序列化和反序列化，数据传输 等技术

优点：
+ 避免重复造轮子
+ 支持并行开发
+ 系统之间是封闭的，只暴露接口，便于维护

缺点：
+ `调用过程很慢`，而且该过程是不可靠的，容易发生不可预料的错误，比如网络错误等；
+ 每个系统的可靠性受到整个`调用链的制约`。如果每个节点的可靠性为99%，一条有5个节点的调用链的可靠性为：$0.99^35=0.95$
+ 关键节点如果挂了，`容易导致整个大系统雪崩`。
    + 增加chaos Monkey 等演练，构建自愈式系统
    + 避免过长的调用链，开发中 服务提供方要明确己方的调用链并对客户端说明
    + 对关键服务增加机器，改善编码，提高稳定性







RESTful和RPC的区别：

+ RESTful 可以用于内部服务调用，但其主要用途是对外提供服务。
+ RPC 是内部服务之间的互相调用



### 常见RPC框架：

+ RMI（JDK自带）： JDK自带的RPC
详细内容可以参考：[《从懵逼到恍然大悟之Java中RMI的使用》](https://blog.csdn.net/lmy86263/article/details/72594760)



+ Dubbo: Dubbo是 阿里巴巴公司开源的一个高性能优秀的服务框架，使得应用可通过高性能的 RPC 实现服务的输出和输入功能，可以和 Spring框架无缝集成。
详细内容可以参考： 
    + [《高性能优秀的服务框架-dubbo介绍》](https://blog.csdn.net/qq_34337272/article/details/79862899)
    + [《Dubbo是什么？能做什么？》](https://blog.csdn.net/houshaolin/article/details/76408399)


+ Hessian： Hessian是一个轻量级的remotingonhttp工具，使用简单的方法提供了RMI的功能。 相比WebService，Hessian更简单、快捷。采用的是二进制RPC协议，因为采用的是二进制协议，所以它很适合于发送二进制数据。
详细内容可以参考： [《Hessian的使用以及理解》](https://blog.csdn.net/sunwei_pyw/article/details/74002351)

+ Thrift： Apache Thrift是Facebook开源的跨语言的RPC通信框架，目前已经捐献给Apache基金会管理，由于其跨语言特性和出色的性能，在很多互联网公司得到应用，有能力的公司甚至会基于thrift研发一套分布式服务框架，增加诸如服务注册、服务发现等功能。

详细内容可以参考： [《【Java】分布式RPC通信框架Apache Thrift 使用总结》](https://www.cnblogs.com/zeze/p/8628585.html)



选择：

+ 是否允许代码侵入： 即需要依赖相应的代码生成器生成代码，比如Thrift。

+ 是否需要长连接获取高性能： 如果对于性能需求较高的haul，那么可以果断选择基于TCP的Thrift、Dubbo。

+ 是否需要跨越网段、跨越防火墙： 这种情况一般选择基于HTTP协议的Hessian和Thrift的HTTP Transport。


此外，Google推出的基于HTTP2.0的gRPC框架也开始得到应用，其序列化协议基于Protobuf，网络框架使用的是Netty4,但是其需要生成代码，可扩展性也比较差。



参考：[后端必备——数据通信知识(RPC、消息队列)一站式总结](https://mp.weixin.qq.com/s?__biz=MzU4NDQ4MzU5OA==&mid=2247484133&idx=1&sn=27c03c4a0c15364e1b7bf42960bad76c)