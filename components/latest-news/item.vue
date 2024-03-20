<script setup lang="ts">
defineProps<{
  article: object;
}>();
</script>

<template>
  <NuxtLink
    :to="`/articles/${article._id}`"
    class="block relative rounded-xl overflow-hidden transform-gpu transition-transform duration-300 hover:scale-105"
  >
    <NuxtImg
      :src="article.thumbnail"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover"
    />

    <div class="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

    <div class="absolute bottom-0 p-6 z-20">
      <h5
        v-text="article.title"
        class="text-lg font-semibold line-clamp-2 text-white"
      ></h5>
      <small class="text-gray-300">{{ new Date(article.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).toUpperCase() }}</small>
    </div>
  </NuxtLink>
</template>
