<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { offers } from '../data/offers'
import { trackCreditCardApply, trackFilterUsage } from '../utils/analytics'

const router = useRouter()

// Filter States (kartenspezifisch)
const maxAnnualFee = ref('alle') // 'alle' | 0 | 60 | 100 | 200 | 'custom'
const foreignFee = ref('alle') // 'alle' | '0' | '<=1' | '<=2' | '>2'
const cardTypes = ref([]) // ['Charge','Credit','Debit']
const supportsApplePay = ref(false)
const supportsGooglePay = ref(false)
const hasInsurance = ref(false)
const hasCashback = ref(false)
const schufaFree = ref(false)
const instantDecision = ref(false)

// Helpers
function parsePercentToNumber(text) {
  if (!text || typeof text !== 'string') return NaN
  const m = text.replace(',', '.').match(/([0-9]+(?:\.[0-9]+)?)\s*%/)
  return m ? parseFloat(m[1]) : NaN
}

function handleImageError(event) {
  console.log('Image failed to load:', event.target.src)
  event.target.src = '/images/saifin_logo_vectorized_final.svg'
}

const filteredOffers = computed(() => {
  let filtered = offers

  // Jahresgebühr
  if (maxAnnualFee.value !== 'alle') {
    filtered = filtered.filter(o => {
      const fee = typeof o.annualFee === 'number' ? o.annualFee : Number.POSITIVE_INFINITY
      if (maxAnnualFee.value === 0) return fee === 0
      if (typeof maxAnnualFee.value === 'number') return fee <= maxAnnualFee.value
      return true
    })
  }

  // Auslandseinsatz/Währungsgebühr
  if (foreignFee.value !== 'alle') {
    filtered = filtered.filter(o => {
      const pct = parsePercentToNumber(o.foreignFee)
      if (isNaN(pct)) return true
      if (foreignFee.value === '0') return pct === 0
      if (foreignFee.value === '<=1') return pct <= 1
      if (foreignFee.value === '<=2') return pct <= 2
      if (foreignFee.value === '>2') return pct > 2
      return true
    })
  }

  // Kartenart
  if (cardTypes.value.length > 0) {
    filtered = filtered.filter(o => {
      const isCharge = /charge/i.test(o.cardType) || /charge/i.test(o.details?.cardType || '')
      const isDebit = /debit/i.test(o.cardType) || /debit/i.test(o.details?.cardType || '')
      const isCredit = /credit|revolving/i.test(o.cardType) || /credit|revolving/i.test(o.details?.cardType || '')
      const desired = new Set(cardTypes.value)
      return (
        (desired.has('Charge') && isCharge) ||
        (desired.has('Debit') && isDebit) ||
        (desired.has('Credit') && isCredit)
      )
    })
  }

  // Mobile Payment
  if (supportsApplePay.value) {
    filtered = filtered.filter(o => o.features?.mobilePay?.includes('Apple Pay'))
  }
  if (supportsGooglePay.value) {
    filtered = filtered.filter(o => o.features?.mobilePay?.includes('Google Pay'))
  }

  // Versicherungen
  if (hasInsurance.value) {
    filtered = filtered.filter(o => Boolean(o.features?.insurance))
  }

  // Cashback/Travel Credit
  if (hasCashback.value) {
    filtered = filtered.filter(o => Boolean(o.features?.cashback || o.features?.travelCredit))
  }

  // SCHUFA-frei (kein Schufa-Check)
  if (schufaFree.value) {
    filtered = filtered.filter(o => o.specialConditions?.schufaCheck === false)
  }

  // Sofortentscheidung
  if (instantDecision.value) {
    filtered = filtered.filter(o => o.specialConditions?.instantDecision === true)
  }

  return filtered
})

// Get top 3 offers for recommendations
const topOffers = computed(() => {
  return offers.slice(0, 3)
})

