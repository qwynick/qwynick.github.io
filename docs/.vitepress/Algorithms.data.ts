import { createContentLoader } from 'vitepress'

export default createContentLoader('algorithms/**/*.md', {
    transform(raw) {
        const items: { url: string; category: string; title: string }[] = []
        for (const { url, frontmatter } of raw) {
            // url 形如 /algorithms/combinatorics/test(.html|.md)
            const parts = url.replace(/\.(md|html)$/i, '').split('/').filter(Boolean)
            // 只收录 /algorithms/<分类>/<文章> 三层的页面
            if (parts.length < 3) continue
            const category = parts[1]
            const slug = parts[parts.length - 1]
            if (slug === 'index') continue // 跳过分类首页
            items.push({
                url,
                category,
                title: String(frontmatter.title ?? slug),
            })
        }
        return items
    },
})