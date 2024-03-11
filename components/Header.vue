<template>
  <div class="p-10 text-center border-b">
    <span class="block mb-2">{{ new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) }}</span>
    <NuxtLink
      class="text-5xl font-bold"
      to="/"
      >Crypto Space News</NuxtLink
    >
  </div>
</template>
