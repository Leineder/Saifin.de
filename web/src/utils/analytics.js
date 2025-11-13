// Manuelle Vercel Analytics Integration für Vue.js

/**
 * Analytics Events für Produktinteraktionen
 */

// Financeads API Integration (lazy import für Performance)
let financeadsApiModule = null
async function getFinanceadsApi() {
  if (!financeadsApiModule) {
    try {
      financeadsApiModule = await import('./financeads-api.js')
    } catch (error) {
      console.warn('⚠️ Financeads API Modul konnte nicht geladen werden:', error)
    }
  }
  return financeadsApiModule
}

// Produktkategorien
export const PRODUCT_CATEGORIES = {
  CREDIT_CARDS: 'kreditkarten',
  BROKERS: 'broker', 
  SAVINGS: 'tagesgeld'
}

// Event-Typen
export const EVENT_TYPES = {
  PRODUCT_VIEW: 'product_view',
  PRODUCT_APPLY: 'product_apply'
}

/**
 * Tracking-Funktion für Produktansichten
 * @param {string} productId - Eindeutige Produkt-ID
 * @param {string} productName - Produktname
 * @param {string} category - Produktkategorie
 */
export function trackProductView(productId, productName, category) {
  try {
    console.log('🔍 Tracking product view:', { productId, productName, category })
    
    // Warten bis Analytics geladen ist
    const sendEvent = () => {
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', EVENT_TYPES.PRODUCT_VIEW, {
          product_id: productId,
          product_name: productName,
          category: category,
          timestamp: new Date().toISOString()
        })
        console.log('✅ Product view tracked successfully')
        return true
      }
      return false
    }
    
    // Sofort versuchen
    if (!sendEvent()) {
      // Falls nicht verfügbar, nach kurzer Zeit nochmal versuchen
      setTimeout(() => {
        if (!sendEvent()) {
          console.warn('⚠️ Vercel Analytics nicht verfügbar nach Wartezeit')
        }
      }, 1000)
    }
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error)
  }
}

/**
 * Tracking-Funktion für Produktanfragen
 * @param {string} productId - Eindeutige Produkt-ID
 * @param {string} productName - Produktname
 * @param {string} category - Produktkategorie
 * @param {string} applyUrl - URL der Antragsseite
 */
export function trackProductApply(productId, productName, category, applyUrl) {
  try {
    console.log('🚀 Tracking product apply:', { productId, productName, category, applyUrl })
    
    // Warten bis Analytics geladen ist
    const sendEvent = () => {
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', EVENT_TYPES.PRODUCT_APPLY, {
          product_id: productId,
          product_name: productName,
          category: category,
          apply_url: applyUrl,
          timestamp: new Date().toISOString()
        })
        console.log('✅ Product apply tracked successfully')
        return true
      }
      return false
    }
    
    // Sofort versuchen
    if (!sendEvent()) {
      // Falls nicht verfügbar, nach kurzer Zeit nochmal versuchen
      setTimeout(() => {
        if (!sendEvent()) {
          console.warn('⚠️ Vercel Analytics nicht verfügbar nach Wartezeit')
        }
      }, 1000)
    }
    
    // Financeads API: Event-Tracking (lokal speichern, keine API-Aufrufe wegen CORS)
    // HINWEIS: Die Financeads API unterstützt keine CORS-Requests vom Browser.
    // Das Tracking erfolgt über die Affiliate-Links direkt.
    // Events werden lokal gespeichert für spätere Analyse.
    if (applyUrl && applyUrl.includes('financeads.net')) {
      getFinanceadsApi().then(apiModule => {
        if (apiModule && apiModule.trackFinanceadsEvent) {
          // Tracke Event lokal (keine API-Aufrufe wegen CORS)
          apiModule.trackFinanceadsEvent({
            category,
            productId,
            productName,
            applyUrl,
            additionalData: {
              timestamp: new Date().toISOString(),
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
              referrer: typeof document !== 'undefined' ? document.referrer : ''
            }
          })
        }
      }).catch(error => {
        // Fehler werden stillschweigend ignoriert, um die Website-Performance nicht zu beeinträchtigen
        console.debug('Financeads Event Tracking Fehler (nicht kritisch):', error)
      })
    }
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error)
  }
}

/**
 * Spezifische Tracking-Funktionen für jede Produktkategorie
 */

// Kreditkarten Events
export function trackCreditCardView(cardId, cardName) {
  trackProductView(cardId, cardName, PRODUCT_CATEGORIES.CREDIT_CARDS)
}

export function trackCreditCardApply(cardId, cardName, applyUrl) {
  trackProductApply(cardId, cardName, PRODUCT_CATEGORIES.CREDIT_CARDS, applyUrl)
}

// Broker Events
export function trackBrokerView(brokerId, brokerName) {
  trackProductView(brokerId, brokerName, PRODUCT_CATEGORIES.BROKERS)
}

export function trackBrokerApply(brokerId, brokerName, applyUrl) {
  trackProductApply(brokerId, brokerName, PRODUCT_CATEGORIES.BROKERS, applyUrl)
}

// Tagesgeld Events
export function trackSavingsView(savingsId, savingsName) {
  trackProductView(savingsId, savingsName, PRODUCT_CATEGORIES.SAVINGS)
}

export function trackSavingsApply(savingsId, savingsName, applyUrl) {
  trackProductApply(savingsId, savingsName, PRODUCT_CATEGORIES.SAVINGS, applyUrl)
}

/**
 * Hilfsfunktionen für häufige Tracking-Szenarien
 */

// Tracking für Navigation zu Produktdetailseiten
export function trackProductNavigation(productId, productName, category) {
  trackProductView(productId, productName, category)
}

// Tracking für Antragsbutton-Klicks
export function trackApplyButtonClick(productId, productName, category, applyUrl) {
  trackProductApply(productId, productName, category, applyUrl)
}

// Tracking für Filterinteraktionen
export function trackFilterUsage(filterType, filterValue, category) {
  try {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', 'filter_used', {
        filter_type: filterType,
        filter_value: filterValue,
        category: category,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

// Tracking für Suchanfragen
export function trackSearch(query, resultsCount, category) {
  try {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', 'search_performed', {
        search_query: query,
        results_count: resultsCount,
        category: category,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}
