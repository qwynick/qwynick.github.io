---
title: "ARC210 B - Tree Sequence"
contest: ARC210
problem: B
url: https://atcoder.jp/contests/arc210/tasks/arc210_b
difficulty: 1506
score: 600
tags:
  - 思维
  - 平衡树
thinking: 很快有思路
---

# 题目分析

手玩一下，发现最终结果和加入顺序没有关系，想一下因为最大的n/2个和最小的n/2个无论如何都不会出现在中位数位置。所以需要关注的只是当前AB集合的元素。

排序后就能得出初始状态。关键是修改的影响。

可以开三个集合分别记录最小的n/2个数、最大的n/2个数，居中的m个数，我们动态维护三个集合，左右集合之和即为答案。

当修改时先根据数值判断在哪边，移除掉；再判断新加的在哪边，加进去即可。

注意一个极端情况，如果左右集合只有一个数，移除后为空，后续加的时候，不能直接和空集比大小。

复杂度 $O((N+M)log(N+M)+Q(logN+logM))$。

# 解题过程
比较set元素的时候，没注意空集，WA了几次。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 200005;
vector<int> g[N];
int a[N], b[N], d[N * 2];
void solve() {
  int n, m, q, t, i, x, v;
  cin >> n >> m >> q;
  int sz = n / 2 + 1;
  for (int i = 1; i <= n; i++) cin >> a[i];
  for (int i = 1; i <= m; i++) cin >> b[i];
  copy(a + 1, a + n + 1, d + 1), copy(b + 1, b + m + 1, d + n + 1), sort(d + 1, d + n + m + 1);
  multiset<int> R(d + n / 2 + m + 1, d + n + m + 1), E(d + n / 2 + 1, d + n / 2 + m + 1);
  multiset<int, greater<>> L(d + 1, d + n / 2 + 1);
  R.insert(1 << 30), L.insert(-1 << 30);
  ll sum = accumulate(d + 1, d + n / 2 + 1, 0ll) + accumulate(d + n / 2 + m + 1, d + n + m + 1, 0ll);
  while (q--) {
    cin >> t >> i >> x;
    if (t == 1)
      v = a[i], a[i] = x;
    else
      v = b[i], b[i] = x, i += n;
    if (v >= *R.begin()) {
      R.erase(R.find(v)), sum -= v;
    } else if (v <= *L.begin())
      L.erase(L.find(v)), sum -= v;
    else
      E.erase(E.find(v));
    if (x > *R.begin())
      R.insert(x), sum += x;
    else if (x < *L.begin())
      L.insert(x), sum += x;
    else
      E.insert(x);
    if (R.size() > sz) E.insert(*R.begin()), sum -= *R.begin(), R.erase(R.begin());
    if (L.size() > sz) E.insert(*L.begin()), sum -= *L.begin(), L.erase(L.begin());
    if (R.size() < sz) {
      R.insert(*E.rbegin()), sum += *E.rbegin();
      E.erase(prev(E.end()));
    }
    if (L.size() < sz) {
      L.insert(*E.begin()), sum += *E.begin();
      E.erase(E.begin());
    }
    cout << sum << '\n';
  }
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
