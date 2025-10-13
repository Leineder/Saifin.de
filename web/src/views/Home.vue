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
    <picture>
      <source srcset="/images/landing-hero.webp 768w, /images/landing-hero.webp 1200w, /images/landing-hero.webp 1600w" type="image/webp" />
      <img class="hero-img" src="/images/landing-hero.webp" alt="Kartenzahlung mit Karte und Terminal" fetchpriority="high" decoding="async" width="1600" height="900" sizes="100vw" />
    </picture>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-line">Einfach vergleichen</span>
        <span class="hero-title-line">Clever entscheiden</span>
      </h1>
      <p class="hero-sub">Vergleiche Top-Angebote und beantrage in wenigen Minuten.</p>
      <div class="hero-cta-group">
        <router-link to="/kreditkarten" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Kreditkarten</span>
        </router-link>
        <router-link to="/broker" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Broker</span>
        </router-link>
        <router-link to="/tagesgeld" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Tagesgeldkonten</span>
        </router-link>
      </div>
    </div>
  </section>

  <!-- Why Choose Us / USP-Kacheln -->
  <section class="section-muted cv-auto">
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
  <section class="section cv-auto">
    <div class="container">
      <div class="section-eyebrow">Top-Angebote</div>
      <h2 class="section-title text-2xl md:text-3xl mb-3">Beliebte Karten</h2>
      <div class="grid">
        <div v-for="o in topOffers" :key="o.id" class="col-12 md:col-6">
          <router-link :to="`/kreditkarten/${o.slug}`" class="offer-link">
            <div class="surface-card border-round-xl card-accent w-full" style="max-width:100%">
              <div class="p-3 flex align-items-center gap-3">
                <img :src="o.image" :alt="`${o.title} – Kartenmotiv`" class="offer-thumb border-round" loading="lazy" decoding="async" width="96" height="60" />
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
  <section class="section cv-auto">
    <h2 class="text-2xl md:text-3xl text-center mb-4">Das sagen unsere Nutzer</h2>
    <div class="surface-card border-round-lg">
      <div v-for="(t, idx) in testimonials" :key="t.name" class="testimonial">
        <div class="p-3 md:p-4 flex align-items-start gap-3">
          <img :src="t.avatar" :alt="`Avatar von ${t.name}`" class="border-circle" style="width:64px;height:64px;object-fit:cover" loading="lazy" decoding="async" width="64" height="64" />
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
  <section id="about" class="section cv-auto">
    <div class="container">
      <h2 class="text-2xl md:text-3xl text-center mb-4">Über uns</h2>

      <!-- Block 1: Text links, Bild rechts -->
      <div class="about-block mb-5">
        <div class="about-content">
          <div class="content-box about-text">
            <h3 class="section-title text-xl md:text-2xl mb-3">Was ist Saifin?</h3>
            <p class="text-700">
              Wir sind ein unabhängiges Vergleichsportal für Finanzprodukte. Unser Ziel: Dir eine
              klare, schnelle und zuverlässige Übersicht über Angebote zu liefern, damit du ohne
              Umwege die passende Kreditkarte findest.
            </p>
          </div>
        </div>
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=60&w=1200&auto=format&fit=crop" alt="Team bei der Arbeit"
               class="w-full border-round-lg shadow-2 about-img" loading="lazy" decoding="async" width="600" height="400" srcset="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=60&w=600&auto=format&fit=crop 600w, https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=60&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 768px) 100vw, 50vw">
        </div>
      </div>

      <!-- Block 2: Bild links, Text rechts -->
      <div class="about-block mb-5 about-block-reverse">
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=60&w=1200&auto=format&fit=crop" alt="Analyse und Bewertung"
               class="w-full border-round-lg shadow-2 about-img" loading="lazy" decoding="async" width="600" height="400" srcset="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=60&w=600&auto=format&fit=crop 600w, https://images.unsplash.com/photo-1553877522-43269d4ea984?q=60&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 768px) 100vw, 50vw">
        </div>
        <div class="about-content">
          <div class="content-box about-text">
            <h3 class="section-title text-xl md:text-2xl mb-3">Wie bewerten wir?</h3>
            <p class="text-700">
              Produkte landen erst nach einer sorgfältigen Prüfung in unserem Vergleich. Wir schauen
              auf Konditionen wie Gebühren, Leistungen, Service und Transparenz. Nur Angebote, die
              unsere Mindestkriterien erfüllen, werden dargestellt.
            </p>
          </div>
        </div>
      </div>

      <!-- Block 3: Text links, Bild rechts -->
      <div class="about-block">
        <div class="about-content">
          <div class="content-box about-text">
            <h3 class="section-title text-xl md:text-2xl mb-3">Wie finanzieren wir uns?</h3>
            <p class="text-700">
              Für einige Produktlinks können wir eine Vergütung von Partnern erhalten. Das hilft uns,
              den Service kostenlos anzubieten. Unsere redaktionellen Kriterien bleiben davon unberührt;
              wir kennzeichnen Angebote transparent und achten auf eine faire Darstellung.
            </p>
          </div>
        </div>
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=60&w=1200&auto=format&fit=crop" alt="Partnerschaft und Transparenz"
               class="w-full border-round-lg shadow-2 about-img" style="filter:grayscale(100%)" loading="lazy" decoding="async" width="600" height="400" srcset="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=60&w=600&auto=format&fit=crop 600w, https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=60&w=1200&auto=format&fit=crop 1200w" sizes="(max-width: 768px) 100vw, 50vw">
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section-muted cv-auto">
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
  <section class="cta-band cv-auto">
    <div class="container" style="text-align:center">
      <h2 class="cta-title text-2xl md:text-3xl">Bereit zum Vergleichen?</h2>
      <p class="cta-sub">Kreditkarten oder Broker – starte jetzt deinen Vergleich.</p>
      <div class="cta-buttons">
        <router-link to="/kreditkarten" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Kreditkarten</span>
        </router-link>
        <router-link to="/broker" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Broker</span>
        </router-link>
        <router-link to="/tagesgeld" class="p-button p-button-lg p-button-rounded p-button-raised hero-cta">
          <span class="p-button-label">Tagesgeldkonten</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero in Brandfarben */
