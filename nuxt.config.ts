// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    MGDB_URI: process.env.MGDB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL_ID: process.env.OPENAI_MODEL_ID,
  },

  app: {
    head: {
      title: "Crypto Space News — The latest news in the crypto space",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
        },
      ],
    },
  },

  modules: ["@nuxt/ui"],

  colorMode: {
    preference: "light",
  },
});
