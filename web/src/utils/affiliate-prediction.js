// affiliate-prediction.js
// Intelligente Affiliate-Link-Prediction basierend auf User-Verhalten

/**
 * Intelligente Affiliate-Link-Prediction für maximale Performance
 */
export class AffiliateLinkPredictor {
  constructor() {
    this.userBehavior = new Map()
    this.predictionCache = new Set()
    this.isEnabled = typeof window !== 'undefined'
    
    if (this.isEnabled) {
      this.initializeTracking()
    }
  }

  /**
   * Initialisiert das User-Verhalten-Tracking
   */
  initializeTracking() {
    // Tracke Mausbewegungen für Hover-Prediction
    document.addEventListener('mousemove', this.trackMouseMovement.bind(this), { passive: true })
    
    // Tracke Scroll-Verhalten für Viewport-Prediction
    document.addEventListener('scroll', this.trackScrollBehavior.bind(this), { passive: true })
    
    // Tracke Click-Verhalten für Click-Prediction
    document.addEventListener('click', this.trackClickBehavior.bind(this), { passive: true })
    
    // Tracke Touch-Verhalten für Mobile-Prediction
    document.addEventListener('touchstart', this.trackTouchBehavior.bind(this), { passive: true })
  }

  /**
   * Trackt Mausbewegungen für Hover-Prediction
   * @param {MouseEvent} event - Mausbewegungs-Event
   */
  trackMouseMovement(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.predictHover(url, element)
      }
    }
  }

  /**
   * Trackt Scroll-Verhalten für Viewport-Prediction
   * @param {Event} event - Scroll-Event
   */
  trackScrollBehavior(event) {
    const viewportHeight = window.innerHeight
    const scrollTop = window.pageYOffset
    
    // Finde alle Affiliate-Links im Viewport
    const affiliateElements = document.querySelectorAll('[data-affiliate-url]')
    affiliateElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrollTop
      const elementBottom = elementTop + rect.height
      
      // Prüfe ob Element im Viewport ist
      if (elementTop < scrollTop + viewportHeight && elementBottom > scrollTop) {
        const url = element.dataset.affiliateUrl
        if (url) {
          this.predictViewport(url, element)
        }
      }
    })
  }

  /**
   * Trackt Click-Verhalten für Click-Prediction
   * @param {MouseEvent} event - Click-Event
   */
  trackClickBehavior(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.predictClick(url, element)
      }
    }
  }

  /**
   * Trackt Touch-Verhalten für Mobile-Prediction
   * @param {TouchEvent} event - Touch-Event
   */
  trackTouchBehavior(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.predictTouch(url, element)
      }
    }
  }

  /**
   * Predicts Hover-Verhalten und preloaded Links
   * @param {string} url - Die Affiliate-URL
   * @param {HTMLElement} element - Das HTML-Element
   */
  predictHover(url, element) {
    if (this.predictionCache.has(url)) return
    
    // Aggressives Preloading bei Hover
    this.preloadAffiliateLink(url, 'hover')
    this.predictionCache.add(url)
    
    // Tracke Hover-Verhalten
    this.trackBehavior('hover', url, element)
  }

  /**
   * Predicts Viewport-Verhalten und preloaded Links
   * @param {string} url - Die Affiliate-URL
   * @param {HTMLElement} element - Das HTML-Element
   */
  predictViewport(url, element) {
    if (this.predictionCache.has(url)) return
    
    // Preloading bei Viewport-Erscheinen
    this.preloadAffiliateLink(url, 'viewport')
    this.predictionCache.add(url)
    
    // Tracke Viewport-Verhalten
    this.trackBehavior('viewport', url, element)
  }

  /**
   * Predicts Click-Verhalten und preloaded Links
   * @param {string} url - Die Affiliate-URL
   * @param {HTMLElement} element - Das HTML-Element
   */
  predictClick(url, element) {
    // Aggressives Preloading bei Click
    this.preloadAffiliateLink(url, 'click')
    
    // Tracke Click-Verhalten
    this.trackBehavior('click', url, element)
    
    // Predicte ähnliche Links basierend auf Click-Verhalten
    this.predictSimilarLinks(url, element)
  }

  /**
   * Predicts Touch-Verhalten und preloaded Links
   * @param {string} url - Die Affiliate-URL
   * @param {HTMLElement} element - Das HTML-Element
   */
  predictTouch(url, element) {
    if (this.predictionCache.has(url)) return
    
    // Preloading bei Touch
    this.preloadAffiliateLink(url, 'touch')
    this.predictionCache.add(url)
    
    // Tracke Touch-Verhalten
    this.trackBehavior('touch', url, element)
  }

  /**
   * Preloaded Affiliate-Link basierend auf Prediction
   * @param {string} url - Die Affiliate-URL
   * @param {string} trigger - Der Trigger-Typ
   */
  preloadAffiliateLink(url, trigger) {
    try {
      // Dynamischer Import für Preloading
      import('./affiliate-links.js').then(({ preloadAffiliateLink }) => {
        preloadAffiliateLink(url, {
          aggressive: true,
          preconnect: true,
          prefetch: true,
          prerender: trigger === 'click' // Prerender nur bei Clicks
        })
      })
    } catch (error) {
      console.warn('Failed to preload affiliate link:', error)
    }
  }

  /**
   * Trackt User-Verhalten für bessere Predictions
   * @param {string} action - Die Aktion (hover, click, etc.)
   * @param {string} url - Die Affiliate-URL
   * @param {HTMLElement} element - Das HTML-Element
   */
  trackBehavior(action, url, element) {
    const behaviorKey = `${action}_${url}`
    const currentTime = Date.now()
    
    if (!this.userBehavior.has(behaviorKey)) {
      this.userBehavior.set(behaviorKey, {
        count: 0,
        lastSeen: currentTime,
        element: element.tagName,
        category: this.getCategoryFromUrl(url)
      })
    }
    
    const behavior = this.userBehavior.get(behaviorKey)
    behavior.count++
    behavior.lastSeen = currentTime
    
    // Sende Analytics-Daten
    this.sendAnalytics(action, url, behavior)
  }

  /**
   * Predicts ähnliche Links basierend auf Click-Verhalten
   * @param {string} url - Die geklickte URL
   * @param {HTMLElement} element - Das geklickte Element
   */
  predictSimilarLinks(url, element) {
    const category = this.getCategoryFromUrl(url)
    const similarElements = document.querySelectorAll(`[data-category="${category}"]`)
    
    // Preloaded ähnliche Links
    similarElements.forEach(similarElement => {
      const similarUrl = similarElement.dataset.affiliateUrl
      if (similarUrl && similarUrl !== url && !this.predictionCache.has(similarUrl)) {
        this.preloadAffiliateLink(similarUrl, 'similar')
        this.predictionCache.add(similarUrl)
      }
    })
  }

  /**
   * Ermittelt die Kategorie aus der URL
   * @param {string} url - Die URL
   * @returns {string} - Die Kategorie
   */
  getCategoryFromUrl(url) {
    if (url.includes('hanseatic') || url.includes('tfbank') || url.includes('netkredit')) {
      return 'creditcard'
    } else if (url.includes('captrader') || url.includes('smartbroker') || url.includes('fidelity')) {
      return 'broker'
    } else if (url.includes('pbb') || url.includes('raisin') || url.includes('distingo')) {
      return 'savings'
    }
    return 'unknown'
  }

  /**
   * Sendet Analytics-Daten für Predictions
   * @param {string} action - Die Aktion
   * @param {string} url - Die URL
   * @param {Object} behavior - Das Verhalten
   */
  sendAnalytics(action, url, behavior) {
    try {
      // Vercel Analytics
      if (window.va) {
        window.va('track', 'affiliate_prediction', {
          action,
          url: url.substring(0, 50), // Kürze URL für Analytics
          category: behavior.category,
          count: behavior.count
        })
      }
      
      // Meta Pixel
      if (window.fbq) {
        window.fbq('trackCustom', 'AffiliatePrediction', {
          action,
          category: behavior.category,
          count: behavior.count
        })
      }
    } catch (error) {
      console.warn('Failed to send prediction analytics:', error)
    }
  }

  /**
   * Gibt Prediction-Statistiken zurück
   * @returns {Object} - Prediction-Statistiken
   */
  getPredictionStats() {
    const stats = {
      totalPredictions: this.predictionCache.size,
      behaviorCount: this.userBehavior.size,
      categories: {},
      topActions: {}
    }
    
    // Analysiere Kategorien
    this.userBehavior.forEach((behavior, key) => {
      const category = behavior.category
      if (!stats.categories[category]) {
        stats.categories[category] = 0
      }
      stats.categories[category]++
      
      const action = key.split('_')[0]
      if (!stats.topActions[action]) {
        stats.topActions[action] = 0
      }
      stats.topActions[action]++
    })
    
    return stats
  }

  /**
   * Bereinigt alte Prediction-Daten
   */
  cleanup() {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden
    
    this.userBehavior.forEach((behavior, key) => {
      if (now - behavior.lastSeen > maxAge) {
        this.userBehavior.delete(key)
      }
    })
    
    // Bereinige Prediction-Cache
    this.predictionCache.clear()
  }
}

// Singleton-Instanz
export const affiliateLinkPredictor = new AffiliateLinkPredictor()

/**
 * Vue-Composable für Affiliate-Link-Prediction
 * @returns {Object} - Prediction-Funktionen
 */
export function useAffiliatePrediction() {
  const getStats = () => {
    return affiliateLinkPredictor.getPredictionStats()
  }
  
  const cleanup = () => {
    affiliateLinkPredictor.cleanup()
  }
  
  return {
    getStats,
    cleanup
  }
}

// Auto-Cleanup alle 6 Stunden
if (typeof window !== 'undefined') {
  setInterval(() => {
    affiliateLinkPredictor.cleanup()
  }, 6 * 60 * 60 * 1000)
}
