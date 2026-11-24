---
title: "ARC192 B - Fennec VS. Snuke 2"
contest: ARC192
problem: B
url: https://atcoder.jp/contests/arc192/tasks/arc192_b
difficulty: 1783
score: 600
tags:
  - 博弈
thinking: 很快有思路
---

# 题目分析

最后剩下两个不能动，因为动一个，对手就会拿另一个。

手玩一下，发现可以转化为动过的N-2个的总和如果是奇数则先手胜，如果是偶数则后手胜。

接下来就是判定先手的人能否决策动的N-2个总和的奇偶性。

显然的是，与偶数的堆没有关系，因为一人拿一个拿完不会改变操作的人，相当于模仿。

也就只需要关注奇数的堆，如果一开始奇数的堆是奇数个，先手拿掉某一堆，总和变为偶数，必胜；如果一开始奇数的堆是偶数，后者可以相应操作一个奇数堆，此时已经操作的和还是偶数，可以模仿。

# 解题过程
return 写错了位置，WA了两次。

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
void solve() {
  int n, x, cnt = 0;
  cin >> n;
  if (n == 1) {
    cout << "Fennec";
    return;
  } else if (n == 2) {
    cout << "Snuke";
    return;
  } else if (n == 3) {
    while (n--) {
      cin >> x;
      if (x & 1) {
        cout << "Fennec";
        return;
      }
    }
    cout << "Snuke";
    return;
  }
  while (n--) cin >> x, cnt ^= x;
  cout << (cnt & 1 ? "Fennec" : "Snuke");
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  solve();
  return 0;
}
```
