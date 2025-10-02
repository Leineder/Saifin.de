<script setup>
import { computed, ref } from 'vue'
import { savingsOffers } from '../data/savings'

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return savingsOffers
  return savingsOffers.filter(o =>
    o.title.toLowerCase().includes(q) ||
    (o.highlights || []).some(h => h.toLowerCase().includes(q))
  )
})
</script>

<template>
  <div class="savings-page">
    <section class="section">
      <div class="container">
        <div class="section-eyebrow">Angebote</div>
        <h1 class="section-title text-2xl md:text-3xl mb-3">Tagesgeld im Vergleich</h1>

        <div class="surface-card border-round-lg p-3 card-accent searchbar">
          <input v-model="query" placeholder="Suche (z. B. Zinsgarantie, Einlagensicherung)" />
        </div>

        <div class="grid">
          <div v-for="o in filtered" :key="o.slug" class="col-12 md:col-6">
            <div class="surface-card border-round-xl card-accent offer">
              <div class="offer-media">
                <img :src="o.image" alt="" />
              </div>
              <div class="offer-body">
                <div class="section-eyebrow">Tagesgeld</div>
                <h3 class="text-900 m-0">{{ o.title }}</h3>
                <div class="interest">{{ o.interest }}</div>
                <ul class="bullets">
                  <li v-for="h in (o.highlights || [])" :key="h">{{ h }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info-/FAQ-Sektion analog zu anderen Seiten -->
    <section class="section surface-50">
      <div class="container guide">
        <div class="section-eyebrow">Ratgeber</div>
        <h2 class="section-title">Wissenswertes zum Tagesgeld</h2>
        <div class="guide-grid">
          <div class="surface-card border-round-lg p-3 card-accent">
            <h3 class="guide-title">Vorteile</h3>
            <ul>
              <li>Jederzeit verfügbar</li>
              <li>Gesetzliche Einlagensicherung bis 100.000 €</li>
              <li>Oft Sonderzinsen für Neukunden</li>
            </ul>
          </div>
          <div class="surface-card border-round-lg p-3 card-accent">
            <h3 class="guide-title">Worauf achten</h3>
            <ul>
              <li>Zinsgarantie-Dauer</li>
              <li>Neukunden- vs. Bestandskundenzins</li>
              <li>Kombinationsangebote (z. B. mit Depot)</li>
            </ul>
          </div>
        </div>
        <div class="faq">
          <details>
            <summary>Was bedeutet Zinsgarantie?</summary>
            <div class="text-700 p-2">Ein fester Zinssatz für eine definierte Zeitspanne – unabhängig von Marktschwankungen.</div>
          </details>
          <details>
            <summary>Ist mein Geld sicher?</summary>
            <div class="text-700 p-2">Guthaben sind bis 100.000 € pro Kunde und Bank gesetzlich abgesichert.</div>
          </details>
          <details>
            <summary>Wie schnell komme ich an mein Geld?</summary>
            <div class="text-700 p-2">Täglich – Überweisungen dauern i. d. R. 1 Bankarbeitstag.</div>
          </details>
        </div>
      </div>
    </section>
  </div>
  
</template>

<style scoped>
.savings-page { background: var(--surface-muted); min-height: 100vh; }
.searchbar input { width: 100%; padding: .6rem .8rem; border: 1px solid var(--border); border-radius: .5rem; background: var(--surface); color: var(--text); }
.offer { display: grid; grid-template-columns: 160px 1fr; gap: 16px; overflow: hidden; }
.offer-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.interest { margin-top: 4px; font-weight: 700; color: var(--text); }
.bullets { margin: 8px 0 0 16px; color: var(--muted-text); }
.guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin: 12px 0; }
.guide-title { font-size: .9rem; text-transform: uppercase; letter-spacing: .1em; color: var(--subtle-text); margin: 0 0 6px; }

@media (max-width: 768px) {
  .offer { grid-template-columns: 1fr; }
}
</style>



