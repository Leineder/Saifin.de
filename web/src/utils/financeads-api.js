// financeads-api.js
// Financeads Auswertungs-API Integration für präzises Tracking

/**
 * Financeads API Konfiguration
 * 
 * WICHTIG: Die User-ID identifiziert Ihren Publisher-Account in der Financeads API.
 * Sie wird benötigt, um Statistiken für den richtigen Account abzurufen.
 * Die User-ID wird zusammen mit dem API-Key für die Authentifizierung verwendet.
 * 
 * HINWEIS: Die Financeads API unterstützt keine CORS-Requests vom Browser.
 * Die API-Aufrufe müssen über einen Proxy-Server oder Server-Side erfolgen.
 * Für Client-Side Tracking werden die Affiliate-Links direkt verwendet.
 */
const FINANCEADS_API_CONFIG = {
  baseUrl: 'https://data.financeads.net/api/statistics.php',
  proxyUrl: '/api/financeads', // Vercel Serverless Function Proxy
  userId: '57387', // User-ID aus dem Dashboard - identifiziert Ihren Publisher-Account
  apiKey: '4543b9ad41727264a8f8c8a4f1d97f7e',
  defaultFormat: 'csv', // Standard: CSV
  defaultCurrency: 'EUR', // Standard: EUR
  enabled: true // API-Aufrufe über Proxy aktiviert
}

/**
 * API-Endpunkte
 */
const API_ENDPOINTS = {
  LEADS_SALES: 'l_all', // Alle Leads (inkl. stornierter)
  BY_PROGRAM: 'pr', // Auswertung nach Programm
  MONTHLY_OVERVIEW: 'monatsuebersicht', // Monatsübersicht
  BY_DAY: 'd' // Auswertung nach Tag
}

/**
 * Optionale Parameter für Leads & Sales
 */
const LEADS_SALES_OPTIONS = {
  TYPE: {
    UPDATE: 'update', // Bearbeitungsdatum (Standard)
    ORIGIN: 'origin' // Entstehungsdatum
  },
  SITE: {
    ALL: 'l_all', // Alle Leads (inkl. stornierter)
    OPEN_CONFIRMED: 'l', // Alle offenen und bestätigten Leads
    CONFIRMED_ONLY: 'l_oc' // Nur bestätigte Leads
  },
  CURRENCY: {
    EUR: 'EUR',
    CHF: 'CHF',
    GBP: 'GBP',
    PLN: 'PLN'
  }
}

/**
 * Erstellt eine Financeads API URL
 * @param {Object} options - API-Optionen
 * @param {string} options.site - API-Endpunkt (z.B. 'l_all', 'pr', 'd')
 * @param {Object} options.params - Optionale Parameter
 * @param {string} options.params.timeFrom - Startdatum (YYYY-MM-DD)
 * @param {string} options.params.timeTo - Enddatum (YYYY-MM-DD)
 * @param {string} options.params.w - Werbeflächen-ID
 * @param {string} options.params.prid - Programm-ID (nur für nach Tag)
 * @param {string} options.params.format - Dateiformat ('csv' oder 'xml')
 * @param {string} options.params.type - Type für Leads & Sales ('update' oder 'origin')
 * @param {string} options.params.currency - Währung (z.B. 'EUR', 'CHF')
 * @returns {string} - Vollständige API URL
 */
