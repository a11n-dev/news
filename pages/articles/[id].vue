<script setup lang="ts">
const route = useRoute();

const { data: article } = useLazyFetch(`/api/articles/${route.params.id}`, {
  method: "GET",
});

const modifiedContentHTML = computed(() => {
  if (!article.value?.contentHTML) return "";
  // Modify the contentHTML value here
  let modifiedHtml = article.value.contentHTML.trim().replace(/^["{]+|["}]+$/g, "");
  return modifiedHtml;
});
</script>

<template>
  <div
    v-if="article"
    class="max-w-[920px] mx-auto"
  >
    <Head>
      <Title>{{ article.title }}</Title>
    </Head>
    <div class="flex flex-col mb-6">
      <h1
        v-text="article.title"
        class="text-3xl mb-2"
      ></h1>
      <small class="text-gray-600">{{ new Date(article.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).toUpperCase() }}</small>
      <span>{{ article.author }}</span>
    </div>

    <div class="rounded-xl overflow-hidden mb-6">
      <img
        :src="article.thumbnail"
        class="w-full"
      />
    </div>

    <div
      v-html="modifiedContentHTML"
      class="article-content"
    ></div>

    <div>
      <NuxtLink :to="article.articleLink" external class="text-[#3b82f6]">Original Source</NuxtLink>
    </div>

    <button
      @click="$router.go(-1)"
      class="block w-full text-center bg-gray-100 p-2 rounded-xl mt-4 mb-12"
    >
      Go Back
    </button>

    <RelatedNews />
  </div>
</template>

<style lang="scss">
.article-content {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 0.75rem;
  }
  p {
    margin-bottom: 1rem;
  }
  ul,
  ol {
    margin-bottom: 1rem;
  }

  a {
    color: #3b82f6;
  }
}
</style>
