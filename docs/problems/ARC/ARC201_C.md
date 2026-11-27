---
title: "ARC201 C - Prefix Covering"
contest: ARC201
problem: C
url: https://atcoder.jp/contests/arc201/tasks/arc201_c
difficulty: 1789
score: 600
tags:
  - 思维
  - Trie
thinking: 想了一阵
---

# 题目分析

如果把字符串看成树状，其实就是要覆盖到总根。

当某个结点的所有子节点都被覆盖时该结点被覆盖。

对静态情况，可以递归计算某个点被覆盖的方案数即可。

记有 $x$ 个字符串以结点 $i$ 为终点。结点 $i$ 的子树的总方案数为 $dp[i][0]$，被覆盖的方案数为 $dp[i][1]$，则其被覆盖有两类：
- 以当前结点结束的字符串至少选中一个，子树随意：$dp[i][1]=(2^x-1)*dp[l][0]*dp[r][0]$
- 以当前结点结束的字符串都不选中，子树必须都选中：$dp[i][1]=dp[l][1]*dp[r][1]$

不被覆盖必须自己不选中，子树不全选中：$dp[i][0]=dp[l][0]*dp[r][0]-dp[l][1]*dp[r][1]$


复杂度 $O(\sigma |S|)$。

# 解题过程
很快有了想法，但是计数方式小错了一把，先写了每次重算的力，再优化到只计算更新。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<ll, ll>;
const int mod = 998244353;
const int N = 500005;
vector<int> g[N];
int d[N], tr[N][2], cnt[N], po[N], tot;
pii ans[N];
char s[N];
void dfs(int p, int node) {
  if (!s[p]) cnt[node]++;
  pii res0{1, 0}, res1{1, 0};
  if (s[p]) {
    int c = s[p] - 'A';
    if (!tr[node][c]) tr[node][c] = ++tot;
    dfs(p + 1, tr[node][c]);
  }
  if (tr[node][0]) res0 = ans[tr[node][0]];
  if (tr[node][1]) res1 = ans[tr[node][1]];
  ll ret0 = res0.first * res1.first % mod * po[cnt[node]] % mod;
  ll ret1 = ((po[cnt[node]] - 1) * res0.first % mod * res1.first + res0.second * res1.second) % mod;
  ans[node] = {ret0, ret1};
}
void solve() {
  int n;
  cin >> n;
  po[0] = 1;
  for (int i = 1; i < N; i++) po[i] = po[i - 1] * 2 % mod;
  for (int i = 0; i < n; i++) {
    cin >> s;
    dfs(0, 0);
    cout << ans[0].second << '\n';
  }
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
