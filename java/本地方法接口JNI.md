## 浅析: JNI基本原理和实践

[TOC]

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

+ native 方法可以使用`同步锁`，java的同步锁都作用在对象上，原理上不冲突；
+ native方法可以`抛出异常`，抛出后JVM会帮我们接管；
+ native 方法可以被`Override`。最常见的native方法，就是Object.hashCode()，而String类 重写了 hashCode方法。



### 为什么要使用 Native Method

+ JVM不是一个完整的系统，它高度依赖于底层系统的支持，如最基本的Objetc.hashCode方法和反射
+ 需要与一些底层系统如操作系统或某些硬件交换信息
+ 现在的Java语言的定位更偏向于业务，对于底层比较遥远，中间的过度需要诸如C这种和底层亲密的语言来粘合。


### Native Method 运行过程

一个类第一次被使用到时，这个类的字节码会被加载到内存，并且只会加载一次。这个主要就是在类初始化方法中调用了registerNatives方法，这个方法由虚拟机实现，JVM会去帮我们注册本地方法。

```java
public class Object {

    private static native void registerNatives();
    static {
        registerNatives();
    }

```

在这个被加载的字节码的入口维持着一个该类所有方法描述符的list，这些方法描述符包含这样一些信息：`方法代码存于何处`，`它有哪些参数`，`方法的描述符（public之类）`等等。

如果一个方法的accessFlags 有native标识，这个方法的结构体将有一个指向该方法的实现的指针。这些实现在一些`DLL文件`内，但是它们会被操作系统加载到`java程序的地址空间`。当一个带有本地方法的类被加载时，其相关的DLL并未被加载，因此指向方法实现的指针并不会被设置。当本地方法被`调用之前`，这些DLL`才会`被加载，这是通过调用java.system.loadLibrary()实现的。


需要注意的是，OpenJDK 类库的本地方法是用JNI (Java Native Interface) 编写的，JVMS 并没有规定如何实现和调用本地方法，让我们有更多的想象空间。也就是说，上面说的 懒加载dll并不是一定的， 方法结构体也不一定就维护一个指向函数dll的指针。这只是一种实现。




### Unsafe 类 

Unsafe类提供了操作指针`直接访问内存`，直接`操作`内存数据的能力。为了支持 System类的运行，Unsafe的方法基本都是native方法。列举少许如下：


```java

    // 获取 数组的第一个元素 相对于 这个类的偏移量
    public native int arrayBaseOffset(Class<?> klass);

    // 获取数组 的步长， offset 是arr[0], offset+scale 就能得到arr[1]
    public native int arrayIndexScale(Class<?> klass);

    // 指针的size, sizeof(p),应该是8
    public native int addressSize();

    /** 获取field 的 slot属性
     *  - 对于实例，field是以slot占位置的
     *  - 可以理解为slot是一个int32，long和double占两个slot
     */
    public native long objectFieldOffset(Field field);
    /** CAS 操作
     *  - 对于数组，就是对arr[i] 做CAS操作
     *  - 对于非数组，就是 对 offset 上的属性，做CAS操作
     */
    public final native boolean compareAndSwapObject(Object oop, long offset, Object expected, Object updateValue);
    // CAS ,操作的是int
    public final native boolean compareAndSwapInt(Object obj, long offset, int expected, int updateValue);
    // CAS， 操作的是long
    public final native boolean compareAndSwapLong(Object obj, long offset, long expected, long updateValue);

    public native int getIntVolatile(Object obj, long offset);
    public native Object getObject(Object obj, long offset);


    /*****************   内存操作  **************/

    // 分配 size个byte，返回地址
    public native long allocateMemory(long size);
    public native void freeMemory(long address);
    // 对 [address,address+size] 重新分配
    public native long reallocateMemory(long address, long size);
    
    public native byte getByte(Object obj, long var2);
    public native void putLong(long address, long value);


```

#### CAS原理

看一下 `Unsafe_CompareAndSwapInt`。(hotspot-8\src\share\vm\prims\unsafe.cpp)

```cpp
UNSAFE_ENTRY(jboolean, Unsafe_CompareAndSwapInt(JNIEnv *env, jobject unsafe, jobject obj, jlong offset, jint e, jint x))
  UnsafeWrapper("Unsafe_CompareAndSwapInt");
  oop p = JNIHandles::resolve(obj);
  jint* addr = (jint *) index_oop_from_field_offset_long(p, offset);
  return (jint)(Atomic::cmpxchg(x, addr, e)) == e;
UNSAFE_END
```

这里核心的调用时是`Atomic::cmpxchg(x, addr, e)`，从名字上看，这是一个原子操作。(hotspot-8\src\share\vm\runtime\atomic.cpp)

```cpp
unsigned Atomic::cmpxchg(unsigned int exchange_value,
                         volatile unsigned int* dest, unsigned int compare_value) {
  assert(sizeof(unsigned int) == sizeof(jint), "more work to do");
  return (unsigned int)Atomic::cmpxchg((jint)exchange_value, (volatile jint*)dest,
                                       (jint)compare_value);
}
```

