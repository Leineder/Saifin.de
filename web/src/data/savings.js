export const savingsOffers = [
  {
    id: 'pbb-direkt',
    slug: 'pbb-direkt',
    title: 'pbb direkt – Euro Tagesgeld',
    image: '/images/tagesgeldkonten/Pbbdirekt.jpg',
    interest: '0,75% p.a. bis 100.000 € (variabel)',
    payout: 'vierteljährlich',
    depositMin: '1.000 €',
    security: 'DE – EdB gesetzlich, zusätzlich BdB (freiwillig)',
    countryCode: 'DE',
    euDgs: true,
    isNeukundenaktion: false,
    highlights: [
      '0,75% p.a. bis 100.000 € – variabel',
      'Zinsgutschrift vierteljährlich',
      'Kostenlose Kontoführung, täglich verfügbar',
      'Gesetzliche Einlagensicherung bis 100.000 €'
    ],
    applyUrl: '/antrag/pbb-direkt'
  },
  {
    id: 'suresse-direkt-bank',
    slug: 'suresse-direkt-bank',
    title: 'Suresse Direkt Bank Tagesgeld',
    image: '/images/tagesgeldkonten/Suresse.jpg',
    interest: 'Variabler Zins (kampagnenabhängig)',
    payout: 'regelmäßig',
    depositMin: '0 €',
    security: 'ES – Spanischer Einlagensicherungsfonds (100.000 €)',
    countryCode: 'ES',
    euDgs: true,
    isNeukundenaktion: false,
    highlights: [
      'Tägliche Verfügbarkeit, 100% online',
      'EU-Einlagensicherung bis 100.000 € (200.000 € gemeinsam)',
      'Einfache Rücküberweisung aufs Referenzkonto'
    ],
    applyUrl: '/antrag/suresse-direkt-bank'
  },
  {
    id: 'tf-bank',
    slug: 'tf-bank',
    title: 'TF Bank Tagesgeld',
    image: '/images/tagesgeldkonten/TFBank.jpg',
    interest: '2,65% p.a. für Neukunden (4 Monate), danach 1,45% p.a.',
    payout: 'monatlich',
    depositMin: '0 €',
    security: 'SE – Schwedische Einlagensicherung (Riksgälden) ~90.000 €',
    countryCode: 'SE',
    euDgs: true,
    isNeukundenaktion: true,
    highlights: [
      '2,65% p.a. Neukunden für 4 Monate',
      'Monatliche Zinsgutschrift',
      'Kostenfrei, täglich verfügbar'
    ],
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C213342396T'
  },
  {
    id: 'distingo-bank',
    slug: 'distingo-bank',
    title: 'DISTINGO Bank Tagesgeld',
    image: '/images/tagesgeldkonten/Distingo.jpg',
    interest: '3,00% p.a. (3 Monate bis 100.000 €), danach 1,50% p.a.',
    payout: 'monatlich',
    depositMin: '0 €',
    security: 'FR – Französische Einlagensicherung (FGDR) 100.000 €',
    countryCode: 'FR',
    euDgs: true,
    isNeukundenaktion: true,
    highlights: [
      '3,00% p.a. für 3 Monate (Neukunden)',
      'Keine Gebühren, 100% online',
      'EU-konforme Sicherung bis 100.000 €'
    ],
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C5423128408T'
  },
  {
    id: 'raisin',
    slug: 'raisin',
    title: 'Raisin Tagesgeld (Plattform)',
    image: '/images/tagesgeldkonten/Raisin.jpg',
    interest: 'Bis ca. 4,00% p.a. – je nach Partnerbank',
    payout: 'variabel',
    depositMin: 'abhängig vom Angebot',
    security: 'EU – je Bank eigenes DGS bis 100.000 €',
    countryCode: 'EU',
    euDgs: true,
    isNeukundenaktion: false,
    highlights: [
      'Zugang zu >140 Banken über 1 Konto',
      'Top-Zinsen aus der EU, keine Kontoführungsgebühren',
      'Deutscher Support, digitale Verwaltung'
    ],
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C67225978B'
  },
  {
    id: 'jt-direktbank',
    slug: 'jt-direktbank',
    title: 'J&T Direktbank Tagesgeld',
    image: '/images/tagesgeldkonten/J%26T%20Direktbank.jpg',
    interest: 'ca. 3,60% p.a. variabel (typisch, Okt 2025)',
    payout: 'monatlich',
    depositMin: '1 €',
    security: 'CZ – Tschechische Einlagensicherung 100.000 €',
    countryCode: 'CZ',
    euDgs: true,
    isNeukundenaktion: true,
    highlights: [
      'Attraktive Zinsen, kostenlose Kontoführung',
      'EU-Einlagensicherung bis 100.000 €',
      'Schnelle Online-Kontoeröffnung'
    ],
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C4422100650T'
  },
  {
    id: 'openbank',
    slug: 'openbank',
    title: 'Openbank Tagesgeld',
    image: '/images/tagesgeldkonten/Openbank.jpg',
    interest: '3,00% p.a. (Neukunden 6 Monate), danach ca. 1,50% p.a.',
    payout: 'monatlich',
    depositMin: '1 €',
    security: 'ES – Spanische Einlagensicherung 100.000 €',
    countryCode: 'ES',
    euDgs: true,
    isNeukundenaktion: true,
    highlights: [
      '3,00% p.a. für Neukunden (6 Monate)',
      'Deutsche IBAN, volle EU-Sicherung',
      'Gebührenfrei, 100% digital'
    ],
    applyUrl: '/antrag/openbank'
  },
  {
    id: 'santander-consumer-bank',
    slug: 'santander-consumer-bank',
    title: 'Santander Consumer Bank Tagesgeld',
    image: '/images/tagesgeldkonten/Santander.jpg',
    interest: '2,30% p.a. (4 Monate Neukunden), danach variabel ~1,0% p.a.',
    payout: 'monatlich',
    depositMin: '0 €',
    security: 'DE – EdB gesetzlich + BdB',
    countryCode: 'DE',
    euDgs: true,
    isNeukundenaktion: true,
    highlights: [
      '2,30% p.a. für 4 Monate (Neukunden)',
      'Monatliche Zinsgutschrift, keine Mindestanlage',
      'Deutsche Einlagensicherung + zusätzlicher Fonds'
    ],
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C19399348B'
  },
  {
    id: 'ferratum',
    slug: 'ferratum',
    title: 'Ferratum Sparkonto (Tagesgeld)',
    image: '/images/tagesgeldkonten/Ferratum.jpg',
    interest: 'Variabel, häufig ~3,00% p.a.',
    payout: 'monatlich',
    depositMin: '0 €',
    security: 'MT – Maltesische Einlagensicherung 100.000 €',
    countryCode: 'MT',
    euDgs: true,
    isNeukundenaktion: false,
    highlights: [
      'Monatliche Zinsgutschrift, volle Flexibilität',
      'Keine Kontoführungsgebühr',
      'EU-regulierte Bank, DGS bis 100.000 €'
    ],
    applyUrl: '/antrag/ferratum'
  },
  {
    id: 'consorsbank',
    slug: 'consorsbank',
    title: 'Consorsbank Tagesgeld',
    image: '/images/tagesgeldkonten/Consorsbank.jpg',
    interest: 'Variabler Zins (Details laut Bank)',
    payout: 'monatlich',
    depositMin: '0 €',
    security: 'DE – EdB gesetzliche Einlagensicherung 100.000 €',
    countryCode: 'DE',
    euDgs: true,
    isNeukundenaktion: false,
    highlights: [
      'Kostenfreie Kontoführung, täglich verfügbar',
      'Deutsche Einlagensicherung bis 100.000 €'
    ],
    applyUrl: '/antrag/consorsbank'
  }
]

export const recommendedSavings = ['distingo-bank', 'openbank', 'tf-bank']



