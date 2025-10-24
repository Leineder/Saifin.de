// global-affiliate-manager.js
// Globales Affiliate-Link-Management für die gesamte Anwendung

import { batchPreloadAffiliateLinks, preloadAffiliateLink } from './affiliate-links.js'
import { affiliatePerformanceMonitor } from './affiliate-performance.js'
import { trackingSafeBatchPreload, trackingSafePreload } from './tracking-safe-preloading.js'

/**
 * Globaler Affiliate-Link-Manager
 * Verwaltet alle Affiliate-Links zentral und optimiert deren Performance
 */
export class GlobalAffiliateManager {
  constructor() {
    this.preloadedUrls = new Set()
    this.performanceMetrics = new Map()
    this.isInitialized = false
  }

  /**
   * Initialisiert den globalen Affiliate-Manager
   */
  async initialize() {
    if (this.isInitialized) return

    try {
      // Preload kritische Affiliate-Links nach 2 Sekunden
      setTimeout(() => {
        this.preloadCriticalLinks()
      }, 2000)

      // Preload weitere Links nach 5 Sekunden
      setTimeout(() => {
        this.preloadSecondaryLinks()
      }, 5000)

      this.isInitialized = true
      console.log('Global Affiliate Manager initialized')
    } catch (error) {
      console.error('Failed to initialize Global Affiliate Manager:', error)
    }
  }

