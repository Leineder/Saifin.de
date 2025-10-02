<script setup>
import { computed } from 'vue'
import { articles, placeholders } from '../data/articles'

const allCards = computed(() => {
  // Nutze vorhandene Artikel und ergänze ggf. Platzhalter, um das Grid voll zu machen
  const base = articles.map(a => ({ ...a, isPlaceholder: false }))
  const needed = Math.max(0, 6 - base.length)
  const extras = placeholders.slice(0, needed).map(p => ({ ...p, isPlaceholder: true, excerpt: 'Bald verfügbar.' }))
  return [...base, ...extras]
})
</script>

<template>
  <section class="section surface-50">
    <div class="container">
      <div class="section-eyebrow">Ratgeber</div>
      <h1 class="section-title text-2xl md:text-3xl mb-3">Aktuelle Beiträge</h1>

      <!-- Magazin-Grid im Stil des Beispiels: große visuelle Karten mit Overlay-Text -->
      <div class="mag-grid">
        <div
          v-for="card in allCards"
          :key="card.slug"
          class="mag-card"
          :class="{ 'is-ph': card.isPlaceholder }"
        >
          <router-link v-if="!card.isPlaceholder" :to="`/ratgeber/${card.slug}`" class="mag-link" :aria-label="card.title">
            <img class="mag-img" :src="card.hero" :alt="card.title" />
            <div class="mag-overlay"></div>
            <div class="mag-meta">
              <div class="mag-cat">{{ card.category }}</div>
              <div class="mag-title">{{ card.title }}</div>
              <div class="mag-excerpt">{{ card.excerpt }}</div>
            </div>
          </router-link>
          <div v-else class="mag-ph">
            <img class="mag-img" :src="card.hero" alt="Platzhalter" />
            <div class="mag-overlay"></div>
            <div class="mag-meta">
              <div class="mag-cat">Bald</div>
              <div class="mag-title">{{ card.title }}</div>
              <div class="mag-excerpt">{{ card.excerpt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mag-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
}
.mag-card { position: relative; overflow: hidden; border-radius: 12px; }
.mag-card:nth-child(1) { grid-column: span 4; height: 320px; }
.mag-card:nth-child(2) { grid-column: span 4; height: 320px; }
.mag-card:nth-child(3) { grid-column: span 4; height: 320px; }
.mag-card:nth-child(4) { grid-column: span 6; height: 260px; }
.mag-card:nth-child(5) { grid-column: span 3; height: 260px; }
.mag-card:nth-child(6) { grid-column: span 3; height: 260px; }

@media (max-width: 1024px) {
  .mag-card { grid-column: span 6 !important; height: 260px !important; }
}
@media (max-width: 640px) {
  .mag-card { grid-column: span 12 !important; height: 240px !important; }
}

.mag-link, .mag-ph { display: block; width: 100%; height: 100%; position: relative; color: inherit; text-decoration: none; }
.mag-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(0.92) contrast(1.05); }
.mag-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.25) 55%, rgba(0,0,0,.55) 100%); }
.mag-meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px; color: #fff; }
.mag-cat { font-size: .75rem; text-transform: uppercase; letter-spacing: .12em; opacity: .9; margin-bottom: 4px; }
.mag-title { font-weight: 800; font-size: 1.1rem; line-height: 1.2; margin-bottom: 4px; }
.mag-excerpt { font-size: .9rem; opacity: .95; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.mag-card:hover .mag-img { transform: scale(1.02); transition: transform .2s ease; }
</style>