function buildFinanceadsApiUrl(options = {}) {
  const { site, params = {} } = options
  
  if (!site) {
    throw new Error('API-Endpunkt (site) ist erforderlich')
  }
  
  const url = new URL(FINANCEADS_API_CONFIG.baseUrl)
  
  // Erforderliche Parameter
  url.searchParams.set('site', site)
  url.searchParams.set('user', FINANCEADS_API_CONFIG.userId)
  url.searchParams.set('key', FINANCEADS_API_CONFIG.apiKey)
  
  // Optionale Parameter: Zeitraum
  if (params.timeFrom) {
    url.searchParams.set('time_from', params.timeFrom)
  }
  if (params.timeTo) {
    url.searchParams.set('time_to', params.timeTo)
  }
  
  // Optionale Parameter: Werbefläche
  if (params.w) {
    url.searchParams.set('w', params.w)
  }
  
  // Optionale Parameter: Programm (nur für nach Tag)
  if (params.prid && site === API_ENDPOINTS.BY_DAY) {
    url.searchParams.set('prid', params.prid)
  }
  
  // Optionale Parameter: Dateiformat
  if (params.format) {
    url.searchParams.set('format', params.format)
  } else if (site === API_ENDPOINTS.LEADS_SALES) {
    // Für Leads & Sales: XML verfügbar
    url.searchParams.set('format', params.format || FINANCEADS_API_CONFIG.defaultFormat)
  } else {
    // Für andere Endpunkte: CSV Standard
    url.searchParams.set('format', FINANCEADS_API_CONFIG.defaultFormat)
  }
  
  // Optionale Parameter: Leads & Sales spezifisch
  if (site === API_ENDPOINTS.LEADS_SALES) {
    if (params.type) {
      url.searchParams.set('type', params.type)
    } else {
      // Standard: Bearbeitungsdatum
      url.searchParams.set('type', LEADS_SALES_OPTIONS.TYPE.UPDATE)
    }
    
    if (params.currency) {
      url.searchParams.set('currency', params.currency)
    } else {
      url.searchParams.set('currency', FINANCEADS_API_CONFIG.defaultCurrency)
    }
  }
  
  return url.toString()
}

/**
 * Ruft die Financeads API über den Proxy auf
 * @param {Object} options - API-Optionen
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Response>} - API Response
 */
async function callFinanceadsApi(options = {}, signal = null) {
  // Prüfe ob API-Aufrufe aktiviert sind
  if (!FINANCEADS_API_CONFIG.enabled) {
    console.warn('⚠️ Financeads API-Aufrufe sind deaktiviert.')
    throw new Error('Financeads API-Aufrufe sind deaktiviert.')
  }
  
  try {
    // Baue die Financeads API URL auf (für Parameter-Referenz)
    const financeadsUrl = buildFinanceadsApiUrl(options)
    const financeadsUrlObj = new URL(financeadsUrl)
    
    // Verwende den Proxy-Endpunkt statt direkter API-Aufruf
    const proxyUrl = new URL(FINANCEADS_API_CONFIG.proxyUrl, window.location.origin)
    
    // Alle Query-Parameter an den Proxy weiterleiten (außer user und key, die im Proxy gesetzt werden)
    financeadsUrlObj.searchParams.forEach((value, key) => {
      if (key !== 'user' && key !== 'key') {
        proxyUrl.searchParams.set(key, value)
      }
    })
    
    // Request an Proxy senden
    const controller = signal ? new AbortController() : null
    if (signal) {
      signal.addEventListener('abort', () => controller.abort())
    }
    
    const response = await fetch(proxyUrl.toString(), {
      method: 'GET',
      signal: controller?.signal || signal,
      headers: {
        'Accept': 'text/csv, text/xml, application/json, */*'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Proxy Request fehlgeschlagen: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⚠️ Financeads API Request abgebrochen (Timeout)')
    } else {
      console.error('❌ Financeads API Request fehlgeschlagen:', error.message)
    }
    throw error
  }
}

/**
 * Parst CSV Response
 * @param {string} csvText - CSV Text
 * @returns {Array<Object>} - Geparste Daten
 */
function parseCsvResponse(csvText) {
  try {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      return []
    }
    
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      data.push(row)
    }
    
    return data
  } catch (error) {
    console.error('❌ CSV Parsing fehlgeschlagen:', error)
    return []
  }
}

/**
 * Parst XML Response
 * @param {string} xmlText - XML Text
 * @returns {Object} - Geparste Daten
 */
function parseXmlResponse(xmlText) {
  try {
    // Einfaches XML Parsing (für einfache Strukturen)
    // Für komplexere XML-Strukturen sollte ein XML-Parser verwendet werden
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Prüfe auf Parsing-Fehler
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('XML Parsing Fehler: ' + parserError.textContent)
    }
    
    return xmlDoc
  } catch (error) {
    console.error('❌ XML Parsing fehlgeschlagen:', error)
    return null
  }
}

/**
 * Holt Leads & Sales Statistiken
 * @param {Object} options - Optionale Parameter
 * @param {string} options.timeFrom - Startdatum (YYYY-MM-DD)
 * @param {string} options.timeTo - Enddatum (YYYY-MM-DD)
 * @param {string} options.type - Type ('update' oder 'origin')
 * @param {string} options.site - Site ('l_all', 'l', 'l_oc')
 * @param {string} options.currency - Währung (z.B. 'EUR')
 * @param {string} options.format - Format ('csv' oder 'xml')
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>|Object>} - Geparste Daten
 */