  /**
   * Preloadet die kritischsten Affiliate-Links (tracking-sicher)
   */
  async preloadCriticalLinks() {
    try {
      // Importiere alle Daten dynamisch
      const { offers } = await import('../data/offers.js')
      const { brokers } = await import('../data/brokers.js')
      const { savingsOffers } = await import('../data/savings.js')

      const criticalUrls = [
        // Top 2 Kreditkarten
        ...offers
          .filter(offer => offer.applyUrl && /^https?:\/\//i.test(offer.applyUrl))
          .slice(0, 2)
          .map(offer => offer.applyUrl),
        
        // Top 1 Broker
        ...brokers
          .filter(broker => broker.applyUrl && /^https?:\/\//i.test(broker.applyUrl))
          .slice(0, 1)
          .map(broker => broker.applyUrl),
        
        // Top 1 Tagesgeld
        ...savingsOffers
          .filter(savings => savings.applyUrl && /^https?:\/\//i.test(savings.applyUrl))
          .slice(0, 1)
          .map(savings => savings.applyUrl)
      ].filter(url => !this.preloadedUrls.has(url))

      if (criticalUrls.length > 0) {
        // Verwende tracking-sichere Batch-Preloading
        trackingSafeBatchPreload(criticalUrls, 200, { 
          dnsOnly: true, 
          maxConcurrent: 2,
          preserveTracking: false 
        })
        criticalUrls.forEach(url => this.preloadedUrls.add(url))
        console.log(`Tracking-safe preloaded ${criticalUrls.length} critical affiliate links`)
      }
    } catch (error) {
      console.error('Failed to preload critical links:', error)
    }
  }

  /**
   * Preloadet sekundäre Affiliate-Links (tracking-sicher)
   */
  async preloadSecondaryLinks() {
    try {
      const { offers } = await import('../data/offers.js')
      const { brokers } = await import('../data/brokers.js')
      const { savingsOffers } = await import('../data/savings.js')

      const secondaryUrls = [
        // Weitere Kreditkarten
        ...offers
          .filter(offer => offer.applyUrl && /^https?:\/\//i.test(offer.applyUrl))
          .slice(2, 4) // Reduziert von 5 auf 4
          .map(offer => offer.applyUrl),
        
        // Weitere Broker
        ...brokers
          .filter(broker => broker.applyUrl && /^https?:\/\//i.test(broker.applyUrl))
          .slice(1, 2) // Reduziert von 3 auf 2
          .map(broker => broker.applyUrl),
        
        // Weitere Tagesgeld
        ...savingsOffers
          .filter(savings => savings.applyUrl && /^https?:\/\//i.test(savings.applyUrl))
          .slice(1, 2) // Reduziert von 3 auf 2
          .map(savings => savings.applyUrl)
      ].filter(url => !this.preloadedUrls.has(url))

      if (secondaryUrls.length > 0) {
        // Verwende tracking-sichere Batch-Preloading
        trackingSafeBatchPreload(secondaryUrls, 300, { 
          dnsOnly: true, 
          maxConcurrent: 1,
          preserveTracking: false 
        })
        secondaryUrls.forEach(url => this.preloadedUrls.add(url))
        console.log(`Tracking-safe preloaded ${secondaryUrls.length} secondary affiliate links`)
      }
    } catch (error) {
      console.error('Failed to preload secondary links:', error)
    }
  }

  /**
   * Preloadet einen spezifischen Affiliate-Link (tracking-sicher)
   * @param {string} url - Die URL zum Preloaden
   * @param {string} category - Kategorie (cards, brokers, savings)
   */
  preloadAffiliateLink(url, category = 'unknown') {
    if (!url || this.preloadedUrls.has(url)) return

    try {
      // Verwende tracking-sichere Preloading-Funktion
      trackingSafePreload(url, { 
        dnsOnly: true, 
        preserveTracking: false 
      })
      this.preloadedUrls.add(url)
      
      // Track Preload-Performance
      this.trackPreloadPerformance(url, category)
    } catch (error) {
      console.error('Failed to preload affiliate link:', error)
    }
  }

  /**
   * Trackt die Performance von Preload-Operationen
   * @param {string} url - Die preloaded URL
   * @param {string} category - Kategorie
   */
  trackPreloadPerformance(url, category) {
    const startTime = performance.now()
    
    // Simuliere Performance-Tracking
    setTimeout(() => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.performanceMetrics.set(url, {
        category,
        preloadDuration: duration,
        timestamp: new Date().toISOString(),
        success: true
      })
    }, 100)
  }

  /**
   * Gibt Performance-Statistiken zurück
   * @returns {Object} Performance-Statistiken
   */
  getPerformanceStats() {
    const stats = {
      totalPreloaded: this.preloadedUrls.size,
      categories: {},
      averagePreloadTime: 0,
      successRate: 0
    }

    let totalDuration = 0
    let successCount = 0

    this.performanceMetrics.forEach((metric, url) => {
      const category = metric.category
      if (!stats.categories[category]) {
        stats.categories[category] = { count: 0, totalDuration: 0 }
      }
      
      stats.categories[category].count++
      stats.categories[category].totalDuration += metric.preloadDuration
      totalDuration += metric.preloadDuration
      
      if (metric.success) successCount++
    })

    if (this.performanceMetrics.size > 0) {
      stats.averagePreloadTime = totalDuration / this.performanceMetrics.size
      stats.successRate = (successCount / this.performanceMetrics.size) * 100
    }

    return stats
  }

  /**
   * Gibt alle preloaded URLs zurück
   * @returns {Set} Set der preloaded URLs
   */
  getPreloadedUrls() {
    return new Set(this.preloadedUrls)
  }

  /**
   * Prüft ob eine URL bereits preloaded wurde
   * @param {string} url - Die zu prüfende URL
   * @returns {boolean} True wenn preloaded
   */
  isPreloaded(url) {
    return this.preloadedUrls.has(url)
  }

  /**
   * Bereinigt alte Performance-Metriken
   */
  cleanup() {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden

    this.performanceMetrics.forEach((metric, url) => {
      const metricTime = new Date(metric.timestamp).getTime()
      if (now - metricTime > maxAge) {
        this.performanceMetrics.delete(url)
      }
    })
  }
}

// Singleton-Instanz
export const globalAffiliateManager = new GlobalAffiliateManager()

/**
 * Vue-Composable für globales Affiliate-Management
 * @returns {Object} Affiliate-Management-Funktionen
 */
export function useGlobalAffiliateManager() {
  const preloadLink = (url, category) => {
    globalAffiliateManager.preloadAffiliateLink(url, category)
  }

  const isPreloaded = (url) => {
    return globalAffiliateManager.isPreloaded(url)
  }

  const getStats = () => {
    return globalAffiliateManager.getPerformanceStats()
  }

  const initialize = () => {
    return globalAffiliateManager.initialize()
  }

  return {
    preloadLink,
    isPreloaded,
    getStats,
    initialize
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalAffiliateManager.initialize()
    })
  } else {
    globalAffiliateManager.initialize()
  }
}
