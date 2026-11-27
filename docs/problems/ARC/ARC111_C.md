---
title: "ARC111 C - Too Heavy"
contest: ARC111
problem: C
url: https://atcoder.jp/contests/arc111/tasks/arc111_c
difficulty: 1750
score: 600
tags:
  - 思维
thinking: 很快有思路
---

# 题目分析

体重最大的人作为中继去操作肯定是最安全的。所以按体重排序后，依次检查每个人是不是拿的自己的，如果不是，就把手里的传给对应的人，收到对方的货物后，继续操作，直到拿到自己的。

依次检查完每个人后就是答案了。

对于每个环，操作次数为环长-1，是最优的。

对于不同的环，不用相互传递，因为环内最重的人无法主持解决，那么根本传不出来。

复杂度 $O(N)$。

# 解题过程
没什么问题。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int a[N], b[N], hold[N], pos[N];
pii d[N];
void solve() {
  int n;
  cin >> n;
  for (int i = 1; i <= n; i++) cin >> a[i], d[i] = {a[i], i};
  for (int i = 1; i <= n; i++) cin >> b[i];
  for (int i = 1; i <= n; i++) cin >> hold[i], pos[hold[i]] = i;
  sort(d + 1, d + n + 1, greater());
  vector<pii> res;
  for (int i = 1; i <= n; i++) {
    auto [w, id] = d[i];
    while (hold[id] != id) {
      int who = hold[id];
      if (b[hold[who]] >= a[who]) {
        cout << -1;
        return;
      }
      swap(pos[hold[id]], pos[hold[who]]);
      swap(hold[id], hold[who]);
      res.emplace_back(id, who);
    }
  }
  cout << res.size() << '\n';
  for (auto [a, b] : res) cout << a << ' ' << b << '\n';
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
