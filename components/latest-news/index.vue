<script setup lang="ts">
const { data: articles } = useLazyFetch("/api/articles/latest", { method: "GET" });
</script>

<template>
  <div>
    <div class="border-b-4 border-black inline-block mb-8">
      <h3 class="text-2xl font-semibold uppercase">Latest News</h3>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        v-for="article in articles"
        :key="article.id"
      >
        <LatestNewsItem
          :article="article"
          class="h-[300px]"
        />
      </div>
    </div>
  </div>
</template>