export async function getLeadsSalesStatistics(options = {}, signal = null) {
  try {
    const params = {
      type: options.type || LEADS_SALES_OPTIONS.TYPE.UPDATE,
      site: options.site || LEADS_SALES_OPTIONS.SITE.ALL,
      currency: options.currency || FINANCEADS_API_CONFIG.defaultCurrency,
      format: options.format || FINANCEADS_API_CONFIG.defaultFormat,
      timeFrom: options.timeFrom,
      timeTo: options.timeTo
    }
    
    const response = await callFinanceadsApi(
      { site: API_ENDPOINTS.LEADS_SALES, params },
      signal
    )
    
    if (!response.ok) {
      throw new Error(`API Request fehlgeschlagen: ${response.status} ${response.statusText}`)
    }
    
    const text = await response.text()
    
    if (params.format === 'xml') {
      return parseXmlResponse(text)
    } else {
      return parseCsvResponse(text)
    }
  } catch (error) {
    console.error('❌ Leads & Sales Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Holt Programm-Statistiken
 * @param {Object} options - Optionale Parameter
 * @param {string} options.timeFrom - Startdatum (YYYY-MM-DD)
 * @param {string} options.timeTo - Enddatum (YYYY-MM-DD)
 * @param {string} options.w - Werbeflächen-ID
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>>} - Geparste Daten
 */
export async function getProgramStatistics(options = {}, signal = null) {
  try {
    const params = {
      timeFrom: options.timeFrom,
      timeTo: options.timeTo,
      w: options.w
    }
    
    const response = await callFinanceadsApi(
      { site: API_ENDPOINTS.BY_PROGRAM, params },
      signal
    )
    
    if (!response.ok) {
      throw new Error(`API Request fehlgeschlagen: ${response.status} ${response.statusText}`)
    }
    
    const text = await response.text()
    return parseCsvResponse(text)
  } catch (error) {
    console.error('❌ Programm-Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Holt Monatsübersicht
 * @param {Object} options - Optionale Parameter
 * @param {string} options.timeFrom - Startdatum (YYYY-MM-DD)
 * @param {string} options.timeTo - Enddatum (YYYY-MM-DD)
 * @param {string} options.w - Werbeflächen-ID
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>>} - Geparste Daten
 */
export async function getMonthlyOverview(options = {}, signal = null) {
  try {
    const params = {
      timeFrom: options.timeFrom,
      timeTo: options.timeTo,
      w: options.w
    }
    
    const response = await callFinanceadsApi(
      { site: API_ENDPOINTS.MONTHLY_OVERVIEW, params },
      signal
    )
    
    if (!response.ok) {
      throw new Error(`API Request fehlgeschlagen: ${response.status} ${response.statusText}`)
    }
    
    const text = await response.text()
    return parseCsvResponse(text)
  } catch (error) {
    console.error('❌ Monatsübersicht konnte nicht geladen werden:', error)
    return null
  }
}

/**
 * Holt Tages-Statistiken
 * @param {Object} options - Optionale Parameter
 * @param {string} options.timeFrom - Startdatum (YYYY-MM-DD)
 * @param {string} options.timeTo - Enddatum (YYYY-MM-DD)
 * @param {string} options.w - Werbeflächen-ID
 * @param {string} options.prid - Programm-ID
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>>} - Geparste Daten
 */
export async function getDailyStatistics(options = {}, signal = null) {
  try {
    const params = {
      timeFrom: options.timeFrom,
      timeTo: options.timeTo,
      w: options.w,
      prid: options.prid
    }
    
    const response = await callFinanceadsApi(
      { site: API_ENDPOINTS.BY_DAY, params },
      signal
    )
    
    if (!response.ok) {
      throw new Error(`API Request fehlgeschlagen: ${response.status} ${response.statusText}`)
    }
    
    const text = await response.text()
    return parseCsvResponse(text)
  } catch (error) {
    console.error('❌ Tages-Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Holt aktuelle Statistiken für heute
 * @param {Object} options - Optionale Parameter
 * @param {string} options.site - API-Endpunkt (Standard: 'l_all')
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>|Object>} - Geparste Daten
 */
export async function getTodayStatistics(options = {}, signal = null) {
  try {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
    
    const params = {
      timeFrom: todayStr,
      timeTo: todayStr,
      ...options
    }
    
    const site = options.site || API_ENDPOINTS.LEADS_SALES
    
    if (site === API_ENDPOINTS.LEADS_SALES) {
      return await getLeadsSalesStatistics(params, signal)
    } else if (site === API_ENDPOINTS.BY_PROGRAM) {
      return await getProgramStatistics(params, signal)
    } else if (site === API_ENDPOINTS.MONTHLY_OVERVIEW) {
      return await getMonthlyOverview(params, signal)
    } else if (site === API_ENDPOINTS.BY_DAY) {
      return await getDailyStatistics(params, signal)
    }
    
    return null
  } catch (error) {
    console.error('❌ Heutige Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Holt Statistiken für den aktuellen Monat
 * @param {Object} options - Optionale Parameter
 * @param {string} options.site - API-Endpunkt (Standard: 'l_all')
 * @param {AbortSignal} signal - AbortSignal für Request-Abbruch
 * @returns {Promise<Array<Object>|Object>} - Geparste Daten
 */
export async function getCurrentMonthStatistics(options = {}, signal = null) {
  try {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const timeFrom = firstDay.toISOString().split('T')[0] // YYYY-MM-DD
    const timeTo = lastDay.toISOString().split('T')[0] // YYYY-MM-DD
    
    const params = {
      timeFrom,
      timeTo,
      ...options
    }
    
    const site = options.site || API_ENDPOINTS.LEADS_SALES
    
    if (site === API_ENDPOINTS.LEADS_SALES) {
      return await getLeadsSalesStatistics(params, signal)
    } else if (site === API_ENDPOINTS.BY_PROGRAM) {
      return await getProgramStatistics(params, signal)
    } else if (site === API_ENDPOINTS.MONTHLY_OVERVIEW) {
      return await getMonthlyOverview(params, signal)
    } else if (site === API_ENDPOINTS.BY_DAY) {
      return await getDailyStatistics(params, signal)
    }
    
    return null
  } catch (error) {
    console.error('❌ Monats-Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Speichert Tracking-Events lokal für spätere Analyse
 * Diese Funktion wird asynchron im Hintergrund ausgeführt und blockiert nicht die Website
 * @param {Object} eventData - Event-Daten
 * @param {string} eventData.category - Produktkategorie ('kreditkarten', 'broker', 'tagesgeld')
 * @param {string} eventData.productId - Produkt-ID
 * @param {string} eventData.productName - Produktname
 * @param {string} eventData.applyUrl - Affiliate-URL
 * @param {Object} eventData.additionalData - Zusätzliche Daten
 * @returns {Promise<void>}
 */
export async function trackFinanceadsEvent(eventData = {}) {
  try {
    // Speichere Event lokal für spätere Analyse
    // Dies ermöglicht es, Statistiken später mit der API abzurufen
    const event = {
      ...eventData,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    }
    
    // Speichere Event in localStorage (max. 100 Events)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storageKey = 'financeads:tracked_events'
        const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]')
        
        // Füge neues Event hinzu
        existingEvents.push(event)
        
        // Behalte nur die letzten 100 Events
        if (existingEvents.length > 100) {
          existingEvents.shift()
        }
        
        localStorage.setItem(storageKey, JSON.stringify(existingEvents))
      }
    } catch (storageError) {
      // localStorage Fehler werden ignoriert
      console.debug('Financeads Event Storage Fehler (nicht kritisch):', storageError)
    }
    
    // Führe API-Aufruf asynchron im Hintergrund aus (mit Verzögerung für Performance)
    // Verwende requestIdleCallback falls verfügbar, sonst setTimeout
    const scheduleApiCall = () => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(async () => {
          await updateFinanceadsStatistics(eventData)
        }, { timeout: 10000 }) // 10 Sekunden Timeout
      } else {
        // Fallback: setTimeout mit längerer Verzögerung (5 Sekunden)
        setTimeout(async () => {
          await updateFinanceadsStatistics(eventData)
        }, 5000)
      }
    }
    
    // Führe API-Aufruf nur aus, wenn die Website nicht blockiert wird
    scheduleApiCall()
  } catch (error) {
    // Fehler werden stillschweigend ignoriert, um die Website-Performance nicht zu beeinträchtigen
    console.debug('Financeads Event-Tracking Fehler (nicht kritisch):', error)
  }
}

/**
 * Aktualisiert Financeads Statistiken asynchron im Hintergrund
 * Diese Funktion ruft die API auf, um aktuelle Statistiken abzurufen
 * HINWEIS: Die API unterstützt keine CORS-Requests vom Browser.
 * Diese Funktion ist deaktiviert und macht nichts, um CORS-Fehler zu vermeiden.
 * @param {Object} eventData - Event-Daten
 * @returns {Promise<void>}
 */
async function updateFinanceadsStatistics(eventData = {}) {
  // API-Aufrufe sind jetzt über Proxy aktiviert
  // Versuche Statistiken für heute abzurufen
  try {
    if (!FINANCEADS_API_CONFIG.enabled) {
      console.debug('Financeads Statistics Update deaktiviert.')
      return Promise.resolve()
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    // Versuche Programm-Statistiken abzurufen (benötigt keine Lead-Berechtigung)
    const programStats = await getProgramStatistics({
      timeFrom: today,
      timeTo: today
    })
    
    if (programStats && Array.isArray(programStats) && programStats.length > 0) {
      console.debug('✅ Financeads Statistiken aktualisiert:', {
        date: today,
        programs: programStats.length
      })
      
      // Speichere Statistiken lokal für spätere Verwendung
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storageKey = `financeads:statistics_${today}`
          localStorage.setItem(storageKey, JSON.stringify({
            date: today,
            programStats,
            updatedAt: new Date().toISOString()
          }))
        }
      } catch (storageError) {
        // localStorage Fehler werden ignoriert
        console.debug('Financeads Statistics Storage Fehler (nicht kritisch):', storageError)
      }
    }
  } catch (error) {
    // Fehler werden stillschweigend ignoriert, um die Website-Performance nicht zu beeinträchtigen
    console.debug('Financeads Statistics Update Fehler (nicht kritisch):', error.message)
  }
  
  return Promise.resolve()
}

/**
 * Ruft gespeicherte Tracking-Events ab
 * @returns {Array<Object>} - Gespeicherte Events
 */
export function getTrackedEvents() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = 'financeads:tracked_events'
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    }
    return []
  } catch (error) {
    console.error('❌ Financeads Events konnten nicht geladen werden:', error)
    return []
  }
}

/**
 * Ruft gespeicherte Statistiken für einen bestimmten Tag ab
 * @param {string} date - Datum (YYYY-MM-DD)
 * @returns {Object|null} - Gespeicherte Statistiken
 */
export function getStoredStatistics(date) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = `financeads:statistics_${date}`
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : null
    }
    return null
  } catch (error) {
    console.error('❌ Financeads Statistiken konnten nicht geladen werden:', error)
    return null
  }
}

