---
title: "ARC132 C - Almost Sorted"
contest: ARC132
problem: C
url: https://atcoder.jp/contests/arc132/tasks/arc132_c
difficulty: 1616
score: 600
tags:
  - 状压DP
thinking: 很快有思路
---

# 题目分析

注意到放置的数字偏差很小，想到可以状压。

每到一个新位置，先把可用的位移动一下，并根据 i+p 是否已经用掉，来标记状压中 i+p 的位值。

遇到指定的数字判定是否在d范围内。

遇到-1则检查哪些位可以转移。

状态 $n2^{2d+1}$，转移 $2d$，复杂度 $O(nd2^{2d+1})$

# 解题过程
没什么问题。但是位想错了调了一会儿。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 506;
vector<int> g[N];
int d[N], mk[N], dp[N][1 << 11];
void add(int& a, int b) {
  a += b;
  if (a >= mod) a -= mod;
}
void solve() {
  int n, p;
  cin >> n >> p;
  for (int i = 1; i <= p; i++) mk[n + i] = 1;
  for (int i = 1; i <= n; i++) {
    cin >> d[i];
    if (d[i] > 0) mk[d[i]] = 1;
  }
  int sz = 2 * p + 1, up = 1 << sz, msk = up - 1, b = (1 << sz) - (1 << p);
  for (int i = 1; i <= p; i++)
    if (mk[i]) b |= 1 << p - i;
  dp[0][b] = 1;
  for (int i = 1; i <= n; i++) {
    if (d[i] > 0) {
      if (abs(d[i] - i) <= p) {
        for (int j = 0; j < up; j++) {
          int b = j << 1 & msk | mk[i + p];
          add(dp[i][b], dp[i - 1][j]);
        }
      }
    } else {
      for (int j = 0; j < up; j++)
        if (dp[i - 1][j]) {
          int b = j << 1 & msk | mk[i + p];
          for (int k = 0; k < sz; k++)
            if (~b >> k & 1) add(dp[i][b | 1 << k], dp[i - 1][j]);
        }
    }
  }
  cout << dp[n][msk];
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
