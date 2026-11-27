---
title: "ARC163 C - Harmonic Mean"
contest: ARC163
problem: C
url: https://atcoder.jp/contests/arc163/tasks/arc163_c
difficulty: 1711
score: 600
tags:
  - 思维
thinking: 瞄了一下题解
---

# 题目分析

利用 $\frac{1}{k}=\frac{1}{k+1}+\frac{1}{k(k+1)}$，逐项凑出。注意最后一项可能会冲突，此时暴力枚举前面的看哪位可分解即可。

复杂度 $O(N)$。

# 解题过程
一开始觉得项目会很大，没有想到直接拆成相邻的。

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
set<int> st;
void dfs(int fm, int n) {
  if (n == 1) {
    st.insert(fm);
    return;
  }
  int nxt = fm + 1;
  if (st.count(nxt) && n == 2) {
    st.insert(fm);
    for (int x : st) {
      if (!st.count(x + 1) && !st.count(x * (x + 1))) {
        st.erase(x);
        st.insert(x + 1), st.insert(x * (x + 1));
        return;
      }
    }
  } else {
    st.insert(fm * nxt);
    dfs(nxt, n - 1);
  }
}
void solve() {
  int n;
  cin >> n;
  if (n == 2) {
    cout << "No\n";
    return;
  }
  st.clear();
  dfs(1, n);
  cout << "Yes\n";
  for (int x : st) cout << x << ' ';
  cout << '\n';
}
int main() {
  cin.tie(0)->sync_with_stdio(0);
  int t;
  cin >> t;
  while (t--) solve();
  return 0;
}
```
