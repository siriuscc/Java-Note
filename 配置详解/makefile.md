



makefile 主要解决“文件依赖性”




```makefile
target ... : prerequisites ...
            command
            ...
            ...
```


target也就是一个目标文件，可以是Object File，也可以是执行文件。还可以是一个标签（Label），对于标签这种特性，在后续的“伪目标”章节中会有叙述。
 prerequisites就是，要生成那个target所需要的文件或是目标。

 command也就是make需要执行的命令。（任意的Shell命令）



 这是一个文件的依赖关系，也就是说，target这一个或多个的目标文件依赖于prerequisites中的文件，其生成规则定义在command中。说白一点就是说，prerequisites中如果有一个以上的文件比target文件要新的话，command所定义的命令就会被执行。这就是Makefile的规则。也就是Makefile中最核心的内容。



这里要说明一点的是，clean不是一个文件，它只不过是一个动作名字，有点像C语言中的lable一样，其冒号后什么也没有，那么，make就不会自动去找文件的依赖性，也就不会自动执行其后所定义的命令。要执行其后的命令，就要在make命令后明显得指出这个lable的名字。这样的方法非常有用，我们可以在一个makefile中定义不用的编译或是和编译无关的命令，比如程序的打包，程序的备份，等等。



三、make是如何工作的

在默认的方式下，也就是我们只输入make命令。那么，

    1、make会在当前目录下找名字叫“Makefile”或“makefile”的文件。
    2、如果找到，它会找文件中的第一个目标文件（target），在上面的例子中，他会找到“edit”这个文件，并把这个文件作为最终的目标文件。
    3、如果edit文件不存在，或是edit所依赖的后面的 .o 文件的文件修改时间要比edit这个文件新，那么，他就会执行后面所定义的命令来生成edit这个文件。
    4、如果edit所依赖的.o文件也存在，那么make会在当前文件中找目标为.o文件的依赖性，如果找到则再根据那一个规则生成.o文件。（这有点像一个堆栈的过程）
    5、当然，你的C文件和H文件是存在的啦，于是make会生成 .o 文件，然后再用 .o 文件生命make的终极任务，也就是执行文件edit了。




默认的情况下，make命令会在当前目录下按顺序找寻文件名为“GNUmakefile”、“makefile”、“Makefile”的文件，找到了解释这个文件。





####Makefile里有什么？

Makefile里主要包含了五个东西：显式规则、隐晦规则、变量定义、文件指示和注释。

1. 显式规则。显式规则说明了，如何生成一个或多的的目标文件。这是由Makefile的书写者明显指出，要生成的文件，文件的依赖文件，生成的命令。
2. 隐晦规则。由于我们的make有自动推导的功能，所以隐晦的规则可以让我们比较粗糙地简略地书写Makefile，这是由make所支持的。
3. 变量的定义。在Makefile中我们要定义一系列的变量，变量一般都是字符串，这个有点你C语言中的宏，当Makefile被执行时，其中的变量都会被扩展到相应的引用位置上。
4. 文件指示。其包括了三个部分，一个是在一个Makefile中引用另一个Makefile，就像C语言中的include一样；另一个是指根据某些情况指定Makefile中的有效部分，就像C语言中的预编译#if一样；还有就是定义一个多行的命令。有关这一部分的内容，我会在后续的部分中讲述。
5. 注释。Makefile中只有行注释，“#”字符

最后，还值得一提的是，在Makefile中的命令，必须要以[Tab]键开始。



#### 引用其它的Makefile

在Makefile使用include关键字可以把别的Makefile包含进来，这很像C语言的#include，被包含的文件会原模原样的放在当前文件的包含位置。include的语法是：

    include <filename>

    filename可以是当前操作系统Shell的文件模式（可以保含路径和通配符）

在include前面可以有一些空字符，但是绝不能是[Tab]键开始。include和<filename>可以用一个或多个空格隔开。举个例子，你有这样几个Makefile：a.mk、b.mk、c.mk，还有一个文件叫foo.make，以及一个变量$(bar)，其包含了e.mk和f.mk，那么，下面的语句：

    include foo.make *.mk $(bar)

    等价于：

    include foo.make a.mk b.mk c.mk e.mk f.mk


