<script setup>
import { computed } from 'vue'
import { articles, placeholders } from '../data/articles'

// Obere Leiste: 4 Karten, restliche Karten unten optional
const topCards = computed(() => {
  const base = articles.map(a => ({ ...a, isPlaceholder: false }))
  const need = Math.max(0, 4 - base.length)
  const extra = placeholders.slice(0, need).map(p => ({ ...p, isPlaceholder: true, excerpt: 'Bald verfügbar.' }))
  return [...base, ...extra].slice(0, 4)
})

const moreCards = computed(() => {
  const rest = articles.slice(4)
  return rest
})
</script>

<template>
  <section class="section surface-50">
    <div class="container">
      <div class="section-eyebrow">Ratgeber</div>
      <h1 class="section-title text-2xl md:text-3xl mb-3">Aktuelle Beiträge</h1>

      <!-- Obere Magazin-Leiste: 4 gleich große Karten wie im Referenzbild -->
      <div class="mag-strip">
        <div v-for="card in topCards" :key="card.slug" class="mag-card">
          <router-link v-if="!card.isPlaceholder" :to="`/ratgeber/${card.slug}`" class="mag-link" :aria-label="card.title">
            <img class="mag-img" :src="card.hero" :alt="card.title" />
            <div class="mag-overlay"></div>
            <div class="mag-meta">
              <div class="mag-cat">{{ card.category }}</div>
              <div class="mag-title">{{ card.title }}</div>
              <button class="read-more p-button p-component p-button-text"><span class="p-button-label">Mehr lesen</span></button>
            </div>
          </router-link>
          <div v-else class="mag-ph">
            <img class="mag-img" :src="card.hero" alt="Platzhalter" />
            <div class="mag-overlay"></div>
            <div class="mag-meta">
              <div class="mag-cat">Bald</div>
              <div class="mag-title">{{ card.title }}</div>
              <button class="read-more p-button p-component p-button-text"><span class="p-button-label">Mehr lesen</span></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Optional: Weitere Beiträge unten als kleinere Karten -->
      <div v-if="moreCards.length" class="more-grid">
        <div v-for="card in moreCards" :key="card.slug" class="more-card">
          <router-link :to="`/ratgeber/${card.slug}`" class="more-link">
            <img :src="card.hero" :alt="card.title" />
            <div class="more-body">
              <div class="more-cat">{{ card.category }}</div>
              <div class="more-title">{{ card.title }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mag-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.mag-card { position: relative; overflow: hidden; border-radius: 12px; height: 320px; }
@media (max-width: 1024px) { .mag-strip { grid-template-columns: repeat(2, 1fr); } .mag-card { height: 280px; } }
@media (max-width: 640px) { .mag-strip { grid-template-columns: 1fr; } .mag-card { height: 240px; } }

.mag-link, .mag-ph { display: block; width: 100%; height: 100%; position: relative; color: inherit; text-decoration: none; }
.mag-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(0.92) contrast(1.05); }
.mag-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,.65) 100%); }
.mag-meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px; color: #fff; display: flex; flex-direction: column; gap: 6px; }
.mag-cat { font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; opacity: .9; }
.mag-title { font-weight: 800; font-size: 1.1rem; line-height: 1.2; }
.read-more { align-self: flex-start; padding: .35rem .6rem; background: rgba(255,255,255,.92); color: #111; border-radius: .5rem; }
.mag-card:hover .mag-img { transform: scale(1.02); transition: transform .2s ease; }

.more-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-top: 16px; }
.more-link { display: block; color: inherit; text-decoration: none; }
.more-card { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: var(--surface); }
.more-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
.more-body { padding: 10px 12px; }
.more-cat { font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; color: var(--subtle-text); }
.more-title { font-weight: 700; color: var(--text); }
</style>




