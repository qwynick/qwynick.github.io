
import { createContentLoader } from 'vitepress'

export default createContentLoader('problems/**/*.md', {
    transform(raw) {
        return raw
            .filter(({ url, frontmatter }) => {
                // 排除 ABC、ARC、AGC 的目录首页
                const normalizedUrl = url.replace(/\/+$/, '')

                if (
                    ['/problems/ABC', '/problems/ARC', '/problems/AGC']
                        .includes(normalizedUrl)
                ) {
                    return false
                }

                // 保留原有的草稿过滤
                return frontmatter.status !== 'draft'
            })
            .map(({ url, frontmatter }) => ({
                // 题解页面的站内地址
                url,

                title: String(frontmatter.title ?? ''),
                contest: String(frontmatter.contest ?? ''),
                problem: String(frontmatter.problem ?? ''),

                difficulty:
                    frontmatter.difficulty == null
                        ? null
                        : Number(frontmatter.difficulty),

                score:
                    frontmatter.score == null
                        ? null
                        : Number(frontmatter.score),

                tags: Array.isArray(frontmatter.tags)
                    ? frontmatter.tags.map(String)
                    : [],

                // 原始比赛题目链接
                externalUrl: String(frontmatter.url ?? ''),
            }))
    },
})
