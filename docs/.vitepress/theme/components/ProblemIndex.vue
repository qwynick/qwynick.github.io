<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { data as allProblems } from '../../problem.data.js'

interface Problem {
  title: string
  url: string
  contest: string
  problem: string
  difficulty: number | null
  score: number | null
  tags: string[]
  externalUrl: string
}

const keyword = ref('')
const minRating = ref('')
const maxRating = ref('')
const contestType = ref('全部')
const selectedTags = ref<string[]>([])
const sortBy = ref('rating-asc')
const pageSize = ref(100)
const currentPage = ref(1)

// 从 Markdown 元数据中读取题目
const problems = computed<Problem[]>(() => allProblems as Problem[])

// 收集题库中实际存在的标签
const allTags = computed(() => {
  return [...new Set(problems.value.flatMap(p => p.tags))].sort()
})

// 根据条件筛选
const filteredProblems = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  const min = minRating.value === '' ? null : Number(minRating.value)
  const max = maxRating.value === '' ? null : Number(maxRating.value)

  const result = problems.value.filter(p => {
    const text = [
      p.title,
      p.contest,
      p.problem,
      ...p.tags,
    ].join(' ').toLowerCase()

    if (q && !text.includes(q)) return false

    if (min !== null &&
        (p.difficulty === null || p.difficulty < min)) return false

    if (max !== null &&
        (p.difficulty === null || p.difficulty > max)) return false

    if (contestType.value !== '全部') {
      const c = p.contest.toUpperCase()
      if (contestType.value === 'Codeforces') {
        if (!/^CF|^CODEFORCES/.test(c)) return false
      } else if (!c.startsWith(contestType.value)) {
        return false
      }
    }

    // 多标签采用 OR：命中任意一个所选标签即可
    if (
      selectedTags.value.length > 0 &&
      !selectedTags.value.some(tag => p.tags.includes(tag))
    ) return false

    return true
  })

  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'rating-asc') {
      return (a.difficulty ?? Infinity) - (b.difficulty ?? Infinity)
    }
    if (sortBy.value === 'rating-desc') {
      return (b.difficulty ?? -Infinity) - (a.difficulty ?? -Infinity)
    }
    if (sortBy.value === 'score-desc') {
      return (b.score ?? -Infinity) - (a.score ?? -Infinity)
    }
    return a.contest.localeCompare(b.contest, undefined, {
      numeric: true,
    }) || a.problem.localeCompare(b.problem, undefined, {
      numeric: true,
    })
  })

  return result
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProblems.value.length / pageSize.value))
)

const pageProblems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProblems.value.slice(start, start + pageSize.value)
})

// 筛选条件变化时回到第一页
watch(
  [keyword, minRating, maxRating, contestType, selectedTags, sortBy, pageSize],
  () => { currentPage.value = 1 },
)

function toggleTag(tag: string) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(t => t !== tag)
    : [...selectedTags.value, tag]
}

function resetFilters() {
  keyword.value = ''
  minRating.value = ''
  maxRating.value = ''
  contestType.value = '全部'
  selectedTags.value = []
  sortBy.value = 'rating-asc'
  pageSize.value = 100
  currentPage.value = 1
}

function pageLabel(p: Problem) {
  return p.contest && p.problem
    ? `${p.contest} ${p.problem}`
    : p.title
}
</script>

