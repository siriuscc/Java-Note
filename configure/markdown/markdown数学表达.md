[TOC]


## 4. 数学和LaTeX 
$ 表示行内公式： 

质能守恒方程可以用一个很简洁的方程式 $E=mc^2$ 来表达。

$$ 表示整行公式：

$$\sum_{i=1}^n a_i=0$$



### 4.1 常用计算速查





|功能		  	| 语法   | 
|--------		| -----:  | 
| 括号|	直接()[] $ \{ x  \} $|
| 括号匹配大小	|	$\left(\frac{\sqrt x}{y^3}\right)$
| 绝对值,∥x∥ ⟨x⟩|	$\vert x \vert $ $\Vert x \Vert$ $\langle x \rangle$
| 向上取整⌈x⌉向下取整|	$\lceil x\rceil$ $\lfloor x\rfloor$
| 额外的括号	|	$ \left.\frac12\right\rbrace $
| 累加 			|	$\sum_1^n$ , $\sum_{i=0}^\infty i^2$
| 累乘 			|	$\prod_1^n$ , $\prod_{i=1}^n i^2 $
| 积分 			|	$\int_1^n,\int_{i=1}^n i^2,\iint,\iiint$
| 并,交			|	$\bigcup_1^n x_i $$ $$\bigcap $
| 分数			|$ \frac ab$ $ \frac{a+1}{b+1}+{a+1\over b+1} $|
| 开方			|$\sqrt{x^3}$, $\sqrt[3]{\frac xy}$

<br>
<br>
<br>
<br>
<br>
<br>

|功能		  	| 语法   | 
|--------		| -----:  | 
| 取极限		|$\lim_{x\to 0}$
| 三角函数		|$\sin x$
| 逻辑运算		|$\lt \gt \le \ge \neq $
| 加减乘除点 	|$\times \div \pm \mp  x\cdot y $
| 集合运算		|$\cup \cap \setminus \subset \subseteq \subsetneq \supset \in \notin \emptyset \varnothing$
||$${n+1 \choose 2k} or \binom{n+1}{2k}$
| 各种箭头		|$\to \rightarrow \leftarrow \Rightarrow \Leftarrow \mapsto$$
| 逻辑运算		|$\land \lor \lnot \forall \exists \top \bot \vdash \vDash$$
| 异或，点，星	|$\star \ast \oplus \circ \bullet$
| 约等于...		|$\approx \sim \simeq \cong \equiv \prec \lhd$
|无限大			|$\infty \aleph_0 \nabla \partial \Im \Re $


<br>
<br>
<br>
<br>
<br>
<br>


|功能		  	| 语法   | 
|--------		| -----:  | 
||$a\equiv b\pmod n$
||$\epsilon , \varepsilon ,\phi , \varphi , \ell$
||$\hat x , \widehat{xy} , \bar{x}, \overline{xyz}, \vec{x} ,\overrightarrow{xyz},\overleftrightarrow{xy}$
||$\dot{x} ,\ddot{x}$
||$\backslash$
|希腊字母|$\alpha, \beta, …, \omega$
||$\Gamma, \Delta, …, \Omega$







#### 省略号
$ a_1,a_2,\ldots,a_n$
$ a_1+a_2+\ldots+a_n$
$ a_1+a_2+\cdots+a_n$


