// predictive-preloading.js
// Predictive Preloading basierend auf User-Verhalten und Machine Learning

/**
 * Predictive Preloading mit Machine Learning-Ansätzen
 */
export class PredictivePreloader {
  constructor() {
    this.userBehavior = new Map()
    this.predictionModel = new Map()
    this.isEnabled = typeof window !== 'undefined'
    this.isInitialized = false
    
    if (this.isEnabled) {
      this.initializePredictivePreloading()
    }
  }

  /**
   * Initialisiert Predictive Preloading
   */
  initializePredictivePreloading() {
    // User-Verhalten-Tracking
    this.trackUserBehavior()
    
    // Machine Learning-Modell initialisieren
    this.initializePredictionModel()
    
    // Predictive Preloading starten
    this.startPredictivePreloading()
    
    this.isInitialized = true
    console.log('Predictive Preloader initialized')
  }

  /**
   * Trackt User-Verhalten für Predictions
   */
  trackUserBehavior() {
    // Mausbewegungen tracken
    document.addEventListener('mousemove', this.trackMouseMovement.bind(this), { passive: true })
    
    // Scroll-Verhalten tracken
    document.addEventListener('scroll', this.trackScrollBehavior.bind(this), { passive: true })
    
    // Click-Verhalten tracken
    document.addEventListener('click', this.trackClickBehavior.bind(this), { passive: true })
    
    // Touch-Verhalten tracken
    document.addEventListener('touchstart', this.trackTouchBehavior.bind(this), { passive: true })
    
    // Viewport-Änderungen tracken
    this.trackViewportChanges()
  }

