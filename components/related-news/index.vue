<script setup lang="ts">
const route = useRoute();

const { data: articles } = useLazyFetch("/api/articles/related", {
  method: "POST",
  body: {
    articleId: route.params.id,
  },
});
</script>

<template>
  <div>
    <div class="border-b-4 border-black inline-block mb-8">
      <h3 class="text-2xl font-semibold uppercase">Related News</h3>
    </div>

    <div class="grid grid-cols-1 gap-12">
      <div
        v-for="article in articles"
        :key="article.id"
      >
        <RelatedNewsItem :article="article" />
      </div>
    </div>
  </div>
</template>
