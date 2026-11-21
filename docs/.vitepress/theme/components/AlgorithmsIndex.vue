<script setup lang="ts">
import { computed } from 'vue'
import { data as articles } from '../../Algorithms.data'

const props = defineProps<{ category?: string }>()

const categoryNames: Record<string, string> = {
    dataStructure: '数据结构',
    combinatorics: '组合数学',
    string: '字符串',
    graphTheory: '图论',
    numberTheory: '数论',
    otherMath: '其他数学',
    computationalGeometry: '计算几何',
    other: '其他',
}

const groups = computed(() => {
    const source = props.category
        ? articles.filter((a) => a.category === props.category)
        : articles
    const map = new Map<string, typeof articles>()
    for (const item of source) {
        if (!map.has(item.category)) map.set(item.category, [])
        map.get(item.category)!.push(item)
    }
    return [...map.entries()].map(([category, items]) => ({
        category,
        label: categoryNames[category] ?? category,
        items,
    }))
})
</script>

<template>
  <div v-for="group in groups" :key="group.category">
    <h2 v-if="!category">{{ group.label }}</h2>
    <ul>
      <li v-for="item in group.items" :key="item.url">
        <a :href="item.url">{{ item.title }}</a>
      </li>
    </ul>
  </div>
  <p v-if="groups.length === 0">暂无文章。</p>
</template>
