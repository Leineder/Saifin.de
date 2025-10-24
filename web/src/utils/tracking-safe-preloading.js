// tracking-safe-preloading.js
// Tracking-sichere Preloading-Implementierung die Conversion-Pixel nicht vorzeitig auslöst

/**
 * Tracking-sichere Preloading-Funktionen
 * Diese Implementierung verhindert, dass Tracking-Pixel und Conversion-Codes
 * durch Preloading vorzeitig ausgelöst werden
 */

/**
 * Tracking-sichere Preloading-Optionen
 */
const TRACKING_SAFE_OPTIONS = {
  // Nur DNS-Prefetch und Preconnect, keine vollständigen Requests
  dnsOnly: true,
  // Keine iframe-Preloads (verhindert Pixel-Auslösung)
  noIframe: true,
  // Keine fetch-Requests (verhindert Server-Side-Tracking)
  noFetch: true,
  // Nur Link-Prefetch mit speziellen Attributen
  linkPrefetchOnly: true
}

/**
 * Tracking-sichere Preloading-Funktion
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function trackingSafePreload(url, options = {}) {
  if (!url || typeof url !== 'string') return
  
  const {
    dnsOnly = true,
    noIframe = true,
    noFetch = true,
    preserveTracking = true
  } = { ...TRACKING_SAFE_OPTIONS, ...options }
  
  try {
    // 1. DNS-Prefetch für Domain (sicher)
    if (dnsOnly) {
      preloadDNS(url)
    }
    
    // 2. Preconnect für Domain (sicher)
    preloadPreconnect(url)
    
    // 3. Link-Prefetch nur mit speziellen Attributen (tracking-sicher)
    if (!noFetch) {
      preloadWithSafeLink(url, preserveTracking)
    }
    
    console.log('Tracking-safe preload completed for:', url)
  } catch (error) {
    console.warn('Tracking-safe preload failed:', error)
  }
}

/**
 * DNS-Prefetch für Domain (tracking-sicher)
 * @param {string} url - Die URL
 */
function preloadDNS(url) {
  try {
    const domain = new URL(url).origin
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
    
    // Entferne nach 30 Sekunden
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, 30000)
  } catch (error) {
    console.warn('DNS prefetch failed:', error)
  }
}

/**
 * Preconnect für Domain (tracking-sicher)
 * @param {string} url - Die URL
 */
function preloadPreconnect(url) {
  try {
    const domain = new URL(url).origin
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
    
    // Entferne nach 30 Sekunden
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, 30000)
  } catch (error) {
    console.warn('Preconnect failed:', error)
  }
}

/**
 * Tracking-sicherer Link-Prefetch
 * @param {string} url - Die URL
 * @param {boolean} preserveTracking - Tracking-Parameter erhalten
 */
function preloadWithSafeLink(url, preserveTracking = true) {
  try {
    let prefetchUrl = url
    
    // Entferne Tracking-Parameter für Prefetch (verhindert Pixel-Auslösung)
    if (!preserveTracking) {
      const urlObj = new URL(url)
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'ttclid', 'fbclid', 'gclid']
      
      trackingParams.forEach(param => {
        urlObj.searchParams.delete(param)
      })
      
      prefetchUrl = urlObj.toString()
    }
    
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = prefetchUrl
    link.as = 'document'
    link.fetchPriority = 'low' // Niedrige Priorität
    link.crossOrigin = 'anonymous'
    
    // Spezielle Attribute für tracking-sichere Prefetch
    link.setAttribute('data-tracking-safe', 'true')
    link.setAttribute('data-original-url', url)
    
    document.head.appendChild(link)
    
    // Entferne nach 60 Sekunden
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, 60000)
  } catch (error) {
    console.warn('Safe link prefetch failed:', error)
  }
}

