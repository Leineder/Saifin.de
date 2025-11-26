<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { savingsOffers, recommendedSavings } from '../data/savings'
import { createAffiliateLinkHandler, preloadAffiliateLink } from '../utils/affiliate-links'
import { useAffiliatePerformance } from '../utils/affiliate-performance-fallback'

const router = useRouter()

// Filter States
const search = ref('')
const onlyRecommended = ref(false)
const onlyPromo = ref(false) // Neukundenaktion
const onlyMonthlyPayout = ref(false)
const dgsOnly = ref(true) // EU-Einlagensicherung
const countryFilter = ref('alle') // 'alle' | 'DE' | 'ES' | 'FR' | 'SE' | 'CZ' | 'EU' | 'MT'

const isDesktop = ref(false)
const showFilters = ref(false)
let mediaQuery
let onChange

onMounted(() => {
  // Use requestIdleCallback for non-critical media query setup
  const setupMediaQuery = () => {
    mediaQuery = window.matchMedia('(min-width: 769px)')
    onChange = () => {
      isDesktop.value = mediaQuery.matches
      if (isDesktop.value) showFilters.value = false
    }
    mediaQuery.addEventListener('change', onChange)
    onChange()
  }
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(setupMediaQuery, { timeout: 500 })
  } else {
    setupMediaQuery()
  }
})

onBeforeUnmount(() => {
  if (mediaQuery && onChange) {
    mediaQuery.removeEventListener('change', onChange)
  }
})

const filtered = computed(() => {
  let list = savingsOffers
  if (onlyRecommended.value) list = list.filter(o => recommendedSavings.includes(o.slug))

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(o =>
      (o.title || '').toLowerCase().includes(q) ||
      (o.interest || '').toLowerCase().includes(q) ||
      (o.security || '').toLowerCase().includes(q) ||
      (o.payout || '').toLowerCase().includes(q) ||
      (o.highlights || []).some(h => (h || '').toLowerCase().includes(q))
    )
  }

  if (onlyPromo.value) list = list.filter(o => o.isNeukundenaktion)
  if (onlyMonthlyPayout.value) list = list.filter(o => /monat/i.test(o.payout || ''))
  if (dgsOnly.value) list = list.filter(o => o.euDgs === true)
  if (countryFilter.value !== 'alle') list = list.filter(o => (o.countryCode || '').toLowerCase() === countryFilter.value.toLowerCase())
  return list
})

// Performance-Monitoring für Affiliate-Links
const { startMeasurement, endMeasurement, collectWebVitals } = useAffiliatePerformance('savings-overview')

