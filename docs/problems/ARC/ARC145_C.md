---
title: "ARC145 C - Split and Maximize"
contest: ARC145
problem: C
url: https://atcoder.jp/contests/arc145/tasks/arc145_c
difficulty: 1697
score: 600
tags:
  - 思维
  - 组合数学
thinking: 想了很久
---

# 题目分析

很容易得到出最大值就是每两个最大的配对，所以关键就是确认如何才能将原始数据分开成两条匹配的顺序。

观察不行的情况，比如 $1,3,4,2$，$3,1,2,4$，也就是配对间存在包含关系，当然 $12$ 可以互换，$34$ 也可以互换，互换方案数是 $2^n$。所以关键就是配对组之间的关系。

由于同一组数可以互换，干脆忽略，统一按组编号，以 $n=2$ 为例，合法方案有 $1,1,2,2$，$1,2,1,2$，$2,1,2,1$，$2,2,1,1$。

手算一下前三项查 $OEIS$ 即得到公式 $2^n\frac{(2n)!}{(n+1)!}$。

实际上合法方案对应 $A=1,2,3...N$，$B=1,2,3...N$。要求不嵌套，必须两边都依次取，并且 $A$ 取得快一些，所以方案数即为卡特兰数。

复杂度 $O(N)$。

# 解题过程
想了很久，一开始想错了。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int d[N];
ll qp(ll x, int n) {
  ll ret = 1;
  while (n) {
    if (n & 1) ret = ret * x % mod;
    x = x * x % mod;
    n >>= 1;
  }
  return ret;
}
void solve() {
  int n;
  cin >> n;
  ll fac1 = 1, fac2 = 1;
  for (int i = 2; i <= n * 2; i++) fac1 = fac1 * i % mod;
  for (int i = 2; i <= n + 1; i++) fac2 = fac2 * i % mod;
  cout << fac1 * qp(fac2, mod - 2) % mod * qp(2, n) % mod;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
