<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h2>Oops! Etwas ist schiefgelaufen</h2>
      <p>Es gab einen unerwarteten Fehler. Bitte versuchen Sie es erneut.</p>
      <button @click="retry" class="p-button p-component">Seite neu laden</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

onErrorCaptured((error, instance, info) => {
  console.error('Error caught by boundary:', error, info)
  hasError.value = true
  
  // Report error to analytics if available
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false
    })
  }
  
  return false // Prevent error from propagating
})

const retry = () => {
  hasError.value = false
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content h2 {
  color: var(--text);
  margin-bottom: 1rem;
}

.error-content p {
  color: var(--muted-text);
  margin-bottom: 2rem;
}
</style>
