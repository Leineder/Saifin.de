# Financeads API - Testing Anleitung

## Lokales Testing (auf Ihrem MacBook)

### Schritt 1: Development-Server starten

1. Öffnen Sie das Terminal (⌘ + Leertaste → "Terminal")
2. Navigieren Sie zum Projekt-Verzeichnis:
   ```bash
   cd /Users/leineder/Desktop/Vergleichsplatform/web
   ```
3. Starten Sie den Development-Server:
   ```bash
   npm run dev
   ```
4. Der Server sollte eine URL anzeigen, z.B.:
   ```
   ➜  Local:   http://localhost:5173/
   ```
5. Öffnen Sie diese URL in Ihrem Browser

### Schritt 2: Browser-Konsole öffnen

1. Öffnen Sie die Website im Browser
2. Öffnen Sie die Browser-Konsole:
   - **Chrome/Edge**: ⌘ + ⌥ + J (oder F12)
   - **Firefox**: ⌘ + ⌥ + K (oder F12)
   - **Safari**: ⌘ + ⌥ + C (muss erst in den Entwicklertools aktiviert werden)
3. Warten Sie, bis die Website vollständig geladen ist (ca. 2-3 Sekunden)

### Schritt 3: API testen

1. In der Konsole sollten Sie folgende Meldung sehen:
   ```
   💡 Financeads API Test-Funktionen verfügbar:
      - window.quickTestFinanceadsApi() - Schneller API-Test
      - window.testFinanceadsApi() - Vollständiger API-Test mit allen Endpunkten
      Beispiel: await window.quickTestFinanceadsApi()
   ```

2. Führen Sie einen schnellen Test durch:
   ```javascript
   await window.quickTestFinanceadsApi()
   ```

3. Oder führen Sie einen vollständigen Test durch:
   ```javascript
   await window.testFinanceadsApi()
   ```

### Schritt 4: Ergebnisse prüfen

- **Erfolgreicher Test**: Sie sollten Statistiken sehen
- **Fehler**: Prüfen Sie die Fehlermeldung in der Konsole

## Auf dem Testserver testen

### Schritt 1: Änderungen committen und pushen

1. **Änderungen hinzufügen**:
   ```bash
   cd /Users/leineder/Desktop/Vergleichsplatform
   git add web/src/utils/financeads-api.js
   git add web/src/utils/analytics.js
   git add web/src/main.js
   git add web/FINANCEADS_API_INTEGRATION.md
   git add web/FINANCEADS_API_TESTING.md
   ```

2. **Änderungen committen**:
   ```bash
   git commit -m "Financeads API Integration hinzugefügt"
   ```

3. **Änderungen pushen**:
   ```bash
   git push origin main
   ```

### Schritt 2: Auf Testserver warten

- Wenn Sie Vercel verwenden: Die Änderungen werden automatisch deployed
- Wenn Sie einen anderen Testserver verwenden: Warten Sie, bis das Deployment abgeschlossen ist

### Schritt 3: Auf Testserver testen

1. Öffnen Sie die Testserver-URL in Ihrem Browser
2. Öffnen Sie die Browser-Konsole (F12)
3. Warten Sie, bis die Website vollständig geladen ist
4. Führen Sie die Test-Funktionen aus:
   ```javascript
   await window.quickTestFinanceadsApi()
   ```

## Troubleshooting

### Problem: Development-Server startet nicht

**Lösung:**
1. Prüfen Sie, ob Node.js installiert ist:
   ```bash
   node --version
   ```
2. Installieren Sie die Dependencies:
   ```bash
   cd /Users/leineder/Desktop/Vergleichsplatform/web
   npm install
   ```

### Problem: Test-Funktionen sind nicht verfügbar

**Lösung:**
1. Warten Sie, bis die Website vollständig geladen ist
2. Prüfen Sie die Browser-Konsole auf Fehler
3. Laden Sie die Seite neu (⌘ + R)

### Problem: API-Test schlägt fehl

**Lösung:**
1. Prüfen Sie, ob der API-Key korrekt ist
2. Prüfen Sie, ob die User-ID korrekt ist (57387)
3. Prüfen Sie die Fehlermeldung in der Konsole
4. Prüfen Sie, ob CORS-Fehler auftreten

### Problem: Keine Statistiken zurückgegeben

**Lösung:**
1. Dies ist normal, wenn keine Statistiken für den angegebenen Zeitraum vorhanden sind
2. Versuchen Sie einen anderen Zeitraum
3. Prüfen Sie, ob es überhaupt Statistiken gibt

## Nützliche Befehle

### Development-Server starten
```bash
cd /Users/leineder/Desktop/Vergleichsplatform/web
npm run dev
```

### Build für Production
```bash
cd /Users/leineder/Desktop/Vergleichsplatform/web
npm run build
```

### Git Status prüfen
```bash
cd /Users/leineder/Desktop/Vergleichsplatform
git status
```

### Alle Änderungen anzeigen
```bash
cd /Users/leineder/Desktop/Vergleichsplatform
git diff
```

## Weitere Informationen

- **Vollständige Dokumentation**: `FINANCEADS_API_INTEGRATION.md`
- **Test-Dokumentation**: `FINANCEADS_API_TESTING.md`
- **Financeads Dashboard**: https://dashboard.financeads.net

