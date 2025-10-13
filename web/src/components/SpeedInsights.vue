<template>
  <!-- Speed Insights wird programmatisch geladen -->
</template>

<script>
import { track } from '@vercel/speed-insights'

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
        track()
        
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
          track('web-vital', { name: 'CLS', value: metric.value })
        })
        
        // FID (First Input Delay)
        window.webVitals.getFID((metric) => {
          track('web-vital', { name: 'FID', value: metric.value })
        })
        
        // FCP (First Contentful Paint)
        window.webVitals.getFCP((metric) => {
          track('web-vital', { name: 'FCP', value: metric.value })
        })
        
        // LCP (Largest Contentful Paint)
        window.webVitals.getLCP((metric) => {
          track('web-vital', { name: 'LCP', value: metric.value })
        })
        
        // TTFB (Time to First Byte)
        window.webVitals.getTTFB((metric) => {
          track('web-vital', { name: 'TTFB', value: metric.value })
        })
      }
    }
  }
}
</script>
