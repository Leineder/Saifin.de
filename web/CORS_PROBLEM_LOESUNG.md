# CORS-Problem mit Financeads API - Lösung

## Problem

Die Financeads API unterstützt **keine CORS-Requests vom Browser**. Das bedeutet, dass wir die API nicht direkt vom Browser aus aufrufen können.

### Fehler:
```
Failed to load resource: Request header field `Cache-Control` is not allowed by Access-Control-Allow-Headers.
Financeads API Request fehlgeschlagen: TypeError: Load failed
```

## Lösung

### 1. API-Aufrufe deaktiviert (aktuell)

Die API-Aufrufe sind jetzt **deaktiviert**, um CORS-Fehler zu vermeiden. Das bedeutet:
- ✅ **Keine CORS-Fehler mehr** in der Konsole
- ✅ **Tracking funktioniert** über Affiliate-Links direkt
- ✅ **Events werden lokal gespeichert** für spätere Analyse
- ❌ **Keine API-Aufrufe** vom Browser aus

### 2. Manuelle API-Tests

Sie können die API-URL **direkt im Browser** öffnen:

1. Öffnen Sie die Browser-Konsole
2. Führen Sie aus: `await window.quickTestFinanceadsApi()`
3. Die API-URL wird angezeigt
4. Kopieren Sie die URL und öffnen Sie sie direkt im Browser
5. Die Statistiken werden als CSV oder XML angezeigt

### 3. Zukünftige Lösung: Proxy-Server

Für programmatische API-Aufrufe benötigen Sie einen **Proxy-Server**:

#### Option 1: Vercel Serverless Function

Erstellen Sie eine Serverless Function in Vercel:

```javascript
// api/financeads.js
export default async function handler(req, res) {
  const { site, timeFrom, timeTo, ...params } = req.query
  
  const url = new URL('https://data.financeads.net/api/statistics.php')
  url.searchParams.set('site', site)
  url.searchParams.set('user', '57387')
  url.searchParams.set('key', '4543b9ad41727264a8f8c8a4f1d97f7e')
  
  // Füge weitere Parameter hinzu
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  try {
    const response = await fetch(url.toString())
    const data = await response.text()
    
    res.setHeader('Content-Type', 'text/csv')
    res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

#### Option 2: Node.js Proxy-Server

Erstellen Sie einen einfachen Proxy-Server:

```javascript
// server/proxy.js
const express = require('express')
const fetch = require('node-fetch')
const app = express()

app.get('/api/financeads', async (req, res) => {
  const { site, timeFrom, timeTo, ...params } = req.query
  
  const url = new URL('https://data.financeads.net/api/statistics.php')
  url.searchParams.set('site', site)
  url.searchParams.set('user', '57387')
  url.searchParams.set('key', '4543b9ad41727264a8f8c8a4f1d97f7e')
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  try {
    const response = await fetch(url.toString())
    const data = await response.text()
    
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('Proxy-Server läuft auf Port 3000')
})
```

## Was funktioniert jetzt?

### ✅ Event-Tracking (lokal)
- Events werden lokal in `localStorage` gespeichert
- Keine API-Aufrufe, daher keine CORS-Fehler
- Tracking erfolgt über Affiliate-Links direkt

### ✅ Affiliate-Link-Tracking
- Alle Affiliate-Links funktionieren normal
- Financeads trackt die Klicks direkt
- Statistiken sind im Financeads Dashboard verfügbar

### ✅ API-URL-Generierung
- Die API-URL wird korrekt generiert
- Kann direkt im Browser geöffnet werden
- Test-Funktionen zeigen die URL an

## Was funktioniert nicht?

### ❌ Direkte API-Aufrufe vom Browser
- CORS-Fehler verhindern direkte Aufrufe
- API-Aufrufe sind deaktiviert

### ❌ Regelmäßige Statistiken-Updates
- Automatische Updates sind deaktiviert
- Benötigen einen Proxy-Server

## Nächste Schritte

1. **Aktuell**: Verwenden Sie das lokale Event-Tracking
2. **Für Statistiken**: Öffnen Sie die API-URL direkt im Browser
3. **Für automatische Updates**: Richten Sie einen Proxy-Server ein

## Hilfe

Falls Sie Hilfe beim Einrichten eines Proxy-Servers benötigen, können Sie:
1. Die Vercel Serverless Function verwenden
2. Einen eigenen Node.js Server einrichten
3. Financeads Support kontaktieren (falls CORS-Header hinzugefügt werden können)

## Zusammenfassung

- ✅ **Keine CORS-Fehler mehr** - API-Aufrufe sind deaktiviert
- ✅ **Tracking funktioniert** - Über Affiliate-Links direkt
- ✅ **Events werden lokal gespeichert** - Für spätere Analyse
- ✅ **API-URL kann manuell getestet werden** - Direkt im Browser
- ⚠️ **Für automatische Updates benötigen Sie einen Proxy-Server**

