import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// TikTok Pixel: SPA-Pageviews bei jedem Routenwechsel
router.afterEach(() => {
  try {
    if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.page === 'function') {
      window.ttq.page()
    }
  } catch (_) {
    // best-effort, Fehler ignorieren
  }
})
app.use(PrimeVue, { theme: { preset: Aura } })
app.mount('#app')
