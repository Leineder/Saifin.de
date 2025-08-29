<template>
  <div class="credit-card-comparison">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="card in offers"
        :key="card.id"
        class="card-item bg-white rounded-lg shadow-md overflow-hidden relative border border-gray-200"
      >
        <!-- Testsieger Badge -->
        <div v-if="card.isTestsieger" class="absolute top-2 left-2 z-10">
          <div class="bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
            <span class="mr-1">🏆</span>
            Testsieger
          </div>
        </div>

        <!-- Bewertung Badge -->
        <div class="absolute top-2 right-2 z-10">
          <div class="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <span class="text-yellow-600 font-bold mr-1 text-xs">★</span>
            <span class="text-gray-800 font-semibold text-xs">{{ card.rating }}/5</span>
          </div>
        </div>

        <!-- Kartenbild und Infos -->
        <div class="flex p-4">
          <!-- Kartenbild links -->
          <div class="flex-shrink-0 w-1/3 pr-3">
            <div class="relative">
              <img 
                :src="card.image" 
                :alt="card.title" 
                class="w-full h-24 object-cover rounded-md shadow-sm"
              />
              <!-- Karten-Typ Badge -->
              <div class="absolute bottom-1 left-1 bg-white bg-opacity-90 px-1 py-0.5 rounded text-xs font-semibold text-gray-700">
                {{ card.cardType }}
              </div>
            </div>
          </div>

          <!-- Infos rechts -->
          <div class="flex-grow w-2/3">
            <!-- Kartenname -->
            <h3 class="text-lg font-bold text-gray-900 mb-2 leading-tight">{{ card.title }}</h3>
            
            <!-- Hauptfeatures -->
            <div class="space-y-1 mb-3">
              <div v-for="bullet in card.bullets.slice(0, 2)" :key="bullet" class="flex items-start">
                <div class="flex-shrink-0 w-3 h-3 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-green-600 text-xs">✓</span>
                </div>
                <span class="text-gray-700 text-sm">{{ bullet }}</span>
              </div>
              
              <!-- Negative Bedingung (falls vorhanden) -->
              <div v-if="card.specialConditions && card.specialConditions.schufaCheck === 'Ablehnung bei SCHUFA-Einträgen'" class="flex items-start">
                <div class="flex-shrink-0 w-3 h-3 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                  <span class="text-red-600 text-xs">✗</span>
                </div>
                <span class="text-red-600 text-sm">Ablehnung bei SCHUFA-Einträgen</span>
              </div>
            </div>

            <!-- Wichtige Details -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-3">
              <!-- Jahresgebühr -->
              <div class="bg-gray-50 p-2 rounded">
                <div class="font-semibold text-gray-900 mb-1">Jahresgebühr</div>
                <div v-if="card.annualFee === 0" class="text-green-600 font-bold">0 €</div>
                <div v-else-if="typeof card.annualFee === 'number'" class="text-gray-900 font-bold">{{ card.annualFee }} €</div>
                <div v-else class="text-gray-600">{{ card.annualFee }}</div>
              </div>

              <!-- Auslandsgebühren -->
              <div class="bg-gray-50 p-2 rounded">
                <div class="font-semibold text-gray-900 mb-1">Ausland</div>
                <div v-if="card.foreignFee === '0%'" class="text-green-600 font-bold">0%</div>
                <div v-else class="text-gray-700">{{ card.foreignFee }}</div>
              </div>
            </div>

            <!-- Spezielle Features (falls vorhanden) -->
            <div v-if="card.features" class="mb-3">
              <div v-if="card.features.cashback" class="flex items-center text-green-600 text-xs mb-1">
                <span class="mr-1">💰</span>
                <span>{{ card.features.cashback }}</span>
              </div>
              <div v-if="card.features.insurance" class="flex items-center text-purple-600 text-xs mb-1">
                <span class="mr-1">🛡️</span>
                <span>{{ card.features.insurance }}</span>
              </div>
              <div v-if="card.specialConditions && card.specialConditions.sustainable" class="flex items-center text-green-600 text-xs">
                <span class="mr-1">🌱</span>
                <span>{{ card.specialConditions.sustainable }}</span>
              </div>
            </div>

            <!-- Mobile Payment Logos -->
            <div v-if="card.features && card.features.mobilePay && card.features.mobilePay.length > 0" class="flex items-center mb-3">
              <div class="flex space-x-1">
                <div v-if="card.features.mobilePay.includes('Apple Pay')" class="bg-black text-white px-1 py-0.5 rounded text-xs font-semibold">
                  Apple
                </div>
                <div v-if="card.features.mobilePay.includes('Google Pay')" class="bg-blue-600 text-white px-1 py-0.5 rounded text-xs font-semibold">
                  Google
                </div>
              </div>
            </div>

            <!-- Call to Action -->
            <button 
              @click="goApply(card.slug)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200 flex items-center justify-center"
            >
              <span>ZUM ANTRAG</span>
              <span class="ml-1">→</span>
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

@media (max-width: 1024px) {
  .card-item {
    margin-bottom: 1rem;
  }
}
</style>
