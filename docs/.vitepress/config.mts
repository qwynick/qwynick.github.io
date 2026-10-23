import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: '算法题解笔记',
    description: '算法竞赛题解与知识整理',
    base: '/',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '题目检索', link: '/problem-index' },
            { text: 'ABC', link: '/problems/ABC/' },
            { text: 'ARC', link: '/problems/ARC/' },
            { text: 'AGC', link: '/problems/AGC/' }
        ]
    }
})