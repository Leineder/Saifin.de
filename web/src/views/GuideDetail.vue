<script setup>
import { useRoute, useRouter } from 'vue-router'
import { articles } from '../data/articles'

const route = useRoute()
const router = useRouter()
const article = articles.find(a => a.slug === route.params.slug)
if (!article) router.replace('/ratgeber')

const goBack = () => router.push('/ratgeber')

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
  <section class="section" v-if="article">
    <div class="container">
      <div class="section-eyebrow">{{ article.category }}</div>
      <h1 class="section-title text-3xl mb-3">{{ article.title }}</h1>
      <div class="hero-wrap">
        <img :src="article.hero" :alt="article.title" class="hero-img" loading="lazy" decoding="async" width="1200" height="320" />
      </div>
      <article class="content surface-card border-round-lg p-3 card-accent" v-html="transformContent(article)"></article>
      <div class="actions">
        <button class="p-button p-component p-button-outlined" @click="goBack"><span class="p-button-label">Zur Übersicht</span></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-wrap { overflow: hidden; border-radius: 12px; margin-bottom: 16px; border: 1px solid var(--border); }
.hero-img { width: 100%; height: 320px; object-fit: cover; display: block; }
.content :deep(h2) { margin-top: .5rem; }
.content :deep(h3) { margin-top: .5rem; font-size: 1.1rem; }
.content :deep(p) { margin: .5rem 0; color: var(--text); }
.content :deep(ul), .content :deep(ol) { margin: .25rem 0 .5rem 1.25rem; color: var(--muted-text); }
.actions { margin-top: 12px; }

@media (max-width: 767px) {
  .hero-img {
    height: 200px;
  }
  .section-title {
    font-size: 1.75rem;
    line-height: 1.2;
  }
  .content {
    padding: 1rem;
  }
  .content :deep(h2) {
    font-size: 1.25rem;
  }
  .content :deep(h3) {
    font-size: 1rem;
  }
  .content :deep(ul), .content :deep(ol) {
    margin-left: 1rem;
  }
}
</style>



