

浅谈Java里的锁
-----
[TOC]


## 锁的本质

+ `互斥性`：  只有一个持有者
+ `不可见性`： 只有持有者才知道对变量做了那些修改

锁的本质其实就是加一个标记，每次去申请锁，先做read，可以得到就占有，保证资源被线性占用。


### 锁的优化原则：

+ `粒度尽量小`：能锁对象就不要锁类，能锁代码块就不要锁方法。
+ `时间要短`：尽量不要占用锁做耗时的操作。

## CAS操作

+ 具有volatile 的读写语义：一致性

```c {}
/** 伪代码
 * CAS 由JVM保证是原子的，不可切分，不存在中间状态
 * 
 * - memoryVar 内存中的值
 * - predictVar 预计内存中应该是什么值
 * - newVar 要设置到内存的值
 */
void CAS(void *memoryVar,int predictVar,int newVar){
    // 如果内存中的值 和上次看到的一致，说明这期间没被修改，写入
    if(*memoryVar==predictVar){
        *memoryVar=newVar;
    }
}

```



### AtomicInteger 的实现原理

```java
public class AtomicInteger extends Number implements java.io.Serializable {

    // setup to use Unsafe.compareAndSwapInt for updates
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long valueOffset;

    static {
        try {
            valueOffset = unsafe.objectFieldOffset
                (AtomicInteger.class.getDeclaredField("value"));
        } catch (Exception ex) { throw new Error(ex); }
    }
    // 对volatile保证可见性和禁止指令重排序
    private volatile int value;
    /**
     * 原子性设置 value 然后返回老的值
     */
    public final int getAndSet(int newValue) {
        // unsafe， this+valueOffset 得到value的内存地址，newValue由c语言写入
        return unsafe.getAndSetInt(this, valueOffset, newValue);
    }
```


