---
title: "CDQ分治"
catagory: others
---

# CDQ分治

一维偏序：直接排序看自己位置即可。
二维偏序：按第一维排序，之后归并排序或者树状数组求第二维偏序即可。

https://www.luogu.com.cn/problem/P3810
三维偏序：先按第一维排序，然后对数据进行分治处理。
由于第一维已经排好序，所以每次将区间分为两半的时候，左边的第一维一定小于等于右边的第一维。
此时对两边的数据进行归并排序处理，确保递归返回时，左侧第二维有序，右侧第二维也有序。
如果运用双指针将两侧按第二维进行合并，直接就能得到二维偏序，但未保证第三维满足偏序。
为了刻画第三维偏序，不能直接用第二维比较的结果进行计数。
在右侧第二维大于等于左侧第二维数据的时候，还要确保第三维也满足。暴力扫肯定不现实，但是可以借助树状数组实现。
即归并过程中，如果移除左侧数据，则用其第三维数值修改树状数组；如果移除右侧数据，则在树状数组中查询第三维数字的前缀和，看看到目前为止（第二维满足）已经加入了多少第三维比自己小的数据。
注意每轮合并时做完后，需要清空树状数组。

```cpp
void update(int p, int v) {
    while (p <= k) {
        sum[p] += v;
        p += p & -p;
    }
}
int query(int p) {
    int ret = 0;
    while (p) {
        ret += sum[p];
        p -= p & -p;
    }
    return ret;
}
void dc(int l, int r) {
    if (l == r) return;
    int mid = l + r >> 1;
    dc(l, mid), dc(mid + 1, r);
    int pl = l, pr = mid + 1, pp = l;
    while (pl <= mid || pr <= r) {
        if (pr > r || pl <= mid && d[pl][1] <= d[pr][1]) {
            update(d[pl][2], d[pl][3]);
            p[pp++] = d[pl++];
        } else {
            d[pr][4] += query(d[pr][2]);
            p[pp++] = d[pr++];
        }
    }
    for (int i = l; i <= mid; i++) update(d[i][2], -d[i][3]);
    copy(p + l, p + r + 1, d + l);
}
```