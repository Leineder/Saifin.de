<script setup>
import { ref } from 'vue'
import { offers } from '../data/offers'
import { useRouter } from 'vue-router'
import CreditCardComparison from '../components/CreditCardComparison.vue'

const router = useRouter()
const activeTab = ref('cards') // 'cards' oder 'comparison'

const goDetail = (slug) => router.push(`/kreditkarten/${slug}`)
const goApply = (slug) => router.push(`/antrag/${slug}`)
const infoLine = (o) => `${o.annualFee} € Jahresgebühr • bis ${o.graceWeeks} Wochen zinsfrei`
</script>

<template>
  <div class="p-3 md:p-6">
    <h2 class="text-2xl mb-3 md:mb-4 text-center">Kreditkarten-Vergleich</h2>
    
    <!-- Tab-Navigation -->
    <div class="flex justify-center mb-6">
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button 
          @click="activeTab = 'cards'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'cards' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Karten-Übersicht
        </button>
        <button 
          @click="activeTab = 'comparison'"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'comparison' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Detaillierter Vergleich
        </button>
      </div>
    </div>

    <!-- Karten-Übersicht -->
    <div v-if="activeTab === 'cards'">
      <div class="grid">
        <div v-for="o in offers" :key="o.id" class="col-12 sm:col-6 lg:col-4">
          <div class="card-item surface-card border-round-lg overflow-hidden h-full transition-all transition-duration-200">
            <div class="ratio-box">
              <img :src="o.image" alt="" class="ratio-img" />
            </div>
            <div class="p-3 flex flex-column flex-1">
              <div class="flex-1">
                <h3 class="text-xl mb-2 text-900">{{ o.title }}</h3>
                <ul class="mt-0 mb-2 pl-3">
                  <li v-for="b in o.bullets.slice(0, 3)" :key="b" class="text-700">{{ b }}</li>
                </ul>
                <p class="text-600 text-sm mb-0">{{ infoLine(o) }}</p>
              </div>
            </div>
            <!-- CTA-Leiste -->
            <div class="card-cta">
              <div class="cta-row">
                <button class="p-button p-component p-button-outlined cta-btn cta-left" @click="goDetail(o.slug)">
                  <span class="p-button-label">Details</span>
                </button>
                <button class="p-button p-component cta-btn cta-right" @click="goApply(o.slug)">
                  <span class="p-button-label">Beantragen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detaillierter Vergleich -->
    <div v-if="activeTab === 'comparison'">
      <CreditCardComparison />
    </div>
  </div>
</template>

<style scoped>
/* Karte: einheitliche Höhe und Hover-Effekt */
.card-item {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.card-item:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

/* Bild mit festem Seitenverhältnis */
.ratio-box { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #f5f5f5; }
.ratio-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

/* CTA-Leiste fix am unteren Rand der Karte */
.card-cta {
  margin-top: auto;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 10px 12px;
}
.cta-row { display: flex; align-items: center; gap: 8px; }

/* Desktop: links/rechts auf einer Zeile */
.cta-left { flex: 1; }
.cta-right { flex: 1; }

/* Einheitliche Button-Höhe */
.cta-btn { width: 100%; height: 42px; }

/* Mobile: übereinander, volle Breite */
@media (max-width: 767px) {
  .cta-row { flex-direction: column; }
}
</style>
