---
title: "ARC206 C - Tree Sequence"
contest: ARC206
problem: C
url: https://atcoder.jp/contests/arc206/tasks/arc206_c
difficulty: 1461
score: 600
tags:
  - 思维
  - 线性DP
thinking: 想了一阵
---

# 题目分析

题意非常抽象，简而言之就是对每一段 $l,r$，都存在一个 $l \le x \le r$ 使得除了 $b_x$ 外，所有的 $i$ 都与 $b_i$ 连边，使得 $l \sim r$ 构成一棵树。

观察样例1和2可以有不少启示，比如：
- 如果 $b_1=2$，那么 $1,2$ 号位一定可以成立，此时第二个是无所谓的。如果 $b_2=3$ 那么第三个位置是无所谓的，否则 第三个位置必须满足 $b_3=2$，否则 $2,3$ 区间不满足。
- 如果 $b_1\ne2$，那么 $b_2=1$ 才能满足前两个位置的子区间，同时 $b_3=2$ 才能满足 $2,3$ 构成的子区间，以此类推，其实已经定死了。

于是可以写一个 $dp[i][0/1]$，表示 $dp$ 到第 $i$ 个位置已经覆盖了后一位/未覆盖后一位的方案数。相应转移即可。

复杂度 $O(N)$。

# 解题过程
好一阵才看懂题目。注意 $n=1$ 的情况。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int d[N], dp[N][2];
void solve() {
  int n;
  cin >> n;
  if (n == 1) {
    cout << 1;
    return;
  }
  for (int i = 1; i <= n; i++) cin >> d[i];
  if (d[1] > 0) {
    if (d[1] == 2)
      dp[1][1] = 1;
    else
      dp[1][0] = n - 1;
  } else
    dp[1][1] = 1, dp[1][0] = n - 1;
  for (int i = 2; i <= n; i++)
    if (d[i] == i + 1)
      dp[i][1] = dp[i - 1][1];
    else if (d[i] == i - 1)
      dp[i][0] = (dp[i - 1][0] + dp[i - 1][1]) % mod;
    else if (d[i] > 0)
      dp[i][0] = dp[i - 1][1];
    else {
      dp[i][1] = dp[i - 1][1];
      dp[i][0] = (dp[i - 1][0] + dp[i - 1][1] * ll(n - 1)) % mod;
    }
  cout << (dp[n][0] + dp[n][1]) % mod;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
