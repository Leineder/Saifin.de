// affiliate-links.js
// Tracking-sichere Affiliate-Link-Verwaltung

import { trackingSafePreload, trackingSafeOpenAffiliateLink, trackingSafeBatchPreload } from './tracking-safe-preloading.js'

/**
 * Tracking-sichere Preloading für Affiliate-Links
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function preloadAffiliateLink(url, options = {}) {
  if (!url || typeof url !== 'string') return
  
  const {
    trackingSafe = true, // Standard: tracking-sicher
    dnsOnly = true,
    preserveTracking = false
  } = options
  
  if (trackingSafe) {
    // Verwende tracking-sichere Preloading-Funktion
    trackingSafePreload(url, { dnsOnly, preserveTracking })
  } else {
    // Legacy-Verhalten (nicht empfohlen)
    console.warn('Using legacy preloading - may cause tracking issues')
    legacyPreloadAffiliateLink(url, options)
  }
}

/**
 * Legacy iframe-basiertes Preloading (NICHT EMPFOHLEN - verursacht Tracking-Probleme)
 * @param {string} url - Die Affiliate-URL
 */
function legacyPreloadWithIframe(url) {
  console.warn('Legacy iframe preloading used - this may cause tracking issues!')
  try {
    // Prüfe iframe-Unterstützung
    if (!document.createElement('iframe').contentWindow) {
      console.warn('Iframe preloading not supported, skipping')
      return
    }
    
    // Erstelle unsichtbares iframe für Preloading
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.src = url
    
    // Füge iframe zum DOM hinzu
    document.body.appendChild(iframe)
    
    // Entferne iframe nach 30 Sekunden
    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe)
      }
    }, 30000)
  } catch (error) {
    // Fallback bei iframe-Fehlern
    console.warn('Iframe preloading failed:', error)
  }
}

/**
 * Öffnet Affiliate-Link mit tracking-sicherer Performance
 * @param {string} url - Die Affiliate-URL
 * @param {Object} options - Zusätzliche Optionen
 */
export function openAffiliateLink(url, options = {}) {
  if (!url) return
  
  const {
    target = '_blank',
    noopener = true,
    noreferrer = true,
    preload = false, // Standard: kein Preload beim Öffnen
    trackingSafe = true
  } = options
  
  if (trackingSafe) {
    // Verwende tracking-sichere Link-Öffnung
    trackingSafeOpenAffiliateLink(url, { target, noopener, noreferrer })
  } else {
    // Legacy-Verhalten
    legacyOpenAffiliateLink(url, options)
  }
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
 * Tracking-sichere Batch-Preloading für mehrere Affiliate-Links
 * @param {Array} urls - Array von Affiliate-URLs
 * @param {number} delay - Verzögerung zwischen Preloads (ms)
 * @param {Object} options - Zusätzliche Optionen
 */
export function batchPreloadAffiliateLinks(urls, delay = 100, options = {}) {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  const {
    trackingSafe = true,
    dnsOnly = true,
    maxConcurrent = 3
  } = options
  
  if (trackingSafe) {
    // Verwende tracking-sichere Batch-Preloading
    trackingSafeBatchPreload(urls, delay, { dnsOnly, maxConcurrent })
  } else {
    // Legacy-Verhalten (nicht empfohlen)
    console.warn('Using legacy batch preloading - may cause tracking issues')
    legacyBatchPreloadAffiliateLinks(urls, delay, options)
  }
}

/**
 * Tracking-sichere Preloading kritischer Affiliate-Links
 * @param {Array} urls - Array von kritischen URLs
 */
export function instantPreloadCriticalLinks(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  // Tracking-sichere Preloading ohne Verzögerung
  urls.forEach(url => {
    preloadAffiliateLink(url, {
      trackingSafe: true,
      dnsOnly: true,
      preserveTracking: false
    })
  })
}

// ===== LEGACY FUNKTIONEN (NICHT EMPFOHLEN) =====

/**
 * Legacy Preloading (verursacht Tracking-Probleme)
 */
function legacyPreloadAffiliateLink(url, options = {}) {
  console.warn('Legacy preloading used - this may cause tracking issues!')
  const {
    aggressive = true,
    preconnect = true,
    prefetch = true,
    prerender = false
  } = options
  
  // 1. DNS-Prefetch + Preconnect für sofortige Verbindung
  if (preconnect) {
    try {
      const preconnectLink = document.createElement('link')
      preconnectLink.rel = 'preconnect'
      preconnectLink.href = new URL(url).origin
      preconnectLink.crossOrigin = 'anonymous'
      document.head.appendChild(preconnectLink)
    } catch (error) {
      console.warn('Preconnect failed:', error)
    }
  }
  
  // 2. Aggressives Prefetch mit höchster Priorität
  if (prefetch) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = 'document'
    link.fetchPriority = 'high' // Höchste Priorität
    document.head.appendChild(link)
  }
  
  // 3. Prerender für kritische Links (experimentell)
  if (prerender && aggressive) {
    const prerenderLink = document.createElement('link')
    prerenderLink.rel = 'prerender'
    prerenderLink.href = url
    document.head.appendChild(prerenderLink)
  }
  
  // 4. Aggressives iframe-Preloading für sofortige Navigation
  if (aggressive) {
    legacyPreloadWithIframe(url)
  }
  
  // Entferne Links nach 60 Sekunden (länger für aggressive Strategie)
  setTimeout(() => {
    const links = document.querySelectorAll(`link[href="${url}"]`)
    links.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    })
  }, 60000)
}

/**
 * Legacy Link-Öffnung
 */
function legacyOpenAffiliateLink(url, options = {}) {
  console.warn('Legacy link opening used - this may cause tracking issues!')
  const {
    target = '_blank',
    noopener = true,
    noreferrer = true,
    preload = true
  } = options
  
  // Preload wenn gewünscht
  if (preload) {
    legacyPreloadAffiliateLink(url)
  }
  
  try {
    // Mobile-kompatible Link-Öffnung
    if (window.open) {
      // Versuche window.open zuerst (bessere mobile Kompatibilität)
      const newWindow = window.open(url, target, 'noopener,noreferrer')
      if (newWindow) {
        newWindow.focus()
        return
      }
    }
    
    // Fallback: DOM-Link-Methode
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
  } catch (error) {
    console.warn('Failed to open affiliate link:', error)
    // Letzter Fallback: Direkte Navigation
    window.location.href = url
  }
}

/**
 * Legacy Batch-Preloading
 */
function legacyBatchPreloadAffiliateLinks(urls, delay = 50, options = {}) {
  console.warn('Legacy batch preloading used - this may cause tracking issues!')
  const {
    aggressive = true,
    parallel = true,
    priority = 'high'
  } = options
  
  if (parallel && aggressive) {
    // Parallel preloading für maximale Geschwindigkeit
    urls.forEach((url, index) => {
      // Sofortiges Preloading ohne Verzögerung
      legacyPreloadAffiliateLink(url, { 
        aggressive: true, 
        preconnect: true, 
        prefetch: true,
        prerender: index < 2 // Prerender nur die ersten 2 Links
      })
    })
  } else {
    // Sequenzielles Preloading mit minimaler Verzögerung
    urls.forEach((url, index) => {
      setTimeout(() => {
        legacyPreloadAffiliateLink(url, { aggressive: true })
      }, index * delay)
    })
  }
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
