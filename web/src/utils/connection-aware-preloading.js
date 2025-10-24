// connection-aware-preloading.js
// Connection-Aware Preloading basierend auf Netzwerkgeschwindigkeit

/**
 * Connection-Aware Preloading für optimale Performance
 */
export class ConnectionAwarePreloader {
  constructor() {
    this.connection = null
    this.isEnabled = typeof window !== 'undefined' && 'connection' in navigator
    this.preloadStrategies = new Map()
    this.isInitialized = false
    
    if (this.isEnabled) {
      this.initializeConnectionAwarePreloading()
    }
  }

  /**
   * Initialisiert Connection-Aware Preloading
   */
  initializeConnectionAwarePreloading() {
    // Prüfe Connection API-Unterstützung
    if (!navigator.connection) {
      console.warn('Connection API not supported, using fallback strategy')
      this.isEnabled = false
      return
    }
    
    this.connection = navigator.connection
    
    // Connection-Strategien definieren
    this.preloadStrategies.set('slow-2g', {
      maxConcurrent: 1,
      delay: 2000,
      timeout: 15000,
      priority: 'low'
    })
    
    this.preloadStrategies.set('2g', {
      maxConcurrent: 2,
      delay: 1000,
      timeout: 12000,
      priority: 'low'
    })
    
    this.preloadStrategies.set('3g', {
      maxConcurrent: 3,
      delay: 500,
      timeout: 10000,
      priority: 'medium'
    })
    
    this.preloadStrategies.set('4g', {
      maxConcurrent: 6,
      delay: 100,
      timeout: 8000,
      priority: 'high'
    })
    
    this.preloadStrategies.set('5g', {
      maxConcurrent: 10,
      delay: 50,
      timeout: 5000,
      priority: 'ultra'
    })
    
    // Connection-Change-Listener
    this.connection.addEventListener('change', this.handleConnectionChange.bind(this))
    
    this.isInitialized = true
    console.log('Connection-Aware Preloader initialized:', this.getConnectionInfo())
  }

  /**
   * Behandelt Connection-Änderungen
   */
  handleConnectionChange() {
    const connectionInfo = this.getConnectionInfo()
    console.log('Connection changed:', connectionInfo)
    
    // Passe Preloading-Strategie an
    this.adaptPreloadingStrategy(connectionInfo)
  }

  /**
   * Gibt Connection-Informationen zurück
   * @returns {Object} - Connection-Info
   */
  getConnectionInfo() {
    if (!this.connection) return { type: 'unknown', effectiveType: 'unknown' }
    
    return {
      type: this.connection.type,
      effectiveType: this.connection.effectiveType,
      downlink: this.connection.downlink,
      rtt: this.connection.rtt,
      saveData: this.connection.saveData
    }
  }

  /**
   * Ermittelt optimale Preloading-Strategie
   * @returns {Object} - Preloading-Strategie
   */
  getOptimalStrategy() {
    const connectionInfo = this.getConnectionInfo()
    const effectiveType = connectionInfo.effectiveType
    
    // Fallback-Strategie
    let strategy = this.preloadStrategies.get('3g')
    
    if (this.preloadStrategies.has(effectiveType)) {
      strategy = this.preloadStrategies.get(effectiveType)
    }
    
    // Anpassungen basierend auf zusätzlichen Faktoren
    if (connectionInfo.saveData) {
      strategy = {
        ...strategy,
        maxConcurrent: Math.max(1, strategy.maxConcurrent - 2),
        delay: strategy.delay * 2,
        priority: 'low'
      }
    }
    
    if (connectionInfo.downlink && connectionInfo.downlink < 1) {
      strategy = {
        ...strategy,
        maxConcurrent: Math.max(1, strategy.maxConcurrent - 1),
        delay: strategy.delay * 1.5
      }
    }
    
    return strategy
  }

  /**
   * Passt Preloading-Strategie an
   * @param {Object} connectionInfo - Connection-Info
   */
  adaptPreloadingStrategy(connectionInfo) {
    const strategy = this.getOptimalStrategy()
    
    // Aktualisiere Background-Preloader
    if (window.backgroundPreloader) {
      window.backgroundPreloader.updateStrategy(strategy)
    }
    
    // Sende Analytics
    this.trackConnectionChange(connectionInfo, strategy)
  }

  /**
   * Trackt Connection-Änderungen
   * @param {Object} connectionInfo - Connection-Info
   * @param {Object} strategy - Preloading-Strategie
   */
  trackConnectionChange(connectionInfo, strategy) {
    try {
      if (window.va) {
        window.va('track', 'connection_change', {
          type: connectionInfo.type,
          effective_type: connectionInfo.effectiveType,
          downlink: connectionInfo.downlink,
          rtt: connectionInfo.rtt,
          save_data: connectionInfo.saveData,
          max_concurrent: strategy.maxConcurrent,
          delay: strategy.delay,
          priority: strategy.priority
        })
      }
    } catch (error) {
      console.warn('Failed to track connection change:', error)
    }
  }

