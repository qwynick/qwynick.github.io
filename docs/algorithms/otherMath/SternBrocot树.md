---
title: "SternBrocot树"
catagory: otherMath
---

![图片](https://img2024.cnblogs.com/blog/3629076/202606/3629076-20260616214245847-782132399.png)

Stern-Brocot树可以用于逼近一个分数，首先定义下确界和上确界，然后不断向左或者右平均。
$L=\frac{0}{1},R=\frac{1}{0}$。实际上也可以把下确界定为负无穷 $-\frac{1}{0}$。
假定现在要逼近到 $\frac{3}{7}$。
$L=\frac{0}{1},R=\frac{1}{0},M=\frac{0+1}{1+0}>\frac{3}{7}$，偏大向左，调整右边界到 $M$。
$L=\frac{0}{1},R=\frac{1}{1},M=\frac{0+1}{1+1}>\frac{3}{7}$，偏大向左，调整右边界到 $M$。
$L=\frac{0}{1},R=\frac{1}{2},M=\frac{0+1}{1+2}>\frac{3}{7}$，偏小向右，调整左边界到 $M$。
$L=\frac{1}{3},R=\frac{1}{2},M=\frac{1+1}{3+2}>\frac{3}{7}$，偏小向右，调整左边界到 $M$。
$L=\frac{2}{5},R=\frac{1}{2},M=\frac{2+1}{5+2}=\frac{3}{7}$，找到了。

按照这样的方式构建的所有路径就是 Stern-Brocot 树。
如果数字比较大的话，一步一步走就会很慢，可以一次性走多步。
考虑 $L=\frac{a}{b},R=\frac{c}{d}$，要找 $\frac{p}{q}$，
很显然，应该满足 $\frac{a}{b}<\frac{p}{q}<\frac{c}{d}$。
假设现在 $\frac{a+c}{b+d}<\frac{p}{q}$，则应该向右走，由于每向右一次分子 $+c$，分母 $+d$，所以走的步数 $k$ 需满足 $\frac{a+kc}{b+kd}<\frac{p}{q}$。
即 $aq+kcq<bp+kdp$。
注意正负，整理后得 $k<\frac{bp-aq}{cq-dp}$。由于再向左走会超出，所以下一步一定向右。

假设现在 $\frac{p}{q}<\frac{a+c}{b+d}$，则应该向左走，由于每向左一次分子 $+a$，分母 $+b$，所以走的步数 $k$ 需满足 $\frac{p}{q}<\frac{ka+c}{kb+d}$。
即 $kbp+dp<kaq+cq$。

注意正负，整理后得 $k<\frac{cq-dp}{bp-aq}$。由于再向右走会超出，所以下一步一定向左。

复杂度分析，注意一个特殊情况，每次拐头，区间间隔会缩减到 $1/5$ 以下：
$L=\frac{a}{b},R=\frac{c}{d}$ 向左走：
$L=\frac{a}{b},R=\frac{a+c}{b+d}$ 向右走：
$L=\frac{2a+c}{2b+d},R=\frac{a+c}{b+d}$。
初始时的区间大小 $\frac{c}{d}-\frac{a}{b}=\frac{bc-ad}{bd}$
结束时的区间大小 $\frac{a+c}{b+d}-\frac{2a+c}{2b+d}=\frac{2ab+ad+2bc+cd-2ab-2ad-bc-cd}{(b+d)(2b+d)}=\frac{bc-ad}{(b+d)(2b+d)}$
新老区间的比值为 $\frac{(b+d)(2b+d)}{bd}=\frac{3bd+2b^2+d^2}{bd}=3+\frac{2b}{d}+\frac{d}{b}>5$。
所以复杂度是对数级的。

Stern-Brocot 树的转移也可以写成矩阵形式，若当前边界写为
$\begin{bmatrix} a & c \\ b & d \end{bmatrix}$
则向右一步相当于乘以了矩阵
$\begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} a+c & c \\ b+d & d \end{bmatrix}$

同理向左一步相当于乘以了矩阵
$\begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} a & a+c \\ b & b+d \end{bmatrix}$