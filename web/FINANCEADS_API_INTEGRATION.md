# Financeads API Integration

## Übersicht

Die Financeads Auswertungs-API wurde erfolgreich in die Website integriert. Die API ermöglicht es, Statistiken über Leads, Sales, Programme und mehr abzurufen.

## Konfiguration

Die API-Konfiguration befindet sich in `/web/src/utils/financeads-api.js`:

- **User-ID**: `57387`
- **API-Key**: `4543b9ad41727264a8f8c8a4f1d97f7e`
- **Base URL**: `https://data.financeads.net/api/statistics.php`

## Verfügbare Endpunkte

### 1. Leads & Sales
- **Endpoint**: `l_all` (Alle Leads inkl. stornierter)
- **Optionale Parameter**:
  - `type`: `update` (Bearbeitungsdatum) oder `origin` (Entstehungsdatum)
  - `site`: `l_all` (Alle), `l` (Offene & bestätigte), `l_oc` (Nur bestätigte)
  - `currency`: `EUR`, `CHF`, `GBP`, `PLN`
  - `format`: `csv` (Standard) oder `xml`

### 2. Auswertung nach Programm
- **Endpoint**: `pr`
- **Optionale Parameter**:
  - `time_from` & `time_to`: Zeitraum (YYYY-MM-DD)
  - `w`: Werbeflächen-ID

### 3. Monatsübersicht
- **Endpoint**: `monatsuebersicht`
- **Optionale Parameter**:
  - `time_from` & `time_to`: Zeitraum (YYYY-MM-DD)
  - `w`: Werbeflächen-ID

### 4. Auswertung nach Tag
- **Endpoint**: `d`
- **Optionale Parameter**:
  - `time_from` & `time_to`: Zeitraum (YYYY-MM-DD)
  - `w`: Werbeflächen-ID
  - `prid`: Programm-ID

## Verwendung

### Manuelle API-Aufrufe

```javascript
import { 
  getLeadsSalesStatistics,
  getProgramStatistics,
  getMonthlyOverview,
  getDailyStatistics,
  getTodayStatistics,
  getCurrentMonthStatistics
} from './utils/financeads-api'

// Leads & Sales Statistiken für heute
const statistics = await getTodayStatistics({
  site: 'l_all',
  type: 'update',
  currency: 'EUR'
})

// Programm-Statistiken für einen Zeitraum
const programStats = await getProgramStatistics({
  timeFrom: '2025-01-01',
  timeTo: '2025-01-31'
})
```

### Automatisches Tracking

Das Tracking erfolgt automatisch, wenn Benutzer auf Affiliate-Links klicken:

1. **Event-Tracking**: Wenn ein Benutzer auf einen Affiliate-Link klickt, wird ein Event lokal gespeichert
2. **Statistiken-Updates**: Die API wird regelmäßig (alle 1 Stunde) aufgerufen, um Statistiken zu aktualisieren
3. **Performance-Optimierung**: API-Aufrufe werden asynchron im Hintergrund ausgeführt und blockieren nicht die Website

### Regelmäßige Statistiken-Updates

Die regelmäßigen Statistiken-Updates werden automatisch initialisiert, wenn die Website geladen wird:

```javascript
// In main.js
import { initPeriodicStatisticsUpdates } from './utils/financeads-api'

const cleanup = initPeriodicStatisticsUpdates({
  interval: 3600000, // 1 Stunde
  enabled: true
})
```

**Wichtige Features**:
- Updates werden nur ausgeführt, wenn die Seite sichtbar ist
- API-Aufrufe werden mit `requestIdleCallback` verzögert, um die Performance nicht zu beeinträchtigen
- Statistiken werden in localStorage gespeichert für spätere Analyse

## Performance-Optimierungen

### 1. Asynchrone Ausführung
- API-Aufrufe werden asynchron im Hintergrund ausgeführt
- Verwendung von `requestIdleCallback` für optimale Performance
- Timeout von 10 Sekunden für API-Requests

