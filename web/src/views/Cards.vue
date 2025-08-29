<script setup>
import { offers } from '../data/offers'
import { useRouter } from 'vue-router'
import CreditCardComparison from '../components/CreditCardComparison.vue'

const router = useRouter()
const goDetail = (slug) => router.push(`/kreditkarten/${slug}`)
const goApply = (slug) => router.push(`/antrag/${slug}`)
</script>

<template>
  <div class="p-3 md:p-6">
    <h2 class="text-2xl md:text-3xl mb-6 text-center">Kreditkarten-Vergleich</h2>
    
    <!-- Nur die detaillierte Vergleichstabelle -->
    <CreditCardComparison />
  </div>
</template>

<style scoped>
/* Keine spezifischen Styles hier, da die Darstellung in CreditCardComparison.vue erfolgt */
</style>