#### 字体
$ \mathsf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}   $
$ \mathcal{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $
$ \mathscr{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $
$ \mathfrak{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $



#### 常用公式
$x_i^2$，$x_i^2+x_{i^2}$，$10^{10}$
$\log_2 x$
${x^y}^z+x^{y^z}$
$\sum^{j-1}_{k=0}{\widehat{\gamma}_{kj} z_k}$
$\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}$
$f(x_1,x_x,\ldots,x_n) = x_1^2 + x_2^2 + \cdots + x_n^2 $
$\displaystyle \lim_{t \to 0} \int_t^1 f(t)\, dt$
$\lim_{t \to 0} \int_t^1 f(t)\, dt$.


如果需要大小调整，大小写切换写
$$\Biggl(\biggl(\Bigl(\bigl((x)\bigr)\Bigr)\biggr)\Biggr) gives (((((x)))))$$

##### 括号自适应大小

$$(\frac{\sqrt x}{y^3})$$
$$ \left(\frac{\sqrt x}{y^3}\right)$$


##### 等式

$$
	\begin{aligned}
		a &= b + c \\
		&= d + e + f + g \\
		&= h + i
	\end{aligned}
$$



### 4.2 矩阵

$
    \begin{matrix}
    1 & x & x^2 \\
    1 & y & y^2 \\
    1 & z & z^2 \\
    \end{matrix}
$ , $
	\begin{pmatrix} 
	1 & 2 \\
    1 & 2 \\
	\end{pmatrix}
$ , $	
	\begin{bmatrix} 
	1 & 2 \\
    1 & 2 \\
	\end{bmatrix}
$ , $
	\begin{Bmatrix} 
	1 & 2 \\
    1 & 2 \\
	\end{Bmatrix} 
$ , $
	\begin{vmatrix} 
	1 & 2 \\
    1 & 2 \\
	\end{vmatrix} 
$ , $
	\begin{Vmatrix} 
	1 & 2 \\
    1 & 2 \\
	\end{Vmatrix} 
$


#### 省略元素 \cdots ⋯ \ddots ⋱ vdots ⋮



$$
    \begin{matrix}
    a_{11} & a_{12} & a_{13} & \cdots & a_{1n} \\
    a_{21} & a_{22} & a_{23} & \cdots & a_{2n} \\
    \vdots & \vdots & \vdots & \ddots & \vdots \\
    a_{n1} & a_{n2} & a_{n3} & \cdots & a_{2n} \\
    \end{matrix}
$$

$$ \left[
\begin{array}{cc|c}
  1&2&3\\
  4&5&6
\end{array}
\right] 
$$


$$
  f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}
\end{cases}
$$


$$
\left.
\begin{array}{l}
\text{if $n$ is even:}&n/2\\
\text{if $n$ is odd:}&3n+1
\end{array}
\right\}
=f(n)
$$



##### 上下行的间距调整 ex
$$
f(n) =
\begin{cases}
\frac{n}{2},  & \text{if $n$ is even} \\[5ex]
3n+1, & \text{if $n$ is odd}
\end{cases}
$$


$$
\left\{ 
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{array}
\right. 
$$

#### aligned 对齐
$$ 
\left\{
\begin{aligned} 
a_1x+b_1y+c_1z &=d_1+e_1 \\ 
a_2x+b_2y&=d_2 \\ 
a_3x+b_3y+c_3z &=d_3 
\end{aligned} 
\right. 
$$


#### 继续用em调整行距
$$\begin{cases}
a_1x+b_1y+c_1z=d_1 \\[2ex] 
a_2x+b_2y+c_2z=d_2 \\[2ex] 
a_3x+b_3y+c_3z=d_3
\end{cases}
$$

### 4.3 颜色

$\color{black}{blackText}$，$\color{gray}{grayText}$
$\color{silver}{silverText}$，$\color{white}{whiteText}$

$\color{maroon}{maroonText}$，$\color{red}{redText}$
$\color{yellow}{yellowText}$，$\color{green}{greenText}$
$\color{teal}{tealText}$，$\color{aqua}{aquaText}$
$\color{blue}{blueText}$，$\color{navy}{navyText}$
$\color{purple}{purpleText}$，$\color{fuchsia}{fuchsiaText}$


### 4.4 因为所以
$$
	\begin{aligned}
	\because 	T &=S*n  \\
	&\therefore	S \le 2\\
	&\therefore	T \le 2n \\
	&\therefore T =O(n)
	\end{aligned}
$$