<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { brokers, recommendedBrokers } from '../data/brokers'

const router = useRouter()

const search = ref('')
const onlyRecommended = ref(false)

const filteredBrokers = computed(() => {
  let list = brokers
  if (onlyRecommended.value) {
    list = list.filter(b => recommendedBrokers.includes(b.slug))
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(b =>
      b.name.toLowerCase().includes(q) ||
      (b.highlights || []).some(h => h.toLowerCase().includes(q))
    )
  }
  return list
})

const top3 = computed(() => brokers.filter(b => recommendedBrokers.includes(b.slug)))

function goToDetail(broker) {
  router.push(`/broker/${broker.slug}`)
}
</script>

<template>
  <div class="brokers-page">
    <section class="section">
      <div class="container layout">
        <!-- Sidebar Filter -->
        <aside class="sidebar">
          <div class="surface-card border-round-lg p-3 card-accent sidebar-card">
            <div class="section-eyebrow">Filter</div>
            <h2 class="section-title text-xl mb-3">Finde deinen Broker</h2>

            <div class="filter-group">
              <h3 class="filter-title">Suche</h3>
              <input v-model="search" placeholder="Name oder Feature" class="filter-input" />
            </div>

            <div class="filter-group">
              <label class="checkbox">
                <input type="checkbox" v-model="onlyRecommended" />
                <span>Nur Empfehlungen</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Content -->
        <main class="content">
          <div class="section-eyebrow">Angebote</div>
          <h1 class="section-title text-2xl md:text-3xl mb-3">Broker im Vergleich</h1>

          <div class="offers-section">
            <div 
              v-for="b in filteredBrokers" 
              :key="b.id || b.slug" 
              class="offer-card surface-card border-round-xl card-accent"
              @click="goToDetail(b)"
              style="cursor: pointer;"
            >
              <div class="offer-content">
                <div class="card-image-container">
                  <img :src="b.image || '/images/saifin_logo_vectorized_final.svg'" :alt="b.name" class="card-image" />
                </div>
                <div class="offer-details">
                  <div class="offer-header">
                    <h3 class="offer-title">{{ b.name }}</h3>
                    <div class="payment-type">
                      <span>Regulierung</span>
                      <i class="pi pi-info-circle"></i>
                    </div>
                  </div>
                  <div class="features-list">
                    <div v-for="(h, idx) in (b.highlights || []).slice(0, 4)" :key="idx" class="feature-item">
                      <i class="pi pi-check"></i>
                      <span>{{ h }}</span>
                    </div>
                  </div>
                  <div class="action-buttons">
                    <button class="p-button" @click.stop="goToDetail(b)"><span class="p-button-label">Details</span></button>
                    <button class="expand-btn" @click.stop="goToDetail(b)">Mehr <i class="pi pi-chevron-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empfehlungen -->
          <div class="recommendations-section">
            <h2 class="recommendations-title section-title">Unsere Empfehlungen</h2>
            <div class="recommendations-grid">
              <div 
                v-for="b in top3" 
                :key="b.slug" 
                class="recommendation-card surface-card border-round-xl card-accent"
                @click="goToDetail(b)"
                style="cursor: pointer;"
              >
                <div class="recommendation-content">
                  <div class="card-image-container">
                    <img :src="b.image || '/images/saifin_logo_vectorized_final.svg'" :alt="b.name" class="card-image" />
                  </div>
                  <div class="recommendation-details">
                    <div class="offer-header">
                      <h3 class="offer-title">{{ b.name }}</h3>
                      <div class="payment-type">
                        <span>{{ b.recommendation?.title || 'Empfehlung' }}</span>
                        <i class="pi pi-info-circle"></i>
                      </div>
                    </div>
                    <div class="features-list">
                      <div v-for="(p, idx) in (b.recommendation?.pros || b.highlights || []).slice(0, 4)" :key="idx" class="feature-item">
                        <i class="pi pi-check"></i>
                        <span>{{ p }}</span>
                      </div>
                    </div>
                    <div class="action-buttons">
                      <button class="p-button" @click.stop="goToDetail(b)"><span class="p-button-label">Details</span></button>
                      <button class="expand-btn" @click.stop="goToDetail(b)">Mehr <i class="pi pi-chevron-right"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  </div>
</template>

<style scoped>
.brokers-page { background: var(--surface-muted); min-height: 100vh; }
.layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
.sidebar { position: relative; }
.sidebar-card { position: sticky; top: 86px; }
.content { min-width: 0; }

.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-title { font-size: 0.875rem; font-weight: 600; color: var(--text); margin: 0; }
.filter-input { padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text); font-size: 0.875rem; }
.checkbox { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text); }

.offers-section { margin-bottom: 3rem; }
.offer-card { margin-bottom: 1.5rem; position: relative; overflow: hidden; }
.offer-content { display: flex; padding: 1.5rem; gap: 1.5rem; }
.card-image-container { flex-shrink: 0; width: 120px; }
.card-image { width: 100%; height: 75px; object-fit: cover; border-radius: 0.75rem; border: 1px solid var(--border); }
.offer-details { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; }
.offer-title { font-size: 1.125rem; font-weight: 700; color: var(--text); margin: 0; }
.payment-type { display: flex; align-items: center; gap: 0.25rem; color: var(--subtle-text); font-size: 0.875rem; }
.features-list { display: flex; flex-direction: column; gap: 0.5rem; }
.feature-item { display: flex; align-items: center; gap: 0.5rem; color: var(--muted-text); font-size: 0.875rem; }
.feature-item i { color: #34d399; font-size: 0.75rem; }
.action-buttons { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }

.recommendations-section { margin-top: 3rem; }
.recommendations-title { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 1.5rem; text-align: center; }
.recommendations-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
.recommendation-card { background: var(--surface); border-radius: 0.75rem; box-shadow: 0 1px 3px var(--shadow-color); position: relative; overflow: hidden; }
.recommendation-content { display: flex; padding: 1.5rem; gap: 1.5rem; }
.recommendation-details { flex: 1; display: flex; flex-direction: column; gap: 1rem; }

@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar-card { position: static; }
  .offer-content, .recommendation-content { flex-direction: column; gap: 1rem; }
  .card-image-container { width: 100%; max-width: 200px; margin: 0 auto; }
  .action-buttons { flex-direction: column; align-items: stretch; }
  .recommendations-grid { grid-template-columns: 1fr; }
}
</style>