/**
 * Initialisiert regelmäßige Statistiken-Updates im Hintergrund
 * Diese Funktion ruft die API regelmäßig auf, um Statistiken zu aktualisieren
 * HINWEIS: Die API unterstützt keine CORS-Requests vom Browser.
 * Diese Funktion ist standardmäßig deaktiviert.
 * @param {Object} options - Optionen
 * @param {number} options.interval - Update-Intervall in Millisekunden (Standard: 1 Stunde)
 * @param {boolean} options.enabled - Ob regelmäßige Updates aktiviert sind (Standard: false)
 * @returns {Function} - Cleanup-Funktion zum Stoppen der Updates
 */
export function initPeriodicStatisticsUpdates(options = {}) {
  const {
    interval = 3600000, // 1 Stunde
    enabled = false // Standardmäßig deaktiviert wegen CORS-Problemen
  } = options
  
  // Prüfe ob API-Aufrufe überhaupt aktiviert sind
  if (!FINANCEADS_API_CONFIG.enabled || !enabled) {
    console.debug('Financeads API Updates deaktiviert (CORS-Probleme). Tracking erfolgt über Affiliate-Links.')
    return () => {} // Leere Cleanup-Funktion
  }
  
  let updateInterval = null
  let isRunning = false
  
  // Funktion zum Aktualisieren der Statistiken
  const updateStatistics = async () => {
    if (isRunning) {
      return // Verhindere gleichzeitige Updates
    }
    
    try {
      isRunning = true
      
      // Aktualisiere Statistiken für heute
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      await updateFinanceadsStatistics({
        date: todayStr
      })
    } catch (error) {
      console.debug('Financeads Periodisches Update Fehler (nicht kritisch):', error)
    } finally {
      isRunning = false
    }
  }
  
  // Starte regelmäßige Updates
  // Verwende requestIdleCallback falls verfügbar, sonst setTimeout
  const scheduleUpdate = () => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        updateStatistics()
        // Setze Interval nach erstem Update
        updateInterval = setInterval(updateStatistics, interval)
      }, { timeout: 30000 }) // 30 Sekunden Timeout
    } else {
      // Fallback: setTimeout mit Verzögerung
      setTimeout(() => {
        updateStatistics()
        // Setze Interval nach erstem Update
        updateInterval = setInterval(updateStatistics, interval)
      }, 5000) // 5 Sekunden Verzögerung
    }
  }
  
  // Starte Updates nur wenn die Seite sichtbar ist
  if (typeof document !== 'undefined') {
    // Starte Updates wenn die Seite sichtbar wird
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !updateInterval) {
        scheduleUpdate()
      } else if (document.visibilityState === 'hidden' && updateInterval) {
        // Stoppe Updates wenn die Seite versteckt ist
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Starte Updates wenn die Seite bereits sichtbar ist
    if (document.visibilityState === 'visible') {
      scheduleUpdate()
    }
    
    // Cleanup-Funktion
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  } else {
    // Fallback für Server-Side-Rendering
    scheduleUpdate()
    
    // Cleanup-Funktion
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }
}

