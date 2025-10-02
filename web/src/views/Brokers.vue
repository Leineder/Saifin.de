<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { brokers, recommendedBrokers } from '../data/brokers'

const router = useRouter()

const search = ref('')
const onlyRecommended = ref(false)
const filterEtfPlans = ref(false)
const filterZeroOrder = ref(false)
const filterCrypto = ref(false)
const filterCashInterest = ref(false)
const filterVollbank = ref(false)
const filterFreeDepot = ref(false)
const filterSubscription = ref(false)

const filteredBrokers = computed(() => {
  let list = brokers
  if (onlyRecommended.value) {
    list = list.filter(b => recommendedBrokers.includes(b.slug))
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(b =>
      b.name.toLowerCase().includes(q) ||
      (b.highlights || []).some(h => h.toLowerCase().includes(q))
    )
  }
  if (filterEtfPlans.value) {
    list = list.filter(b => {
      const inFeatures = b.features && (b.features.etfPlans === true)
      const inHighlights = (b.highlights || []).some(h => /sparpl[aä]n/i.test(h))
      return inFeatures || inHighlights
    })
  }
  if (filterZeroOrder.value) {
    list = list.filter(b => {
      const pricingText = (b.pricing && b.pricing.orderCostsDE) ? String(b.pricing.orderCostsDE).toLowerCase() : ''
      const hasZeroOrder = (b.highlights || []).some(h => /0\s*€/i.test(h) && /(order|geb[uü]hr|provision)/i.test(h))
        || (/0\s*€/i.test(pricingText) && /(order|geb[uü]hr|provision)/i.test(pricingText))
      return hasZeroOrder
    })
  }
  if (filterCrypto.value) {
    list = list.filter(b => (b.highlights || []).some(h => /krypto/i.test(h)))
  }
  if (filterCashInterest.value) {
    list = list.filter(b => b.features && typeof b.features.cashInterest === 'string' && b.features.cashInterest.length > 0)
  }
  if (filterVollbank.value) {
    list = list.filter(b => typeof b.regulation === 'string' && /vollbank/i.test(b.regulation))
  }
  if (filterFreeDepot.value) {
    list = list.filter(b => (b.highlights || []).some(h => /(depot\s*0\s*€|depot\s*kostenlos)/i.test(h)))
  }
  if (filterSubscription.value) {
    list = list.filter(b => {
      const pricingText = (b.pricing && b.pricing.orderCostsDE) ? String(b.pricing.orderCostsDE).toLowerCase() : ''
      const inHighlights = (b.highlights || []).some(h => /(monat|prime\+)/i.test(h))
      const inPricing = /(\/)\s*monat|monat/i.test(pricingText)
      return inHighlights || inPricing
    })
  }
  return list
})

const top3 = computed(() => brokers.filter(b => recommendedBrokers.includes(b.slug)))

function goToDetail(broker) {
  router.push(`/broker/${broker.slug}`)
}