### 2. Lazy Loading
- Financeads API wird nur geladen, wenn benötigt
- Lazy Import in `analytics.js` für bessere Performance

### 3. Caching
- Statistiken werden in localStorage gespeichert
- Events werden lokal gespeichert (max. 100 Events)
- Updates werden nur ausgeführt, wenn die Seite sichtbar ist

### 4. Fehlerbehandlung
- Fehler werden stillschweigend ignoriert, um die Website-Performance nicht zu beeinträchtigen
- Logging nur in Development-Modus

## Lokale Datenspeicherung

### Gespeicherte Events
- **Key**: `financeads:tracked_events`
- **Format**: Array von Events
- **Limit**: 100 Events

### Gespeicherte Statistiken
- **Key**: `financeads:statistics_YYYY-MM-DD`
- **Format**: JSON-Objekt mit Statistiken und Metadaten
- **Ablauf**: Kein automatischer Ablauf (kann manuell gelöscht werden)

## Abrufen von gespeicherten Daten

```javascript
import { getTrackedEvents, getStoredStatistics } from './utils/financeads-api'

// Alle gespeicherten Events abrufen
const events = getTrackedEvents()

// Statistiken für einen bestimmten Tag abrufen
const statistics = getStoredStatistics('2025-01-15')
```

## Integration in bestehende Tracking-Funktionen

Die Financeads API ist in die bestehenden Tracking-Funktionen integriert:

- `trackProductApply()`: Ruft automatisch die Financeads API auf, wenn ein Affiliate-Link geklickt wird
- Alle Detail-Views (CardDetail, SavingsDetail, BrokerDetail) verwenden automatisch die Financeads API

## API-URL-Beispiele

### Leads & Sales (CSV)
```
https://data.financeads.net/api/statistics.php?site=l_all&user=57387&key={API-Key}&type=update&currency=EUR&format=csv&time_from=2025-01-01&time_to=2025-01-31
```

### Leads & Sales (XML)
```
https://data.financeads.net/api/statistics.php?site=l_all&user=57387&key={API-Key}&type=update&currency=EUR&format=xml&time_from=2025-01-01&time_to=2025-01-31
```

### Programm-Statistiken
```
https://data.financeads.net/api/statistics.php?site=pr&user=57387&key={API-Key}&format=csv&time_from=2025-01-01&time_to=2025-01-31
```

### Monatsübersicht
```
https://data.financeads.net/api/statistics.php?site=monatsuebersicht&user=57387&key={API-Key}&format=csv&time_from=2025-01-01&time_to=2025-01-31
```

### Tages-Statistiken
```
https://data.financeads.net/api/statistics.php?site=d&user=57387&key={API-Key}&format=csv&time_from=2025-01-15&time_to=2025-01-15&prid={Programm-ID}
```

## Wichtige Hinweise

1. **API-Key Sicherheit**: Der API-Key ist in der Client-seitigen Datei gespeichert. Dies ist für eine Client-seitige Anwendung akzeptabel, da die API nur Statistiken abruft und keine sensiblen Daten ändert.

2. **Performance**: API-Aufrufe werden asynchron im Hintergrund ausgeführt und blockieren nicht die Website-Performance.

3. **Fehlerbehandlung**: Fehler werden stillschweigend ignoriert, um die Website-Performance nicht zu beeinträchtigen.

4. **Browser-Kompatibilität**: Die Implementierung verwendet moderne Browser-APIs (`requestIdleCallback`, `fetch`). Für ältere Browser werden Fallbacks bereitgestellt.

## Troubleshooting

### API-Aufrufe funktionieren nicht
- Prüfen Sie, ob der API-Key korrekt ist
- Prüfen Sie die Browser-Konsole auf Fehler
- Prüfen Sie, ob die API-URL korrekt ist

### Statistiken werden nicht aktualisiert
- Prüfen Sie, ob regelmäßige Updates aktiviert sind
- Prüfen Sie, ob die Seite sichtbar ist (Updates werden nur ausgeführt, wenn die Seite sichtbar ist)
- Prüfen Sie die Browser-Konsole auf Fehler

