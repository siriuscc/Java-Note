
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


