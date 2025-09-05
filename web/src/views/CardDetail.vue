<script setup>
import { useRoute, useRouter } from 'vue-router'
import { offers } from '../data/offers'
const route = useRoute()
const router = useRouter()
const offer = offers.find(o => o.slug === route.params.slug)
if (!offer) router.replace('/kreditkarten')

const goBack = () => router.push('/kreditkarten')
const goApply = () => router.push(`/antrag/${offer.slug}`)
</script>

<template>
  <div v-if="offer" class="detail-page section">
    <div class="container detail-grid">
      <div class="media">
        <img :src="offer.image" class="w-full border-round-lg shadow-2" style="max-height:360px;object-fit:cover">
      </div>
      <div class="content">
        <div class="section-eyebrow">Kreditkarte</div>
        <h1 class="section-title text-3xl mb-2">{{ offer.title }}</h1>
        <ul class="pl-3 mb-3">
          <li v-for="b in offer.bullets" :key="b" class="text-700">{{ b }}</li>
        </ul>
        <div class="facts mb-3 surface-card border-round-lg p-3 card-accent">
          <p class="text-700"><strong>Jahresgebühr:</strong> {{ offer.annualFee }} €</p>
          <p class="text-700"><strong>Zinsfreie Phase:</strong> bis {{ offer.graceWeeks }} Wochen</p>
          <p class="text-700"><strong>Fremdwährungsgebühr:</strong> {{ offer.foreignFee }}</p>
        </div>
        <p class="text-600 text-sm mb-4">{{ offer.disclaimer }}</p>

        <div class="cta-col">
          <button class="p-button p-component p-button-outlined w-full" @click="goBack">
            <span class="p-button-label">Zur Übersicht</span>
          </button>
          <button class="p-button p-component w-full" @click="goApply">
            <span class="p-button-label">Jetzt beantragen</span>
          </button>
        </div>
      </div>
      <aside class="sticky-cta">
        <div class="surface-card border-round-lg p-3 card-accent">
          <h3 class="m-0 mb-2 section-title text-lg">Direkt beantragen</h3>
          <p class="m-0 text-700 mb-2">Schnell und sicher zum Antrag.</p>
          <button class="p-button w-full" @click="goApply"><span class="p-button-label">Jetzt beantragen</span></button>
        </div>
      </aside>
    </div>
  </div>
  
</template>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1.2fr 1fr 320px; gap: 24px; }
.media { grid-column: 1 / 2; }
.content { grid-column: 2 / 3; }
.sticky-cta { grid-column: 3 / 4; position: sticky; top: 86px; align-self: start; }
.cta-col { display: grid; grid-template-columns: 1fr; gap: 10px; }

@media (max-width: 1100px) {
  .detail-grid { grid-template-columns: 1fr 1fr; }
  .sticky-cta { grid-column: 1 / -1; position: static; }
}
@media (max-width: 767px) {
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
