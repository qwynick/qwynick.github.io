---
title: "ARC211 C - Forest"
contest: ARC211
problem: C
url: https://atcoder.jp/contests/arc211/tasks/arc211_c
difficulty: 1792
score: 600
tags:
  - 思维
thinking: 很快有思路，但有漏洞
---

# 题目分析

手玩一下，发现跟最大值的位置有关，只要点击的两个点有最大值或者中间包含最大值，就是结果。

证明：很显然，不会跨区间点击，否则会少两次积分。其次，对于每个连续的 $.$ 区域，只有最大值有意义，且这个最大值一定会被点一下，否则其两侧的 $#$ 无法消除。

如果这个局部最大值不是全局最大值又必须点，那么只点一次肯定是最好的，这是可以做到的。因为如果全局最大值一开始就可以点，那么每次配对都可以和这个最大值；如果最大值一开始不可点，那么把他两侧点开，之后就可以点他了。所有非全局最大值的局部最大值都只点一次，结果最优。

通过上面分析，首次点击可以是暴露的全局最大值和一个局部最大值配对，或者一个被覆盖的全局最大值两侧的局部最大值配对。

注意一个trick，在不可消除位置的最大值无意义，即两头的 $#$。

复杂度 $O(N)$。

# 解题过程
思路没什么问题，但是没注意判断最大值在两侧的情况。

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
char s[N];
void solve() {
  int n;
  cin >> n >> s;
  for (int i = 0; i < n; i++) cin >> d[i];
  int mx = 0;
  vector<pii> res;
  for (int i = find(s, s + n, '.') - s;;) {
    int ed = find(s + i, s + n, '#') - s;
    int mx1 = *max_element(d + i, d + ed);
    int ct = count(d + i, d + ed, mx1);
    res.emplace_back(mx1, ct);
    i = ed;
    mx = max(mx, mx1);
    ed = find(s + i, s + n, '.') - s;
    if (ed == n) break;
    mx1 = *max_element(d + i, d + ed);
    ct = count(d + i, d + ed, mx1);
    res.emplace_back(mx1, ct);
    i = ed;
    mx = max(mx, mx1);
  }
  ll ans = 0;
  for (int i = 1; i + 1 < res.size(); i += 2)
    if (res[i].first == mx || res[i - 1].first == mx || res[i + 1].first == mx) ans += 1ll * res[i - 1].second * res[i + 1].second;
  cout << ans;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
