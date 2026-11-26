---
title: "ARC147 C - Min Diff Sum"
contest: ARC147
problem: C
url: https://atcoder.jp/contests/arc147/tasks/arc147_c
difficulty: 1704
score: 600
tags:
  - 三分
thinking: 很快有思路
---

# 题目分析

如果是固定位置就是中位数，这里是范围，但是容易想到应该也有一个极小值区域，在中间某个区域，此时左侧过不来的和右侧过不来的数量相等，所以三分找极值即可。

每次计算总代价需要先排序，因此是 $NlogN$。

复杂度 $O(NlogNlogA)$，这里 $A$ 是坐标的值域。

# 解题过程
没什么问题。官方题解似乎有神秘做法。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 300005;
vector<int> g[N];
int d[N], l[N], r[N], n;
ll check(int v) {
  for (int i = 0; i < n; i++)
    if (l[i] > v)
      d[i] = l[i];
    else if (r[i] < v)
      d[i] = r[i];
    else
      d[i] = v;
  sort(d, d + n);
  ll ret = 0, sum = 0;
  for (int i = 0; i < n; i++) {
    ret += ll(d[i]) * i - sum;
    sum += d[i];
  }
  return ret;
}
void solve() {
  cin >> n;
  for (int i = 0; i < n; i++) cin >> l[i] >> r[i];
  int low = *min_element(l, l + n), up = *max_element(r, r + n);
  while (low + 2 < up) {
    int ml = (low * 2 + up) / 3, mr = (low + up * 2) / 3;
    ll ckl = check(ml), ckr = check(mr);
    if (ckl < ckr)
      up = mr;
    else
      low = ml;
  }
  ll ans = LLONG_MAX;
  for (int i = low; i <= up; i++) ans = min(ans, check(i));
  cout << ans;
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
