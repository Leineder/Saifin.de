<template>
  <div class="credit-card-comparison">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        v-for="card in offers"
        :key="card.id"
        class="card-item bg-white rounded-xl shadow-lg overflow-hidden relative"
      >
        <!-- Testsieger Badge -->
        <div v-if="card.isTestsieger" class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div class="bg-yellow-400 text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center">
            <span class="mr-1">🏆</span>
            Testsieger
          </div>
        </div>

        <!-- Header mit Name und Bewertung -->
        <div class="p-6 pb-4">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-900">{{ card.title }}</h3>
            <div class="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <span class="text-yellow-600 font-bold mr-1">★</span>
              <span class="text-gray-800 font-semibold">{{ card.rating }}/5</span>
            </div>
          </div>

          <!-- Kartenbild und Features -->
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Kartenbild -->
            <div class="flex-shrink-0 w-full lg:w-2/5">
              <div class="relative">
                <img 
                  :src="card.image" 
                  :alt="card.title" 
                  class="w-full h-48 lg:h-64 object-cover rounded-lg shadow-md"
                />
                <!-- Karten-Typ Badge -->
                <div class="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                  {{ card.cardType }}
                </div>
              </div>
            </div>

            <!-- Features Liste -->
            <div class="flex-grow w-full lg:w-3/5">
              <div class="space-y-3">
                <div v-for="bullet in card.bullets" :key="bullet" class="flex items-start">
                  <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span class="text-green-600 text-sm">✓</span>
                  </div>
                  <span class="text-gray-700">{{ bullet }}</span>
                </div>
                
                <!-- Negative Bedingung (falls vorhanden) -->
                <div v-if="card.specialConditions && card.specialConditions.schufaCheck === 'Ablehnung bei SCHUFA-Einträgen'" class="flex items-start">
                  <div class="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span class="text-red-600 text-sm">✗</span>
                  </div>
                  <span class="text-red-600">Ablehnung bei SCHUFA-Einträgen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Zusätzliche Details -->
        <div class="px-6 pb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              <div v-if="card.foreignFee === '0%'" class="text-green-600 font-bold">0%</div>
              <div v-else class="text-gray-700">{{ card.foreignFee }}</div>
            </div>

            <!-- Zinsfreie Zeit -->
            <div v-if="card.graceWeeks" class="bg-gray-50 p-3 rounded-lg">
              <div class="font-semibold text-gray-900 mb-1">Zinsfreie Zeit</div>
              <div class="text-gray-700">{{ card.graceWeeks }} Wochen</div>
            </div>

            <!-- Kreditrahmen -->
            <div v-if="card.specialConditions && card.specialConditions.creditLimit" class="bg-gray-50 p-3 rounded-lg">
              <div class="font-semibold text-gray-900 mb-1">Kreditrahmen</div>
              <div class="text-gray-700">{{ card.specialConditions.creditLimit }}</div>
            </div>
          </div>

          <!-- Spezielle Features -->
          <div v-if="card.features" class="mt-4 space-y-2">
            <div v-if="card.features.cashback" class="flex items-center text-green-600">
              <span class="mr-2">💰</span>
              <span class="text-sm">{{ card.features.cashback }}</span>
            </div>
            <div v-if="card.features.travelCredit" class="flex items-center text-blue-600">
              <span class="mr-2">✈️</span>
              <span class="text-sm">{{ card.features.travelCredit }}</span>
            </div>
            <div v-if="card.features.insurance" class="flex items-center text-purple-600">
              <span class="mr-2">🛡️</span>
              <span class="text-sm">{{ card.features.insurance }}</span>
            </div>
            <div v-if="card.specialConditions && card.specialConditions.sustainable" class="flex items-center text-green-600">
              <span class="mr-2">🌱</span>
              <span class="text-sm">{{ card.specialConditions.sustainable }}</span>
            </div>
          </div>

          <!-- Mobile Payment Logos -->
          <div v-if="card.features && card.features.mobilePay && card.features.mobilePay.length > 0" class="mt-4 flex items-center">
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
        </div>

        <!-- Call to Action -->
        <div class="px-6 pb-6">
          <button 
            @click="goApply(card.slug)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span>ZUM ANTRAG</span>
            <span class="ml-2">→</span>
          </button>
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
  border: 1px solid #e5e7eb;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (max-width: 1024px) {
  .card-item {
    margin-bottom: 2rem;
  }
}
</style>