最终实现取决于底层OS，比如linux x86，实现内联在hotspot部分代码：(hotspot-8\src\os_cpu\linux_x86\vm\atomic_linux_x86.inline.hpp)
```cpp
// Adding a lock prefix to an instruction on MP machine
#define LOCK_IF_MP(mp) "cmp $0, " #mp "; je 1f; lock; 1: "


inline jint     Atomic::cmpxchg    (jint     exchange_value, volatile jint*     dest, jint     compare_value) {
  int mp = os::is_MP();
  __asm__ volatile (LOCK_IF_MP(%4) "cmpxchgl %1,(%3)"
                    : "=a" (exchange_value)
                    : "r" (exchange_value), "a" (compare_value), "r" (dest), "r" (mp)
                    : "cc", "memory");
  return exchange_value;
}
```


从上面的代码中可以看到，如果是CPU是`多核`(multi processors)的话，会添加一个lock;前缀，这个lock;前缀也是`内存屏障`，它的作用是在执行后面指令的过程中`锁总线`(或者是锁cacheline)，保证一致性。后面的指令`cmpxchgl`就是x86的比较并交换指令了(汇编指令)。

这里能大致的理解为：从汇编层面 利用 `cmpxchgl` 做原子写入，而加锁，是给指令加的，汇编语言不了解，姑且跳过。打住了。


参考：[Jdk1.6 JUC源码解析(1)-atomic-AtomicXXX](https://brokendreams.iteye.com/blog/2250109)



### System 类和 输入输出流

输入输出流是在 线程初始化的时候绑定到System 类的静态属性上的。

```java
public final class System {

    public final static InputStream in = null;
    public final static PrintStream out = null;
    public final static PrintStream err = null;    
    /* 
     * 通过静态初始化注册native方法
     * 
     * 虚拟机 会调用 System.initializeSystemClass() 来完成这个类初始化
     */
    private static native void registerNatives();
    static {
        registerNatives();
    }

    /**
     * Initialize the system class.  Called after thread initialization.
     */
    private static void initializeSystemClass() {
        props = new Properties();
        initProperties(props);  // initialized by the VM
        ...

        FileInputStream fdIn = new FileInputStream(FileDescriptor.in);
        FileOutputStream fdOut = new FileOutputStream(FileDescriptor.out);
        FileOutputStream fdErr = new FileOutputStream(FileDescriptor.err);
        setIn0(new BufferedInputStream(fdIn));
        setOut0(newPrintStream(fdOut, props.getProperty("sun.stdout.encoding")));
        setErr0(newPrintStream(fdErr, props.getProperty("sun.stderr.encoding")));
        ...
    }

```

线程初始化，会加载System类，执行类初始化方法`<clinit>`，`<clinit>` 是 代码中 静态变量赋初始值的语句 和静态代码块的语句集合。


一般的，如果一个类有`native`方法，会在静态代码块调用 `registerNatives()`来注册native函数。 registerNatives 是由JVM实现的。特殊的，在System 的静态代码块中，官方注释中说 registerNatives  会调用 System.initializeSystemClass()。在 openJDK 的目录下可以找到(jdk-8\src\share\native\java\lang\System.c )。

```cpp

JNIEXPORT void JNICALL
Java_java_lang_System_registerNatives(JNIEnv *env, jclass cls)
{
    (*env)->RegisterNatives(env, cls,
                            methods, sizeof(methods)/sizeof(methods[0]));
}
```
JNI方法 的命名是 包路径_方法名，以下划线分隔。

后面的内容不再深入，先打住。在同一个文件下，再看一下对out，err,的初始化。 

```cpp

JNIEXPORT void JNICALL
Java_java_lang_System_setIn0(JNIEnv *env, jclass cla, jobject stream)
{
    jfieldID fid =
        // 得到属性id
        (*env)->GetStaticFieldID(env,cla,"in","Ljava/io/InputStream;");
    if (fid == 0)
        return;
    // 根据属性id，设置实例 的属性
    (*env)->SetStaticObjectField(env,cla,fid,stream);
}

JNIEXPORT void JNICALL
Java_java_lang_System_setOut0(JNIEnv *env, jclass cla, jobject stream)
{
    jfieldID fid =
        (*env)->GetStaticFieldID(env,cla,"out","Ljava/io/PrintStream;");
    if (fid == 0)
        return;
    (*env)->SetStaticObjectField(env,cla,fid,stream);
}

JNIEXPORT void JNICALL
Java_java_lang_System_setErr0(JNIEnv *env, jclass cla, jobject stream)
{
    jfieldID fid =
        (*env)->GetStaticFieldID(env,cla,"err","Ljava/io/PrintStream;");
    if (fid == 0)
        return;
    (*env)->SetStaticObjectField(env,cla,fid,stream);
}

```



System类的启动还需要 FileInputStream 的一些native方法支持。
找到FileInputStream.initIDs。 JDoc没有说时干嘛的，被迫去看openJDK。(jdk-8\src\share\native\java\io\FileInputStream.c)


```cpp
jfieldID fis_fd; /* id for jobject 'fd' in java.io.FileInputStream */
/**************************************************************
 * static methods to store field ID's in initializers
 */
Java_java_io_FileInputStream_initIDs(JNIEnv *env, jclass fdClass) {
    fis_fd = (*env)->GetFieldID(env, fdClass, "fd", "Ljava/io/FileDescriptor;");
}
```

fis_id 应该是 fd对象在 FileInputStream 中的id，类似于实例槽。fd应该是类似于文件句柄。

抛砖引玉，到此打住！



### 实战：怎么写一个JNI:


参考：

+ [【java】详解native方法的使用](https://www.cnblogs.com/HDK2016/p/7226840.html?utm_source=itdadao&utm_medium=referral)




