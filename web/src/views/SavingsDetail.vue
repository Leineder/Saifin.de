<script setup>
import { useRoute, useRouter } from 'vue-router'
import { savingsOffers } from '../data/savings'

const route = useRoute()
const router = useRouter()
const offer = savingsOffers.find(o => o.slug === route.params.slug)
if (!offer) router.replace('/tagesgeld')

const goBack = () => router.push('/tagesgeld')
const goApply = () => {
  if (!offer?.applyUrl) return
  const url = offer.applyUrl
  if (/^https?:\/\//i.test(url)) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    router.push(url)
  }
}
</script>

<template>
  <div v-if="offer" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <div class="logo-frame">
          <img :src="offer.image || '/images/saifin_logo_vectorized_final.svg'" :alt="`${offer.title} – Bild`" class="detail-logo" loading="lazy" />
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

.logo-frame { width: 100%; height: 240px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
.logo-frame img { width: 100%; height: 100%; object-fit: contain; display: block; background: #fff; }
</style>


