---
title: "Java 8 学习笔记"
author: zengxiquan
date: 08 22, 2005
output: pdf_document
---




[TOC]



### stream 函数式编程

#### 提取属性

```java

	List<Long> collect = skuList.stream().map(Sku::getId)
		.collect(Collectors.toList());
```


#### 过滤器

```java {.line-numbers}
List<Long>ids=new ArrayList<>();

List<Person> personList = persons.stream().filter(// 过滤去重
		   v -> {
		   boolean flag = !ids.contains(v.getId());
		   ids.add(v.getId());
		   return flag;
		   }
	   ).collect(Collectors.toList());
```


#### 过滤，组合排序，遍历处理

```java
persons.stream()
	.filter(p -> p.getAge() >= 18)//获取所有18岁以上的用户
	.sorted(Comparator.comparing(Person::getAge))//依年纪升序排序
	.sorted(Comparator.comparing(Person::getAge).reversed())//依年纪降序排序
	.collect(Collectors.toList())
	.forEach(System.out::println);
```


#### list转map
```java
	Map<Long,Sku> skuMap=skuListFromDb.stream().collect(Collectors.toMap(v->v.getSkuId(),v->v));
```


### lambda


匿名：没有名字
函数：lambda函数，函数也即意味着他不属于类，属于类的叫方法
传递：可以作为变量传递



#### 函数式接口


只定义了一个抽象方法的接口


```java

public interface Comparator<T>(
	int compare(T o1,T o2);
)

public interface Runnable{
	void run();
}

public interface Callbale<V>{
	V call();
}
```

#### 函数描述符

函数式接口的抽象方法的签名基本上就是Lambda表达式的签名。我们将这种抽象方法叫作函数描述符。
lambda 的 函数描述需要和 抽象接口的函数描述一致

```java
//描述符：()-> void
void run();

//(Apple,Apple) -> int
int swap(Apple a,Apple b);
```


@FunctionalInterface 注解表示必须只有一个抽象方法，也就是必须是函数式接口！





#### 实战：lambda 函数式过滤

```java
@FunctionalInterface
public interface Predicate<T>{
	boolean test(T t);
}

public static <T> List<T> filter(List<T> list,Predicate<T> p){
	List<T> results=new ArrayList<>();
	for(T s:list){
		if(p.test(s)){
			results.add(s);
		}
	}
	return results;
}

Predicates<String>nonEmptyStringPredicate=(String s)->!s.isEmpty();
List<String> nonEmpty=filter(listOfStrings,nonEmptyStringPredicate);


```








```java
@FunctionalInterface
public interface Consumer<T>{
	void accept(T t);
}
public static <T> void forEach(List<T> list, Consumer<T> c){

	for(T i: list){
		c.accept(i);
	}
}

forEach(Arrays.asList(1,2,3,4,5),(Integer i) -> System.out.println(i));
```





将T映射到R
```java
@FunctionalInterface
public interface Function<T, R>{
	R apply(T t);
}

public static <T, R> List<R> map(List<T> list,
	Function<T, R> f) {
	List<R> result = new ArrayList<>();
	for(T s: list){
		result.add(f.apply(s));
	}
	return result;
}
// [7, 2, 6]
List<Integer> l = map(
	Arrays.asList("lambdas","in","action"),
	(String s) -> s.length()
);
```





避免自动装箱拆箱
```java
public interface IntPredicate{
	boolean test(int t);
}
```
