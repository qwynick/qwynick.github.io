---
title: "pbds"
catagory: others
---

# pbds

pbds主要有三个数据结构：堆、平衡树、哈希表。
三个数据结构相对于 STL 都有强化：
堆主要是引入了配对堆支持删除和修改堆中元素，并支持快速合并堆。
平衡树主要是引入了排名功能。
哈希表主要是 gp_hash_table 比 unordered_set/unordered_map 快。

堆：
```cpp
#include <ext/pb_ds/priority_queue.hpp>
```
主要是引入了配对堆，定义方式为：
```cpp
__gnu_pbds::priority_queue<pii, less<>, pairing_heap_tag> pq;
```
第二个参数跟普通优先队列一样，表示排序逻辑，此为大根堆。默认为大根堆。
第三个参数表示堆的类型，此为配对堆。默认为配对堆。

配对堆在 push 的时候会返回一个迭代器，可以通过此迭代器对堆中数据进行修改，修改完后会自动调整。
```cpp
    __gnu_pbds::priority_queue<int> pq;
    auto p = pq.push(1);
    pq.push(3), pq.push(5);
    pq.modify(p, 100);
    cout << *p << ' ' << pq.top() << '\n';
    pq.erase(p);
    cout << pq.size() << ' ' << pq.top() << '\n';
```
配对堆支持堆内元素修改和删除，关键是可以 $O(1)$ 合并堆。
如果把 tag 换成 binary_heap_tag 就是最普通也最快的堆。但是实测与 std 的堆没有明显差异。

平衡树：
```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
```
主要是加入了求key的排名和排名的key功能，定义方式为：
```cpp
__gnu_pbds::tree<int, int, less<>, rb_tree_tag, tree_order_statistics_node_update> mp;
```
第一个参数表示key的类型，实例中为int。
第二个参数表示value的类型，实例中为int。如果不需要value，则第二参数设置为null_type。
第三个参数表示平衡树的排序逻辑，此为升序。默认升序。
第四个参数表示平衡树的类型，此为红黑树。默认红黑树。
第五个参数表示额外的功能，此为开启排名功能。默认无此功能。

```cpp
    __gnu_pbds::tree<int, null_type, less<>, rb_tree_tag, tree_order_statistics_node_update> st;
    st.insert(1), st.insert(3), st.insert(5), st.insert(7);
    cout << *st.find_by_order(0) << ' ' << *st.find_by_order(3) << '\n';
    cout << st.order_of_key(1) << ' ' << st.order_of_key(6) << '\n';
```
这里 find_by_order 最小的编号是 $0$。这里 order_of_key 是查有几个数比 key 小，或者说 key 插入后排第几（从 $0$ 开始排）。

关于第四个参数，还可以选 splay 树 splay_tree_tag，数组排序+二分的 ov_tree_tag。
测试性能不如 map，因此如果不需要排名功能，没必要。
ov 最坏是平方的，直接放弃。实测直接用红黑树就行。

哈希表：
```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/hash_policy.hpp>
```

就正常使用即可
```cpp
    __gnu_pbds::cc_hash_table<int, null_type> cht;
    __gnu_pbds::gp_hash_table<int, null_type> ght;
    cht.insert(1), cht.insert(3), cht.insert(5), cht.insert(7);
    ght.insert(1), ght.insert(3), ght.insert(5), ght.insert(7);
    cout << (cht.find(1) != cht.end()) << ' ' << (cht.find(2) != cht.end()) << '\n';
    cout << (ght.find(1) != ght.end()) << ' ' << (ght.find(2) != ght.end()) << '\n';
```
gp_hash_table 是基于开放地址法，cc_hash_table 是基于拉链法。
在有限的测试中 gp_hash_table 表现较好，两者都好于 unorderedmap。