/**
 * Tracking-sichere Affiliate-Link-Öffnung
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function trackingSafeOpenAffiliateLink(url, options = {}) {
  if (!url) return
  
  const {
    target = '_blank',
    noopener = true,
    noreferrer = true,
    preserveTracking = true
  } = options
  
  try {
    // Verwende die ursprüngliche URL mit allen Tracking-Parametern
    const finalUrl = preserveTracking ? url : url
    
    // Mobile-kompatible Link-Öffnung
    if (window.open) {
      const newWindow = window.open(finalUrl, target, 'noopener,noreferrer')
      if (newWindow) {
        newWindow.focus()
        return
      }
    }
    
    // Fallback: DOM-Link-Methode
    const link = document.createElement('a')
    link.href = finalUrl
    link.target = target
    
    if (noopener) link.rel = 'noopener'
    if (noreferrer) link.rel += ' noreferrer'
    
    // Füge temporär zum DOM hinzu und klicke
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.warn('Failed to open affiliate link:', error)
    // Letzter Fallback: Direkte Navigation
    window.location.href = url
  }
}

/**
 * Tracking-sichere Batch-Preloading
 * @param {Array} urls - Array von URLs
 * @param {number} delay - Verzögerung zwischen Preloads
 * @param {Object} options - Zusätzliche Optionen
 */
export function trackingSafeBatchPreload(urls, delay = 100, options = {}) {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  const {
    dnsOnly = true,
    maxConcurrent = 3,
    preserveTracking = false
  } = options
  
  // Begrenze gleichzeitige Preloads
  let currentIndex = 0
  
  const preloadNext = () => {
    if (currentIndex >= urls.length) return
    
    const batch = urls.slice(currentIndex, currentIndex + maxConcurrent)
    
    batch.forEach((url, index) => {
      setTimeout(() => {
        trackingSafePreload(url, { dnsOnly, preserveTracking })
      }, index * delay)
    })
    
    currentIndex += maxConcurrent
    
    // Nächste Batch nach Verzögerung
    setTimeout(preloadNext, delay * maxConcurrent)
  }
  
  preloadNext()
}

/**
 * Tracking-sichere Hover-Preloading
 * @param {string} url - Die URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function trackingSafeHoverPreload(url, options = {}) {
  const {
    delay = 500, // 500ms Verzögerung vor Preload
    dnsOnly = true
  } = options
  
  let timeoutId = null
  
  const startPreload = () => {
    timeoutId = setTimeout(() => {
      trackingSafePreload(url, { dnsOnly })
    }, delay)
  }
  
  const cancelPreload = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  return {
    start: startPreload,
    cancel: cancelPreload
  }
}

/**
 * Tracking-sichere Vue-Composable
 * @param {string} productId - Produkt-ID für Tracking
 * @returns {Object} - Tracking-sichere Preloading-Funktionen
 */
export function useTrackingSafePreloading(productId) {
  const preloadLink = (url, options = {}) => {
    return trackingSafePreload(url, options)
  }
  
  const openLink = (url, options = {}) => {
    return trackingSafeOpenAffiliateLink(url, options)
  }
  
  const batchPreload = (urls, options = {}) => {
    return trackingSafeBatchPreload(urls, 100, options)
  }
  
  const createHoverHandler = (url, options = {}) => {
    return trackingSafeHoverPreload(url, options)
  }
  
  return {
    preloadLink,
    openLink,
    batchPreload,
    createHoverHandler
  }
}

/**
 * Tracking-sichere Preloading-Statistiken
 */
export class TrackingSafePreloadStats {
  constructor() {
    this.stats = {
      totalPreloads: 0,
      dnsPrefetches: 0,
      preconnects: 0,
      safePrefetches: 0,
      errors: 0
    }
  }
  
  recordPreload(type) {
    this.stats.totalPreloads++
    this.stats[type] = (this.stats[type] || 0) + 1
  }
  
  recordError() {
    this.stats.errors++
  }
  
  getStats() {
    return { ...this.stats }
  }
  
  reset() {
    this.stats = {
      totalPreloads: 0,
      dnsPrefetches: 0,
      preconnects: 0,
      safePrefetches: 0,
      errors: 0
    }
  }
}

// Singleton für Statistiken
export const trackingSafeStats = new TrackingSafePreloadStats()

/**
 * Tracking-sichere Preloading-Konfiguration
 */
export const TRACKING_SAFE_CONFIG = {
  // Standard-Optionen für alle Preloads
  defaultOptions: {
    dnsOnly: true,
    noIframe: true,
    noFetch: true,
    preserveTracking: false
  },
  
  // Verzögerungen
  delays: {
    hover: 500,
    batch: 100,
    cleanup: 30000
  },
  
  // Limits
  limits: {
    maxConcurrent: 3,
    maxUrls: 10
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  console.log('Tracking-safe preloading initialized')
}
