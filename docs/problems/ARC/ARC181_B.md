---
title: "ARC181 B - Annoying String Problem"
contest: ARC181
problem: B
url: https://atcoder.jp/contests/arc181/tasks/arc181_b
difficulty: 1633
score: 600
tags:
  - 思维
  - 字符串
thinking: 很快有思路
---

# 题目分析

观察第一组样例，很容易发现如果两端一样可以直接消去，直至两端都不一样。
手玩一下比如结果是 $TSTST$ 和 $SSS$，那么必要的条件是 $TTT=S$，否则字符数量不匹配。
是否充分呢？可以发现是充分的，把 $S=TTT$ 带回即得。

于是原问题可以直接把 $0$ 和 $1$ 按数量消去，变为 $a$ 个 $S$ 能否转为 $b$ 个 $T$ 的问题。显然可以先做一个 $GCD$，此时 $a \perp b$，$a$ 个 $S$ 能转为 $b$ 个 $T$ 的充要条件就是 $s$ 能被切分为 $b$ 段相同的。

复杂度$O(|S|+|X|+|Y|)$。

# 解题过程
走了一点弯路，用 $kmp$ 去求了一下周期，实际必须是整除。

# 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using pii = pair<int, int>;
const int mod = 998244353;
const int N = 500005;
vector<int> g[N];
bool check(int z, int o, string& s) {
  if (s.length() * z % o) return false;
  int g = gcd(z, o);
  z /= g, o /= g;
  if (s.length() % o) return false;
  o = s.length() / o;
  for (int i = o; i < s.length(); i += o) {
    for (int j = 0; j < o; j++)
      if (s[j] != s[i + j]) return false;
  }
  return true;
}
void solve() {
  string s, x, y;
  cin >> s >> x >> y;
  int x0 = ranges::count(x, '0'), x1 = x.length() - x0;
  int y0 = ranges::count(y, '0'), y1 = y.length() - y0;
  int m0 = min(x0, y0), m1 = min(x1, y1);
  x0 -= m0, y0 -= m0;
  x1 -= m1, y1 -= m1;
  if (x0 && y1) {
    cout << (check(x0, y1, s) ? "Yes\n" : "No\n");
  } else if (x1 && y0) {
    cout << (check(y0, x1, s) ? "Yes\n" : "No\n");
  } else
    cout << (!x0 && !y0 ? "Yes\n" : "No\n");
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
