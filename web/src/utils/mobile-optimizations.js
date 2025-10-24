// mobile-optimizations.js
// Mobile-spezifische Optimierungen für Kreditkarten und Touch-Performance

/**
 * Mobile Touch-Optimierungen für Kreditkarten-Buttons
 */
export class MobileTouchOptimizer {
  constructor() {
    this.isMobile = this.detectMobile()
    this.touchStartTime = 0
    this.touchEndTime = 0
    this.isEnabled = typeof window !== 'undefined'
    
    if (this.isEnabled && this.isMobile) {
      this.initializeTouchOptimizations()
    }
  }

  /**
   * Erkennt mobile Geräte
   * @returns {boolean} - True wenn mobile
   */
  detectMobile() {
    if (typeof window === 'undefined') return false
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           ('ontouchstart' in window)
  }

  /**
   * Initialisiert Touch-Optimierungen
   */
  initializeTouchOptimizations() {
    // Touch-Event-Optimierungen
    this.optimizeTouchEvents()
    
    // Button-Optimierungen
    this.optimizeButtons()
    
    // Scroll-Optimierungen
    this.optimizeScrolling()
    
    // Preloading-Optimierungen
    this.optimizePreloading()
  }

  /**
   * Optimiert Touch-Events für bessere Performance
   */
  optimizeTouchEvents() {
    // Passive Touch-Events für bessere Scroll-Performance
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true })
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true })
  }

  /**
   * Behandelt Touch-Start für sofortiges Preloading
   * @param {TouchEvent} event - Touch-Event
   */
  handleTouchStart(event) {
    this.touchStartTime = performance.now()
    
    const target = event.target.closest('[data-affiliate-url]')
    if (target) {
      const url = target.dataset.affiliateUrl
      if (url) {
        // Sofortiges Preloading bei Touch-Start
        this.preloadOnTouch(url)
      }
    }
  }

  /**
   * Behandelt Touch-End für optimierte Navigation
   * @param {TouchEvent} event - Touch-Event
   */
  handleTouchEnd(event) {
    this.touchEndTime = performance.now()
    const touchDuration = this.touchEndTime - this.touchStartTime
    
    // Nur bei kurzen Touches (kein Scroll)
    if (touchDuration < 200) {
      const target = event.target.closest('[data-affiliate-url]')
      if (target) {
        const url = target.dataset.affiliateUrl
        if (url) {
          // Aggressives Preloading bei Touch
          this.aggressivePreloadOnTouch(url)
        }
      }
    }
  }

  /**
   * Behandelt Touch-Move für Scroll-Optimierung
   * @param {TouchEvent} event - Touch-Event
   */
  handleTouchMove(event) {
    // Scroll-Optimierungen
    this.optimizeScrollPerformance()
  }

  /**
   * Preloaded bei Touch-Start
   * @param {string} url - Die URL
   */
  preloadOnTouch(url) {
    try {
      // Dynamischer Import für Preloading
      import('./affiliate-links.js').then(({ preloadAffiliateLink }) => {
        preloadAffiliateLink(url, {
          aggressive: true,
          preconnect: true,
          prefetch: true
        })
      })
    } catch (error) {
      console.warn('Mobile preload failed:', error)
    }
  }

  /**
   * Aggressives Preloading bei Touch
   * @param {string} url - Die URL
   */
  aggressivePreloadOnTouch(url) {
    try {
      // Aggressives Preloading mit allen Optimierungen
      import('./affiliate-links.js').then(({ preloadAffiliateLink }) => {
        preloadAffiliateLink(url, {
          aggressive: true,
          preconnect: true,
          prefetch: true,
          prerender: true // Prerender bei Touch
        })
      })
    } catch (error) {
      console.warn('Aggressive mobile preload failed:', error)
    }
  }

  /**
   * Optimiert Buttons für mobile Performance
   */
  optimizeButtons() {
    // Füge mobile-spezifische CSS-Klassen hinzu
    const style = document.createElement('style')
    style.textContent = `
      /* Mobile Touch-Optimierungen */
      @media (max-width: 768px) {
        .apply-cta {
          min-height: 48px !important;
          min-width: 48px !important;
          touch-action: manipulation !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }
        
        .apply-cta:active {
          transform: scale(0.98) !important;
          transition: transform 0.1s ease !important;
        }
        
        /* Optimierte Button-Größen für Touch */
        .p-button {
          min-height: 44px !important;
          padding: 12px 16px !important;
          font-size: 16px !important;
          line-height: 1.2 !important;
        }
        
        /* Touch-freundliche Abstände */
        .action-buttons {
          gap: 12px !important;
        }
        
        /* Optimierte Card-Interaktion */
        .offer-card {
          touch-action: manipulation !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        .offer-card:active {
          transform: scale(0.99) !important;
          transition: transform 0.1s ease !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Optimiert Scrolling für mobile Performance
   */
  optimizeScrolling() {
    // Smooth Scrolling optimieren
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Touch-Scroll-Optimierungen
    document.body.style.webkitOverflowScrolling = 'touch'
    
    // Scroll-Performance optimieren
    let ticking = false
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-Optimierungen hier
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', optimizeScroll, { passive: true })
  }

  /**
   * Optimiert Preloading für mobile Geräte
   */
  optimizePreloading() {
    // Mobile-spezifische Preloading-Strategien
    if (this.isMobile) {
      // Aggressiveres Preloading auf mobilen Geräten
      this.initializeMobilePreloading()
    }
  }

  /**
   * Initialisiert mobile-spezifisches Preloading
   */
  initializeMobilePreloading() {
    // Preloaded kritische Links sofort auf mobilen Geräten
    setTimeout(() => {
      this.preloadCriticalMobileLinks()
    }, 1000)
  }

  /**
   * Preloaded kritische Links für mobile Geräte
   */
  async preloadCriticalMobileLinks() {
    try {
      // Importiere alle Daten
      const { offers } = await import('../data/offers.js')
      
      // Top 3 Kreditkarten für mobile
      const criticalUrls = offers
        .filter(offer => offer.applyUrl && /^https?:\/\//i.test(offer.applyUrl))
        .slice(0, 3)
        .map(offer => offer.applyUrl)
      
      // Aggressives Preloading
      const { instantPreloadCriticalLinks } = await import('./affiliate-links.js')
      instantPreloadCriticalLinks(criticalUrls)
      
      console.log('Mobile critical links preloaded:', criticalUrls.length)
    } catch (error) {
      console.warn('Failed to preload mobile critical links:', error)
    }
  }

  /**
   * Optimiert Scroll-Performance
   */
  optimizeScrollPerformance() {
    // Scroll-Performance-Optimierungen
    if (this.isMobile) {
      // Reduziere Scroll-Events auf mobilen Geräten
      this.throttleScrollEvents()
    }
  }

  /**
   * Throttled Scroll-Events für bessere Performance
   */
  throttleScrollEvents() {
    let scrollTimeout
    const throttledScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollTimeout = setTimeout(() => {
        // Scroll-Optimierungen hier
      }, 16) // 60fps
    }
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
  }

  /**
   * Gibt Mobile-Status zurück
   * @returns {boolean} - True wenn mobile
   */
  isMobileDevice() {
    return this.isMobile
  }

  /**
   * Gibt Touch-Performance-Statistiken zurück
   * @returns {Object} - Touch-Statistiken
   */
  getTouchStats() {
    return {
      isMobile: this.isMobile,
      touchStartTime: this.touchStartTime,
      touchEndTime: this.touchEndTime,
      touchDuration: this.touchEndTime - this.touchStartTime
    }
  }
}

// Singleton-Instanz
export const mobileTouchOptimizer = new MobileTouchOptimizer()

/**
 * Vue-Composable für mobile Touch-Optimierungen
 * @returns {Object} - Mobile-Optimierungs-Funktionen
 */
export function useMobileTouchOptimization() {
  const isMobile = () => {
    return mobileTouchOptimizer.isMobileDevice()
  }
  
  const getTouchStats = () => {
    return mobileTouchOptimizer.getTouchStats()
  }
  
  const preloadOnTouch = (url) => {
    if (mobileTouchOptimizer.isMobileDevice()) {
      mobileTouchOptimizer.preloadOnTouch(url)
    }
  }
  
  return {
    isMobile,
    getTouchStats,
    preloadOnTouch
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Mobile Touch Optimizer initialized:', mobileTouchOptimizer.getTouchStats())
    })
  } else {
    console.log('Mobile Touch Optimizer initialized:', mobileTouchOptimizer.getTouchStats())
  }
}
