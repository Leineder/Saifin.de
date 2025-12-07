// Cookie-Consent-Management-System
// Verwaltet die Zustimmung zu Tracking-Cookies und blockiert Tracking, wenn nicht akzeptiert

const CONSENT_STORAGE_KEY = 'cookie-consent'
const CONSENT_VERSION = '1.0'

/**
 * Consent-Status
 */
export const ConsentStatus = {
  PENDING: 'pending',      // Noch keine Entscheidung
  ACCEPTED: 'accepted',    // Alle Cookies akzeptiert
  REJECTED: 'rejected',    // Alle Cookies abgelehnt
  CUSTOM: 'custom'         // Individuelle Einstellungen
}

/**
 * Cookie-Kategorien
 */
export const CookieCategories = {
  ANALYTICS: 'analytics',
  MARKETING: 'marketing'
}

/**
 * Liest den aktuellen Consent-Status aus dem LocalStorage
 */
export function getConsentStatus() {
  try {
    if (typeof window === 'undefined') return ConsentStatus.PENDING
    
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) return ConsentStatus.PENDING
    
    const parsed = JSON.parse(stored)
    
    // Prüfe Version - bei Änderungen Consent zurücksetzen
    if (parsed.version !== CONSENT_VERSION) {
      return ConsentStatus.PENDING
    }
    
    return parsed.status || ConsentStatus.PENDING
  } catch (_) {
    return ConsentStatus.PENDING
  }
}

/**
 * Liest die individuellen Cookie-Einstellungen
 */
export function getCookiePreferences() {
  try {
    if (typeof window === 'undefined') {
      return {
        analytics: false,
        marketing: false
      }
    }
    
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!stored) {
      return {
        analytics: false,
        marketing: false
      }
    }
    
    const parsed = JSON.parse(stored)
    
    if (parsed.version !== CONSENT_VERSION) {
      return {
        analytics: false,
        marketing: false
      }
    }
    
    return {
      analytics: parsed.preferences?.analytics || false,
      marketing: parsed.preferences?.marketing || false
    }
  } catch (_) {
    return {
      analytics: false,
      marketing: false
    }
  }
}

/**
 * Speichert den Consent-Status
 */
export function setConsentStatus(status, preferences = null) {
  try {
    if (typeof window === 'undefined') return
    
    const data = {
      version: CONSENT_VERSION,
      status: status,
      timestamp: new Date().toISOString()
    }
    
    if (preferences) {
      data.preferences = preferences
    } else if (status === ConsentStatus.ACCEPTED) {
      // Bei "Alles akzeptieren" alle Kategorien aktivieren
      data.preferences = {
        analytics: true,
        marketing: true
      }
    } else if (status === ConsentStatus.REJECTED) {
      // Bei Ablehnung alle Kategorien deaktivieren
      data.preferences = {
        analytics: false,
        marketing: false
      }
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data))
    
    // Dispatch Event für andere Komponenten
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', {
      detail: { status, preferences: data.preferences }
    }))
  } catch (_) {
    // Fehler beim Speichern ignorieren
  }
}

/**
 * Prüft, ob Tracking erlaubt ist
 */
export function isTrackingAllowed(category = CookieCategories.MARKETING) {
  const status = getConsentStatus()
  
  if (status === ConsentStatus.ACCEPTED) {
    return true
  }
  
  if (status === ConsentStatus.REJECTED) {
    return false
  }
  
  if (status === ConsentStatus.CUSTOM) {
    const preferences = getCookiePreferences()
    return preferences[category] || false
  }
  
  // PENDING = nicht erlaubt
  return false
}

/**
 * Prüft, ob Analytics erlaubt ist
 */
export function isAnalyticsAllowed() {
  return isTrackingAllowed(CookieCategories.ANALYTICS)
}

/**
 * Prüft, ob Marketing-Tracking erlaubt ist
 */
export function isMarketingAllowed() {
  return isTrackingAllowed(CookieCategories.MARKETING)
}

/**
 * Blockiert Tracking-Aufrufe, wenn nicht erlaubt
 */
export function safeTrack(category, callback) {
  if (isTrackingAllowed(category)) {
    try {
      callback()
    } catch (error) {
      console.debug('Tracking-Fehler (nicht kritisch):', error)
    }
  }
}

/**
 * Wrapper für Meta Pixel (fbq)
 */
export function safeFbq(...args) {
  safeTrack(CookieCategories.MARKETING, () => {
    if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
      window.fbq(...args)
    }
  })
}

/**
 * Wrapper für TikTok Pixel (ttq)
 * Fügt automatisch User-Agent hinzu, um Error 40002 zu vermeiden
 */
export function safeTtq(method, ...args) {
  safeTrack(CookieCategories.MARKETING, () => {
    if (typeof window !== 'undefined' && window.ttq && typeof window.ttq[method] === 'function') {
      // Für 'track' Events: User-Agent automatisch hinzufügen
      if (method === 'track' && args.length >= 1) {
        const eventName = args[0]
        const eventData = args[1] || {}
        
        // Lazy Import für bessere Performance
        // Verwende synchronen Fallback für sofortiges Tracking
        try {
          // Versuche synchronen Zugriff auf User-Agent
          const userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) 
            ? navigator.userAgent 
            : 'Mozilla/5.0 (compatible; SaifinBot/1.0; +https://www.saifin.de)'
          
          // Stelle sicher, dass context-Objekt existiert
          if (!eventData.context) {
            eventData.context = {}
          }
          
          // User-Agent setzen (nur wenn noch nicht vorhanden oder leer)
          if (!eventData.context.user_agent || 
              eventData.context.user_agent === null || 
              eventData.context.user_agent.trim() === '') {
            eventData.context.user_agent = userAgent
          }
          
          // Event mit erweiterten Daten tracken
          window.ttq[method](eventName, eventData)
        } catch (error) {
          // Fallback bei Fehler: Normales Tracking
          console.debug('TikTok Event Enrichment Fehler (nicht kritisch):', error)
          window.ttq[method](...args)
        }
      } else {
        // Für andere Methoden: Normales Tracking
        window.ttq[method](...args)
      }
    }
  })
}

/**
 * Wrapper für Vercel Analytics (va)
 */
export function safeVa(...args) {
  safeTrack(CookieCategories.ANALYTICS, () => {
    if (typeof window !== 'undefined' && window.va && typeof window.va === 'function') {
      window.va(...args)
    }
  })
}