/**
 * Test-Funktion für die Financeads API
 * Diese Funktion kann in der Browser-Konsole aufgerufen werden, um die API zu testen
 * @param {Object} options - Test-Optionen
 * @param {boolean} options.verbose - Ausführliche Ausgabe (Standard: true)
 * @returns {Promise<Object>} - Test-Ergebnisse
 */
export async function testFinanceadsApi(options = {}) {
  const { verbose = true } = options
  const results = {
    success: true,
    tests: [],
    errors: [],
    timestamp: new Date().toISOString()
  }
  
  const log = (message, data = null) => {
    if (verbose) {
      console.log(`📊 ${message}`, data || '')
    }
  }
  
  const error = (message, err = null) => {
    results.errors.push({ message, error: err?.message || err })
    if (verbose) {
      console.error(`❌ ${message}`, err || '')
    }
  }
  
  log('Financeads API Test gestartet')
  log('User-ID:', FINANCEADS_API_CONFIG.userId)
  log('API-Key:', FINANCEADS_API_CONFIG.apiKey.substring(0, 10) + '...')
  
  // Test 1: Leads & Sales Statistiken für heute
  try {
    log('Test 1: Leads & Sales Statistiken für heute...')
    const today = new Date().toISOString().split('T')[0]
    const leadsSales = await getLeadsSalesStatistics({
      type: LEADS_SALES_OPTIONS.TYPE.UPDATE,
      site: LEADS_SALES_OPTIONS.SITE.ALL,
      currency: FINANCEADS_API_CONFIG.defaultCurrency,
      timeFrom: today,
      timeTo: today
    })
    
    results.tests.push({
      name: 'Leads & Sales (Heute)',
      success: leadsSales !== null,
      data: leadsSales,
      count: Array.isArray(leadsSales) ? leadsSales.length : 'N/A'
    })
    
    if (leadsSales) {
      log('✅ Leads & Sales Statistiken geladen:', {
        count: Array.isArray(leadsSales) ? leadsSales.length : 'N/A',
        sample: Array.isArray(leadsSales) && leadsSales.length > 0 ? leadsSales[0] : null
      })
    } else {
      error('Leads & Sales Statistiken konnten nicht geladen werden')
    }
  } catch (err) {
    error('Test 1 fehlgeschlagen:', err)
    results.success = false
  }
  
  // Test 2: Programm-Statistiken für aktuellen Monat
  try {
    log('Test 2: Programm-Statistiken für aktuellen Monat...')
    const programStats = await getCurrentMonthStatistics({
      site: API_ENDPOINTS.BY_PROGRAM
    })
    
    results.tests.push({
      name: 'Programm-Statistiken (Aktueller Monat)',
      success: programStats !== null,
      data: programStats,
      count: Array.isArray(programStats) ? programStats.length : 'N/A'
    })
    
    if (programStats) {
      log('✅ Programm-Statistiken geladen:', {
        count: Array.isArray(programStats) ? programStats.length : 'N/A',
        sample: Array.isArray(programStats) && programStats.length > 0 ? programStats[0] : null
      })
    } else {
      error('Programm-Statistiken konnten nicht geladen werden')
    }
  } catch (err) {
    error('Test 2 fehlgeschlagen:', err)
    results.success = false
  }
  
  // Test 3: Monatsübersicht
  try {
    log('Test 3: Monatsübersicht...')
    const monthlyOverview = await getCurrentMonthStatistics({
      site: API_ENDPOINTS.MONTHLY_OVERVIEW
    })
    
    results.tests.push({
      name: 'Monatsübersicht (Aktueller Monat)',
      success: monthlyOverview !== null,
      data: monthlyOverview,
      count: Array.isArray(monthlyOverview) ? monthlyOverview.length : 'N/A'
    })
    
    if (monthlyOverview) {
      log('✅ Monatsübersicht geladen:', {
        count: Array.isArray(monthlyOverview) ? monthlyOverview.length : 'N/A',
        sample: Array.isArray(monthlyOverview) && monthlyOverview.length > 0 ? monthlyOverview[0] : null
      })
    } else {
      error('Monatsübersicht konnte nicht geladen werden')
    }
  } catch (err) {
    error('Test 3 fehlgeschlagen:', err)
    results.success = false
  }
  
  // Test 4: API-URL-Generierung
  try {
    log('Test 4: API-URL-Generierung...')
    const testUrl = buildFinanceadsApiUrl({
      site: API_ENDPOINTS.LEADS_SALES,
      params: {
        type: LEADS_SALES_OPTIONS.TYPE.UPDATE,
        currency: FINANCEADS_API_CONFIG.defaultCurrency,
        timeFrom: '2025-01-01',
        timeTo: '2025-01-31'
      }
    })
    
    results.tests.push({
      name: 'API-URL-Generierung',
      success: testUrl !== null && testUrl.includes(FINANCEADS_API_CONFIG.baseUrl),
      url: testUrl
    })
    
    if (testUrl) {
      log('✅ API-URL generiert:', testUrl)
    } else {
      error('API-URL konnte nicht generiert werden')
    }
  } catch (err) {
    error('Test 4 fehlgeschlagen:', err)
    results.success = false
  }
  
  // Zusammenfassung
  log('Financeads API Test abgeschlossen')
  log('Ergebnisse:', {
    success: results.success,
    tests: results.tests.length,
    errors: results.errors.length
  })
  
  return results
}

