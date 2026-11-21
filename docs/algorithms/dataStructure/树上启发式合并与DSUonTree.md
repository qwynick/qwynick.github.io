---
title: "树上启发式合并与DSU on Tree"
catagory: dataStucture
---

树上启发式合并
一般用map记录子树信息，然后一步步向上合并，合并的时候，考虑map的大小，从小的合并入大的


DSU on Tree
```cpp
void add(int k) {
    if (++cnt[k] > mxm)
        mxm = cnt[k], mxk = 1;
    else if (cnt[k] == mxm)
        mxk++;
}
```

第一轮dfs确定dfs序、确定重儿子。
```cpp
void dfs1(int node) {
    L[node] = ++ts, idx[ts] = node;
    for (int nxt : g[node]) {
        dfs1(nxt), sz[node] += sz[nxt];
        if (sz[nxt] > sz[hv[node]]) hv[node] = nxt;
    }
    R[node] = ts;
}
```

第二轮dfs开始处理数据
由于子树之间数据不能干扰，所以每个子树跑完都应该清空再处理下一个。
因为轻儿子较小，首先处理轻儿子，这样可以保证复杂度。
重儿子处理完后，可以不清空，此时将轻儿子一并算进来，统计当前根这个大子树的信息。
这里利用dfs序进行快速区间add和del。
keep记录当前结点是否是重儿子，重儿子keep；轻儿子不keep，结束时需要清空。
```cpp
void dfs2(int node, int keep) {
    for (int nxt : g[node])
        if (nxt != hv[node]) dfs2(nxt, 0);
    if (hv[node]) {
        dfs2(hv[node], 1);
        for (int nxt : g[node])
            if (nxt != hv[node])
                for (int i = L[nxt]; i <= R[nxt]; i++) add(c[idx[i]]);
    }
    add(c[node]);
    sum += ull(mxm ^ node) * (mxk ^ node) % mod9;
    if (!keep) {
        for (int i = L[node]; i <= R[node]; i++) cnt[c[idx[i]]] = 0;
        mxm = mxk = 0;
    }
}
```
