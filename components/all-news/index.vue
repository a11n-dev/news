<script setup lang="ts">
const page = ref<number>(1);
const articles = ref<any[]>([]);
const observer = ref<any>(null);

const fetchedArticles = computed(() => {
  return articles.value;
});

const fetchArticles = async () => {
  const { data } = await useFetch("/api/articles", { method: "POST", body: { page: page.value } });

  articles.value.push(...data.value);
};

const loadMore = (entries: any) => {
  if (entries[0].isIntersecting) {
    page.value++;
    fetchArticles();
  }
};

onMounted(() => {
  observer.value = new IntersectionObserver(loadMore);
  const el = document.querySelector("#end-element");
  if (el) observer.value.observe(el);
});

onUnmounted(() => {
  if (observer) observer.value.disconnect();
});

fetchArticles();
</script>

<template>
  <div>
    <div class="border-b-4 border-black inline-block mb-8">
      <h3 class="text-2xl font-semibold uppercase">All News</h3>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
      <div
        v-for="article in fetchedArticles"
        :key="article.id"
      >
        <AllNewsItem :article="article" />
      </div>
    </div>

    <div id="end-element"></div>
  </div>
</template>
