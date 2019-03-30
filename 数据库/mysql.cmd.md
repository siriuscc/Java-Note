[TOC]



下载Mysql官方的测试库：

```bash
> wget https://github.com/datacharmer/test_db/archive/master.zip
...

> unzip unzip master.zip
> cd test_db-master/

# 在test_db-master 中添加会话有效的 引擎设置
#    SET  default_storage_engine=InnoDB;

> mysql  -uroot -p -t < employees.sql
```




```sql
CREATE TABLE `person` (
  `id` bigint(20) unsigned NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `age` tinyint(3) unsigned NOT NULL,
  `sex` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=Innodb DEFAULT CHARSET=utf8



CREATE DEFINER=`root`@`localhost` PROCEDURE `generate`(IN num INT)
BEGIN   
	DECLARE chars varchar(100) DEFAULT 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	DECLARE fname VARCHAR(25) DEFAULT '';
	DECLARE lname VARCHAR(25) DEFAULT '';
	DECLARE id int UNSIGNED;
	DECLARE len int;
	set id=1;
	DELETE from person;
	WHILE id <= num DO
		set len = FLOOR(1 + RAND()*25);
		set fname = '';
		WHILE len > 0 DO
			SET fname = CONCAT(fname,substring(chars,FLOOR(1 + RAND()*62),1));
			SET len = len - 1;
		END WHILE;
		set len = FLOOR(1+RAND()*25);
		set lname = '';
		WHILE len > 0 DO
			SET lname = CONCAT(fname,SUBSTR(chars,FLOOR(1 + RAND()*62),1));
			SET len = len - 1;
		END WHILE;
		INSERT into person VALUES (id,fname,lname, FLOOR(RAND()*100), FLOOR(RAND()*2));
		set id = id + 1;
	END WHILE;
END





```




### 全局命令
``` sql

-- 查看最大连接数
show variables like '%max_connections%'

--  show status like 'Threads%';
---- Thread_cached 		客户端断开，此线程会缓存，为下一个连接提供服务
---- Threads_connected  打开的连接数
---- Threads_created   创建过的线程数
---- Threads_running 1 	激活的连接数

-- 查询连接列表
show processlist;

-- 查询当前连接数
select ip ,count(ip) as ip_uses from (
	select substring_index(host,':' ,1) as ip from information_schema.processlist where db = 'camp2.0'
) as c group by ip order by ip_uses desc;


-- 
show variables like '%slow_query_log%'
-- 开启慢查询
set global slow_query_log=1;

-- 查看当前支持的引擎
show engines;
-- 查看当前的默认引擎
show variables like '%storage_engine%';
--修改表引擎,这里不需要用到
alter table table_name engine=innodb;  

-- 修改默认存储引擎
-- 设置InnoDB为默认引擎：在配置文件my.cnf中的 [mysqld] 下面加入default-storage-engine=INNODB 一句，保存。
-- 设置本次会话默认存储引擎
SET  default_storage_engine=InnoDB;
```
### 数据库常用的操作

增删改查，手写


### sql时间

sql 时间比较：
```sql

-- 日期格式化
select date_format(now(),'%Y-%m-%d');

-- timestamp 转bigInt
select UNIX_TIMESTAMP('2019-03-07 18:00:00');

-- bigInt 转timestamp
select FROM_UNIXTIME(1551952800);

```


```sql
-- 实战
create table money_order(
	id int primary key auto_increment,
	create_at timestamp,
	moneys float,
	uid int
);

insert into money_order values(null,'2018-09-10 00:20:30',15.8,577);
insert into money_order values(null,'2018-09-10 05:20:30',30.9,577);
insert into money_order values(null,'2018-09-10 09:10:30',300,577);

insert into money_order values
	(null,'2018-09-10 09:10:30',300,666),
	(null,'2018-09-10 09:10:40',300,666),
	(null,'2018-09-10 09:20:40',1300,666),
	(null,'2018-09-10 09:30:10',3400,666);


insert into money_order values
	(null,'2018-09-10 09:10:30',30,123),
	(null,'2018-09-10 09:10:40',30,123),
	(null,'2018-09-10 09:10:40',800,123),
	(null,'2018-09-10 09:10:40',100,123);

insert into money_order values
	(null,'2018-09-10 09:10:30',100,222),
	(null,'2018-09-10 09:10:40',100,222),
	(null,'2018-09-18 09:10:40',100,222);

insert into money_order values
	(null,'2018-09-13 09:10:30',100,222),
	(null,'2018-09-11 09:10:40',100,222),
	(null,'2018-09-19 09:10:40',100,222);

-- 查询 2018-09-10 号 充值前3 的用户
select uid,sum(moneys) mey from money_order 
	where date_format(create_at,"%Y-%m-%d")='2018-09-10'
	group by(uid) order by mey desc limit 3;

-- 查询各个金额段的充值人数
select count(uid),(case 
	when (sum_money<500) then '0-500'
	when (sum_money>=500 and sum_money<1000) then '500-1000'
	when (sum_money>=1000 and sum_money<2000) then '1000-2000'
	else '>2000' end) as sum_money from (
	select uid,sum(moneys) sum_money from money_order
		group by(uid) order by sum_money
	) sm
	group by (case 
		when (sum_money<500) then '0-500'
		when (sum_money>=500 and sum_money<1000) then '500-1000'
		when (sum_money>=1000 and sum_money<2000) then '1000-2000'
		else '>2000' end);

```



1、一张表，里面有ID自增主键，当insert了17条记录之后，删除了第15,16,17条记录，再把Mysql重启，再insert一条记录，这条记录的ID是18还是15 ？


+ 如果表的类型是MyISAM,那么是18
因为MyISAM会把自增主键的最大ID持久化到数据文件，重启MySQL并不丢失
+ 如果表的引擎是InnoDB,那么是15
InnoDB只把最大主键记录到内存中，重启或者 OPTIMEIZE 操作都会导致最大ID丢失

Heap表是什么？
+ HEAP表存在于内存中，用于临时高速存储。
+ BLOB或TEXT字段是不允许的
+ 只能使用比较运算符 ，<，>， >， <
+ HEAP表不支持AUTO_INCREMENT
+ 索引不可为NULL




### timestamp 和datatime

TIMESTAMP和DATETIME的相同点：

+ 两者都可用来表示YYYY-MM-DD HH:MM:SS[.fraction]类型的日期。

TIMESTAMP和DATETIME的不同点：

+ 两者的存储方式不一样
对于TIMESTAMP，它把客户端插入的时间从当前时区转化为UTC（世界标准时间）进行存储。查询时，将其又转化为客户端当前时区进行返回。
而对于DATETIME，不做任何改变，基本上是原样输入和输出。