.hero { height: clamp(420px, 62vh, 640px); }
.hero-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(0.85) contrast(1.05); object-position: center 30%; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,31,58,0.65) 0%, rgba(11,31,58,0.45) 40%, rgba(11,31,58,0.2) 75%, rgba(11,31,58,0.08) 100%); }
.hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; padding: 16px; text-align: center; color: #fff; }
.hero-title { color: #fff; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.1; font-weight: 800; letter-spacing: -0.01em; text-shadow: 0 6px 24px rgba(0,0,0,0.25); font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; margin: 0 0 28px; }
.hero-title-line { display: block; }
.hero-sub { color: rgba(255,255,255,0.92); font-size: clamp(1rem, 2.3vw, 1.35rem); margin: 0 0 48px; }

/* Hero-Button: leicht abgerundet, ohne Rand, dezenter Shadow */
.hero-cta.p-button {
  background: #fff !important;
  color: #111 !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px var(--shadow-color) !important;
  padding: 0.7rem 1rem !important;
  min-width: clamp(160px, 24vw, 220px);
  white-space: nowrap;
  transition: box-shadow .15s ease, transform .15s ease, background-color .15s ease, color .15s ease;
}
.hero-cta.p-button:hover,
.hero-cta.p-button:focus,
.hero-cta.p-button:focus-visible {
  background: #fff !important;
  color: #111 !important;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px var(--shadow-color) !important;
}
.hero-cta.p-button:active { transform: translateY(0); }

/* Abstand/Anordnung der Hero-Buttons */
.hero-cta-group { display: flex; gap: clamp(12px, 3.5vw, 28px); flex-wrap: wrap; justify-content: center; margin-top: 0; }
.hero-cta.alt { background: transparent !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.7) !important; }

