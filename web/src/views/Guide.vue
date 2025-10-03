<script setup>
import { computed } from 'vue'
import { articles, placeholders } from '../data/articles'

// Kartenübersicht: alle vorhandenen Artikel, ggf. mit Platzhaltern auf 6 auffüllen
const stripCards = computed(() => {
  const base = articles.map(a => ({ ...a, isPlaceholder: false }))
  const need = Math.max(0, 6 - base.length)
  const extra = placeholders.slice(0, need).map(p => ({ ...p, isPlaceholder: true, excerpt: 'Bald verfügbar.' }))
  return [...base, ...extra]
})

const fullArticles = computed(() => articles)

function getTargetPathForArticle(article) {
  const slug = (article?.slug || '').toLowerCase()
  const title = (article?.title || '').toLowerCase()

  const isCardTopic = slug.includes('kreditkarte') || slug.includes('kreditkarten') || title.includes('kreditkarte') || title.includes('kreditkarten') || slug.includes('cashback')
  const isBrokerTopic = slug.includes('broker') || slug.includes('depot') || slug.includes('trading') || title.includes('broker') || title.includes('depot') || title.includes('trading')
  const isSavingsTopic = slug.includes('tagesgeld') || title.includes('tagesgeld')

  if (isCardTopic) return '/kreditkarten'
  if (isBrokerTopic) return '/broker'
  if (isSavingsTopic) return '/tagesgeld'
  return '/kreditkarten'
}

function transformContent(article) {
  const html = article?.content || ''
  const target = getTargetPathForArticle(article)
  const pattern = /Sai+fin\.de/gi
  let transformed = html.replace(pattern, `<a href="${target}">Saifin.de</a>`)

  // Zusätzliche, thematisch passende Begriffe verlinken
  const isCardTopic = target === '/kreditkarten'
  const isBrokerTopic = target === '/broker'
  const isSavingsTopic = target === '/tagesgeld'

  if (isCardTopic) {
    transformed = transformed
      .replace(/(Kreditkarten[- ]?Vergleich)/gi, `<a href="/kreditkarten">$1</a>`)
      .replace(/(Cashback[- ]?Kreditkarten[- ]?Vergleich)/gi, `<a href="/kreditkarten">$1</a>`)
      .replace(/(beste\s+Kreditkarte(?:\s+2025)?)/gi, `<a href="/kreditkarten">$1</a>`)
  }

  if (isBrokerTopic) {
    transformed = transformed
      .replace(/(Broker[- ]?Vergleich)/gi, `<a href="/broker">$1</a>`)
      .replace(/(Depot[- ]?Vergleich)/gi, `<a href="/broker">$1</a>`)
  }

  if (isSavingsTopic) {
    transformed = transformed
      .replace(/(Tagesgeldangebote(?:\s+im)?\s+Vergleich)/gi, `<a href="/tagesgeld">$1</a>`)
      .replace(/(Tagesgeld[^<\.!?]{0,24}Vergleich)/gi, `<a href="/tagesgeld">$1</a>`)
      .replace(/(Überblick\s+auf\s+Tagesgeld)/gi, `<a href="/tagesgeld">$1</a>`)
  }

  return transformed
}
</script>

