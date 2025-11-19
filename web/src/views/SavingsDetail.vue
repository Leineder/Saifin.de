<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { savingsOffers } from '../data/savings'
import { trackSavingsView, trackSavingsApply } from '../utils/analytics'
import { safeReplace, safeNavigate } from '../utils/navigation'
import { createAffiliateLinkHandler, preloadAffiliateLink, openAffiliateLink } from '../utils/affiliate-links'
import { useAffiliatePerformance } from '../utils/affiliate-performance-fallback'
import { safeFbq, safeTtq } from '../utils/cookie-consent'

const route = useRoute()
const router = useRouter()
const offer = computed(() => savingsOffers.find(o => o.slug === route.params.slug))

// Performance-Monitoring für Affiliate-Links
const { startMeasurement, endMeasurement, collectWebVitals } = useAffiliatePerformance(offer.value?.id || 'unknown')

// Redirect if offer not found and track analytics
onMounted(() => {
  if (!offer.value) {
    safeReplace(router, '/tagesgeld')
    return
  }
  
  // Analytics: Tagesgeld-Ansicht tracken
  trackSavingsView(offer.value.id, offer.value.title)
  
  // Preload Affiliate-Link wenn verfügbar
  if (offer.value?.applyUrl && /^https?:\/\//i.test(offer.value.applyUrl)) {
    preloadAffiliateLink(offer.value.applyUrl)
  }
})

const goBack = () => safeNavigate(router, '/tagesgeld')

// Erstelle optimierten Affiliate-Link-Handler
const affiliateLinkHandler = computed(() => {
  if (!offer.value?.applyUrl) return null
  
  const url = offer.value.applyUrl
  if (!/^https?:\/\//i.test(url)) return null
  
  return createAffiliateLinkHandler(url, {
    onClick: () => {
      // Starte Performance-Messung
      const measurementId = startMeasurement(url)
      if (measurementId) {
        collectWebVitals(measurementId)
      }
      
      // Vercel Analytics: Tagesgeld-Anfrage tracken
      trackSavingsApply(offer.value.id, offer.value.title, url)
      
      // Meta Pixel: CompleteRegistration bei externem Tagesgeld-Antrag
      safeFbq('track', 'CompleteRegistration', {
        content_name: offer.value.title,
        content_category: 'savings',
        content_id: offer.value.id || offer.value.slug,
        value: offer.value.rate || 0,
        status: 'external_redirect'
      })
      
      // TikTok Pixel: Custom Event "Antrag gestellt" bei externem Tagesgeld-Antrag
      safeTtq('track', 'Antrag gestellt', {
        content_type: 'savings',
        content_name: offer.value.title,
        content_id: offer.value.id || offer.value.slug,
        value: offer.value.rate || 0,
        status: 'external_redirect'
      })
      
      // Beende Performance-Messung nach kurzer Verzögerung
      setTimeout(() => {
        if (measurementId) {
          endMeasurement(measurementId, { success: true })
        }
      }, 1000)
    }
  })
})

const goApply = () => {
  if (!offer.value?.applyUrl) return
  
  // Verwende optimierten Affiliate-Link-Handler wenn verfügbar
  if (affiliateLinkHandler.value) {
    affiliateLinkHandler.value.onClick({ preventDefault: () => {} })
    return
  }
  
  // Fallback für interne Links
  const url = offer.value.applyUrl
  if (/^https?:\/\//i.test(url)) {
    // Sollte nicht hier ankommen, da affiliateLinkHandler das abfängt
    // Öffne den Affiliate-Link mit Click-IDs (ttclid, fbclid)
    openAffiliateLink(url, { preload: false })
  } else {
    safeNavigate(router, url)
  }
}
</script>

<template>
  <div v-if="offer" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div class="logo-frame">
          <img :src="offer.image || '/images/saifin_logo_vectorized_final.svg'" :alt="`${offer.title} – Bild`" class="detail-logo" loading="lazy" decoding="async" width="720" height="240" />
        </div>
      </div>
      <div class="content">
        <div class="section-eyebrow">Tagesgeld</div>
        <h1 class="section-title text-3xl mb-2">{{ offer.title }}</h1>

        <div class="surface-card border-round-lg p-3 card-accent mb-3">
          <ul class="pl-3 m-0">
            <li v-if="offer.interest" class="text-700">Zins: {{ offer.interest }}</li>
            <li v-if="offer.payout" class="text-700">Zinszahlung: {{ offer.payout }}</li>
            <li v-if="offer.depositMin" class="text-700">Mindestanlage: {{ offer.depositMin }}</li>
            <li v-if="offer.security" class="text-700">Einlagensicherung: {{ offer.security }}</li>
            <li v-for="(h, idx) in (offer.highlights || [])" :key="idx" class="text-700">{{ h }}</li>
          </ul>
        </div>

        <div class="facts-grid mb-3">
          <div v-if="offer.countryCode" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Land</div>
            <div class="fact-value">{{ offer.countryCode }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.euDgs === true">
            <div class="fact-label">EU-DGS</div>
            <div class="fact-value">ja</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.isNeukundenaktion">
            <div class="fact-label">Neukundenaktion</div>
            <div class="fact-value">aktiv</div>
          </div>
        </div>

        <div class="cta-col">
          <button class="p-button p-component p-button-outlined w-full" @click="goBack">
            <span class="p-button-label">Zur Übersicht</span>
          </button>
          <button 
            class="p-button p-component w-full apply-cta" 
            @click="goApply"
            @mouseenter="affiliateLinkHandler?.onMouseEnter"
          >
            <span class="p-button-label">Jetzt beantragen</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
.media { grid-column: 1 / 2; }
.content { grid-column: 2 / 3; }
.cta-col { display: grid; grid-template-columns: 1fr; gap: 10px; }
.facts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.fact-label { font-size: 0.75rem; color: var(--subtle-text); margin-bottom: 4px; }
.fact-value { font-weight: 600; color: var(--text); }

@media (max-width: 1100px) {
  .detail-grid { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
  .detail-grid {
    gap: 16px;
  }
  .media {
    order: 1;
  }
  .content {
    order: 2;
  }
  .facts-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .cta-col {
    gap: 12px;
  }
  .logo-frame {
    height: 180px;
  }
}

.logo-frame { width: 100%; height: 240px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
.logo-frame img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; background: #fff; }
</style>


