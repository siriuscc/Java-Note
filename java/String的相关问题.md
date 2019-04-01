String的相关问题
---

[TOC]

## String a="ab",String b="a"+"b",是否相等


相等。因为 a=“ab”会固化到常量池，“a”+"b" 的结果是常量池有的，直接指向过去。




## String 能不能被继承

不能被继承，他是 public final class


## StringBuffer and StringBuilder


+ StringBuffer ：线程安全
+ StringBuilder: 线程不安全



## equals and hashCode

+ 如果两对象equals为true，hashCode也应该一致
+ 重写equals就必须重写hashCode