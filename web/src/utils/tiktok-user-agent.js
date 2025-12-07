// tiktok-user-agent.js
// Utility zur sicheren Erfassung und Bereitstellung des User-Agent für TikTok Events
// Löst das Problem: Bank API Error: Code 40002 - invalid value for context.user_agent: value may not be null

/**
 * Fallback User-Agent (wie von FinanceAds empfohlen)
 */
const FALLBACK_USER_AGENT = 'Mozilla/5.0 (compatible; SaifinBot/1.0; +https://www.saifin.de)'

/**
 * Erfasst den User-Agent sicher aus dem Browser
 * @returns {string} User-Agent String oder Fallback
 */
export function getUserAgent() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return FALLBACK_USER_AGENT
  }
  
  try {
    const userAgent = navigator.userAgent || 
                     navigator.vendor || 
                     window.opera ||
                     null
    
    // Wenn User-Agent vorhanden, verwenden
    if (userAgent && userAgent.trim() !== '') {
      return userAgent
    }
    
    // Fallback verwenden
    return FALLBACK_USER_AGENT
  } catch (error) {
    console.debug('Fehler beim Erfassen des User-Agent:', error)
    return FALLBACK_USER_AGENT
  }
}

/**
 * Erweitert ein TikTok Event-Objekt mit User-Agent und weiteren Context-Daten
 * Wichtig: FinanceAds benötigt context.user_agent zwingend, um Error 40002 zu vermeiden
 * @param {Object} eventData - TikTok Event-Daten
 * @returns {Object} Event-Daten mit Context-Informationen
 */
export function enrichTikTokEvent(eventData = {}) {
  const userAgent = getUserAgent()
  
  // Stelle sicher, dass context-Objekt existiert
  if (!eventData.context) {
    eventData.context = {}
  }
  
  // User-Agent setzen (nur wenn noch nicht vorhanden oder leer)
  // FinanceAds erfordert: context.user_agent darf nicht null sein!
  if (!eventData.context.user_agent || 
      eventData.context.user_agent === null || 
      eventData.context.user_agent.trim() === '') {
    eventData.context.user_agent = userAgent
  }
  
  // Zusätzlich: Stelle sicher, dass user_agent auf oberster Ebene gesetzt ist
  // (falls FinanceAds PTO das erwartet)
  if (!eventData.user_agent) {
    eventData.user_agent = userAgent
  }
  
  // Weitere Context-Informationen hinzufügen
  if (typeof window !== 'undefined') {
    // IP-Adresse kann nicht clientseitig erfasst werden, wird server-seitig gesetzt
    // Aber wir können andere nützliche Informationen hinzufügen
    
    if (!eventData.context.page) {
      eventData.context.page = {
        url: window.location.href,
        referrer: document.referrer || ''
      }
    }
    
    // Browser-Informationen (falls verfügbar)
    if (!eventData.context.browser) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android/i.test(userAgent) && !isMobile
      
      eventData.context.browser = {
        user_agent: userAgent,
        is_mobile: isMobile,
        is_tablet: isTablet,
        language: navigator.language || navigator.userLanguage || ''
      }
    }
  }
  
  return eventData
}

/**
 * Sendet ein TikTok Event mit erweiterten Context-Daten
 * @param {Function} ttqTrack - TikTok ttq.track Funktion
 * @param {string} eventName - Event-Name (z.B. 'CompleteRegistration')
 * @param {Object} eventData - Event-Daten
 */
export function trackTikTokEventWithContext(ttqTrack, eventName, eventData = {}) {
  try {
    // Event-Daten mit User-Agent erweitern
    const enrichedData = enrichTikTokEvent(eventData)
    
    // Event tracken
    ttqTrack(eventName, enrichedData)
    
    // Logging für Debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug('TikTok Event getrackt:', {
        event: eventName,
        hasUserAgent: !!enrichedData.context?.user_agent,
        userAgent: enrichedData.context?.user_agent?.substring(0, 50) + '...'
      })
    }
  } catch (error) {
    console.error('Fehler beim Tracken des TikTok Events:', error)
    // Fehler nicht weiterwerfen, Tracking sollte nicht zum Absturz führen
  }
}

/**
 * Erstellt einen Safe-Wrapper für TikTok Events mit User-Agent-Fallback
 * @returns {Function} Wrapper-Funktion für ttq.track
 */
export function createSafeTikTokTracker() {
  return (eventName, eventData = {}) => {
    if (typeof window === 'undefined' || !window.ttq || typeof window.ttq.track !== 'function') {
      console.debug('TikTok Pixel nicht verfügbar')
      return
    }
    
    trackTikTokEventWithContext(window.ttq.track, eventName, eventData)
  }
}

/**
 * Prüft, ob User-Agent im Browser verfügbar ist
 * @returns {boolean} True wenn User-Agent verfügbar ist
 */
export function hasUserAgent() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  
  try {
    return !!(navigator.userAgent && navigator.userAgent.trim() !== '')
  } catch (_) {
    return false
  }
}

export default {
  getUserAgent,
  enrichTikTokEvent,
  trackTikTokEventWithContext,
  createSafeTikTokTracker,
  hasUserAgent,
  FALLBACK_USER_AGENT
}
