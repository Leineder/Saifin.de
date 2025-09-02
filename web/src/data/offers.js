export const offers = [
  {
    id: 'american-express-platinum',
    slug: 'american-express-platinum',
    title: 'American Express Platinum Card',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Charge'],
    image: '/images/creditcards/amex-platinum.png',
    graceWeeks: 7,
    annualFee: -720,
    foreignFee: '0%',
    cardType: 'American Express Platinum',
    bonus: '100,00 €',
    design: 'Silberne American Express Platinum Karte',
    features: {
      cashback: '5% Rückvergütung bei Mietwagen',
      travelCredit: '5% Reisegutschrift',
      insurance: 'Reiseversicherung inklusive',
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Flexibel',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Bonitätsprüfung durch die Bank. Konditionen abhängig vom Einzelfall.',
    applyUrl: '/antrag/american-express-platinum'
  },
  {
    id: 'consors-finanz-mastercard',
    slug: 'consors-finanz-mastercard',
    title: 'Consors Finanz Mastercard',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: '/images/creditcards/consors-finanz-mastercard.png',
    graceWeeks: 13,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'Mastercard',
    design: 'Schwarze Consors Finanz Mastercard mit Apple Pay und Google Pay',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: null,
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false,
      contactless: true
    },
    specialConditions: {
      creditLimit: 'Bis 5.000 €',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Kreditrahmen abhängig von der Bonitätsprüfung.',
    applyUrl: '/antrag/consors-finanz-mastercard'
  },
  {
    id: 'barclays-visa',
    slug: 'barclays-visa',
    title: 'Barclays VISA',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: '/images/creditcards/barclays-visa.png',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    bonus: '25,00 €',
    design: 'Schwarze Barclays VISA-Karte mit kontaktloser Funktion',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: 'Kartenmissbrauchsschutz',
      mobilePay: [],
      virtual: false,
      emergencyCash: 'Bis 500 € Bargeld-Notfall',
      strongAuth: 'Starke Kundenauthentifizierung'
    },
    specialConditions: {
      creditLimit: 'Standard',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Notfall-Services weltweit verfügbar. 24/7 Hotline.',
    applyUrl: '/antrag/barclays-visa'
  },
  {
    id: 'gebuehrenfrei-mastercard-gold',
    slug: 'gebuehrenfrei-mastercard-gold',
    title: 'gebührenfrei.de Mastercard GOLD',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: '/images/creditcards/gebuehrenfrei-gold.png',
    graceWeeks: 7,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'Mastercard GOLD',
    design: 'Goldene gebührenfrei.de Mastercard GOLD',
    features: {
      cashback: '5% Rückvergütung bei Mietwagen',
      travelCredit: '5% Reisegutschrift',
      insurance: 'Reiseversicherung inklusive',
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Flexibel',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Bonitätsprüfung durch die Bank. Konditionen abhängig vom Einzelfall.',
    applyUrl: '/antrag/gebuehrenfrei-mastercard-gold'
  },
  {
    id: 'santander-bestcard-basic',
    slug: 'santander-bestcard-basic',
    title: 'Santander BestCard Basic',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 2800 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: '/images/creditcards/santander-bestcard-basic.png',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Hellblaue/weiße Santander BestCard Basic',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: null,
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Standard',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Standard-Karte mit grundlegenden Funktionen.',
    applyUrl: '/antrag/santander-bestcard-basic'
  },
  {
    id: 'extra-karte-mastercard',
    slug: 'extra-karte-mastercard',
    title: 'Extra Karte Mastercard',
    bullets: ['0 € Jahresgebühr', 'Sofortentscheidung', 'Kostenlos im Euroraum'],
    image: '/images/creditcards/extra-mastercard.png',
    graceWeeks: 4,
    annualFee: 0,
    foreignFee: '0% (Euroraum)',
    cardType: 'Mastercard',
    design: 'Schwarze Extra Karte mit €XTRA Logo',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: null,
      mobilePay: [],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Standard',
      schufaCheck: true,
      instantDecision: true
    },
    disclaimer: '*Nur kostenlos im Euroraum. Außerhalb können Gebühren anfallen.',
    applyUrl: '/antrag/extra-karte-mastercard'
  },
  {
    id: 'trade-republic-kreditkarte',
    slug: 'trade-republic-kreditkarte',
    title: 'Trade Republic Kreditkarte',
    bullets: ['0 € Jahresgebühr', 'Weltweit 0% Gebühren', 'Bis 1% Save-back'],
    image: '/images/creditcards/trade-republic.png',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Graue Trade Republic Karte mit modernem Design',
    features: {
      cashback: 'Bis 1% Save-back',
      travelCredit: null,
      insurance: null,
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Flexibel',
      schufaCheck: false,
      instantDecision: true,
      girokonto: 'Attraktive Zinsen'
    },
    disclaimer: '*Save-back abhängig von der Nutzung. Girokonto separat erforderlich.',
    applyUrl: '/antrag/trade-republic-kreditkarte'
  },
  {
    id: 'instabank-visa',
    slug: 'instabank-visa',
    title: 'Instabank VISA',
    bullets: ['0 € Jahresgebühr', 'Virtuelle Karte sofort', 'Kreditlimit bis 25.000 €'],
    image: '/images/creditcards/instabank-visa.png',
    graceWeeks: 5,
    annualFee: 0,
    foreignFee: 'Abheben 2%, Bezahlen 0%',
    cardType: 'VISA',
    design: 'Dunkle Instabank VISA-Karte mit abstraktem Design',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: null,
      mobilePay: [],
      virtual: true
    },
    specialConditions: {
      creditLimit: 'Bis 25.000 €',
      schufaCheck: true,
      instantDecision: true,
      flexibleRepayment: true
    },
    disclaimer: '*Virtuelle Karte sofort verfügbar. Physische Karte folgt per Post.',
    applyUrl: '/antrag/instabank-visa'
  },
  {
    id: 'awa7-visa',
    slug: 'awa7-visa',
    title: 'awa7 VISA',
    bullets: ['0 € Jahresgebühr', '85% recyceltes PVC', 'Flexible Ratenzahlung'],
    image: '/images/creditcards/awa7-visa.png',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Schwarze awa7 VISA-Karte mit grünem Akzent',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: null,
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Flexibel',
      schufaCheck: true,
      instantDecision: false,
      sustainable: '85% recyceltes PVC',
      flexibleRepayment: true
    },
    disclaimer: '*Nachhaltige Karte aus recyceltem Material. Umweltschonend.',
    applyUrl: '/antrag/awa7-visa'
  },
  {
    id: 'hanseatic-bank-goldcard',
    slug: 'hanseatic-bank-goldcard',
    title: 'Hanseatic Bank GoldCard',
    bullets: ['59 € Jahresgebühr', 'Reiseversicherungspaket', 'Bis 3 Monate zinsfrei'],
    image: '/images/creditcards/hanseatic-goldcard.png',
    graceWeeks: 13,
    annualFee: 59,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Goldene Hanseatic Bank GoldCard mit Weltkarte',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: 'Umfangreiches Reiseversicherungspaket',
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Bis 3.500 €',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Premium-Karte mit umfangreichen Versicherungsleistungen.',
    applyUrl: '/antrag/hanseatic-bank-goldcard'
  }
]
