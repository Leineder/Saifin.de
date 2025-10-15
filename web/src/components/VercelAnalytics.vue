<template>
  <!-- Vercel Analytics wird direkt im HTML geladen -->
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Vercel Analytics direkt einbinden
  if (typeof window !== 'undefined') {
    // Script-Tag direkt in den Head einfügen
    const script = document.createElement('script')
    script.src = 'https://va.vercel-scripts.com/v1/script.js'
    script.defer = true
    script.setAttribute('data-api', '/_vercel/insights/event')
    
    script.onload = () => {
      console.log('✅ Vercel Analytics Script geladen')
      
      // Test-Event senden
      if (window.va) {
        window.va('event', 'analytics_test', {
          test: true,
          timestamp: new Date().toISOString()
        })
        console.log('✅ Test-Event gesendet')
      }
    }
    
    script.onerror = (error) => {
      console.error('❌ Vercel Analytics Script konnte nicht geladen werden:', error)
    }
    
    document.head.appendChild(script)
  }
})
</script>
