[TOC]

### 强制： 用户传入的任何参数都必须做有效性校验

说明：忽略参数校验可能导致：

+ page size 过大导致内存溢出
+ 恶意order by 导致数据库慢查询
+ 任何重定向
+ SQL 注入
+ 反序列化
+ 正则输入源串拒绝服务ReDos


> 说明：Java 代码用正则来验证客户端的输入，有些正则写法验证普通用户输入没有问题，但是如果攻击人员使用的是热书构造的字符串来验证，有可能导致死循环的效果。



### URL 的特殊字符


当几种特定的字符集合出现在URL中时，必须特别注意：

1. 在URL中有特殊意义的字符，也就是保留字符

```
;/?:@&=+$,   一共十个
```


这些字符通常在URL中使用时，是有特殊含义的（如“：”把每一个部分隔离开）。如果一个URL的某一部分（如查询参数的一部分）可能包含这些字符之一，则应该在放入URL之前对其进行转义处理。


2. 注意非保留字符集
```
-_.!~*'()  一共9个
```
这些字符可以被用在URL的大多数位置，只有某些地方不能出现
当它们作为URL的部分时，不需要编码/转义，你可以对它们进行转义操作且不影响URL 的语义,但不建议这么做

3. 不推荐字符 也就是避用字符集合，使用它们是不明智的:
```
{ } | \ ^ [ ] `::数字1键前的那个左上点:: {8个}

```
不明智的原因:网关有时会修改这样的字符,或者将其作为分隔符使用.这并不意味着网关总会修改这些字符,但这种情况可能发生.如果真是要使用这些字符,请做转义处理.


4. 例外字符集 这组字符集是所有的ASCII控制字符组成.包含空格字符以下列字符:
```
< > # % " {5 个}
```

控制字符是不可打印的US-ASCII字符(十六进制00~1F及7F)如果使用,请转义处理.有些字符#(哈希)和%(百分比)在URL上下文中有着特殊含义,你可以把它们当作保留字符对待.这个集合中的其它字符无法被打印,因此对它们进行转义是唯一的表示方式, < > " 这三个字符需要被转义，因为这些字符通常用来在文本中分隔URL



##### 死循环的正则表达式


```java {.line-numbers}

final Pattern pattern = Pattern.compile("(0*)*A");
		final String input = "0000000000000000000000000000000000000000000000";
	 
		long startTime = System.currentTimeMillis();
		Matcher matcher = pattern.matcher(input);
		System.out.println(matcher.find());
		System.out.println("Regex took:" + (System.currentTimeMillis() - startTime) + "ms");

```

上面的代码执行会造成死循环，cpu打满

查看源码，比较复杂，大概就是i其实在某些情况下会向前移，也就是 会回溯搜索，一直在小范围里兜圈，导致浪费时间；


oracle 官方帖子的评论

> 评估它不会遇到“无限循环”，正则表达式会遇到“指数回溯”，因为它永远不能匹配最后的空格字符，而它在正则表达式中的“*”使用会使其回溯。尝试占有性量子应该有助于解决问题。虽然这确实不是正则表达式引擎的错误，但在引擎中进行一些优化来检测这种回溯并在早期消除匹配可能会很好。



[JDK-7006761：Matcher.matches（）具有无限循环](https://bugs.java.com/bugdatabase/view_bug.do?bug_id=7006761)
[jdk 关于正则的bug在jdk9已修复](https://bugs.java.com/bugdatabase/view_bug.do?bug_id=6988218)






#### 代码参考

```java
	/**
	 * 尝试查找与模式匹配的下一个序列
	 * Attempts to find the next subsequence of the input sequence that matches
	 * the pattern.
	 *
	 * <p> This method starts at the beginning of this matcher's region, or, if
	 * a previous invocation of the method was successful and the matcher has
	 * not since been reset, at the first character not matched by the previous
	 * match.
	 *
	 * <p> If the match succeeds then more information can be obtained via the
	 * <tt>start</tt>, <tt>end</tt>, and <tt>group</tt> methods.  </p>
	 *
	 * @return  <tt>true</tt> if, and only if, a subsequence of the input
	 *          sequence matches this matcher's pattern
	 */
	public boolean find() {
		// 从上次结束的位置开始本次搜索
		int nextSearchIndex = last;       
		if (nextSearchIndex == first)
			nextSearchIndex++;

		// 如果下次搜索的起始点 在region之前， 把指针移动到region开始点
		if (nextSearchIndex < from)
			nextSearchIndex = from;

		// If next search starts beyond region then it fails
		if (nextSearchIndex > to) {
			// 清空group
			for (int i = 0; i < groups.length; i++)
				groups[i] = -1;
			return false;
		}
		return search(nextSearchIndex);
	}



	/**
	 * 回过头去看
	 * 
	 * 最后一次匹配到模式串的范围，如果最后失败，first=-1,last=0;
	 * last 也是下一次匹配的开始点；
	 */
	 int first = -1, last = 0;

    /**
	 * 材料字符串的范围， 将在这个区间内匹配
	 */
	int from, to;

    /**
	 * 储存 group,如果group被跳过，它们可能包含无效值
     */
	int[] groups;
	



    /**
	 * 在给定的范围内，启动搜索。
	 * groups被填充为默认值，调用parentPattern.root.match。 匹配程序会一直做匹配运算
	 * 
	 * Matcher.from 是硬边界，所以他在这里不设置，函数参数from是软参数，表示搜索的开始点，这意味着正则将匹配这个点，但是^不匹配这个点。 子序列 在 软边界内  调用搜索方法，而这个软边界就是上次结束的点。
     */
    boolean search(int from) {
        this.hitEnd = false;
        this.requireEnd = false;
		from        = from < 0 ? 0 : from;
		this.first  = from;		
		this.oldLast = oldLast < 0 ? from : oldLast;
		
		// 初始化
        for (int i = 0; i < groups.length; i++)
            groups[i] = -1;
		acceptMode = NOANCHOR;
		
        boolean result = parentPattern.root.match(this, from, text);
		
		if (!result)
            this.first = -1;
        this.oldLast = this.last;
        return result;
    }




