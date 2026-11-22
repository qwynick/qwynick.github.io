---
title: "LCT"
catagory: dataStucture
---

# LCT

动态树相对于树链剖分来说，可以多处理树的连接和断开。

总体思想，运用splay维护辅助树，间接维护原树的信息。
每个splay保存了一条从上到下的实链的节点，splay的中序遍历就是这条实链上的点浅到深的顺序。
splay之间通过虚边连接。

动态树的splay与普通的有些许差异。

**简单的部分：**
结构体设置：
s记录左右儿子的编号，p记录各顶点父节点（如果该点是某个splay的根，则记录的是该链条最浅的点的父节点），v记录当前节点值，sum记录子树值，flag懒标记。
```cpp
struct Node {
    int s[2], p, v, sum, flag;
} tr[N];
```

懒标记下传
```cpp
void pushdown(int x) {
    if (tr[x].flag) {
        swap(ls(x), rs(x));
        tr[ls(x)].flag ^= 1, tr[rs(x)].flag ^= 1;
        tr[x].flag = 0;
    }
}
```
子树信息更新到父节点
```cpp
void pushup(int x) { tr[x].sum = tr[x].v ^ tr[ls(x)].sum ^ tr[rs(x)].sum; }
```

判断自己是否为右儿子
```cpp
int which(int node) { return node == rs(tr[node].p); }
```

判断自己是否为某个实链的根。
```cpp
bool isroot(int x) {
    int y = tr[x].p;
    return ls(y) != x && rs(y) != x;
}
```

**splay中比较核心和难的部分：**
旋转：
x父节点为y，y父节点为z。
只旋转到x所在实链的顶部，而非整个树。
这里判定y非根而非z为空，虽然本质上z为空也可以写作y为根。
```cpp
void rotate(int x) {
    int y = tr[x].p, z = tr[y].p, r = which(x);
    if (!isroot(y)) tr[z].s[which(y)] = x;
    tr[x].p = z;
    tr[y].s[r] = tr[x].s[r ^ 1];
    if (tr[y].s[r]) tr[tr[y].s[r]].p = y;
    tr[x].s[r ^ 1] = y, tr[y].p = x;
    pushup(y), pushup(x);
}
```

处理x的信息之前，必须把他前面所有点的懒标记下传到x。这里可以递归处理。
此为一般splay中没有的部分。
```cpp
void pushall(int x) {
    if (!isroot(x)) pushall(tr[x].p);
    pushdown(x);
}
```

传统的splay直接从根开始向下处理，而这里的splay从起所在的实链开始向下传。
```cpp
void splay(int x) {
    pushall(x);
    while (!isroot(x)) {
        int y = tr[x].p;
        if (!isroot(y)) rotate(which(x) == which(y) ? y : x);
        rotate(x);
    }
}
```

**LCT的核心操作：**
核心操作access，将x连通到总根，并断开x-根路径上无关点的实链接。
y是下层实链的根，splay(x)后x是上层实链的根。
rs(x)=y之后，y所在实链和x就连通了。隐含x和原来的rs(x)变成了虚边连接。本质上就是改变了实链向下延伸的支路。
注意ls(y)并没有被切掉，其取值小于y，实际就是从y到x之间的节点。
逐步向上做，直到x跑出树外，此时，初始的x就连到了所在辅助树的总根，为后面x的转动做准备。
```cpp
void access(int x) {
    int y;
    for (y = 0; x; y = x, x = tr[x].p) {
        splay(x);
        rs(x) = y;
        pushup(x);
    }
}
```

将x指定为原树总根。
首先连通x到总根的实链路径，然后把x转到总根。
转完后，x由下面提到根节点，因此当前实链深度信息全部要反过来，就维护深度信息的splay来说，就是交换左右子树，通过懒标记打1实现。
```cpp
void makeroot(int x) {
    access(x);
    splay(x);
    tr[x].flag ^= 1;
}
```

找x所在原树的根。
原树的根一定在最上层的splay内（包含深度最浅的点）。
因为splay维护的深度信息，x转到根后，一直向左就是最浅的。
```cpp
int findroot(int x) {
    access(x);
    splay(x);
    while (ls(x)) pushdown(x), x = ls(x);
    splay(x);
    return x;
}
```

剖出一条x-y的路径作为实链。
把x作为原树的根，打通y到x的路径，把y转到顶点。此时y作为辅助树的根，保存有x-y路径上的权值。
此处必须对y进行旋转，因为x虽然makeroot之后是根（既是原树也是辅助树），但是在access(y)之后，可能已经不是辅助树的根了。
```cpp
void split(int x, int y) {
    makeroot(x);
    access(y);
    splay(y);
}
```

链接x和y。
首先把x做成总根。
将y连通总根，如果y节点所在树的总根不是x，那么说明x和y不在一棵树，可以连通。
因为x没有父节点，可以将x的父节点设置为y。
```cpp
void link(int x, int y) {
    makeroot(x);
    if (findroot(y) != x) tr[x].p = y;
}
```

断开。
首先将x设置为辅助树的总根。
如果y所在的树总根是x且y的父节点就是x
```cpp
void cut(int x, int y) {
    makeroot(x);
    if (findroot(y) == x && tr[y].p == x && !ls(y)) {
        rs(x) = tr[y].p = 0;
        pushup(x);
    }
}
```
