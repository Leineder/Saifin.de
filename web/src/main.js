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
import { initEngagementTracking } from './tracking'
import { globalAffiliateManager } from './utils/global-affiliate-manager'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Lazy load SpeedInsights only if needed (production)
if (import.meta.env.PROD) {
  import('./components/SpeedInsights.vue').then(module => {
    app.component('SpeedInsights', module.default)
  }).catch(() => {})
}

// Meta Pixel & TikTok Pixel: SPA-Pageviews bei jedem Routenwechsel
router.afterEach(() => {
  // Defer tracking to avoid blocking navigation
  requestAnimationFrame(() => {
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
})

// Mount app immediately without waiting for anything
app.mount('#app')

// Engagement Tracking initialisieren (verzögert nach App-Mount)
if (typeof window !== 'undefined') {
  // Nach kurzer Verzögerung, damit die App zuerst lädt
  setTimeout(() => {
    initEngagementTracking()
    // Initialisiere globalen Affiliate-Manager
    globalAffiliateManager.initialize()
  }, 2000)
}

// Performance optimizations (heavily deferred and non-blocking)
if (import.meta.env.PROD) {
  // Only load performance monitoring in production and after idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      Promise.all([
        import('./vitals'),
        import('./utils/performance')
      ]).then(([vitals, perf]) => {
        vitals.initWebVitals()
        perf.initPerformanceMonitoring()
        
        // Further defer image optimization
        setTimeout(() => {
          perf.optimizeImageLoading()
          perf.preloadCriticalResources()
        }, 2000)
      }).catch(() => {})
    }, { timeout: 3000 })
  }
}
