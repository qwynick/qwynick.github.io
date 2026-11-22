---
title: "KMP"
catagory: string
---

先求 $border$，$fail_i$ 记录以 $i$ 为截止位置的最大 $border$，即前后缀匹配长度。
$j$ 记录处理完 $i$ 位置后，最长的前后缀匹配长度。
对于一个新的位置 $i$：
如果 $t_{j+1}=t_i$，前缀推进一个字符=后缀推进一个字符，前后缀匹配在之前基础上+1。
如果不等，那么只能尝试更短的前缀与到 $i$ 位置的后缀匹配。
由于 $fail_j$ 记录的就是以 $j$ 为截止位置的最大前后缀匹配，那么先退到 $j'=fail_j$。
由 $fail$ 数组的前后缀匹配性质，知道 $t_{1~j'}=t_{...j}$。又由 $st$ 匹配过程知 $t_{...j}=t_{...i-1}$，则 $t_{1~j'}=t_{...i-1}$，可直接尝试 $t_{j'+1}=t_{i}$。如此反复退 $j$ 直到成功或者退无可退。
```cpp
void makefail(char t[]) {
    int j = 0;
    for (int i = 2; t[i]; i++) {
        while (j && t[i] != t[j + 1]) j = fail[j];
        if (t[i] == t[j + 1]) j++;
        fail[i] = j;
    }
}
```

$st$ 匹配过程大致类似，对于一个新的位置 $i$：
如果 $t_{j+1}=s_i$，前缀推进一个字符=后缀推进一个字符，前后缀匹配在之前基础上+1。
如果不等，那么只能尝试更短的前缀与到 $i$ 位置的后缀匹配。
由于 $fail_j$ 记录的就是以j为截止位置的最大前后缀匹配，那么先退到 $j'=fail_j$。
由 $fail$ 数组的前后缀匹配性质，知道 $t_{1...j'}=t_{...j}$。又由 $st$ 匹配过程知 $t_{...j}=s_{...i-1}$，则 $t_{1~j'}=s_{...i-1}$，可直接尝试 $t_{j'+1}=s_i$。如此反复退j直到成功或者退无可退。
```cpp
int kmp(char s[], char t[]) {
    int j = 0, ret = 0, l = strlen(t + 1);
    for (int i = 1; s[i]; i++) {
        while (j && s[i] != t[j + 1]) j = fail[j];
        if (s[i] == t[j + 1]) j++;
        if (!t[j + 1]) {
            cout << i - l + 1 << '\n';
            j = fail[j];
        }
    }
    return ret;
}
```

也可以做成kmp自动机：
对于 $i-1$ 位置如果遇到 $c=t_i$，那么就续上了，转移到 $i$ 位置。
对于 $i-1$ 位置如果遇到其他 $c$，那么向前跳 $fail$ 直到能续上 $t_i$。这个可以不老实跳 $fail$ 而读取前一级 $border$ 遇到 $c$ 的结果，这个结果可能是真的在前一级遇到 $c$，也可能是继承的更小的 $border$ 的，但是不影响逻辑。

特别地，对于最后一个位置全部 $fail$ 一下。这样就可以在匹配到最后的时候，实现退一级border。
```cpp
void makego(char t[], int m) {
    for (int i = 1; i <= m; i++) {
        int c = t[i] - 'a';
        for (int j = 0; j < M; j++)
            if (c == j) {
                go[i - 1][j] = i;
                if (i != 1) fail[i] = go[fail[i - 1]][j];
            } else if (i != 1)
                go[i - 1][j] = go[fail[i - 1]][j];
    }
    for (int j = 0; j < M; j++) go[m][j] = go[fail[m]][j];
}
```

匹配的时候，直接按照字符走即可。
```cpp
int kmp(char s[], char t[], int n, int m) {
    int j = 0, ret = 0;
    for (int i = 1; i <= n; i++) {
        j = go[j][s[i] - 'a'];
        if (j == m) ret++;
    }
    return ret;
}
```