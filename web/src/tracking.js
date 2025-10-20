// tracking.js
// Speicherung und Abruf von UTM-/Click-IDs in LocalStorage

const STORAGE_KEY = 'tracking:params'
const TRACK_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'ttclid', 'fbclid']

export function storeTrackingParams() {
  try {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    const existing = getTrackingParams()
    let changed = false

    for (const key of TRACK_KEYS) {
      const value = urlParams.get(key)
      if (value && value.trim() !== '') {
        existing[key] = value
        changed = true
      }
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    }
  } catch (_) {
    // ignorieren – Tracking ist best-effort
  }
}

export function getTrackingParams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    // Nur erwartete Keys zurückgeben
    const result = {}
    for (const key of TRACK_KEYS) result[key] = parsed?.[key] ?? ''
    return result
  } catch (_) {
    return { utm_source: '', utm_medium: '', utm_campaign: '', ttclid: '', fbclid: '' }
  }
}

// Engagement Tracking - trackt User-Interaktionen
const ENGAGEMENT_SESSION_KEY = 'tracking:engagement_fired'
let engagementTracked = false

export function initEngagementTracking() {
  if (typeof window === 'undefined') return
  
  // Prüfe ob bereits in dieser Session getrackt wurde
  try {
    if (sessionStorage.getItem(ENGAGEMENT_SESSION_KEY)) {
      engagementTracked = true
      return
    }
  } catch (_) {}

  let interactionDetected = false
  let scrollDepth = 0

  function trackEngagement(trigger) {
    if (engagementTracked || interactionDetected) return
    
    interactionDetected = true
    
    // Kurze Verzögerung um sicherzustellen, dass es echtes Engagement ist
    setTimeout(() => {
      if (!engagementTracked) {
        engagementTracked = true
        
        // SessionStorage markieren
        try {
          sessionStorage.setItem(ENGAGEMENT_SESSION_KEY, 'true')
        } catch (_) {}

        // Meta Pixel: ViewContent Event für Engagement
        try {
          if (window.fbq && typeof window.fbq === 'function') {
            window.fbq('track', 'ViewContent', {
              content_type: 'engagement',
              content_name: 'User Engaged',
              trigger: trigger,
              scroll_depth: scrollDepth
            })
          }
        } catch (_) {}

        // TikTok Pixel: Custom Event "Interaktion"
        try {
          if (window.ttq && typeof window.ttq.track === 'function') {
            window.ttq.track('Interaktion', {
              content_type: 'engagement',
              trigger: trigger,
              scroll_depth: scrollDepth
            })
          }
        } catch (_) {}

        // Cleanup: Event Listener entfernen
        cleanup()
      }
    }, 1000) // 1 Sekunde Verzögerung um echtes Engagement zu verifizieren
  }

  // Scroll Tracking
  function handleScroll() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    scrollDepth = Math.max(scrollDepth, scrollPercent)
    
    // Track bei mind. 25% Scroll-Tiefe
    if (scrollPercent >= 25) {
      trackEngagement('scroll')
    }
  }

  // Click Tracking
  function handleClick() {
    trackEngagement('click')
  }

  // Mouse Movement Tracking (nur nach signifikanter Bewegung)
  let mouseMoveCount = 0
  function handleMouseMove() {
    mouseMoveCount++
    if (mouseMoveCount > 10) { // Mind. 10 Mausbewegungen
      trackEngagement('mousemove')
    }
  }

  // Touch Tracking (für Mobile)
  function handleTouch() {
    trackEngagement('touch')
  }

  // Cleanup Funktion
  function cleanup() {
    window.removeEventListener('scroll', handleScroll, { passive: true })
    window.removeEventListener('click', handleClick, { passive: true })
    window.removeEventListener('mousemove', handleMouseMove, { passive: true })
    window.removeEventListener('touchstart', handleTouch, { passive: true })
  }

  // Event Listener mit passiven Events für bessere Performance
  window.addEventListener('scroll', handleScroll, { passive: true, once: false })
  window.addEventListener('click', handleClick, { passive: true, once: false })
  window.addEventListener('mousemove', handleMouseMove, { passive: true, once: false })
  window.addEventListener('touchstart', handleTouch, { passive: true, once: false })

  // Cleanup nach 2 Minuten falls kein Engagement
  setTimeout(cleanup, 120000)
}
