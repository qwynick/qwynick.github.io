---
title: "Dinic与ISAP"
catagory: graphTheory
---

Ford-Fulkerson 给出了一个求最大流的方法，即通过不断找增广路，直到找不到为止。但是并没有给出具体找的方式，如果胡乱找的话，理论上每增加 $1$ 流量都需要把边跑完一遍，复杂度可能去到 $O(Ef)$，这里 $E$ 是边数，$f$ 是流量。

Edmonds-Karp 算法指出用 BFS 寻找增广路，复杂度为 $O(VE^2)$。
在 BFS 的过程中，每找到一条增广路都至少会使一条边耗尽。
考虑某一条边 $uv$ 被耗尽，则 $dis_u=dis_v+1$，如果后续再次被用到，必须要退流，使得 $dis_v'=dis_u+1$，联立得到 $dis_v'=dis_v+2$。每条边最多作为增广瓶颈 $\frac{V}{2}$ 次，而一共有 $E$ 条边，所以一共能增广 $VE$ 次，每次增广需要检查的边上限为 $E$，故总复杂度 $O(VE^2)$。

Dinic 在 EK 基础上，对 BFS 得到的距离进行标号，然后通过 DFS 一次性将连接距离差为 $1$ 的边增广完。
当一轮增广完成后，起点到终点的距离增加 $1$（如果不变，说明还有通路，会被继续增广，而非结束），因此最多增广 $V-1$ 轮。而每轮增广中，榨干一条边所需要的后续跳转次数不会超过 $V$，也就是说榨干 $E$ 条边的跳转次数不会超过 $VE$。榨干整个图的的复杂度为 $O(V^2E$)。为了提升访问边的效率，如果之前已经处理过的边（不符合距离要求，或者已经榨干），则不需要再次访问，所以可以开一个数组记录每个点的出边访问到哪里了，即当前弧优化。
```cpp
struct Dinic {
    int head[N], dis[N], cur[N], n, tot;
    int to[M], nxt[M], src, dst;
    ll cap[M];
    Dinic(int _n) : n(_n) { tot = 0, fill(head, head + n, -1); }
    void add(int u, int v, int f) {
        to[tot] = v, nxt[tot] = head[u], cap[tot] = f, head[u] = tot++;
        to[tot] = u, nxt[tot] = head[v], cap[tot] = 0, head[v] = tot++;
    }
    bool bfs() {
        queue<int> q;
        copy(head, head + n, cur), fill(dis, dis + n, 0);
        dis[src] = 1;
        q.push(src);
        while (!q.empty()) {
            int u = q.front(), v;
            q.pop();
            for (int i = head[u]; ~i; i = nxt[i])
                if (!dis[v = to[i]] && cap[i]) {
                    dis[v] = dis[u] + 1;
                    if (v == dst) return true;
                    q.push(v);
                }
        }
        return false;
    }
    ll dfs(int now, ll maxflow) {
        if (now == dst) return maxflow;
        int v;
        ll ret = 0;
        for (int& i = cur[now]; ~i; i = nxt[i])
            if (dis[v = to[i]] == dis[now] + 1 && cap[i]) {
                ll flow = dfs(v, min(maxflow, cap[i]));
                ret += flow;
                cap[i] -= flow;
                cap[i ^ 1] += flow;
                maxflow -= flow;
                if (!maxflow) break;
            }
        if (!ret) dis[now] = -1;
        return ret;
    }
    ll run(int _src, int _dst) {
        src = _src, dst = _dst;
        ll ret = 0;
        while (bfs()) ret += dfs(src, LLONG_MAX);
        return ret;
    }
    void clear() {
        fill(head, head + n, -1);
        tot = 0;
    }
};
```
可以看到，上述复杂度估计是非常松的，所以实际跑几百个点，几千条边都是可以的。
特别地，在单流量图上效率会更高。特别是用于求解二分匹配，复杂度是 $E\sqrt{V}$。
在一般图中做增广时，每条边容量不一样，每找到一条增广路可能只会耗尽一条边，其余边还可能再被访问。总复杂度 $O(VE)$。
在做二分图匹配时，所有边容量都是 $1$，同一条边在一轮增广中最多被访问两次：如果经过这条边没有增广路，回溯的时候自然就跳过了；如果经过这条边有增广路，则下一次容量就没了，所以最多只会访问两次。总复杂度 $O(V+E)=O(E)$。

