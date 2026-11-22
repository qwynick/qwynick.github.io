---
title: "miller-rabin与pollard-rho"
catagory: numberTheory
---

miller-rabin
这是一个快速检测素数的方法，其基本出发点为，根据欧拉定理，如果 $n$ 是素数，则 $b^{n-1}=1 \pmod n$。
如果 $n$ 是素数，则必有 $b^\frac{n-1}{2}=\pm 1 \pmod n$。
此时如果 $b^\frac{n-1}{2}=1 \pmod n$ 且 $\frac{n-1}{2}=0 \pmod 2$，则可以继续分解，结果需满足
$b^\frac{n-1}{4}=\pm 1 \pmod n$。
以此类推，直到幂次无法整除 $2$ 或者幂的结果为 $-1$，无法继续分解。分解过程中，如果某个时刻幂的结果 $\ne \pm 1$ 则 $n$ 不是素数。
很显然，这样操作只是确认了必要条件，并不充分。实际上只要跑若干个不同的底数即可大概率确认结果。
```cpp
bool miller(ll n) {
    if (n < 3 || n % 2 == 0) return n == 2;
    ll x = n - 1;
    int up = __lg(n) + 1 << 1, i, s = 0;
    if (up >= n) up = n - 1;
    while (x % 2 == 0) x /= 2, s++;
    for (int b = 2; b <= up; b++) {
        ll v = qp(b, x, n);
        if (v == 1) continue;
        for (i = 0; i < s; i++) {
            if (v == n - 1) break;
            v = __int128(v) * v % n;
        }
        if (s == i) return false;
    }
    return true;
}
```
实际操作并不会按照幂大到幂小分解，因为这样做需要算很多次快速幂，复杂度较高。
实际操作是先对 $n-1$ 进行 $2$ 幂次的分解，写为 $n-1=2^sx$，这里 $x$ 不含 $2$ 的因数。首先对底数算一次快速幂 $b^x$，逐步向高次幂 $b^{2x},b^{4x},...,b^{2^sx}$ 计算。
如果 $b^x=1$，则后面不需要算了，因为平方一定是 $1$，不会出现异常，算下去无意义。

现在考虑 $b^x \ne 1$，由于 $1$ 开根必须是 $\pm 1$，这意味着由非 $1$ 转为 $1$ 的前一步一定是 $-1$。反过来说，平方过程中一定出现 $-1$，否则就不是素数。

rabin 定理表明，选取 $k$ 个小于 $n$ 的数作为底，错判的概率约为 $\frac{1}{4^k}$。
如果广义黎曼猜想正确，对于合数，一定有一个不超过 $2log^2n$ 的数能够检出 $n$ 为合数。
实际上如果限制在 $2^{64}$ 范围内，几个数就能确保测出。

pollard-rho
如果要对一个大素数进行因数分解，可以采用 pollard-rho 算法。
其出发点类似于：一个班上选 $50$ 个人，有 $97\%$ 概率有两个人出生于同一天（模 $365$）。
那么我们随机产生一堆数，只要数字个数足够多，也有相当大的概率有两个数在模 $p$ 意义下相等。
设整数 $n$ 最小的素因子为 $p$，其满足 $p\le \sqrt{n}$。我们产生的随机数只需要能在 $\sqrt{n}$ 以内产生碰撞即可，当然如果碰撞出更大的也可以。

理论上我们只需要将随机生成的数字相减后与 $n$ 求最大公约数，即可求得 $n$ 的因子，只要该因子不为 $1$ 或 $n$，就找到了一个有效的因数。按此因数分解后继续做 pollrd-rho 直到全是素数即可。

