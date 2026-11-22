---
title: "二分图完美匹配的KM算法"
catagory: graphTheory
---

# 二分图完美匹配的KM算法

KM 算法是在无权的二分图最大匹配 Kuhn 算法基础上考虑权重的算法。

在不考虑权重的 Kuhn 算法中，只要有边就可以尝试增广，在 KM 算法中，需要考虑权重尽量大。
KM 算法在匹配过程中，始终保持前几个左侧点的最大权值匹配，直到所有点都完成匹配。
具体实现方式为，为每个点设置顶标，每条增广的边需满足 $g_{u \rightarrow v}=l_u+r_v$。
一开始设置左侧各个顶标值为相应左侧点向右所有边的最大值，右侧顶标设置为 $0$，之后左顶标只下降，右顶标只上升。
从左侧第一个点开始找增广路，只要没有找到增广路就尝试调节顶标。具体策略为，
- 对于已经匹配的各个点，可以整体降低左侧顶标 $\Delta$，整体提升右侧顶标 $\Delta$，这样操作必然使得 $g_{u \rightarrow v}=l_u+r_v$ 仍然成立，不影响相等性。
- 对于未匹配的点，不调节顶标。这样由于左侧已匹配点降低了，左侧向右侧的增广会更容易，即会产生更多的增广路。

问题是怎么确定 $\Delta$，使得每次调节 $\Delta$ 只会释放出最少的边（一条或与之相等的几条）。注意到我们探索增广路是从左到右的（从右到左只能走匹配边，不需要调节），因此这个 $\Delta$ 应该就是从左到右过程中发现的最小调节量。具体方式即为记录一下整个能触及但权值不对的边中，离 $g_{u \rightarrow v}=l_u+r_v$ 最接近的边，即求出 $\Delta=min(l_u+r_v-g_{u \rightarrow v})$，将所有已匹配的 $l_u$ 调低 $\Delta$、$r_v$ 调高 $\Delta$。注意，这里 $l_u$ 是所有已经用过的左边点，$r_v$ 是所有已经用过的右边点。注意，对刚释出那条边，其 $l_u$ 被削减，但 $r_v$ 不受影响，因而得以释放。
每一轮尝试增广需要 $O(m)$ 找到最小的 $\Delta$，然后 $O(n)$ 调顶标，调完顶标后再以 $O(m)$ 尝试增广。
对于每个左侧点，每一轮尝试增广会多访问到一个点，因此最多尝试 $O(n)$ 轮。
一共有 $n$ 个左侧点，故总复杂度为 $O(n^2m)$，如果是稠密图，复杂度 $O(n^4)$。
当然，在做增广的同时，可以顺便找出下一轮增广所需的最小 $\Delta$，减小常数。

```cpp
bool dfs(int node) {
    vx[node] = true;
    for (int nxt = 1; nxt <= n; nxt++)
        if (!vy[nxt])
            if (lx[node] + ly[nxt] == g[node][nxt]) {
                vy[nxt] = true;
                if (!match[nxt] || dfs(match[nxt])) {
                    match[nxt] = node;
                    return true;
                }
            } else
                delta = min(delta, lx[node] + ly[nxt] - g[node][nxt]);
    return false;
}
DT KM() {
    for (int i = 1; i <= n; i++) lx[i] = *max_element(g[i] + 1, g[i] + n + 1);
    fill(ly + 1, ly + n + 1, 0), fill(match + 1, match + n + 1, 0);
    for (int i = 1; i <= n; i++) {
        while (true) {
            fill(vx, vx + n + 1, false), fill(vy, vy + n + 1, false);
            delta = LLONG_MAX;
            if (dfs(i)) break;
            for (int j = 1; j <= n; j++) {
                if (vx[j]) lx[j] -= delta;
                if (vy[j]) ly[j] += delta;
            }
        }
    }
    return accumulate(lx + 1, lx + n + 1, 0ll) + accumulate(ly + 1, ly + n + 1, 0ll);
}
```

