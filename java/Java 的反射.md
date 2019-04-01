## Reflection: 反射

[TOC]






反射 (Reflection) 是 Java 的特征之一，它允许`运行中`的 Java 程序获取自身的信息，并且可以操作类或对象的内部属性。

> Reflection enables Java code to `discover information about the fields, methods and constructors` of loaded classes, and to use reflected fields, methods, and constructors to operate on their underlying counterparts, within security restrictions.
The API accommodates applications that need access to either the public members of a target object (based on its runtime class) or the members declared by a given class. It also allows programs to suppress default reflective access control.

### SoftReference：
假设一个对象仅仅具有软引用，则内存空间足够，垃圾回收器就不会回收它；假设内存空间不足了，就会回收这些对象的内存。仅仅要垃圾回收器没有回收它，该对象就能够被程序使用。软引用可用来实现内存敏感的快速缓存。




### 反射的底层原理

```java
    String a="abc";
    Method method = String.class.getDeclaredMethod("equals",Object.class);
    System.out.println(method.invoke(a, "abc"));
```


```java
public final class Class<T> implements java.io.Serializable,
                              GenericDeclaration,
                              Type,
                              AnnotatedElement {

    private volatile transient SoftReference<ReflectionData<T>> reflectionData;
    /**
     * 返回对应方法，name为名称，papameterTypes为参数
     * Java 中名称和参数列表区分函数，JVM则包含返回值
     */
    @CallerSensitive
    public Method getDeclaredMethod(String name, Class<?>... parameterTypes)
        throws NoSuchMethodException, SecurityException {
        checkMemberAccess(Member.DECLARED, Reflection.getCallerClass(), true);
        //得到所有的方法，在其中搜索，返回        
        Method method = searchMethods(privateGetDeclaredMethods(false), name, parameterTypes);
        if (method == null) {
            throw new NoSuchMethodException(getName() + "." + name + argumentTypesToString(parameterTypes));
        }
        return method;
    }

    /**
     * 返回一个根方法数据对象
     */
    private Method[] privateGetDeclaredMethods(boolean publicOnly){
        checkInitted();
        Method[] res;
        // 获取缓存数据
        ReflectionData<T> rd = reflectionData();
        if (rd != null) {
            res = publicOnly ? rd.declaredPublicMethods : rd.declaredMethods;
            if (res != null) return res;
        }
        // 没有缓存数据可用；getDeclaredMethods0 到JVM中请求数据
        res = Reflection.filterMethods(this, getDeclaredMethods0(publicOnly));
        if (rd != null) {
            if (publicOnly) {
                rd.declaredPublicMethods = res;
            } else {
                rd.declaredMethods = res;
            }
        }
        return res;
    }

    // 懒创建和 缓存 ReflectionData 
    private ReflectionData<T> reflectionData() {
        // 这里是一个软引用,get()可能为空
        SoftReference<ReflectionData<T>> reflectionData = this.reflectionData;
        int classRedefinedCount = this.classRedefinedCount;
        ReflectionData<T> rd;
        if (useCaches &&
            reflectionData != null &&
            (rd = reflectionData.get()) != null &&
            rd.redefinedCount == classRedefinedCount) {
            return rd;
        }
        // else no SoftReference or cleared SoftReference or stale ReflectionData
        // -> create and replace new instance
        return newReflectionData(reflectionData, classRedefinedCount);
    }

    // 反射数据存储结构
    private static class ReflectionData<T> {
        volatile Field[] declaredFields;
        volatile Field[] publicFields;
        volatile Method[] declaredMethods;
        volatile Method[] publicMethods;
        volatile Constructor<T>[] declaredConstructors;
        volatile Constructor<T>[] publicConstructors;
        // Intermediate results for getFields and getMethods
        volatile Field[] declaredPublicFields;
        volatile Method[] declaredPublicMethods;
        volatile Class<?>[] interfaces;

        // Value of classRedefinedCount when we created this ReflectionData instance
        final int redefinedCount;

        ReflectionData(int redefinedCount) {
            this.redefinedCount = redefinedCount;
        }
    }
```

这里使用ReflectionData 来缓存从JVM拿到的反射信息， reflectionData 是软引用，有可能为空。reflectionData 方法先从缓存拿数据，拿不到就创建一个。

transient： 不参与序列化





### 反射的作用：

+ 在`运行时`判断任意一个对象所属的类；
+ 在`运行时`构造任意一个类的对象；
+ 在`运行时`判断任意一个类所具有的成员变量和方法（包括private）；









### 反射的常见用途

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
Class<?> oop=Person.class;
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


