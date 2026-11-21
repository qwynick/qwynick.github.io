import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'

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
    },
    // head: [
    //     // 引入 KaTeX 的 CSS，这是公式正常显示的关键
    //     ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.css' }]
    // ],
    markdown: {
        config: (md) => {
            md.use(markdownItKatex)
        },
    },
})