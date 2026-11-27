---
title: "ARC215 C - Strong Surname"
contest: ARC215
problem: C
url: https://atcoder.jp/contests/arc215/tasks/arc215_c
difficulty: 1767
score: 600
tags:
  - 思维
  - 强连通分量
thinking: 想了一阵
---

# 题目分析

只要有一个维度不输，就可能赢，所以只要 $\ge$ 就可能赢，因为顺序任意，所以只要能间接赢就是赢。

所以实际上就是按各个大小排序建图后，看强连通分量缩点后那些没有入度的点即可。注意同样大小的需要相互连边。

复杂度 $O(NlogN)$。

# 解题过程
三位偏序一开始感觉有点cdq，但是感觉不太现实，后来想到只要能通过别人间接赢就是赢，就是看强连通分量了。但是处理同大小的时候建环WA了几次，不如写大常数，直接双向边。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int bel[N], dfn[N], low[N], ins[N], deg[N], sz[N], ts, scc;
stack<int> sk;
void dfs(int node) {
  low[node] = dfn[node] = ++ts;
  ins[node] = true, sk.push(node);
  for (int nxt : g[node]) {
    if (!dfn[nxt]) dfs(nxt);
    if (ins[nxt]) low[node] = min(low[node], low[nxt]);
  }
  if (low[node] == dfn[node]) {
    ++scc;
    while (true) {
      int now = sk.top();
      ins[now] = false, sk.pop();
      bel[now] = scc, sz[scc]++;
      for (int nxt : g[now])
        if (bel[nxt] != scc) deg[bel[nxt]] = 1;
      if (now == node) break;
    }
  }
}
pii a[N], b[N], c[N];
void add(pii d[], int n) {
  sort(d, d + n);
  int j = n - 1;
  for (int i = n - 2; i >= 0; i--) {
    g[d[i + 1].second].push_back(d[i].second);
    if (d[i].first != d[j].first) {
      if (i + 1 < j) g[d[i + 1].second].push_back(d[j].second);
      j = i;
    }
  }
  if (j != 0) g[d[0].second].push_back(d[j].second);
}
void solve() {
  int n;
  cin >> n;
  fill(deg, deg + n + 1, 0), fill(dfn, dfn + n, 0), fill(bel, bel + n, 0), fill(sz, sz + n + 1, 0), ts = scc = 0;
  for (int i = 0; i < n; i++) {
    g[i].clear();
    cin >> a[i].first >> b[i].first >> c[i].first;
    a[i].second = b[i].second = c[i].second = i;
  }
  add(a, n), add(b, n), add(c, n);
  for (int i = 0; i < n; i++)
    if (!dfn[i]) dfs(i);
  int ans = 0;
  for (int i = 1; i <= scc; i++)
    if (!deg[i]) ans += sz[i];
  cout << ans << '\n';
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