make命令开始时，会找寻include所指出的其它Makefile，并把其内容安置在当前的位置。就好像C/C++的#include指令一样。如果文件都没有指定绝对路径或是相对路径的话，make会在当前目录下首先寻找，如果当前目录下没有找到，那么，make还会在下面的几个目录下找：


 1、如果make执行时，有“-I”或“--include-dir”参数，那么make就会在这个参数所指定的目录下去寻找。
    2、如果目录<prefix>/include（一般是：/usr/local/bin或/usr/include）存在的话，make也会去找。


如果有文件没有找到的话，make会生成一条警告信息，但不会马上出现致命错误。它会继续载入其它的文件，一旦完成makefile的读取，make会再重试这些没有找到，或是不能读取的文件，如果还是不行，make才会出现一条致命信息。如果你想让make不理那些无法读取的文件，而继续执行，你可以在include前加一个减号“-”。如：

    -include <filename>
    其表示，无论include过程中出现什么错误，都不要报错继续执行。和其它版本make兼容的相关命令是sinclude，其作用和这一个是一样的。

四、环境变量 MAKEFILES

如果你的当前环境中定义了环境变量MAKEFILES，那么，make会把这个变量中的值做一个类似于include的动作。这个变量中的值是其它的Makefile，用空格分隔。只是，它和include不同的是，从这个环境变中引入的Makefile的“目标”不会起作用，如果环境变量中定义的文件发现错误，make也会不理。

但是在这里我还是`建议不要使用这个环境变量`，因为只要这个变量一被定义，那么当你使用make时，所有的Makefile都会受到它的影响，这绝不是你想看到的。在这里提这个事，只是为了告诉大家，也许有时候你的`Makefile出现了怪事，那么你可以看看当前环境中有没有定义这个变量`。



五、make的工作方式

GNU的make工作时的执行步骤入下：（想来其它的make也是类似）

    1、读入所有的Makefile。
    2、读入被include的其它Makefile。
    3、初始化文件中的变量。
    4、推导隐晦规则，并分析所有规则。
    5、为所有的目标文件创建依赖关系链。
    6、根据依赖关系，决定哪些目标要重新生成。
    7、执行生成命令。

1-5步为第一个阶段，6-7为第二个阶段。第一个阶段中，如果定义的变量被使用了，那么，make会把其展开在使用的位置。但make并不会完全马上展开，make使用的是拖延战术，如果变量出现在依赖关系的规则中，那么仅当这条依赖被决定要使用了，变量才会在其内部展开。

当然，这个工作方式你不一定要清楚，但是知道这个方式你也会对make更为熟悉。有了这个基础，后续部分也就容易看懂了。



书写规则
————

规则包含两个部分，一个是依赖关系，一个是生成目标的方法。

在Makefile中，规则的顺序是很重要的，因为，Makefile中只应该有一个最终目标，其它的目标都是被这个目标所连带出来的，所以一定要让make知道你的最终目标是什么。一般来说，定义在Makefile中的目标可能会有很多，但是第一条规则中的目标将被确立为最终的目标。如果第一条规则中的目标有很多个，那么，第一个目标会成为最终的目标。make所完成的也就是这个目标。

好了，还是让我们来看一看如何书写规则。



命令说明了target的生成方式，target:prerequisites 说明了依赖关系

```
 targets : prerequisites
        command
        ...

      或是这样：

      targets : prerequisites ; command
            command
            ...
```

