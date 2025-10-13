import { createApp } from 'vue'
import { createPinia } from 'pinia'
// REMOVED: PrimeVue komplett entfernt - nur CSS-Klassen werden verwendet!
// OPTIMIZED: PrimeFlex durch eigenes minimales Grid-System ersetzt
// import 'primeflex/primeflex.css' - ENTFERNT für bessere Performance
// Minimale Icon-Font statt 342kB PrimeIcons
// import '/fonts/icons.css' - wird über HTML geladen

import App from './App.vue'
import router from './router'
import './style.css'
import { initWebVitals } from './vitals'
import { initPerformanceMonitoring, optimizeImageLoading, preloadCriticalResources } from './utils/performance'
import SpeedInsights from './components/SpeedInsights.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Speed Insights Komponente global registrieren
app.component('SpeedInsights', SpeedInsights)
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
