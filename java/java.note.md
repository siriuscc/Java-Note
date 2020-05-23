[TOC]

private修饰的方法可以通过反射访问，那么private的意义是什么

+ private 并不是强制约束，他只是常规使用java的约束，并不是为了绝对隔离而设计的；
+ 从外部调用时，更提供清晰的外部视图，对外屏蔽私有变量；


Java类初始化顺序：

1. 基类 静态代码块和静态变量赋值语句（看语句顺序）
2. 派生类 静态代码块和静态变量赋值语句
3. 基类 非静态代码块 和变量赋值语句
4. 派生类 非静态代码块 和变量赋值语句
5. 基类构造函数
6. 派生类构造函数


## 重载和重写


- 重载通过参数的`静态类型`判断，静态类型`编译期已知`
- Override:重写是`动态`的，在运行期才知道；是多态的基石。


```java

// 左边是静态类型，右边是动态类型
Human man=new Man();

```




## java 的基本数据类的底层存储



|基本类型|底层长度bit|默认值|数据范围|
|:-:|:-:|:-:|:-:|
|byte   |8    |0    |$-2^{7} \to 2^{7}-1$|
|short  |16   |0    |$-2^{15} \to 2^{15}-1 $ |
|int    |32   |0    |$-2^{31} \to 2^31-1 $|
|long   |64   |0L   |$-2^{61} \to 2^{61} -1$
|char   |16   |\u0000|\u0000 ~ \uffff|
|float  |32   |0.0f |
|double |64   |0.0  |
|boolean|8    |false|true or false


### JVM内存对齐:


**以 8 字节对齐**
+ 一个空对象占用8字节（空对象：占8字节 64位bit）
+ 一个对象只含有一个boolean 占16字节
+ 以8字节为单位对齐


在具体的情况下有会有所变化，比如 ：boolean会占用一比特或者占用一个字节的第八位，但是HotSpot虚拟机会为每个Boolean字段分配`一个字节`(byte)的空间


在 Java 虚拟机中没有任何供 boolean 值专用的字节码指令，在 Java 语言之中涉及到 boolean 类型值的运算，在编译之后都使用 Java 虚拟机中的 `int` 数据类型来代替`boolean`。


Java 虚拟机直接支持 `boolean 类型的数组`，虚拟机的 newarray 指令可以创建这种数组。boolean 的数组类型的访问与修改`共用 byte 类型数组的 baload 和 bastore 指令`。

综上所述, `单个boolean型`是占`4字节`(因为变异后会用int来代替), 而`boolean数组`中的则占`1字节`(因为用byte来代替的)


 
### 32和64位差距
32位64位操作系统基本数据类型字节大小,只要注意long：
+ 32位： long: 4个字节 
+ 64位： long: 8个字节


那64位和32位操作系统在读取上有什么区别呢：

+ 64bit CPU拥有`更大的寻址能力`，理论上最大支持到16TB内存，而32bit只支持4G内存
+ 64位 CPU`一次可提取64位数据`，32位的CPU一次只能提取32位数据， 所以64位比32位提高了一倍，理论上性能会提升1倍。但这是建立在64bit操作系统，64bit软件的基础上的



参考：[java基本数据类型,及JVM内存对齐](https://blog.csdn.net/u010235716/article/details/79074598)



### <?super> and <? extends>

+ \<extends T> 确定上边界
+ \<super T> 确定下边界
+ \<?extends T> 除了null什么也不能添加
+ \<?super T> 可以返回T泛型

tips:
+ getFirst: \<? extends T>
+ putFirst: \<? super T>

```java
        List<Animal> animals = new ArrayList<>();
        List<Cat> cats = new ArrayList<>();
        List<Garfield> garfields = new ArrayList<>();

        animals.add(new Animal());
        cats.add(new Cat());
        garfields.add(new Garfield());

        // 上边界是Cat
        // List<? extends Cat>extendsCatFromAnimal=animals;  // 编译失败
        // 下边界是Cat
        List<? super Cat> superCatFromAnimal = animals;

        List<? extends Cat> extendsCatFromCat = cats;
        List<? super Cat> superCatFromCat = cats;


        List<? extends Cat> extendsCatFromGarfields = garfields;
        // 下边界是 Cat
        // List<? super Cat> superCatFromGarfields = garfields;    //编译失败


        // 除了null。<?extends> 不能放入任何类型
        // 无法进行add 操作，Cat是上边界，没有下边界，如果允许add，将导致各种子类都可以放进去，起不到控制作用
        //extendsCatFromCat.add(new Cat());       // 编译失败
        //extendsCatFromCat.add(new Garfield());  // 编译失败
        //extendsCatFromCat.add(new Animal());    // 编译失败

        // cat 是下边界，所以 Cat 的子类都可以向上转型为Cat，所以可以放进去
        superCatFromCat.add(new Cat());
        superCatFromCat.add(new Garfield());
        // superCatFromCat.add(new Animal());  // 编译失败

        // 所有<?super> 只能返回Object
        Object object = superCatFromCat.get(0);

        // <?extends Cat> 可以返回Cat类型，但子类型被擦除
        Cat cat = extendsCatFromCat.get(0);
        Cat cat1 = extendsCatFromGarfields.get(0);
```


## Compare和comparetor


comparable 是接口，一般实现接口的compareTo方法。

Comparetor： 函数式接口，用来封装比较算法，作为参数注入，走的是策略模式，符合开闭原则。





## 语言特性



### 接口中能否定义常量？

可以


+ interface的属性隐式默认 `public static final`
+ 如果子接口重写，会覆盖父接口的数据
+ interface 中的方法隐式默认为`public abstract`
+ 允许但不建议 写出隐式关键字

> Every field declaration in the body of an interface is implicitly public, static,and final.
>
>Every method declaration in the body of an interface is implicitly public. 
Every method declaration in the body of an interface is implicitly abstract, so its body is always represented by a semicolon, not a block.
It is permitted, but discouraged as a matter of style, to redundantly specify the public and/or abstract modifier for a method declared in an interface.
---JDK1.7 Stand 

### 类的静态变量和静态方法能否被子类继承？


+ 静态属性和方法，可以被子类访问，但不能被继承
+ 子类访问父类的静态属性或方法，走的是静态链接，因为这里不存在多态
+ 子类和父类拥有相同定义的静态属性和方法，各自互不干扰

+ 对于非静态的类，子类重写父类的属性后，本地就有两份属性；


### 子类中能否调用父类的静态变量和静态方法？
String a = New string ("a");在jvm中如何存储？



