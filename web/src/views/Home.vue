<script setup>
import { onMounted, computed } from 'vue'
import { storeTrackingParams } from '../tracking'
import { offers } from '../data/offers'

const testimonials = [
  { name: 'Max Kowal', avatar: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=200', rating: 5,
    text: 'Habe heute das erste Mal mit meiner neuen Kreditkarte bezahlt, richtig gut.' },
  { name: 'Julia Huber', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200', rating: 4,
    text: 'War echt hilfreich für die Suche nach einem Girokonto. Hatte schnell einen guten Überblick.' },
  { name: 'Thomas B.', avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200', rating: 5,
    text: 'Die Seite ist top! Ich habe sofort eine passende Kreditkarte gefunden.' }
]

const topOffers = computed(() => offers.slice(0, 2))
const formatEuro = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`

onMounted(() => { storeTrackingParams() })
</script>

<template>
  <!-- Moderner Hero mit Bild, Gradient-Overlay und weißer Typografie -->
  <section class="hero relative">
    <img class="hero-img" src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1600" alt="Urlaub" />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">Eine Kreditkarte für jede Situation.</h1>
      <p class="hero-sub">Vergleiche Top-Angebote und beantrage in wenigen Minuten.</p>
      <router-link to="/kreditkarten" class="p-button p-button-lg p-button-rounded p-button-raised">
        <span class="p-button-label">Kreditkarten ansehen</span>
      </router-link>
    </div>
  </section>

  <!-- Why Choose Us / USP-Kacheln -->
  <section class="section-muted">
    <div class="container">
      <div class="section-eyebrow">Warum Saifin</div>
      <h2 class="section-title text-2xl md:text-3xl mb-4">Schnell. Transparent. Unabhängig.</h2>
      <div class="grid">
        <div class="col-12 md:col-4">
          <div class="surface-card border-round-lg p-3 card-accent">
            <h3 class="m-0 mb-2 section-title text-lg">Klarer Vergleich</h3>
            <p class="m-0 text-700">Nur relevante Kennzahlen und Leistungen – auf einen Blick.</p>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="surface-card border-round-lg p-3 card-accent">
            <h3 class="m-0 mb-2 section-title text-lg">Aktuelle Angebote</h3>
            <p class="m-0 text-700">Wir pflegen laufend neue Karten und Konditionen ein.</p>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="surface-card border-round-lg p-3 card-accent">
            <h3 class="m-0 mb-2 section-title text-lg">Unabhängig</h3>
            <p class="m-0 text-700">Unsere Kriterien bleiben redaktionell – transparent gekennzeichnet.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Top-Angebote Preview Cards -->
  <section class="section">
    <div class="container">
      <div class="section-eyebrow">Top-Angebote</div>
      <h2 class="section-title text-2xl md:text-3xl mb-3">Beliebte Karten</h2>
      <div class="grid">
        <div v-for="o in topOffers" :key="o.id" class="col-12 md:col-6">
          <router-link :to="`/kreditkarten/${o.slug}`" class="offer-link">
            <div class="surface-card border-round-xl card-accent w-full" style="max-width:100%">
              <div class="p-3 flex align-items-center gap-3">
                <img :src="o.image" alt="" class="offer-thumb border-round" />
                <div class="flex-1">
                  <div class="text-900 text-lg font-bold line-height-2">{{ o.title }}</div>
                  <div class="text-600 text-sm">Jahresgebühr</div>
                  <div class="text-900 text-lg font-bold">{{ formatEuro(o.annualFee) }}</div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section">
    <h2 class="text-2xl md:text-3xl text-center mb-4">Das sagen unsere Nutzer</h2>
    <div class="surface-card border-round-lg">
      <div v-for="(t, idx) in testimonials" :key="t.name" class="testimonial">
        <div class="p-3 md:p-4 flex align-items-start gap-3">
          <img :src="t.avatar" alt="" class="border-circle" style="width:64px;height:64px;object-fit:cover" />
          <div class="flex-1">
            <div class="text-900 font-bold mb-1">{{ t.name }}</div>
            <div class="stars mb-2">
              <i v-for="n in 5" :key="n" :class="['pi', n <= t.rating ? 'pi-star-fill' : 'pi-star']"></i>
            </div>
            <p class="text-900 m-0">{{ t.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Über uns -->
  <section id="about" class="section">
    <h2 class="text-2xl md:text-3xl text-center mb-4">Über uns</h2>

    <!-- Block 1 -->
    <div class="grid align-items-stretch mb-5">
      <div class="col-12 md:col-6">
        <div class="content-box about-text">
          <div>
            <h3 class="section-title text-xl md:text-2xl mb-2">Was ist Saifin?</h3>
            <p class="text-700">
              Wir sind ein unabhängiges Vergleichsportal für Finanzprodukte. Unser Ziel: Dir eine
              klare, schnelle und zuverlässige Übersicht über Angebote zu liefern, damit du ohne
              Umwege die passende Kreditkarte findest.
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200" alt="Team"
             class="w-full border-round-lg shadow-2 about-img" style="object-fit:cover;max-height:320px">
      </div>
    </div>

    <!-- Block 2 -->
    <div class="grid align-items-stretch mb-5">
      <div class="col-12 md:col-6 order-2 md:order-1">
        <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200" alt="Analyse"
             class="w-full border-round-lg shadow-2 about-img" style="object-fit:cover;max-height:320px">
      </div>
      <div class="col-12 md:col-6 order-1 md:order-2">
        <div class="content-box about-text">
          <div>
            <h3 class="section-title text-xl md:text-2xl mb-2">Wie bewerten wir?</h3>
            <p class="text-700">
              Produkte landen erst nach einer sorgfältigen Prüfung in unserem Vergleich. Wir schauen
              auf Konditionen wie Gebühren, Leistungen, Service und Transparenz. Nur Angebote, die
              unsere Mindestkriterien erfüllen, werden dargestellt.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Block 3 -->
    <div class="grid align-items-stretch">
      <div class="col-12 md:col-6">
        <div class="content-box about-text">
          <div>
            <h3 class="section-title text-xl md:text-2xl mb-2">Wie finanzieren wir uns?</h3>
            <p class="text-700">
              Für einige Produktlinks können wir eine Vergütung von Partnern erhalten. Das hilft uns,
              den Service kostenlos anzubieten. Unsere redaktionellen Kriterien bleiben davon unberührt;
              wir kennzeichnen Angebote transparent und achten auf eine faire Darstellung.
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-6">
        <img src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200" alt="Partnerschaft"
             class="w-full border-round-lg shadow-2 about-img" style="object-fit:cover;max-height:320px;filter:grayscale(100%)">
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section-muted">
    <div class="container">
      <div class="section-eyebrow">FAQ</div>
      <h2 class="section-title text-2xl md:text-3xl mb-3">Häufige Fragen</h2>
      <div class="faq">
        <details>
          <summary>Wie finde ich die passende Kreditkarte?</summary>
          <div class="text-700 p-2">Nutze unsere Filter und vergleiche Jahresgebühren, Leistungen und Konditionen.</div>
        </details>
        <details>
          <summary>Kostet Saifin etwas?</summary>
          <div class="text-700 p-2">Die Nutzung ist kostenlos. Für einige Links erhalten wir ggf. eine Vergütung.</div>
        </details>
        <details>
          <summary>Wie aktuell sind die Angebote?</summary>
          <div class="text-700 p-2">Wir pflegen die Daten laufend und überprüfen Konditionen regelmäßig.</div>
        </details>
      </div>
    </div>
  </section>

  <!-- CTA Band -->
  <section class="cta-band">
    <div class="container" style="text-align:center">
      <h2 class="cta-title text-2xl md:text-3xl">Bereit zum Vergleichen?</h2>
      <p class="cta-sub">Finde die Karte, die zu dir passt – schnell und transparent.</p>
      <router-link to="/kreditkarten" class="p-button p-button-rounded p-button-lg">
        <span class="p-button-label">Jetzt Kreditkarten vergleichen</span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
/* Hero in Brandfarben */
.hero { height: clamp(420px, 62vh, 640px); }
.hero-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(0.85) contrast(1.05); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,31,58,0.65) 0%, rgba(11,31,58,0.45) 40%, rgba(11,31,58,0.2) 75%, rgba(11,31,58,0.08) 100%); }
.hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 16px; text-align: center; color: #fff; }
.hero-title { color: #fff; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.15; font-weight: 800; letter-spacing: -0.01em; text-shadow: 0 6px 24px rgba(0,0,0,0.25); font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }
.hero-sub { color: rgba(255,255,255,0.92); font-size: clamp(1rem, 2.3vw, 1.35rem); margin: 0 0 6px; }

@media (max-width: 767px) { .p-button { font-size: 1rem; } }
.stars { color: #fbbf24; }
.testimonial + .testimonial { border-top: 1px solid #e5e7eb; }
.content-box { background: rgba(255,255,255,0.98); color: #0f172a; border-radius: 12px; padding: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); border: 1px solid rgba(11,31,58,0.08) }
.section-title { color: var(--saifin-navy-900); font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }

.offer-card { transition: transform .15s ease, box-shadow .15s ease; }
.offer-link { display: block; text-decoration: none; color: inherit; width: 100%; }
.offer-link:focus .offer-card, .offer-link:hover .offer-card { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
.offer-thumb { width: 96px; height: 60px; object-fit: cover; }

/* Vertikale Zentrierung der Textbox neben den Bildern auf Desktop */
@media (min-width: 768px) {
  .about-text { min-height: 320px; display: flex; align-items: center; }
}
</style>


