// affiliate-performance.js
// Performance-Monitoring für Affiliate-Links

/**
 * Performance-Metriken für Affiliate-Links sammeln
 */
export class AffiliatePerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.isEnabled = typeof window !== 'undefined' && 'performance' in window
  }

  /**
   * Startet Performance-Messung für einen Affiliate-Link
   * @param {string} url - Die Affiliate-URL
   * @param {string} productId - Produkt-ID für Tracking
   * @returns {string} - Eindeutige Mess-ID
   */
  startMeasurement(url, productId) {
    if (!this.isEnabled) return null

    const measurementId = `${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.metrics.set(measurementId, {
      url,
      productId,
      startTime: performance.now(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    })

    return measurementId
  }

  /**
   * Beendet Performance-Messung
   * @param {string} measurementId - Die Mess-ID
   * @param {Object} additionalData - Zusätzliche Daten
   */
  endMeasurement(measurementId, additionalData = {}) {
    if (!this.isEnabled || !measurementId) return

    const metric = this.metrics.get(measurementId)
    if (!metric) return

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    const finalMetric = {
      ...metric,
      ...additionalData,
      endTime,
      duration,
      completed: true
    }

    this.metrics.set(measurementId, finalMetric)
    
    // Sende Metriken an Analytics
    this.sendMetrics(finalMetric)
    
    // Cleanup nach 5 Minuten
    setTimeout(() => {
      this.metrics.delete(measurementId)
    }, 300000)
  }

  /**
   * Sendet Performance-Metriken an Analytics-Services
   * @param {Object} metric - Die Performance-Metrik
   */
  sendMetrics(metric) {
    try {
      // Vercel Analytics
      if (window.va) {
        window.va('track', 'affiliate_link_performance', {
          product_id: metric.productId,
          duration: Math.round(metric.duration),
          connection_type: metric.connectionType,
          success: metric.success !== false
        })
      }

      // Meta Pixel
      if (window.fbq) {
        window.fbq('trackCustom', 'AffiliateLinkPerformance', {
          content_id: metric.productId,
          value: Math.round(metric.duration),
          currency: 'EUR',
          custom_data: {
            connection_type: metric.connectionType,
            duration_ms: Math.round(metric.duration)
          }
        })
      }

      // TikTok Pixel
      if (window.ttq) {
        window.ttq.track('AffiliateLinkPerformance', {
          content_id: metric.productId,
          value: Math.round(metric.duration),
          currency: 'EUR',
          connection_type: metric.connectionType
        })
      }

      // Console Log für Development
      if (process.env.NODE_ENV === 'development') {
        console.log('Affiliate Performance Metric:', metric)
      }
    } catch (error) {
      console.error('Error sending affiliate performance metrics:', error)
    }
  }

  /**
   * Ermittelt den Verbindungstyp des Users
   * @returns {string} - Verbindungstyp
   */
  getConnectionType() {
    if (!navigator.connection) return 'unknown'
    
    const connection = navigator.connection
    return connection.effectiveType || connection.type || 'unknown'
  }

  /**
   * Sammelt Core Web Vitals für Affiliate-Links
   * @param {string} measurementId - Die Mess-ID
   */
  collectWebVitals(measurementId) {
    if (!this.isEnabled || !measurementId) return

    const metric = this.metrics.get(measurementId)
    if (!metric) return

    // LCP (Largest Contentful Paint) - falls verfügbar
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          if (lastEntry && lastEntry.startTime) {
            metric.lcp = lastEntry.startTime
            this.metrics.set(measurementId, metric)
          }
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Cleanup nach 10 Sekunden
        setTimeout(() => {
          observer.disconnect()
        }, 10000)
      } catch (error) {
        // PerformanceObserver nicht unterstützt
      }
    }
  }

  /**
   * Erstellt Performance-Report
   * @returns {Object} - Performance-Report
   */
  getPerformanceReport() {
    const allMetrics = Array.from(this.metrics.values())
    const completedMetrics = allMetrics.filter(m => m.completed)

    if (completedMetrics.length === 0) {
      return {
        totalMeasurements: 0,
        averageDuration: 0,
        successRate: 0
      }
    }

    const totalDuration = completedMetrics.reduce((sum, m) => sum + m.duration, 0)
    const successfulMeasurements = completedMetrics.filter(m => m.success !== false).length

    return {
      totalMeasurements: completedMetrics.length,
      averageDuration: Math.round(totalDuration / completedMetrics.length),
      successRate: Math.round((successfulMeasurements / completedMetrics.length) * 100),
      connectionTypes: this.getConnectionTypeDistribution(completedMetrics),
      slowestLinks: this.getSlowestLinks(completedMetrics, 5)
    }
  }

  /**
   * Verteilung der Verbindungstypen
   * @param {Array} metrics - Alle Metriken
   * @returns {Object} - Verteilung
   */
  getConnectionTypeDistribution(metrics) {
    const distribution = {}
    metrics.forEach(metric => {
      const type = metric.connectionType
      distribution[type] = (distribution[type] || 0) + 1
    })
    return distribution
  }

  /**
   * Langsamste Affiliate-Links
   * @param {Array} metrics - Alle Metriken
   * @param {number} limit - Anzahl der langsamsten Links
   * @returns {Array} - Langsamste Links
   */
  getSlowestLinks(metrics, limit = 5) {
    return metrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit)
      .map(metric => ({
        productId: metric.productId,
        duration: Math.round(metric.duration),
        connectionType: metric.connectionType
      }))
  }
}

// Singleton-Instanz
export const affiliatePerformanceMonitor = new AffiliatePerformanceMonitor()

/**
 * Hook für Vue-Komponenten
 * @param {string} productId - Produkt-ID
 * @returns {Object} - Performance-Hook
 */
export function useAffiliatePerformance(productId) {
  const startMeasurement = (url) => {
    return affiliatePerformanceMonitor.startMeasurement(url, productId)
  }

  const endMeasurement = (measurementId, success = true) => {
    affiliatePerformanceMonitor.endMeasurement(measurementId, { success })
  }

  const collectWebVitals = (measurementId) => {
    affiliatePerformanceMonitor.collectWebVitals(measurementId)
  }

  return {
    startMeasurement,
    endMeasurement,
    collectWebVitals,
    getReport: () => affiliatePerformanceMonitor.getPerformanceReport()
  }
}