// Analytics: Filter-Nutzung tracken
watch([maxAnnualFee, foreignFee, cardTypes, supportsApplePay, supportsGooglePay, hasInsurance, hasCashback, schufaFree, instantDecision], 
  ([newMaxAnnualFee, newForeignFee, newCardTypes, newApplePay, newGooglePay, newInsurance, newCashback, newSchufaFree, newInstantDecision], 
   [oldMaxAnnualFee, oldForeignFee, oldCardTypes, oldApplePay, oldGooglePay, oldInsurance, oldCashback, oldSchufaFree, oldInstantDecision]) => {
    
    // Track filter changes
    if (newMaxAnnualFee !== oldMaxAnnualFee && newMaxAnnualFee !== 'alle') {
      trackFilterUsage('annual_fee', newMaxAnnualFee, 'kreditkarten')
    }
    if (newForeignFee !== oldForeignFee && newForeignFee !== 'alle') {
      trackFilterUsage('foreign_fee', newForeignFee, 'kreditkarten')
    }
    if (newCardTypes !== oldCardTypes && newCardTypes.length > 0) {
      trackFilterUsage('card_types', newCardTypes.join(','), 'kreditkarten')
    }
    if (newApplePay !== oldApplePay && newApplePay) {
      trackFilterUsage('apple_pay', 'enabled', 'kreditkarten')
    }
    if (newGooglePay !== oldGooglePay && newGooglePay) {
      trackFilterUsage('google_pay', 'enabled', 'kreditkarten')
    }
    if (newInsurance !== oldInsurance && newInsurance) {
      trackFilterUsage('insurance', 'enabled', 'kreditkarten')
    }
    if (newCashback !== oldCashback && newCashback) {
      trackFilterUsage('cashback', 'enabled', 'kreditkarten')
    }
    if (newSchufaFree !== oldSchufaFree && newSchufaFree) {
      trackFilterUsage('schufa_free', 'enabled', 'kreditkarten')
    }
    if (newInstantDecision !== oldInstantDecision && newInstantDecision) {
      trackFilterUsage('instant_decision', 'enabled', 'kreditkarten')
    }
  }, { deep: true }
)

const formatEuro = (n) => {
  if (n === 0) return '0,00 €'
  if (typeof n === 'number') return `${n.toFixed(2).replace('.', ',')} €`
  return n
}

const goToApply = (offer) => {
  if (!offer || !offer.applyUrl) return
  
  // Vercel Analytics: Kreditkarten-Anfrage tracken
  trackCreditCardApply(offer.id, offer.title, offer.applyUrl)
  
  // TikTok Event: Kreditkartenantrag initiiert
  if (window.ttq) {
    window.ttq.track('InitiateCheckout', {
      content_type: 'product',
      content_name: offer.title,
      content_id: offer.id || offer.slug,
      value: offer.annualFee || 0,
      currency: 'EUR'
    })
  }
  
  const url = offer.applyUrl
  if (/^https?:\/\//i.test(url)) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    router.push(url)
  }
}

const goToDetail = (offer) => {
  if (offer && offer.slug) {
    router.push(`/kreditkarten/${offer.slug}`)
  }
}

// Mobile: Filter einklappbar
const showFilters = ref(false)
const isDesktop = ref(false)
let mediaQuery
let onChange
onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 769px)')
  onChange = () => {
    isDesktop.value = mediaQuery.matches
    if (isDesktop.value) {
      showFilters.value = false
    }
  }
  mediaQuery.addEventListener ? mediaQuery.addEventListener('change', onChange) : mediaQuery.addListener(onChange)
  onChange()
})
onBeforeUnmount(() => {
  if (mediaQuery && onChange) {
    mediaQuery.removeEventListener ? mediaQuery.removeEventListener('change', onChange) : mediaQuery.removeListener(onChange)
  }
})
</script>