<template>
  <section class="section surface-50">
    <div class="container">
      <div class="section-eyebrow">Ratgeber</div>
      <h1 class="section-title text-2xl md:text-3xl mb-3">Aktuelle Beiträge</h1>

      <!-- Obere Magazin-Leiste: horizontal scrollbare Kartenübersicht -->
      <div class="mag-strip scroll-x">
        <div v-for="card in stripCards" :key="card.slug" class="mag-item">
          <div class="mag-card">
            <router-link v-if="!card.isPlaceholder" :to="{ path: '/ratgeber', hash: '#' + card.slug }" class="mag-link" :aria-label="card.title">
              <img class="mag-img" :src="card.hero" :alt="card.title" />
              <div class="mag-overlay"></div>
              <div class="mag-meta">
                <div class="mag-cat">{{ card.category }}</div>
                <div class="mag-title">{{ card.title }}</div>
                <button class="read-more p-button p-component p-button-text"><span class="p-button-label">Mehr lesen</span></button>
              </div>
            </router-link>
            <div v-else class="mag-ph">
              <img class="mag-img" :src="card.hero" alt="Platzhalter" loading="lazy" />
              <div class="mag-overlay"></div>
              <div class="mag-meta">
                <div class="mag-cat">Bald</div>
                <div class="mag-title">{{ card.title }}</div>
                <button class="read-more p-button p-component p-button-text"><span class="p-button-label">Mehr lesen</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Volle Artikel unterhalb anzeigen -->
      <div class="articles">
        <article v-for="a in fullArticles" :key="a.slug" :id="a.slug" class="article surface-card border-round-lg card-accent">
          <img :src="a.hero" :alt="a.title" class="article-hero" loading="lazy" />
          <div class="article-body">
            <div class="section-eyebrow">{{ a.category }}</div>
            <h2 class="section-title text-2xl mb-2">{{ a.title }}</h2>
            <div class="article-content" v-html="transformContent(a)"></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mag-strip {
  display: flex;
  gap: 12px;
  scroll-snap-type: x mandatory;
}
.scroll-x { overflow-x: auto; padding-bottom: 6px; }
.scroll-x::-webkit-scrollbar { height: 0; background: transparent; }
.scroll-x { scrollbar-width: none; }
.scroll-x::-webkit-scrollbar-thumb { background: transparent; }
.mag-item { scroll-snap-align: start; flex: 0 0 calc((100% - 36px) / 4); max-width: calc((100% - 36px) / 4); }
.mag-card { position: relative; overflow: hidden; border-radius: 16px; height: 220px; background: var(--surface); box-shadow: 0 8px 24px var(--shadow-color); border: 1px solid var(--border); }
@media (max-width: 1024px) {
  .mag-item { flex-basis: calc(50% - 6px); max-width: calc(50% - 6px); }
  .mag-card { height: 240px; }
}
@media (max-width: 640px) {
  .mag-item { flex-basis: 100%; max-width: 100%; }
  .mag-card { height: 200px; }
}

.mag-link, .mag-ph { display: block; width: 100%; height: 100%; position: relative; color: inherit; text-decoration: none; }
.mag-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(0.92) contrast(1.05); }
.mag-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,.65) 100%); }
.mag-meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 12px; color: #fff; display: flex; flex-direction: column; gap: 6px; }
.mag-cat { font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; opacity: .9; }
.mag-title { font-weight: 800; font-size: 1rem; line-height: 1.2; }
.read-more { align-self: flex-start; padding: .3rem .55rem; background: rgba(255,255,255,.92); color: #111; border-radius: .5rem; }
.mag-card:hover .mag-img { transform: scale(1.02); transition: transform .2s ease; }

.more-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-top: 16px; }
.more-link { display: block; color: inherit; text-decoration: none; }
.more-card { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: var(--surface); }
.more-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
.more-body { padding: 10px 12px; }
.more-cat { font-size: .7rem; text-transform: uppercase; letter-spacing: .12em; color: var(--subtle-text); }
.more-title { font-weight: 700; color: var(--text); }

.articles { margin-top: 18px; display: flex; flex-direction: column; gap: 16px; }
.article { overflow: hidden; }
.article-hero { width: 100%; height: 260px; object-fit: cover; display: block; border-bottom: 1px solid var(--border); }
.article-body { padding: 12px; }
.article-content :deep(h2) { margin-top: .5rem; }
.article-content :deep(h3) { margin-top: .5rem; font-size: 1.1rem; }
.article-content :deep(p) { margin: .5rem 0; color: var(--text); }
.article-content :deep(ul), .article-content :deep(ol) { margin: .25rem 0 .5rem 1.25rem; color: var(--muted-text); }
</style>




