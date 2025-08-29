<template>
  <div v-if="!isAuthenticated" class="password-protection">
    <div class="password-overlay"></div>
    <div class="password-modal">
      <div class="password-content">
        <div class="password-header">
          <h2>Website-Zugriff</h2>
          <p>Diese Website ist derzeit passwortgeschützt. Bitte geben Sie das Passwort ein, um fortzufahren.</p>
        </div>
        
        <form @submit.prevent="checkPassword" class="password-form">
          <div class="input-group">
            <label for="password">Passwort</label>
            <input 
              id="password"
              v-model="password"
              type="password"
              placeholder="Passwort eingeben"
              :class="{ 'error': showError }"
              @input="clearError"
              autocomplete="current-password"
            />
            <div v-if="showError" class="error-message">
              Falsches Passwort. Bitte versuchen Sie es erneut.
            </div>
          </div>
          
          <button type="submit" class="submit-btn">
            <span v-if="isLoading">Überprüfe...</span>
            <span v-else>Zugriff gewähren</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const password = ref('')
const isAuthenticated = ref(false)
const showError = ref(false)
const isLoading = ref(false)

const checkPassword = async () => {
  if (!password.value.trim()) {
    showError.value = true
    return
  }
  
  isLoading.value = true
  
  // Simuliere eine kurze Verzögerung für bessere UX
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (password.value === 'Seder') {
    isAuthenticated.value = true
    // Speichere den Authentifizierungsstatus im localStorage
    localStorage.setItem('siteAuthenticated', 'true')
  } else {
    showError.value = true
    password.value = ''
  }
  
  isLoading.value = false
}

const clearError = () => {
  if (showError.value) {
    showError.value = false
  }
}

onMounted(() => {
  // Für Testzwecke: localStorage zurücksetzen (entfernen Sie diese Zeile später)
  localStorage.removeItem('siteAuthenticated')
  
  // Prüfe, ob der Benutzer bereits authentifiziert ist
  const authenticated = localStorage.getItem('siteAuthenticated')
  if (authenticated === 'true') {
    isAuthenticated.value = true
  }
})

// Expose isAuthenticated für die Parent-Komponente
defineExpose({ isAuthenticated })
</script>

<style scoped>
.password-protection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.password-modal {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  margin: 20px;
  overflow: hidden;
}

.password-content {
  padding: 32px 24px;
}

.password-header {
  text-align: center;
  margin-bottom: 24px;
}

.password-header h2 {
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.password-header p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
}

.input-group input {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
}

.submit-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 480px) {
  .password-content {
    padding: 24px 20px;
  }
  
  .password-header h2 {
    font-size: 1.25rem;
  }
}
</style>
