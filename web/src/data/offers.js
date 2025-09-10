export const offers = [
  {
    id: 'american-express-platinum',
    slug: 'american-express-platinum',
    title: 'American Express Platinum Card',
    bullets: ['720 € Jahresgebühr', '€640 in Credits und Vouchers', 'Membership Rewards Punkte', 'Premium Reiseleistungen'],
    image: '/images/creditcards/amex-platinum.png',
    graceWeeks: 7,
    annualFee: 720,
    foreignFee: '2 %',
    cardType: 'Charge (Vollausgleich, NPSL)',
    bonus: '€640 in Credits und Vouchers',
    design: 'Silberne American Express Platinum Karte',
    features: {
      cashback: '5% Rückvergütung bei Mietwagen',
      travelCredit: '€640 in Credits und Vouchers',
      insurance: 'Reiseversicherung inklusive',
      mobilePay: ['Apple Pay', 'Google Pay'],
      virtual: false
    },
    specialConditions: {
      creditLimit: 'Kein festes Limit (NPSL)',
      schufaCheck: true,
      instantDecision: false
    },
    details: {
      cardType: 'Charge (Vollausgleich, kein festes Ausgabenlimit/NPSL – dynamisch)',
      annualFeeText: '60 €/Monat (= 720 €/Jahr)',
      foreignCurrency: '2 % Währungsumrechnungsgebühr',
      cashWithdrawal: '4 % (mind. 5 €) Bargeldbezugsgebühr',
      creditLimit: 'Kein festes Limit – abhängig von Profil/Zahlungsverhalten (NPSL)',
      benefits: 'Umfangreiche Reise-Benefits/Versicherungen'
    },
    disclaimer: '*€640 in Credits und Vouchers, plus zusätzlicher Wert durch Membership Rewards Punkte und andere Vorteile.',
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
    foreignFee: '0 %',
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
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a. (dauerhaft)',
      foreignCurrency: 'i. d. R. 0 % (bitte Preisverzeichnis beachten)',
      cashWithdrawal: 'Bis 300 € = 3,95 € je Abhebung',
      limits: 'Tageslimit 1.100 €, Wochenlimit 2.500 €',
      creditLimit: 'Bis 5.000 € (bonitätsabhängig)',
      interest: 'eff. 18,90 %; Mindestrate 2,5 % bzw. 9 €'
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
    foreignFee: '0 %',
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
      creditLimit: 'Bonitätsabhängig',
      schufaCheck: true,
      instantDecision: false
    },
    details: {
      cardType: 'Revolving (Vollabbuchung aktivierbar)',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '0 %',
      cashWithdrawal: 'Weltweit 0 €; Mindestabhebung 50 € am Automaten',
      creditLimit: 'Bonitätsabhängig',
      notes: 'Bargeld-Umsätze verzinsen sich ab Buchungstag; bei automatischer Vollabbuchung evtl. Zusatzkosten laut Vergleichen'
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
    foreignFee: '0 %',
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
      creditLimit: 'Bonitätsabhängig',
      schufaCheck: true,
      instantDecision: false
    },
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '0 % laut Preisverzeichnis/Produktseite',
      cashWithdrawal: 'Gebühr 0 €, aber Zinsen ab Abhebetag',
      promo: 'Bis 7 Wochen zinsfrei für Käufe',
      creditLimit: 'Bonitätsabhängig'
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
    foreignFee: '1,5 %',
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
      creditLimit: 'Bonitätsabhängig',
      schufaCheck: true,
      instantDecision: false
    },
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '1,5 % Auslandseinsatzentgelt',
      cashWithdrawal: '4 kostenlose Abhebungen/Monat, ab der 5. Abhebung Entgelt',
      atmLimits: 'In Praxis häufig max. 1.000 €/Tag am Automaten',
      creditLimit: 'Bonitätsabhängig'
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
    foreignFee: '0 % (Euroraum)',
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
      creditLimit: 'Bis 3.000 € (vereinzelt bis 4.000 €)',
      schufaCheck: true,
      instantDecision: true
    },
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '2,99 %',
      cashWithdrawal: '3 % (mind. 3 €)',
      creditLimit: 'Bis 3.000 € (offiziell); teils bis 4.000 € (Bonität)'
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
    foreignFee: '0 %',
    cardType: 'VISA Debit',
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
    details: {
      cardType: 'Debit (mit Verrechnungskonto/Depot; „Saveback“)',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '„worldwide“ ohne eigene TR-Gebühr; ATM-/Anbieter-Gebühren möglich',
      cashWithdrawal: 'Ab 100 € kostenlos, darunter 1 € je Abhebung',
      limits: 'Tägliche/monatliche Kartenlimits in der App einstellbar'
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
    foreignFee: 'Abheben 2 %, Bezahlen 0 %',
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
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a.',
      foreignCurrency: 'Abheben 2 %, Bezahlen 0 %',
      cashWithdrawal: 'Abheben 2 %',
      creditLimit: 'Bis 25.000 € (offiziell)',
      interest: 'Sollzins 18,90 % (Effektivzins ~20–21 % in Vergleichen)'
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
    foreignFee: '0 %',
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
      creditLimit: 'Bis 3.000 €',
      schufaCheck: true,
      instantDecision: false,
      sustainable: '85% recyceltes PVC',
      flexibleRepayment: true
    },
    details: {
      cardType: 'Revolving',
      annualFeeText: '0 € p.a.',
      foreignCurrency: '0 % Auslandseinsatz',
      cashWithdrawal: 'Im Ausland 0 €, in DE 3,95 € je Abhebung',
      creditLimit: 'Bis 3.000 € (offiziell)'
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
    foreignFee: '0 %',
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
      creditLimit: 'Bis zu 4.000 €',
      schufaCheck: true,
      instantDecision: false
    },
    details: {
      cardType: 'Revolving',
      annualFeeText: '4,90 €/Monat (59 €/Jahr)',
      foreignCurrency: '0 % Auslandseinsatz',
      cashWithdrawal: '0 € (ATM-Betreiberentgelt möglich)',
      creditLimit: 'Großzügiges Kartenlimit bis zu 4.000 €',
      interest: 'Effektivzins ~25,49 % bei Teilzahlung (Stand 07/2025)'
    },
    disclaimer: '*Premium-Karte mit umfangreichen Versicherungsleistungen.',
    applyUrl: '/antrag/hanseatic-bank-goldcard'
  }
]
