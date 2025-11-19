<template>
  <Transition name="cookie-banner">
    <div v-if="showBanner" class="cookie-banner">
      <div class="cookie-banner-container">
        <div class="cookie-banner-content">
          <h3 class="cookie-banner-title">Anonym vergleichen. Besser entscheiden.</h3>
          <p class="cookie-banner-text">
            Saifin speichert keine persönlichen Daten. Mit Ihrer Einwilligung verbessern wir unsere Website und Werbeanzeigen.
          </p>
        </div>
        <div class="cookie-banner-actions">
          <button 
            class="cookie-banner-button cookie-banner-button-accept"
            @click="acceptAll"
          >
            Alles akzeptieren
          </button>
          <button 
            class="cookie-banner-button cookie-banner-button-settings"
            @click="showSettings = true"
          >
            Einstellungen
          </button>
        </div>
      </div>
      
      <!-- Einstellungen-Modal -->
      <Transition name="cookie-modal">
        <div v-if="showSettings" class="cookie-modal-overlay" @click.self="showSettings = false">
          <div class="cookie-modal">
            <div class="cookie-modal-header">
              <h3 class="cookie-modal-title">Cookie-Einstellungen</h3>
              <button 
                class="cookie-modal-close"
                @click="showSettings = false"
                aria-label="Schließen"
              >
                ×
              </button>
            </div>
            <div class="cookie-modal-content">
              <div class="cookie-category">
                <div class="cookie-category-header">
                  <h4 class="cookie-category-title">Analytics</h4>
                  <label class="cookie-toggle">
                    <input 
                      type="checkbox" 
                      v-model="preferences.analytics"
                      @change="updatePreferences"
                    />
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p class="cookie-category-description">
                  Helfen Sie uns, die Website zu verbessern, indem Sie anonyme Nutzungsstatistiken teilen.
                </p>
              </div>
              
              <div class="cookie-category">
                <div class="cookie-category-header">
                  <h4 class="cookie-category-title">Marketing</h4>
                  <label class="cookie-toggle">
                    <input 
                      type="checkbox" 
                      v-model="preferences.marketing"
                      @change="updatePreferences"
                    />
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
                <p class="cookie-category-description">
                  Ermöglichen Sie personalisierte Werbeanzeigen und Marketing-Tracking.
                </p>
              </div>
            </div>
            <div class="cookie-modal-actions">
              <button 
                class="cookie-banner-button cookie-banner-button-settings"
                @click="rejectAll"
              >
                Alle ablehnen
              </button>
              <button 
                class="cookie-banner-button cookie-banner-button-accept"
                @click="savePreferences"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  getConsentStatus, 
  setConsentStatus, 
  ConsentStatus,
  CookieCategories 
} from '../utils/cookie-consent'

const showBanner = ref(false)
const showSettings = ref(false)
const preferences = ref({
  analytics: false,
  marketing: false
})

onMounted(() => {
  // Banner nur anzeigen, wenn noch keine Entscheidung getroffen wurde
  const status = getConsentStatus()
  if (status === ConsentStatus.PENDING) {
    showBanner.value = true
  }
})

function acceptAll() {
  setConsentStatus(ConsentStatus.ACCEPTED)
  showBanner.value = false
  showSettings.value = false
  
  // Lade Tracking-Skripte nach Zustimmung
  loadTrackingScripts()
}

function rejectAll() {
  setConsentStatus(ConsentStatus.REJECTED)
  showBanner.value = false
  showSettings.value = false
}

function updatePreferences() {
  // Wird beim Toggle aufgerufen, aber noch nicht gespeichert
}

function savePreferences() {
  setConsentStatus(ConsentStatus.CUSTOM, preferences.value)
  showBanner.value = false
  showSettings.value = false
  
  // Lade Tracking-Skripte nur wenn Marketing erlaubt
  if (preferences.value.marketing) {
    loadTrackingScripts()
  }
  
  // Lade Analytics nur wenn Analytics erlaubt
  if (preferences.value.analytics) {
    loadAnalyticsScripts()
  }
}

function loadTrackingScripts() {
  // Trigger Event, damit index.html die Pixel lädt
  window.dispatchEvent(new CustomEvent('cookie-consent-accepted'))
}

function loadAnalyticsScripts() {
  // Analytics wird bereits in index.html geladen, aber nur wenn erlaubt
  window.dispatchEvent(new CustomEvent('cookie-consent-accepted'))
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: var(--surface);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  padding: 24px;
  animation: slideUp 0.3s ease-out;
}

.cookie-banner-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.cookie-banner-content {
  flex: 1;
  min-width: 280px;
}

.cookie-banner-title {
  font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif;
  font-weight: 800;
  font-size: 1.25rem;
  line-height: 1.3;
  margin: 0 0 8px;
  color: var(--text);
  letter-spacing: -0.01em;
}

.cookie-banner-text {
  margin: 0;
  color: var(--muted-text);
  font-size: 0.95rem;
  line-height: 1.5;
}

.cookie-banner-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.cookie-banner-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.cookie-banner-button-accept {
  background: var(--brand-primary);
  color: var(--brand-primary-contrast);
  box-shadow: 0 4px 12px rgba(20, 24, 51, 0.2);
}

.cookie-banner-button-accept:hover {
  background: var(--saifin-navy-700);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(20, 24, 51, 0.25);
}

.cookie-banner-button-accept:active {
  transform: translateY(0);
}

.cookie-banner-button-settings {
  background: transparent;
  color: var(--brand-primary);
  border: 1.5px solid var(--brand-primary);
}

.cookie-banner-button-settings:hover {
  background: var(--surface-muted);
  border-color: var(--saifin-navy-700);
}

/* Modal */
.cookie-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.cookie-modal {
  background: var(--surface);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

.cookie-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border);
}

.cookie-modal-title {
  font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif;
  font-weight: 800;
  font-size: 1.5rem;
  margin: 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.cookie-modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--muted-text);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cookie-modal-close:hover {
  background: var(--surface-muted);
  color: var(--text);
}

.cookie-modal-content {
  padding: 24px;
}

.cookie-category {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.cookie-category:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.cookie-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cookie-category-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0;
  color: var(--text);
}

.cookie-category-description {
  margin: 0;
  color: var(--muted-text);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Toggle Switch */
.cookie-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.cookie-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.cookie-toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cookie-toggle input:checked + .cookie-toggle-slider {
  background-color: var(--brand-primary);
}

.cookie-toggle input:checked + .cookie-toggle-slider:before {
  transform: translateX(22px);
}

.cookie-toggle input:focus + .cookie-toggle-slider {
  box-shadow: 0 0 0 3px var(--brand-ring);
}

.cookie-modal-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
}

/* Animations */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition: all 0.3s ease;
}

.cookie-banner-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-modal-enter-active,
.cookie-modal-leave-active {
  transition: all 0.3s ease;
}

.cookie-modal-enter-from,
.cookie-modal-leave-to {
  opacity: 0;
}

.cookie-modal-enter-from .cookie-modal,
.cookie-modal-leave-to .cookie-modal {
  transform: translateY(20px) scale(0.95);
}

/* Responsive */
@media (max-width: 767px) {
  .cookie-banner {
    padding: 20px 16px;
  }
  
  .cookie-banner-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .cookie-banner-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .cookie-banner-button {
    width: 100%;
  }
  
  .cookie-modal {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
  
  .cookie-modal-header,
  .cookie-modal-content,
  .cookie-modal-actions {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .cookie-modal-actions {
    flex-direction: column-reverse;
  }
  
  .cookie-modal-actions .cookie-banner-button {
    width: 100%;
  }
}
</style>