<template>
  <div class="cards-page">
    <section class="section">
      <div class="container layout">
        <!-- Sidebar Filter (Desktop) -->
        <aside v-if="isDesktop" class="sidebar">
          <div class="surface-card border-round-lg p-3 card-accent sidebar-card">
            <div class="section-eyebrow">Filter</div>
            <h2 class="section-title text-xl mb-3">Finde deine Karte</h2>

            <div class="filter-group">
              <h3 class="filter-title">Jahresgebühr</h3>
              <select v-model="maxAnnualFee" class="filter-select">
                <option value="alle">alle</option>
                <option :value="0">genau 0 €</option>
                <option :value="60">bis 60 €</option>
                <option :value="100">bis 100 €</option>
                <option :value="200">bis 200 €</option>
              </select>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Auslandseinsatz</h3>
              <select v-model="foreignFee" class="filter-select">
                <option value="alle">alle</option>
                <option value="0">0 %</option>
                <option value="<=1">≤ 1 %</option>
                <option value="<=2">≤ 2 %</option>
                <option value=">2">> 2 %</option>
              </select>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Kartenart</h3>
              <label class="checkbox"><input type="checkbox" value="Charge" v-model="cardTypes" /> <span>Charge</span></label>
              <label class="checkbox"><input type="checkbox" value="Credit" v-model="cardTypes" /> <span>Credit (Revolving)</span></label>
              <label class="checkbox"><input type="checkbox" value="Debit" v-model="cardTypes" /> <span>Debit</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Zahlung & Extras</h3>
              <label class="checkbox"><input type="checkbox" v-model="supportsApplePay" /> <span>Apple Pay</span></label>
              <label class="checkbox"><input type="checkbox" v-model="supportsGooglePay" /> <span>Google Pay</span></label>
              <label class="checkbox"><input type="checkbox" v-model="hasInsurance" /> <span>Versicherungen</span></label>
              <label class="checkbox"><input type="checkbox" v-model="hasCashback" /> <span>Cashback / Reisegutschrift</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Bedingungen</h3>
              <label class="checkbox"><input type="checkbox" v-model="schufaFree" /> <span>Ohne SCHUFA</span></label>
              <label class="checkbox"><input type="checkbox" v-model="instantDecision" /> <span>Sofortentscheidung</span></label>
            </div>
          </div>
        </aside>

        <!-- Offers -->
        <main class="content">
          <!-- Mobile Filter Toggle -->
          <div class="mobile-filter-toggle">
            <button class="p-button apply-cta" @click="showFilters = !showFilters">
              <i class="pi pi-filter" style="margin-right: 0.5rem;"></i>
              <span class="p-button-label">{{ showFilters ? 'Filter ausblenden' : 'Filter anzeigen' }}</span>
            </button>
          </div>

          <!-- Mobile Filter Panel -->
          <div v-if="!isDesktop && showFilters" class="surface-card border-round-lg p-3 card-accent mobile-filter-panel">
            <div class="section-eyebrow">Filter</div>
            <h2 class="section-title text-xl mb-3">Finde deine Karte</h2>

            <div class="filter-group">
              <h3 class="filter-title">Jahresgebühr</h3>
              <select v-model="maxAnnualFee" class="filter-select">
                <option value="alle">alle</option>
                <option :value="0">genau 0 €</option>
                <option :value="60">bis 60 €</option>
                <option :value="100">bis 100 €</option>
                <option :value="200">bis 200 €</option>
              </select>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Auslandseinsatz</h3>
              <select v-model="foreignFee" class="filter-select">
                <option value="alle">alle</option>
                <option value="0">0 %</option>
                <option value="<=1">≤ 1 %</option>
                <option value="<=2">≤ 2 %</option>
                <option value=">2">&gt; 2 %</option>
              </select>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Kartenart</h3>
              <label class="checkbox"><input type="checkbox" value="Charge" v-model="cardTypes" /> <span>Charge</span></label>
              <label class="checkbox"><input type="checkbox" value="Credit" v-model="cardTypes" /> <span>Credit (Revolving)</span></label>
              <label class="checkbox"><input type="checkbox" value="Debit" v-model="cardTypes" /> <span>Debit</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Zahlung & Extras</h3>
              <label class="checkbox"><input type="checkbox" v-model="supportsApplePay" /> <span>Apple Pay</span></label>
              <label class="checkbox"><input type="checkbox" v-model="supportsGooglePay" /> <span>Google Pay</span></label>
              <label class="checkbox"><input type="checkbox" v-model="hasInsurance" /> <span>Versicherungen</span></label>
              <label class="checkbox"><input type="checkbox" v-model="hasCashback" /> <span>Cashback / Reisegutschrift</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Bedingungen</h3>
              <label class="checkbox"><input type="checkbox" v-model="schufaFree" /> <span>Ohne SCHUFA</span></label>
              <label class="checkbox"><input type="checkbox" v-model="instantDecision" /> <span>Sofortentscheidung</span></label>
            </div>
          </div>
          <div class="section-eyebrow">Angebote</div>
          <h1 class="section-title text-2xl md:text-3xl mb-3">Kreditkarten im Vergleich</h1>

          <div class="offers-section">
            <div 
              v-for="offer in filteredOffers" 
              :key="offer.id" 
              class="offer-card surface-card border-round-xl card-accent"
              @click="goToDetail(offer)"
              style="cursor: pointer;"
            >
              <div v-if="offer.bonus" class="bonus-banner">
                <i class="pi pi-gift"></i>
                {{ offer.bonus }} Bonus
              </div>

              <div class="offer-content">
                <div class="card-image-container">
                  <img :src="offer.image" :alt="offer.title" class="card-image" loading="lazy" decoding="async" width="140" height="88" @error="handleImageError" />
                </div>
                <div class="offer-details">
                  <div class="offer-header">
                    <h3 class="offer-title">{{ offer.title }}</h3>
                    <div class="payment-type">
                      <span>Zahlungsart {{ offer.cardType.includes('Charge') ? 'Charge' : 'Credit' }}</span>
                      <i class="pi pi-info-circle"></i>
                    </div>
                  </div>
                  <div class="features-list">
                    <div v-for="(feature, index) in offer.bullets.slice(0, 4)" :key="index" class="feature-item">
                      <i class="pi pi-check"></i>
                      <span>{{ feature }}</span>
                    </div>
                  </div>
                  <div class="annual-fee">{{ formatEuro(offer.annualFee) }} pro Jahr</div>
                  <div class="action-buttons">
                    <button class="p-button apply-cta" @click.stop="goToApply(offer)"><span class="p-button-label">Zum Antrag</span></button>
                    <button class="expand-btn" @click.stop="goToDetail(offer)">Details <i class="pi pi-chevron-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="recommendations-section">
            <h2 class="recommendations-title section-title">Unsere Empfehlungen</h2>
            <div class="recommendations-grid">
              <div 
                v-for="offer in topOffers" 
                :key="offer.id" 
                class="recommendation-card surface-card border-round-xl card-accent"
                @click="goToDetail(offer)"
                style="cursor: pointer;"
              >
                <div v-if="offer.bonus" class="bonus-banner">
                  <i class="pi pi-gift"></i>
                  {{ offer.bonus }} Bonus
                </div>
                <div class="recommendation-content">
                  <div class="card-image-container">
                    <img :src="offer.image" :alt="offer.title" class="card-image" loading="lazy" decoding="async" width="140" height="88" @error="handleImageError" />
                  </div>
                  <div class="recommendation-details">
                    <div class="offer-header">
                      <h3 class="offer-title">{{ offer.title }}</h3>
                      <div class="payment-type">
                        <span>Zahlungsart {{ offer.cardType.includes('Charge') ? 'Charge' : 'Credit' }}</span>
                        <i class="pi pi-info-circle"></i>
                      </div>
                    </div>
                    <div class="features-list">
                      <div v-for="(feature, index) in offer.bullets.slice(0, 4)" :key="index" class="feature-item">
                        <i class="pi pi-check"></i>
                        <span>{{ feature }}</span>
                      </div>
                    </div>
                    <div class="annual-fee">{{ formatEuro(offer.annualFee) }} pro Jahr</div>
                    <div class="action-buttons">
                      <button class="p-button apply-cta" @click.stop="goToApply(offer)"><span class="p-button-label">Zum Antrag</span></button>
                      <button class="expand-btn" @click.stop="goToDetail(offer)">Details <i class="pi pi-chevron-right"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <!-- Volle Breite: Guide & FAQ außerhalb des 2-Spalten-Layouts -->
      <div class="container">
        <!-- Guide: Wie finde ich die richtige Kreditkarte? -->
        <div class="guide-section">
          <div class="guide-header">
            <div class="section-eyebrow">Ratgeber</div>
            <h2 class="section-title">Wie finde ich die richtige Kreditkarte?</h2>
            <p class="guide-subtitle">Kreditkarten unterscheiden sich in Art (Charge, Credit/Revolving, Debit), Gebühren und Zusatzleistungen. Wichtig ist, dass die Karte zu deinem Nutzungsprofil passt.</p>
          </div>
          <div class="guide-grid">
            <div class="surface-card border-round-lg p-3 card-accent info-card">
              <h3 class="info-title">Kartenarten</h3>
              <ul class="guide-list">
                <li><strong>Charge:</strong> Sammelabrechnung, Vollausgleich monatlich.</li>
                <li><strong>Credit/Revolving:</strong> Teilzahlung möglich, bei Restzahlung fallen Zinsen an.</li>
                <li><strong>Debit:</strong> Sofortabbuchung vom Verrechnungskonto.</li>
              </ul>
            </div>
            <div class="surface-card border-round-lg p-3 card-accent info-card">
              <h3 class="info-title">Worauf achten</h3>
              <ul class="guide-list">
                <li><strong>Jahresgebühr:</strong> 0 € bis Premium – passt der Gegenwert?</li>
                <li><strong>Auslandseinsatz:</strong> 0 % ideal für Reisen; ATM-Gebühren beachten.</li>
                <li><strong>Mobile Pay:</strong> Apple Pay/Google Pay Support.</li>
                <li><strong>Leistungen:</strong> Versicherungen, Cashback, Reiseguthaben.</li>
                <li><strong>Bedingungen:</strong> SCHUFA, Sofortentscheidung, Limits.</li>
              </ul>
            </div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent info-card guide-steps-card">
            <h3 class="info-title">In 4 Schritten starten</h3>
            <ol class="steps-list">
              <li>Nutzungsprofil definieren (Reisen, Alltag, Cashback, Versicherungen).</li>
              <li>Filter in der Sidebar nutzen (Gebühren, Ausland, Art, Mobile Pay).</li>
              <li>2–3 Karten vergleichen und Bedingungen prüfen.</li>
              <li>Bei Revolving: Vollabbuchung aktivieren, um Zinsen zu vermeiden.</li>
            </ol>
          </div>
        </div>

        <!-- FAQ Kreditkarten -->
        <div class="faq-section">
          <h2 class="section-title">Häufige Fragen zur Kreditkarte</h2>
          <div class="faq-list">
            <details class="faq-item">
              <summary>Charge vs. Credit vs. Debit – was ist der Unterschied?</summary>
              <p>Charge: Sammelabrechnung mit Vollausgleich. Credit/Revolving: Teilzahlung möglich, Zinsen bei Restschulden. Debit: Direkte Abbuchung vom Konto.</p>
            </details>
            <details class="faq-item">
              <summary>Ist 0 % Auslandseinsatz wirklich gebührenfrei?</summary>
              <p>Die Bank erhebt keine Auslandseinsatzgebühr, Automatenbetreiber können jedoch eigene Entgelte verlangen. Hinweise im Preisverzeichnis beachten.</p>
            </details>
            <details class="faq-item">
              <summary>Beeinflusst eine Kreditkarte meine SCHUFA?</summary>
              <p>Ja, Beantragung und Nutzung können vermerkt werden. Verantwortungsvolle Nutzung (pünktliche Zahlung) ist positiv.</p>
            </details>
            <details class="faq-item">
              <summary>Wie vermeide ich Zinsen bei Revolving-Karten?</summary>
              <p>Automatische Vollabbuchung aktivieren und Rechnungen fristgerecht begleichen.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cards-page { background: var(--surface-muted); min-height: 100vh; }
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
.sidebar { position: relative; }
.sidebar-card { position: sticky; top: 86px; }
.content { min-width: 0; }

