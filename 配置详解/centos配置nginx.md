



yum install nginx

(1) Nginx配置路径：/etc/nginx/
(2) PID目录：/var/run/nginx.pid
(3) 错误日志：/var/log/nginx/error.log
(4) 访问日志：/var/log/nginx/access.log
(5) 默认站点目录：/usr/share/nginx/html



创建 网站文件夹：

```bash

mkdir /usr/website
mkdir /user/website/sirius.wiki


# cp file into this
```



### 配置nginx

```

cd /etc/nginx/

mkdir domains
cd domains/

vim sirius.wiki.conf

```

```js
server {
    listen       80;
    server_name  sirius.wiki blog.sirius.wiki;

    location / {
        root   /var/website/sirius.wiki;
        index  index.html ;
    }
}
```

```bash
vim nginx.conf

```


```conf
http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    # 加上这句话
    include /etc/nginx/domains/*.conf;
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

```


```
nginx -t
nginx -s reload
```

```
vim /etc/hosts


127.0.0.1   sirius.wiki
127.0.0.1   git.sirius.wiki
127.0.0.1   blog.sirius.wiki



```