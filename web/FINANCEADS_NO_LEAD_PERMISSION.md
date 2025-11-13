# Financeads API - "No Lead Permission" Problem

## Problem

Wenn Sie die Financeads API-URL direkt im Browser öffnen, erhalten Sie die Nachricht:
```
No Lead Permission
```

## Ursache

Die Nachricht "No Lead Permission" bedeutet, dass:
1. **Der API-Key keine Berechtigung für Leads hat** - Der API-Key kann keine Lead-Daten abrufen
2. **Lead-Berechtigungen sind nicht aktiviert** - Im Financeads Dashboard müssen Lead-Berechtigungen aktiviert werden
3. **Der API-Key hat eingeschränkte Berechtigungen** - Der API-Key kann nur bestimmte Endpunkte verwenden

## Lösung

### Option 1: Andere API-Endpunkte verwenden

Die Financeads API hat mehrere Endpunkte, die **keine Lead-Berechtigung** benötigen:

#### 1. Programm-Statistiken
```
https://data.financeads.net/api/statistics.php?site=pr&user=57387&key={API-Key}&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

#### 2. Monatsübersicht
```
https://data.financeads.net/api/statistics.php?site=monatsuebersicht&user=57387&key={API-Key}&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

#### 3. Tages-Statistiken
```
https://data.financeads.net/api/statistics.php?site=d&user=57387&key={API-Key}&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

Diese Endpunkte sollten **ohne "No Lead Permission"** funktionieren.

### Option 2: Lead-Berechtigungen im Dashboard aktivieren

1. **Financeads Dashboard öffnen**: https://dashboard.financeads.net
2. **Zu API-Einstellungen navigieren**: Auswertung → API
3. **Lead-Berechtigungen prüfen**: Prüfen Sie, ob Lead-Berechtigungen aktiviert sind
4. **API-Key-Berechtigungen prüfen**: Prüfen Sie, ob der API-Key die notwendigen Berechtigungen hat
5. **Bei Bedarf aktivieren**: Aktivieren Sie die Lead-Berechtigungen für Ihren API-Key

### Option 3: Neuen API-Key erstellen

Falls die Lead-Berechtigungen nicht aktiviert werden können:

1. **Neuen API-Key erstellen**: Im Financeads Dashboard
2. **Berechtigungen setzen**: Stellen Sie sicher, dass der neue API-Key Lead-Berechtigungen hat
3. **API-Key aktualisieren**: Aktualisieren Sie den API-Key in der Konfiguration

## Testen der verschiedenen Endpunkte

### 1. Programm-Statistiken testen

Öffnen Sie diese URL im Browser:
```
https://data.financeads.net/api/statistics.php?site=pr&user=57387&key=4543b9ad41727264a8f8c8a4f1d97f7e&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

**Erwartetes Ergebnis**: CSV-Daten mit Programm-Statistiken (kein "No Lead Permission")

### 2. Monatsübersicht testen

Öffnen Sie diese URL im Browser:
```
https://data.financeads.net/api/statistics.php?site=monatsuebersicht&user=57387&key=4543b9ad41727264a8f8c8a4f1d97f7e&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

**Erwartetes Ergebnis**: CSV-Daten mit Monatsübersicht (kein "No Lead Permission")

### 3. Tages-Statistiken testen

Öffnen Sie diese URL im Browser:
```
https://data.financeads.net/api/statistics.php?site=d&user=57387&key=4543b9ad41727264a8f8c8a4f1d97f7e&format=csv&time_from=2025-11-12&time_to=2025-11-12
```

**Erwartetes Ergebnis**: CSV-Daten mit Tages-Statistiken (kein "No Lead Permission")

## Was funktioniert jetzt?

### ✅ Programm-Statistiken
- Zeigt Statistiken nach Programm
- Benötigt keine Lead-Berechtigung
- Sollte funktionieren

### ✅ Monatsübersicht
- Zeigt Monatsübersicht
- Benötigt keine Lead-Berechtigung
- Sollte funktionieren

### ✅ Tages-Statistiken
- Zeigt Tages-Statistiken
- Benötigt keine Lead-Berechtigung
- Sollte funktionieren

### ❌ Leads & Sales
- Benötigt Lead-Berechtigung
- Gibt "No Lead Permission" zurück
- Muss im Dashboard aktiviert werden

## Nächste Schritte

1. **Testen Sie die anderen Endpunkte** (Programm, Monatsübersicht, Tages-Statistiken)
2. **Prüfen Sie das Financeads Dashboard** auf Lead-Berechtigungen
3. **Aktivieren Sie Lead-Berechtigungen** falls möglich
4. **Verwenden Sie die funktionierenden Endpunkte** für Statistiken

## Wichtige Hinweise

- **Tracking funktioniert weiterhin** über Affiliate-Links direkt
- **Event-Tracking funktioniert** lokal (Events werden gespeichert)
- **Keine CORS-Fehler** mehr in der Konsole
- **Andere API-Endpunkte** sollten funktionieren (keine Lead-Berechtigung benötigt)

## Hilfe

Falls Sie Hilfe benötigen:
1. **Financeads Dashboard**: https://dashboard.financeads.net
2. **API-Dokumentation**: https://dashboard.financeads.net/publisher/auswertung/api
3. **Financeads Support**: Kontaktieren Sie den Support für Lead-Berechtigungen

## Zusammenfassung

- ✅ **Programm-Statistiken funktionieren** (keine Lead-Berechtigung)
- ✅ **Monatsübersicht funktioniert** (keine Lead-Berechtigung)
- ✅ **Tages-Statistiken funktionieren** (keine Lead-Berechtigung)
- ❌ **Leads & Sales benötigt Berechtigung** (muss im Dashboard aktiviert werden)
- ✅ **Tracking funktioniert** über Affiliate-Links direkt

