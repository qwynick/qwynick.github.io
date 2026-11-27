---
title: "ARC117 C - Tricolor Pyramid"
contest: ARC117
problem: C
url: https://atcoder.jp/contests/arc117/tasks/arc117_c
difficulty: 1768
score: 600
tags:
  - 思维
thinking: 瞄了一下题解
---

# 题目分析

直接暴力是 $O(N^2)$，显然不行，压缩状态也只能优化系数。考虑直接算贡献，注意到边上的只有一条路上去，而中间的会向左右都贡献。

可以构建一个代数系统，为每个颜色赋予一个值，并且每对元素合并后的结果满足可加性，便可直接求出结果。

构建方式为：令三个颜色分别为 $0,1,2$，合并时即为 $-(a+b)$。很容易验证这个对所有情况成立。

每个点的贡献即为杨辉三角中的组合数。注意奇数行需要反号，偶数行不需要。

复杂度 $O(NlogN)$。

# 解题过程
观察到了每个点贡献不一样，构成杨辉三角，但是没想到用负值进行推演。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 400005;
vector<int> g[N];
char s[N], res[]{'B', 'R', 'W'};
int mp[128], cnt[N];
ll C[N];
ll qp(ll x, int n) {
  ll ret = 1;
  while (n) {
    if (n & 1) ret = ret * x % mod;
    x = x * x % mod;
    n >>= 1;
  }
  return ret;
}
pii calc(int x) {
  int ret = 0;
  while (x % 3 == 0) x /= 3, ret++;
  return {ret, x};
}
void solve() {
  int n;
  cin >> n >> s;
  C[0] = 1;
  for (int i = 1; i < n; i++) {
    auto res1 = calc(n - i), res2 = calc(i);
    cnt[i] = cnt[i - 1] + res1.first - res2.first;
    C[i] = C[i - 1] * res1.second * res2.second % 3;
  }
  mp['B'] = 0, mp['R'] = 1, mp['W'] = 2;
  ll ans = 0;
  for (int i = 0; i < n; i++)
    if (!cnt[i]) ans += mp[s[i]] * C[i];
  ans %= 3;
  if (n % 2 == 0) ans = (3 - ans) % 3;
  cout << res[ans];
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
