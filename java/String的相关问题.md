## 浅析：Java String类的相关问题

[TOC]


+ String类 里面维护一个fianl 的char[] 数组来维护字符，不能被重新赋值；
+ String类不能被继承，因为 它 是public final 类
+ 对String 的截断，加法，都会导致产生新的String对象

### value属性



```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];

    public String(char value[]) {
        this.value = Arrays.copyOf(value, value.length);
    }
```

```java
public class Arrays {
    public static char[] copyOf(char[] original, int newLength) {
        char[] copy = new char[newLength];
        System.arraycopy(original, 0, copy, 0,
                         Math.min(original.length, newLength));
        return copy;
    }
```


可以看到，value 属性是在了类的初始化方法被赋值，value属性被final修饰，意味着无法对value重新赋值，扩容缩容在Sting类都不能实现了。String类也没有提供直接操作某个字符的函数。


然而，反射可以做到任何事情，包括 直接修改value的值，无视final标志的约束，包括修改某个字符。


```java
    public static void main(String[] args) throws Exception {

        String s = "HelloWorld";
        s.concat("Good");

        Field[] declaredFields = s.getClass().getDeclaredFields();

        for (Field field : declaredFields) {
            field.setAccessible(true);
            if (field.getName() == "value") {
                Object o = field.get(s);    // HelloWorld
                char[] value = (char[]) o;
                System.out.println(s);

                value[3] = 'T';
                System.out.println(s);  // HelToWorld

                char[] s1 = "reflect is powerful".toCharArray();
                field.set(s, s1);
            }
        }

        System.out.println(s);  //reflect is powerful
    }
```



当然，没有谁会无聊到写十几行代码去操作value属性，因为 直接new一个的成本并不高。



### String intern

Java 规定， 完全相同的字面量 必须指向同一个 String实例。另外，如果 String.intern 调用了，任何相同内容的string的调用结果都指向同一个String实例。

```java
("a" + "b" + "c").intern() == "abc"
```

也就说，对于String.intern：

+ 如果常量池中已经定义对应的常量，直接返回引用
+ 如果不存在对应的常量，将会在常量池创建常量并 返回常量池对应的指针



所以，对于String a="ab",String b="a"+"b"，两者相等。因为 a=“ab”会固化到常量池，“a”+"b" 的结果是常量池有的，直接指向过去。









### String 加法 和 StringBuilder

String 类的初始化时机：

+ 第一次用到，
+ 第一次 执行new
+ 第一次静态调用属性或方法




```java
    public static void main(String[] args) {

        String v1="Hello";
        String v2="wrold";

        String v3=v1+v2;
        System.out.println(v3);
    }
```

```code
  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=4, args_size=1
         0: ldc           #3                  // opStack: String("Hello");
         2: astore_1                          // v1="Hello", opStack:;
         3: ldc           #4                  // opStack：String(wrold)
         5: astore_2                          // v2="world",opStack:;
         6: new           #5                  // class java/lang/StringBuilder
         9: dup                               // opStack: builder,builder
        10: invokespecial #6                  // builder."<init>":()V
        13: aload_1                           // opStack:builder,v1;
        14: invokevirtual #7                  // builder=builder.append(v1),opStack:builder;
        17: aload_2                           // opStack:builder,v2
        18: invokevirtual #7                  // opStack:builder
        21: invokevirtual #8                  // builder, "Hello wrold"
        24: astore_3                          // 
        25: getstatic     #9                  // Field java/lang/System.out:Ljava/io/PrintStream;
        28: aload_3
        29: invokevirtual #10                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        32: return
}
```

从反编译的源码来看，真实的源码是这样的：

```java
    public static void main(String[] args) {

        String v1="Hello";
        String v2="wrold";

        String v3=new StringBuilder().append(v1).append(v2).toString();
        System.out.println(v3);
    }
```
这里注意 变量的的命名也是故意的
+ v1表示对应局部变量表（locals） 的第一个槽位。
+ locals[0]就是args



然后详细再看下去，先看 `StringBuilder` 的 `<init>()V` 函数


```java
public final class StringBuilder 
    extends AbstractStringBuilder
    implements java.io.Serializable, CharSequence

    public StringBuilder() {
        super(16);
    }
...
```
父类是一个抽象类，构造时，new了一个char数组
```java
abstract class AbstractStringBuilder implements Appendable, CharSequence {

    AbstractStringBuilder(int capacity) {
        value = new char[capacity];
    }
...
```

所以默认是16长度的char[]数组，count是真实的当前长度。




再看append。

```java
    @Override
    public StringBuilder append(String str) {
        super.append(str);
        return this;
    }
```



```java
abstract class AbstractStringBuilder implements Appendable, CharSequence {

    public AbstractStringBuilder append(String str) {
        
        if (str == null)
            return appendNull();
        int len = str.length();
        // 预估 拼接后的长度是否够放，不够就扩容
        ensureCapacityInternal(count + len);
        // 把 str[0,len) copy 到 value[count,count+len)
        str.getChars(0, len, value, count);
        // 更新count
        count += len;
        return this;
    }
...
```

一步步跟踪进去，会发现 str.getChars 使用了：

```java
public final class System {
    public static native void arraycopy(Object src,  int  srcPos,
                                        Object dest, int destPos,
                                        int length);
···
```

这里其实就是数组复制，没啥好说的啦，但是注意是native方法，由JVM实现。


### StringBuffer and StringBuilder


+ StringBuffer ：线程安全
+ StringBuilder: 线程不安全



```java

public final class StringBuffer
    extends AbstractStringBuilder
    implements java.io.Serializable, CharSequence{

    private transient char[] toStringCache;
    public StringBuffer() {
        super(16);
    }


    @Override
    public synchronized StringBuffer append(String str) {
        toStringCache = null;
        super.append(str);
        return this;
    }
```
StringBuffer 的线程安全就是通过synchronized 关键字实现的。完事。


