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
      } catch (error) {
        console.warn('Speed Insights konnte nicht initialisiert werden:', error)
      }
    },
    
    collectWebVitals() {
      // Integration mit bestehenden web-vitals
      if (typeof window !== 'undefined' && window.webVitals) {
        // LCP (Largest Contentful Paint)
        window.webVitals.getCLS((metric) => {
          track('web-vital', { name: 'CLS', value: metric.value })
        })
        
        window.webVitals.getFID((metric) => {
          track('web-vital', { name: 'FID', value: metric.value })
        })
        
        window.webVitals.getFCP((metric) => {
          track('web-vital', { name: 'FCP', value: metric.value })
        })
        
        window.webVitals.getLCP((metric) => {
          track('web-vital', { name: 'LCP', value: metric.value })
        })
        
        window.webVitals.getTTFB((metric) => {
          track('web-vital', { name: 'TTFB', value: metric.value })
        })
      }
    }
  }
}
</script>