@media (max-width: 767px) { .p-button { font-size: 1rem; } }
.hero-cta.p-button .p-button-label { font-weight: 700; letter-spacing: .01em; }

/* Dark Mode: gleicher Look (weiß, ohne Rand) */
@media (prefers-color-scheme: dark) {
  .hero-cta.p-button {
    background: #fff !important;
    color: #111 !important;
    border: none !important;
  }
  .hero-cta.p-button:hover,
  .hero-cta.p-button:focus,
  .hero-cta.p-button:focus-visible {
    background: #fff !important;
    color: #111 !important;
    box-shadow: 0 12px 28px var(--shadow-color) !important;
  }
}
.stars { color: #facc15; }
.testimonial + .testimonial { border-top: 1px solid var(--border); }
.content-box { background: var(--surface); color: var(--text); border-radius: 12px; padding: 16px; box-shadow: 0 6px 20px var(--shadow-color); border: 1px solid var(--border) }
.section-title { color: var(--text); font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }

.offer-card { transition: transform .15s ease, box-shadow .15s ease; }
.offer-link { display: block; text-decoration: none; color: inherit; width: 100%; }
.offer-link:focus .offer-card, .offer-link:hover .offer-card { transform: translateY(-2px); box-shadow: 0 12px 28px var(--shadow-color); }
.offer-thumb { width: 96px; height: 60px; object-fit: cover; border-radius: 0.5rem; border: 1px solid var(--border); }

/* Neues Layout für abwechselnde Bilder links/rechts */
.about-block {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}

.about-block-reverse {
  flex-direction: row-reverse;
}

.about-content {
  flex: 1;
  min-width: 0;
}

.about-image {
  flex: 1;
  min-width: 0;
}

.about-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform .2s ease, box-shadow .2s ease;
}

.about-img:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px var(--shadow-color);
}

/* Vertikale Zentrierung der Textbox neben den Bildern */
.about-text {
  display: flex;
  align-items: center;
  min-height: 400px;
}

/* Mobile Layout: Übereinander statt nebeneinander */
@media (max-width: 767px) {
  .about-block {
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .about-block-reverse {
    flex-direction: column;
  }
  
  .about-img {
    height: 250px;
  }
  
  .about-text {
    min-height: auto;
  }
}

/* CTA-Band unten: Ausrichtung und Buttons wie im Hero */
.cta-band { background: #0b1f3a; color: #fff; padding: clamp(28px, 6vw, 56px) 0; }
.cta-title { color: #fff; font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; margin: 0 0 12px; }
.cta-sub { color: rgba(255,255,255,0.9); margin: 0 0 20px; }
.cta-buttons { display: flex; gap: clamp(12px, 3.5vw, 28px); flex-wrap: wrap; justify-content: center; align-items: center; }
.cta-buttons .p-button {
  background: #fff !important;
  color: #111 !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px var(--shadow-color) !important;
  padding: 0.7rem 1rem !important;
  min-width: clamp(160px, 24vw, 220px);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  transition: box-shadow .15s ease, transform .15s ease, background-color .15s ease, color .15s ease;
}
.cta-buttons .p-button:hover,
.cta-buttons .p-button:focus,
.cta-buttons .p-button:focus-visible { transform: translateY(-1px); box-shadow: 0 12px 28px var(--shadow-color) !important; }
.cta-buttons .p-button:active { transform: translateY(0); }
.cta-buttons .p-button .p-button-label { font-weight: 700; letter-spacing: .01em; line-height: 1; }

@media (prefers-color-scheme: dark) {
  .cta-buttons .p-button { background: #fff !important; color: #111 !important; border: none !important; }
}
</style>


