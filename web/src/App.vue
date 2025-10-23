<template>
  <div class="app-root min-h-screen flex flex-column">
    <!-- Hauptinhalt -->
    <header class="site-header">
      <div class="container header-inner">
        <router-link to="/" class="brand" aria-label="Startseite" @click="closeMenu">
          <span class="brand-mark">
            <img class="brand-logo-img" src="/images/saifin_logo_vectorized_final.svg" alt="Saifin Logo" width="80" height="80" draggable="false" loading="eager" fetchpriority="high" />
          </span>
        </router-link>

        <button class="nav-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Menü umschalten" aria-expanded="isMenuOpen">
          <i class="pi pi-bars"></i>
        </button>

        <nav :class="['site-nav', { 'is-open': isMenuOpen }]" :aria-hidden="!isMenuOpen && !isDesktop">
          <router-link to="/kreditkarten" class="nav-link" @click="closeMenu" @mouseenter="preloadRoute('cards')" rel="prefetch">Kreditkarten</router-link>
          <router-link to="/broker" class="nav-link" @click="closeMenu" @mouseenter="preloadRoute('brokers')" rel="prefetch">Broker</router-link>
          <router-link to="/tagesgeld" class="nav-link" @click="closeMenu" @mouseenter="preloadRoute('savings')" rel="prefetch">Tagesgeldkonto</router-link>
          <router-link to="/ratgeber" class="nav-link" @click="closeMenu" @mouseenter="preloadRoute('guide')" rel="prefetch">Ratgeber</router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <ErrorBoundary>
        <router-view />
      </ErrorBoundary>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>© {{ new Date().getFullYear() }} Saifin</span>
        <span class="sep">·</span>
        <router-link to="/datenschutz" class="footer-link">Datenschutz</router-link>
        <span class="sep">·</span>
        <router-link to="/impressum" class="footer-link">Impressum</router-link>
        <span class="sep">·</span>
        <router-link :to="{ path: '/', hash: '#about' }" class="footer-link">Über uns</router-link>
        <span class="sep">·</span>
        <router-link to="/kontakt" class="footer-link">Kontakt</router-link>
      </div>
    </footer>
    
    <!-- Speed Insights für Performance-Monitoring -->
    <SpeedInsights />
    
    <!-- Vercel Analytics -->
    <VercelAnalytics />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SpeedInsights from './components/SpeedInsights.vue'
import VercelAnalytics from './components/VercelAnalytics.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { preloadRoute } from './utils/navigation'

const isMenuOpen = ref(false)
const isDesktop = ref(false)

const closeMenu = () => { isMenuOpen.value = false }


onMounted(() => {
  // Bereinige alle Passwort-bezogenen localStorage-Daten (non-blocking)
  requestAnimationFrame(() => {
    try {
      localStorage.removeItem('siteAuthenticated')
      localStorage.removeItem('password')
      localStorage.removeItem('isAuthenticated')
    } catch (_) {}
  })
  
  // Setup media query for navigation visibility
  const mediaQuery = window.matchMedia('(min-width: 768px)')
  const updateDesktop = () => { isDesktop.value = mediaQuery.matches }
  mediaQuery.addEventListener('change', updateDesktop)
  updateDesktop()
})
</script>

<style>
/* Layout helpers */
.app-root { background: var(--background); color: var(--text); }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

/* Mobile Optimierung für Container */
@media (max-width: 767px) {
  .container { padding: 0 12px; }
}

/* Header - OPTIMIZED for CLS */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #141833;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  /* Fixed height to prevent CLS */
  min-height: 96px;
  contain: layout style;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96px;
  /* Prevent layout shifts */
  min-height: 96px;
}

/* Mobile Header - noch dünner */
@media (max-width: 767px) {
  .site-header {
    min-height: 56px;
  }
  .header-inner {
    height: 56px;
    min-height: 56px;
  }
  .brand-mark {
    width: 50px;
    height: 50px;
  }
}
.brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-name { font-weight: 800; color: var(--brand-primary-contrast); letter-spacing: -0.01em; font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }
.brand-mark { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; display: inline-block; }
.brand-logo-img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; }

/* Verhindere Text-Cursor/Selektion über dem Logo */
.brand, .brand * { cursor: pointer; user-select: none; -webkit-user-select: none; }
.brand-logo-img { -webkit-user-drag: none; user-select: none; }

/* Navigation */
.site-nav { display: none; gap: 20px; align-items: center; }
.nav-link { color: var(--brand-primary-contrast); text-decoration: none; font-weight: 600; padding: 6px 0; border-bottom: 2px solid transparent; opacity: 0.95; }
.nav-link:hover { color: var(--brand-primary-contrast); border-bottom-color: rgba(255, 255, 255, 0.5); opacity: 1; }
/* Überschreibe globale Link-Hover-Farbe im Header */
.site-header a { color: var(--brand-primary-contrast); }
.site-header a:hover { color: var(--brand-primary-contrast); }

.nav-toggle { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: transparent; color: var(--brand-primary-contrast); cursor: pointer; border-radius: 8px; }
.nav-toggle:hover { background: rgba(255, 255, 255, 0.08); }

/* Desktop breakpoint */
@media (min-width: 768px) {
  .site-nav { display: inline-flex; }
  .nav-toggle { display: none; }
}

/* Mobile Dropdown */
.site-nav.is-open {
  display: flex;
  position: absolute;
  top: 96px;
  left: 0; right: 0;
  flex-direction: column;
  background: var(--saifin-navy-900);
  padding: 12px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 10px 20px rgba(0,0,0,0.18);
}
.site-nav.is-open .nav-link { padding: 10px 4px; }

/* Footer - OPTIMIZED for CLS */
.site-footer { 
  border-top: 1px solid var(--border); 
  background: var(--surface);
  /* Fixed height to prevent CLS */
  min-height: 60px;
  contain: layout style;
}
.footer-inner { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px; 
  padding: 18px 16px; 
  color: var(--muted-text); 
  font-size: 0.9rem;
  /* Prevent layout shifts */
  min-height: 60px;
}
.footer-link { color: var(--link-color); text-decoration: none; }
.footer-link:hover { text-decoration: underline; }
.sep { color: var(--subtle-text); }
</style>