<template>
  <div class="problem-index">
    <div class="filters">
      <input
        v-model="keyword"
        class="search"
        type="search"
        placeholder="搜索题号、标题、算法标签……"
        aria-label="搜索题目"
      />

      <div class="filter-row">
        <label class="field">
          <span>Rating 最低</span>
          <input
            v-model="minRating"
            type="number"
            min="0"
            placeholder="不限"
          />
        </label>

        <label class="field">
          <span>Rating 最高</span>
          <input
            v-model="maxRating"
            type="number"
            min="0"
            placeholder="不限"
          />
        </label>

        <label class="field">
          <span>比赛类型</span>
          <select v-model="contestType">
            <option>全部</option>
            <option>ABC</option>
            <option>ARC</option>
            <option>AGC</option>
            <option>Codeforces</option>
          </select>
        </label>

        <label class="field">
          <span>排序方式</span>
          <select v-model="sortBy">
            <option value="rating-asc">Rating 从低到高</option>
            <option value="rating-desc">Rating 从高到低</option>
            <option value="score-desc">分值从高到低</option>
            <option value="contest">比赛编号</option>
          </select>
        </label>

        <label class="field">
          <span>每页题数</span>
          <select v-model.number="pageSize">
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
          </select>
        </label>

        <button class="reset" type="button" @click="resetFilters">
          重置
        </button>
      </div>

      <details class="tag-filter">
        <summary>
          算法标签
          <span v-if="selectedTags.length">
            （已选 {{ selectedTags.length }} 个）
          </span>
        </summary>
        <div class="tags">
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            class="tag"
            :class="{ active: selectedTags.includes(tag) }"
            :aria-pressed="selectedTags.includes(tag)"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
        <p class="tag-hint">多选时按 OR 匹配，即符合任意一个标签即可。</p>
      </details>
    </div>

    <div class="result-info">
      <span>共 {{ filteredProblems.length }} 道题</span>
      <span>
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
    </div>

    <div class="table-wrap">
      <table class="problem-table">
        <thead>
          <tr>
            <th>题目</th>
            <th class="number">Rating</th>
            <th class="number">分值</th>
            <th>算法标签</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pageProblems" :key="p.url">
            <td class="problem-title">
              <a :href="p.url">{{ pageLabel(p) }}</a>
              <a
                v-if="p.externalUrl"
                class="external-link"
                :href="p.externalUrl"
                target="_blank"
                rel="noreferrer"
                title="打开原题"
              >↗</a>
            </td>
            <td class="number">{{ p.difficulty ?? '—' }}</td>
            <td class="number">{{ p.score ?? '—' }}</td>
            <td>
              <button
                v-for="tag in p.tags"
                :key="tag"
                class="inline-tag"
                type="button"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </td>
          </tr>
          <tr v-if="pageProblems.length === 0">
            <td colspan="4" class="empty">
              没有符合条件的题目，请调整筛选条件。
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
        type="button"
        :disabled="currentPage <= 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.problem-index {
  font-size: 13px;
  line-height: 1.45;
}

.filters {
  margin-bottom: 12px;
}

.search {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 10px;
  margin-top: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 105px;
  flex: 1;
}

.field span {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.field input,
.field select {
  width: 100%;
  box-sizing: border-box;
  min-height: 32px;
  padding: 5px 7px;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}

.reset,
.pagination button {
  min-height: 32px;
  padding: 5px 11px;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.tag-filter {
  margin-top: 10px;
  color: var(--vp-c-text-2);
}

.tag-filter summary {
  cursor: pointer;
  user-select: none;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.tag,
.inline-tag {
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 2px 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
}

.tag.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.tag-hint {
  margin: 6px 0;
  font-size: 12px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.problem-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.problem-table th,
.problem-table td {
  padding: 7px 6px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: middle;
}

.problem-table th {
  color: var(--vp-c-text-2);
  font-weight: 600;
  white-space: nowrap;
}

.problem-table .number {
  width: 64px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.problem-title {
  min-width: 115px;
  white-space: nowrap;
}

.problem-title a {
  font-weight: 500;
}

.external-link {
  margin-left: 5px;
  color: var(--vp-c-text-3);
  text-decoration: none;
}

.inline-tag {
  margin: 1px 3px 1px 0;
  padding: 1px 5px;
  font-size: 11px;
  white-space: nowrap;
}

.empty {
  padding: 24px !important;
  color: var(--vp-c-text-2);
  text-align: center !important;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 14px 0;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 640px) {
  .field {
    min-width: 95px;
  }

  .problem-table th,
  .problem-table td {
    padding: 6px 4px;
  }
}
</style>