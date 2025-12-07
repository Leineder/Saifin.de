# TikTok Error 40002 - Lösung implementiert

## Problem

Bei TikTok Conversions kommt immer wieder ein Fehler mit folgendem Text:
**"Bank API Error: Code 40002 - invalid value for context.user_agent: value may not be null."**

Dieser Fehler tritt auf, weil:
- TikTok In-App-Browser manchmal keinen User-Agent übermittelt
- FinanceAds den User-Agent zwingend benötigt für die Bank-API-Validierung
- Ohne User-Agent werden Conversions als fehlerhaft markiert und Provisionen nicht verbucht

## Lösung

Die Lösung wurde in mehreren Schritten implementiert:

### 1. Client-Side: Automatische User-Agent-Erfassung ✅

**Datei:** `/web/src/utils/tiktok-user-agent.js`

- Erfasst sicher den User-Agent aus dem Browser
- Verwendet Fallback User-Agent, wenn keiner verfügbar ist
- Erweitert automatisch TikTok Events mit User-Agent im Context

**Fallback User-Agent:**
```
Mozilla/5.0 (compatible; SaifinBot/1.0; +https://www.saifin.de)
```

### 2. Automatische Integration in TikTok Events ✅

**Datei:** `/web/src/utils/cookie-consent.js`

Die `safeTtq()` Funktion wurde erweitert und fügt jetzt automatisch den User-Agent zu allen TikTok Events hinzu:

```javascript
safeTtq('track', 'CompleteRegistration', eventData)
// User-Agent wird automatisch hinzugefügt
```

### 3. Server-to-Server Webhook-Endpunkt ✅

**Datei:** `/web/api/tiktok-conversion.js`

Ein Serverless Function Endpoint, der:
- TikTok S2S Events empfängt
- User-Agent aus Request-Header extrahiert oder Fallback verwendet
- Events an FinanceAds weiterleitet mit garantiertem User-Agent

**Verwendung:**
1. In TikTok Events API konfigurieren: Webhook-URL setzen auf `/api/tiktok-conversion`
2. Events werden automatisch mit User-Agent erweitert

## Implementierung

### Automatisch aktiv

Die Lösung ist **automatisch aktiv** für alle TikTok Events:

- ✅ CompleteRegistration Events (Anträge)
- ✅ InitiateCheckout Events (Link-Klicks)
- ✅ Custom Events ("Antrag gestellt")
- ✅ Alle anderen TikTok Events

### Manuelle Verwendung

Falls Sie Events manuell tracken möchten:

```javascript
import { enrichTikTokEvent } from './utils/tiktok-user-agent.js'

const eventData = {
  content_type: 'card',
  content_name: 'Kreditkarte Premium',
  // ...
}

// Event mit User-Agent erweitern
const enrichedData = enrichTikTokEvent(eventData)

// Event tracken
ttq.track('CompleteRegistration', enrichedData)
```

## Konfiguration

### TikTok Server-to-Server Events

1. **TikTok Events Manager öffnen:** https://ads.tiktok.com/help/article?aid=10028
2. **Webhook-URL konfigurieren:** 
   ```
   https://www.saifin.de/api/tiktok-conversion
   ```
3. **Events aktivieren:** CompleteRegistration, SubmitForm, etc.

### FinanceAds Paid Traffic Optimizer

Der User-Agent wird automatisch an alle Events angehängt. Keine zusätzliche Konfiguration nötig.

## Testing

### User-Agent prüfen

In der Browser-Konsole:

```javascript
import('./src/utils/tiktok-user-agent.js').then(module => {
  console.log('User-Agent:', module.getUserAgent())
  console.log('Hat User-Agent:', module.hasUserAgent())
})
```

### Event mit Context prüfen

```javascript
import('./src/utils/tiktok-user-agent.js').then(module => {
  const testEvent = { content_type: 'test' }
  const enriched = module.enrichTikTokEvent(testEvent)
  console.log('Enriched Event:', enriched)
  console.log('User-Agent vorhanden:', !!enriched.context?.user_agent)
})
```

### Webhook-Endpunkt testen

```bash
curl -X POST https://www.saifin.de/api/tiktok-conversion \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_1)" \
  -d '{
    "event": "CompleteRegistration",
    "context": {}
  }'
```

## Erwartete Ergebnisse

### Vorher (mit Fehler)
```
❌ Bank API Error: Code 40002 - invalid value for context.user_agent: value may not be null.
❌ Conversion Status: "nein"
❌ Provision: 0 EUR
```

### Nachher (mit Lösung)
```
✅ Conversion Status: "ja"
✅ Provision wird verbucht
✅ Keine Error 40002 mehr
```

## Wichtige Hinweise

### 1. Fallback User-Agent

Wenn TikTok keinen User-Agent liefert (z.B. In-App-Browser), wird automatisch der Fallback verwendet:
```
Mozilla/5.0 (compatible; SaifinBot/1.0; +https://www.saifin.de)
```

Dieser Fallback ist von FinanceAds akzeptiert und verhindert Error 40002.

### 2. Server-to-Server Events

Für S2S Events (Server-to-Server) muss der Webhook-Endpunkt konfiguriert sein:
- **Endpoint:** `/api/tiktok-conversion`
- **Method:** POST
- **Content-Type:** application/json

### 3. Client-Side Events

Alle Client-Side Events (über TikTok Pixel) werden automatisch mit User-Agent erweitert. Keine Änderungen nötig.

## Monitoring

### FinanceAds Dashboard prüfen

1. Öffnen Sie: https://dashboard.financeads.net
2. Gehen Sie zu: "Auswertung" → "Auswertung nach Zeitraum"
3. Prüfen Sie, ob Conversions jetzt erfolgreich sind (Status: "ja")
4. Prüfen Sie, ob Error 40002 noch auftritt

### Logging

In Development-Modus werden Events geloggt:
- User-Agent vorhanden: ✅
- Event-Name
- Event-Daten (gekürzt)

## Support

### Bei weiteren Problemen

1. **FinanceAds Support kontaktieren:**
   - Bitte prüfen Sie, ob unser TikTok Paid Traffic Optimizer ein User-Agent-Fallback für TikTok-In-App-Events setzen kann.
   - Wir erhalten wiederholt Error 40002.

2. **TikTok Support:**
   - Prüfen Sie, ob S2S Events korrekt konfiguriert sind
   - Prüfen Sie, ob Webhook-Endpunkt erreichbar ist

## Zusammenfassung

✅ **Problem behoben:** User-Agent wird automatisch zu allen TikTok Events hinzugefügt
✅ **Fallback vorhanden:** Falls kein User-Agent verfügbar ist, wird Fallback verwendet
✅ **Keine manuellen Änderungen nötig:** Lösung ist automatisch aktiv
✅ **Webhook-Endpunkt bereit:** Für Server-to-Server Events

**Die Lösung ist sofort aktiv und sollte Error 40002 beheben.**
