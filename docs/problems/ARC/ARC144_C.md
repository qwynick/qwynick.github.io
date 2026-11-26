---
title: "ARC144 C - K Derangement"
contest: ARC144
problem: C
url: https://atcoder.jp/contests/arc144/tasks/arc144_c
difficulty: 1622
score: 600
tags:
  - 思维
thinking: 很快有思路，但有较大漏洞
---

# 题目分析

手玩一下，很容易发现就是错位向上排即可，无解就是 $N<2K$。

要最小那么 $A_1=1+K$，其余 $A_i$ 有两种可能，一个是 $i+K$，一个是 $i-K$，手玩一下，比如 $8,2$ 会构成 $2,1,4,3,6,5,8,7$ 似乎就是 $2$ 个数对调。

这在整除时是可以的，比如 $12,3$ 可以排为 $4,5,6,1,2,3,10,11,12,7,8,9$。

关键是不可整除时，比如样例的 $8,3$，似乎就是把前一半拉很长，但是其实如果大一些，比如 $14,3$，其实前六个可以做一段，后面是个 $8,3$ 的问题。只需要后面 $8,3$ 的问题把前一半排长即可。修改后WA了第二次。

继续手玩，发现比如 $11,3$ 这种，结果是 $4,5,6,1,2,9,10,11,3,7,8$，也就是说如果 $N>3K$，其实会有 $N-3K$ 个小数排到前面，然后再排最大的数，再排剩下的小数，再排剩下的大数。

所以终局是两种情况 $<3K$ 只能把剩下的打的排完才能排小的，$<4K$ 排 $K$ 个大的之后，可以排出超出 $3K$ 个的小的，再排最大的，再排剩下的部分。

复杂度 $O(N)$。

# 解题过程
想错了两次，第一次想得太简单，第二次想到了提前放1，但是 $3K$ 部分想错了，第三次提交对了。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 300005;
vector<int> g[N];
int d[N];
void solve() {
  int n, k;
  cin >> n >> k;
  if (n < k * 2) {
    cout << -1;
    return;
  }
  int i = 1;
  for (; i + 2 * k - 1 <= n; i += 2 * k) {
    if (i + 4 * k - 1 <= n) {
      for (int j = 0; j < k; j++) cout << i + j + k << ' ';
      for (int j = 0; j < k; j++) cout << i + j << ' ';
    } else if (i + 3 * k - 1 <= n) {
      int re = (n - i + 1) % k;
      for (int j = 0; j < k; j++) cout << i + j + k << ' ';
      for (int j = 0; j < re; j++) cout << i + j << ' ';
      for (int j = 0; j < k; j++) cout << n - k + j + 1 << ' ';
      for (int j = re; j < k; j++) cout << i + j << ' ';
      for (int j = 0; j < re; j++) cout << i + j + 2 * k << ' ';
    } else {
      int le = n - i - k;
      for (int j = 0; j <= le; j++) cout << i + j + k << ' ';
      for (int j = 0; j < k; j++) cout << i + j << ' ';
    }
  }
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
