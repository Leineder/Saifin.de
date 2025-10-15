<template>
  <!-- Vercel Analytics wird über das Script-Tag geladen -->
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Vercel Analytics Script manuell laden
  if (typeof window !== 'undefined' && !window.va) {
    const script = document.createElement('script')
    script.src = 'https://va.vercel-scripts.com/v1/script.debug.js'
    script.defer = true
    script.onload = () => {
      console.log('✅ Vercel Analytics geladen')
    }
    script.onerror = () => {
      console.error('❌ Vercel Analytics konnte nicht geladen werden')
    }
    document.head.appendChild(script)
  }
})
</script>