function goToApply(broker) {
  router.push(`/antrag/${broker.slug}`)
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
  <div class="brokers-page">
    <section class="section">
      <div class="container layout">
        <!-- Sidebar Filter (Desktop) -->
        <aside v-if="isDesktop" class="sidebar">
          <div class="surface-card border-round-lg p-3 card-accent sidebar-card">
            <div class="section-eyebrow">Filter</div>
            <h2 class="section-title text-xl mb-3">Finde deinen Broker</h2>

            <div class="filter-group">
              <h3 class="filter-title">Suche</h3>
              <input v-model="search" placeholder="Name oder Feature" class="filter-input" />
            </div>

            <div class="filter-group">
              <label class="checkbox">
                <input type="checkbox" v-model="onlyRecommended" />
                <span>Nur Empfehlungen</span>
              </label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Produkt-Features</h3>
              <label class="checkbox">
                <input type="checkbox" v-model="filterEtfPlans" />
                <span>ETF-Sparpläne</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filterZeroOrder" />
                <span>0 € Order (oder sehr günstig)</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filterCrypto" />
                <span>Krypto-Handel</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filterCashInterest" />
                <span>Zinsen auf Cash</span>
              </label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Anbieter</h3>
              <label class="checkbox">
                <input type="checkbox" v-model="filterVollbank" />
                <span>Vollbank</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filterFreeDepot" />
                <span>Depot kostenlos</span>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="filterSubscription" />
                <span>Pauschal-/Abo-Modell</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Content -->
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
            <h2 class="section-title text-xl mb-3">Finde deinen Broker</h2>

            <div class="filter-group">
              <h3 class="filter-title">Suche</h3>
              <input v-model="search" placeholder="Name oder Feature" class="filter-input" />
            </div>

            <div class="filter-group">
              <label class="checkbox">
                <input type="checkbox" v-model="onlyRecommended" />
                <span>Nur Empfehlungen</span>
              </label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Produkt-Features</h3>
              <label class="checkbox"><input type="checkbox" v-model="filterEtfPlans" /> <span>ETF-Sparpläne</span></label>
              <label class="checkbox"><input type="checkbox" v-model="filterZeroOrder" /> <span>0 € Order (oder sehr günstig)</span></label>
              <label class="checkbox"><input type="checkbox" v-model="filterCrypto" /> <span>Krypto-Handel</span></label>
              <label class="checkbox"><input type="checkbox" v-model="filterCashInterest" /> <span>Zinsen auf Cash</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Anbieter</h3>
              <label class="checkbox"><input type="checkbox" v-model="filterVollbank" /> <span>Vollbank</span></label>
              <label class="checkbox"><input type="checkbox" v-model="filterFreeDepot" /> <span>Depot kostenlos</span></label>
              <label class="checkbox"><input type="checkbox" v-model="filterSubscription" /> <span>Pauschal-/Abo-Modell</span></label>
            </div>
          </div>
          <div class="section-eyebrow">Angebote</div>
          <h1 class="section-title text-2xl md:text-3xl mb-3">Broker im Vergleich</h1>

          <div class="offers-section">
            <div 
              v-for="b in filteredBrokers" 
              :key="b.id || b.slug" 
              class="offer-card surface-card border-round-xl card-accent"
              @click="goToDetail(b)"
              style="cursor: pointer;"
            >
              <div class="offer-content">
                <div class="card-image-container">
                  <img :src="b.image || '/images/saifin_logo_vectorized_final.svg'" :alt="`${b.name} – Logo`" :class="['card-image', 'logo-' + b.slug]" loading="lazy" />
                </div>
                <div class="offer-details">
                  <div class="offer-header">
                    <h3 class="offer-title">{{ b.name }}</h3>
                  </div>
                  <div class="features-list">
                    <div v-for="(h, idx) in (b.highlights || []).slice(0, 4)" :key="idx" class="feature-item">
                      <i class="pi pi-check"></i>
                      <span>{{ h }}</span>
                    </div>
                  </div>
                  <div class="action-buttons">
                    <button class="p-button apply-cta" @click.stop="goToApply(b)"><span class="p-button-label">Zum Antrag</span></button>
                    <button class="expand-btn" @click.stop="goToDetail(b)">Details <i class="pi pi-chevron-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empfehlungen -->
          <div class="recommendations-section">
            <h2 class="recommendations-title section-title">Unsere Empfehlungen</h2>
            <div class="recommendations-grid">
              <div 
                v-for="b in top3" 
                :key="b.slug" 
                class="recommendation-card surface-card border-round-xl card-accent"
                @click="goToDetail(b)"
                style="cursor: pointer;"
              >
                <div class="recommendation-content">
                  <div class="card-image-container">
                    <img :src="b.image || '/images/saifin_logo_vectorized_final.svg'" :alt="`${b.name} – Logo`" class="card-image" loading="lazy" />
                  </div>
                  <div class="recommendation-details">
                    <div class="offer-header">
                      <h3 class="offer-title">{{ b.name }}</h3>
                    </div>
                    <div class="features-list">
                      <div v-for="(p, idx) in (b.recommendation?.pros || b.highlights || []).slice(0, 4)" :key="idx" class="feature-item">
                        <i class="pi pi-check"></i>
                        <span>{{ p }}</span>
                      </div>
                    </div>
                    <div class="action-buttons">
                      <button class="p-button apply-cta" @click.stop="goToApply(b)"><span class="p-button-label">Zum Antrag</span></button>
                      <button class="expand-btn" @click.stop="goToDetail(b)">Details <i class="pi pi-chevron-right"></i></button>
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
        <!-- Guide: Wie finde ich den richtigen Broker? -->
        <div class="guide-section">
          <div class="guide-header">
            <div class="section-eyebrow">Ratgeber</div>
            <h2 class="section-title">Wie finde ich den richtigen Broker?</h2>
            <p class="guide-subtitle">Ein Broker ist dein Zugang zur Börse. Er führt deine Wertpapieraufträge aus und stellt dir Tools zur Verfügung, um zu handeln und zu sparen. Es gibt verschiedene Broker-Typen mit unterschiedlichen Stärken.</p>
          </div>
          <div class="guide-grid">
            <div class="surface-card border-round-lg p-3 card-accent info-card">
              <h3 class="info-title">Broker-Arten</h3>
              <ul class="guide-list">
                <li><strong>Neobroker:</strong> Sehr günstige Orders, einfache App, Fokus auf ETFs/Aktien.</li>
                <li><strong>Vollbank-/Direktbank-Broker:</strong> Umfassendes Angebot, klassische Bankfunktionen.</li>
                <li><strong>Spezialbroker:</strong> Breite internationale Börsenplätze, Derivate/Optionen.</li>
              </ul>
            </div>
            <div class="surface-card border-round-lg p-3 card-accent info-card">
              <h3 class="info-title">Worauf achten</h3>
              <ul class="guide-list">
                <li><strong>Kosten:</strong> Ordergebühren, Spreads/Marktkosten, Depotkosten.</li>
                <li><strong>Angebot:</strong> Aktien, ETFs, Sparpläne, Auslandsbörsen, Krypto.</li>
                <li><strong>Regulierung & Sicherheit:</strong> BaFin, Einlagensicherung, Verwahrung.</li>
                <li><strong>Bedienung:</strong> App/Web, Reports/Steuer, Support.</li>
                <li><strong>Extras:</strong> Zinsen auf Cash, Pauschal-/Abo-Modelle.</li>
              </ul>
            </div>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent info-card guide-steps-card">
            <h3 class="info-title">In 5 Schritten starten</h3>
            <ol class="steps-list">
              <li>Nutzungsprofil klären (Handel vs. Sparpläne, international ja/nein).</li>
              <li>Filter in der Sidebar nutzen (z. B. ETF-Sparpläne, 0 € Order, Zinsen).</li>
              <li>2–3 Anbieter vergleichen und Highlights prüfen.</li>
              <li>Preis-/Leistungsverzeichnis ansehen (Fremdkosten, Börsenplätze).</li>
              <li>Kleiner Test: z. B. Sparplan anlegen oder Demo ausprobieren.</li>
            </ol>
          </div>
        </div>

        <!-- FAQ Broker -->
        <div class="faq-section">
          <h2 class="section-title">Häufige Fragen zum Broker</h2>
          <div class="faq-list">
            <details class="faq-item">
              <summary>Was ist ein Neobroker?</summary>
              <p>Neobroker sind digital-fokussierte Anbieter mit sehr günstigen Orders und einfacher App. Häufig mit Fokus auf ETFs/Aktien und Sparpläne.</p>
            </details>
            <details class="faq-item">
              <summary>Sind 0 € Orders wirklich kostenlos?</summary>
              <p>Es fallen oft keine Orderprovisionen an, aber Spreads/Markt- und Börsenentgelte können anfallen. Details findest du im Preisverzeichnis.</p>
            </details>
            <details class="faq-item">
              <summary>Wie sicher sind meine Einlagen und Wertpapiere?</summary>
              <p>Einlagen sind über gesetzliche Einlagensicherung geschützt. Wertpapiere gelten als Sondervermögen und sind getrennt vom Brokervermögen verwahrt.</p>
            </details>
            <details class="faq-item">
              <summary>Kann ich mehrere Broker parallel nutzen?</summary>
              <p>Ja. Viele Anleger nutzen z. B. einen Neobroker für Sparpläne und einen Spezialbroker für internationale Märkte.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.brokers-page { background: var(--surface-muted); min-height: 100vh; }
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
.sidebar { position: relative; }
.sidebar-card { position: sticky; top: 86px; }
.content { min-width: 0; }

.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-title { font-size: 0.875rem; font-weight: 600; color: var(--text); margin: 0; }
.filter-input { padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text); font-size: 0.875rem; }
.checkbox { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text); }

