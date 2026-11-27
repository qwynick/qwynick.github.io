---
title: "ARC195 C - Hamiltonian Pieces"
contest: ARC195
problem: C
url: https://atcoder.jp/contests/arc195/tasks/arc195_c
difficulty: 1777
score: 600
tags:
  - 思维
thinking: 很快有思路
---

# 题目分析

很容易发现无解的情况：$R$ 为奇数，因为 $B$ 让坐标变化 $2$，$R$ 让坐标变化 $1$。

此时可以用 $B$ 做成一个斜着的平行线，剩余部分用 $R$ 连通即可。

另外如果 $B$ 为奇数，则要求 $R$ 不能为零。

复杂度 $O(R+B)$。

# 解题过程
很快想出了做法，但是实现WA了若干次。

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
  int r, b;
  cin >> r >> b;
  if (r & 1) {
    cout << "No\n";
    return;
  }
  if ((b & 1) && !r) {
    cout << "No\n";
    return;
  }
  vector<pii> res;
  if (b) {
    int le = b + 1 >> 1;
    for (int i = 1; i <= le; i++) res.emplace_back(i, i);
    int le2 = b - le;
    for (int i = 1; i <= le2; i++) res.emplace_back(le - i, 2 + le - i);
    if (r) {
      if (le == le2) {
        int le = r >> 1;
        for (int i = 0; i < le; i++) res.emplace_back(-1, 1 - i);
        res.emplace_back(0, 2 - le);
        for (int i = 2 - le; i <= 0; i++) res.emplace_back(1, i);
      } else {
        int le = r >> 1;
        for (int i = 0; i < le; i++) res.emplace_back(-i, 2);
        for (int i = le - 1; i >= 0; i--) res.emplace_back(-i, 1);
      }
    }
  } else {
    int le = r >> 1;
    for (int i = 1; i <= le; i++) res.emplace_back(i, 1);
    for (int i = le; i >= 1; i--) res.emplace_back(i, 2);
  }
  cout << "Yes\n";
  int dx = 100, dy = 100;
  for (auto [x, y] : res) dx = min(dx, x), dy = min(dy, y);
  for (auto [x, y] : res) {
    x -= dx - 1, y -= dy - 1;
    if (b)
      cout << "B " << x << ' ' << y << '\n', b--;
    else
      cout << "R " << x << ' ' << y << '\n';
  }
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