通配符代替了你一系列的文件，如“*.c”表示所以后缀为c的文件。一个需要我们注意的是，如果我们的文件名中有通配符，如：“*”，那么可以用转义字符“/”，如“/*”来表示真实的“*”字符，而不是任意长度的字符串。

三、在规则中使用通配符

如果我们想定义一系列比较类似的文件，我们很自然地就想起使用通配符。make支持三各通配符：“*”，“?”和“[...]”。这是和Unix的B-Shell是相同的。

波浪号（“~”）字符在文件名中也有比较特殊的用途。如果是“~/test”，这就表示当前用户的$HOME目录下的test目录。而“~hchen/test”则表示用户hchen的宿主目录下的test目录。（这些都是Unix下的小知识了，make也支持）而在Windows或是MS-DOS下，用户没有宿主目录，那么波浪号所指的目录则根据环境变量“HOME”而定。

通配符代替了你一系列的文件，如“*.c”表示所以后缀为c的文件。一个需要我们注意的是，如果我们的文件名中有通配符，如：“*”，那么可以用转义字符“/”，如“/*”来表示真实的“*”字符，而不是任意长度的字符串。

好吧，还是先来看几个例子吧：

    clean:
         rm -f *.o

    上面这个例子我不不多说了，这是操作系统Shell所支持的通配符。这是在命令中的通配符。

    print: *.c
         lpr -p $?
         touch print

    上面这个例子说明了通配符也可以在我们的规则中，目标print依赖于所有的[.c]文件。其中的“$?”是一个自动化变量，我会在后面给你讲述。

    objects = *.o

    上面这个例子，表示了，通符同样可以用在变量中。并不是说[*.o]会展开，不！objects的值就是“*.o”。Makefile中的变量其实就是C/C++中的宏。如果你要让通配符在变量中展开，也就是让objects的值是所有[.o]的文件名的集合，那么，你可以这样：

    objects := $(wildcard *.o)

这种用法由关键字“wildcard”指出，关于Makefile的关键字，我们将在后面讨论。
    clean:
         rm -f *.o

    上面这个例子我不不多说了，这是操作系统Shell所支持的通配符。这是在命令中的通配符。

    print: *.c
         lpr -p $?
         touch print

    上面这个例子说明了通配符也可以在我们的规则中，目标print依赖于所有的[.c]文件。其中的“$?”是一个自动化变量，我会在后面给你讲述。

    objects = *.o

    上面这个例子，表示了，通符同样可以用在变量中。并不是说[*.o]会展开，不！objects的值就是“*.o”。Makefile中的变量其实就是C/C++中的宏。如果你要让通配符在变量中展开，也就是让objects的值是所有[.o]的文件名的集合，那么，你可以这样：

    objects := $(wildcard *.o)

这种用法由关键字“wildcard”指出，关于Makefile的关键字，我们将在后面讨论。
四、文件搜寻

在一些大的工程中，有大量的源文件，我们通常的做法是把这许多的源文件分类，并存放在不同的目录中。所以，当make需要去找寻文件的依赖关系时，你可以在文件前加上路径，但最好的方法是把一个路径告诉make，让make在自动去找。

Makefile文件中的特殊变量“VPATH”就是完成这个功能的，如果没有指明这个变量，make只会在当前的目录中去找寻依赖文件和目标文件。如果定义了这个变量，那么，make就会在当当前目录找不到的情况下，到所指定的目录中去找寻文件了。

    VPATH = src:../headers

上面的的定义指定两个目录，“src”和“../headers”，make会按照这个顺序进行搜索。目录由“冒号”分隔。（当然，当前目录永远是最高优先搜索的地方）

另一个设置文件搜索路径的方法是使用make的“vpath”关键字（注意，它是全小写的），这不是变量，这是一个make的关键字，这和上面提到的那个VPATH变量很类似，但是它更为灵活。它可以指定不同的文件在不同的搜索目录中。这是一个很灵活的功能。它的使用方法有三种：

    1、vpath <pattern> <directories>

    为符合模式<pattern>的文件指定搜索目录<directories>。

    2、vpath <pattern>

    清除符合模式<pattern>的文件的搜索目录。

    3、vpath

    清除所有已被设置好了的文件搜索目录。

vapth使用方法中的<pattern>需要包含“%”字符。“%”的意思是匹配零或若干字符，例如，“%.h”表示所有以“.h”结尾的文件。<pattern>指定了要搜索的文件集，而<directories>则指定了<pattern>的文件集的搜索的目录。例如：

    vpath %.h ../headers

该语句表示，要求make在“../headers”目录下搜索所有以“.h”结尾的文件。（如果某文件在当前目录没有找到的话）

我们可以连续地使用vpath语句，以指定不同搜索策略。如果连续的vpath语句中出现了相同的<pattern>，或是被重复了的<pattern>，那么，make会按照vpath语句的先后顺序来执行搜索。如：

    vpath %.c foo
    vpath %   blish
    vpath %.c bar

其表示“.c”结尾的文件，先在“foo”目录，然后是“blish”，最后是“bar”目录。

    vpath %.c foo:bar
    vpath %   blish

而上面的语句则表示“.c”结尾的文件，先在“foo”目录，然后是“bar”目录，最后才是“blish”目录。

另一个设置文件搜索路径的方法是使用make的“vpath”关键字（注意，它是全小写的），这不是变量，这是一个make的关键字，这和上面提到的那个VPATH变量很类似，但是它更为灵活。它可以指定不同的文件在不同的搜索目录中。这是一个很灵活的功能。它的使用方法有三种：

    1、vpath <pattern> <directories>

    为符合模式<pattern>的文件指定搜索目录<directories>。

    2、vpath <pattern>

    清除符合模式<pattern>的文件的搜索目录。

    3、vpath

    清除所有已被设置好了的文件搜索目录。

vapth使用方法中的<pattern>需要包含“%”字符。“%”的意思是匹配零或若干字符，例如，“%.h”表示所有以“.h”结尾的文件。<pattern>指定了要搜索的文件集，而<directories>则指定了<pattern>的文件集的搜索的目录。例如：

    vpath %.h ../headers

该语句表示，要求make在“../headers”目录下搜索所有以“.h”结尾的文件。（如果某文件在当前目录没有找到的话）

我们可以连续地使用vpath语句，以指定不同搜索策略。如果连续的vpath语句中出现了相同的<pattern>，或是被重复了的<pattern>，那么，make会按照vpath语句的先后顺序来执行搜索。如：

    vpath %.c foo
    vpath %   blish
    vpath %.c bar

其表示“.c”结尾的文件，先在“foo”目录，然后是“blish”，最后是“bar”目录。

    vpath %.c foo:bar
    vpath %   blish

而上面的语句则表示“.c”结尾的文件，先在“foo”目录，然后是“bar”目录，最后才是“blish”目录。
五、伪目标

最早先的一个例子中，我们提到过一个“clean”的目标，这是一个“伪目标”，

    clean:
            rm *.o temp

正像我们前面例子中的“clean”一样，即然我们生成了许多文件编译文件，我们也应该提供一个清除它们的“目标”以备完整地重编译而用。 （以“make clean”来使用该目标）

因为，我们并不生成“clean”这个文件。“伪目标”并不是一个文件，只是一个标签，由于“伪目标”不是文件，所以make无法生成它的依赖关系和决定它是否要执行。我们只有通过显示地指明这个“目标”才能让其生效。当然，“伪目标”的取名不能和文件名重名，不然其就失去了“伪目标”的意义了。

当然，为了避免和文件重名的这种情况，我们可以使用一个特殊的标记“.PHONY”来显示地指明一个目标是“伪目标”，向make说明，不管是否有这个文件，这个目标就是“伪目标”。

    .PHONY : clean

只要有这个声明，不管是否有“clean”文件，要运行“clean”这个目标，只有“make clean”这样。于是整个过程可以这样写：

     .PHONY: clean
    clean:
            rm *.o temp

伪目标一般没有依赖的文件。但是，我们也可以为伪目标指定所依赖的文件。伪目标同样可以作为“默认目标”，只要将其放在第一个。一个示例就是，如果你的Makefile需要一口气生成若干个可执行文件，但你只想简单地敲一个make完事，并且，所有的目标文件都写在一个Makefile中，那么你可以使用“伪目标”这个特性：

    all : prog1 prog2 prog3
    .PHONY : all

    prog1 : prog1.o utils.o
            cc -o prog1 prog1.o utils.o

    prog2 : prog2.o
            cc -o prog2 prog2.o

    prog3 : prog3.o sort.o utils.o
            cc -o prog3 prog3.o sort.o utils.o

我们知道，Makefile中的第一个目标会被作为其默认目标。我们声明了一个“all”的伪目标，其依赖于其它三个目标。由于伪目标的特性是，总是被执行的，所以其依赖的那三个目标就总是不如“all”这个目标新。所以，其它三个目标的规则总是会被决议。也就达到了我们一口气生成多个目标的目的。“.PHONY : all”声明了“all”这个目标为“伪目标”。

随便提一句，从上面的例子我们可以看出，目标也可以成为依赖。所以，伪目标同样也可成为依赖。看下面的例子：

    .PHONY: cleanall cleanobj cleandiff

    cleanall : cleanobj cleandiff
            rm program

    cleanobj :
            rm *.o

    cleandiff :
            rm *.diff

“make clean”将清除所有要被清除的文件。“cleanobj”和“cleandiff”这两个伪目标有点像“子程序”的意思。我们可以输入“make cleanall”和“make cleanobj”和“make cleandiff”命令来达到清除不同种类文件的目的。



六、多目标

Makefile的规则中的目标可以不止一个，其支持多目标，有可能我们的多个目标同时依赖于一个文件，并且其生成的命令大体类似。于是我们就能把其合并起来。当然，多个目标的生成规则的执行命令是同一个，这可能会可我们带来麻烦，不过好在我们的可以使用一个自动化变量“$@”（关于自动化变量，将在后面讲述），这个变量表示着目前规则中所有的目标的集合，这样说可能很抽象，还是看一个例子吧。

    bigoutput littleoutput : text.g
            generate text.g -$(subst output,,$@) > $@

    上述规则等价于：

    bigoutput : text.g
            generate text.g -big > bigoutput
    littleoutput : text.g
            generate text.g -little > littleoutput

    其中，-$(subst output,,$@)中的“$”表示执行一个Makefile的函数，函数名为subst，后面的为参数。关于函数，将在后面讲述。这里的这个函数是截取字符串的意思，“$@”表示目标的集合，就像一个数组，“$@”依次取出目标，并执于命令。


七、静态模式

静态模式可以更加容易地定义多目标的规则，可以让我们的规则变得更加的有弹性和灵活。我们还是先来看一下语法：

    <targets ...>: <target-pattern>: <prereq-patterns ...>
            <commands>
            ...


    targets定义了一系列的目标文件，可以有通配符。是目标的一个集合。

    target-parrtern是指明了targets的模式，也就是的目标集模式。

    prereq-parrterns是目标的依赖模式，它对target-parrtern形成的模式再进行一次依赖目标的定义。

这样描述这三个东西，可能还是没有说清楚，还是举个例子来说明一下吧。如果我们的<target-parrtern>定义成“%.o”，意思是我们的<target>集合中都是以“.o”结尾的，而如果我们的<prereq-parrterns>定义成“%.c”，意思是对<target-parrtern>所形成的目标集进行二次定义，其计算方法是，取<target-parrtern>模式中的“%”（也就是去掉了[.o]这个结尾），并为其加上[.c]这个结尾，形成的新集合。

所以，我们的“目标模式”或是“依赖模式”中都应该有“%”这个字符，如果你的文件名中有“%”那么你可以使用反斜杠“/”进行转义，来标明真实的“%”字符。

看一个例子：

    objects = foo.o bar.o

    all: $(objects)

    $(objects): %.o: %.c
            $(CC) -c $(CFLAGS) $< -o $@


上面的例子中，指明了我们的目标从$object中获取，“%.o”表明要所有以“.o”结尾的目标，也就是“foo.o bar.o”，也就是变量$object集合的模式，而依赖模式“%.c”则取模式“%.o”的“%”，也就是“foo bar”，并为其加下“.c”的后缀，于是，我们的依赖目标就是“foo.c bar.c”。而命令中的“$<”和“$@”则是自动化变量，“$<”表示所有的依赖目标集（也就是“foo.c bar.c”），“$@”表示目标集（也就是“foo.o bar.o”）。于是，上面的规则展开后等价于下面的规则：

    foo.o : foo.c
            $(CC) -c $(CFLAGS) foo.c -o foo.o
    bar.o : bar.c
            $(CC) -c $(CFLAGS) bar.c -o bar.o

试想，如果我们的“%.o”有几百个，那种我们只要用这种很简单的“静态模式规则”就可以写完一堆规则，实在是太有效率了。“静态模式规则”的用法很灵活，如果用得好，那会一个很强大的功能。再看一个例子：


    files = foo.elc bar.o lose.o

    $(filter %.o,$(files)): %.o: %.c
            $(CC) -c $(CFLAGS) $< -o $@
    $(filter %.elc,$(files)): %.elc: %.el
            emacs -f batch-byte-compile $<


$(filter %.o,$(files))表示调用Makefile的filter函数，过滤“$filter”集，只要其中模式为“%.o”的内容。其的它内容，我就不用多说了吧。这个例字展示了Makefile中更大的弹性。


八、自动生成依赖性

在Makefile中，我们的依赖关系可能会需要包含一系列的头文件，比如，如果我们的main.c中有一句“#include "defs.h"”，那么我们的依赖关系应该是：

    main.o : main.c defs.h

但是，如果是一个比较大型的工程，你必需清楚哪些C文件包含了哪些头文件，并且，你在加入或删除头文件时，也需要小心地修改Makefile，这是一个很没有维护性的工作。为了避免这种繁重而又容易出错的事情，我们可以使用C/C++编译的一个功能。大多数的C/C++编译器都支持一个“-M”的选项，即自动找寻源文件中包含的头文件，并生成一个依赖关系。例如，如果我们执行下面的命令：

    cc -M main.c

其输出是：

    main.o : main.c defs.h

于是由编译器自动生成的依赖关系，这样一来，你就不必再手动书写若干文件的依赖关系，而由编译器自动生成了。需要提醒一句的是，如果你使用GNU的C/C++编译器，你得用“-MM”参数，不然，“-M”参数会把一些标准库的头文件也包含进来。

    gcc -M main.c的输出是：

    main.o: main.c defs.h /usr/include/stdio.h /usr/include/features.h /
         /usr/include/sys/cdefs.h /usr/include/gnu/stubs.h /
         /usr/lib/gcc-lib/i486-suse-linux/2.95.3/include/stddef.h /
         /usr/include/bits/types.h /usr/include/bits/pthreadtypes.h /
         /usr/include/bits/sched.h /usr/include/libio.h /
         /usr/include/_G_config.h /usr/include/wchar.h /
         /usr/include/bits/wchar.h /usr/include/gconv.h /
         /usr/lib/gcc-lib/i486-suse-linux/2.95.3/include/stdarg.h /
         /usr/include/bits/stdio_lim.h


    gcc -MM main.c的输出则是：

    main.o: main.c defs.h

那么，编译器的这个功能如何与我们的Makefile联系在一起呢。因为这样一来，我们的Makefile也要根据这些源文件重新生成，让Makefile自已依赖于源文件？这个功能并不现实，不过我们可以有其它手段来迂回地实现这一功能。GNU组织建议把编译器为每一个源文件的自动生成的依赖关系放到一个文件中，为每一个“name.c”的文件都生成一个“name.d”的Makefile文件，[.d]文件中就存放对应[.c]文件的依赖关系。

于是，我们可以写出[.c]文件和[.d]文件的依赖关系，并让make自动更新或自成[.d]文件，并把其包含在我们的主Makefile中，这样，我们就可以自动化地生成每个文件的依赖关系了。

这里，我们给出了一个模式规则来产生[.d]文件：

    %.d: %.c
            @set -e; rm -f $@; /
             $(CC) -M $(CPPFLAGS) $< > $@.
; /
             sed 's,/($*/)/.o[ :]*,/1.o $@ : ,g' < $@.
