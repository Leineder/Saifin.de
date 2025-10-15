<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { brokers } from '../data/brokers'
import { trackBrokerView, trackBrokerApply } from '../utils/analytics'

const route = useRoute()
const router = useRouter()
const broker = computed(() => brokers.find(b => b.slug === route.params.slug))

// Redirect if broker not found
onMounted(() => {
  if (!broker.value) {
    router.replace('/broker')
    return
  }
  
  // Analytics: Broker-Ansicht tracken
  trackBrokerView(broker.value.id, broker.value.name)
})

const goBack = () => router.push('/broker')
const goApply = () => {
  if (!broker.value) return
  
  // Vercel Analytics: Broker-Anfrage tracken
  trackBrokerApply(broker.value.id, broker.value.name, broker.value.applyUrl || `/antrag/${broker.value.slug}`)
  
  if (broker.value.applyUrl) {
    const url = broker.value.applyUrl
    if (/^https?:\/\//i.test(url)) {
      // Meta Pixel: CompleteRegistration bei externem Broker-Antrag
      try {
        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            content_name: broker.value.name,
            content_category: 'broker',
            content_id: broker.value.id || broker.value.slug,
            status: 'external_redirect'
          })
        }
      } catch (_) {}
      
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    return router.push(url)
  }
  router.push(`/antrag/${broker.value.slug}`)
}
</script>

<template>
  <div v-if="broker" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div class="logo-frame">
          <img :src="(broker.image || '/images/saifin_logo_vectorized_final.svg') + '?v=20241014'" :alt="`${broker.name} – Logo`" :class="'detail-logo ' + broker.slug" loading="lazy" decoding="async" width="720" height="240" />
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
          <button class="p-button p-component w-full apply-cta" @click="goApply">
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
.logo-frame img.detail-logo.brokerpoint,
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

.logo-frame img.detail-logo.finanzen-net-zero,
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

