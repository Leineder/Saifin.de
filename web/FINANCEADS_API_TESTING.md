# Financeads API Testing - Schnellstart

## Wie teste ich die Financeads API?

### Schritt 1: Website öffnen

1. Öffnen Sie Ihre Website im Browser
2. Öffnen Sie die Browser-Konsole (F12 oder Rechtsklick → "Untersuchen")
3. Warten Sie, bis die Website vollständig geladen ist

### Schritt 2: Test-Funktionen aufrufen

Nach dem Laden der Website sollten Sie in der Konsole folgende Meldung sehen:

```
💡 Financeads API Test-Funktionen verfügbar:
   - window.quickTestFinanceadsApi() - Schneller API-Test
   - window.testFinanceadsApi() - Vollständiger API-Test mit allen Endpunkten
   Beispiel: await window.quickTestFinanceadsApi()
```

### Schritt 3: Schnellen Test durchführen

Geben Sie in der Konsole ein:

```javascript
await window.quickTestFinanceadsApi()
```

Dies führt einen schnellen Test der API durch und zeigt die Ergebnisse an.

### Schritt 4: Vollständigen Test durchführen

Geben Sie in der Konsole ein:

```javascript
await window.testFinanceadsApi()
```

Dies testet alle API-Endpunkte und zeigt detaillierte Ergebnisse an.

## Was wird getestet?

### 1. Leads & Sales Statistiken
- Testet die API für heute
- Ruft alle Leads (inkl. stornierter) ab
- Zeigt die Anzahl der Statistiken an

### 2. Programm-Statistiken
- Testet die API für den aktuellen Monat
- Ruft Statistiken nach Programm ab
- Zeigt die Anzahl der Statistiken an

### 3. Monatsübersicht
- Testet die API für den aktuellen Monat
- Ruft die Monatsübersicht ab
- Zeigt die Anzahl der Statistiken an

### 4. API-URL-Generierung
- Testet die URL-Generierung
- Zeigt die generierte URL an

## Beispiel-Ergebnisse

### Erfolgreicher Test

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

### Test mit Fehlern

```
❌ API-Test fehlgeschlagen: Error: API Request fehlgeschlagen: 401 Unauthorized
Fehler-Details: API-Key ist ungültig
```

## Häufige Probleme

### Problem: API-Key ist ungültig

**Lösung:**
1. Prüfen Sie, ob der API-Key korrekt ist
2. Prüfen Sie, ob der API-Key im Dashboard aktiviert ist
3. Prüfen Sie, ob der API-Key nicht abgelaufen ist

### Problem: User-ID ist falsch

**Lösung:**
1. Prüfen Sie, ob die User-ID korrekt ist
2. Die User-ID sollte `57387` sein
3. Prüfen Sie die User-ID im Dashboard

### Problem: Keine Daten zurückgegeben

**Lösung:**
1. Dies ist normal, wenn keine Statistiken für den angegebenen Zeitraum vorhanden sind
2. Versuchen Sie einen anderen Zeitraum
3. Prüfen Sie, ob es überhaupt Statistiken gibt

### Problem: CORS-Fehler

**Lösung:**
1. Die API sollte keine CORS-Fehler verursachen
2. Falls CORS-Fehler auftreten, prüfen Sie die Browser-Konsole
3. Prüfen Sie, ob die API-URL korrekt ist

## Weitere Test-Optionen

### Test mit weniger Ausgabe

```javascript
await window.testFinanceadsApi({ verbose: false })
```

### Test für einen bestimmten Zeitraum

```javascript
// Importiere die API-Funktionen
const api = await import('./src/utils/financeads-api.js')

// Teste für einen bestimmten Zeitraum
const statistics = await api.getLeadsSalesStatistics({
  timeFrom: '2025-01-01',
  timeTo: '2025-01-31',
  type: 'update',
  currency: 'EUR'
})

console.log('Statistiken:', statistics)
```

## Troubleshooting

### Test-Funktionen sind nicht verfügbar

**Lösung:**
1. Warten Sie, bis die Website vollständig geladen ist
2. Prüfen Sie, ob die Financeads API initialisiert wurde
3. Prüfen Sie die Browser-Konsole auf Fehler

### API-Aufrufe dauern zu lange

**Lösung:**
1. Dies ist normal, da die API-Aufrufe asynchron sind
2. Die API-Aufrufe sollten nicht länger als 10 Sekunden dauern
3. Falls die API-Aufrufe zu lange dauern, prüfen Sie Ihre Internetverbindung

### Keine Statistiken verfügbar

**Lösung:**
1. Prüfen Sie, ob es überhaupt Statistiken gibt
2. Prüfen Sie, ob der Zeitraum korrekt ist
3. Prüfen Sie, ob die API-Key-Berechtigungen korrekt sind

## Nächste Schritte

Nachdem Sie die API erfolgreich getestet haben, können Sie:

1. Die API in Ihre Anwendung integrieren
2. Regelmäßige Statistiken-Updates aktivieren
3. Die Statistiken in Ihrem Dashboard anzeigen

## Hilfe

Falls Sie weitere Hilfe benötigen, können Sie:

1. Die Dokumentation lesen: `FINANCEADS_API_INTEGRATION.md`
2. Die Browser-Konsole auf Fehler prüfen
3. Das Financeads Dashboard kontaktieren

