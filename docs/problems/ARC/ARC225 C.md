---
title: "ARC225 C - K Spanning Tree"
contest: ARC225
problem: C
url: https://atcoder.jp/contests/arc225/tasks/arc225_c
difficulty: 1733
score: 600
tags:
  - 思维
  - 最小生成树
thinking: 很快有思路
---

# 题目分析

是否有解很容易判断，直接做最小生成树和最大生成树，看代价即可。
要输出方案的话，不能随意放过0或者放过1。
可以先找出在最大/最小生成树中都存在的边，必经边必然在里面，把这些边先连起来，再做最大生成树直到K，再做最小生成树即可。

复杂度$O(m)$。

# 解题过程
直接秒了

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<array<int, 3>> g[2];
int cnt[N], p[N];
int find(int node) { return node == p[node] ? node : p[node] = find(p[node]); }
int calc(int n, int add) {
  iota(p, p + n + 1, 0);
  int ret = 0;
  for (auto [id, a, b] : g[add]) {
    a = find(a), b = find(b);
    if (a != b) p[a] = b, ret += add, cnt[id]++;
  }
  add ^= 1;
  for (auto [id, a, b] : g[add]) {
    a = find(a), b = find(b);
    if (a != b) p[a] = b, ret += add, cnt[id]++;
  }
  return ret;
}
void solve() {
  int n, m, k, a, b, c;
  cin >> n >> m >> k;
  g[0].clear(), g[1].clear();
  for (int i = 1; i <= m; i++) {
    cin >> a >> b >> c;
    g[c].push_back({i, a, b});
  }
  fill(cnt, cnt + m + 1, 0);
  int c0 = calc(n, 0), c1 = calc(n, 1);
  if (c0 > k || k > c1) {
    cout << "-1\n";
    return;
  }
  iota(p, p + n + 1, 0);
  for (auto [id, a, b] : g[0])
    if (cnt[id] == 2) p[find(a)] = find(b), cout << id << ' ';
  for (auto [id, a, b] : g[1])
    if (cnt[id] == 2) p[find(a)] = find(b), k--, cout << id << ' ';
  for (auto [id, a, b] : g[1]) {
    if (!k) break;
    a = find(a), b = find(b);
    if (a != b) p[a] = b, k--, cout << id << ' ';
  }
  for (auto [id, a, b] : g[0]) {
    a = find(a), b = find(b);
    if (a != b) p[a] = b, cout << id << ' ';
  }
  cout << '\n';
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
