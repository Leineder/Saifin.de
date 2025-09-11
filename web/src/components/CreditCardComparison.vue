<template>
  <div class="credit-card-comparison">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="card in offers"
        :key="card.id"
        class="card-item bg-white rounded-lg shadow-md overflow-hidden relative border border-gray-200"
      >
        <!-- Testsieger Badge -->
        <div v-if="card.isTestsieger" class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div class="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
            <span class="mr-1">🏆</span>
            Testsieger
          </div>
        </div>

        <!-- Bewertung Badge -->
        <div class="absolute top-3 right-3 z-10">
          <div class="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <span class="text-yellow-600 font-bold mr-1">★</span>
            <span class="text-gray-800 font-semibold text-sm">{{ card.rating }}/5</span>
          </div>
        </div>

        <!-- Kartenbild und Infos -->
        <div class="flex p-5">
          <!-- Kartenbild links (sehr klein, nur 10% der Breite) -->
          <div class="flex-shrink-0 card-image pr-3">
            <div class="relative cursor-pointer" @click="goDetail(card.slug)">
              <img 
                :src="card.image" 
                :alt="card.title" 
                class="w-full card-image-height object-cover rounded shadow-sm"
              />
              <!-- Karten-Typ Badge -->
              <div class="absolute bottom-0 right-0 bg-white bg-opacity-90 px-1 py-0.5 rounded text-xs font-semibold text-gray-700">
                {{ card.cardType }}
              </div>
            </div>
          </div>

          <!-- Infos rechts (90% der Breite) -->
          <div class="flex-grow card-content">
            <!-- Kartenname -->
            <h3 class="text-xl font-bold text-gray-900 mb-3 leading-tight cursor-pointer" @click="goDetail(card.slug)">{{ card.title }}</h3>
            
            <!-- Hauptfeatures -->
            <div class="space-y-2 mb-4">
              <div v-for="bullet in card.bullets.slice(0, 3)" :key="bullet" class="flex items-start">
                <div class="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-green-600 text-sm">✓</span>
                </div>
                <span class="text-gray-700 text-sm">{{ bullet }}</span>
              </div>
              
              <!-- Negative Bedingung (falls vorhanden) -->
              <div v-if="card.specialConditions && card.specialConditions.schufaCheck === 'Ablehnung bei SCHUFA-Einträgen'" class="flex items-start">
                <div class="flex-shrink-0 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-red-600 text-sm">✗</span>
                </div>
                <span class="text-red-600 text-sm">Ablehnung bei SCHUFA-Einträgen</span>
              </div>
            </div>

            <!-- Wichtige Details -->
            <div class="grid grid-cols-2 gap-3 text-sm mb-4">
              <!-- Jahresgebühr -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="font-semibold text-gray-900 mb-1">Jahresgebühr</div>
                <div v-if="card.annualFee === 0" class="text-green-600 font-bold text-lg">0 €</div>
                <div v-else-if="typeof card.annualFee === 'number'" class="text-gray-900 font-bold text-lg">{{ card.annualFee }} €</div>
                <div v-else class="text-gray-600">{{ card.annualFee }}</div>
              </div>

              <!-- Auslandsgebühren -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="font-semibold text-gray-900 mb-1">Auslandsgebühren</div>
                <div v-if="card.foreignFee === '0%'" class="text-green-600 font-bold text-lg">0%</div>
                <div v-else class="text-gray-700">{{ card.foreignFee }}</div>
              </div>
            </div>

            <!-- Spezielle Features -->
            <div v-if="card.features" class="mb-4 space-y-2">
              <div v-if="card.features.cashback" class="flex items-center text-green-600 text-sm">
                <span class="mr-2">💰</span>
                <span>{{ card.features.cashback }}</span>
              </div>
              <div v-if="card.features.travelCredit" class="flex items-center text-blue-600 text-sm">
                <span class="mr-2">✈️</span>
                <span>{{ card.features.travelCredit }}</span>
              </div>
              <div v-if="card.features.insurance" class="flex items-center text-purple-600 text-sm">
                <span class="mr-2">🛡️</span>
                <span>{{ card.features.insurance }}</span>
              </div>
              <div v-if="card.specialConditions && card.specialConditions.sustainable" class="flex items-center text-green-600 text-sm">
                <span class="mr-2">🌱</span>
                <span>{{ card.specialConditions.sustainable }}</span>
              </div>
            </div>

            <!-- Mobile Payment Logos -->
            <div v-if="card.features && card.features.mobilePay && card.features.mobilePay.length > 0" class="flex items-center mb-4">
              <span class="text-sm text-gray-600 mr-3">Mobile Payment:</span>
              <div class="flex space-x-2">
                <div v-if="card.features.mobilePay.includes('Apple Pay')" class="bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                  Apple Pay
                </div>
                <div v-if="card.features.mobilePay.includes('Google Pay')" class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  Google Pay
                </div>
              </div>
            </div>

            <!-- Call to Action -->
            <button 
              @click="goApply(card.slug)"
              class="w-full p-button apply-cta font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <span>ZUM ANTRAG</span>
              <span class="ml-2">→</span>
            </button>
            <button 
              @click="goDetail(card.slug)"
              class="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <span>DETAILS</span>
              <span class="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { offers } from '../data/offers'
import { useRouter } from 'vue-router'

const router = useRouter()

function goApply(slug) {
  router.push(`/antrag/${slug}`)
}

function goDetail(slug) {
  router.push(`/kreditkarten/${slug}`)
}
</script>

<style scoped>
.credit-card-comparison {
  max-width: 1400px;
  margin: 0 auto;
}

.card-item {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-image {
  width: 10%;
  min-width: 60px;
}

.card-content {
  width: 90%;
}

.card-image-height {
  height: 120px; /* 2.5x größer als h-12 (48px) = 120px */
}

@media (max-width: 1024px) {
  .card-item {
    margin-bottom: 1.5rem;
  }
}
</style>