/* Filter Section */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--surface);
  color: var(--text);
  font-size: 0.875rem;
  min-width: 120px;
}

.sidebar-actions { margin-top: 1rem; }

/* Buttons werden über PrimeVue gebrandet */

/* Main Content */


/* Offer Cards */
.offers-section {
  margin-bottom: 3rem;
}

.offer-card { margin-bottom: 1.5rem; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.offer-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px var(--shadow-color); }

.bonus-banner {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--brand-accent);
  color: #062a3f;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
}



.offer-content {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
}

.card-image-container {
  flex-shrink: 0;
  width: 140px;
  height: 88px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--border);
  /* Stelle sicher, dass der Container das richtige Seitenverhältnis hat */
  aspect-ratio: 1.586 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ändere zu contain um Abschneiden zu vermeiden */
  object-position: center center;
  border-radius: 4px;
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

.offer-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.offer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.payment-type {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--subtle-text);
  font-size: 0.875rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted-text);
  font-size: 0.875rem;
}

.feature-item i {
  color: #34d399;
  font-size: 0.75rem;
}

.annual-fee { font-size: 1.125rem; font-weight: 700; color: var(--brand-accent); }

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Primäre CTA über .p-button */

.expandable-sections {
  display: flex;
  gap: 1rem;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--subtle-text);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* Recommendations Section */
