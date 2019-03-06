

### git 命令


拉取更新
```bash
git pull 
```

查看所有分支
```bash

# 白色是本地，红色是远程
git branch -a
# 删除分支
git branch -D dev
# 删除远程分支
git branch -dr origin/dev-coupon
# 切换到其他分支
git checkout dev-newapp

#  直接将远程分支checkout
git checkout -t origin/2.0.0
```



git remote rm other

```bash
#
查看当前状态
git status

git checkout -b 新分支名称
# 等价于
git branch 新分支名称  	# 建立新分支
git checkout 新分支名称 # 切换到新分支： 
git checkout -b xiaoY origin/
```


### 关联远程仓库

```bash
git remote add origin https://github.com/siriuscc/aaa.git

git push -u origin master
```


### 合并分支：

```bash
git checkout master	# 切换到主分支
git merge hotfix	# 将 hotfix分支合并到主分支上
```





```bash

git status 
rebase in progress; onto 012ad4d1

# 正在rebase，需要解决冲突然后


git add .

git rebase --continue

# 查看提交树
gitk 


# 切换到master分支
# 拉取一下master分支代码，

git checkout master
git pull     

# 检出为img-multi, 然后合并

git status

git checkout img-multi


gitk

git merge img-multi

# 遇到冲突，解决冲突然后
git add .

git status
gitk

git push
```





#### down下线上代码版本,抛弃本地的修改

不建议这样做,但是如果你本地修改不大,或者自己有一份备份留存,可以直接用线上最新版本覆盖到本地

git fetch --all

git reset --hard origin/master

git fetch


#### 服务器上有修改，本地有修改，pull 失败

```bash
# 存储本地，然后再去拉
git stash 
git pull
git stash pop 
```







#### win10加速git :

```bash
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256
```

> core.preloadindex并行执行文件系统操作以隐藏延迟(更新：默认情况下在git 2.1中启用)
> core.fscache修复UAC问题，所以你不需要运行git作为管理(更新：默认情况下在Git为Windows 2.8启用)
> gc.auto最小化.git中的文件数/



### git 配置密匙



设置git：
设置git的user name和email：
```bash
git config --global user.name "xxx"
git config --global user.email "xxx@163.com"
```


生成密钥：
```bash
ssh-keygen -t rsa -C "xxx@163.com"
```
按3个回车，密码为空这里一般不使用密钥。
最后得到了两个文件：id_rsa和id_rsa.pub


添加公钥
复制本地~/.ssh/id_rsa.pub 中的公钥，添加进代码托管的仓库SSH Key配置中去,然后本地就可以正常使用了
注：以上涉及xxx的是你项目代码托管仓库(如github、gitlab)的用户名、邮箱



解决：unable to access 'https://github.com/yuanlunchuan/spring4Angular.git/': OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443

```bash
git config --global http.sslVerify false"
```

### git 迁移

目标，现在有两个库，要整个成一个：xiaoY note


方案，新建一个库


关联本地代码库到云端
```git
git init
git add
git commit -m
git remote add orign https://github.com/siriuscc/xiaoY-Note.git
git push
```



git remote add other ../xiaoY/



git push -u origin master 上面命令将本地的master分支推送到origin主机





