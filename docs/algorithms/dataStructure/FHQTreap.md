---
title: "FHQTreap"
catagory: dataStucture
---

# FHQTreap

FHQTreap通过线段树合并分裂来实现各种查询。
随机权重在合并两棵子树时确定谁是父，谁是子。避免了旋转操作。
核心是分裂和合并操作。难点是想清楚分裂的时候两边虚位以待的父节点，及递归时的变化。

代码以洛谷3391为例。

结构体设置：
```cpp
struct Node {
    int l, r, key, wt, sz, rev;
} tr[N];
```


创建节点：
左右子节点=0，设置key和随机权重，sz记录大小，rev为反转标记。
```cpp
int creat(int key) {
    tr[++tot] = {0, 0, key, (int)rd(), 1, 0};
    return tot;
}
```

分裂node的子树，基准为key，左侧悬空父节点为x，右侧悬空父节点为y：
如果节点node为空，结束。
如果当前结点值<=key，该节点划到左侧，递归处理右子树（左子树<=key）。
如果当前结点值>key，该节点划到右侧，递归处理左子树（右子树>key）。
最终效果：左侧树全部<=key，右侧树全部>key。
```cpp
void split(int node, int sz, int& x, int& y) {
    if (!node)
        x = y = 0;
    else {
        pushdown(node);
        if (tr[tr[node].l].sz < sz) {
            x = node;
            split(tr[node].r, sz - tr[tr[node].l].sz - 1, tr[node].r, y);
        } else {
            y = node;
            split(tr[node].l, sz, x, tr[node].l);
        }
        pushup(node);
    }
}
```

合并两棵子树x,y：
如果有一边是空树，结束。
如果x权重较小，x作为父节点，将y挂在x的右子树位置。
如果y权重较小，y作为父节点，将x挂在y的左子树位置。
```cpp
int merge(int x, int y) {
    if (!x || !y) return x + y;
    if (tr[x].wt < tr[y].wt) {
        pushdown(x);
        tr[x].r = merge(tr[x].r, y);
        pushup(x);
        return x;
    } else {
        pushdown(y);
        tr[y].l = merge(x, tr[y].l);
        pushup(y);
        return y;
    }
}
```

插入一个数key：
以y为基准将树分为两部分，左侧树x<=key，右侧树z>key。
新建一个节点y。
将x,y,z合并得到新树。
```cpp
void ins(int key) {
    split(root, key, x, z);
    y = creat(key);
    root = merge(merge(x, y), z);
}
```

各种操作前都需要pushdown一下，更新子树信息：
```cpp
void pushdown(int node) {
    if (!tr[node].rev) return;
    swap(tr[node].l, tr[node].r);
    tr[tr[node].l].rev ^= 1, tr[tr[node].r].rev ^= 1;
    tr[node].rev = 0;
}
```

各种操作后都需要pushup一下，汇总子树信息：
```cpp
void pushup(int node) { tr[node].sz = tr[tr[node].l].sz + tr[tr[node].r].sz + 1; }
```

后面部分，3391并不需要，但是3369需要。

删除一个数key：
以y-1为基准将树分为两部分左侧树x<key，右侧树z>=key；再将右侧树分为两部分，左侧树y=key，右侧树z>key。
通过合并y的左右子树将y树根删掉。
之后合并x,y,z得到新树。
```cpp
void del(int key) {
    split(root, key - 1, x, y);
    split(y, key, y, z);
    y = merge(tr[y].l, tr[y].r);
    root = merge(merge(x, y), z);
}
```

获取key的排名：
以key-1为基准，将树分为两部分，左侧树<key，右侧树>=key。
结果就是左侧树的大小+1。
之后将树合并。
```cpp
int getrank(int key) {
    int x, y;
    split(root, key - 1, x, y);
    int ret = tr[x].sz + 1;
    root = merge(x, y);
    return ret;
}
```

获取某个排名rank的节点：
检查左子树的size：
①如果size+1=rank，那么根就是结果。
②如果size>=rank，检查左子树。
③如果size<rank，检查右子树，rank-=size+1。
```cpp
int getnode(int rk) {
    int node = root;
    while (node) {
        if (tr[tr[node].l].sz + 1 == rk)
            return node;
        else if (tr[tr[node].l].sz >= rk)
            node = tr[node].l;
        else {
            rk -= tr[tr[node].l].sz + 1;
            node = tr[node].r;
        }
    }
    return node;
}
```

获取某个key的前驱：
按key-1分裂两棵树，左侧树中最大的即为key的前驱。
```cpp
int pre(int key) {
    split(root, key - 1, x, y);
    int node = x;
    while (tr[node].r) node = tr[node].r;
    root = merge(x, y);
    return node;
}
```

获取某个key的后继：
按key分裂两棵树，右侧树中最小的即为key的后继。
```cpp
int suf(int key) {
    split(root, key, x, y);
    int node = y;
    while (tr[node].l) node = tr[node].l;
    root = merge(x, y);
    return node;
}
```
