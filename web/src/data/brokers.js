export const brokers = [
  {
    id: 'captrader',
    slug: 'captrader',
    name: 'CapTrader',
    image: '/images/brokers/captrader_cover_11zon.webp',
    isTestsieger: true,
    highlights: [
      'Zugang zu >150 Börsen, >1,2 Mio. Wertpapieren',
      'Plattformen: Trader Workstation (TWS), Desktop, App',
      'Telefonische Notfall-Order-Schließung (IB-Infrastruktur)'
    ],
    pricing: {
      orderCostsDE: 'Aktien/ETFs ab 2 € (DE) / 2 $ (US); Optionen ab 2 € (DE) / 3,50 $ (US); Futures ab 1 € (DE) / 1,25 $ (US); Anleihen ab 8 €'
    },
    features: {
      productRange: 'Aktien, ETFs, Optionen, Futures, CFDs, FX, Zertifikate, Anleihen, Fonds',
      etfPlans: true
    },
    regulation: 'Anbindung an Interactive Brokers (IB) – internationale Infrastruktur',
    notes: 'Ein-/Auszahlungen: 1×/Monat kostenlos; danach 1 € (SEPA) bzw. 8 € (Auslandsüberweisung). Ersteinzahlung 2.000 €.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C46922232T'
  },
  {
    id: 'traders-place',
    slug: 'traders-place',
    name: 'Traders Place',
    image: '/images/brokers/traders-place-logo.webp',
    highlights: [
      '0 € pro Trade für Aktien, ETFs, Fonds und Anleihen über gettex/Baader',
      '0 € pro Trade für Derivate über Premium Partner (BNP Paribas, Société Générale, Morgan Stanley, Vontobel, UniCredit)',
      '3.250 kostenlose Sparpläne in ETFs, Aktien und Fonds',
      '100 € Neukunden-Bonus bis Ende Dezember'
    ],
    pricing: { orderCostsDE: '0 € pro Trade ab 500 € Ordervolumen; < 500 €: 0,95 € (gettex) bzw. 3 € (Derivate)' },
    features: { 
      productRange: 'Aktien, ETFs, Fonds, Anleihen, Derivate, Krypto (58 Währungen)',
      etfPlans: true
    },
    regulation: 'Baader Bank AG (Depotführung)',
    notes: 'Rund 40 deutsche & internationale Handelsplätze; 1,75% Zinsen p.a. (variabel); Smartphone-App verfügbar; Weltweiter Handel möglich',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C4838113108T',
    neukundenbonus: {
      aktiv: true,
      bonus: '100 €',
      aktionszeitraum: {
        start: '2025-12-04',
        ende: '2025-12-31'
      },
      teilnahmebedingungen: [
        'Der Kunde muss innerhalb von 45 Tagen ab Depoteröffnung mindestens 3 Wertpapiertransaktionen mit einem Volumen von mindestens 100,00 EUR tätigen',
        'Der Neukundenbonus in Höhe von 100,00 EUR wird innerhalb von sechs Wochen nach Erfüllung der Bedingungen in Form von Anteilen des "Xtrackers II EUR Overnight Rate Swap UCITS ETF" direkt in das Depot eingebucht',
        'Das Depot muss zum Zeitpunkt der Prämienzuteilung noch aktiv sein und einen positiven Portfoliowert (Depot- zzgl. Kontosaldo) von mindestens 1.000,00 EUR ausweisen'
      ]
    }
  },
  {
    id: 'smartbroker-plus',
    slug: 'smartbroker-plus',
    name: 'SMARTBROKER+',
    image: '/images/brokers/smartbroker.webp',
    highlights: [
      'Depotbank: Baader Bank – gesetzliche + freiwillige Einlagensicherung',
      'gettex 0 € ab 500 € Ordervolumen; < 500 €: 1 € Mindermengenzuschlag',
      'Xetra ab 4 € + Börsengebühren; Inlandsplätze typ. 4 € Flat',
      '>4.600 Sparpläne, vielfach 0 € Ausführung'
    ],
    pricing: { orderCostsDE: 'gettex 0 € ab 500 €, sonst 1 €; Inlandsplätze 4 € Flat; Xetra ab 4 € + Börsengebühren' },
    features: { etfPlans: true, productRange: 'Aktien, ETFs, Fonds, Anleihen, Derivate' },
    regulation: 'Baader Bank AG (Depot/Konto)',
    notes: 'Migration alter Smartbroker-Depots (DAB/BNP) zu Baader seit Ende 2023; neues Markenauftritt „SMARTBROKER+".',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C296855636T'
  },
  {
    id: 'fidelity-ffb',
    slug: 'fidelity-ffb',
    name: 'Fidelity – FondsdepotPlus (FIL Fondsbank/FFB)',
    image: '/images/brokers/Fidelity-Logo_11zon.webp',
    highlights: [
      'Depotführungsentgelt 0,25 % p.a., mind. 25 €, max. 45 € p.a.',
      'Fondsplattform mit Rabattaktionen',
      'Depot kostenlos bei Ø Depotwert ≥ 20.000 € (Sonderregel)'
    ],
    pricing: { orderCostsDE: '0,25 % p.a. vom Ø Depotwert, mind. 25 €, max. 45 € p.a.' },
    features: { productRange: 'Fondsplattform, ETF-/Fonds-Sparen' },
    regulation: 'FIL Fondsbank (FFB)',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C4368115768T'
  },
  {
    id: 'brokerpoint',
    slug: 'brokerpoint',
    name: 'Brokerpoint',
    image: '/images/brokers/Brokerpoint.webp',
    highlights: [
      'Reseller von Interactive Brokers (IB-Infrastruktur)',
      'Xetra ab 2,29 € bzw. 0,10 %; US ab 2 $; Depot 0 €',
      'Optionen ab 1,89 € / 2 $ je Kontrakt'
    ],
    pricing: { orderCostsDE: 'Xetra ab 2,29 € bzw. 0,10 %; US-Börsen ab 2 $; Optionen ab 1,89 € / 2 $' },
    features: { productRange: 'TWS, API; international; für Vieltrader attraktiv' },
    regulation: 'Anbindung an Interactive Brokers (IB) – MiFID-Umfeld',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C236261384T'
  },
  {
    id: 'finanzen-net-zero',
    slug: 'finanzen-net-zero',
    name: 'finanzen.net zero',
    image: '/images/brokers/Finanzen.net.webp',
    highlights: [
      'Depotbank Baader Bank; Handel über gettex (Baader OTC optional)',
      '0 € pro Order über gettex ab 500 €; sonst 1 € Mindermenge',
      'Nur gettex (kein Xetra/Tradegate)'
    ],
    pricing: { orderCostsDE: '0 € über gettex ab 500 €, sonst 1 €; nur gettex' },
    features: { productRange: '7.700–8.500 Aktien, >2.000 ETFs/ETPs; Aktionen/Prämien' },
    regulation: 'Baader Bank',
    notes: 'Nur ein Market-Maker-Handelsplatz (gettex) – Platzwahl eingeschränkt; gemischte Erfahrungen',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C372273516T'
  },
  {
    id: 'tradegate-direct',
    slug: 'tradegate-direct',
    name: 'Tradegate Direct',
    image: '/images/brokers/Tradegate.direct.webp',
    highlights: [
      'Direkter Handel über Tradegate Exchange',
      'Verlängerte Handelszeiten (8:00-22:00 Uhr)',
      'Hohe Liquidität und enge Spreads',
      'Kostenlose Depotführung'
    ],
    pricing: { orderCostsDE: 'Handelsgebühren nach Tradegate-Tarif; Depotführung kostenlos' },
    features: { 
      productRange: 'Aktien, ETFs, Anleihen, Zertifikate, Optionsscheine',
      etfPlans: false
    },
    regulation: 'Tradegate Exchange (Xetra)',
    notes: 'Direkter Zugang zur Tradegate Exchange; Benutzerfreundliche Handelsplattform; Schnelle Orderausführung; Keine Mindestanlage erforderlich',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C5092119264T'
  },
  {
    id: 'fonds-super-markt',
    slug: 'fonds-super-markt',
    name: 'Fonds-Super-Markt.de (Vermittler, Depot bei FNZ Bank)',
    image: '/images/brokers/Fonds Supermarkt.webp',
    highlights: [
      '100 % Rabatt auf Ausgabeaufschlag (Kauf & Sparpläne)',
      '0 € Transaktionskosten online (ETFs ausgenommen)',
      'Depotgebühr 0 € ab 1.500 € in aktiven Fonds',
      'Prämienaktion: Bis zu 4.000 € Barprämie bei Depotwechsel (bis 30.12.2025)'
    ],
    pricing: { orderCostsDE: 'Sonderkonditionen (ab 01.07.2025 bestätigt); sonst PLV FNZ' },
    features: { productRange: 'Fondsplattform, laufende Prämienaktionen' },
    regulation: 'Depotführung FNZ Bank',
    notes: 'Prämienaktion bis 30.12.2025: 100 € (ab 20.000 €), 250 € (ab 50.000 €), 500 € (ab 100.000 €), 1.000 € (ab 200.000 €), 2.000 € (ab 400.000 €), 4.000 € (ab 800.000 €)',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C113829504B'
  },
  {
    id: 'quirion',
    slug: 'quirion',
    name: 'quirion (Robo-Advisor der Quirin Privatbank)',
    image: '/images/brokers/Quirion_11zon.webp',
    highlights: [
      'Servicegebühr 0,48 % p.a. (Digital) + ~0,17 % ETF-Kosten',
      'Erstes Jahr: 0 € Servicegebühr auf die ersten 10.000 € (Digital)',
      'Depotführung Quirin Privatbank, BaFin-reguliert; Mindestanlage 1 €; Sparplan ab 25 €',
      '🎁 100 € Prämie für Neukunden bei Sparplan-Abschluss (Aktion bis 05.01.2026)'
    ],
    pricing: { orderCostsDE: '0,48 % p.a. Servicegebühr (Digital-Paket), staffelt bis 1,48 % in Premium/Privat' },
    features: { productRange: 'ETF-Multi-Asset-Portfolios (10 Strategien, optional ESG), Rebalancing', etfPlans: true },
    regulation: 'Quirin Privatbank (BaFin)',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C65520725T',
    // Sparplan-Aktion: 100€ Prämie für Neukunden
    sparbplanAktion: {
      aktiv: true,
      praemie: '100 €',
      aktionszeitraum: {
        start: '2025-11-24',
        ende: '2026-01-05'
      },
      teilnahmebedingungen: [
        'Abschluss eines Sparplans mit einer monatlichen Rate von mindestens 50 €',
        'Haltedauer: 12 Monate',
        'Nur für Neukunden ohne bestehendes quirion-Depot',
        'Auszahlung: Nach Ablauf der Haltedauer, voraussichtlich Ende Dezember 2026'
      ],
      kategorieId: 8534,
      kategorieName: 'SPARZIELE100',
      applyUrl: 'https://www.financeads.net/tc.php?t=78535C65520725T&kategorie=8534'
    }
  },
  {
    id: 'etoro',
    slug: 'etoro',
    name: 'eToro (Multi-Asset-Broker, viele Instrumente als CFD)',
    image: '/images/brokers/eToro.webp',
    highlights: [
      'Aktien-Kommission: seit 11.08.2024 $1 oder $2 pro Trade (je Land/Börse)',
      'ETFs teils $0 Kommission (regionsabhängig; Details im Help-Center)',
      'Krypto: 1 % je Kauf und 1 % je Verkauf (seit Mitte 2025 separat)'
    ],
    pricing: { orderCostsDE: 'Aktien: $1/$2; ETFs teils $0; Krypto 1 % je Seite' },
    features: { productRange: 'Aktien, ETFs, Krypto, CFDs, CopyTrading (regionale Verfügbarkeit beachten)' },
    regulation: 'Mehrländer-Regulierung, Details in den Rechtstexten',
    notes: 'Nicht-Handelsgebühren: Auszahlung $5 (USD), EUR/GBP-Auszahlungen gebührenfrei; Währungsumrechnung 1,5–3,0 %; Inaktivität $10/Monat nach 12 Monaten',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C106535032B'
  }
]

export const recommendedBrokers = ['captrader', 'smartbroker-plus', 'finanzen-net-zero']

