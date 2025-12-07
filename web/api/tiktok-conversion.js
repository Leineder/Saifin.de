// Vercel Serverless Function für TikTok Server-to-Server Conversion Tracking
// Löst das Problem: Bank API Error: Code 40002 - invalid value for context.user_agent: value may not be null
// 
// Diese Funktion empfängt TikTok S2S Events und fügt einen User-Agent hinzu (oder Fallback),
// bevor das Event an FinanceAds weitergeleitet wird.

export default async function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // OPTIONS-Request für CORS-Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  // Nur POST-Requests erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }
  
  try {
    // TikTok Event-Daten aus Request Body extrahieren
    const tiktokEvent = req.body
    
    // User-Agent aus Request Header extrahieren
    const userAgent = req.headers['user-agent'] || 
                     req.headers['x-forwarded-user-agent'] ||
                     null
    
    // Fallback User-Agent (wie von FinanceAds empfohlen)
    const FALLBACK_USER_AGENT = 'Mozilla/5.0 (compatible; SaifinBot/1.0; +https://www.saifin.de)'
    
    // Stelle sicher, dass context.user_agent vorhanden ist
    if (!tiktokEvent.context) {
      tiktokEvent.context = {}
    }
    
    // User-Agent setzen: Verwendet echten User-Agent oder Fallback
    if (!tiktokEvent.context.user_agent) {
      tiktokEvent.context.user_agent = userAgent || FALLBACK_USER_AGENT
    }
    
    // Stelle sicher, dass weitere erforderliche Felder vorhanden sind
    if (!tiktokEvent.context.ip_address && req.headers['x-forwarded-for']) {
      // IP-Adresse aus Header extrahieren (erste IP bei mehreren)
      const forwardedFor = req.headers['x-forwarded-for']
      tiktokEvent.context.ip_address = forwardedFor.split(',')[0].trim()
    }
    
    // Logging für Debugging (nur in Development)
    if (process.env.NODE_ENV === 'development') {
      console.log('TikTok Conversion Event:', {
        event: tiktokEvent.event,
        hasUserAgent: !!tiktokEvent.context.user_agent,
        userAgent: tiktokEvent.context.user_agent?.substring(0, 50) + '...',
        hasIpAddress: !!tiktokEvent.context.ip_address
      })
    }
    
    // FinanceAds Paid Traffic Optimizer Endpoint
    // HINWEIS: Dieser Endpoint muss noch von FinanceAds bereitgestellt werden
    // Für jetzt loggen wir das Event mit User-Agent
    const FINANCEADS_PTO_ENDPOINT = process.env.FINANCEADS_PTO_ENDPOINT || 
                                    'https://t.financeads.net/pixel/'
    
    // Event an FinanceAds weiterleiten (wenn Endpoint konfiguriert ist)
    if (FINANCEADS_PTO_ENDPOINT && FINANCEADS_PTO_ENDPOINT !== 'https://t.financeads.net/pixel/') {
      try {
        const financeadsResponse = await fetch(FINANCEADS_PTO_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': tiktokEvent.context.user_agent
          },
          body: JSON.stringify(tiktokEvent)
        })
        
        if (!financeadsResponse.ok) {
          console.error('FinanceAds API Fehler:', financeadsResponse.status, await financeadsResponse.text())
        }
      } catch (error) {
        console.error('Fehler beim Weiterleiten an FinanceAds:', error.message)
        // Fehler nicht an Client weitergeben, Event wurde bereits verarbeitet
      }
    }
    
    // Erfolgreiche Antwort zurückgeben
    return res.status(200).json({
      success: true,
      message: 'TikTok conversion event processed',
      hasUserAgent: !!tiktokEvent.context.user_agent,
      userAgentSource: userAgent ? 'request-header' : 'fallback'
    })
    
  } catch (error) {
    console.error('TikTok Conversion Webhook Fehler:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
