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
  <div v-if="offer" class="p-3 md:p-6 grid">
    <div class="col-12 md:col-6">
      <img :src="offer.image" class="w-full border-round-lg shadow-2" style="max-height:350px;object-fit:cover">
    </div>
    <div class="col-12 md:col-6">
      <h1 class="text-3xl mb-2">{{ offer.title }}</h1>
      <ul class="pl-3 mb-3">
        <li v-for="b in offer.bullets" :key="b" class="text-700">{{ b }}</li>
      </ul>
      <div class="mb-3">
        <p class="text-700"><strong>Jahresgebühr:</strong> {{ offer.annualFee }} €</p>
        <p class="text-700"><strong>Zinsfreie Phase:</strong> bis {{ offer.graceWeeks }} Wochen</p>
        <p class="text-700"><strong>Fremdwährungsgebühr:</strong> {{ offer.foreignFee }}</p>
      </div>
      <p class="text-600 text-sm mb-4">{{ offer.disclaimer }}</p>

      <!-- CTA-Zeile -->
      <div class="cta-row">
        <button class="p-button p-component p-button-outlined w-full md:w-auto" @click="goBack">
          <span class="p-button-label">Zur Übersicht</span>
        </button>
        <button class="p-button p-component w-full md:w-auto" @click="goApply">
          <span class="p-button-label">Jetzt beantragen</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cta-row { display: flex; gap: 8px; }
@media (max-width: 767px) {
  .cta-row { flex-direction: column; }
}
@media (max-width: 767px) {
  h1 { font-size: 1.6rem; }
}
</style>