//Pattern.class

    /**
     * Base class for all node classes. Subclasses should override the match()
     * method as appropriate. This class is an accepting node, so its match()
     * always returns true.
     */
    static class Node extends Object {
        Node next;
        Node() {
            next = Pattern.accept;
        }
        /**
         * This method implements the classic accept node.
         */
        boolean match(Matcher matcher, int i, CharSequence seq) {
            matcher.last = i;
            matcher.groups[0] = matcher.first;
            matcher.groups[1] = matcher.last;
            return true;
        }
        /**
         * This method is good for all zero length assertions.
         */
        boolean study(TreeInfo info) {
            if (next != null) {
                return next.study(info);
            } else {
                return info.deterministic;
            }
        }
    }

    /**
     * Handles the curly-brace style repetition with a specified minimum and
     * maximum occurrences. The * quantifier is handled as a special case.
     * This class handles the three types.
     */
    static final class Curly extends Node {
        Node atom;
        int type;
        int cmin;
        int cmax;

        Curly(Node node, int cmin, int cmax, int type) {
            this.atom = node;
            this.type = type;
            this.cmin = cmin;
            this.cmax = cmax;
        }
        boolean match(Matcher matcher, int i, CharSequence seq) {
            int j;
            for (j = 0; j < cmin; j++) {
                if (atom.match(matcher, i, seq)) {
                    i = matcher.last;
                    continue;
                }
                return false;
            }
            if (type == GREEDY)
                return match0(matcher, i, j, seq);
            else if (type == LAZY)
                return match1(matcher, i, j, seq);
            else
                return match2(matcher, i, j, seq);
        }
        // Greedy match.
        // i is the index to start matching at
        // j is the number of atoms that have matched
        boolean match0(Matcher matcher, int i, int j, CharSequence seq) {
            if (j >= cmax) {
                // We have matched the maximum... continue with the rest of
                // the regular expression
                return next.match(matcher, i, seq);
            }
			int backLimit = j;
			// 这一部分 i 在兜圈子
            while (atom.match(matcher, i, seq)) {
                // k is the length of this match
                int k = matcher.last - i;
                if (k == 0) // Zero length match
                    break;
                // Move up index and number matched
                i = matcher.last;
                j++;
                // We are greedy so match as many as we can
                while (j < cmax) {
                    if (!atom.match(matcher, i, seq))
                        break;
                    if (i + k != matcher.last) {
                        if (match0(matcher, matcher.last, j+1, seq))
                            return true;
                        break;
                    }
                    i += k;
                    j++;
                }
                // Handle backing off if match fails
                while (j >= backLimit) {
                   if (next.match(matcher, i, seq))
                        return true;
                    i -= k;
                    j--;
                }
                return false;
            }
            return next.match(matcher, i, seq);
        }
```

















