// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/a11y',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  // CSS
  css: ['~/assets/css/main.css'],

  // Auto-import stores
  imports: {
    dirs: ['stores'],
  },

  // Dark mode configuration
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  // App metadata (PT-BR)
  app: {
    head: {
      title: 'GabeBet - Plataforma de Apostas',
      meta: [
        { name: 'description', content: 'GabeBet - Plataforma de apostas moderna e segura' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      htmlAttrs: {
        lang: 'pt-BR',
      },
    },
  },
})