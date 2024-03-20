<script setup lang="ts">
defineProps<{
  article: object;
}>();
</script>

<template>
  <NuxtLink
    :to="`/articles/${article._id}`"
    class="flex lg:flex-row flex-col justify-between gap-6"
  >
    <div class="lg:order-1 order-2">
      <h5
        v-text="article.title"
        class="text-lg font-semibold mb-3"
      ></h5>

      <span
        v-html="article.excerpt"
        class="line-clamp-4"
      ></span>
    </div>

    <div class="relative min-w-[300px] h-[200px] rounded-xl overflow-hidden lg:order-2 order-1">
      <NuxtImg
        :src="article.thumbnail"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </NuxtLink>
</template>
