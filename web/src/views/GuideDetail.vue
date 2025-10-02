<script setup>
import { useRoute, useRouter } from 'vue-router'
import { articles } from '../data/articles'

const route = useRoute()
const router = useRouter()
const article = articles.find(a => a.slug === route.params.slug)
if (!article) router.replace('/ratgeber')

const goBack = () => router.push('/ratgeber')
</script>

<template>
  <section class="section" v-if="article">
    <div class="container">
      <div class="section-eyebrow">{{ article.category }}</div>
      <h1 class="section-title text-3xl mb-3">{{ article.title }}</h1>
      <div class="hero-wrap">
        <img :src="article.hero" :alt="article.title" class="hero-img" />
      </div>
      <article class="content surface-card border-round-lg p-3 card-accent" v-html="article.content"></article>
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
</style>