function goToApply(o) {
  if (!o || !o.applyUrl) return
  
  const url = o.applyUrl
  
  // Verwende optimierten Affiliate-Link-Handler für externe Links
  if (/^https?:\/\//i.test(url)) {
    const affiliateHandler = createAffiliateLinkHandler(url, {
      onClick: () => {
        // Starte Performance-Messung
        const measurementId = startMeasurement(url)
        if (measurementId) {
          collectWebVitals(measurementId)
        }
        
        // Meta Pixel: CompleteRegistration bei externem Tagesgeld-Antrag
        try {
          if (window.fbq) {
            window.fbq('track', 'CompleteRegistration', {
              content_name: o.title,
              content_category: 'savings',
              content_id: o.id || o.slug,
              value: o.rate || 0,
              status: 'external_redirect'
            })
          }
        } catch (_) {}
        
        // TikTok Pixel: Custom Event "Antrag gestellt" bei externem Tagesgeld-Antrag
        try {
          if (window.ttq && typeof window.ttq.track === 'function') {
            window.ttq.track('Antrag gestellt', {
              content_type: 'savings',
              content_name: o.title,
              content_id: o.id || o.slug,
              value: o.rate || 0,
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
    
    affiliateHandler.onClick({ preventDefault: () => {} })
  } else {
    // Interne Links
    router.push(url)
  }
}
</script>

<template>
  <div class="savings-page">
    <section class="section">
      <div class="container layout">
        <!-- Sidebar Filter (Desktop) -->
        <aside v-if="isDesktop" class="sidebar">
          <div class="surface-card border-round-lg p-3 card-accent sidebar-card">
            <div class="section-eyebrow">Filter</div>
            <h2 class="section-title text-xl mb-3">Finde dein Tagesgeld</h2>

            <div class="filter-group">
              <h3 class="filter-title">Suche</h3>
              <input v-model="search" placeholder="Name, Zins, Einlagensicherung" class="filter-input" />
            </div>

            <div class="filter-group">
              <label class="checkbox"><input type="checkbox" v-model="onlyRecommended" /> <span>Nur Empfehlungen</span></label>
              <label class="checkbox"><input type="checkbox" v-model="onlyPromo" /> <span>Neukundenaktion</span></label>
              <label class="checkbox"><input type="checkbox" v-model="onlyMonthlyPayout" /> <span>Monatliche Zinszahlung</span></label>
              <label class="checkbox"><input type="checkbox" v-model="dgsOnly" /> <span>EU-Einlagensicherung</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Land</h3>
              <select v-model="countryFilter" class="filter-select">
                <option value="alle">alle</option>
                <option value="DE">Deutschland</option>
                <option value="ES">Spanien</option>
                <option value="FR">Frankreich</option>
                <option value="SE">Schweden</option>
                <option value="CZ">Tschechien</option>
                <option value="MT">Malta</option>
                <option value="EU">EU/Plattform</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Content -->
        <main class="content" style="min-width: 0;">
          <h1 class="section-title text-2xl md:text-3xl mb-1">Tagesgeld im Vergleich</h1>
          <p class="last-updated">zuletzt aktualisiert am 1. November 2025</p>

          <div class="offers-section">
            <div 
              v-for="o in filtered" 
              :key="o.slug" 
              class="offer-card surface-card border-round-xl card-accent"
              @click="router.push(`/tagesgeld/${o.slug}`)"
            >
              <div class="offer-content">
                <div class="card-image-container">
                  <img 
                    :src="o.image || '/images/saifin_logo_vectorized_final.svg'" 
                    :alt="`${o.title} – Logo/Bild`" 
                    :class="['card-image', o.slug]" 
                    loading="lazy" 
                    decoding="async" 
                    width="120" 
                    height="75" 
                    :srcset="`${o.image || '/images/saifin_logo_vectorized_final.svg'} 120w, ${o.image || '/images/saifin_logo_vectorized_final.svg'} 240w`" 
                    sizes="(max-width: 768px) 200px, 120px"
                  />
                </div>
                <div class="offer-details">
                  <div class="offer-header">
                    <h3 class="offer-title">{{ o.title }}</h3>
                  </div>
                  <div class="features-list">
                    <div class="feature-item"><i class="pi pi-check"></i><span>{{ o.interest }}</span></div>
                    <div v-if="o.payout" class="feature-item"><i class="pi pi-check"></i><span>Zinszahlung: {{ o.payout }}</span></div>
                    <div v-if="o.depositMin" class="feature-item"><i class="pi pi-check"></i><span>Mindestanlage: {{ o.depositMin }}</span></div>
                    <div v-if="o.depositMax" class="feature-item"><i class="pi pi-check"></i><span>Maximalanlage: {{ o.depositMax }}</span></div>
                    <div v-if="o.security" class="feature-item"><i class="pi pi-shield"></i><span>{{ o.security }}</span></div>
                    <div v-for="(h, idx) in (o.highlights || []).slice(0, 2)" :key="idx" class="feature-item">
                      <i class="pi pi-check"></i><span>{{ h }}</span>
                    </div>
                  </div>
                  <div class="action-buttons">
                    <button 
                      class="p-button apply-cta" 
                      @click.stop="goToApply(o)"
                      @mouseenter="o.applyUrl && /^https?:\/\//i.test(o.applyUrl) ? preloadAffiliateLink(o.applyUrl) : null"
                    >
                      <span class="p-button-label">Zum Antrag</span>
                    </button>
                    <router-link :to="`/tagesgeld/${o.slug}`" class="expand-btn">Details <i class="pi pi-chevron-right"></i></router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            <h2 class="section-title text-xl mb-3">Finde dein Tagesgeld</h2>

            <div class="filter-group">
              <h3 class="filter-title">Suche</h3>
              <input v-model="search" placeholder="Name, Zins, Einlagensicherung" class="filter-input" />
            </div>

            <div class="filter-group">
              <label class="checkbox"><input type="checkbox" v-model="onlyRecommended" /> <span>Nur Empfehlungen</span></label>
              <label class="checkbox"><input type="checkbox" v-model="onlyPromo" /> <span>Neukundenaktion</span></label>
              <label class="checkbox"><input type="checkbox" v-model="onlyMonthlyPayout" /> <span>Monatliche Zinszahlung</span></label>
              <label class="checkbox"><input type="checkbox" v-model="dgsOnly" /> <span>EU-Einlagensicherung</span></label>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Land</h3>
              <select v-model="countryFilter" class="filter-select">
                <option value="alle">alle</option>
                <option value="DE">Deutschland</option>
                <option value="ES">Spanien</option>
                <option value="FR">Frankreich</option>
                <option value="SE">Schweden</option>
                <option value="CZ">Tschechien</option>
                <option value="MT">Malta</option>
                <option value="EU">EU/Plattform</option>
              </select>
            </div>
          </div>
        </main>
      </div>

      <!-- Volle Breite: Ranking-Faktoren & Guide & FAQ -->
      <div class="container">
        <!-- Ranking-Faktoren -->
        <details class="ranking-factors-section">
          <summary class="ranking-factors-summary">
            <div class="section-eyebrow">Transparenz</div>
            <h2 class="section-title">Ranking-Faktoren</h2>
          </summary>
          <div class="ranking-factors-content">
            <p class="ranking-factors-intro">
              Unser Tagesgeld-Ranking basiert auf einer objektiven Bewertung mehrerer Kriterien. Die Reihenfolge der angezeigten Tagesgeldkonten spiegelt die Gesamtbewertung wider, wobei verschiedene Faktoren unterschiedlich gewichtet werden.
            </p>
            <div class="ranking-factors-grid">
              <div class="surface-card border-round-lg p-3 card-accent ranking-factor-card">
                <h3 class="ranking-factor-title">1. Sicherheit & Regulierung (Gewichtung: 35%)</h3>
                <p class="ranking-factor-description">
                  Die Einlagensicherung, regulatorische Aufsicht und die Stabilität des Anbieters sind die wichtigsten Faktoren für unser Ranking.
                </p>
                <ul class="ranking-factor-list">
                  <li>EU-Einlagensicherung bis 100.000 €</li>
                  <li>Regulatorische Aufsicht (BaFin, etc.)</li>
                  <li>Reputation und Stabilität der Bank</li>
                  <li>Zusätzliche Sicherungsfonds (z.B. BdB-Fonds)</li>
                  <li>Deutsche vs. ausländische Einlagensicherung</li>
                </ul>
              </div>
              <div class="surface-card border-round-lg p-3 card-accent ranking-factor-card">
                <h3 class="ranking-factor-title">2. Zinssatz & Zinsgarantie (Gewichtung: 30%)</h3>
                <p class="ranking-factor-description">
                  Der aktuelle Zinssatz wird bewertet, wobei langfristige Bestandszinsen und Stabilität wichtiger sind als kurzfristige Neukundenaktionen.
                </p>
                <ul class="ranking-factor-list">
                  <li>Langfristiger Bestandszins (nach Aktion)</li>
                  <li>Zinsgarantie-Dauer und Variabilität</li>
                  <li>Neukundenaktionen und Bonuszinsen</li>
                  <li>Nachhaltigkeit der Zinssätze</li>
                </ul>
              </div>
              <div class="surface-card border-round-lg p-3 card-accent ranking-factor-card">
                <h3 class="ranking-factor-title">3. Flexibilität & Verfügbarkeit (Gewichtung: 20%)</h3>
                <p class="ranking-factor-description">
                  Bewertet werden Mindest-/Maximalanlagen, Zinszahlungsfrequenz und Verfügbarkeit des Geldes.
                </p>
                <ul class="ranking-factor-list">
                  <li>Mindestanlage (niedrig = besser)</li>
                  <li>Maximalanlage oder unbegrenzt</li>
                  <li>Zinszahlungsfrequenz (monatlich bevorzugt)</li>
                  <li>Tägliche Verfügbarkeit</li>
                </ul>
              </div>
              <div class="surface-card border-round-lg p-3 card-accent ranking-factor-card">
                <h3 class="ranking-factor-title">4. Kosten (Gewichtung: 10%)</h3>
                <p class="ranking-factor-description">
                  Kontoführungsgebühren und eventuelle versteckte Kosten werden bewertet.
                </p>
                <ul class="ranking-factor-list">
                  <li>Kostenlose Kontoführung (bevorzugt)</li>
                  <li>Keine versteckten Gebühren</li>
                  <li>Kosten für Ein- und Auszahlungen</li>
                </ul>
              </div>
              <div class="surface-card border-round-lg p-3 card-accent ranking-factor-card">
                <h3 class="ranking-factor-title">5. Service & Zugang (Gewichtung: 5%)</h3>
                <p class="ranking-factor-description">
                  Die Benutzerfreundlichkeit, Online-Verfügbarkeit und Servicequalität werden bewertet.
                </p>
                <ul class="ranking-factor-list">
                  <li>Online-Verfügbarkeit und App-Qualität</li>
                  <li>Kundenservice und Erreichbarkeit</li>
                  <li>Geschwindigkeit der Kontoeröffnung</li>
                  <li>Zusätzliche Services oder Produkte</li>
                </ul>
              </div>
            </div>
            <div class="ranking-factors-note">
              <p><strong>Hinweis:</strong> Das Ranking wird regelmäßig aktualisiert und kann sich aufgrund von Zinsänderungen, neuen Anbietern oder Produktänderungen verschieben. Ein höheres Ranking bedeutet nicht zwangsläufig, dass ein Tagesgeldkonto für jeden Nutzer das beste ist – bitte prüfe die einzelnen Konditionen auf Übereinstimmung mit deinem persönlichen Anlageprofil.</p>
            </div>
          </div>
        </details>
        
        <details class="guide-section">
          <summary class="guide-summary">
            <div class="section-eyebrow">Ratgeber</div>
            <h2 class="section-title">Wissenswertes zum Tagesgeld</h2>
          </summary>
          <div class="guide-content">
            <div class="guide-grid">
              <div class="surface-card border-round-lg p-3 card-accent info-card">
                <h3 class="guide-title">Vorteile</h3>
                <ul>
                  <li>Jederzeit verfügbar</li>
                  <li>Gesetzliche Einlagensicherung bis 100.000 €</li>
                  <li>Oft Sonderzinsen für Neukunden</li>
                </ul>
              </div>
              <div class="surface-card border-round-lg p-3 card-accent info-card">
                <h3 class="guide-title">Worauf achten</h3>
                <ul>
                  <li>Zinsgarantie-Dauer</li>
                  <li>Neukunden- vs. Bestandskundenzins</li>
                  <li>Kombinationsangebote (z. B. mit Depot)</li>
                </ul>
              </div>
            </div>
            <div class="faq">
              <details>
                <summary>Was bedeutet Zinsgarantie?</summary>
                <div class="text-700 p-2">Ein fester Zinssatz für eine definierte Zeitspanne – unabhängig von Marktschwankungen.</div>
              </details>
              <details>
                <summary>Ist mein Geld sicher?</summary>
                <div class="text-700 p-2">Guthaben sind bis 100.000 € pro Kunde und Bank gesetzlich abgesichert.</div>
              </details>
              <details>
                <summary>Wie schnell komme ich an mein Geld?</summary>
                <div class="text-700 p-2">Täglich – Überweisungen dauern i. d. R. 1 Bankarbeitstag.</div>
              </details>
            </div>
          </div>
        </details>
      </div>
    </section>
  </div>
</template>

<style scoped>
.savings-page { background: var(--surface-muted); min-height: 100vh; }
.layout { 
  display: grid; 
  grid-template-columns: 320px 1fr; 
  gap: 24px; 
  /* Safari-Kompatibilität */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
.sidebar { position: relative; }
.sidebar-card { position: sticky; top: 86px; }
.content { min-width: 0; padding-top: 0; }

.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-title { font-size: 0.875rem; font-weight: 600; color: var(--text); margin: 0; }
.filter-input { padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text); font-size: 0.875rem; }
.filter-select { padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text); font-size: 0.875rem; }
.checkbox { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text); }

.last-updated {
  font-size: 0.75rem;
  color: var(--muted-text);
  margin: 0.25rem 0 0.5rem 0;
  font-weight: 400;
}

.offers-section { margin-bottom: 3rem; }
.offer-card { margin-bottom: 1.5rem; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.offer-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px var(--shadow-color); }
.offer-content { display: flex; padding: 1.5rem; gap: 1.5rem; }
.card-image-container { 
  flex-shrink: 0; 
  width: 120px; 
  height: 75px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: #fff; 
  border: 1px solid var(--border); 
  border-radius: 0.75rem; 
  overflow: hidden; 
  /* Safari-Kompatibilität */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
.card-image { width: 100%; height: 100%; object-fit: cover; background: transparent; padding: 0; border-radius: 0.75rem; border: none; }

/* Alle Tagesgeld-Logos optimiert für Rahmenausfüllung */
.card-image.pbb-direkt { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.35);
  padding: 2px;
}

.card-image.tf-bank { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.3);
  padding: 3px;
}

.card-image.distingo-bank { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.35);
  padding: 2px;
}

.card-image.raisin { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.4);
  padding: 1px;
}

.card-image.jt-direktbank { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.35);
  padding: 2px;
}

.card-image.santander-consumer-bank { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.35);
  padding: 2px;
}