  /**
   * Trackt Mausbewegungen
   * @param {MouseEvent} event - Maus-Event
   */
  trackMouseMovement(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.recordBehavior('mouse_hover', url, {
          x: event.clientX,
          y: event.clientY,
          timestamp: Date.now()
        })
      }
    }
  }

  /**
   * Trackt Scroll-Verhalten
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
          this.recordBehavior('viewport_visible', url, {
            scrollTop,
            viewportHeight,
            timestamp: Date.now()
          })
        }
      }
    })
  }

  /**
   * Trackt Click-Verhalten
   * @param {MouseEvent} event - Click-Event
   */
  trackClickBehavior(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.recordBehavior('click', url, {
          timestamp: Date.now()
        })
        
        // Predicte ähnliche Links
        this.predictSimilarLinks(url)
      }
    }
  }

  /**
   * Trackt Touch-Verhalten
   * @param {TouchEvent} event - Touch-Event
   */
  trackTouchBehavior(event) {
    const element = event.target.closest('[data-affiliate-url]')
    if (element) {
      const url = element.dataset.affiliateUrl
      if (url) {
        this.recordBehavior('touch', url, {
          timestamp: Date.now()
        })
      }
    }
  }

  /**
   * Trackt Viewport-Änderungen
   */
  trackViewportChanges() {
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => {
        this.updateViewportPredictions()
      })
      
      resizeObserver.observe(document.body)
    }
  }

  /**
   * Aktualisiert Viewport-Predictions
   */
  updateViewportPredictions() {
    const viewportHeight = window.innerHeight
    const scrollTop = window.pageYOffset
    
    // Finde alle Affiliate-Links im Viewport
    const affiliateElements = document.querySelectorAll('[data-affiliate-url]')
    affiliateElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrollTop
      const elementBottom = elementTop + rect.height
      
      if (elementTop < scrollTop + viewportHeight && elementBottom > scrollTop) {
        const url = element.dataset.affiliateUrl
        if (url) {
          this.recordBehavior('viewport_resize', url, {
            viewportHeight,
            scrollTop,
            timestamp: Date.now()
          })
        }
      }
    })
  }

  /**
   * Zeichnet User-Verhalten auf
   * @param {string} action - Die Aktion
   * @param {string} url - Die URL
   * @param {Object} data - Zusätzliche Daten
   */
  recordBehavior(action, url, data) {
    const behaviorKey = `${action}_${url}`
    const currentTime = Date.now()
    
    if (!this.userBehavior.has(behaviorKey)) {
      this.userBehavior.set(behaviorKey, {
        count: 0,
        lastSeen: currentTime,
        firstSeen: currentTime,
        actions: []
      })
    }
    
    const behavior = this.userBehavior.get(behaviorKey)
    behavior.count++
    behavior.lastSeen = currentTime
    behavior.actions.push({ action, data, timestamp: currentTime })
    
    // Aktualisiere Prediction-Modell
    this.updatePredictionModel(behaviorKey, behavior)
  }

  /**
   * Aktualisiert Prediction-Modell
   * @param {string} behaviorKey - Behavior-Key
   * @param {Object} behavior - Behavior-Daten
   */
  updatePredictionModel(behaviorKey, behavior) {
    const url = behaviorKey.split('_').slice(1).join('_')
    const action = behaviorKey.split('_')[0]
    
    // Berechne Prediction-Score
    const score = this.calculatePredictionScore(behavior)
    
    if (!this.predictionModel.has(url)) {
      this.predictionModel.set(url, {
        totalScore: 0,
        actionScores: {},
        lastUpdated: Date.now()
      })
    }
    
    const model = this.predictionModel.get(url)
    model.totalScore += score
    model.actionScores[action] = (model.actionScores[action] || 0) + score
    model.lastUpdated = Date.now()
    
    // Trigger Predictive Preloading wenn Score hoch genug
    if (score > 0.7) {
      this.triggerPredictivePreload(url)
    }
  }

  /**
   * Berechnet Prediction-Score
   * @param {Object} behavior - Behavior-Daten
   * @returns {number} - Prediction-Score (0-1)
   */
  calculatePredictionScore(behavior) {
    const now = Date.now()
    const timeSinceFirstSeen = now - behavior.firstSeen
    const timeSinceLastSeen = now - behavior.lastSeen
    
    // Basis-Score basierend auf Häufigkeit
    let score = Math.min(behavior.count / 10, 1) // Max 1.0 bei 10+ Interaktionen
    
    // Zeit-Faktor: Neuere Interaktionen haben höhere Gewichtung
    if (timeSinceLastSeen < 30000) { // Letzte 30 Sekunden
      score *= 1.5
    } else if (timeSinceLastSeen < 300000) { // Letzte 5 Minuten
      score *= 1.2
    }
    
    // Kontinuität: Regelmäßige Interaktionen haben höhere Gewichtung
    if (timeSinceFirstSeen > 60000) { // Mehr als 1 Minute aktiv
      score *= 1.3
    }
    
    return Math.min(score, 1.0)
  }

  /**
   * Triggert Predictive Preloading
   * @param {string} url - Die URL
   */
  triggerPredictivePreload(url) {
    // Aggressives Preloading für hoch-scorierte URLs
    this.aggressivePreload(url)
    
    // Predicte ähnliche URLs
    this.predictSimilarUrls(url)
  }

  /**
   * Aggressives Preloading
   * @param {string} url - Die URL
   */
  aggressivePreload(url) {
    try {
      // Verwende alle verfügbaren Preloading-Methoden
      const preloadMethods = [
        () => this.preloadWithLink(url),
        () => this.preloadWithFetch(url),
        () => this.preloadWithIframe(url)
      ]
      
      preloadMethods.forEach(method => {
        try {
          method()
        } catch (error) {
          console.warn('Predictive preload method failed:', error)
        }
      })
      
      console.log('Predictive preload triggered for:', url)
    } catch (error) {
      console.warn('Failed to trigger predictive preload:', error)
    }
  }

  /**
   * Preloading mit Link-Element
   * @param {string} url - Die URL
   */
  preloadWithLink(url) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = 'document'
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  }

  /**
   * Preloading mit Fetch
   * @param {string} url - Die URL
   */
  preloadWithFetch(url) {
    fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit'
    }).catch(() => {}) // Ignoriere Fehler
  }

  /**
   * Preloading mit Iframe
   * @param {string} url - Die URL
   */
  preloadWithIframe(url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.src = url
    document.body.appendChild(iframe)
    
    // Entferne nach 30 Sekunden
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe)
      }
    }, 30000)
  }

  /**
   * Predicte ähnliche URLs
   * @param {string} url - Die URL
   */
  predictSimilarUrls(url) {
    // Finde URLs mit ähnlichen Patterns
    const similarUrls = this.findSimilarUrls(url)
    
    // Preloaded ähnliche URLs
    similarUrls.forEach(similarUrl => {
      if (similarUrl !== url) {
        this.preloadWithLink(similarUrl)
      }
    })
  }

  /**
   * Findet ähnliche URLs
   * @param {string} url - Die URL
   * @returns {Array} - Ähnliche URLs
   */
  findSimilarUrls(url) {
    const similarUrls = []
    
    // Finde URLs mit ähnlichen Domains
    const domain = new URL(url).hostname
    const allUrls = Array.from(this.predictionModel.keys())
    
    allUrls.forEach(otherUrl => {
      try {
        const otherDomain = new URL(otherUrl).hostname
        if (otherDomain === domain && otherUrl !== url) {
          similarUrls.push(otherUrl)
        }
      } catch (error) {
        // Ignoriere ungültige URLs
      }
    })
    
    return similarUrls.slice(0, 3) // Max 3 ähnliche URLs
  }

  /**
   * Predicte ähnliche Links basierend auf Click-Verhalten
   * @param {string} url - Die geklickte URL
   */
  predictSimilarLinks(url) {
    // Finde Links mit ähnlichen Eigenschaften
    const similarLinks = document.querySelectorAll(`[data-affiliate-url]:not([data-affiliate-url="${url}"])`)
    
    // Sortiere nach Ähnlichkeit
    const sortedLinks = Array.from(similarLinks).sort((a, b) => {
      const aScore = this.getLinkScore(a.dataset.affiliateUrl)
      const bScore = this.getLinkScore(b.dataset.affiliateUrl)
      return bScore - aScore
    })
    
    // Preloaded Top 3 ähnliche Links
    sortedLinks.slice(0, 3).forEach(link => {
      const similarUrl = link.dataset.affiliateUrl
      if (similarUrl) {
        this.preloadWithLink(similarUrl)
      }
    })
  }

  /**
   * Gibt Link-Score zurück
   * @param {string} url - Die URL
   * @returns {number} - Link-Score
   */
  getLinkScore(url) {
    const model = this.predictionModel.get(url)
    return model ? model.totalScore : 0
  }

  /**
   * Initialisiert Prediction-Modell
   */
  initializePredictionModel() {
    // Lade gespeicherte Predictions
    this.loadSavedPredictions()
    
    // Starte kontinuierliches Training
    this.startContinuousTraining()
  }

  /**
   * Lädt gespeicherte Predictions
   */
  loadSavedPredictions() {
    try {
      const saved = localStorage.getItem('predictive_preloader_model')
      if (saved) {
        const data = JSON.parse(saved)
        this.predictionModel = new Map(data.predictionModel || [])
        this.userBehavior = new Map(data.userBehavior || [])
      }
    } catch (error) {
      console.warn('Failed to load saved predictions:', error)
    }
  }

  /**
   * Speichert Predictions
   */
  savePredictions() {
    try {
      const data = {
        predictionModel: Array.from(this.predictionModel.entries()),
        userBehavior: Array.from(this.userBehavior.entries()),
        timestamp: Date.now()
      }
      localStorage.setItem('predictive_preloader_model', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save predictions:', error)
    }
  }

  /**
   * Startet kontinuierliches Training
   */
  startContinuousTraining() {
    // Speichere alle 5 Minuten
    setInterval(() => {
      this.savePredictions()
    }, 5 * 60 * 1000)
    
    // Bereinige alte Daten alle 24 Stunden
    setInterval(() => {
      this.cleanupOldData()
    }, 24 * 60 * 60 * 1000)
  }

  /**
   * Bereinigt alte Daten
   */
  cleanupOldData() {
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 Tage
    
    // Bereinige User-Verhalten
    this.userBehavior.forEach((behavior, key) => {
      if (now - behavior.lastSeen > maxAge) {
        this.userBehavior.delete(key)
      }
    })
    
    // Bereinige Prediction-Modell
    this.predictionModel.forEach((model, url) => {
      if (now - model.lastUpdated > maxAge) {
        this.predictionModel.delete(url)
      }
    })
  }

  /**
   * Startet Predictive Preloading
   */
  startPredictivePreloading() {
    // Initiales Predictive Preloading nach 3 Sekunden
    setTimeout(() => {
      this.performInitialPredictivePreload()
    }, 3000)
    
    // Kontinuierliches Predictive Preloading alle 30 Sekunden
    setInterval(() => {
      this.performContinuousPredictivePreload()
    }, 30000)
  }

  /**
   * Führt initiales Predictive Preloading durch
   */
  performInitialPredictivePreload() {
    // Finde URLs mit hohem Score
    const highScoreUrls = Array.from(this.predictionModel.entries())
      .filter(([url, model]) => model.totalScore > 0.5)
      .sort((a, b) => b[1].totalScore - a[1].totalScore)
      .slice(0, 5)
      .map(([url]) => url)
    
    // Preloaded hoch-scorierte URLs
    highScoreUrls.forEach(url => {
      this.aggressivePreload(url)
    })
  }

  /**
   * Führt kontinuierliches Predictive Preloading durch
   */
  performContinuousPredictivePreload() {
    // Aktualisiere Predictions basierend auf aktuellen Viewport-Elementen
    this.updateViewportPredictions()
    
    // Führe Predictive Preloading für neue hoch-scorierte URLs durch
    this.performInitialPredictivePreload()
  }

  /**
   * Gibt Prediction-Statistiken zurück
   * @returns {Object} - Prediction-Statistiken
   */
  getPredictionStats() {
    const totalUrls = this.predictionModel.size
    const totalBehaviors = this.userBehavior.size
    const highScoreUrls = Array.from(this.predictionModel.values())
      .filter(model => model.totalScore > 0.5).length
    
    return {
      totalUrls,
      totalBehaviors,
      highScoreUrls,
      isInitialized: this.isInitialized,
      topPredictions: this.getTopPredictions(5)
    }
  }

  /**
   * Gibt Top-Predictions zurück
   * @param {number} limit - Anzahl der Top-Predictions
   * @returns {Array} - Top-Predictions
   */
  getTopPredictions(limit = 5) {
    return Array.from(this.predictionModel.entries())
      .sort((a, b) => b[1].totalScore - a[1].totalScore)
      .slice(0, limit)
      .map(([url, model]) => ({
        url,
        score: model.totalScore,
        lastUpdated: model.lastUpdated
      }))
  }
}

// Singleton-Instanz
export const predictivePreloader = new PredictivePreloader()

/**
 * Vue-Composable für Predictive Preloading
 * @returns {Object} - Predictive-Preloading-Funktionen
 */
export function usePredictivePreloading() {
  const getStats = () => {
    return predictivePreloader.getPredictionStats()
  }
  
  const getTopPredictions = (limit) => {
    return predictivePreloader.getTopPredictions(limit)
  }
  
  const triggerPreload = (url) => {
    predictivePreloader.triggerPredictivePreload(url)
  }
  
  return {
    getStats,
    getTopPredictions,
    triggerPreload
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Predictive Preloader initialized:', predictivePreloader.getPredictionStats())
    })
  } else {
    console.log('Predictive Preloader initialized:', predictivePreloader.getPredictionStats())
  }
}
