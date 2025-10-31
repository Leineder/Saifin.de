<script setup>
import { onMounted, computed } from 'vue'
import { storeTrackingParams } from '../tracking'
import { offers } from '../data/offers'
import { brokers } from '../data/brokers'
import { savingsOffers } from '../data/savings'
import { batchPreloadAffiliateLinks, instantPreloadCriticalLinks } from '../utils/affiliate-links'

const testimonials = [
  { name: 'Sarah Müller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', rating: 5,
    text: 'Super übersichtliche Darstellung aller Konditionen. Konnte direkt die beste Karte für mich finden!' },
  { name: 'Michael Schmidt', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', rating: 4,
    text: 'Die Vergleichsfunktion ist sehr praktisch. Hat mir bei der Entscheidung für einen neuen Broker geholfen.' },
  { name: 'Lisa Wagner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', rating: 5,
    text: 'Endlich eine Seite, die wirklich unabhängig vergleicht. Tolle Auswahl an Tagesgeldkonten!' }
]

const topOffers = computed(() => offers.slice(0, 2))
const formatEuro = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`

// Tracking-sichere Preloading-Strategie

onMounted(() => { 
  storeTrackingParams()
  
  // TRACKING-SICHERES PRELOADING - Verhindert Conversion-Pixel-Probleme
  // Sammle alle externen Affiliate-Links
  const allAffiliateUrls = [
    // Top 3 Kreditkarten (reduziert für bessere Performance)
    ...offers
      .filter(offer => offer.applyUrl && /^https?:\/\//i.test(offer.applyUrl))
      .slice(0, 3)
      .map(offer => offer.applyUrl),
    
    // Top 2 Broker (reduziert für bessere Performance)
    ...brokers
      .filter(broker => broker.applyUrl && /^https?:\/\//i.test(broker.applyUrl))
      .slice(0, 2)
      .map(broker => broker.applyUrl),
    
    // Top 2 Tagesgeld (reduziert für bessere Performance)
    ...savingsOffers
      .filter(savings => savings.applyUrl && /^https?:\/\//i.test(savings.applyUrl))
      .slice(0, 2)
      .map(savings => savings.applyUrl)
  ]
  
  if (allAffiliateUrls.length > 0) {
    // Tracking-sicheres Preloading mit Verzögerung
    try {
      // Verzögerung von 2 Sekunden für bessere Tracking-Kompatibilität
      setTimeout(() => {
        instantPreloadCriticalLinks(allAffiliateUrls)
        console.log(`Tracking-safe preloading: ${allAffiliateUrls.length} URLs preloaded`)
      }, 2000)
    } catch (error) {
      console.warn('Tracking-safe preloading failed:', error)
    }
  }
})
</script>

<template>
  <!-- Moderner Hero mit Bild, Gradient-Overlay und weißer Typografie - ULTRA OPTIMIZED FOR LCP & CLS -->
  <section class="hero relative">
    <!-- Ultra-optimized image loading for best LCP -->
    <img 
      class="hero-img" 
      src="/images/landing-hero.webp" 
      alt="Kartenzahlung mit Karte und Terminal" 
      fetchpriority="high" 
      decoding="sync"
      width="1600" 
      height="900" 
      loading="eager"
      importance="high"
    />
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
                <img :src="o.image" :alt="`${o.title} – Kartenmotiv`" class="offer-thumb border-round" loading="lazy" decoding="async" width="112" height="70" />
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
              <span v-for="n in 5" :key="n" :class="['star', n <= t.rating ? 'star-filled' : 'star-empty']">
                {{ n <= t.rating ? '★' : '☆' }}
              </span>
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
      <div class="about-section-header">
        <h2 class="about-main-title">Über uns</h2>
        <p class="about-subtitle">Transparenz, Unabhängigkeit und Qualität stehen bei uns im Fokus</p>
      </div>

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
               class="w-full border-round-lg shadow-2 about-img" loading="lazy" decoding="async" width="600" height="400">
        </div>
      </div>

      <!-- Block 2: Bild links, Text rechts -->
      <div class="about-block mb-5 about-block-reverse">
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=60&w=1200&auto=format&fit=crop" alt="Analyse und Bewertung"
               class="w-full border-round-lg shadow-2 about-img" loading="lazy" decoding="async" width="600" height="400">
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
               class="w-full border-round-lg shadow-2 about-img" style="filter:grayscale(100%)" loading="lazy" decoding="async" width="600" height="400">
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
/* Hero in Brandfarben - OPTIMIZED FOR LCP & CLS */
.hero { 
  /* Fixed height to prevent CLS */
  height: clamp(420px, 62vh, 640px);
  min-height: 420px;
  contain: layout style paint;
  position: relative;
  overflow: hidden;
}
.hero-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  display: block; 
  filter: saturate(0.85) contrast(1.05); 
  object-position: center 30%;
  /* Prevent layout shifts with explicit aspect ratio and dimensions */
  aspect-ratio: 16/9;
  max-height: 640px;
}
.hero-overlay { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(180deg, rgba(11,31,58,0.65) 0%, rgba(11,31,58,0.45) 40%, rgba(11,31,58,0.2) 75%, rgba(11,31,58,0.08) 100%);
  pointer-events: none;
}
.hero-content { 
  position: absolute; 
  inset: 0; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  gap: 0; 
  padding: 16px; 
  text-align: center; 
  color: #fff;
  z-index: 1;
}
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

/* Abstand/Anordnung der Hero-Buttons - Fixed height to prevent CLS */
.hero-cta-group { 
  display: flex; 
  gap: clamp(12px, 3.5vw, 28px); 
  flex-wrap: wrap; 
  justify-content: center; 
  margin-top: 0;
  /* Reserve space to prevent layout shift */
  min-height: 52px;
}
.hero-cta.alt { background: transparent !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.7) !important; }

@media (max-width: 767px) { .p-button { font-size: 1rem; } }
.hero-cta.p-button .p-button-label { font-weight: 700; letter-spacing: .01em; }

/* Sichtbarkeits-Optimierung für Offscreen-Sektionen */
.cv-auto { content-visibility: auto; contain-intrinsic-size: 1000px; }

/* Dark Mode entfernt - Website läuft permanent im Light Mode */
.stars { 
  display: flex; 
  gap: 2px; 
  align-items: center; 
}
.star { 
  font-size: 1.1rem; 
  line-height: 1; 
  transition: color 0.2s ease;
}
.star-filled { 
  color: #facc15; 
  text-shadow: 0 1px 2px rgba(250, 204, 21, 0.3);
}
.star-empty { 
  color: #e5e7eb; 
}
.testimonial + .testimonial { border-top: 1px solid var(--border); }
.content-box { background: var(--surface); color: var(--text); border-radius: 12px; padding: 16px; box-shadow: 0 6px 20px var(--shadow-color); border: 1px solid var(--border) }
.section-title { color: var(--text); font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }

.offer-card { transition: transform .15s ease, box-shadow .15s ease; }
.offer-link { display: block; text-decoration: none; color: inherit; width: 100%; }
.offer-link:focus .offer-card, .offer-link:hover .offer-card { transform: translateY(-2px); box-shadow: 0 12px 28px var(--shadow-color); }
.offer-thumb { 
  width: 112px; 
  height: 70px; 
  object-fit: cover; 
  object-position: center center;
  border-radius: 3px; 
  border: 1px solid var(--border); 
  background: transparent; 
  overflow: hidden; 
  /* Präzises Seitenverhältnis für Kreditkarten (85.6mm x 53.98mm ≈ 1.586:1) */
  aspect-ratio: 1.586 / 1;
  /* Entferne weiße Ecken durch cover statt contain */
}

/* Premium Sektions-Header */
.about-section-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.about-main-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--text);
  margin: 0 0 1rem 0;
  font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif;
  letter-spacing: -0.02em;
  position: relative;
}

.about-main-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  border-radius: 2px;
}

.about-subtitle {
  font-size: 1.2rem;
  color: var(--muted-text);
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Premium Layout für abwechselnde Bilder links/rechts */
.about-block {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 2.5rem;
  padding: 2rem 0;
  position: relative;
}

.about-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  border-radius: 2px;
  opacity: 0.3;
}

.about-block-reverse {
  flex-direction: row-reverse;
}

.about-content {
  flex: 1;
  min-width: 0;
  position: relative;
}

.about-image {
  flex: 1;
  min-width: 0;
  position: relative;
}

  .about-img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(11, 31, 58, 0.12);
    /* Prevent CLS with explicit dimensions */
    aspect-ratio: 3/2;
    display: block;
  }

.about-img:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 48px rgba(11, 31, 58, 0.2);
}

/* Premium Textsegmente */
.about-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
  padding: 2rem;
  background: linear-gradient(135deg, var(--surface) 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: 20px;
  border: 1px solid rgba(11, 31, 58, 0.08);
  box-shadow: 0 4px 24px rgba(11, 31, 58, 0.06);
  position: relative;
  overflow: hidden;
}

.about-text::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  border-radius: 20px 20px 0 0;
}

.about-text h3 {
  margin-bottom: 1.25rem;
  color: var(--text);
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.about-text p {
  margin: 0;
  line-height: 1.7;
  font-size: 1.05rem;
  color: var(--muted-text);
  position: relative;
  z-index: 1;
}

/* Subtile Animation beim Hover */
.about-text:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(11, 31, 58, 0.12);
}

/* Mobile Layout: Kompakt und elegant */
@media (max-width: 767px) {
  .about-block {
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1.5rem 0;
  }
  
  .about-block::before {
    width: 40px;
    height: 2px;
  }
  
  .about-block-reverse {
    flex-direction: column;
  }
  
  .about-img {
    height: 240px;
    border-radius: 12px;
  }
  
  .about-text {
    min-height: auto;
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .about-text h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .about-text p {
    font-size: 1rem;
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

/* Dark Mode entfernt - Website läuft permanent im Light Mode */
</style>


