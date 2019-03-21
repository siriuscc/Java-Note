
[TOC]


#### Sprint AOP

```java
/**
 * 应用切入点函数
 */
@After(value="myPointcut()")
public void afterDemo(){
    System.out.println("最终通知....");
}
```
##### 通配符：


.. ：匹配方法定义中的任意数量的参数，此外还匹配类定义中的任意数量包

```java
//任意返回值，任意名称，任意参数的公共方法
execution(public * *(..))
//匹配com.sirius.dao包及其子包中所有类中的所有方法
within(com.sirius.dao..*)
```

＋ ：匹配给定类的任意子类
```java
//匹配实现了DaoUser接口的所有子类的方法
within(com.sirius.dao.DaoUser+)
```
\* ：匹配任意数量的字符


```java
//匹配com.sirius.service包及其子包中所有类的所有方法
within(com.sirius.service..*)
//匹配以set开头，参数为int类型，任意返回值的方法
execution(* set*(int))
```


##### 类型签名表达式

为了方便类型（如接口、类名、包名）过滤方法，Spring AOP 提供了within关键字。其语法格式如下：



```java
within(<type name>)

/////type name 则使用包名或者类名替换即可，来点案例吧。

//匹配com.zejian.dao包及其子包中所有类中的所有方法
@Pointcut("within(com.zejian.dao..*)")

//匹配UserDaoImpl类中所有方法
@Pointcut("within(com.zejian.dao.UserDaoImpl)")

//匹配UserDaoImpl类及其子类中所有方法
@Pointcut("within(com.zejian.dao.UserDaoImpl+)")

//匹配所有实现UserDao接口的类的所有方法
@Pointcut("within(com.zejian.dao.UserDao+)")
```
##### 方法签名表达式
如果想根据方法签名进行过滤，关键字execution可以帮到我们，语法表达式如下
```java
//scope ：方法作用域，如public,private,protect
//returnt-type：方法返回值类型
//fully-qualified-class-name：方法所在类的完全限定名称
//parameters 方法参数
execution(<scope> <return-type> <fully-qualified-class-name>.*(parameters))

//匹配UserDaoImpl类中的所有方法
@Pointcut("execution(* com.zejian.dao.UserDaoImpl.*(..))")

//匹配UserDaoImpl类中的所有公共的方法
@Pointcut("execution(public * com.zejian.dao.UserDaoImpl.*(..))")

//匹配UserDaoImpl类中的所有公共方法并且返回值为int类型
@Pointcut("execution(public int com.zejian.dao.UserDaoImpl.*(..))")

//匹配UserDaoImpl类中第一个参数为int类型的所有公共的方法
@Pointcut("execution(public * com.zejian.dao.UserDaoImpl.*(int , ..))")

```

##### 其他指示符
+ bean：Spring AOP扩展的，AspectJ没有对于指示符，用于匹配特定名称的Bean对象的执行方法；
```java
//匹配名称中带有后缀Service的Bean。
@Pointcut("bean(*Service)")
private void myPointcut1(){}
```
+ this ：用于匹配当前AOP代理对象类型的执行方法；请注意是AOP代理对象的类型匹配，这样就可能包括引入接口也类型匹配

```java
//匹配了任意实现了UserDao接口的代理对象的方法进行过滤
@Pointcut("this(com.zejian.spring.springAop.dao.UserDao)")
private void myPointcut2(){}
```
+ target ：用于匹配当前目标对象类型的执行方法；
```java
//匹配了任意实现了UserDao接口的目标对象的方法进行过滤
@Pointcut("target(com.zejian.spring.springAop.dao.UserDao)")
private void myPointcut3(){}
```

+ @within：用于匹配所有持有指定注解类型内的方法；请注意与within是有区别的， within是用于匹配指定类型内的方法执行；

```java
//匹配使用了MarkerAnnotation注解的类(注意是类)
@Pointcut("@within(com.zejian.spring.annotation.MarkerAnnotation)")
private void myPointcut4(){}
```