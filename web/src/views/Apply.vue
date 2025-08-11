<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { offers } from '../data/offers'
import { getTrackingParams } from '../tracking'

const route = useRoute()
const router = useRouter()
const offer = offers.find(o => o.slug === route.params.slug)

const currentStep = ref(1)
const totalSteps = 3

const form = ref({
  // Schritt 1 – Persönliche Daten
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  // Schritt 2 – Adresse
  street: '',
  houseNumber: '',
  zip: '',
  city: '',
  country: '',
  // Schritt 3 – Einwilligungen
  privacy: false,
  forward: false,
  newsletter: false,
  // Tracking
  ...getTrackingParams()
})

// LocalStorage Persistenz
const storageKey = computed(() => `apply:${route.params.slug}`)
const allowedKeys = [
  'firstName','lastName','email','phone',
  'street','houseNumber','zip','city','country',
  'privacy','forward','newsletter',
  'utm_source','utm_medium','utm_campaign','ttclid','fbclid'
]

function restoreFromStorage() {
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (!raw) return
    const saved = JSON.parse(raw)
    if (saved && typeof saved === 'object') {
      for (const k of allowedKeys) {
        if (k in saved) form.value[k] = saved[k]
      }
    }
  } catch (_) { /* ignore parse errors */ }
}

restoreFromStorage()

let saveTimer
watch(form, () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(storageKey.value, JSON.stringify(form.value)) } catch (_) {}
  }, 200)
}, { deep: true })

