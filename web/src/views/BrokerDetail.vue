<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { brokers } from '../data/brokers'
import { trackBrokerView, trackBrokerApply } from '../utils/analytics'
import { safeReplace, safeNavigate } from '../utils/navigation'
import { createAffiliateLinkHandler, preloadAffiliateLink, openAffiliateLink } from '../utils/affiliate-links'
import { useAffiliatePerformance } from '../utils/affiliate-performance-fallback'
import { safeFbq, safeTtq } from '../utils/cookie-consent'

const route = useRoute()
const router = useRouter()
const broker = computed(() => brokers.find(b => b.slug === route.params.slug))

// Performance-Monitoring für Affiliate-Links
const { startMeasurement, endMeasurement, collectWebVitals } = useAffiliatePerformance(broker.value?.id || 'unknown')

// Redirect if broker not found and track analytics
onMounted(() => {
  if (!broker.value) {
    safeReplace(router, '/broker')
    return
  }
  
  // Analytics: Broker-Ansicht tracken
  trackBrokerView(broker.value.id, broker.value.name)
  
  // Preload Affiliate-Link wenn verfügbar
  if (broker.value?.applyUrl && /^https?:\/\//i.test(broker.value.applyUrl)) {
    preloadAffiliateLink(broker.value.applyUrl)
  }
})

const goBack = () => safeNavigate(router, '/broker')

// Erstelle optimierten Affiliate-Link-Handler
const affiliateLinkHandler = computed(() => {
  if (!broker.value?.applyUrl) return null
  
  const url = broker.value.applyUrl
  if (!/^https?:\/\//i.test(url)) return null
  
  return createAffiliateLinkHandler(url, {
    onClick: () => {
      // Starte Performance-Messung
      const measurementId = startMeasurement(url)
      if (measurementId) {
        collectWebVitals(measurementId)
      }
      
      // Vercel Analytics: Broker-Anfrage tracken
      trackBrokerApply(broker.value.id, broker.value.name, url)
      
      // Meta Pixel: CompleteRegistration bei externem Broker-Antrag
      safeFbq('track', 'CompleteRegistration', {
        content_name: broker.value.name,
        content_category: 'broker',
        content_id: broker.value.id || broker.value.slug,
        status: 'external_redirect'
      })
      
      // TikTok Pixel: Custom Event "Antrag gestellt" bei externem Broker-Antrag
      safeTtq('track', 'Antrag gestellt', {
        content_type: 'broker',
        content_name: broker.value.name,
        content_id: broker.value.id || broker.value.slug,
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
  if (!broker.value) return
  
  // Verwende optimierten Affiliate-Link-Handler wenn verfügbar
  if (affiliateLinkHandler.value) {
    affiliateLinkHandler.value.onClick({ preventDefault: () => {} })
    return
  }
  
  // Fallback für interne Links
  if (broker.value?.applyUrl) {
    const url = broker.value.applyUrl
    if (/^https?:\/\//i.test(url)) {
      // Sollte nicht hier ankommen, da affiliateLinkHandler das abfängt
      // Öffne den Affiliate-Link mit Click-IDs (ttclid, fbclid)
      openAffiliateLink(url, { preload: false })
      return
    }
    return safeNavigate(router, url)
  }
  safeNavigate(router, `/antrag/${broker.value.slug}`)
}
</script>

<template>
  <div v-if="broker" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div class="logo-frame">
          <img :src="(broker.image || '/images/saifin_logo_vectorized_final.svg') + '?v=20241016'" :alt="`${broker.name} – Logo`" :class="'detail-logo ' + broker.slug" loading="lazy" decoding="async" width="720" height="240" />
        </div>
      </div>
      <div class="content">
        <div class="section-eyebrow">Broker</div>
        <h1 class="section-title text-3xl mb-2">{{ broker.name }}</h1>

        <div class="surface-card border-round-lg p-3 card-accent mb-3">
          <ul class="pl-3 m-0">
            <li v-for="h in (broker.highlights || [])" :key="h" class="text-700">{{ h }}</li>
          </ul>
        </div>

        <div class="facts-grid mb-3">
          <div v-if="broker.pricing?.orderCostsDE" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Orderkosten (DE)</div>
            <div class="fact-value">{{ broker.pricing.orderCostsDE }}</div>
          </div>
          <div v-if="broker.features?.atm" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">ATM/Karte</div>
            <div class="fact-value">{{ broker.features.atm }}</div>
          </div>
          <div v-if="broker.features?.cashInterest" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Zinsen auf Cash</div>
            <div class="fact-value">{{ broker.features.cashInterest }}</div>
          </div>
          <div v-if="broker.features?.etfPlans" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">ETF-Sparpläne</div>
            <div class="fact-value">verfügbar</div>
          </div>
          <div v-if="broker.regulation" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Regulierung</div>
            <div class="fact-value">{{ broker.regulation }}</div>
          </div>
          <div v-if="broker.recommendation?.idealFor" class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Ideal für</div>
            <div class="fact-value">{{ broker.recommendation.idealFor }}</div>
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
</style>
<style scoped>
.logo-frame { width: 100%; height: 240px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 1rem; border: 1px solid var(--border); overflow: hidden; }
.logo-frame img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; border-radius: 1rem; background: #fff; padding: 12px; }
/* Spezifische Logo-Anpassungen für Detailseite */
.logo-frame img.detail-logo.brokerpoint { 
  transform: scale(0.85);
  padding: 16px;
  background: #fff !important;
  object-fit: contain;
  object-position: center center;
}

.logo-frame img.detail-logo.fidelity-ffb,
.logo-frame img.detail-logo.quirion { 
  transform: scale(1.1);
  padding: 8px;
  background: #fff !important;
}

.logo-frame img.detail-logo.captrader { 
  transform: scale(1.25);
  padding: 2px;
  background: #fff !important;
  object-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-frame img.detail-logo.finanzen-net-zero { 
  transform: scale(0.9);
  padding: 12px;
  background: #fff !important;
  object-fit: contain;
  object-position: center center;
}

.logo-frame img.detail-logo.fonds-super-markt,
.logo-frame img.detail-logo.etoro { 
  transform: scale(1.15);
  padding: 6px;
  background: #fff !important;
}
.logo-frame img.detail-logo.smartbroker-plus { 
  transform: scale(1.2);
  padding: 6px;
}
.logo-frame img.detail-logo.trade-republic,
.logo-frame img.detail-logo.ing { 
  transform: scale(1.15);
  padding: 10px;
}
</style>

