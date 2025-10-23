// affiliate-links.js
// Optimierte Affiliate-Link-Verwaltung für schnellere Ladezeiten

/**
 * Preloadet Affiliate-Links beim Hover für schnellere Navigation
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function preloadAffiliateLink(url, options = {}) {
  if (!url || typeof url !== 'string') return
  
  // Erstelle unsichtbaren Link für Preloading
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = 'document'
  
  // Füge Link zum Head hinzu
  document.head.appendChild(link)
  
  // Entferne Link nach 30 Sekunden um Speicher zu sparen
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link)
    }
  }, 30000)
}

/**
 * Öffnet Affiliate-Link mit optimierter Performance
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function openAffiliateLink(url, options = {}) {
  if (!url) return
  
  const {
    target = '_blank',
    noopener = true,
    noreferrer = true,
    preload = true
  } = options
  
  // Preload wenn gewünscht
  if (preload) {
    preloadAffiliateLink(url)
  }
  
  // Öffne Link mit optimierten Attributen
  const link = document.createElement('a')
  link.href = url
  link.target = target
  
  if (noopener) link.rel = 'noopener'
  if (noreferrer) link.rel += ' noreferrer'
  
  // Füge temporär zum DOM hinzu und klicke
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Erstellt optimierte Affiliate-Link-Handler für Vue-Komponenten
 * @param {string} url - Die Affiliate-URL
 * @param {Object} trackingData - Tracking-Daten
 */
export function createAffiliateLinkHandler(url, trackingData = {}) {
  return {
    onMouseEnter: () => {
      // Preload beim Hover
      preloadAffiliateLink(url)
    },
    onClick: (event) => {
      event.preventDefault()
      
      // Tracking vor dem Öffnen
      if (trackingData.onClick) {
        trackingData.onClick()
      }
      
      // Öffne Link
      openAffiliateLink(url, { preload: false }) // Preload bereits beim Hover
    }
  }
}

/**
 * Batch-Preloading für mehrere Affiliate-Links
 * @param {Array} urls - Array von Affiliate-URLs
 * @param {number} delay - Verzögerung zwischen Preloads (ms)
 */
export function batchPreloadAffiliateLinks(urls, delay = 100) {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  urls.forEach((url, index) => {
    setTimeout(() => {
      preloadAffiliateLink(url)
    }, index * delay)
  })
}

/**
 * Performance-Monitoring für Affiliate-Links
 * @param {string} url - Die Affiliate-URL
 * @param {Function} callback - Callback für Performance-Daten
 */
export function monitorAffiliateLinkPerformance(url, callback) {
  const startTime = performance.now()
  
  // Simuliere Link-Performance (da externe Links nicht direkt messbar)
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  
  // Füge temporär hinzu
  link.style.display = 'none'
  document.body.appendChild(link)
  
  // Messung der Zeit bis zum Klick
  const clickTime = performance.now()
  const timeToClick = clickTime - startTime
  
  // Entferne Link
  document.body.removeChild(link)
  
  // Callback mit Performance-Daten
  if (callback && typeof callback === 'function') {
    callback({
      url,
      timeToClick,
      timestamp: new Date().toISOString()
    })
  }
  
  return timeToClick
}