.recommendations-section {
  margin-top: 3rem;
}

.recommendations-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.5rem;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: var(--surface);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px var(--shadow-color);
  position: relative;
  overflow: hidden;
}

.recommendation-content {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
}

.recommendation-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Guide & FAQ */
.guide-section { margin-top: 3rem; }
.guide-header { margin-bottom: 1rem; }
.guide-subtitle { color: var(--muted-text); }
.guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
.guide-list { margin: 0.25rem 0 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--muted-text); }
.guide-steps { margin-top: 1rem; }
.steps-list { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--muted-text); }
.guide-steps-card { margin-top: 1rem; }

.info-card { box-shadow: 0 10px 20px rgba(6, 42, 63, 0.06); }
.info-title { font-size: 0.875rem; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; color: var(--subtle-text); margin: 0 0 .25rem; }

.faq-section { margin-top: 2rem; }
.faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
.faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
.faq-item summary { cursor: pointer; font-weight: 600; color: var(--text); list-style: none; }
.faq-item p { margin: 0.5rem 0 0; color: var(--muted-text); }

/* Responsive Design */
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar-card { position: static; }
  
  .offer-content,
  .recommendation-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .card-image-container {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    /* Stelle sicher, dass der Container das richtige Seitenverhältnis beibehält */
    aspect-ratio: 1.586 / 1;
    height: auto;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .expandable-sections {
    justify-content: center;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .mobile-filter-toggle { display: flex; justify-content: center; margin: 12px 0; }
  .mobile-filter-toggle .p-button { width: 100%; max-width: 300px; }
  .mobile-filter-panel { margin-bottom: 16px; }
}

/* Desktop: Mobile-Filter ausblenden */
@media (min-width: 769px) {
  .mobile-filter-toggle, .mobile-filter-panel { display: none; }
}
</style>
