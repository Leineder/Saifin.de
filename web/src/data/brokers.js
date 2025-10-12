export const brokers = [
  {
    id: 'captrader',
    slug: 'captrader',
    name: 'CapTrader',
    image: '/images/brokers/captrader_cover.webp',
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
    notes: 'Migration alter Smartbroker-Depots (DAB/BNP) zu Baader seit Ende 2023; neues Markenauftritt „SMARTBROKER+“.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C296855636T'
  },
  {
    id: 'fidelity-ffb',
    slug: 'fidelity-ffb',
    name: 'Fidelity – FondsdepotPlus (FIL Fondsbank/FFB)',
    image: '/images/brokers/Fidelity-Logo.webp',
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
    id: 'fonds-super-markt',
    slug: 'fonds-super-markt',
    name: 'Fonds-Super-Markt.de (Vermittler, Depot bei FNZ Bank)',
    image: '/images/brokers/Fonds Supermarkt.webp',
    highlights: [
      '100 % Rabatt auf Ausgabeaufschlag (Kauf & Sparpläne)',
      '0 € Transaktionskosten online (ETFs ausgenommen)',
      'Depotgebühr 0 € ab 1.500 € in aktiven Fonds'
    ],
    pricing: { orderCostsDE: 'Sonderkonditionen (ab 01.07.2025 bestätigt); sonst PLV FNZ' },
    features: { productRange: 'Fondsplattform, laufende Prämienaktionen' },
    regulation: 'Depotführung FNZ Bank',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C113829504B'
  },
  {
    id: 'quirion',
    slug: 'quirion',
    name: 'quirion (Robo-Advisor der Quirin Privatbank)',
    image: '/images/brokers/Quirion.webp',
    highlights: [
      'Servicegebühr 0,48 % p.a. (Digital) + ~0,17 % ETF-Kosten',
      'Erstes Jahr: 0 € Servicegebühr auf die ersten 10.000 € (Digital)',
      'Depotführung Quirin Privatbank, BaFin-reguliert; Mindestanlage 1 €; Sparplan ab 25 €'
    ],
    pricing: { orderCostsDE: '0,48 % p.a. Servicegebühr (Digital-Paket), staffelt bis 1,48 % in Premium/Privat' },
    features: { productRange: 'ETF-Multi-Asset-Portfolios (10 Strategien, optional ESG), Rebalancing' },
    regulation: 'Quirin Privatbank (BaFin)',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C65520725T'
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

