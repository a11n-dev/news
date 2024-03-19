<template>
  <div class="p-10 border-b flex flex-col items-center">
    <span class="block mb-2">{{ new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) }}</span>

    <NuxtLink
      to="/"
      class="flex items-center mx-auto"
    >
      <img
        src="/img/moon-2.png"
        alt="logo"
        class="max-w-[72px] mr-6"
      />

      <span class="text-5xl font-bold">Crypto Moon Insider</span>
    </NuxtLink>
  </div>
</template>
