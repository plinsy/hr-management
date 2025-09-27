// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],
  vuetify: {
    theme: {
      defaultTheme: 'light'
    }
  },
  css: [
    '@mdi/font/css/materialdesignicons.css'
  ],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