上述做法的问题是，每次调了顶标，都重新增广，而忽略了调完顶标后，只有那个最极限的边被释放了。
为减少访问，可以开一个辅助数组 $upd$，记录每个右侧顶标各需要降低多少才有左侧边能过来，这样在找最小的更新 $\Delta$ 时，只需要遍历 $upd$ 数组，单次尝试复杂度达到 $O(n)$。
对于另一个单次尝试复杂度 $O(m)$ 的操作，可以在遍历 $upd$ 找最小的 $\Delta$ 时记住是哪个右侧点在本次被激活了，增广路直接从这个点继续。这样一个点的所有尝试就是遍历整个图一遍，总体复杂度为 $O(m)$。
这样的话，单个点增广的复杂度就降到了 $O(n^2+m)=O(n^2)$。其中 $O(n^2)$ 来源于至多 $n$ 次调整顶标，而每次调整顶标需要遍历 $upd$ 查找最小的差异、遍历两侧顶标和 $upd$ 进行数据更新，$O(m)$ 来自于跑完整张图，每条边只跑一次。
所有点合计的增广复杂度为 $O(n^3)$。

递归版
```cpp
bool dfs(int node, int pre) {
    vx[node] = true;
    for (int nxt = 1; nxt <= ny; nxt++)
        if (!vy[nxt])
            if (lx[node] + ly[nxt] == g[node][nxt]) {
                vy[nxt] = true, last[nxt] = pre;
                if (!match[nxt] || dfs(match[nxt], nxt)) {
                    match[nxt] = node;
                    return true;
                }
            } else if (upd[nxt] > lx[node] + ly[nxt] - g[node][nxt])
                upd[nxt] = lx[node] + ly[nxt] - g[node][nxt], last[nxt] = pre;
    return false;
}
DT KM() {
    for (int i = 1; i <= nx; i++) lx[i] = *max_element(g[i] + 1, g[i] + ny + 1);
    fill(ly + 1, ly + ny + 1, 0), fill(match + 1, match + ny + 1, 0);
    for (int i = 1; i <= nx; i++) {
        fill(vx, vx + nx + 1, false), fill(vy, vy + ny + 1, false), fill(upd, upd + ny + 1, LLONG_MAX);
        int now = 0;
        match[0] = i;
        while (match[now]) {
            DT delta = LLONG_MAX;
            if (dfs(match[now], now)) break;
            for (int j = 1; j <= ny; j++)
                if (!vy[j] && delta > upd[j]) {
                    delta = upd[j];
                    now = j;
                }
            for (int j = 1; j <= nx; j++)
                if (vx[j]) lx[j] -= delta;
            for (int j = 1; j <= ny; j++)
                if (vy[j])
                    ly[j] += delta;
                else
                    upd[j] -= delta;
            vy[now] = true;
        }
        while (now) {
            match[now] = match[last[now]];
            now = last[now];
        }
    }
    DT ret = 0;
    for (int i = 1; i <= ny; i++) ret += g[match[i]][i];
    return ret;
}
```

非递归版
```cpp
ll KM(int n, int m) {
    fill(lx, lx + n + 1, 0), fill(ly, ly + m + 1, 0), fill(match, match + m + 1, 0);
    for (int i = 1; i <= n; i++) {
        match[0] = i;
        int now = 0;
        fill(upd, upd + m + 1, 1ll << 60), fill(pre, pre + m + 1, -1), fill(vy, vy + m + 1, false);
        do {
            vy[now] = true;
            int x = match[now], nxt;
            ll delta = 1ll << 60;
            for (int j = 1; j <= m; j++)
                if (!vy[j]) {
                    auto cur = g[x][j] - lx[x] - ly[j];
                    if (cur < upd[j]) upd[j] = cur, pre[j] = now;
                    if (upd[j] < delta) delta = upd[j], nxt = j;
                }
            for (int j = 0; j <= m; j++) {
                if (vy[j])
                    lx[match[j]] += delta, ly[j] -= delta;
                else
                    upd[j] -= delta;
            }
            now = nxt;
        } while (match[now]);
        while (now) {
            int nxt = pre[now];
            match[now] = match[nxt], now = nxt;
        }
    }
    return accumulate(lx + 1, lx + n + 1, 0ll) + accumulate(ly + 1, ly + m + 1, 0ll);
}
```