const countries = ['Deutschland', 'Österreich', 'Schweiz', 'Luxemburg', 'Niederlande']
const errors = ref({})

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateStep(step) {
  const e = {}
  if (step === 1) {
    if (!form.value.firstName?.trim()) e.firstName = 'Vorname ist erforderlich'
    if (!form.value.lastName?.trim()) e.lastName = 'Nachname ist erforderlich'
    if (!form.value.email?.trim()) e.email = 'E-Mail ist erforderlich'
    else if (!emailRegex.test(form.value.email)) e.email = 'Bitte eine gültige E-Mail eingeben'
  } else if (step === 2) {
    if (!form.value.street?.trim()) e.street = 'Straße ist erforderlich'
    if (!form.value.houseNumber?.trim()) e.houseNumber = 'Hausnummer ist erforderlich'
    if (!form.value.zip?.trim()) e.zip = 'PLZ ist erforderlich'
    if (!form.value.city?.trim()) e.city = 'Stadt ist erforderlich'
    if (!form.value.country?.trim()) e.country = 'Land ist erforderlich'
  } else if (step === 3) {
    if (!form.value.privacy) e.privacy = 'Bitte Datenschutzerklärung bestätigen'
    if (!form.value.forward) e.forward = 'Bitte der Weiterleitung an die Partnerbank zustimmen'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function nextStep() {
  if (validateStep(currentStep.value) && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function onInput(field) {
  if (errors.value[field]) delete errors.value[field]
}

function submit() {
  if (!validateStep(3)) return
  try { localStorage.removeItem(storageKey.value) } catch (_) {}
  console.log('Lead (demo):', { offerId: offer?.id, ...form.value })
  router.push('/danke')
}
</script>

<template>
  <div class="p-3 md:p-6" v-if="offer">
    <h1 class="text-2xl md:text-3xl mb-3">Antrag starten – {{ offer.title }}</h1>

    <!-- versteckte Tracking-Felder (würden beim Backend-Submit mitgesendet) -->
    <input type="hidden" name="utm_source" :value="form.utm_source" />
    <input type="hidden" name="utm_medium" :value="form.utm_medium" />
    <input type="hidden" name="utm_campaign" :value="form.utm_campaign" />
    <input type="hidden" name="ttclid" :value="form.ttclid" />
    <input type="hidden" name="fbclid" :value="form.fbclid" />

    <!-- Fortschritt -->
    <div class="mb-3">
      <div class="flex align-items-center justify-content-between mb-2">
        <span class="text-700">Schritt {{ currentStep }}/{{ totalSteps }}</span>
        <span class="text-700">{{ progressPercent }}%</span>
      </div>
      <div class="w-full" style="height:8px;background:#e5e7eb;border-radius:9999px;overflow:hidden">
        <div :style="{ width: progressPercent + '%' }" style="height:100%;background:#111827"></div>
      </div>
    </div>

    <!-- Schritt 1: Persönliche Daten -->
    <section v-show="currentStep === 1" class="grid">
      <div class="col-12 md:col-6">
        <label class="mb-1">Vorname</label>
        <input v-model="form.firstName" @input="onInput('firstName')" class="p-inputtext p-component w-full" />
        <small v-if="errors.firstName" class="p-error">{{ errors.firstName }}</small>
      </div>
      <div class="col-12 md:col-6">
        <label class="mb-1">Nachname</label>
        <input v-model="form.lastName" @input="onInput('lastName')" class="p-inputtext p-component w-full" />
        <small v-if="errors.lastName" class="p-error">{{ errors.lastName }}</small>
      </div>
      <div class="col-12 md:col-6">
        <label class="mb-1">E-Mail</label>
        <input v-model="form.email" @input="onInput('email')" class="p-inputtext p-component w-full" type="email" />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>
      <div class="col-12 md:col-6">
        <label class="mb-1">Telefon (optional)</label>
        <input v-model="form.phone" class="p-inputtext p-component w-full" />
      </div>
    </section>

    <!-- Schritt 2: Adresse -->
    <section v-show="currentStep === 2" class="grid">
      <div class="col-12 md:col-8">
        <label class="mb-1">Straße</label>
        <input v-model="form.street" @input="onInput('street')" class="p-inputtext p-component w-full" />
        <small v-if="errors.street" class="p-error">{{ errors.street }}</small>
      </div>
      <div class="col-12 md:col-4">
        <label class="mb-1">Hausnummer</label>
        <input v-model="form.houseNumber" @input="onInput('houseNumber')" class="p-inputtext p-component w-full" />
        <small v-if="errors.houseNumber" class="p-error">{{ errors.houseNumber }}</small>
      </div>
      <div class="col-12 md:col-4">
        <label class="mb-1">PLZ</label>
        <input v-model="form.zip" @input="onInput('zip')" class="p-inputtext p-component w-full" />
        <small v-if="errors.zip" class="p-error">{{ errors.zip }}</small>
      </div>
      <div class="col-12 md:col-5">
        <label class="mb-1">Stadt</label>
        <input v-model="form.city" @input="onInput('city')" class="p-inputtext p-component w-full" />
        <small v-if="errors.city" class="p-error">{{ errors.city }}</small>
      </div>
      <div class="col-12 md:col-3">
        <label class="mb-1">Land</label>
        <select v-model="form.country" @change="onInput('country')" class="p-inputtext p-component w-full">
          <option value="" disabled>Bitte wählen</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
        <small v-if="errors.country" class="p-error">{{ errors.country }}</small>
      </div>
    </section>

    <!-- Schritt 3: Einwilligungen -->
    <section v-show="currentStep === 3">
      <div class="flex align-items-start gap-2 mb-3">
        <input id="consent-privacy" type="checkbox" v-model="form.privacy" @change="onInput('privacy')" />
        <label for="consent-privacy" class="text-700">Ich habe die Datenschutzerklärung gelesen.</label>
      </div>
      <small v-if="errors.privacy" class="p-error d-block mb-2">{{ errors.privacy }}</small>

      <div class="flex align-items-start gap-2 mb-3">
        <input id="consent-forward" type="checkbox" v-model="form.forward" @change="onInput('forward')" />
        <label for="consent-forward" class="text-700">Ich stimme der Weiterleitung an die Partnerbank zu.</label>
      </div>
      <small v-if="errors.forward" class="p-error d-block mb-2">{{ errors.forward }}</small>

      <div class="flex align-items-start gap-2 mb-3">
        <input id="consent-news" type="checkbox" v-model="form.newsletter" />
        <label for="consent-news" class="text-700">Ich möchte den Newsletter erhalten (optional).</label>
      </div>
    </section>

    <!-- Navigation zwischen den Schritten -->
    <div class="flex gap-2 mt-3">
      <button v-if="currentStep > 1" class="p-button p-component w-full md:w-auto" @click="prevStep">
        <span class="p-button-label">Zurück</span>
      </button>
      <div class="flex-1"></div>
      <button v-if="currentStep < totalSteps" class="p-button p-component w-full md:w-auto" @click="nextStep">
        <span class="p-button-label">Weiter</span>
      </button>
      <button v-else class="p-button p-component w-full md:w-auto" @click="submit">
        <span class="p-button-label">Absenden</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.p-error { color: #dc2626; }
.d-block { display: block; }
@media (max-width: 767px) {
  label { font-size: 0.95rem; }
}
</style>
