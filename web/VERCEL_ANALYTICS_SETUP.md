# Vercel Analytics Setup - Zusammenfassung

## ✅ Implementierte Features

### 1. Vercel Analytics Installation
- ✅ Package `@vercel/analytics` installiert
- ✅ Analytics Component in `App.vue` integriert
- ✅ Automatisches Tracking von Seitenaufrufen aktiviert

### 2. Produkt-spezifische Events

#### Kreditkarten (8 Produkte)
- **Produktansichten**: `product_view` Event für jede Kreditkarte
- **Anträge**: `product_apply` Event bei Klick auf "Jetzt beantragen"
- **Filter-Tracking**: Alle Filter-Interaktionen werden getrackt
- **Produkte**:
  - Hanseatic Bank GenialCard (Visa)
  - Hanseatic Bank GoldCard (Visa)
  - TF Bank Mastercard Gold
  - Santander BestCard Basic (Visa)
  - Extra Karte (Novum Bank) – Mastercard
  - Netkredit24 Mastercard
  - Consors Finanz Mastercard
  - 1822direkt Visa Classic/Gold

#### Broker (8 Produkte)
- **Produktansichten**: `product_view` Event für jeden Broker
- **Anträge**: `product_apply` Event bei Klick auf "Jetzt beantragen"
- **Produkte**:
  - CapTrader
  - SMARTBROKER+
  - Fidelity – FondsdepotPlus
  - Brokerpoint
  - finanzen.net zero
  - Fonds-Super-Markt.de
  - quirion (Robo-Advisor)
  - eToro

#### Tagesgeldkonten (10 Produkte)
- **Produktansichten**: `product_view` Event für jedes Tagesgeldkonto
- **Anträge**: `product_apply` Event bei Klick auf "Jetzt beantragen"
- **Produkte**:
  - pbb direkt – Euro Tagesgeld
  - Suresse Direkt Bank Tagesgeld
  - TF Bank Tagesgeld
  - DISTINGO Bank Tagesgeld
  - Raisin Tagesgeld
  - J&T Direktbank Tagesgeld
  - Openbank Tagesgeld
  - Santander Consumer Bank Tagesgeld
  - Ferratum Sparkonto
  - Consorsbank Tagesgeld

### 3. Event-Struktur

#### Standard-Event-Parameter
```javascript
{
  product_id: "hanseatic-bank-genialcard",
  product_name: "Hanseatic Bank GenialCard (Visa)",
  category: "kreditkarten", // oder "broker" oder "tagesgeld"
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

#### Apply-Event (zusätzlich)
```javascript
{
  apply_url: "https://www.financeads.net/tc.php?t=78535C328121218T"
}
```

### 4. Zusätzliche Tracking-Features

#### Filter-Tracking (Kreditkarten)
- Jahresgebühr-Filter
- Auslandseinsatz-Filter
- Kartentyp-Filter
- Apple Pay / Google Pay
- Versicherungen
- Cashback
- SCHUFA-frei
- Sofortentscheidung

#### Event-Typen
- `product_view`: Produktansicht
- `product_apply`: Produktanfrage
- `filter_used`: Filter-Nutzung
- `search_performed`: Suchanfragen (vorbereitet)

## 📁 Geänderte Dateien

1. **`src/App.vue`** - Analytics Component hinzugefügt
2. **`src/utils/analytics.js`** - Neue Analytics-Utility-Datei
3. **`src/views/CardDetail.vue`** - Produktansicht & Antrag-Tracking
4. **`src/views/BrokerDetail.vue`** - Broker-Ansicht & Antrag-Tracking
5. **`src/views/SavingsDetail.vue`** - Tagesgeld-Ansicht & Antrag-Tracking
6. **`src/views/Cards.vue`** - Antrag-Tracking & Filter-Tracking
7. **`package.json`** - @vercel/analytics Dependency

## 🚀 Nächste Schritte

1. **Deployment**: Nach dem nächsten Deployment werden die Analytics-Events automatisch gesammelt
2. **Dashboard**: In Ihrem Vercel Dashboard unter "Analytics" können Sie die Events einsehen
3. **Auswertung**: Die Events helfen Ihnen zu verstehen:
   - Welche Produkte am meisten angeschaut werden
   - Welche Produkte am meisten beantragt werden
   - Wie Nutzer die Filter verwenden
   - Conversion-Raten pro Produkt

## 📊 Erwartete Analytics-Daten

Nach dem Deployment werden Sie folgende Metriken sehen können:
- **Seitenaufrufe** pro Produktkategorie
- **Produktansichten** pro individuellem Produkt
- **Anträge** pro Produkt (Conversion-Tracking)
- **Filter-Nutzung** (Welche Filter werden am häufigsten verwendet)
- **User Journey** (Von welcher Seite kommen Nutzer zu Anträgen)

Die Implementierung ist vollständig und produktionsbereit! 🎉