  /**
   * Intelligentes Preloading basierend auf Connection
   * @param {Array} urls - Array von URLs
   * @param {Object} options - Optionen
   */
  intelligentPreload(urls, options = {}) {
    const strategy = this.getOptimalStrategy()
    const connectionInfo = this.getConnectionInfo()
    
    // Filtere URLs basierend auf Priorität
    const filteredUrls = this.filterUrlsByPriority(urls, strategy.priority)
    
    // Batch-Preloading mit Connection-Aware-Delays
    this.batchPreloadWithDelays(filteredUrls, strategy, options)
  }

  /**
   * Filtert URLs basierend auf Priorität
   * @param {Array} urls - Array von URLs
   * @param {string} priority - Priorität
   * @returns {Array} - Gefilterte URLs
   */
  filterUrlsByPriority(urls, priority) {
    // Prioritäts-basierte Filterung
    const priorityMap = {
      'low': 2,      // Nur Top 2 URLs
      'medium': 5,   // Top 5 URLs
      'high': 10,    // Top 10 URLs
      'ultra': 20    // Top 20 URLs
    }
    
    const maxUrls = priorityMap[priority] || 5
    return urls.slice(0, maxUrls)
  }

  /**
   * Batch-Preloading mit Delays
   * @param {Array} urls - Array von URLs
   * @param {Object} strategy - Preloading-Strategie
   * @param {Object} options - Optionen
   */
  batchPreloadWithDelays(urls, strategy, options) {
    const { maxConcurrent, delay } = strategy
    
    // Teile URLs in Batches auf
    const batches = this.chunkArray(urls, maxConcurrent)
    
    batches.forEach((batch, index) => {
      setTimeout(() => {
        this.preloadBatch(batch, options)
      }, index * delay)
    })
  }

  /**
   * Preloaded einen Batch von URLs
   * @param {Array} urls - Array von URLs
   * @param {Object} options - Optionen
   */
  preloadBatch(urls, options) {
    // Verwende Background-Preloader wenn verfügbar
    if (window.backgroundPreloader) {
      window.backgroundPreloader.batchPreload(urls, options)
    } else {
      // Fallback: Direktes Preloading
      urls.forEach(url => {
        this.preloadUrl(url, options)
      })
    }
  }

  /**
   * Preloaded eine einzelne URL
   * @param {string} url - Die URL
   * @param {Object} options - Optionen
   */
  preloadUrl(url, options = {}) {
    try {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      link.as = 'document'
      link.fetchPriority = options.priority || 'low'
      
      document.head.appendChild(link)
      
      // Entferne nach 30 Sekunden
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      }, 30000)
    } catch (error) {
      console.warn('Failed to preload URL:', url, error)
    }
  }

  /**
   * Teilt Array in Chunks auf
   * @param {Array} array - Das Array
   * @param {number} size - Chunk-Größe
   * @returns {Array} - Array von Chunks
   */
  chunkArray(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  /**
   * Gibt optimale Preloading-Einstellungen zurück
   * @returns {Object} - Preloading-Einstellungen
   */
  getOptimalSettings() {
    const strategy = this.getOptimalStrategy()
    const connectionInfo = this.getConnectionInfo()
    
    return {
      strategy,
      connectionInfo,
      recommendations: this.getRecommendations(connectionInfo, strategy)
    }
  }

  /**
   * Gibt Empfehlungen basierend auf Connection zurück
   * @param {Object} connectionInfo - Connection-Info
   * @param {Object} strategy - Preloading-Strategie
   * @returns {Array} - Empfehlungen
   */
  getRecommendations(connectionInfo, strategy) {
    const recommendations = []
    
    if (connectionInfo.saveData) {
      recommendations.push('Data Saver aktiviert - Reduziertes Preloading')
    }
    
    if (connectionInfo.downlink && connectionInfo.downlink < 1) {
      recommendations.push('Langsame Verbindung - Aggressives Preloading deaktiviert')
    }
    
    if (strategy.priority === 'ultra') {
      recommendations.push('Sehr schnelle Verbindung - Maximales Preloading aktiviert')
    }
    
    return recommendations
  }

  /**
   * Gibt Connection-Status zurück
   * @returns {Object} - Connection-Status
   */
  getConnectionStatus() {
    return {
      isInitialized: this.isInitialized,
      isEnabled: this.isEnabled,
      connectionInfo: this.getConnectionInfo(),
      optimalSettings: this.getOptimalSettings()
    }
  }
}

// Singleton-Instanz
export const connectionAwarePreloader = new ConnectionAwarePreloader()

/**
 * Vue-Composable für Connection-Aware Preloading
 * @returns {Object} - Connection-Aware-Funktionen
 */
export function useConnectionAwarePreloading() {
  const intelligentPreload = (urls, options) => {
    connectionAwarePreloader.intelligentPreload(urls, options)
  }
  
  const getConnectionStatus = () => {
    return connectionAwarePreloader.getConnectionStatus()
  }
  
  const getOptimalSettings = () => {
    return connectionAwarePreloader.getOptimalSettings()
  }
  
  return {
    intelligentPreload,
    getConnectionStatus,
    getOptimalSettings
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Connection-Aware Preloader initialized:', connectionAwarePreloader.getConnectionStatus())
    })
  } else {
    console.log('Connection-Aware Preloader initialized:', connectionAwarePreloader.getConnectionStatus())
  }
}
