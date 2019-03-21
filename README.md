
> 技术债，总是要还的

offer = 心态 * (实力 + 面试技巧) + 缘分运气




一个Java 攻城狮的笔记
----

涉及Java，数据结构，算法，前端，数据库的相关知识，补充面试的相关知识。


### TODO：

- [ ] 移位运算
- [ ] 内网穿透原理
- [ ] 支付失败如何处理，说一下思路。
- [ ] dubbo 的底层实现，通信协议，RPC的底层原理，和spring cloud 的对比，和JSF 的对比
- [ ] mycat 学习

- [ ] 常见的SQL 优化手段
- [ ] Linux Socket相关。
- [ ] 分布式锁
- [ ] 连接池
- [ ] shiro 的 RBAC 模型说下，资源的概念聊一下。



优秀面经：
+ [春招面试经验总结](https://www.nowcoder.com/discuss/160872?type=0&order=0&pos=13&page=1)




推荐一个git:
https://github.com/Snailclimb/JavaGuide



### book list

> 互联网的四大特征: 开放的精神，分享的心态，全球化的眼光，责任感。
—— 马云

+ Java:
    + 深入理解Java虚拟机 第二版，周志明
    + 码出高效-Java开发手册， 阿里 孤尽，鸣莎
    + Java 并发编程实战
    + 自己动手写Java虚拟机，张秀宏
    + Spring 技术内幕：深入解析 Spring架构与设计原理(第2版)
+ 数据库
    + MySQL技术内幕:Innodb 存储引擎第二版，姜承尧
    + Redis 设计与实现
+ 操作系统:
    + Linux 私房菜
+ 网络：
    + 计算机网络 ，第六版，谢希仁
+ 算法：
    + 编程珠玑
    + 剑指offer
+ 架构：
    + 大型网站技术架构：核心原理与案例分析
    + 大型网站系统与Java中间件实践
+ 高级内功心法：
    + 阿里巴巴Java开发手册
    + 重构
    + 人月神话
    + Design Patterns- Elements of Reusable Object-Oriented Software
+ tool 
    + Git权威指南



+ 字典书，可以拿来做开发案头书，不需要熟记的：
    + Spring 实战
    + 深入浅出MySQL



#### To Read：
+ Baron Scbwartz等 著，王小东等 译；高性能MySQL（High Performance MySQL）；电子工业出版社，2010
+ Michael Kofler 著，杨晓云等 译；MySQL5权威指南（The Definitive Guide to MySQL5）；人民邮电出版社，2006
+ 数据库系统实现
+ 《Netty实战》（推荐，豆瓣评分 7.8，92人评价）
+ 《从Paxos到Zookeeper》（推荐，豆瓣评分 7.8，0.3K人评价）《Java编程思想(第4版)》（推荐，豆瓣评分 9.1，3.2K+人评价）
+ 亿级流量网站架构核心技术
+ 企业IT架构转型之道：阿里巴巴中台战略思想与架构实战 （8.3，386人评价，强推）





### log:


#### 2019-03-06

+ 归纳整理Java 多线程的相关知识




参考：[【技术类】2019校招技术类岗位面经汇总](https://www.nowcoder.com/discuss/146655)




### 开发tip:

+ 不要相信任何开发：一定要保留老版本，一旦新版本出问题，确保随时可以回滚

+ 不要相信任何测试：不论线下怎么测试，上线以后还是有可能出问题。因此需要做灰度发布，新版本先开放给一小部分用户进行真实测试，没问题再向所有用户开放。

+ 不要相信任何应用：任何应用都可能崩溃，必要的时候做服务降级和限流，以保证核心业务可用。

+ 不要相信任何硬件：业务做跨机房部署，进行容灾。






























