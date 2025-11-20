<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { offers } from '../data/offers'
import { trackCreditCardView, trackCreditCardApply } from '../utils/analytics'
import { safeReplace, safeNavigate } from '../utils/navigation'
import { createAffiliateLinkHandler, preloadAffiliateLink, openAffiliateLink } from '../utils/affiliate-links'
import { useAffiliatePerformance } from '../utils/affiliate-performance-fallback'

const route = useRoute()
const router = useRouter()
const offer = computed(() => offers.find(o => o.slug === route.params.slug))

// Performance-Monitoring für Affiliate-Links
const { startMeasurement, endMeasurement, collectWebVitals } = useAffiliatePerformance(offer.value?.id || 'unknown')

// Redirect if offer not found and track analytics
onMounted(() => {
  if (!offer.value) {
    safeReplace(router, '/kreditkarten')
    return
  }
  
  // Analytics: Produktansicht tracken
  trackCreditCardView(offer.value.id, offer.value.title)
  
  // Preload Affiliate-Link wenn verfügbar
  if (offer.value?.applyUrl && /^https?:\/\//i.test(offer.value.applyUrl)) {
    preloadAffiliateLink(offer.value.applyUrl)
  }
})

const goBack = () => safeNavigate(router, '/kreditkarten')
// Erstelle optimierten Affiliate-Link-Handler mit Prediction
const affiliateLinkHandler = computed(() => {
  if (!offer.value?.applyUrl) return null
  
  const url = offer.value.applyUrl
  if (!/^https?:\/\//i.test(url)) return null
  
  return createAffiliateLinkHandler(url, {
    onMouseEnter: () => {
      // Aggressives Preloading beim Hover
      preloadAffiliateLink(url, { 
        aggressive: true, 
        preconnect: true, 
        prefetch: true,
        prerender: true // Prerender für kritische Links
      })
    },
    onClick: () => {
      const measurementId = startMeasurement(url)
      if (measurementId) {
        collectWebVitals(measurementId)
      }
      
      // Vercel Analytics: Produktanfrage tracken
      trackCreditCardApply(offer.value.id, offer.value.title, url)
      
      // TikTok Event: Kreditkartenantrag initiiert (Detailseite)
      if (window.ttq) {
        window.ttq.track('InitiateCheckout', {
          content_type: 'product',
          content_name: offer.value.title,
          content_id: offer.value.id || offer.value.slug,
          value: offer.value.annualFee || 0,
          currency: 'EUR'
        })
      }
      
      // Meta Pixel: CompleteRegistration bei externem Antrag
      try {
        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            content_name: offer.value.title,
            content_category: 'card',
            content_id: offer.value.id || offer.value.slug,
            value: offer.value.annualFee || 0,
            currency: 'EUR',
            status: 'external_redirect'
          })
        }
      } catch (_) {}
      
      // TikTok Pixel: Custom Event "Antrag gestellt" bei externem Kreditkarten-Antrag
      try {
        if (window.ttq && typeof window.ttq.track === 'function') {
          window.ttq.track('Antrag gestellt', {
            content_type: 'card',
            content_name: offer.value.title,
            content_id: offer.value.id || offer.value.slug,
            value: offer.value.annualFee || 0,
            currency: 'EUR',
            status: 'external_redirect'
          })
        }
      } catch (_) {}
      
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
  if (!offer.value) return
  
  // Direkte Behandlung für externe Affiliate-Links
  if (offer.value?.applyUrl && /^https?:\/\//i.test(offer.value.applyUrl)) {
    const url = offer.value.applyUrl
    
    // Starte Performance-Messung
    const measurementId = startMeasurement(url)
    if (measurementId) {
      collectWebVitals(measurementId)
    }
    
    // Vercel Analytics: Produktanfrage tracken
    trackCreditCardApply(offer.value.id, offer.value.title, url)
    
    // TikTok Event: Kreditkartenantrag initiiert (Detailseite)
    if (window.ttq) {
      window.ttq.track('InitiateCheckout', {
        content_type: 'product',
        content_name: offer.value.title,
        content_id: offer.value.id || offer.value.slug,
        value: offer.value.annualFee || 0,
        currency: 'EUR'
      })
    }
    
    // Meta Pixel: CompleteRegistration bei externem Antrag
    try {
      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: offer.value.title,
          content_category: 'card',
          content_id: offer.value.id || offer.value.slug,
          value: offer.value.annualFee || 0,
          currency: 'EUR',
          status: 'external_redirect'
        })
      }
    } catch (_) {}
    
    // TikTok Pixel: Custom Event "Antrag gestellt" bei externem Kreditkarten-Antrag
    try {
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('Antrag gestellt', {
          content_type: 'card',
          content_name: offer.value.title,
          content_id: offer.value.id || offer.value.slug,
          value: offer.value.annualFee || 0,
          currency: 'EUR',
          status: 'external_redirect'
        })
      }
    } catch (_) {}
    
    // Beende Performance-Messung nach kurzer Verzögerung
    setTimeout(() => {
      if (measurementId) {
        endMeasurement(measurementId, { success: true })
      }
    }, 1000)
    
    // Öffne den Affiliate-Link mit Click-IDs (ttclid, fbclid)
    openAffiliateLink(url, { preload: false })
    return
  }
  
  // Fallback für interne Links
  if (offer.value?.applyUrl) {
    return safeNavigate(router, offer.value.applyUrl)
  }
  
  // Letzter Fallback: Antrag-Seite
  safeNavigate(router, `/antrag/${offer.value.slug}`)
}
const formatEuro = (n) => {
  if (n === 0) return '0,00 €'
  if (typeof n === 'number') return `${n.toFixed(2).replace('.', ',')} €`
  return n
}

