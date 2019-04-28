## equals and hashCode

[TOC]

对于equals和hashCode 方法，Java建议在重写时应当满足规定：

+ 如果两对象equals为true，hashCode也应该一致
+ 重写equals就必须重写hashCode



在map中，关于equals和hashCode存在：

+ hashCode一致，equals不一致，对应同一个Node，这个Node上维护链表。
+ hashCode和equals都一致，认为是同一个对象
+ hashCoed 不一致，存在两个Node上。


### String hashCode

对于String类， hash值就是对每个字符，关于31 做散列。String的父类是Object，因为Override了hashCode，所以也重写equals，逐个字符判断是否相等。

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {

    private final char value[];

    public int hashCode() {
        int h = hash;
        if (h == 0 && value.length > 0) {
            char val[] = value;

            for (int i = 0; i < value.length; i++) {
                h = 31 * h + val[i];
            }
            hash = h;
        }
        return h;
    }
    public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        if (anObject instanceof String) {
            String anotherString = (String)anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                        return false;
                    i++;
                }
                return true;
            }
        }
        return false;
    }

```


### Object的hashCode


对于不同的对象Object.hashCode ，根据默认的算法，会根据 对象地址 返回不同的hashCode。

hashCode的实现，Java中约定：

+ 一致性：当 对象的属性没有发生改变时，无论何时调用，都应该返回相同的结果。
+ 如果 a.equals(b)，那么a.hashCode()==b.hashCode()
+ 如果 !a.equals(b),那么 a的hashCode 不需要一定不等于b.hashCode()，但是如果这样，可以提高性能。


```java

    /**
     * Returns a hash code value for the object. This method is
     * supported for the benefit of hash tables such as those provided by
     * {@link java.util.HashMap}.
     * <p>
     * The general contract of {@code hashCode} is:
     * <ul>
     * <li>Whenever it is invoked on the same object more than once during
     *     an execution of a Java application, the {@code hashCode} method
     *     must consistently return the same integer, provided no information
     *     used in {@code equals} comparisons on the object is modified.
     *     This integer need not remain consistent from one execution of an
     *     application to another execution of the same application.
     * <li>If two objects are equal according to the {@code equals(Object)}
     *     method, then calling the {@code hashCode} method on each of
     *     the two objects must produce the same integer result.
     * <li>It is <em>not</em> required that if two objects are unequal
     *     according to the {@link java.lang.Object#equals(java.lang.Object)}
     *     method, then calling the {@code hashCode} method on each of the
     *     two objects must produce distinct integer results.  However, the
     *     programmer should be aware that producing distinct integer results
     *     for unequal objects may improve the performance of hash tables.
     * </ul>
     * <p>
     * As much as is reasonably practical, the hashCode method defined by
     * class {@code Object} does return distinct integers for distinct
     * objects. (This is typically implemented by converting the internal
     * address of the object into an integer, but this implementation
     * technique is not required by the
     * Java&trade; programming language.)
     *
     * @return  a hash code value for this object.
     * @see     java.lang.Object#equals(java.lang.Object)
     * @see     java.lang.System#identityHashCode
     */
    public native int hashCode();
```


### JVM 中 Object.hashCode 的实现细节


实现Object.hashCode

在 jdk-8\src\share\native\java\lang\Object.c，可以看到前面有一段：

```cpp
static JNINativeMethod methods[] = {
    {"hashCode",    "()I",                    (void *)&JVM_IHashCode},
    {"wait",        "(J)V",                   (void *)&JVM_MonitorWait},
    {"notify",      "()V",                    (void *)&JVM_MonitorNotify},
    {"notifyAll",   "()V",                    (void *)&JVM_MonitorNotifyAll},
    {"clone",       "()Ljava/lang/Object;",   (void *)&JVM_Clone},
};

JNIEXPORT void JNICALL
Java_java_lang_Object_registerNatives(JNIEnv *env, jclass cls)
{
   
    (*env)->RegisterNatives(env, cls,
                            methods, sizeof(methods)/sizeof(methods[0]));
}
```

这里将 `hashCode()` 映射到 `(void *)&JVM_IHashCode` 这个函数。

关于`(void *)&JVM_IHashCode` 的定义，在openJDK中。(jdk-8\src\share\javavm\export\jvm.h)


```cpp
/*
 * java.lang.Object
 */
JNIEXPORT jint JNICALL
JVM_IHashCode(JNIEnv *env, jobject obj);
```

作为JVM 的implement，hotspot8实现了这个方法。 (hotspot-8\src\share\vm\prims\jvm.cpp)

```cpp
// java.lang.Object ///////////////////////////////////////////////

JVM_ENTRY(jint, JVM_IHashCode(JNIEnv* env, jobject handle))
  JVMWrapper("JVM_IHashCode");
  // as implemented in the classic virtual machine; return 0 if object is NULL
  return handle == NULL ? 0 : ObjectSynchronizer::FastHashCode (THREAD, JNIHandles::resolve_non_null(handle)) ;