但是直接这样做，如果生成了 $m$ 个数字，则完全检查需要 $O(m^2)$ 次。一个更高效的办法是自定义一个特殊的伪随机数产生方式，采用快慢步方式找到周期。
```cpp
bool miller(ll n) {
    if (n < 3 || n % 2 == 0) return n == 2;
    ll x = n - 1;
    int up = __lg(n) + 1 << 1, i, s = 0;
    if (up >= n) up = n - 1;
    while (x % 2 == 0) x /= 2, s++;
    for (int b = 2; b <= up; b++) {
        ll v = qp(b, x, n);
        if (v == 1) continue;
        for (i = 0; i < s; i++) {
            if (v == n - 1) break;
            v = __int128(v) * v % n;
        }
        if (s == i) return false;
    }
    return true;
}
void rho(ll n) {
    if (n % 2 == 0)
        while (n % 2 == 0) f[fn++] = 2, n /= 2;
    if (n == 1) return;
    if (miller(n)) {
        f[fn++] = n;
        return;
    }
    ll x = 0, y = 0, c = uniform_int_distribution<ll>(1, n - 1)(rng);
    while (true) {
        x = (x * x + c) % n;
        y = (y * y + c) % n;
        y = (y * y + c) % n;
        ll g = gcd(abs(x - y), n);
        if (g != 1) {
            rho(g), rho(n / g);
            return;
        }
    }
}
```
可以自行构造一个 `随机数生成器`，比如 $x'=f(x)=x^2+c \pmod n$，可以预见该函数多次执行后，一定会形成周期，因为 $x$ 的取值至多只有 $n-1$ 个。把变化过程画成有向图，形态类似希腊字母 $\rho$。
这个 $\rho$ 形态不仅对模 $n$ 存在，对模 $p$ 也存在，不过由于 $p$ 是 $n$ 的因数，周期很可能会更小。因此如果参数 $c$ 选取得当，会比模 $n$ 的循环更快转圈。

回到我们的初衷，随机到两个数 $x,y$，使得他们在模 $p$ 意义下发生碰撞，即 $x=y \pmod p$。从图的角度看，就是 $x,y$ 对应小环上同一点。
但是这里 $p$ 是我们要求的，显然无法直接验证 $x=y \pmod p$，但我们可以计算 $(x-y,n)$，如果结果不为 $1$，就得到了一个因数。
此外，由于 $p|n$，我们让 $x,y$ 在模 $n$ 的图上跑，不会改变模 $p$ 的结果，即 $a\%(kp)\%p=a\%p$，所以我们可以让 $x,y$ 在模 $p$ 的意义上跑，不影响在模 $p$ 意义上的结果。
对于有向图找环，可以采取快慢指针的方式，初始 $x=y=0$，每一轮 $x=f(x),y=f(f(x))$，如果某一时刻 $x=y \pmod p$ 就找到了解。
但是注意，如果某一时刻在模 $n$ 的图上 $x=y \pmod n$，则需要重新设置 $c$ 参数再进行分解。这是因为由于如果 $x=y \pmod n$，则 $f(x)=f(y) \pmod n$，$f(f(x))=f(f(y)) \pmod n$...，即所有同间距的数对，结果都是一样的。初始时 $x=y=0$，当 $y$ 对 $x$ 形成套圈后，所有的本质不同间距都检测过了，没有必要再跑下去了。

同时，该分解方式对 $2^t$ 会卡死，需要特殊处理。
经大佬证明，期望找到解是 $O(\sqrt{p})$ 的，但是验证还需要一次 $\gcd$，所以总体是 $\sqrt{p}logn$。

这里可以将若干个数据打包之后再求 $\gcd$。因为只要有 $n$ 的因数，乘以别的数之后也不会被模掉，除非成为了 $n$ 的倍数，所以这里打包不能太多。
可以倍增检测的区间，确保一开始有很多小区间用于查找一些周期很短的素数。
```cpp
bool miller(ll n) {
    if (n < 3 || n % 2 == 0) return n == 2;
    ll x = n - 1;
    int up = __lg(n) + 1 << 1, i, s = 0;
    if (up >= n) up = n - 1;
    while (x % 2 == 0) x /= 2, s++;
    for (int b = 2; b <= up; b++) {
        ll v = qp(b, x, n);
        if (v == 1) continue;
        for (i = 0; i < s; i++) {
            if (v == n - 1) break;
            v = __int128(v) * v % n;
        }
        if (s == i) return false;
    }
    return true;
}
void rho(ll n) {
    while (n % 2 == 0) f[fn++] = 2, n >>= 1;
    if (n == 1) return;
    if (miller(n)) {
        f[fn++] = n;
        return;
    }
    ll x = 0, y = 0, c = uniform_int_distribution<ll>(1, n - 1)(rng), pd = 1;
    auto f = [&](ll x) { return (__int128(x) * x + c) % n; };
    for (int len = 1;; len <<= 1, x = y, pd = 1) {
        for (int i = 1; i <= len; i++) {
            y = f(y);
            pd = pd * __int128(x - y) % n;
            if (pd == 0) {
                rho(n);
                return;
            }
            if (i % 63 == 0) {
                ll g = gcd(abs(pd), n);
                if (g > 1) {
                    rho(g), rho(n / g);
                    return;
                }
            }
        }
        ll g = gcd(abs(pd), n);
        if (g > 1) {
            rho(g), rho(n / g);
            return;
        }
    }
}
```
