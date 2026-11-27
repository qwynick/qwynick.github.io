---
title: "ARC138 C - Rotate and Play Game"
contest: ARC138
problem: C
url: https://atcoder.jp/contests/arc138/tasks/arc138_c
difficulty: 1728
score: 600
tags:
  - 思维
thinking: 很快有思路
---

# 题目分析

看样例猜结论应该就是最大的一半。

证明很简单，就是要避免前面出现连续的大数，导致不得不让出。所以在前面要放很多小数才行。本质上就是任意位置的前缀都是大数小于等于大数个数。

如果记大的一半为-1，小的一半为+1，其实就是求一个起点，向后循环数 $N$ 个数的前缀和不会出现负数。

复杂度 $O(N)$。

# 解题过程
没什么问题。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int d[N], p[N], s[N];
void solve() {
  int n;
  cin >> n;
  for (int i = 1; i <= n; i++) cin >> d[i];
  copy(d + 1, d + n + 1, p + 1), sort(p + 1, p + n + 1);
  int v = p[n / 2], pos = lower_bound(p + 1, p + n + 1, v) - p, cnt = n / 2 + 1 - pos;
  ll ans = accumulate(p + n / 2 + 1, p + n + 1, 0ll);
  for (int i = 1; i <= n; i++)
    if (d[i] < v)
      s[i] = 1;
    else if (d[i] == v && cnt)
      s[i] = 1, --cnt;
    else
      s[i] = -1;
  for (int i = 2; i <= n; i++) s[i] += s[i - 1];
  cout << (min_element(s + 1, s + n + 1) - s) % n << ' ' << ans;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
