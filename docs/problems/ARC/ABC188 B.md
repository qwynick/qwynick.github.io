---
title: "ARC188 B - Symmetric Painting"
contest: ARC188
problem: B
url: https://atcoder.jp/contests/arc188/tasks/arc188_b
difficulty: 1602
score: 600
tags:
  - 思维
  - 打表
thinking: 很快有思路
---

# 题目分析

手玩一下发现 $4|n$ 都不行，并且 $n=2k$ 也不行。手玩奇数都可以。交一个判 $4$ 的倍数再盘 $n\neq 2k$ 结果 $WA$ 了。
打表发现 $(9,3)(15,3)(15,5)(18,3)(18,6)(18,12)(18,15)$ 这种也不行，猜测只要 $GCD>2$ 都不行。

直觉上 $GCD=2$ 应该对称轴可以操作两次，但是更大的就不行了。

复杂度$O(TlogN)$。

# 解题过程
一开始想错了，打表观察后得到了结果。

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
void solve() {
  int n, k;
  cin >> n >> k;
  int g = gcd(n, k);
  if (n % 4 == 0)
    cout << "No\n";
  else
    cout << (g <= 2 ? "Yes\n" : "No\n");
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
