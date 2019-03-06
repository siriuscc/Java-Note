---
title: "Java的命令工具"
author: zengxiquan
date: 03 01, 2019
output: pdf_document
---


[TOC]



### 打印java 进程号:jps

> jps



### 打印内存使用情况:jmap
jmap -heap 14296
打印内存数据，包括内存数据的设置和实际使用情况

```
Attaching to process ID 14296, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.131-b11

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2120220672 (2022.0MB)
   NewSize                  = 44564480 (42.5MB)
   MaxNewSize               = 706740224 (674.0MB)
   OldSize                  = 89653248 (85.5MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 34078720 (32.5MB)
   used     = 2061144 (1.9656600952148438MB)
   free     = 32017576 (30.534339904785156MB)
   6.048184908353365% used
From Space:
   capacity = 5242880 (5.0MB)
   used     = 0 (0.0MB)
   free     = 5242880 (5.0MB)
   0.0% used
To Space:
   capacity = 5242880 (5.0MB)
   used     = 0 (0.0MB)
   free     = 5242880 (5.0MB)
   0.0% used
PS Old Generation
   capacity = 89653248 (85.5MB)
   used     = 0 (0.0MB)
   free     = 89653248 (85.5MB)
   0.0% used

1602 interned Strings occupying 148184 bytes.
```




### 查看JVM堆中对象详细占用情况:jmap -histo

jmap -histo [pid]

```
 num     #instances         #bytes  class name
----------------------------------------------
   1:           431        1857776  [I
   2:          3286         587304  [C
   3:          2345          56280  java.lang.String
   4:           484          55288  java.lang.Class
   5:            83          38152  [B
...
```


### dump 出堆信息jmap -dump

```

>jmap -dump:format=b,file=dump.bin PID

启动分析服务器，端口号7000
>jhat dump.bin

```







### 打印栈信息

```
jstack -l PID
```



#### 等待IO

这是一个等待输入的程序的栈信息：

```
"Service Thread" #9 daemon prio=9 os_prio=0 tid=0x0000000018f0e000 nid=0x37c4 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

   Locked ownable synchronizers:
        - None
... 省略 其他两个线程的日志


"C2 CompilerThread0" #6 daemon prio=9 os_prio=2 tid=0x0000000017b7a000 nid=0x2ba4 waiting on condition [0x0000000000000000] // 等待条件000
   java.lang.Thread.State: RUNNABLE  //状态是运行的

   Locked ownable synchronizers: // 没有锁
        - None

"Attach Listener" #5 daemon prio=5 os_prio=2 tid=0x0000000017b79800 nid=0x21ec waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

   Locked ownable synchronizers:
        - None

"Signal Dispatcher" #4 daemon prio=9 os_prio=2 tid=0x0000000018e88800 nid=0x14bc runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

   Locked ownable synchronizers:
        - None

"Finalizer" #3 daemon prio=8 os_prio=1 tid=0x0000000017b0a800 nid=0x3004 in Object.wait() [0x0000000018e7f000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)
        - locked <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)

   Locked ownable synchronizers:
        - None

"Reference Handler" #2 daemon prio=10 os_prio=2 tid=0x0000000002fcf000 nid=0x2c2c in Object.wait() [0x0000000018d7f000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

   Locked ownable synchronizers:
        - None

"main" #1 prio=5 os_prio=0 tid=0x0000000002ee0800 nid=0x1610 runnable [0x0000000002e5f000]
   java.lang.Thread.State: RUNNABLE
        at java.io.FileInputStream.readBytes(Native Method)
        at java.io.FileInputStream.read(FileInputStream.java:255)
        at java.io.BufferedInputStream.fill(BufferedInputStream.java:246)
        at java.io.BufferedInputStream.read(BufferedInputStream.java:265)
        - locked <0x00000000d5e59760> (a java.io.BufferedInputStream) //锁住 输入缓冲流
        at StringTest.main(StringTest.java:13)// 当前在13行 ,
   Locked ownable synchronizers:
        - None

...
"GC task thread#3 (ParallelGC)" os_prio=0 tid=0x0000000002efb000 nid=0xfe4 runnable
```
---





#### 死循环

写一个死循环并在main调用：

```java
    public static void testLoop() {
        while (true) {}
    }
```

```

"C2 CompilerThread0" #6 daemon prio=9 os_prio=2 tid=0x000000001791a000 nid=0x59c waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Attach Listener" #5 daemon prio=5 os_prio=2 tid=0x00000000178cc000 nid=0x32e0 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Signal Dispatcher" #4 daemon prio=9 os_prio=2 tid=0x0000000018c78800 nid=0x548 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Finalizer" #3 daemon prio=8 os_prio=1 tid=0x00000000178aa800 nid=0x1858 in Object.wait() [0x0000000018c0f000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)
        - locked <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)

"Reference Handler" #2 daemon prio=10 os_prio=2 tid=0x0000000002d6f000 nid=0x3038 in Object.wait() [0x0000000018b0f000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"main" #1 prio=5 os_prio=0 tid=0x0000000002c80800 nid=0x1d60 runnable [0x0000000002c7f000]
   java.lang.Thread.State: RUNNABLE
        at StringTest.testLoop(StringTest.java:11)
        at StringTest.main(StringTest.java:6)

```

这里看最后的main方法，状态是 `RUNNABLE`，执行到 StringTest.testLoop(StringTest.java:11),



#### wait等待唤醒


```java
    public static void testWait(){
        
        Callable <Integer>task=new Callable<Integer>() {
            @Override
            public Integer call() {      
                    try{
                        wait();
                        return 0;
                    }catch(Exception e){
                        e.printStackTrace();
                }
                return -1;
            }
        };
        ExecutorService ex = Executors.newFixedThreadPool(1);
        ex.submit(task);

    }
```


