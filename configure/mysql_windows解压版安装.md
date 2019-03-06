

1. 解压mysql
2. 设置环境变量


3. 在mysql 目录（和bin同级）新建my.ini

目录结构：

.
..
bin
COPYING
docs
include
lib
my.ini
README
share

```
[mysqld]
basedir=D:\surroundings\mysql-5.7.22\
datadir=D:\surroundings\mysql-5.7.22\data\
port=3306
skip-grant-tables
#basedir表示mysql安装路径
#datadir表示mysql数据文件存储路径
#port表示mysql端口
#skip-grant-tables表示忽略密码
```


4. bin目录下 管理员运行 

```cmd
D:\surroundings\mysql-5.7.22\bin>mysqld -install
Service successfully installed.

```

初始化
```cmd
mysqld --initialize-insecure --user=mysql
```



5. 启动服务

net start mysql


```

查看服务是否启动成功
```
net start |findstr -i "mysql"
```


6. 登录到mysql

```cmd


ALTER USER 'root'@'localhost' IDENTIFIED BY 'sirius';
ALTER USER 'root'@'%' IDENTIFIED BY 'sirius';
```


ERROR 1290 (HY000): The MySQL server is running with the --skip-grant-tables opt ion so it cannot execute this statement
>flush privileges;



7. 设置mysql 编码和默认引擎


```ini
[mysqld]
basedir=D:/surroundings/mysql-5.7.22/
datadir=D:/surroundings/mysql-5.7.22/data/
port=3306
# skip-grant-tables
#basedir表示mysql安装路径
#datadir表示mysql数据文件存储路径
#port表示mysql端口
#skip-grant-tables表示忽略密码

default-storage-engine=INNODB
character-set-server=utf8
collation-server=utf8_general_ci

[mysql]
default-character-set = utf8

[mysql.server]
default-character-set = utf8

[mysqld_safe]
default-character-set = utf8

[client]
default-character-set = utf8
```

重启服务

验证

```mysql
mysql> show variables like '%char%';
+--------------------------+----------------------------------------------+
| Variable_name            | Value                                        |
+--------------------------+----------------------------------------------+
| character_set_client     | utf8                                         |
| character_set_connection | utf8                                         |
| character_set_database   | utf8                                         |
| character_set_filesystem | binary                                       |
| character_set_results    | utf8                                         |
| character_set_server     | utf8                                         |
| character_set_system     | utf8                                         |
| character_sets_dir       | D:\surroundings\mysql-5.7.22\share\charsets\ |
+--------------------------+----------------------------------------------+
8 rows in set, 1 warning (0.01 sec)

mysql>
mysql> show variables like '%engine%';
+----------------------------------+--------+
| Variable_name                    | Value  |
+----------------------------------+--------+
| default_storage_engine           | InnoDB |
| default_tmp_storage_engine       | InnoDB |
| disabled_storage_engines         |        |
| internal_tmp_disk_storage_engine | InnoDB |
+----------------------------------+--------+
4 rows in set, 1 warning (0.01 sec)
```



idea 安装 Free Mybatis plugin 直接从mapper 跳转到 xml






安装mysql-workbench

mysql-workbench-community-8.0.12-winx64