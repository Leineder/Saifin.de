// affiliate-performance-fallback.js
// Fallback für Affiliate Performance Monitoring

/**
 * Fallback-Performance-Monitoring für mobile Kompatibilität
 */
export function useAffiliatePerformance(id) {
  // Fallback-Funktionen die nichts tun
  const startMeasurement = (url) => {
    console.log('Performance measurement started (fallback):', url)
    return 'fallback-measurement-id'
  }
  
  const endMeasurement = (measurementId, options = {}) => {
    console.log('Performance measurement ended (fallback):', measurementId, options)
  }
  
  const collectWebVitals = (measurementId) => {
    console.log('Web vitals collected (fallback):', measurementId)
  }
  
  return {
    startMeasurement,
    endMeasurement,
    collectWebVitals
  }
}
