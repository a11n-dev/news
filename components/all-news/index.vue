<script setup lang="ts">
const { data: articles } = useLazyFetch("/api/articles/all", { method: "GET" });
</script>

<template>
  <div>
    <div class="border-b-4 border-black inline-block mb-8">
      <h3 class="text-2xl font-semibold uppercase">All News</h3>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
      <div
        v-for="article in articles"
        :key="article.id"
      >
        <AllNewsItem :article="article" />
      </div>
    </div>
  </div>
</template>
