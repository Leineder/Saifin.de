import { createApp } from 'vue'
import { createPinia } from 'pinia'
// REMOVED: PrimeVue komplett entfernt - nur CSS-Klassen werden verwendet!
// Nur PrimeFlex CSS behalten für Grid-System
import 'primeflex/primeflex.css'
// Minimale Icon-Font statt 342kB PrimeIcons
// import '/fonts/icons.css' - wird über HTML geladen

import App from './App.vue'
import router from './router'
import './style.css'
import { initWebVitals } from './vitals'
import { initPerformanceMonitoring, optimizeImageLoading, preloadCriticalResources } from './utils/performance'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// Meta Pixel & TikTok Pixel: SPA-Pageviews bei jedem Routenwechsel
router.afterEach(() => {
  try {
    // Meta Pixel PageView
    if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
    // TikTok Pixel PageView
    if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.page === 'function') {
      window.ttq.page()
    }
  } catch (_) {
    // best-effort, Fehler ignorieren
  }
})
// REMOVED: PrimeVue Plugin - nicht mehr benötigt!
app.mount('#app')

// Performance optimizations (non-blocking)
try { 
  initWebVitals() 
  initPerformanceMonitoring()
  
  // Optimize images after app is mounted
  setTimeout(() => {
    optimizeImageLoading()
    preloadCriticalResources()
  }, 1000)
} catch (_) {}
