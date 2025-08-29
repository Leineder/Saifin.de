export const offers = [
  {
    id: 'american-express-platinum',
    slug: 'american-express-platinum',
    title: 'American Express Platinum Card',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Charge'],
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1200',
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
    disclaimer: '*Bonitätsprüfung durch die Bank. Konditionen abhängig vom Einzelfall.'
  },
  {
    id: 'consors-finanz-mastercard',
    slug: 'consors-finanz-mastercard',
    title: 'Consors Finanz Mastercard',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
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
    disclaimer: '*Kreditrahmen abhängig von der Bonitätsprüfung.'
  },
  {
    id: 'barclays-visa',
    slug: 'barclays-visa',
    title: 'Barclays VISA',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
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
    disclaimer: '*Notfall-Services weltweit verfügbar. 24/7 Hotline.'
  },
  {
    id: 'gebuehrenfrei-mastercard-gold',
    slug: 'gebuehrenfrei-mastercard-gold',
    title: 'gebührenfrei.de Mastercard GOLD',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 58000 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1200',
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
    disclaimer: '*Bonitätsprüfung durch die Bank. Konditionen abhängig vom Einzelfall.'
  },
  {
    id: 'santander-bestcard-basic',
    slug: 'santander-bestcard-basic',
    title: 'Santander BestCard Basic',
    bullets: ['Kostenlose Kreditkarte', 'Bargeld an 2800 Automaten', 'flexible Ratenzahlung möglich', 'Zahlungsart Credit'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
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
    disclaimer: '*Standard-Karte mit grundlegenden Funktionen.'
  },
  {
    id: 'extra-karte-mastercard',
    slug: 'extra-karte-mastercard',
    title: 'Extra Karte Mastercard',
    bullets: ['0 € Jahresgebühr', 'Sofortentscheidung', 'Kostenlos im Euroraum'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
    graceWeeks: 4,
    annualFee: 0,
    foreignFee: '0% (Euroraum)',
    cardType: 'Mastercard',
    design: 'Klassische Mastercard mit blauem Design',
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
    disclaimer: '*Nur kostenlos im Euroraum. Außerhalb können Gebühren anfallen.'
  },
  {
    id: 'trade-republic-kreditkarte',
    slug: 'trade-republic-kreditkarte',
    title: 'Trade Republic Kreditkarte',
    bullets: ['0 € Jahresgebühr', 'Weltweit 0% Gebühren', 'Bis 1% Save-back'],
    image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'Mastercard',
    design: 'Moderne Karte mit Trade Republic Branding',
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
    disclaimer: '*Save-back abhängig von der Nutzung. Girokonto separat erforderlich.'
  },
  {
    id: 'instabank-visa',
    slug: 'instabank-visa',
    title: 'Instabank VISA',
    bullets: ['0 € Jahresgebühr', 'Virtuelle Karte sofort', 'Kreditlimit bis 25.000 €'],
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1200',
    graceWeeks: 5,
    annualFee: 0,
    foreignFee: 'Abheben 2%, Bezahlen 0%',
    cardType: 'VISA',
    design: 'Virtuelle Karte mit VISA-Logo, auch physisch verfügbar',
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
    disclaimer: '*Virtuelle Karte sofort verfügbar. Physische Karte folgt per Post.'
  },
  {
    id: 'consors-finanz-mastercard',
    slug: 'consors-finanz-mastercard',
    title: 'Consors Finanz Mastercard',
    bullets: ['0 € Jahresgebühr', 'Bis 90 Tage zinsfrei', 'Kreditrahmen bis 5.000 €'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
    graceWeeks: 13,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'Mastercard',
    design: 'Klassische Mastercard mit kontaktloser Funktion',
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
    disclaimer: '*Kreditrahmen abhängig von der Bonitätsprüfung.'
  },
  {
    id: 'awa7-visa',
    slug: 'awa7-visa',
    title: 'awa7 VISA',
    bullets: ['0 € Jahresgebühr', '85% recyceltes PVC', 'Flexible Ratenzahlung'],
    image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Nachhaltige Karte aus 85% recyceltem PVC, grünes Design',
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
    disclaimer: '*Nachhaltige Karte aus recyceltem Material. Umweltschonend.'
  },
  {
    id: 'hanseatic-bank-goldcard',
    slug: 'hanseatic-bank-goldcard',
    title: 'Hanseatic Bank GoldCard',
    bullets: ['59 € Jahresgebühr', 'Reiseversicherungspaket', 'Bis 3 Monate zinsfrei'],
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1200',
    graceWeeks: 13,
    annualFee: 59,
    foreignFee: '0%',
    cardType: 'Mastercard Gold',
    design: 'Premium Goldkarte mit Hanseatic Bank Branding',
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
    disclaimer: '*Premium-Karte mit umfangreichen Versicherungsleistungen.'
  },
  {
    id: 'barclays-visa',
    slug: 'barclays-visa',
    title: 'Barclays VISA',
    bullets: ['0 € Jahresgebühr', 'Notfall-Hotline', 'Kartenmissbrauchsschutz'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
    graceWeeks: 6,
    annualFee: 0,
    foreignFee: '0%',
    cardType: 'VISA',
    design: 'Klassische VISA-Karte mit Barclays Branding',
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
    disclaimer: '*Notfall-Services weltweit verfügbar. 24/7 Hotline.'
  },
  {
    id: 'amex-gold-card',
    slug: 'amex-gold-card',
    title: 'Amex Gold Card',
    bullets: ['Membership Rewards', 'Umfangreiches Versicherungspaket', 'Amex Offers'],
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=1200',
    graceWeeks: 6,
    annualFee: 'Kostenpflichtig',
    foreignFee: 'Standard',
    cardType: 'American Express Gold',
    design: 'Premium Goldkarte mit American Express Logo',
    features: {
      cashback: null,
      travelCredit: null,
      insurance: 'Umfangreiches Versicherungspaket',
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false,
      membershipRewards: true,
      amexOffers: true
    },
    specialConditions: {
      creditLimit: 'Premium',
      schufaCheck: true,
      instantDecision: false
    },
    disclaimer: '*Premium-Karte mit exklusiven Vorteilen. Jahresgebühr variiert.'
  }
]
