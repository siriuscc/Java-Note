[TOC]


## Reflection


反射 (Reflection) 是 Java 的特征之一，它允许运行中的 Java 程序获取自身的信息，并且可以操作类或对象的内部属性。

> Reflection enables Java code to `discover information about the fields, methods and constructors` of loaded classes, and to use reflected fields, methods, and constructors to operate on their underlying counterparts, within security restrictions.
The API accommodates applications that need access to either the public members of a target object (based on its runtime class) or the members declared by a given class. It also allows programs to suppress default reflective access control.



### 反射的底层原理











### 反射的作用：

+ 在`运行时`判断任意一个对象所属的类；
+ 在`运行时`构造任意一个类的对象；
+ 在`运行时`判断任意一个类所具有的成员变量和方法（包括private）；


### 反射的常见用途：

+ 在IDEA中编码，输入对象后按. IDEA会给提示属性和方法列表。
+ 在Spring，我们在配置文件中配置类的全路径，Spring 就会自动帮我们生成bean

### 反射的运用


#### 获得 Class 对象

1. 使用Class类的forName()静态方法：
```java
Class.forName("com.mysql.jdbc.Driver");
```

2. 调用某个Class的class属性来获取该类对应的Class对象。

```java
Class<?> klass=Person.class;
Class<?> classInt = Integer.TYPE;
```
3. 调用某个对象的 getClass() 方法，比如:
```java
StringBuilder str = new StringBuilder("123");
Class<?> klass = str.getClass();
```


#### 判断是否为某个类的实例

`instanceof` 或者Object::inInstance()都可以


```java
public native boolean isInstance(Object obj);
```
那区别呢：

记得instanceof 在Jvm是有对应的指令的，而isInstance()方法显然调用本地方法，可以理解为是调用了外部的方法；


#### 创建实例

通过反射来生成对象主要有两种方式。

使用Class对象的newInstance()方法来创建Class对象对应类的实例。

```java
Class<?> oclass = String.class;
Object str = oclass.newInstance();
```
```java
//获取String所对应的Class对象
Class<?> oclass = String.class;
//获取String类带一个String参数的构造器
Constructor constructor = oclass.getConstructor(String.class);
//根据构造器创建实例
Object obj = constructor.newInstance("23333");
System.out.println(obj);
```


#### 获取方法




```java
/**
 * 返回类或接口声明的所有方法
 * public、protected、default and private，但不包括继承的方法。
 * 对 私有方法操作，需要设置method.setAccessible(true)
 */
public Method[] getDeclaredMethods() throws SecurityException;

/**
 *  返回所有public 方法，包括继承的
 *  
 */
public Method[] getMethods() throws SecurityException;

/**
 * 返回特定的方法，
 * @param name the name of the method
 * @param parameterTypes the list of parameters
 * @return the {@code Method} object that matches the specified
 *    {@code name} and {@code parameterTypes}
 */
public Method getMethod(String name, Class<?>... parameterTypes);

```


实例：
```java
        Class<? extends Children> oclass = (Class<? extends Children>) Class.forName("Children");
        Children children = oclass.newInstance();
        Method method = oclass.getDeclaredMethod("print");
        // 不开将会抛异常
        method.setAccessible(true);
        method.invoke(children);
```



#### 获取类的成员变量（字段）信息


getFiled：访问公有的成员变量
getDeclaredField：所有已声明的成员变量，但不能得到其父类的成员变量
getFileds 和 getDeclaredFields 方法用法同上（参照 Method）。



```java

/**
 * 返回public属性数组
 * @return the array of {@code Field} objects representing the public fields
 */
public Field[] getFields() throws SecurityException ;


/**
 * 所有已声明的成员变量，但不能得到其父类的成员变量
 * 这里如果访问私有属性的方法，需要调用field.field.setAccessible(true);
 */
public Field[] getDeclaredFields() throws SecurityException;

```


#### 调用方法

```java
public Object invoke(Object obj, Object... args)
        throws IllegalAccessException, IllegalArgumentException,
           InvocationTargetException
```


参考：
+ [Java Reflection - Private Fields and Methods](http://tutorials.jenkov.com/java-reflection/private-fields-and-methods.html)
+ [【译】7. Java反射——私有字段和私有方法](https://www.cnblogs.com/penghongwei/p/3300084.html)