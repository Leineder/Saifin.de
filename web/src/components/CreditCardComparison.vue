<template>
  <div class="credit-card-comparison">
    <h2 class="text-2xl md:text-3xl mb-6 text-center">Kreditkarten-Vergleich</h2>
    
    <!-- Vergleichstabelle -->
    <div class="overflow-x-auto">
      <table class="comparison-table w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left">Kreditkarte</th>
            <th class="p-3 text-center">Jahresgebühr</th>
            <th class="p-3 text-center">Auslandsgebühren</th>
            <th class="p-3 text-center">Zinsfreie Zeit</th>
            <th class="p-3 text-center">Zusatzleistungen</th>
            <th class="p-3 text-center">Besondere Konditionen</th>
            <th class="p-3 text-center">Design</th>
            <th class="p-3 text-center">Aktion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in offers" :key="card.id" class="border-b hover:bg-gray-50">
            <!-- Kartenname -->
            <td class="p-3">
              <div class="font-semibold text-lg">{{ card.title }}</div>
              <div class="text-sm text-gray-600">{{ card.cardType }}</div>
            </td>
            
            <!-- Jahresgebühr -->
            <td class="p-3 text-center">
              <span v-if="card.annualFee === 0" class="text-green-600 font-bold">0 €</span>
              <span v-else-if="typeof card.annualFee === 'number'" class="font-bold">{{ card.annualFee }} €</span>
              <span v-else class="text-gray-600">{{ card.annualFee }}</span>
            </td>
            
            <!-- Auslandsgebühren -->
            <td class="p-3 text-center">
              <span v-if="card.foreignFee === '0%'" class="text-green-600 font-bold">0%</span>
              <span v-else class="text-sm">{{ card.foreignFee }}</span>
            </td>
            
            <!-- Zinsfreie Zeit -->
            <td class="p-3 text-center">
              <span class="font-semibold">{{ card.graceWeeks }} Wochen</span>
            </td>
            
            <!-- Zusatzleistungen -->
            <td class="p-3">
              <div class="space-y-1 text-sm">
                <div v-if="card.features.cashback" class="text-green-600">
                  💰 {{ card.features.cashback }}
                </div>
                <div v-if="card.features.travelCredit" class="text-blue-600">
                  ✈️ {{ card.features.travelCredit }}
                </div>
                <div v-if="card.features.insurance" class="text-purple-600">
                  🛡️ {{ card.features.insurance }}
                </div>
                <div v-if="card.features.mobilePay.length > 0" class="text-gray-600">
                  📱 {{ card.features.mobilePay.join(', ') }}
                </div>
                <div v-if="card.features.virtual" class="text-orange-600">
                  🔗 Virtuelle Karte
                </div>
                <div v-if="card.features.emergencyCash" class="text-red-600">
                  🆘 {{ card.features.emergencyCash }}
                </div>
                <div v-if="card.features.membershipRewards" class="text-yellow-600">
                  ⭐ Membership Rewards
                </div>
              </div>
            </td>
            
            <!-- Besondere Konditionen -->
            <td class="p-3">
              <div class="space-y-1 text-sm">
                <div v-if="card.specialConditions.creditLimit !== 'Standard'" class="font-semibold">
                  💳 {{ card.specialConditions.creditLimit }}
                </div>
                <div v-if="!card.specialConditions.schufaCheck" class="text-green-600">
                  ✅ Keine Schufa-Abfrage
                </div>
                <div v-if="card.specialConditions.instantDecision" class="text-blue-600">
                  ⚡ Sofortentscheidung
                </div>
                <div v-if="card.specialConditions.sustainable" class="text-green-600">
                  🌱 {{ card.specialConditions.sustainable }}
                </div>
                <div v-if="card.specialConditions.flexibleRepayment" class="text-purple-600">
                  🔄 Flexible Ratenzahlung
                </div>
                <div v-if="card.specialConditions.girokonto" class="text-blue-600">
                  🏦 {{ card.specialConditions.girokonto }}
                </div>
              </div>
            </td>
            
            <!-- Design -->
            <td class="p-3 text-center">
              <div class="text-sm">
                <div v-if="card.design.includes('Gold')" class="text-yellow-600">
                  🏆 {{ card.design }}
                </div>
                <div v-else-if="card.design.includes('recycelt')" class="text-green-600">
                  🌱 {{ card.design }}
                </div>
                <div v-else-if="card.design.includes('Virtuelle')" class="text-blue-600">
                  🔗 {{ card.design }}
                </div>
                <div v-else class="text-gray-600">
                  {{ card.design }}
                </div>
              </div>
            </td>
            
            <!-- Aktion -->
            <td class="p-3 text-center">
              <button 
                @click="goToDetail(card.slug)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
              >
                Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Legende -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-semibold mb-3">Legende:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="space-y-1">
          <div>💰 Cashback & Rückvergütungen</div>
          <div>✈️ Reisevorteile</div>
          <div>🛡️ Versicherungen</div>
          <div>📱 Mobile Payment</div>
        </div>
        <div class="space-y-1">
          <div>🔗 Virtuelle Karten</div>
          <div>🌱 Nachhaltigkeit</div>
          <div>🏆 Premium-Karten</div>
          <div>⚡ Sofortentscheidung</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { offers } from '../data/offers'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDetail(slug) {
  router.push(`/kreditkarten/${slug}`)
}
</script>

<style scoped>
.comparison-table {
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  border: 1px solid #e5e7eb;
}

.comparison-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

@media (max-width: 768px) {
  .comparison-table {
    font-size: 0.875rem;
  }
  
  .comparison-table th,
  .comparison-table td {
    padding: 0.5rem;
  }
}
</style>
