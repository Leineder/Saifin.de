import { track } from '@vercel/analytics'

/**
 * Analytics Events für Produktinteraktionen
 */

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
    track(EVENT_TYPES.PRODUCT_VIEW, {
      product_id: productId,
      product_name: productName,
      category: category,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
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
    track(EVENT_TYPES.PRODUCT_APPLY, {
      product_id: productId,
      product_name: productName,
      category: category,
      apply_url: applyUrl,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
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
    track('filter_used', {
      filter_type: filterType,
      filter_value: filterValue,
      category: category,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

// Tracking für Suchanfragen
export function trackSearch(query, resultsCount, category) {
  try {
    track('search_performed', {
      search_query: query,
      results_count: resultsCount,
      category: category,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}