```

"pool-1-thread-1" #10 prio=5 os_prio=0 tid=0x0000000018de6800 nid=0x3ae0 in Object.wait() [0x000000001990f000]
   java.lang.Thread.State: WAITING (on object monitor) 等待中，
        at java.lang.Object.wait(Native Method) // native 本地方法，暂停等待唤醒
        - waiting on <0x00000000d5edb928> (a StringTest$1) 
        at java.lang.Object.wait(Object.java:502)
        at StringTest$1.call(StringTest.java:39)
        - locked <0x00000000d5edb928> (a StringTest$1) 
        at StringTest$1.call(StringTest.java:34) //具体的行数，对应call 方法
        at java.util.concurrent.FutureTask.run(FutureTask.java:266)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:748)
```



#### 死锁

```java
public static void deadLockTest() {

        LockRun taskA = new LockRun(1);
        LockRun taskB = new LockRun(2);

        ExecutorService ex = Executors.newFixedThreadPool(2);
        ex.execute(taskA);
        ex.execute(taskB);

    }

    static class LockRun implements Runnable {
        private static Object lockA = new Object();
        private static Object lockB = new Object();

        private int order = 1;

        LockRun(int order) {

            this.order = order;
        }

        public void run() {

            try {

                if (order == 1) {
                    synchronized (LockRun.lockA) {
                        Thread.yield();
                        synchronized (LockRun.lockB) {
                        }
                    }
                } else {
                    synchronized (LockRun.lockB) {
                        Thread.yield();
                        synchronized (LockRun.lockA) {
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

    }
```



```

...
"pool-1-thread-2" #11 prio=5 os_prio=0 tid=0x00000000189e2800 nid=0x2100 waiting for monitor entry [0x000000001960e000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at StringTest$LockRun.run(StringTest.java:88)
        - waiting to lock <0x00000000d5edbd10> (a java.lang.Object)
        - locked <0x00000000d5edbd20> (a java.lang.Object)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:748)

"pool-1-thread-1" #10 prio=5 os_prio=0 tid=0x00000000189e1800 nid=0x2b4c waiting for monitor entry [0x000000001950f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at StringTest$LockRun.run(StringTest.java:82)
        - waiting to lock <0x00000000d5edbd20> (a java.lang.Object)
        - locked <0x00000000d5edbd10> (a java.lang.Object)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:748)
...
"Finalizer" #3 daemon prio=8 os_prio=1 tid=0x00000000175aa800 nid=0x2890 in Object.wait() [0x000000001890e000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)
        - locked <0x00000000d5e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)

"Reference Handler" #2 daemon prio=10 os_prio=2 tid=0x0000000002a6f000 nid=0x3ad8 in Object.wait() [0x000000001880e000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x00000000d5e06b68> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"VM Thread" os_prio=2 tid=0x0000000017587800 nid=0x392c runnable

"GC task thread#0 (ParallelGC)" os_prio=0 tid=0x0000000002996800 nid=0xbcc runnable
...
"VM Periodic Task Thread" os_prio=2 tid=0x00000000189cf000 nid=0xb78 waiting on condition

JNI global references: 6


Found one Java-level deadlock:
=============================
"pool-1-thread-2":
  waiting to lock monitor 0x0000000002a77c78 (object 0x00000000d5edbd10, a java.lang.Object),
  which is held by "pool-1-thread-1"
"pool-1-thread-1":
  waiting to lock monitor 0x0000000002a75338 (object 0x00000000d5edbd20, a java.lang.Object),
  which is held by "pool-1-thread-2"

Java stack information for the threads listed above:
===================================================
"pool-1-thread-2":
        at StringTest$LockRun.run(StringTest.java:88)
        - waiting to lock <0x00000000d5edbd10> (a java.lang.Object)
        - locked <0x00000000d5edbd20> (a java.lang.Object)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:748)
"pool-1-thread-1":
        at StringTest$LockRun.run(StringTest.java:82)
        - waiting to lock <0x00000000d5edbd20> (a java.lang.Object)
        - locked <0x00000000d5edbd10> (a java.lang.Object)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.
```




#### Java 线程状态转换

![](.images/Java的命令工具/2019-03-01-20-12-16.png)





#### 代码参考：

```java{.line-numbers}
class CmdTest {

    public static void main(String args[]) throws Exception {
        testString();
    }

    public static void testLoop() {

        while (true) {
        }
    }

    public static void testString() throws IOException {

        String s1 = "abc";
        String s2 = "abc";

        System.out.println("s1==s2:" + (s1 == s2));
        System.in.read();

    }

    public static void testWait() {

        Callable<Integer> task = new Callable<Integer>() {
            @Override
            public Integer call() {
                synchronized (this) {
                    try {
                        wait();
                        return 0;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                return -1;
            }
        };
        ExecutorService ex = Executors.newFixedThreadPool(1);
        ex.submit(task);
    }

    public static void deadLockTest() {

        LockRun taskA = new LockRun(1);
        LockRun taskB = new LockRun(2);

        ExecutorService ex = Executors.newFixedThreadPool(2);
        ex.execute(taskA);
        ex.execute(taskB);

    }

    static class LockRun implements Runnable {
        private static Object lockA = new Object();
        private static Object lockB = new Object();

        private int order = 1;

        LockRun(int order) {

            this.order = order;
        }

        public void run() {

            try {

                if (order == 1) {
                    synchronized (LockRun.lockA) {
                        Thread.yield();
                        synchronized (LockRun.lockB) {
                        }
                    }
                } else {
                    synchronized (LockRun.lockB) {
                        Thread.yield();
                        synchronized (LockRun.lockA) {
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
```