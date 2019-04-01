

## JNI: Java Native Interface


> A native method is a Java method whose implementation is provided by non-java code.

在定义一个native method时，并不提供实现体（有些像定义一个java interface），因为其实现体是由非java语言在外面实现的。

```java 

public class IHaveNatives
{
    native public void Native1( int x ) ;
    native static public long Native2() ;
    // 可以使用同步锁
    native synchronized private float Native3( Object o ) ;
    // 可以抛出异常
    native void Native4( int[] ary ) throws Exception ;
} 
```

### 为什么要使用 Native Method

+ 与操作系统交互：JVM不是一个完整的系统，它依赖于底层系统的支持，需要与一些底层系统如操作系统或某些硬件交换信息


### Native Method 运行过程

一个类第一次被使用到时，这个类的字节码会被加载到内存，并且只会加载一次。

在这个被加载的字节码的入口维持着一个该类所有方法描述符的list，这些方法描述符包含这样一些信息：`方法代码存于何处`，`它有哪些参数`，`方法的描述符（public之类）`等等。

如果一个方法描述符内有native，这个`描述符块`将有一个指向该方法的实现的指针。这些实现在一些`DLL文件`内，但是它们会被操作系统加载到`java程序的地址空间`。当一个带有本地方法的类被加载时，其相关的DLL并未被加载，因此指向方法实现的指针并不会被设置。当本地方法被`调用之前`，这些DLL`才会`被加载，这是通过调用java.system.loadLibrary()实现的。




怎么写一个JNI:

https://www.cnblogs.com/HDK2016/p/7226840.html?utm_source=itdadao&utm_medium=referral