> $@; /
             rm -f $@.


这个规则的意思是，所有的[.d]文件依赖于[.c]文件，“rm -f $@”的意思是删除所有的目标，也就是[.d]文件，第二行的意思是，为每个依赖文件“$<”，也就是[.c]文件生成依赖文件，“$@”表示模式“%.d”文件，如果有一个C文件是name.c，那么“%”就是“name”，“
”意为一个随机编号，第二行生成的文件有可能是“name.d.12345”，第三行使用sed命令做了一个替换，关于sed命令的用法请参看相关的使用文档。第四行就是删除临时文件。

总而言之，这个模式要做的事就是在编译器生成的依赖关系中加入[.d]文件的依赖，即把依赖关系：

    main.o : main.c defs.h

转成：

    main.o main.d : main.c defs.h

于是，我们的[.d]文件也会自动更新了，并会自动生成了，当然，你还可以在这个[.d]文件中加入的不只是依赖关系，包括生成的命令也可一并加入，让每个[.d]文件都包含一个完赖的规则。一旦我们完成这个工作，接下来，我们就要把这些自动生成的规则放进我们的主Makefile中。我们可以使用Makefile的“include”命令，来引入别的Makefile文件（前面讲过），例如：

    sources = foo.c bar.c

    include $(sources:.c=.d)

上述语句中的“$(sources:.c=.d)”中的“.c=.d”的意思是做一个替换，把变量$(sources)所有[.c]的字串都替换成[.d]，关于这个“替换”的内容，在后面我会有更为详细的讲述。当然，你得注意次序，因为include是按次来载入文件，最先载入的[.d]文件中的目标会成为默认目标。
