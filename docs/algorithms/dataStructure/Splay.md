---
title: "Splay"
catagory: dataStucture
---

Splay通过将最近查询点拉到特定位置实现均摊log。

核心是旋转操作和splay操作。难点是想清楚旋转方式。

代码以洛谷3391为例。splay加入了MIN和MAX两个哨兵，计数会有+1。

结构体设置：
```cpp
struct Node {
    int s[2], p, v, cnt, size;
    bool flag;
} seg[N];
```


判断是否右节点：
0是左节点，1是右节点。自己是否等于父节点的右孩子。
```cpp
int which(int node) { return node == seg[seg[node].p].s[1]; }
```

y是父节点，z是爷节点。
如果爷节点存在，把x挂到z上。
把x的子树挂到y上。
把y挂到x上。
```cpp
void rotate(int x) {
    int y = seg[x].p, z = seg[y].p, r = which(x);
    if (z) seg[z].s[which(y)] = x;
    seg[x].p = z;
    seg[y].s[r] = seg[x].s[r ^ 1];
    if (seg[y].s[r]) seg[seg[y].s[r]].p = y;
    seg[x].s[r ^ 1] = y, seg[y].p = x;
    pushup(y), pushup(x);
}
```

splay，把x转到des的下方：
只要x的父节点不是des，就需要向上。
如果x的父节点的父节点不是des，那么需要向上两次：如果xy是一个方向，转y，否则转x。
再转一次x。
```cpp
void splay(int x, int des) {
    while (seg[x].p != des) {
        int y = seg[x].p;
        if (seg[y].p != des) rotate(which(x) == which(y) ? y : x);
        rotate(x);
    }
    if (!des) root = x;
}
```

插入一个数key：
访问到x，起父节点为pa。
不断向下找x，直到找到或者空。
如果存在，计数+1；如果不存在，新建一个节点，左右根据大小关系定。
将x进行splay。
```cpp
void ins(int val) {
    int pa = 0, x = root;
    while (x && seg[x].v != val) {
        pa = x;
        x = seg[x].s[val > seg[x].v];
    }
    if (x)
        seg[x].cnt++;
    else {
        x = ++tot;
        seg[pa].s[val > seg[pa].v] = x;
        seg[x].p = pa;
        seg[x].cnt = 1;
        seg[x].v = val;
    }
    splay(x, 0);
}
```

各种操作前都需要pushdown一下，更新子树信息：
```cpp
void pushdown(int x) {
    if (seg[x].flag) {
        swap(seg[x].s[0], seg[x].s[1]);
        seg[seg[x].s[0]].flag ^= 1, seg[seg[x].s[1]].flag ^= 1;
        seg[x].flag = false;
    }
}
```

各种操作后都需要pushup一下，汇总子树信息：
```cpp
void pushup(int x) { seg[x].size = seg[x].cnt + seg[seg[x].s[0]].size + seg[seg[x].s[1]].size; }
```

后面部分，3391并不需要，但是3369需要。

删除一个数key：
找到key的前驱和后继，前驱转到根，后继转到前驱下方，此时后继的左子树就是key。
将key节点cnt-1，如果归零，就直接删掉。
```cpp
void del(int val) {
    int pre = get_pre(val), suf = get_suf(val);
    splay(pre, 0);
    splay(suf, pre);
    int x = seg[suf].s[0];
    if (seg[x].cnt > 1) {
        seg[x].cnt--;
        splay(x, 0);
    } else
        seg[suf].s[0] = 0, splay(suf, 0);
}
```

查找一个key的节点：
如果当前结点不等于key，需要继续找。
如果key>当前节点值，走向右侧，否则走向左侧。
如果没找到，x是最接近key的节点（可能大也可能小）。
定位到节点后，splay到根，保证均摊。
```cpp
void find(int key) {
    int x = root;
    while (seg[x].s[key > seg[x].v] && seg[x].v != key) x = seg[x].s[key > seg[x].v];
    splay(x, 0);
}
```

获取key的排名：
把key转到根，检查左侧的个数。
```cpp
int get_rk(int val) {
    find(val);
    return seg[seg[root].s[0]].cnts;
}
```

获取某个排名rank的节点：
检查左子树的size：
①如果size>=rank，检查左子树。
②如果size+cnt>=rank，那么根就是结果。
③如果size+cnt<rank，检查右子树，rank-=size+cnt。
```cpp
int get_node(int rk) {
    int x = root;
    while (1) {
        pushdown(x);
        int szl = seg[seg[x].s[0]].size;
        if (szl >= rk)
            x = seg[x].s[0];
        else if (szl + seg[x].cnt >= rk)
            break;
        else
            rk -= szl + seg[x].cnt, x = seg[x].s[1];
    }
    splay(x, 0);
    return x;
}
```

获取某个key的前驱：
把key转到根，如果根小于key，那么就是结果了（key不存在，这是最接近的了）。
否则先左一步，再一直向右。
```cpp
int get_pre(int key) {
    find(key);
    int x = root;
    if (seg[x].v < key) return x;
    x = seg[x].s[0];
    while (seg[x].s[1]) x = seg[x].s[1];
    return x;
}
```

获取某个key的后继：
把key转到根，如果根大于key，那么就是结果了（key不存在，这是最接近的了）。
否则先右一步，再一直向左。
```cpp
int get_suf(int key) {
    find(key);
    int x = root;
    if (seg[x].v > key) return x;
    x = seg[x].s[1];
    while (seg[x].s[0]) x = seg[x].s[0];
    return x;
}
```
