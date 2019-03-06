


服务器：Centos



+ 下载redis
+ 解压
+ 到目录下make
+ 安装


```shell
# 安装
make install PREFIX=/usr/local/redis19


#查看进程
ps -aux|grep redis
cd redis-4.0.9
# 关闭redis
./redis-cli shutdown
# 复制配置文件
cp /root/redis-4.0.9/redis.conf ./
# 修改配置文件，dae... 为yes，后台启动
vim redis.conf 
#根据配置文件启动
./redis-server redis.conf 
ps -aux |grep redis
```

+ 强制退出，导致部分数据可能无法持久化到本地
+ 手动退出可以保证数据安全持久化

```
> ps -aux|grep redis
Warning: bad syntax, perhaps a bogus '-'? See /usr/share/doc/procps-3.2.8/FAQ
root     23505  0.0  0.2 143924  4252 ?        Ssl  16:16   0:00 ./redis-server 127.0.0.1:6379
root     23517  0.0  0.0 103320   884 pts/1    S+   16:21   0:00 grep redis
> 
> ./redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> 
127.0.0.1:6379> 
127.0.0.1:6379> set s1 333
OK
127.0.0.1:6379> get s1
"333"
127.0.0.1:6379> quit

```


防火墙没启动，没有配置文件

```
> lsb_release -a
LSB Version:	:base-4.0-amd64:base-4.0-noarch:core-4.0-amd64:core-4.0-noarch
Distributor ID:	CentOS
Description:	CentOS release 6.9 (Final)
Release:	6.9
Codename:	Final

```
这边阿里在外部做了逻辑防火墙，所以没必要开iptables，最好也别开了，懒人



dns 配置
```bash
cat resolv.conf 
```



root@siriuscloud:/usr/local/redis/bin# ./redis-cli -h siriuscloud.cc -p 6379
siriuscloud.cc:6379> exit




设置密码：


在redis.conf:
requirepass 密码


### 可视化客户端

安装 redis Desktop Manager




###spring boot 集成 redis



添加依赖：

```xml {.line-numbers}
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-redis</artifactId>  
</dependency>
```
















mirrors.aliyun.com
http://mirrors.cloud.aliyun.com/




------------------------------------------




### ruby 环境



```bash
[root@aliyun ~]# wget https://www.openssl.org/source/openssl-1.0.2o.tar.gz
```

yum 直接安装ruby，rubygems 会出问题，很坑，折腾了一天没搞出来



回到最初的问题：


1. 安装ruby 

```shell
[root@itheima bin2]# yum install ruby
[root@itheima bin2]# yum install rubygems
```

这边不行，所以手动下载一个ruby
下载后安装ruby

```shell
wget https://cache.ruby-lang.org/pub/ruby/2.2/ruby-2.2.10.tar.gz


[root@aliyun ruby-2.2.10]# ./configure 
[root@aliyun ruby-2.2.10]# make
[root@aliyun ruby-2.2.10]# make |grep Failed
```


得到错误：
```
gcc version 4.4.7 20120313 (Red Hat 4.4.7-18) (GCC) 
Failed to configure -test-/win32/console. It will not be installed.
Failed to configure -test-/win32/dln. It will not be installed.
Failed to configure -test-/win32/fd_setsize. It will not be installed.
Failed to configure openssl. It will not be installed.
Failed to configure readline. It will not be installed.
Failed to configure tk. It will not be installed.
Failed to configure tk/tkutil. It will not be installed.
Failed to configure win32. It will not be installed.
Failed to configure win32ole. It will not be installed.
```

