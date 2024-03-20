<template>
  <div class="p-10 border-b flex flex-col items-center">
    <span class="block mb-2">{{ new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) }}</span>

    <NuxtLink
      to="/"
      class="flex items-center justify-center"
    >
      <NuxtImg
        src="/img/logo.png"
        loading="lazy"
        class="mr-4 w-[56px] sm:w-[72px]"
      />

      <span class="text-4xl sm:text-5xl font-bold">Crypto Moon Insider</span>
    </NuxtLink>
  </div>
</template>
