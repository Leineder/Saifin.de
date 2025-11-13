// Vercel Serverless Function als Proxy für Financeads API
// Löst das CORS-Problem, da die Financeads API keine Browser-Requests unterstützt

export default async function handler(req, res) {
  // Nur GET-Requests erlauben
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Financeads API Konfiguration
  const FINANCEADS_API_BASE = 'https://data.financeads.net/api/statistics.php'
  const USER_ID = '57387'
  const API_KEY = '4543b9ad41727264a8f8c8a4f1d97f7e'

  try {
    // Query-Parameter vom Client übernehmen
    const { site, ...queryParams } = req.query

    if (!site) {
      return res.status(400).json({ error: 'Parameter "site" ist erforderlich' })
    }

    // Financeads API URL zusammenbauen
    const apiUrl = new URL(FINANCEADS_API_BASE)
    
    // Erforderliche Parameter
    apiUrl.searchParams.set('site', site)
    apiUrl.searchParams.set('user', USER_ID)
    apiUrl.searchParams.set('key', API_KEY)

    // Alle anderen Query-Parameter weiterleiten
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) {
        apiUrl.searchParams.set(key, queryParams[key])
      }
    })

    // Request an Financeads API senden
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Saifin-Proxy/1.0'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Financeads API Fehler:', response.status, errorText)
      return res.status(response.status).json({ 
        error: 'Financeads API Fehler',
        status: response.status,
        message: errorText
      })
    }

    // Response-Type bestimmen
    const contentType = response.headers.get('content-type') || 'text/plain'
    
    // Daten abrufen
    const data = await response.text()

    // Response mit korrektem Content-Type zurücksenden
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return res.status(200).send(data)

  } catch (error) {
    console.error('Proxy Fehler:', error)
    return res.status(500).json({ 
      error: 'Interner Serverfehler',
      message: error.message 
    })
  }
}

