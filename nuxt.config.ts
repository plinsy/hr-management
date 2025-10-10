// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  app: {
    head: {
      title: 'HRStream - Real-time HR Management Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'HRStream - A modern, real-time HR management platform for seamless employee absence tracking with intuitive workflows and high-performance virtual scrolling.' },
        { name: 'keywords', content: 'HR, employee management, absence tracking, calendar, real-time, Vue.js, Nuxt' }
      ]
    }
  },
  
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light'
      }
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