### Performance-Probleme
- API-Aufrufe werden asynchron ausgeführt und sollten keine Performance-Probleme verursachen
- Wenn Probleme auftreten, können regelmäßige Updates deaktiviert werden
- Prüfen Sie die Browser-Konsole auf Warnungen

## Testing

### Test-Funktionen in der Browser-Konsole

Die Financeads API kann direkt in der Browser-Konsole getestet werden. Nach dem Laden der Website sind folgende Test-Funktionen verfügbar:

#### 1. Schneller API-Test

```javascript
// Führt einen schnellen Test der API durch
await window.quickTestFinanceadsApi()
```

Diese Funktion:
- Testet die API für heute
- Zeigt die Ergebnisse in der Konsole
- Gibt eine Zusammenfassung aus

#### 2. Vollständiger API-Test

```javascript
// Führt einen vollständigen Test aller API-Endpunkte durch
await window.testFinanceadsApi()
```

Diese Funktion:
- Testet alle API-Endpunkte (Leads & Sales, Programm, Monatsübersicht)
- Testet die API-URL-Generierung
- Zeigt detaillierte Ergebnisse für jeden Test
- Gibt eine Zusammenfassung aus

#### 3. Test mit Optionen

```javascript
// Test mit weniger Ausgabe
await window.testFinanceadsApi({ verbose: false })
```

### Was wird getestet?

1. **Leads & Sales Statistiken** - Testet die API für heute
2. **Programm-Statistiken** - Testet die API für den aktuellen Monat
3. **Monatsübersicht** - Testet die API für den aktuellen Monat
4. **API-URL-Generierung** - Testet die URL-Generierung

### Beispiel-Ausgabe

```
🧪 Financeads API Quick Test...
User-ID: 57387
API-Key: 4543b9ad41...
📅 Teste für heute: 2025-01-15
✅ API-Test erfolgreich!
📊 Statistiken: {
  count: 5,
  data: [...]
}
```

### Fehlerbehandlung

Falls die API-Tests fehlschlagen, werden Fehler in der Konsole angezeigt:

```
❌ API-Test fehlgeschlagen: Error: API Request fehlgeschlagen: 401 Unauthorized
Fehler-Details: API-Key ist ungültig
```

### Häufige Probleme

1. **API-Key ist ungültig**
   - Prüfen Sie, ob der API-Key korrekt ist
   - Prüfen Sie, ob der API-Key im Dashboard aktiviert ist

2. **User-ID ist falsch**
   - Prüfen Sie, ob die User-ID korrekt ist
   - Die User-ID sollte `57387` sein

3. **Keine Daten zurückgegeben**
   - Dies ist normal, wenn keine Statistiken für den angegebenen Zeitraum vorhanden sind
   - Versuchen Sie einen anderen Zeitraum

4. **CORS-Fehler**
   - Die API sollte keine CORS-Fehler verursachen
   - Falls CORS-Fehler auftreten, prüfen Sie die Browser-Konsole

## User-ID Erklärung

Die **User-ID** (`57387`) identifiziert Ihren Publisher-Account in der Financeads API. Sie wird benötigt, um:

1. **Statistiken für den richtigen Account abzurufen** - Die API verwendet die User-ID, um zu bestimmen, welche Statistiken zurückgegeben werden sollen
2. **Authentifizierung** - Die User-ID wird zusammen mit dem API-Key für die Authentifizierung verwendet
3. **Account-Isolation** - Jeder Publisher hat eine eigene User-ID, um die Statistiken zu isolieren

Die User-ID ist nicht geheim und kann in der Client-seitigen Anwendung verwendet werden, da sie nur für die Identifizierung des Accounts verwendet wird. Die eigentliche Sicherheit wird durch den API-Key gewährleistet.

## Weitere Informationen

Weitere Informationen zur Financeads API finden Sie im Dashboard:
- Dashboard: https://dashboard.financeads.net
- API-Dokumentation: https://dashboard.financeads.net/publisher/auswertung/api

