<script setup lang="ts">
defineProps<{
  article: object;
}>();
</script>

<template>
  <NuxtLink
    :to="`/articles/${article._id}`"
    class="flex md:flex-row flex-col justify-between gap-6"
  >
    <div class="relative min-w-[300px] h-[200px] rounded-xl overflow-hidden">
      <NuxtImg
        :src="article.thumbnail"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div class="w-full">
      <h5
        v-text="article.title"
        class="text-lg font-semibold mb-2"
      ></h5>

      <small class="block text-gray-600 mb-3">{{ new Date(article.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).toUpperCase() }}</small>

      <span
        v-html="article.excerpt"
        class="line-clamp-4 mb-1"
      ></span>

      <span class="text-gray-400">{{ article.author }}</span>
    </div>
  </NuxtLink>
</template>