/**
 * Einfache Test-Funktion für einen schnellen API-Test
 * Diese Funktion kann in der Browser-Konsole aufgerufen werden
 * @returns {Promise<void>}
 */
export async function quickTestFinanceadsApi() {
  console.log('🧪 Financeads API Quick Test...')
  console.log('User-ID:', FINANCEADS_API_CONFIG.userId)
  console.log('API-Key:', FINANCEADS_API_CONFIG.apiKey.substring(0, 10) + '...')
  console.log('Proxy-URL:', FINANCEADS_API_CONFIG.proxyUrl)
  console.log('Status:', FINANCEADS_API_CONFIG.enabled ? '✅ Aktiviert' : '❌ Deaktiviert')
  console.log('')
  console.log('ℹ️ Die API-Aufrufe erfolgen jetzt über einen Vercel Serverless Function Proxy.')
  console.log('ℹ️ Das löst das CORS-Problem und ermöglicht direkte API-Aufrufe vom Browser.')
  
  // Zeige verschiedene API-URLs für manuelles Testen
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Test 1: Leads & Sales (kann "No Lead Permission" zurückgeben)
    const leadsSalesUrl = buildFinanceadsApiUrl({
      site: API_ENDPOINTS.LEADS_SALES,
      params: {
        type: LEADS_SALES_OPTIONS.TYPE.UPDATE,
        site: LEADS_SALES_OPTIONS.SITE.ALL,
        currency: FINANCEADS_API_CONFIG.defaultCurrency,
        timeFrom: today,
        timeTo: today
      }
    })
    
    // Test 2: Programm-Statistiken (benötigt keine Lead-Berechtigung)
    const programUrl = buildFinanceadsApiUrl({
      site: API_ENDPOINTS.BY_PROGRAM,
      params: {
        timeFrom: today,
        timeTo: today
      }
    })
    
    // Test 3: Monatsübersicht (benötigt keine Lead-Berechtigung)
    const monthlyUrl = buildFinanceadsApiUrl({
      site: API_ENDPOINTS.MONTHLY_OVERVIEW,
      params: {
        timeFrom: today,
        timeTo: today
      }
    })
    
    // Test 4: Tages-Statistiken (benötigt keine Lead-Berechtigung)
    const dailyUrl = buildFinanceadsApiUrl({
      site: API_ENDPOINTS.BY_DAY,
      params: {
        timeFrom: today,
        timeTo: today
      }
    })
    
    console.log('📅 Test-URLs für heute:', today)
    console.log('')
    console.log('🔗 API-URLs (kann direkt im Browser geöffnet werden):')
    console.log('')
    console.log('1. Leads & Sales (kann "No Lead Permission" zurückgeben):')
    console.log(leadsSalesUrl)
    console.log('')
    console.log('2. Programm-Statistiken (keine Lead-Berechtigung benötigt):')
    console.log(programUrl)
    console.log('')
    console.log('3. Monatsübersicht (keine Lead-Berechtigung benötigt):')
    console.log(monthlyUrl)
    console.log('')
    console.log('4. Tages-Statistiken (keine Lead-Berechtigung benötigt):')
    console.log(dailyUrl)
    console.log('')
    console.log('💡 Tipp: Versuchen Sie die anderen Endpunkte (2-4), wenn Leads & Sales "No Lead Permission" zurückgibt.')
    console.log('💡 Die anderen Endpunkte benötigen keine Lead-Berechtigung und sollten funktionieren.')
    console.log('💡 Oder prüfen Sie im Financeads Dashboard, ob Lead-Berechtigungen aktiviert sind.')
    console.log('')
    console.log('🧪 Teste jetzt die API über den Proxy...')
    
    // Teste die API direkt
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log('📊 Teste Programm-Statistiken für heute:', today)
      
      const testResult = await getProgramStatistics({
        timeFrom: today,
        timeTo: today
      })
      
      if (testResult && Array.isArray(testResult)) {
        console.log('✅ API-Test erfolgreich!')
        console.log('📈 Gefundene Programme:', testResult.length)
        if (testResult.length > 0) {
          console.log('📋 Beispiel-Daten:', testResult[0])
        }
      } else {
        console.log('⚠️ Keine Daten zurückgegeben (kann normal sein, wenn keine Statistiken vorhanden)')
      }
    } catch (error) {
      console.error('❌ API-Test fehlgeschlagen:', error.message)
      console.log('💡 Prüfen Sie:')
      console.log('   1. Ist die Vercel Serverless Function deployed?')
      console.log('   2. Gibt es Fehler in der Vercel Function Logs?')
      console.log('   3. Sind User-ID und API-Key korrekt?')
    }
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der API-URLs:', error)
  }
  
  return {
    success: FINANCEADS_API_CONFIG.enabled,
    message: FINANCEADS_API_CONFIG.enabled 
      ? 'API-Aufrufe sind über Proxy aktiviert.' 
      : 'API-Aufrufe sind deaktiviert.',
    proxyUrl: FINANCEADS_API_CONFIG.proxyUrl,
    urls: {
      leadsSales: leadsSalesUrl || null,
      program: programUrl || null,
      monthly: monthlyUrl || null,
      daily: dailyUrl || null
    }
  }
}

/**
 * Exportiere Konfiguration für externe Verwendung
 */
export { FINANCEADS_API_CONFIG, API_ENDPOINTS, LEADS_SALES_OPTIONS }

// Mache Test-Funktionen global verfügbar (nur im Browser)
// Diese Funktionen werden automatisch geladen, wenn das Modul importiert wird
if (typeof window !== 'undefined') {
  // Test-Funktionen werden beim Import des Moduls verfügbar gemacht
  // Sie werden in main.js registriert, wenn die API initialisiert wird
}

