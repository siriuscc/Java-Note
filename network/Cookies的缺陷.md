

+ 难以安全使用
+ 浪费资源
+ 隐私问题

服务器可以为浏览器设置大量CooKies，这些Cookies在每次传输都携带，给带宽带来了巨大压力。
隐私上，Cookies 被用于跟踪用户信息

难于安全使用：
+ Cookie 对 JavaScript 默认是可用的，这使得一次 XSS 可以获取持久凭证。虽然十年前引入了 HttpOnly 属性，目前也只有大概 8.31% 的人使用 Set-Cookie 进行相应设置。

+ 默认情况下，Cookie 会被发送到非安全的源，这会导致凭据被盗。Secure 属性虽然可以标记安全的 Cookie 源，但目前只有大概 7.85％ 的人使用 Set-Cookie 进行了设置。

+ Cookie 经常在请求发送者毫不知情的情况下被发送。SameSite 属性可以减少 CSRF 风险，但是目前只有大概 0.06% 的人使用 Set-Cookie 进行了设置。


参考[Cookie 机制问题多，Chrome 工程师提出改造方案](https://www.oschina.net/news/99542/tightening-http-state-management?from=20180902)