在做 Dinic 的时候，每一轮会先做 BFS 以确定从源点到汇点的最短路。由于每一轮增广源点到汇点的距离都会增长，所以在做了 $\sqrt{V}$ 轮后，源点到汇点的距离至少是 $\sqrt{V}$。由于增广路的总长度最大为 $2V-1$，故此时图中最多剩余 $\frac{2V}{\sqrt{V}}=2\sqrt{V}$ 条增广路，即便每轮增广只能找到一条，也只需要做 $O(\sqrt{V})$ 轮增广，就会完成所有增广。
因此用 Dinic 的复杂度为 $O(\sqrt{V}E)$

ISAP 是对 Dinic 的一个优化。
在 Dinic 中，每轮增广完成后需要重新做 BFS 进行距离标号，在 ISAP 中，由终点向起点标号，这样在递归返回的时候，可以直接直接对距离进行修改。
假定当前是一个标好号的图，考虑当某个结点增广完成时，说明按照当前距离关系转移已经不可行，尝试将其距离增加 $1$，相当于在 DFS 的同时把 BFS 的事也做了。
易知，最长路径也不过 $n-1$，所以当我们发现起点到终点的距离被调整为 $n$ 时，就没有路了。
此外，一个事实是，如果在更新距离时，某个特定长度点个数为 $0$，即图出现了断层。由于去不到终点的点的距离只会越改越大，此后永远无法连通，可以退出了。
```cpp
struct ISAP {
    int head[N], dis[N], cur[N], gap[N], n, tot;
    int to[M], nxt[M], src, dst;
    ll cap[M];
    ISAP(int _n) : n(_n) { tot = 0, fill(head, head + n, -1); }
    void add(int u, int v, int f, int g = 0) {
        to[tot] = v, nxt[tot] = head[u], cap[tot] = f, head[u] = tot++;
        to[tot] = u, nxt[tot] = head[v], cap[tot] = g, head[v] = tot++;
    }
    void bfs() {
        queue<int> q;
        fill(dis, dis + n, n), dis[dst] = 0, q.push(dst);
        while (!q.empty()) {
            int u = q.front(), v;
            q.pop();
            for (int i = head[u]; ~i; i = nxt[i])
                if (dis[v = to[i]] == n && cap[i ^ 1]) {
                    dis[v] = dis[u] + 1;
                    gap[dis[v]]++;
                    q.push(v);
                }
        }
    }
    ll dfs(int now, ll maxflow) {
        if (now == dst) return maxflow;
        int v;
        ll ret = 0;
        for (int& i = cur[now]; ~i; i = nxt[i])
            if (dis[v = to[i]] + 1 == dis[now] && cap[i]) {
                ll flow = dfs(v, min(maxflow, cap[i]));
                ret += flow;
                cap[i] -= flow;
                cap[i ^ 1] += flow;
                maxflow -= flow;
                if (!maxflow) return ret;
            }
        if (--gap[dis[now]] == 0) dis[src] = n;
        ++gap[++dis[now]];
        cur[now] = head[now];
        return ret;
    }
    ll run(int _src, int _dst) {
        src = _src, dst = _dst;
        ll ret = 0;
        bfs(), copy(head, head + n, cur);
        while (dis[src] < n) ret += dfs(src, LLONG_MAX);
        return ret;
    }
    void clear() {
        fill(head, head + n, -1);
        tot = 0;
    }
};
```
实测区别不是很大，一般 Dinic 即可，逻辑最简单。