.card-image.\31 822-direkt { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.25);
  padding: 4px;
}

.card-image.quirion { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.05);
  padding: 8px;
}

.card-image.comdirect { 
  object-fit: contain; 
  background: #fff; 
  transform: scale(1.1);
  padding: 8px;
}
.offer-details { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; }
.offer-title { font-size: 1.125rem; font-weight: 700; color: var(--text); margin: 0; }
.features-list { display: flex; flex-direction: column; gap: 0.5rem; }
.feature-item { display: flex; align-items: center; gap: 0.5rem; color: var(--muted-text); font-size: 0.875rem; }
.feature-item i { color: #34d399; font-size: 0.75rem; }
.action-buttons { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.expand-btn { display: flex; align-items: center; gap: 0.25rem; background: none; border: none; color: var(--subtle-text); font-size: 0.875rem; cursor: pointer; padding: 0.5rem; }

/* Ranking-Faktoren Sektion */
.ranking-factors-section { 
  margin-top: 2rem; 
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: 0.75rem; 
  padding: 1rem 1.5rem;
  content-visibility: auto; 
  contain-intrinsic-size: 100px;
}
.ranking-factors-section summary { 
  cursor: pointer; 
  list-style: none; 
  outline: none;
}
.ranking-factors-section summary::-webkit-details-marker { 
  display: none; 
}
.ranking-factors-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  padding-right: 1.5rem;
}
.ranking-factors-summary .section-title {
  font-weight: 500 !important;
  font-size: 1.25rem !important;
}
.ranking-factors-summary::after {
  content: '▼';
  font-size: 0.75rem;
  color: var(--muted-text);
  transition: transform 0.2s ease;
  position: absolute;
  right: 0;
  top: 0.5rem;
}
.ranking-factors-section[open] .ranking-factors-summary::after {
  transform: rotate(180deg);
}
.ranking-factors-content {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.ranking-factors-intro {
  color: var(--muted-text);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.ranking-factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.ranking-factor-card {
  box-shadow: 0 10px 20px rgba(6, 42, 63, 0.06);
}
.ranking-factor-title {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: .02em;
  text-transform: uppercase;
  color: var(--subtle-text);
  margin: 0 0 0.5rem;
}
.ranking-factor-description {
  color: var(--muted-text);
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 0.875rem;
}
.ranking-factor-list {
  margin: 0.75rem 0 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--muted-text);
  font-size: 0.875rem;
  line-height: 1.5;
}
.ranking-factor-list li {
  list-style-type: disc;
}
.ranking-factors-note {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--muted-text);
  line-height: 1.6;
}

.guide-section { 
  margin-top: 2rem; 
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: 0.75rem; 
  padding: 1rem 1.5rem;
  content-visibility: auto; 
  contain-intrinsic-size: 100px;
}
.guide-section summary { 
  cursor: pointer; 
  list-style: none; 
  outline: none;
}
.guide-section summary::-webkit-details-marker { 
  display: none; 
}
.guide-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  padding-right: 1.5rem;
}
.guide-summary .section-title {
  font-weight: 500 !important;
  font-size: 1.25rem !important;
}
.guide-summary::after {
  content: '▼';
  font-size: 0.75rem;
  color: var(--muted-text);
  transition: transform 0.2s ease;
  position: absolute;
  right: 0;
  top: 0.5rem;
}
.guide-section[open] .guide-summary::after {
  transform: rotate(180deg);
}
.guide-content {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin: 12px 0; }
.guide-title { font-size: .9rem; text-transform: uppercase; letter-spacing: .1em; color: var(--subtle-text); margin: 0 0 6px; }

/* Offscreen-Content schneller rendern, ohne Layoutsprünge zu verursachen */
.faq {
  content-visibility: auto;
  contain-intrinsic-size: 500px;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar-card { position: static; }
  
  .content h1 {
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 0.125rem !important;
    font-size: 1.5rem !important;
    line-height: 1.2 !important;
  }
  
  .last-updated {
    margin: 0.0625rem 0 0.25rem 0;
    font-size: 0.7rem !important;
  }
  
  .offer-content { flex-direction: column; gap: 1rem; }
  .card-image-container { width: 100%; max-width: 200px; margin: 0 auto; }
  .card-image {
    /* Volle Opacity für klare Farben auf mobilen Geräten */
    opacity: 1 !important;
  }
  .action-buttons { flex-direction: column; align-items: stretch; }
  .mobile-filter-toggle { display: flex; justify-content: center; margin: 12px 0; }
  .mobile-filter-toggle .p-button { width: 100%; max-width: 300px; }
  .mobile-filter-panel { margin-bottom: 16px; }
}

@media (min-width: 769px) {
  .mobile-filter-toggle, .mobile-filter-panel { display: none; }
}
</style>



