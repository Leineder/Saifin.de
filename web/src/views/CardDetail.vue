<script setup>
import { useRoute, useRouter } from 'vue-router'
import { offers } from '../data/offers'
const route = useRoute()
const router = useRouter()
const offer = offers.find(o => o.slug === route.params.slug)
if (!offer) router.replace('/kreditkarten')

const goBack = () => router.push('/kreditkarten')
const goApply = () => {
  if (offer?.applyUrl) {
    const url = offer.applyUrl
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    return router.push(url)
  }
  router.push(`/antrag/${offer.slug}`)
}
const formatEuro = (n) => {
  if (n === 0) return '0,00 €'
  if (typeof n === 'number') return `${n.toFixed(2).replace('.', ',')} €`
  return n
}
</script>

<template>
  <div v-if="offer" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div class="card-image-container">
          <img :src="offer.image" :alt="`${offer.title} – Kartenmotiv`" class="card-image" loading="lazy" decoding="async">
        </div>
      </div>
      <div class="content">
        <div class="section-eyebrow">Kreditkarte</div>
        <h1 class="section-title text-3xl mb-2">{{ offer.title }}</h1>
        <div class="bullets surface-card border-round-lg p-3 card-accent mb-3">
          <ul class="pl-3 m-0">
            <li v-for="b in offer.bullets" :key="b" class="text-700">{{ b }}</li>
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
          <button class="p-button p-component w-full apply-cta" @click="goApply">
            <span class="p-button-label">Jetzt beantragen</span>
          </button>
        </div>
      </div>
      <aside class="sticky-cta">
        <div class="surface-card border-round-lg p-3 card-accent">
          <h3 class="m-0 mb-2 section-title text-lg">Direkt beantragen</h3>
          <p class="m-0 text-700 mb-2">Schnell und sicher zum Antrag.</p>
          <button class="p-button w-full apply-cta" @click="goApply"><span class="p-button-label">Jetzt beantragen</span></button>
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
  min-height: 500px; 
  max-height: 800px;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: #fff; 
  border-radius: 8px; 
  border: 1px solid #e0e0e0; 
  padding: 30px;
  box-sizing: border-box;
  overflow: visible;
}
.card-image { 
  max-width: 100%; 
  max-height: 100%; 
  width: auto; 
  height: auto; 
  object-fit: contain; 
  display: block;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  .card-image-container { min-height: 400px; max-height: 600px; padding: 20px; }
}
@media (max-width: 767px) {
  .detail-grid { grid-template-columns: 1fr; }
  .card-image-container { min-height: 350px; max-height: 500px; padding: 15px; }
}
</style>
