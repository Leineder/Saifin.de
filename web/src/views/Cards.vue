<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { offers } from '../data/offers'

const router = useRouter()

// Filter States
const cashWithdrawalFilter = ref('alle')
const paymentFilter = ref('alle')
const showFilters = ref(false)

// Computed filtered offers
const filteredOffers = computed(() => {
  let filtered = offers
  
  if (cashWithdrawalFilter.value !== 'alle') {
    // Filter logic for cash withdrawal
    filtered = filtered.filter(offer => {
      if (cashWithdrawalFilter.value === 'kostenlos') {
        return offer.foreignFee === '0%' || offer.foreignFee.includes('0%')
      }
      return true
    })
  }
  
  if (paymentFilter.value !== 'alle') {
    // Filter logic for payment
    filtered = filtered.filter(offer => {
      if (paymentFilter.value === 'kostenlos') {
        return offer.annualFee === 0
      }
      return true
    })
  }
  
  return filtered
})

// Get top 3 offers for recommendations
const topOffers = computed(() => {
  return offers.slice(0, 3)
})

const formatEuro = (n) => {
  if (n === 0) return '0,00 €'
  if (typeof n === 'number') return `${n.toFixed(2).replace('.', ',')} €`
  return n
}

const goToApply = (offer) => {
  if (offer.applyUrl) {
    router.push(offer.applyUrl)
  }
}
</script>

<template>
  <div class="cards-page">
    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-group">
          <h3 class="filter-title">Kostenlos Bargeld abheben</h3>
          <select v-model="cashWithdrawalFilter" class="filter-select">
            <option value="alle">alle</option>
            <option value="kostenlos">kostenlos</option>
            <option value="gebührenpflichtig">gebührenpflichtig</option>
          </select>
        </div>
        
        <div class="filter-group">
          <h3 class="filter-title">Kostenlos bezahlen</h3>
          <select v-model="paymentFilter" class="filter-select">
            <option value="alle">alle</option>
            <option value="kostenlos">kostenlos</option>
            <option value="gebührenpflichtig">gebührenpflichtig</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button class="filter-settings-btn" @click="showFilters = !showFilters">
            <i class="pi pi-cog"></i>
            Filtereinstellungen
            <i class="pi pi-info-circle"></i>
          </button>
          
          <button class="update-search-btn">
            SUCHANFRAGE AKTUALISIEREN
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Credit Card Offers -->
      <div class="offers-section">
        <div v-for="offer in filteredOffers" :key="offer.id" class="offer-card">
          <!-- Bonus Banner -->
          <div v-if="offer.bonus" class="bonus-banner">
            <i class="pi pi-gift"></i>
            {{ offer.bonus }} Bonus
          </div>
          

          
          <div class="offer-content">
            <!-- Card Image -->
            <div class="card-image-container">
              <img :src="offer.image" :alt="offer.title" class="card-image" />
            </div>
            
            <!-- Offer Details -->
            <div class="offer-details">
              <div class="offer-header">
                <h3 class="offer-title">{{ offer.title }}</h3>
                <div class="payment-type">
                  <span>Zahlungsart {{ offer.cardType.includes('Charge') ? 'Charge' : 'Credit' }}</span>
                  <i class="pi pi-info-circle"></i>
                </div>
              </div>
              
              <!-- Features -->
              <div class="features-list">
                <div v-for="(feature, index) in offer.bullets.slice(0, 4)" :key="index" class="feature-item">
                  <i class="pi pi-check"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>
              
              <!-- Annual Fee -->
              <div class="annual-fee">
                {{ formatEuro(offer.annualFee) }} pro Jahr
              </div>
              
              <!-- Action Buttons -->
              <div class="action-buttons">
                <button class="provider-btn" @click="goToApply(offer)">
                  zum Antrag
                </button>
                
                <div class="expandable-sections">
                  <button class="expand-btn">
                    Konditionen
                    <i class="pi pi-chevron-down"></i>
                  </button>
                  <button class="expand-btn">
                    Details
                    <i class="pi pi-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="recommendations-section">
        <h2 class="recommendations-title">Unsere Empfehlungen für Sie</h2>
        
        <div class="recommendations-grid">
          <div v-for="offer in topOffers" :key="offer.id" class="recommendation-card">
            <!-- Bonus Banner -->
            <div v-if="offer.bonus" class="bonus-banner">
              <i class="pi pi-gift"></i>
              {{ offer.bonus }} Bonus
            </div>
            
            <div class="recommendation-content">
              <!-- Card Image -->
              <div class="card-image-container">
                <img :src="offer.image" :alt="offer.title" class="card-image" />
              </div>
              
              <!-- Offer Details -->
              <div class="recommendation-details">
                <div class="offer-header">
                  <h3 class="offer-title">{{ offer.title }}</h3>
                  <div class="payment-type">
                    <span>Zahlungsart {{ offer.cardType.includes('Charge') ? 'Charge' : 'Credit' }}</span>
                    <i class="pi pi-info-circle"></i>
                  </div>
                </div>
                
                <!-- Features -->
                <div class="features-list">
                  <div v-for="(feature, index) in offer.bullets.slice(0, 4)" :key="index" class="feature-item">
                    <i class="pi pi-check"></i>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <!-- Annual Fee -->
                <div class="annual-fee">
                  {{ formatEuro(offer.annualFee) }} pro Jahr
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons">
                  <button class="provider-btn" @click="goToApply(offer)">
                    zum Antrag
                  </button>
                  
                  <div class="expandable-sections">
                    <button class="expand-btn">
                      Konditionen
                      <i class="pi pi-chevron-down"></i>
                    </button>
                    <button class="expand-btn">
                      Details
                      <i class="pi pi-chevron-down"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Filter Section */
.filter-section {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 0;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.filter-settings-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.update-search-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #f97316;
  border-radius: 0.375rem;
  background: white;
  color: #f97316;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Offer Cards */
.offers-section {
  margin-bottom: 3rem;
}

.offer-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.bonus-banner {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #0d9488;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
}



.offer-content {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
}

.card-image-container {
  flex-shrink: 0;
  width: 120px;
}

.card-image {
  width: 100%;
  height: 75px;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.offer-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.offer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.payment-type {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.feature-item i {
  color: #10b981;
  font-size: 0.75rem;
}

.annual-fee {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f97316;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.provider-btn {
  background: #f97316;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.expandable-sections {
  display: flex;
  gap: 1rem;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* Recommendations Section */
.recommendations-section {
  margin-top: 3rem;
}

.recommendations-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.recommendation-content {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
}

.recommendation-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-actions {
    margin-left: 0;
    justify-content: space-between;
  }
  
  .offer-content,
  .recommendation-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .card-image-container {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .expandable-sections {
    justify-content: center;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