```java
public final class Unsafe {
    public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
    // native 方法，c语言实现
    public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);

}
```
+ [AtomicInteger原理](https://www.cnblogs.com/scuwangjun/p/9098057.html)


### Unsafe类

Unsafe类是在sun.misc包下，不属于Java标准。但是很多Java的基础类库，包括一些被广泛使用的高性能开发库都是基于Unsafe类开发的，比如Netty、Cassandra、Hadoop、Kafka等。Unsafe类在提升Java运行效率，增强Java语言底层操作能力方面起了很大的作用。
Unsafe类使Java拥有了像C语言的指针一样操作内存空间的能力，同时也带来了指针的问题。过度的使用Unsafe类会使得出错的机率变大，因此Java官方并不建议使用的，官方文档也几乎没有。


Unsafe类提供了以下这些功能：

1. 内存管理。包括分配内存、释放内存等。
2. 非常规的对象实例化。allocateInstance()直接生成对象；
3. 操作类、对象、变量;
4. 数组操作;
5. 多线程同步。包括锁机制、CAS操作等;
6. 挂起与恢复:park、unpark;
7. 内存屏障。loadFence、storeFence、fullFence等方法,用于定义内存屏障，避免代码重排序

参考：

+ [说一说Java的Unsafe类](https://www.cnblogs.com/pkufork/p/java_unsafe.html)

## volatile 

* 可见性
	- 当一个线程修改变量后，新值对其他变量是可立即得知的
		- 每次使用都必须重新从主内存装载
		- 每次修改都必须立即写入主内存
* 禁止指令重排序

+ volatile不等于线程安全


### volatile实战：线程安全的单例


```java
public class Singleton {

    private volatile static Singleton instance;

    private Singleton() { }

    public static Singleton getInstance(){
        if(instance==null){
            synchronized (Singleton.class){
                if(instance==null){
                    instance=new Singleton();
                }
            }
        }
        return  instance;
    }

    public static void main(String[] args) {
        Singleton.getInstance();
    }
}
```


## 乐观锁和悲观锁

### 悲观锁

总是`假设最坏`的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁（共享资源每次只给一个线程使用，其它线程阻塞，用完后再把资源转让给其它线程）。传统的关系型数据库里边就用到了很多这种锁机制，比如`行锁`，`表锁`等，`读锁`，`写锁`等，都是在做操作之前先上锁。Java中`synchronized`和`ReentrantLock`等独占锁就是悲观锁思想的实现。悲观锁适合`频繁写入`的场景。


### 乐观锁
总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用`版本号机制`和`CAS算法`实现。乐观锁适用于`多读`的应用类型，这样可以提高吞吐量，像数据库提供的类似于write_condition机制，其实都是提供的乐观锁。在Java中`java.util.concurrent.atomic`包下面的原子变量类就是使用了乐观锁的一种实现方式CAS实现的。


+ `乐观锁`适用于`写比较少`的情况下（多读场景）
+ 一般`多写`的场景下用`悲观锁`就比较合适。


乐观锁常见的两种实现方式：

+ 版本号机制
+ CAS



#### 版本号机制

一般是在数据表中加上一个数据版本号version字段，表示数据被修改的次数，当数据被修改时，version值会加一。当线程A要更新数据值时，在读取数据的同时也会读取version值，在提交更新时，若刚才读取到的version值为当前数据库中的version值相等时才更新，否则重试更新操作，直到更新成功。


#### 乐观锁的缺点:
+ ABA问题
+ 循环时间长开销大,自旋CAS（也就是不成功就一直循环执行直到成功）如果长时间不成功，会给CPU带来非常大的执行开销。
+ 只能保证一个共享变量的原子操作


> 如果一个变量V初次读取的时候是A值，并且在准备赋值的时候检查到它仍然是A值，那我们就能说明它的值没有被其他线程修改过了吗？很明显是不能的，因为在这段时间它的值可能被改为其他值，然后又改回A，那CAS操作就会误认为它从来没有被修改过。这个问题被称为CAS操作的 “ABA”问题

> 从 JDK 1.5开始，提供了AtomicReference类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行 CAS 操作.所以我们可以使用锁或者利用AtomicReference类把多个共享变量合并成一个共享变量来操作。


> 简单的来说CAS适用于写比较少的情况下（多读场景，冲突一般较少），synchronized适用于写比较多的情况下（多写场景，冲突一般较多）

#### CAS与synchronized的使用情景

对于资源竞争较少（线程冲突较轻）的情况，使用synchronized同步锁进行线程阻塞和唤醒切换以及用户态内核态间的切换操作额外浪费消耗cpu资源；而CAS基于硬件实现，不需要进入内核，不需要切换线程，操作自旋几率较少，因此可以获得更高的性能。

对于资源竞争严重（线程冲突严重）的情况，CAS自旋的概率会比较大，从而浪费更多的CPU资源，效率低于synchronized。

补充： Java并发编程这个领域中synchronized关键字一直都是元老级的角色，很久之前很多人都会称它为 “重量级锁” 。但是，在JavaSE 1.6之后进行了主要包括为了减少获得锁和释放锁带来的性能消耗而引入的 偏向锁 和 轻量级锁 以及其它各种优化之后变得在某些情况下并不是那么重了。synchronized的底层实现主要依靠 Lock-Free 的队列，基本思路是 自旋后阻塞，竞争切换后继续竞争锁，稍微牺牲了公平性，但获得了高吞吐量。在线程冲突较少的情况下，可以获得和CAS类似的性能；而线程冲突严重的情况下，性能远高于CAS。

[面试必备之乐观锁与悲观锁](https://blog.csdn.net/qq_34337272/article/details/81072874)

## AQS:AbstractQueuedSynchronizer


+ 一个Java提高的底层同步工具类，用一个int类型的变量state表示同步状态，并提供了一系列的`原子操作`来管理这个同步状态。


AQS的主要作用是为Java中的并发同步组件提供统一的底层支持，例如`ReentrantLock`，`CountdowLatch`就是基于`AQS`实现的，用法是通过继承AQS实现其模版方法，然后将子类作为同步组件的内部类。


> Provides a framework for implementing blocking locks and related synchronizers (semaphores, events, etc) that rely on first-in-first-out (FIFO) wait queues.  This class is designed to be a useful basis for most kinds of synchronizers that rely on a single atomic {@code int} value to represent state. Subclasses must define the protected methods that change this state, and which define what that state means in terms of this object being acquired or released.  Given these, the other methods in this class carry out all queuing and blocking mechanics. Subclasses can maintain other state fields, but only the atomically updated {@code int} value manipulated using methods {@link #getState}, {@link #setState} and {@link #compareAndSetState} is tracked with respect to synchronization.

+ 基于`FIFO`等待队列，提供一个框架来实现阻塞锁和相关的同步器(信号量semaphores，events）。
+ 此类基于一个 `volatile` 的`state`，被设计成多数同步类的一个`基础组件`
+ AQS 并没有强制规定state的含义，由派生类定义获取和释放这个对象的`意义`。
+ 派生类基于模板方法，实现指定方法：



```java
/** 
 * 独占模式下尝试获取。如果state 对于对象而言表示可以在独占模式获取，则获取之。
 */
protected boolean tryAcquire(int arg);

/**
 * 尝试通过设置state，表示释放独占锁 
 */
protected boolean tryRelease(int arg);
/**
 * 尝试在共享模式下获取锁
 */
protected int tryAcquireShared(int arg);
/**
 * 尝试在共享模式下释放锁
 */
protected boolean tryReleaseShared(int arg);
/**
 * 是否线程独占
 */
protected boolean isHeldExclusively();
```
基于这些，该类的其他方法主要执行阻塞和排队的逻辑。


子类可以维护其他的状态属性，但是只有 使用`getState` 和 `compareAndSetState` 原子地更新，才被视为同步。

>  Subclasses should be defined as non-public internal helper classes that are used to implement the synchronization properties of their enclosing class.  Class {@code AbstractQueuedSynchronizer} does not implement any synchronization interface.  Instead it defines methods such as {@link #acquireInterruptibly} that can be invoked as appropriate by concrete locks and related synchronizers to implement their public methods.

子类应该定义 不对外的内部子类，用它实现 封闭类的同步属性。AQS 没有实现任何同步接口。

```java {.line-numbers}

public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {
    /**
     * The synchronization state.
     */
    private volatile int state;

    /**
     * 如果内存中的值和期待的一致，更新。
     * CAS 的内存语义：read and write
     */
    protected final boolean compareAndSetState(int expect, int update) {
        // See below for intrinsics setup to support this
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
    }

    /**
     *  这里是volatile 的，可见性哦
     */
    protected final int getState() {
        return state;
    }
}
```


### Semaphore：基于信号量的同步

+ 用于限制访问某些资源的线程数量，比如数据库连接；
+ 对state的操作基于CAS写入；
+ state的语义是 可用线程数；
+ Semaphore拿到执行权的线程之间有可能造成线程不安全；

#### 源码分析：

```java {.line-numbers}

public class Semaphore implements java.io.Serializable {
 abstract static class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = 1192457210091910933L;

        Sync(int permits) {
            setState(permits);
        }

        final int getPermits() {
            return getState();
        }
        /**
         * 加锁方法
         */
        final int nonfairTryAcquireShared(int acquires) {
            for (;;) {
                // 获取当前可用的线程数量
                int available = getState();
                // 可用的减去需要的，不足则返回，否则CAS写入到state
                int remaining = available - acquires;
                if (remaining < 0 ||
                    compareAndSetState(available, remaining))
                    return remaining;
            }
        }
        /**
         * 解锁方法
         */
        protected final boolean tryReleaseShared(int releases) {
            for (;;) {
                int current = getState();
                int next = current + releases;
                if (next < current) // overflow
                    throw new Error("Maximum permit count exceeded");
                if (compareAndSetState(current, next))
                    return true;
            }
        }
    }
}
```




#### 实战：献血车模型
用Semaphore 实现献血车模型：十个志愿者排队献血，献血车只能同时上两个人，每次献血耗时2s。
```java
public class SemaphoreDemo {
    public static void main(String[] args) throws InterruptedException {

        // 互斥量为2，允许两个线程同时操作
        Semaphore semaphore = new Semaphore(2);
        ExecutorService pool = new ThreadPoolExecutor(10, 10, 0L, 
                TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>(1024));
        // 献血车来限制应该多少人同时献血
        BloodVehicle bloodVehicle = new BloodVehicle(semaphore);
        // 十个志愿者排队献血
        for (int i = 0; i < 10; ++i) {
            pool.submit(new Volunteer(bloodVehicle));
        }
        // 线程池等待所有任务执行完毕
        pool.awaitTermination(20000, TimeUnit.MILLISECONDS);
        pool.shutdown();
        semaphore.release();
    }

    /**
     * 献血车，一次只能上来两个人，每次献血需要2s
     */
    public static class BloodVehicle {
        private Semaphore semaphore;
        BloodVehicle(Semaphore semaphore) {
            this.semaphore = semaphore;
        }
        public void donation() {
            try {
                semaphore.acquire();
                System.out.println(Thread.currentThread().getName() + "志愿者开始献血");
                Thread.sleep(2000);
                System.out.println(Thread.currentThread().getName() + "志愿者结束献血");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                semaphore.release();
            }
        }
    }

    public static class Volunteer extends Thread {
        private BloodVehicle vehicle;
        Volunteer(BloodVehicle vehicle) {
            this.vehicle = vehicle;
        }
        @Override
        public void run() {
            vehicle.donation();
        }
    }
}
```


### CountdowLatch

+ 使一个线程等待其他线程完成各自的工作后再执行
+ state的语义是还需要等待多少个任务线程

CountDownLatch是通过一个`计数器`来实现的，计数器的初始值为线程的数量。每当一个线程完成了自己的任务后，计数器的值就会减1。当计数器值到达0时，它表示所有的线程已经完成了任务，然后在闭锁上等待的线程就可以恢复执行任务。

![](.images/Java里的锁/2019-03-25-10-34-07.png)

#### 源码分析

```java

public class CountDownLatch {

    public void countDown() {
        sync.releaseShared(1);
    }

    /**
     * Synchronization control For CountDownLatch.
     * Uses AQS state to represent count.
     */
    private static final class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = 4982264981922014374L;

        Sync(int count) {
            setState(count);// count 就是state
        }

        int getCount() {
            return getState();
        }

        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;
        }
        /**
         * 尝试释放锁
         */
        protected boolean tryReleaseShared(int releases) {
            // Decrement count; signal when transition to zero
            for (;;) {
                int c = getState();
                if (c == 0)
                    return false;
                int nextc = c-1; // 减一操作
                if (compareAndSetState(c, nextc))
                    return nextc == 0;
            }
        }
    }
}


{
    /** 尝试释放共享锁
     *
     */
    public final boolean releaseShared(int arg) {
        if (tryReleaseShared(arg)) {
            doReleaseShared();
            return true;
        }
        return false;
    }

}

````


#### 实战：汇总子任务结果

```java
public class CountDownLatchDemo {

    public static void main(String[] args) throws Exception {

        CountDownLatch countDownLatch = new CountDownLatch(5);
        ThreadPoolExecutor pool = new ThreadPoolExecutor(10, 10, 0, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<>(10));
        ArrayList<Future<Integer>> futures = new ArrayList<>(10);

        for (int i = 0; i < 10; ++i) {
            futures.add(pool.submit(new SubWorker(countDownLatch)));
        }
        // 阻塞到所有任务完成
        countDownLatch.await(10000, TimeUnit.MILLISECONDS);

        int sum = 0;
        for (int i = 0; i < futures.size(); ++i) {
            // 通过task获取线程执行结果
            sum += futures.get(i).get();
        }
        System.out.println("sum time:" + sum);
    }

    public static class SubWorker implements Callable<Integer> {
        private CountDownLatch countDownLatch;
        SubWorker(CountDownLatch countDownLatch) {
            this.countDownLatch = countDownLatch;
        }
        @Override
        public Integer call() throws Exception {

            System.out.println(Thread.currentThread().getName() + ": 工作中");
            Integer workTime = new Random().nextInt(1000);
            try {
                Thread.sleep(workTime);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                countDownLatch.countDown();
            }
            System.out.println(Thread.currentThread().getName() + ": 结束工作");
            return workTime;
        }
    }
}
```

### CyclicBarrier



+ CountDownLatch:一个线程(或者多个)，等待另外N个线程完成某个事情之后才能执行；CyclicBarrier:N个线程相互等待，任何一个线程完成之前，所有的线程都必须等待。
+ CountDownLatch:一次性的；CyclicBarrier:可以重复使用。
+ CountDownLatch基于AQS；CyclicBarrier基于锁和Condition。本质上都是依赖于volatile和CAS实现的。

### Exchanger

TODO: 待补充



## synchronized

+ `互斥同步`，对同一线程`可重入`
+ 涉及到阻塞和唤醒线程的系统调用，`系统变态`需要耗费CPU,属于`重量级操作`
+ 由`JVM负责实现`，JVM 底层通过监视锁来实现synchronized,对应的字节码指令：monitorenter，monitorexit，同步方法是采用标志



监视锁： 对象的隐藏字段，线程进入同步方法或同步代码块时，线程会获取该方法或代码块所属对象的monitor,进行加锁判断。成功，则本线程称为 此monitor的唯一持有者，monitor在释放前不能被其他线程获取。


+ $monitor==0$：线程可以持有monitor
+ $monitor>0$ ：并且持有者是本线程，monitor++
+ $monitor>0$ ：并且持有者不是本线程，等待锁。

```java
//伪代码
monitorenter(threadId){
    while(monitor!=0&&object.threadId!=threadId){
        //锁不是自己的
        waitForMonitor();
    }
    if(monitor==0){
        monitor=1;
        object.threadId=threadId;
    }else if(monitor!=0&&object.threadId==threadId){
        //锁是自己的,重入
        monitor++;
    }
}

```


JDK1.6 以后，synchronized 提供三种锁的实现：偏向锁，轻量级锁，重量级锁



### 偏向锁


偏向锁：JVM 利用CAS 在对象头上设置ThreadID,表示这个对象偏向于当前线程。偏向锁可以降低无竞争开销，它不是互斥锁，不存在线程竞争，省去再次判断的步骤，提高了性能。


```java

// 偏向锁伪代码
if(obejct.threadID==null){
    // 第一次访问，偏向这个线程,object.threadID=currentThreadID
    CAS(object.threadID,currentThreadID);
}else if(object.threadID==currentThreadID){
    // 本线程已经拥有轻量级锁，不需要重新获取锁
}else{
    // 锁竞争，升级为轻量级锁
}
```




### 轻量级锁


依据：**绝大多的锁，在整个同步周期内都是不存在竞争的。**

轻量级锁使用`CAS`避免了使用互斥量的开销。


object header的组成: 
+ Mark Word: 对象运行时数据
+ 指向方法区对应类的指针
+ 数组长度（只有是数组类型才有）


Mark Word 有2bit 存储锁的状态：
+ 01 未锁定,可偏向
+ 00 轻量级锁
+ 10 膨胀，重量级锁
+ 11 GC标记

过程：
![](.images/Java里的锁/2019-03-10-19-16-00.png)
1. JVM在当前线程的栈帧建立一个锁记录（Lock Record）用于存储Mark Word 的拷贝，记为 `Display Mark Word`

![](.images/Java里的锁/2019-03-10-19-16-08.png)


2. `CAS 操作`尝试 把对象头的`Mark Word` 指向到`DisPlay Word`, 如果成功，锁标记改为00,加锁成功
    + 如果失败，但Mark Word 指向了`Display Mark Word`, 表示已拥有锁，继续
    + 失败，`Mark Word` 不指向`DMW`,意味着锁被其他线程抢占，膨胀为重量级锁


###重量级锁

+ 传统的锁，使用互斥量




### 锁膨胀流程图
锁膨胀示意图，建议下载原图去看：
![锁膨胀示意图，建议下载原图去看](.images/Java里的锁/2019-03-10-19-13-16.png)



参考：
+ 《深入理解Java虚拟机 第二版》

## ReentrantLock: 可重入锁


![码出高效-Java开发手册，226配图](.images/Java里的锁/2019-03-05-14-18-55.png)

ReentrantLock 实现Lock接口，组合了Sync，Sync继承自AQS, AQS中定义了volatile 类型的state。AQS.state在不同子类中具体用法不同。在ReetrantLock中，规则如下：
```c {.line-numbers}
// 算法伪代码
lock(){
    if(state==0){
        getLock();
        state=1;
    }else if(isMyLock()){
        //本来就获取了锁，可重入，所以增加,释放的时候也是一层层减少
        state++;
    }else{
        // 自己没有获得锁，并且锁已经被抢占了，要等待
        waitForLok();
    }
}
```





+ 基于currentThread 和state，state的语义是独占线程的重入次数；



```java


public class ReentrantLock implements Lock, java.io.Serializable {


    public ReentrantLock(boolean fair) {
        //公平锁和非公平锁采用不同策略
        sync = fair ? new FairSync() : new NonfairSync();
    }

    /**
     * Base of synchronization control for this lock. Subclassed
     * into fair and nonfair versions below. Uses AQS state to
     * represent the number of holds on the lock.
     */
    abstract static class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = -5179523762034025860L;

        /**
         * Performs {@link Lock#lock}. The main reason for subclassing
         * is to allow fast path for nonfair version.
         */
        abstract void lock();

        /** 
         * Performs non-fair tryLock.  tryAcquire is implemented in
         * subclasses, but both need nonfair try for trylock method.
         */
        final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                //CAS设置进去
                if (compareAndSetState(0, acquires)) {
                    // 当前还没有被占，设置独占线程为当前线程
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }// 当前线程就是独占线程，可重入
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // 整型 溢出
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);// volatile设置
                return true;
            }
            return false;
        }

        protected final boolean tryRelease(int releases) {
            int c = getState() - releases;
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();
            boolean free = false;
            if (c == 0) {
                // 当前线程 的锁释放完毕，释放独占
                free = true;
                setExclusiveOwnerThread(null);
            }
            setState(c);
            return free;
        }

    }


    /**
     * 非公平锁的策略类
     */
    static final class NonfairSync extends Sync {
        /**
         * Performs lock.  Try immediate barge, backing up to normal
         * acquire on failure.
         */
        final void lock() {
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                // CAS写入失败，走AQS的逻辑
                acquire(1);
        }

        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }
    }


    /**
     * 公平锁策略
     */
    static final class FairSync extends Sync {
        
        // 直接走AQS 的逻辑
        final void lock() {
            acquire(1);
        }

        /**
         * Fair version of tryAcquire.  Don't grant access unless
         * recursive call or no waiters or is first.
         */
        protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
    }

}
```


```java
    /**
     * Acquires in exclusive mode, ignoring interrupts.  Implemented
     * by invoking at least once {@link #tryAcquire},
     * returning on success.  Otherwise the thread is queued, possibly
     * repeatedly blocking and unblocking, invoking {@link
     * #tryAcquire} until success.  This method can be used
     * to implement method {@link Lock#lock}.
     *
     * @param arg the acquire argument.  This value is conveyed to
     *        {@link #tryAcquire} but is otherwise uninterpreted and
     *        can represent anything you like.
     */
    public final void acquire(int arg) {
        /**
         * tryAcquire 利用多态做模板方法，会调用回 FairSync或者 NotfairSync 的tryAcquire 方法
         * 如果获取失败，加入等待队列，中断线程
         * 
         */
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }



    在独占不中断模式，线程真的在队列中，获取，

    /**
     * Acquires in exclusive uninterruptible mode for thread already in queue. Used by condition wait methods as well as acquire.
     *
     * @param node the node
     * @param arg the acquire argument
     * @return {@code true} if interrupted while waiting
     */
    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```



```java
    static final class Node {
        /** Marker to indicate a node is waiting in shared mode */
        static final Node SHARED = new Node();
        /** Marker to indicate a node is waiting in exclusive mode */
        static final Node EXCLUSIVE = null;

        /** waitStatus value to indicate thread has cancelled */
        static final int CANCELLED =  1;
        /** waitStatus value to indicate successor's thread needs unparking */
        static final int SIGNAL    = -1;
        /** waitStatus value to indicate thread is waiting on condition */
        static final int CONDITION = -2;
        /**
         * waitStatus value to indicate the next acquireShared should
         * unconditionally propagate
         */
        static final int PROPAGATE = -3;

        /**
         * Status field, taking on only the values:
         *   SIGNAL:     The successor of this node is (or will soon be)
         *               blocked (via park), so the current node must
         *               unpark its successor when it releases or
         *               cancels. To avoid races, acquire methods must
         *               first indicate they need a signal,
         *               then retry the atomic acquire, and then,
         *               on failure, block.
         *   CANCELLED:  This node is cancelled due to timeout or interrupt.
         *               Nodes never leave this state. In particular,
         *               a thread with cancelled node never again blocks.
         *   CONDITION:  This node is currently on a condition queue.
         *               It will not be used as a sync queue node
         *               until transferred, at which time the status
         *               will be set to 0. (Use of this value here has
         *               nothing to do with the other uses of the
         *               field, but simplifies mechanics.)
         *   PROPAGATE:  A releaseShared should be propagated to other
         *               nodes. This is set (for head node only) in
         *               doReleaseShared to ensure propagation
         *               continues, even if other operations have
         *               since intervened.
         *   0:          None of the above
         *
         * The values are arranged numerically to simplify use.
         * Non-negative values mean that a node doesn't need to
         * signal. So, most code doesn't need to check for particular
         * values, just for sign.
         *
         * The field is initialized to 0 for normal sync nodes, and
         * CONDITION for condition nodes.  It is modified using CAS
         * (or when possible, unconditional volatile writes).
         */
        volatile int waitStatus;

        /**
         * Link to predecessor node that current node/thread relies on
         * for checking waitStatus. Assigned during enqueuing, and nulled
         * out (for sake of GC) only upon dequeuing.  Also, upon
         * cancellation of a predecessor, we short-circuit while
         * finding a non-cancelled one, which will always exist
         * because the head node is never cancelled: A node becomes
         * head only as a result of successful acquire. A
         * cancelled thread never succeeds in acquiring, and a thread only
         * cancels itself, not any other node.
         */
        volatile Node prev;

        /**
         * Link to the successor node that the current node/thread
         * unparks upon release. Assigned during enqueuing, adjusted
         * when bypassing cancelled predecessors, and nulled out (for
         * sake of GC) when dequeued.  The enq operation does not
         * assign next field of a predecessor until after attachment,
         * so seeing a null next field does not necessarily mean that
         * node is at end of queue. However, if a next field appears
         * to be null, we can scan prev's from the tail to
         * double-check.  The next field of cancelled nodes is set to
         * point to the node itself instead of null, to make life
         * easier for isOnSyncQueue.
         */
        volatile Node next;

        /**
         * The thread that enqueued this node.  Initialized on
         * construction and nulled out after use.
         */
        volatile Thread thread;

        /**
         * Link to next node waiting on condition, or the special
         * value SHARED.  Because condition queues are accessed only
         * when holding in exclusive mode, we just need a simple
         * linked queue to hold nodes while they are waiting on
         * conditions. They are then transferred to the queue to
         * re-acquire. And because conditions can only be exclusive,
         * we save a field by using special value to indicate shared
         * mode.
         */
        Node nextWaiter;

        /**
         * Returns true if node is waiting in shared mode.
         */
        final boolean isShared() {
            return nextWaiter == SHARED;
        }

        /**
         * Returns previous node, or throws NullPointerException if null.
         * Use when predecessor cannot be null.  The null check could
         * be elided, but is present to help the VM.
         *
         * @return the predecessor of this node
         */
        final Node predecessor() throws NullPointerException {
            Node p = prev;
            if (p == null)
                throw new NullPointerException();
            else
                return p;
        }

        Node() {    // Used to establish initial head or SHARED marker
        }

        Node(Thread thread, Node mode) {     // Used by addWaiter
            this.nextWaiter = mode;
            this.thread = thread;
        }

        Node(Thread thread, int waitStatus) { // Used by Condition
            this.waitStatus = waitStatus;
            this.thread = thread;
        }
    }
```


+ 非公平锁，如果当前不存在独占，马上CAS获取锁，当前线程为独占线程；
+ 公平锁，如果当前不存在独占，走AQS的逻辑，尝试获取锁，获取不到就加入队列










### 实例：ReentrantLock 公平锁

```java {.line-numbers}
    // 公平锁
    final Lock lock = new ReentrantLock(true);
    final Condition notFull = lock.newCondition();
    final Condition notEmpty = lock.newCondition();
```


### ReentrantReadWriteLock:可重入读写锁





### synchronized和ReentrantLock 比较

+ 对象：
    + synchronized: 单锁，一次锁一个，嵌套锁来实现复合锁容易导致死锁
    + ReentrantLock: 可重入锁， 支持同时锁住多个对象
+ 公平：
    + synchronized: 不公平
    + ReentrantLock 
        + 支持公平锁，默认不公平
        + 按照加锁的时间
+ 级别
    + synchronized 是关键字，底层JVM 在字节指令上负责保证
    + ReentrantLock 是类级别，提供了诸如{查询请求锁的次数}等操作，更加灵活
+ 效率
    + synchronized JDK1.7 之前比ReentrantLock 差，1.7或之后效率明显提高
    + 大多数情况下，应当优先考虑synchronized


### ReadWriteLock

ReadWriteLock读写之间互斥吗

+ 读读不互斥，其他都互斥



