---
title: "AC自动机"
catagory: string
---

# AC自动机

AC自动机
KMP算法中，模式匹配是在一个串上，如果有很多串，可以构建一颗字典树，$fail$ 指向将在树上产生链条。
首先根据模式串搭建字典树。
```cpp
for (int id = 1; id <= n; id++) {
    cin >> s;
    int node = 0;
    for (int i = 0; s[i]; i++) {
        int ch = s[i] - 'a';
        if (!nxt[node][ch]) nxt[node][ch] = ++tot;
        node = nxt[node][ch];
    }
    p[id] = node;
}
```

根据字典树计算 $fail$ 链条。
注意，由于跳 $fail$ 是按深度跳的，计算深的结点的 $fail$ 时必须保证浅的都算过了。而建树过程（即随之产生的结点编号）并不是，所以需要用 $bfs$ 确保按照深度顺序 build。
根据 $fail$ 到的结点，计算 $go$ 数组（自动机）。

对每个结点，枚举其各种分叉
如果分叉 $i$ 存在：显然，这个点续上 $i$ 就是从当前点走树边的过程（匹配长度+1）。
如果分叉 $i$ 不存在：不断跳 $fail$，直到后继有 $i$。
但是实际上，如果向前跳 $k$ 次后才有分叉 $i$ 的话，向前跳 $1$ 次到达的点继续跳 $k-1$ 也会到达同一个有 $i$ 后继的点，所以直接继承 $fail$ 点的 $i$ 分叉结点即可。
即：$go_{node,i}=go_{fail_{node},i}$
$fail$ 数组实际上形成了一个指向根方向的树，如果后续需要在 $fail$ 树上做一些操作，那么此时可以用 $g$ 存下从根向下的边。

```cpp
void build() {
    int t = 1;
    for (int head = 0; head < t; head++) {
        int node = q[head];
        for (int i = 0; i < M; i++)
            if (nxt[node][i]) {
                go[node][i] = nxt[node][i];
                if (node) fail[nxt[node][i]] = go[fail[node]][i];
                g[fail[nxt[node][i]]].push_back(nxt[node][i]);
                q[t++] = nxt[node][i];
            } else if (node)
                go[node][i] = go[fail[node]][i];
    }
}
```

注意，如果统计信息存在递归情况，可以从后往前传递，避免同一个位置反复在多个传被访问到。