<template>
  <div class="app-root min-h-screen flex flex-column">
    <!-- Hauptinhalt -->
    <header class="site-header">
      <div class="container header-inner">
        <router-link to="/" class="brand" aria-label="Startseite">
          <span class="brand-logo" aria-hidden="true"></span>
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
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
.brand-name { font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
.brand-logo {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #111827, #374151);
}

/* Navigation */
.site-nav { display: none; gap: 20px; align-items: center; }
.nav-link { color: #0f172a; text-decoration: none; font-weight: 600; padding: 6px 0; border-bottom: 2px solid transparent; }
.nav-link:hover { border-bottom-color: rgba(15, 23, 42, 0.3); }

.nav-toggle { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: transparent; color: #0f172a; cursor: pointer; border-radius: 8px; }
.nav-toggle:hover { background: rgba(15, 23, 42, 0.06); }

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
  background: #ffffff;
  padding: 12px 16px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 20px rgba(0,0,0,0.06);
}
.site-nav.is-open .nav-link { padding: 10px 4px; }

/* Footer */
.site-footer { border-top: 1px solid #e5e7eb; background: #f7f7f7; }
.footer-inner { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 18px 16px; color: #6b7280; font-size: 0.9rem; }
.footer-link { color: inherit; text-decoration: none; }
.footer-link:hover { text-decoration: underline; }
.sep { color: #9ca3af; }
</style>
