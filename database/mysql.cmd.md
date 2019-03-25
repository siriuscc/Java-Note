


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

```
### 数据库常用的操作

增删改查，手写

### SQL JOINS


![](.images/mysql.cmd/2019-03-07-15-52-49.png)
+ inner join

+ left join
+ right join
+ full join


+ UNION 与 UNION ALL:
```sql
-- A 表和B表 在name 字段 唯一化 的所有数据，也就是所有A.name 加B.name 不重复
SELECT name FROM TableA UNION SELECT name FROM TableB

-- A.name +B.name 可以重复
SELECT name FROM TableA UNION ALL SELECT name FROM TableB

```

参考： [图解SQL的inner join、left join、right join、full outer join、union、union all的区别](https://www.cnblogs.com/logon/p/3748020.html)





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

