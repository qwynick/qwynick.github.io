---
title: "ABC485 F - Big Bridge"
contest: ABC485
problem: F
url: https://atcoder.jp/contests/abc485/tasks/abc485_f
difficulty: 2004
score: 525
tags:
  - 动态规划
  - 背包
thinking: 很快有思路
---

# 题目分析

由于可以拿起的重量跟个数有关，如果走了 $i$ 轮，对于重量在 $i$ 以下的物品，全部拿完；对于重量在 $i$ 以上的物品，如果拿了 $j$ 个，实际等于拿了 $m+i*j$ 的重量。
如果顺序 $dp$，当重量超过时，需要将物品的影响从数组中移除，不好操作，但是倒序 $dp$ 只会加入，好操作。
一个直接的思路是，$dp[i][j]$ 记录选了 $i$ 个物品，重量为 $j$ 的价值。这样背包大小为 $NM$，空间复杂度为 $N^2M$，勉强可以，但是时间复杂度会去到 $N^3M$，实测本地大数据需要 $5s$ 左右。
所以不能将价值原样记录。
实际上，我们可以只记录在当前时点面对的各种重量，当然，不能每枚举一个重量 $dp$ 一次，否则复杂度更加爆炸。
实际上，对于在两个有物品的重量之间，$dp$ 值是平移的。比如说对于选 $3$ 个物品的方案，每少过一次桥，重量加 $3$。
所以我们只需要在有物品放入时进行 $dp$，对于中间区间，直接平移查询即可。

每个物品只会在走桥次数等于自己的重量时进行 $dp$，因此最多 $N$ 轮，每次 $dp$ 需要将个数 $O(N)$ 和背包容量 $M$ 刷一遍，因此总复杂度 $O(N^2M)$。

# 解题过程
一开始注意到复杂度问题，但是还是写了个 $O(N^3M)$，转移关系想得有点乱，调试了一阵。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 10001;
vector<int> g[N];
pii d[N];
ll dp[101][N], ans[N], sum[N];
void solve() {
  int n, m;
  cin >> n >> m;
  ll vs = 0;
  for (int i = 1; i <= n; i++) cin >> d[i].first >> d[i].second, vs += d[i].second;
  sort(d + 1, d + n + 1), fill(ans + d[n].first, ans + m + 1, vs);
  int r = n, df = 0;
  while (r) {
    int l = r;
    while (l >= 1 && d[l].first == d[r].first) vs -= d[l--].second;
    if (df)
      for (int j = n - l; j >= 1; j--)
        for (int k = m; k >= 0; k--) dp[j][k] = k >= df * j ? dp[j][k - df * j] : 0;
    for (int i = r; i > l; i--)
      for (int j = n - l; j >= 1; j--)
        for (int k = m; k >= 0; k--) dp[j][k] = max(dp[j][k], dp[j - 1][k] + d[i].second);
    df = d[r].first - d[l].first;
    for (int i = 0; i <= n - l; i++)
      for (int j = 1; j <= df; j++)
        if (i * j <= m) ans[d[r].first - j] = max(ans[d[r].first - j], dp[i][m - i * j] + vs);
    r = l;
  }
  for (int i = 0; i <= m; i++) cout << ans[i] << '\n';
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
