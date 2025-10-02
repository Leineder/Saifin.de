// Leichtes Web Vitals Reporting (CLS, LCP, FID, INP, TTFB)
// sendet Werte an console und optional an ein Endpoint (ENV: VITALS_ENDPOINT)
import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals/attribution'

function sendToAnalytics(metric) {
  try {
    // Immer in console für Transparenz
    console.log('[web-vitals]', metric.name, Math.round(metric.value), metric)

    const endpoint = import.meta.env.VITALS_ENDPOINT || process.env.VITALS_ENDPOINT
    if (!endpoint) return
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
      attribution: metric.attribution
    })
    navigator.sendBeacon?.(endpoint, body)
  } catch (_) {}
}

export function initWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (_) {}
}