// Mobile Touch-Handler
const handleTouchStart = (event) => {
  // Preload beim Touch-Start
  if (offer.value?.applyUrl && /^https?:\/\//i.test(offer.value.applyUrl)) {
    preloadAffiliateLink(offer.value.applyUrl, { 
      aggressive: true, 
      preconnect: true, 
      prefetch: true 
    })
  }
}

const handleTouchEnd = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  // Kleine Verzögerung für bessere UX
  setTimeout(() => {
    goApply()
  }, 50)
}
</script>

<template>
  <div v-if="offer" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div :class="['card-image-container surface-card border-round-xl card-accent', offer.id]">
          <img :src="offer.image" :alt="`${offer.title} – Kartenmotiv`" :class="['card-image', offer.id]" loading="lazy" decoding="async" width="600" height="378" fetchpriority="high">
        </div>
      </div>
      <div class="content">
        <div class="section-eyebrow">Kreditkarte</div>
        <h1 class="section-title text-3xl mb-2">{{ offer.title }}</h1>
        <div class="bullets surface-card border-round-lg p-3 card-accent mb-3">
          <ul class="pl-3 m-0">
            <li v-for="b in offer.bullets" :key="b" :class="[b.includes('Bei Schufa Einträgen Ablehnung') || b.includes('Ablehnung bei SCHUFA') ? 'text-red-600' : 'text-700']" :style="[b.includes('Bei Schufa Einträgen Ablehnung') || b.includes('Ablehnung bei SCHUFA') ? { listStyleType: 'none', position: 'relative', paddingLeft: '1.5rem' } : {}]">
              <span v-if="b.includes('Bei Schufa Einträgen Ablehnung') || b.includes('Ablehnung bei SCHUFA')" :style="{ position: 'absolute', left: '0', color: '#ef4444' }">✗</span>
              <span v-else :style="{ position: 'absolute', left: '0', color: '#34d399' }">✓</span>
              {{ b }}
            </li>
          </ul>
        </div>
        <div class="facts-grid mb-3">
          <div class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Jahresgebühr</div>
            <div class="fact-value">{{ offer.details?.annualFeeText || formatEuro(offer.annualFee) }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.graceWeeks != null">
            <div class="fact-label">Zinsfreie Phase</div>
            <div class="fact-value">bis {{ offer.graceWeeks }} Wochen</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Kartentyp</div>
            <div class="fact-value">{{ offer.details?.cardType || offer.cardType }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent">
            <div class="fact-label">Fremdwährung</div>
            <div class="fact-value">{{ offer.details?.foreignCurrency || offer.foreignFee }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.cashWithdrawal">
            <div class="fact-label">Bargeld</div>
            <div class="fact-value">{{ offer.details.cashWithdrawal }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.limits || offer.details?.atmLimits">
            <div class="fact-label">Limits</div>
            <div class="fact-value">{{ offer.details.limits || offer.details.atmLimits }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.creditLimit">
            <div class="fact-label">Kreditrahmen</div>
            <div class="fact-value">{{ offer.details.creditLimit }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.interest">
            <div class="fact-label">Zinsen/Rückzahlung</div>
            <div class="fact-value">{{ offer.details.interest }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.benefits || offer.features?.insurance">
            <div class="fact-label">Benefits/Versicherung</div>
            <div class="fact-value">{{ offer.details?.benefits || offer.features?.insurance }}</div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent" v-if="offer.details?.notes || offer.details?.promo">
            <div class="fact-label">Hinweis</div>
            <div class="fact-value">{{ offer.details.notes || offer.details.promo }}</div>
          </div>
        </div>
        <p class="text-600 text-sm mb-4">{{ offer.disclaimer }}</p>

        <div class="cta-col">
          <button class="p-button p-component p-button-outlined w-full" @click="goBack">
            <span class="p-button-label">Zur Übersicht</span>
          </button>
          <button 
            class="p-button p-component w-full apply-cta" 
            @click="goApply"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @mouseenter="affiliateLinkHandler?.onMouseEnter"
          >
            <span class="p-button-label">Jetzt beantragen</span>
          </button>
        </div>
      </div>
      <aside class="sticky-cta">
        <div class="surface-card border-round-lg p-3 card-accent">
          <h3 class="m-0 mb-2 section-title text-lg">Direkt beantragen</h3>
          <p class="m-0 text-700 mb-2">Schnell und sicher zum Antrag.</p>
          <button 
            class="p-button w-full apply-cta" 
            @click="goApply"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @mouseenter="affiliateLinkHandler?.onMouseEnter"
          >
            <span class="p-button-label">Jetzt beantragen</span>
          </button>
        </div>
      </aside>
    </div>
  </div>
  
</template>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1.5fr 1fr 320px; gap: 24px; }
.media { grid-column: 1 / 2; }
.card-image-container { 
  width: 100%; 
  aspect-ratio: 1.586 / 1; /* Exaktes Kreditkarten-Seitenverhältnis */
  max-width: 600px;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 30px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border); /* Ursprünglicher Rahmen */
  background: #fff !important; /* Komplett weißer Hintergrund für den Container */
  /* Stelle sicher, dass der Container die richtige Höhe hat */
  min-height: 200px;
}
.card-image-container.gebuehrenfrei-mastercard-gold {
  border-radius: 16px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}
.card-image { 
  width: 100%; 
  height: 100%; 
  object-fit: contain; /* Ändere zu contain um Abschneiden zu vermeiden */
  object-position: center center;
  display: block;
  border-radius: 0; /* Entferne border-radius vom Bild - Container hat bereits abgerundete Ecken */
  background: transparent;
  /* Entferne doppelte aspect-ratio Definition */
  /* Präzises Seitenverhältnis für Kreditkarten (85.6mm x 53.98mm ≈ 1.586:1) */
  /* aspect-ratio: 1.586 / 1; - wird vom Container gehandhabt */
  /* Entferne weiße Ecken durch contain statt cover */
  background-color: transparent;
  /* Stelle sicher, dass das Bild vollständig sichtbar ist */
  max-width: 100%;
  max-height: 100%;
}
.content { grid-column: 2 / 3; }
.sticky-cta { grid-column: 3 / 4; position: sticky; top: 86px; align-self: start; }
.cta-col { display: grid; grid-template-columns: 1fr; gap: 10px; }
.facts-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 12px; 
}
.fact-label { font-size: 0.75rem; color: var(--subtle-text); margin-bottom: 4px; }
.fact-value { font-weight: 600; color: var(--text); }

@media (max-width: 1100px) {
  .detail-grid { grid-template-columns: 1fr 1fr; }
  .sticky-cta { grid-column: 1 / -1; position: static; }
  .card-image-container { 
    min-height: 300px; 
    max-height: 500px; 
    padding: 20px; 
    aspect-ratio: 1.586 / 1; /* Konsistentes Seitenverhältnis */
    max-width: 100%;
  }
}
@media (max-width: 767px) {
  .detail-grid { 
    grid-template-columns: 1fr; 
    gap: 16px;
  }
  .media { 
    grid-column: 1; 
    order: 1; /* Foto ganz oben */
  }
  .content { 
    grid-column: 1; 
    order: 2; /* Inhalt in der Mitte */
  }
  .sticky-cta { 
    grid-column: 1; 
    order: 3; /* CTA ganz unten */
    position: static;
  }
  .card-image-container { 
    aspect-ratio: 1.586 / 1; /* Konsistentes Seitenverhältnis */
    max-width: 100%;
    padding: 12px;
    margin: 0 auto;
    min-height: 200px; /* Stelle sicher, dass genug Platz vorhanden ist */
  }
  .card-image {
    border-radius: 0; /* Entferne border-radius vom Bild - Container hat bereits abgerundete Ecken */
  }
  .facts-grid {
    grid-template-columns: 1fr; /* Einspaltig auf mobil */
    gap: 8px;
  }
  .fact-label {
    font-size: 0.7rem;
  }
  .fact-value {
    font-size: 0.9rem;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .cta-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .section-title {
    font-size: 1.5rem !important;
    line-height: 1.3;
  }
  .bullets {
    padding: 0.75rem !important;
  }
  .bullets ul {
    font-size: 0.9rem;
    padding-left: 1rem !important;
  }
  .text-600 {
    font-size: 0.8rem !important;
  }
}

/* Spezifische Korrekturen für problematische Kreditkarten */
.card-image.tf-bank-mastercard-gold,
.card-image.santander-bestcard-basic { 
  /* Beide Karten auf gleiche Größe bringen ohne Abschneiden */
  object-fit: contain; /* Zeigt die komplette Karte ohne Abschneiden */
  border-radius: 18px; /* Gleicher border-radius wie Container */
  background: transparent; /* Kein zusätzlicher Hintergrund */
  transform: none !important; /* Keine Skalierung - normale Größe */
  padding: 0 !important; /* Kein zusätzliches Padding */
}

.card-image.barclays-visa {
  /* Barclays Visa größer machen, um mit anderen Karten übereinzustimmen */
  object-fit: contain; /* Zeigt die komplette Karte ohne Abschneiden */
  border-radius: 18px; /* Gleicher border-radius wie Container */
  background: transparent; /* Kein zusätzlicher Hintergrund */
  transform: scale(1.6); /* Größere Vergrößerung um mit anderen Karten gleichzuziehen */
  padding: 0 !important; /* Kein zusätzliches Padding */
}

.card-image-container.gebuehrenfrei-mastercard-gold {
  padding: 12px;
}

.card-image.gebuehrenfrei-mastercard-gold {
  object-fit: contain;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: #fff;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

/* Mobile Touch-Optimierungen für Apply-Buttons */
@media (max-width: 768px) {
  .apply-cta {
    min-height: 48px !important;
    min-width: 48px !important;
    touch-action: manipulation !important;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    font-size: 16px !important;
    line-height: 1.2 !important;
    padding: 12px 16px !important;
    cursor: pointer !important;
    position: relative !important;
    z-index: 10 !important;
  }
  
  .apply-cta:active {
    transform: scale(0.98) !important;
    transition: transform 0.1s ease !important;
    background-color: var(--brand-accent) !important;
    color: #062a3f !important;
  }
  
  .apply-cta:hover {
    background-color: var(--brand-accent) !important;
    color: #062a3f !important;
  }
}
</style>
