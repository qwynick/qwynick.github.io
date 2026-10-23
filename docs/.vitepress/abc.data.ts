
import { createContentLoader } from 'vitepress'

export default createContentLoader('/problems/ABC/*.md', {
    transform(raw) {
        const groups = new Map<
            string,
            {
                url: string
                contest: string
                problem: string
                title: string
                difficulty: number | null
            }[]
        >()

        for (const { url, frontmatter } of raw) {
            const contest = String(frontmatter.contest ?? '')

            // 跳过没有比赛编号的 Markdown 文件
            if (!contest) continue

            const item = {
                url,
                contest,
                problem: String(frontmatter.problem ?? ''),
                title: String(frontmatter.title ?? ''),
                difficulty:
                    frontmatter.difficulty == null
                        ? null
                        : Number(frontmatter.difficulty),
            }

            if (!groups.has(contest)) {
                groups.set(contest, [])
            }

            groups.get(contest)!.push(item)
        }

        return [...groups.entries()]
            .sort(([a], [b]) =>
                b.localeCompare(a, undefined, { numeric: true }),
            )
            .map(([contest, items]) => ({
                contest,
                items: items.sort((a, b) =>
                    a.problem.localeCompare(b.problem, undefined, {
                        numeric: true,
                    }),
                ),
            }))
    },
})
