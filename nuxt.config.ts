// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    MGDB_URI: process.env.MGDB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL_ID: process.env.OPENAI_MODEL_ID,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
  },

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
        },
      ],
    },
  },

  modules: ["@nuxt/ui", "@nuxtjs/seo", "nuxt-gtag", "@nuxt/image"],

  colorMode: {
    preference: "light",
  },

  image: {
    formats: ["webp"],
  },

  gtag: {
    id: "G-RJDGHZLG2W",
  },

  site: {
    url: "https://www.cryptomooninsider.com",
    name: "Crypto Moon Insider",
    description: "The latest news on cryptocurrency and blockchain technology.",
    defaultLocale: "en",
    indexable: true,
  },

  sitemap: {
    sources: ["/api/sitemap"],
  },
});