检查一下错误
```
[root@aliyun ruby-2.2.10]# make check

Skipping Gem::Security::Signer tests.  openssl not found.
/root/ruby-2.2.10/lib/rubygems/test_case.rb:1378:in `load_cert': uninitialized constant Gem::TestCase::OpenSSL (NameError)
	from /root/ruby-2.2.10/test/rubygems/test_gem_request.rb:9:in `<class:TestGemRequest>'
	from /root/ruby-2.2.10/test/rubygems/test_gem_request.rb:6:in `<top (required)>'
	from /root/ruby-2.2.10/lib/rubygems/core_ext/kernel_require.rb:54:in `require'
	from /root/ruby-2.2.10/lib/rubygems/core_ext/kernel_require.rb:54:in `require'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:258:in `block in non_options'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:252:in `each'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:252:in `non_options'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:63:in `process_args'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:852:in `process_args'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:857:in `run'
	from /root/ruby-2.2.10/test/lib/test/unit.rb:864:in `run'
	from ./test/runner.rb:40:in `<main>'
make: *** [yes-test-all] Error 1
```
缺失OpenSSL 模块？
那么要看一下openssh

看一下人家的解释： https://github.com/rbenv/ruby-build/issues/1006


```
Ruby 2.3.1 is not works with OpenSSL-1.1.0. This feature is after Ruby 2.4.0.
```
有这么一句，那么就是说很有可能是版本问题，那么重新来装一下openSSL

首先卸载OpenSSL
卸载并删除两个版本的残留
```
[root@aliyun openssl-1.1.0h]# make uninstall
[root@aliyun openssl-1.1.0h]# rm /usr/local/openssl/ -rf

[root@aliyun openssl-1.0.2o]# make
[root@aliyun openssl-1.0.2o]# make install

cp libcrypto.pc /usr/local/openssl/lib/pkgconfig
chmod 644 /usr/local/openssl/lib/pkgconfig/libcrypto.pc
cp libssl.pc /usr/local/openssl/lib/pkgconfig
chmod 644 /usr/local/openssl/lib/pkgconfig/libssl.pc
cp openssl.pc /usr/local/openssl/lib/pkgconfig
chmod 644 /usr/local/openssl/lib/pkgconfig/openssl.pc
```
然后回到ruby

```
./configure  --with-openssl-dir=/usr/local/openssl

gcc version 4.4.7 20120313 (Red Hat 4.4.7-18) (GCC) 
Failed to configure -test-/win32/console. It will not be installed.
Failed to configure -test-/win32/dln. It will not be installed.
Failed to configure -test-/win32/fd_setsize. It will not be installed.
Failed to configure readline. It will not be installed.
Failed to configure tk. It will not be installed.
Failed to configure tk/tkutil. It will not be installed.
Failed to configure win32. It will not be installed.
Failed to configure win32ole. It will not be installed.
```


openSSL 已经没问题了，要不先忽略问题？check一把，检查编译后能不能用先
```
Finished tests in 478.584537s, 33.7850 tests/s, 6044.0440 assertions/s.                                                
16169 tests, 2892586 assertions, 35 failures, 0 errors, 84 skips

ruby -v: ruby 2.2.10p489 (2018-03-28 revision 63023) [x86_64-linux]
make: *** [yes-test-all] Error 35
```
好吧,35失败，假装看不见，先跑起来看看
```
make uninstall
make install


[root@aliyun ~]# cd rubygems-2.7.6/
[root@aliyun rubygems-2.7.6]# ruby setup.rb 


RubyGems installed the following executables:
	/usr/local/bin/gem
	/usr/local/bin/bundle

Ruby Interactive (ri) documentation was installed. ri is kind of like man 
pages for Ruby libraries. You may access it like this:
  ri Classname
  ri Classname.class_method
  ri Classname#instance_method
If you do not wish to install this documentation in the future, use the
--no-document flag, or set it as the default in your ~/.gemrc file. See
'gem help env' for details.

```




2. 安装ruby和redis接口

```bash
[root@aliyun ~]# ruby /usr/local/bin/gem install redis-3.0.0.gem 
Successfully installed redis-3.0.0
Parsing documentation for redis-3.0.0
Installing ri documentation for redis-3.0.0
Done installing documentation for redis after 1 seconds
1 gem installed

