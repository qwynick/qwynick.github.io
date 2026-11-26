---
title: "ARC165 C - Social Distance on Graph"
contest: ARC165
problem: C
url: https://atcoder.jp/contests/arc165/tasks/arc165_c
difficulty: 1743
score: 600
tags:
  - 状压DP
thinking: 想了一阵
---

# 题目分析

有点像典狱长那个题。

一开始的小边肯定设置为不同色，用并查集维护。

直到出现一条边连到同一个集合（即同一个颜色），此时这条边成为瓶颈，结束。

但是结果并不一定就是这条边的长度，因为可能存在一个点连出两条更小的边，这样对应的连个端点也是同色的。

所以还需要先求一下这种一个点连出两个边的最短和。

复杂度 $O(MlogM)$。

# 解题过程
想到了短的尽量不同色直到必须连同色为止。但是忽略了可能永远不出现同色边，循环不提前终止，导致输出漏了。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
array<int, 3> d[N];
int p[N * 2], ans[N][2];
int find(int node) { return node == p[node] ? node : p[node] = find(p[node]); }
void pro(int x, int v) {
  if (ans[x][1] > v) ans[x][1] = v;
  if (ans[x][0] > ans[x][1]) swap(ans[x][0], ans[x][1]);
}
void solve() {
  int n, m, a, b, c, mn = INT_MAX;
  cin >> n >> m, iota(p, p + n * 2, 0), memset(ans, 0x3f, sizeof(ans));
  for (int i = 0; i < m; i++) {
    cin >> a >> b >> c, --a, --b;
    pro(a, c), pro(b, c);
    d[i] = {c, a, b};
  }
  for (int i = 0; i < n; i++) mn = min(mn, ans[i][0] + ans[i][1]);
  sort(d, d + m);
  for (int i = 0; i < m; i++) {
    auto [c, a, b] = d[i];
    a *= 2, b *= 2;
    if (find(a) == find(b)) {
      cout << min(mn, c);
      return;
    } else {
      int a1 = find(a), a2 = find(a + 1), b1 = find(b), b2 = find(b + 1);
      p[a1] = b2, p[a2] = b1;
    }
  }
  cout << mn;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
