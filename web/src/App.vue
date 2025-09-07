<template>
  <div class="app-root min-h-screen flex flex-column">
    <!-- Hauptinhalt -->
    <header class="site-header">
      <div class="container header-inner">
        <router-link to="/" class="brand" aria-label="Startseite">
          <span class="brand-mark">
            <img class="brand-logo-img" src="/images/saifin_logo_exact.svg" alt="" @error="(e) => (e.target.src = '/images/saifin_logo_square_originalscale.svg')" />
          </span>
          <span class="brand-name">Saifin</span>
        </router-link>

        <button class="nav-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Menü umschalten">
          <i class="pi pi-bars"></i>
        </button>

        <nav :class="['site-nav', { 'is-open': isMenuOpen }]">
          <router-link to="/kreditkarten" class="nav-link" @click="closeMenu">Kreditkarten</router-link>
          <router-link :to="{ path: '/', hash: '#about' }" class="nav-link" @click="closeMenu">Über uns</router-link>
          <router-link to="/kontakt" class="nav-link" @click="closeMenu">Kontakt</router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>© {{ new Date().getFullYear() }} Saifin</span>
        <span class="sep">·</span>
        <router-link to="/datenschutz" class="footer-link">Datenschutz</router-link>
        <span class="sep">·</span>
        <router-link to="/impressum" class="footer-link">Impressum</router-link>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMenuOpen = ref(false)

const closeMenu = () => { isMenuOpen.value = false }

onMounted(() => {
  // Bereinige alle Passwort-bezogenen localStorage-Daten
  localStorage.removeItem('siteAuthenticated')
  localStorage.removeItem('password')
  localStorage.removeItem('isAuthenticated')
})
</script>

<style>
/* Layout helpers */
.app-root { background: #fff; color: #0f172a; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(180deg, var(--saifin-navy-900), var(--saifin-navy-800));
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.brand-name { font-weight: 800; color: var(--brand-primary-contrast); letter-spacing: -0.01em; font-family: 'Cinzel', ui-serif, Georgia, 'Times New Roman', serif; }
.brand-mark { width: 44px; height: 44px; border-radius: 8px; overflow: hidden; display: inline-block; }
.brand-logo-img { width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; filter: brightness(0.92) saturate(1.05); }

/* Navigation */
.site-nav { display: none; gap: 20px; align-items: center; }
.nav-link { color: var(--brand-primary-contrast); text-decoration: none; font-weight: 600; padding: 6px 0; border-bottom: 2px solid transparent; opacity: 0.95; }
.nav-link:hover { border-bottom-color: rgba(255, 255, 255, 0.4); opacity: 1; }

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
  top: 64px;
  left: 0; right: 0;
  flex-direction: column;
  background: var(--saifin-navy-900);
  padding: 12px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 10px 20px rgba(0,0,0,0.18);
}
.site-nav.is-open .nav-link { padding: 10px 4px; }

/* Footer */
.site-footer { border-top: 1px solid rgba(11,31,58,0.15); background: #ffffff; }
.footer-inner { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 18px 16px; color: #4b5563; font-size: 0.9rem; }
.footer-link { color: var(--brand-primary); text-decoration: none; }
.footer-link:hover { text-decoration: underline; }
.sep { color: #9ca3af; }
</style>
