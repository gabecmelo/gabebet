/**
 * Pinia Plugin
 * 
 * Initializes Pinia for state management in Nuxt 4.
 * This plugin runs on both client and server.
 */

import { createPinia, setActivePinia } from 'pinia'

export default defineNuxtPlugin({
  name: 'pinia',
  enforce: 'pre', // Run before other plugins
  setup(nuxtApp) {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
    setActivePinia(pinia)
    
    // Make pinia available in the Nuxt context
    return {
      provide: {
        pinia,
      },
    }
  },
})
