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
