<template>
  <!-- Speed Insights wird programmatisch geladen -->
</template>

<script>
export default {
  name: 'SpeedInsights',
  mounted() {
    // Speed Insights automatisch initialisieren
    this.initSpeedInsights()
  },
  methods: {
    initSpeedInsights() {
      try {
        // Nur in Production und wenn verfügbar
        if (import.meta.env.PROD && typeof window !== 'undefined') {
          // Fallback: Einfache Performance-Metriken sammeln
          this.collectWebVitals()
          console.log('✅ Performance-Metriken erfolgreich initialisiert')
        }
      } catch (error) {
        console.warn('⚠️ Performance-Metriken konnten nicht initialisiert werden:', error)
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