JVM_END
```

如果 对象的handle 为null，返回0，否则调用 FastHashCode。继续跟进去，看到最后生成的逻辑。 直接看到hash值的生成过程,在 `get_next_hash` 方法，就是详细的hash逻辑。(hotspot-8\src\share\vm\runtime\synchronizer.cpp)：

```cpp
// hashCode() generation :
//
// Possibilities:
// * MD5Digest of {obj,stwRandom}
// * CRC32 of {obj,stwRandom} or any linear-feedback shift register function.
// * A DES- or AES-style SBox[] mechanism
// * One of the Phi-based schemes, such as:
//   2654435761 = 2^32 * Phi (golden ratio)
//   HashCodeValue = ((uintptr_t(obj) >> 3) * 2654435761) ^ GVars.stwRandom ;
// * A variation of Marsaglia's shift-xor RNG scheme.
// * (obj ^ stwRandom) is appealing, but can result
//   in undesirable regularity in the hashCode values of adjacent objects
//   (objects allocated back-to-back, in particular).  This could potentially
//   result in hashtable collisions and reduced hashtable efficiency.
//   There are simple ways to "diffuse" the middle address bits over the
//   generated hashCode values:
static inline intptr_t get_next_hash(Thread * Self, oop obj) {
  intptr_t value = 0 ;
  if (hashCode == 0) {
     // This form uses an unguarded global Park-Miller RNG,
     // so it's possible for two threads to race and generate the same RNG.
     // On MP system we'll have lots of RW access to a global, so the
     // mechanism induces lots of coherency traffic.
     value = os::random() ;
  } else
  if (hashCode == 1) {
     // This variation has the property of being stable (idempotent)
     // between STW operations.  This can be useful in some of the 1-0
     // synchronization schemes.
     intptr_t addrBits = cast_from_oop<intptr_t>(obj) >> 3 ;
     value = addrBits ^ (addrBits >> 5) ^ GVars.stwRandom ;
  } else
  if (hashCode == 2) {
     value = 1 ;            // for sensitivity testing
  } else
  if (hashCode == 3) {
     value = ++GVars.hcSequence ;
  } else
  if (hashCode == 4) {
      // 直接用内存地址
     value = cast_from_oop<intptr_t>(obj) ;
  } else {
     // Marsaglia's xor-shift scheme with thread-specific state
     // This is probably the best overall implementation -- we'll
     // likely make this the default in future releases.
     unsigned t = Self->_hashStateX ;
     t ^= (t << 11) ;
     Self->_hashStateX = Self->_hashStateY ;
     Self->_hashStateY = Self->_hashStateZ ;
     Self->_hashStateZ = Self->_hashStateW ;
     unsigned v = Self->_hashStateW ;
     v = (v ^ (v >> 19)) ^ (t ^ (t >> 8)) ;
     Self->_hashStateW = v ;
     value = v ;
  }

  value &= markOopDesc::hash_mask;
  if (value == 0) value = 0xBAD ;
  assert (value != markOopDesc::no_hash, "invariant") ;
  TEVENT (hashCode: GENERATE) ;
  return value;
}
```


+ hashcode=1，使用最简单的随机算法。
+ hashcode=4，直接使用的内存地址。
+ 默认使用的是hashcode>=5的 `xor-shift scheme`算法。 可以用JVM parameter -XX:hashCode来调整。

`xor-shift scheme`使用位移和异或运算生成随机数, 所以运算速度非常快(移位指令需要的机器周期更少).






### Set 的 hashCode

对于集合类，就是每个对象的hashCode的累加。这样做的好处是：`顺序无关`。
```java

public abstract class AbstractSet<E> extends AbstractCollection<E> implements Set<E> {

    public int hashCode() {
        int h = 0;
        Iterator<E> i = iterator();
        while (i.hasNext()) {
            E obj = i.next();
            if (obj != null)
                h += obj.hashCode();
        }
        return h;
    }
}
```


### List 的 hashCode


用31做散列，做到了顺序相关。

```java
public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {

    public int hashCode() {
        int hashCode = 1;
        for (E e : this)
            hashCode = 31*hashCode + (e==null ? 0 : e.hashCode());
        return hashCode;
    }
}
```



### Map 的 hashCode

map 其实就是set类的`包装类`，典型的装饰器模式。和 set类似，hashCode是每个entry的hashCode 总和。


```java
public abstract class AbstractMap<K,V> implements Map<K,V> {
    
    public abstract Set<Entry<K,V>> entrySet();

    public int hashCode() {
        int h = 0;
        Iterator<Entry<K,V>> i = entrySet().iterator();
        while (i.hasNext())
            h += i.next().hashCode();
        return h;
    }
}
```

对于HashSet，实现了特殊的Entry，也就是Node节点。每个Entry的 hash都是key.hashCode*value.hashCode。 而在ConcurrentHashMap中，也是如此。

```java
    static class Node<K,V> implements Map.Entry<K,V> {
       
        public final int hashCode() {

            return Objects.hashCode(key) ^ Objects.hashCode(value);
        }

        public final boolean equals(Object o) {
            if (o == this)
                return true;
            if (o instanceof Map.Entry) {
                Map.Entry<?,?> e = (Map.Entry<?,?>)o;
                if (Objects.equals(key, e.getKey()) &&
                    Objects.equals(value, e.getValue()))
                    return true;
            }
            return false;
        }
    }
```



总结：

+ hashCode 和equals的约束，不过是建议性的，或者说是约定，并`不强制`。
+ hashCode相等，并不能表示两个对象一致，正确的做法是重写 equals方法
+ 大多数类的hashCode方法都和Object的hashCode方法相关
+ 对于map的元素，每个item，如equals相同，而hashCode不同，有利于`散列`。
+ Object类的hashCode函数是native函数，为了避免频繁做JNI调用，大多数类对hash值做了`缓存`。
