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
import { mobileFallbackManager } from './utils/mobile-fallback'

// Lazy imports für bessere Kompatibilität
let affiliateLinkPredictor = null
let mobileTouchOptimizer = null
let mobileImageOptimizer = null
let backgroundPreloader = null
let connectionAwarePreloader = null
let predictivePreloader = null

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
    try {
      // Initialisiere Mobile Fallback Manager ZUERST
      console.log('Mobile Fallback Manager status:', mobileFallbackManager.getFallbackStatus())
      
      // Initialisiere Engagement Tracking
      initEngagementTracking()
      
      // Initialisiere globalen Affiliate-Manager
      globalAffiliateManager.initialize()
      
      // Lazy load und initialisiere alle Optimierungen
      const loadOptimizations = async () => {
        try {
          // Lade Affiliate-Link-Prediction
          const { affiliateLinkPredictor: predictor } = await import('./utils/affiliate-prediction')
          affiliateLinkPredictor = predictor
          console.log('Affiliate Link Predictor initialized:', affiliateLinkPredictor.getPredictionStats())
        } catch (error) {
          console.warn('Affiliate Link Predictor failed:', error)
        }
        
        try {
          // Lade Mobile-Optimierungen
          const { mobileTouchOptimizer: touchOpt } = await import('./utils/mobile-optimizations')
          mobileTouchOptimizer = touchOpt
          console.log('Mobile Touch Optimizer initialized:', mobileTouchOptimizer.getTouchStats())
        } catch (error) {
          console.warn('Mobile Touch Optimizer failed:', error)
        }
        
        try {
          const { mobileImageOptimizer: imageOpt } = await import('./utils/image-optimization')
          mobileImageOptimizer = imageOpt
          console.log('Mobile Image Optimizer initialized:', mobileImageOptimizer.getImageCacheStats())
        } catch (error) {
          console.warn('Mobile Image Optimizer failed:', error)
        }
        
        try {
          // Lade Background-Preloader
          const { backgroundPreloader: bgPreloader } = await import('./utils/background-preloader')
          backgroundPreloader = bgPreloader
          console.log('Background Preloader initialized:', backgroundPreloader.getStats())
        } catch (error) {
          console.warn('Background Preloader failed:', error)
        }
        
        try {
          // Lade Connection-Aware-Preloader
          const { connectionAwarePreloader: connPreloader } = await import('./utils/connection-aware-preloading')
          connectionAwarePreloader = connPreloader
          console.log('Connection-Aware Preloader initialized:', connectionAwarePreloader.getConnectionStatus())
        } catch (error) {
          console.warn('Connection-Aware Preloader failed:', error)
        }
        
        try {
          // Lade Predictive-Preloader
          const { predictivePreloader: predPreloader } = await import('./utils/predictive-preloading')
          predictivePreloader = predPreloader
          console.log('Predictive Preloader initialized:', predictivePreloader.getPredictionStats())
        } catch (error) {
          console.warn('Predictive Preloader failed:', error)
        }
      }
      
      // Lade Optimierungen asynchron
      loadOptimizations().catch(error => {
        console.warn('Failed to load some optimizations:', error)
      })
      
    } catch (error) {
      console.error('Error initializing optimizations:', error)
    }
  }, 2000)
}

// Performance optimizations (heavily deferred and non-blocking)
if (import.meta.env.PROD) {
  // Only load performance monitoring in production and after idle
  const loadPerformanceMonitoring = () => {
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
    }).catch((error) => {
      console.warn('Performance monitoring failed to load:', error)
    })
  }
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadPerformanceMonitoring, { timeout: 3000 })
  } else {
    // Fallback für ältere Browser
    setTimeout(loadPerformanceMonitoring, 3000)
  }
}
