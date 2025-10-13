<template>
  <!-- Speed Insights wird programmatisch geladen -->
</template>

<script>
import { injectSpeedInsights } from '@vercel/speed-insights'

export default {
  name: 'SpeedInsights',
  mounted() {
    // Speed Insights automatisch initialisieren
    this.initSpeedInsights()
  },
  methods: {
    initSpeedInsights() {
      try {
        // Speed Insights für Vue.js SPA initialisieren
        injectSpeedInsights()
        
        // Zusätzliche Performance-Metriken sammeln
        this.collectWebVitals()
        
        console.log('✅ Vercel Speed Insights erfolgreich initialisiert')
      } catch (error) {
        console.warn('⚠️ Speed Insights konnte nicht initialisiert werden:', error)
      }
    },
    
    collectWebVitals() {
      // Integration mit bestehenden web-vitals
      if (typeof window !== 'undefined' && window.webVitals) {
        // CLS (Cumulative Layout Shift)
        window.webVitals.getCLS((metric) => {
          console.log('CLS:', metric.value)
        })
        
        // FID (First Input Delay)
        window.webVitals.getFID((metric) => {
          console.log('FID:', metric.value)
        })
        
        // FCP (First Contentful Paint)
        window.webVitals.getFCP((metric) => {
          console.log('FCP:', metric.value)
        })
        
        // LCP (Largest Contentful Paint)
        window.webVitals.getLCP((metric) => {
          console.log('LCP:', metric.value)
        })
        
        // TTFB (Time to First Byte)
        window.webVitals.getTTFB((metric) => {
          console.log('TTFB:', metric.value)
        })
      }
    }
  }
}
</script>
