<script setup lang="ts">
import { data as problems } from '../../ABC.data'

</script>

<template>
  <div v-for="group in problems" :key="group.contest">
    <h2>{{ group.contest }}</h2>
    <ul>
      <li v-for="p in group.items" :key="p.url">
        <a :href="p.url">{{ p.problem }} - {{ p.title }}</a>
        <span v-if="p.difficulty != null">
          （Rating {{ p.difficulty }}）
        </span>
      </li>
    </ul>
  </div>
</template>