.offers-section { margin-bottom: 3rem; }
.offer-card { margin-bottom: 1.5rem; position: relative; overflow: hidden; }
.offer-content { display: flex; padding: 1.5rem; gap: 1.5rem; }
.card-image-container { flex-shrink: 0; width: 120px; height: 75px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
.card-image { width: 100%; height: 100%; object-fit: cover; background: transparent; padding: 0; border-radius: 0.75rem; border: none; }

/* Logos, die vollständig lesbar bleiben sollen */
.card-image.logo-justtrade,
.card-image.logo-flatex { object-fit: contain; transform: none; }

/* Logos, die etwas größer dargestellt werden sollen */
.card-image.logo-smartbroker-plus,
.card-image.logo-trade-republic,
.card-image.logo-ing { transform: scale(1.24); }
.offer-details { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; }
.offer-title { font-size: 1.125rem; font-weight: 700; color: var(--text); margin: 0; }
.payment-type { display: flex; align-items: center; gap: 0.25rem; color: var(--subtle-text); font-size: 0.875rem; }
.features-list { display: flex; flex-direction: column; gap: 0.5rem; }
.feature-item { display: flex; align-items: center; gap: 0.5rem; color: var(--muted-text); font-size: 0.875rem; }
.feature-item i { color: #34d399; font-size: 0.75rem; }
.action-buttons { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }

/* Details-Button wie in Kreditkarten */
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

.recommendations-section { margin-top: 3rem; }
.recommendations-title { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 1.5rem; text-align: center; }
.recommendations-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
.recommendation-card { background: var(--surface); border-radius: 0.75rem; box-shadow: 0 1px 3px var(--shadow-color); position: relative; overflow: hidden; }
.recommendation-content { display: flex; padding: 1.5rem; gap: 1.5rem; }
.recommendation-details { flex: 1; display: flex; flex-direction: column; gap: 1rem; }

.guide-section { margin-top: 3rem; }
.guide-header { margin-bottom: 1rem; }
.guide-subtitle { color: var(--muted-text); }
.guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
.info-card { box-shadow: 0 10px 20px rgba(6, 42, 63, 0.06); }
.info-title { font-size: 0.875rem; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; color: var(--subtle-text); margin: 0 0 .25rem; }
.guide-list { margin: 0.25rem 0 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--muted-text); }
.guide-steps { margin-top: 1rem; }
.steps-list { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--muted-text); }
.guide-steps-card { margin-top: 1rem; }

.faq-section { margin-top: 2rem; }
.faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
.faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
.faq-item summary { cursor: pointer; font-weight: 600; color: var(--text); list-style: none; }
.faq-item p { margin: 0.5rem 0 0; color: var(--muted-text); }

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar-card { position: static; }
  .offer-content, .recommendation-content { flex-direction: column; gap: 1rem; }
  .card-image-container { width: 100%; max-width: 200px; margin: 0 auto; }
  .action-buttons { flex-direction: column; align-items: stretch; }
  .recommendations-grid { grid-template-columns: 1fr; }
  .mobile-filter-toggle { display: flex; justify-content: center; margin: 12px 0; }
  .mobile-filter-toggle .p-button { width: 100%; max-width: 300px; }
  .mobile-filter-panel { margin-bottom: 16px; }
}

@media (min-width: 769px) {
  .mobile-filter-toggle, .mobile-filter-panel { display: none; }
}
</style>