```
终于安装成功了


3. 到集群目录，开启集群，成败在此一举

```
./redis-trib.rb create --replicas 1 120.78.64.78:7001 120.78.64.78:7002 120.78.64.78:7003 120.78.64.78:7004 120.78.64.78:7005  120.78.64.78:7006
```

将redis-3.0.0包下src目录中的以下文件拷贝到redis19/redis-cluster/


```bash
Waiting for the cluster to join...............................................................................................................................................................................................................
```


一直在等待，是总线端口没开放吧
去阿里云配置里开放一把

回来：再启动



```bash
...
an I set the above configuration? (type 'yes' to accept): yes
/usr/local/lib/ruby/gems/2.2.0/gems/redis-3.0.0/lib/redis/client.rb:79:in `call': ERR Slot 0 is already busy (Redis::CommandError)
	from /usr/local/lib/ruby/gems/2.2.0/gems/redis-3.0.0/lib/redis.rb:2190:in `block in method_missing'
	from /usr/local/lib/ruby/gems/2.2.0/gems/redis-3.0.0/lib/redis.rb:36:in `block in synchronize'
	from /usr/local/lib/ruby/2.2.0/monitor.rb:211:in `mon_synchronize'
	from /usr/local/lib/ruby/gems/2.2.0/gems/redis-3.0.0/lib/redis.rb:36:in `synchronize'
	from /usr/local/lib/ruby/gems/2.2.0/gems/redis-3.0.0/lib/redis.rb:2189:in `method_missing'
	from ./redis-trib.rb:212:in `flush_node_config'
	from ./redis-trib.rb:906:in `block in flush_nodes_config'
	from ./redis-trib.rb:905:in `each'
	from ./redis-trib.rb:905:in `flush_nodes_config'
	from ./redis-trib.rb:1426:in `create_cluster_cmd'
	from ./redis-trib.rb:1830:in `<main>'
```


进去每一个redis，清空以前的东西
```bash
[root@aliyun 7001]# ./redis-cli -p 7001 -c
127.0.0.1:7001> flushall
OK
127.0.0.1:7001> cluster reset
OK
```

起来了：
```bash
>>> Performing Cluster Check (using node 120.78.64.78:7001)
M: 9c47597ef56132a8c61bf974d02db2e56dca8ece 120.78.64.78:7001
   slots:0-5460 (5461 slots) master
   1 additional replica(s)
S: 05a3bf354d6b4be6297ce96c3afd3ca7f88becbf 120.78.64.78:7006
   slots: (0 slots) slave
   replicates 9c47597ef56132a8c61bf974d02db2e56dca8ece
S: 462ee688ea31a936dae2dee29eb7bbf50464dd85 120.78.64.78:7005
   slots: (0 slots) slave
   replicates b6307fe942da59e91757ae6e91a22df0dce654a6
M: b6307fe942da59e91757ae6e91a22df0dce654a6 120.78.64.78:7003
   slots:10923-16383 (5461 slots) master
   1 additional replica(s)
S: 3e0217660d808890ea20328a0c64722d6d72c188 120.78.64.78:7004
   slots: (0 slots) slave
   replicates b6e1e79ab01597cb358574b8c722b97ef5e014c8
M: b6e1e79ab01597cb358574b8c722b97ef5e014c8 120.78.64.78:7002
   slots:5461-10922 (5462 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

4. 连接集群
```bash
[root@aliyun redis-cluster]# ./redis-cli -h 120.78.64.78 -p 7001 –c
-bash: ./redis-cli: No such file or directory
[root@aliyun redis-cluster]# cd 7001
[root@aliyun 7001]# ./redis-cli -h 120.78.64.78 -p 7001 –c
(error) ERR unknown command '–c'
[root@aliyun 7001]# ./redis-cli -h 120.78.64.78 -p 7001 –c
(error) ERR unknown command '–c'
[root@aliyun 7001]# ./redis-cli -h 120.78.64.78 -p 7001 -c
120.78.64.78:7001> set s1 111
-> Redirected to slot [15224] located at 120.78.64.78:7003
OK
120.78.64.78:7003> set s2 777
-> Redirected to slot [2843] located at 120.78.64.78:7001
OK
```






