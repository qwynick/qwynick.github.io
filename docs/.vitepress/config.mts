import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: 'qwynick的算法小站 ',
    description: '算法竞赛的算法整理与题解思路记录',
    base: '/',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '题目检索', link: '/problem-index' },
            {
                text: 'AtCoder',
                items: [{ text: '总览', link: '/problems/' },
                { text: 'ABC', link: '/problems/ABC/' },
                { text: 'ARC', link: '/problems/ARC/' },
                { text: 'AGC', link: '/problems/AGC/' }],
            },
            {
                text: '算法',
                items: [{ text: '总览', link: '/algorithms/' },
                { text: '数据结构', link: '/algorithms/dataStructure/' },
                { text: '组合数学', link: '/algorithms/combinatorics/' },
                { text: '字符串', link: '/algorithms/string/' },
                { text: '图论', link: '/algorithms/graphTheory/' },
                { text: '数论', link: '/algorithms/numberTheory/' },
                { text: '其他数学', link: '/algorithms/otherMath/' },
                { text: '计算几何', link: '/algorithms/computationalGeometry/' },
                { text: '其他', link: '/algorithms/others/' }
                ]
            }
        ]
    },
    markdown: {
        math: true,
    },
})