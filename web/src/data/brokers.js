export const brokers = [
  {
    id: 'trade-republic',
    slug: 'trade-republic',
    name: 'Trade Republic Bank GmbH',
    image: '/images/brokers/Trade-Republic.jpg',
    highlights: [
      '0 € Gebühren (zzgl. Spreads/Marktkosten)',
      'Karte ohne Abo; Abhebungen ab 100 € kostenlos',
      'ETF-Sparpläne verfügbar',
      'Vollbank, BaFin-Aufsicht'
    ],
    pricing: {
      orderCostsDE: '0 € Gebühren (zzgl. Spreads/Marktkosten)'
    },
    features: {
      atm: 'Abhebungen ab 100 € kostenlos',
      card: 'Karte ohne Abo',
      etfPlans: true
    },
    regulation: 'Vollbank, BaFin-Aufsicht',
    recommendation: {
      title: 'Die moderne, kosteneffiziente Wahl',
      pros: [
        'Kommissionsfreier Handel mit Aktien & ETFs; nur 1 € Fremdkostenpauschale',
        'Mobil-zentriertes Interface, steuerkonform, Sparpläne inklusive',
        'BaFin-Lizenz, ~8 Mio. Kunden in DE (Jan 2025)'
      ],
      idealFor: 'Einsteiger und langfristige Investoren'
    }
  },
  {
    id: 'scalable-capital',
    slug: 'scalable-capital',
    name: 'Scalable Capital Broker',
    image: '/images/brokers/Scalable-Capital.jpg',
    highlights: [
      'FREE ab 0,99 € je Order',
      'PRIME+ 0 € ab 250 € Order (4,99 €/Monat)',
      '2 % p. a. Zinsen auf Cash (variabel)'
    ],
    pricing: {
      orderCostsDE: 'FREE: ab 0,99 €; PRIME+: 0 € ab 250 € (4,99 €/Monat)'
    },
    features: {
      cashInterest: '2 % p. a. variabel',
      taxAllowance: 'Infos & 2025er Freibeträge'
    },
    regulation: 'BaFin-Aufsicht',
    recommendation: {
      title: 'Für ETFs, Sparpläne & stabile Plattform',
      pros: [
        'Flexible Preispläne (kostenlos/Flat-Fee)',
        'Robo-Advisor-Komponente, ETF-Fokus',
        'Unterstützt von BlackRock, klare BaFin-Stellung'
      ],
      idealFor: 'Regelmäßige ETF-Sparer, die Komfort wünschen'
    }
  },
  {
    id: 'degiro',
    slug: 'degiro',
    name: 'DEGIRO (flatexDEGIRO Bank Dutch Branch)',
    image: '/images/brokers/Degiro.jpg',
    highlights: [
      'Günstig national & international',
      'Core-Selection-ETFs ohne Transaktionsgebühr (Fair-Use)'
    ],
    pricing: {
      orderCostsDE: 'Siehe Preisverzeichnis; 1 € Bearbeitungsgebühr für Drittkosten'
    },
    features: {
      productRange: 'Breites Angebot (US-Aktien, Optionen, ETFs etc.)'
    },
    regulation: 'flatexDEGIRO Bank AG (BaFin); in NL DNB/AFM',
    recommendation: {
      title: 'International, günstig, vielseitig',
      pros: [
        'Sehr günstiger Handel auch im Ausland',
        'Großer Produktumfang',
        'MiFID-II-konforme Regulierung'
      ],
      idealFor: 'Fortgeschrittene mit Fokus auf internationale Märkte'
    }
  },
  {
    id: 'flatex',
    slug: 'flatex',
    name: 'flatex (flatexDEGIRO Bank AG)',
    image: '/images/brokers/Flatex.jpg',
    highlights: [
      'Pauschal 5,90 € zzgl. Fremdspesen',
      'ETF-/Fonds-Sparpläne ohne Orderprovision',
      'Krypto: 0,6–0,7 % inkl. Spread (DE)'
    ],
    pricing: { orderCostsDE: '5,90 € pauschal + Fremdspesen' },
    regulation: 'BaFin',
  },
  {
    id: 'comdirect',
    slug: 'comdirect',
    name: 'comdirect (Commerzbank)',
    image: '/images/brokers/Comdirect.jpg',
    highlights: [
      'Neukundenaktion 3,90 € je Trade',
      'Danach i. d. R. 9,90 € Standard',
      'Viele ETF-Aktionssparpläne mit 0 € Ausführungsgebühr'
    ]
  },
  {
    id: 'consorsbank',
    slug: 'consorsbank',
    name: 'Consorsbank (BNP Paribas)',
    image: '/images/brokers/Consors-bank.jpg',
    highlights: [
      'Preis- & Leistungsverzeichnis',
      'Breites ETF-Angebot & Sparpläne'
    ]
  },
  {
    id: 'ing',
    slug: 'ing',
    name: 'ING Direkt-Depot',
    image: '/images/brokers/ing.jpg',
    highlights: [
      '4,90 € + 0,25 %, max. 69,90 € (Bsp. 500 € → 6,15 €)',
      'Depot kostenlos; Sparpläne ab 1 €'
    ]
  },
  {
    id: 'dkb',
    slug: 'dkb',
    name: 'DKB Broker',
    image: '/images/brokers/DKB.jpg',
    highlights: [
      'Aktionen z. B. 1,90 € über Baader Trading',
      'Sparpläne ab 25 €; Kosten gemäß PLV'
    ]
  },
  {
    id: 'smartbroker-plus',
    slug: 'smartbroker-plus',
    name: 'SMARTBROKER+',
    image: '/images/brokers/smartbroker-plus.jpg',
    highlights: [
      '4 € an Tradegate/LSX/Baader OTC',
      'Xetra 4 € + 0,01 % (min. 1,50 €)',
      'Premiumpartner 0 € ab 500 €'
    ]
  },
  {
    id: 'justtrade',
    slug: 'justtrade',
    name: 'justTRADE',
    image: '/images/brokers/Justtrade.jpg',
    highlights: [
      '0 € Orderprovision + max. 1 € Fremdkosten',
      'Depot 0 €; ETF-Sparpläne ohne Kaufgebühr',
      'Krypto-Handel echter Coins; Verwahrung via Tangany (BaFin)'
    ]
  }
]

export const recommendedBrokers = ['trade-republic', 'scalable-capital', 'degiro']

