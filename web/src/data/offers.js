export const offers = [
  {
    id: 'extra-karte-mastercard',
    slug: 'extra-karte-mastercard',
    title: 'Extra Karte (Novum Bank) – Mastercard',
    bullets: [
      '0 € Jahresgebühr',
      'Bis zu 8 Wochen zinsfrei (bei Vollzahlung)',
      'Bis 4.000 € Kreditrahmen*'
    ],
    image: '/images/creditcards/extra-mastercard.webp',
    annualFee: 0,
    foreignFee: '2,99 %',
    cardType: 'Mastercard – Revolving',
    details: {
      foreignCurrency: '2,99 % Auslandseinsatz',
      cashWithdrawal: '3 % (mind. 3 €)',
      creditLimit: 'Kreditrahmen bis 4.000 €*',
      interest: 'Effektivzins ca. 24,60 %',
      notes: 'Kein Girokonto erforderlich; Voraussetzungen: Einkommen, SCHUFA, keine Selbstständigen'
    },
    disclaimer: '*Bonitätsabhängig; Bedingungen lt. Bank.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C411691936T'
  },
  {
    id: 'hanseatic-bank-genialcard',
    slug: 'hanseatic-bank-genialcard',
    title: 'Hanseatic Bank GenialCard (Visa)',
    bullets: [
      '0 € Jahresgebühr dauerhaft',
      '0 % Auslandseinsatz',
      'Inland 3,95 € je Abhebung, Ausland 0 €',
      'Teilzahlung voreingestellt (3 % / min. 20 €)'
    ],
    image: '/images/creditcards/hanseatic-bank-genialcard_11zon.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'VISA – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay']
    },
    details: {
      foreignCurrency: '0 % Auslandseinsatz (ATM-Betreiber können Entgelte verlangen)',
      cashWithdrawal: 'Inland 3,95 € je Abhebung; Ausland 0 €; Mindestabhebung 50 €*',
      limits: 'Tageslimit Bargeld ca. 500 €*, Online-Zahlungslimit ca. 6.000 €*',
      creditLimit: 'Typischer Startrahmen bis 4.000 €* (bonitätsabhängig)',
      interest: 'Teilzahlung voreingestellt; Sollzins 16,05 % p.a., eff. 17,29 % p.a.'
    },
    disclaimer: '*Angaben erfahrungsbasiert/bonitätsabhängig; Preis-/Leistungsverzeichnis beachten.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C328121218T'
  },
  {
    id: 'hanseatic-bank-goldcard',
    slug: 'hanseatic-bank-goldcard',
    title: 'Hanseatic Bank GoldCard (Visa)',
    bullets: [
      '4,90 € mtl. (= 58,80 € p.a.)',
      '0 % Auslandseinsatz',
      'Bargeld weltweit gebührenfrei (seitens Hanseatic)',
      'Reiseversicherungspaket inklusive'
    ],
    image: '/images/creditcards/hanseatic-goldcard_11zon.webp',
    annualFee: 58.8,
    foreignFee: '0 %',
    cardType: 'VISA – Revolving',
    features: {
      insurance: 'Reiserücktritt, Auslandskranken, Gepäck u.a.',
      mobilePay: ['Apple Pay', 'Google Pay']
    },
    details: {
      annualFeeText: '4,90 € pro Monat (58,80 € p.a.)',
      foreignCurrency: '0 % Auslandseinsatz',
      cashWithdrawal: 'Weltweit gebührenfrei (seitens Hanseatic); Mindestabhebung 50 €*',
      creditLimit: 'Typische Obergrenze ca. 5.000 €*',
      interest: 'Teilzahlung voreingestellt (3 % / min. 20 €); Sollzins 16,05 % p.a., eff. ca. 25,49 % p.a.',
      notes: 'Sondergebühr Casinotransaktionen 3 % (min. 3,95 €)'
    },
    disclaimer: '*Leistungsumfang laut Versicherungsbedingungen/Preisverzeichnis.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C328118428T'
  },
  {
    id: 'tf-bank-mastercard-gold',
    slug: 'tf-bank-mastercard-gold',
    title: 'TF Bank Mastercard Gold',
    bullets: [
      '0 € Jahresgebühr',
      '0 % Auslandseinsatz',
      'Bargeld weltweit gebührenfrei',
      'Reiseversicherungspaket inkl.'
    ],
    image: '/images/creditcards/TFBank_MastercardGold_11zon.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'Mastercard – Revolving',
    details: {
      foreignCurrency: '0 % Auslandseinsatz',
      cashWithdrawal: 'Weltweit gebührenfrei; Bargeld und Überweisungen verzinsen sich ab Buchungstag',
      interest: 'Einkäufe bis 51 Tage zinsfrei bei Vollzahlung; Mindestrate 3 % / min. 30 €; Sollzins 22,35 % p.a., eff. 24,79 % p.a.',
      creditLimit: 'Rahmen bis 10.000 €*',
      notes: 'Keine automatische Abbuchung – Rechnung aktiv überweisen'
    },
    disclaimer: '*Versicherung an Bedingungen geknüpft (z. B. ≥50 % Reisekosten mit Karte zahlen).',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C213344020T'
  },
  {
    id: 'santander-bestcard-basic',
    slug: 'santander-bestcard-basic',
    title: 'Santander BestCard Basic (Visa)',
    bullets: [
      '0 € Jahresgebühr',
      '4×/Monat weltweit kostenlos Bargeld',
      '1 % Tankrabatt (bis 200 €/Monat)',
      'Apple Pay/Google Pay/Garmin Pay'
    ],
    image: '/images/creditcards/Santander_BestCardBasic_2023_compressed.webp',
    annualFee: 0,
    foreignFee: '1,85 %',
    cardType: 'VISA – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay', 'Garmin Pay']
    },
    details: {
      foreignCurrency: '1,85 % Auslandseinsatz',
      cashWithdrawal: '4×/Monat weltweit kostenlos; danach Entgelt laut Preisverzeichnis',
      interest: 'Teilzahlung voreingestellt, eff. ca. 16,43 % p.a.',
      notes: 'Abrechnung nur über Santander-Girokonto möglich',
      benefits: '5 % Reiserabatt über Partner Urlaubsplus'
    },
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C19318437T'
  },
  {
    id: 'netkredit24-mastercard',
    slug: 'netkredit24-mastercard',
    title: 'Netkredit24 Mastercard (Vermittelt)',
    bullets: [
      '0 € Jahresgebühr (beworben)',
      'Bis zu 8 Wochen zinsfrei (beworben)',
      'Kreditrahmen bis 4.000 €*'
    ],
    image: '/images/creditcards/NetKredit24-Kreditkarte.webp',
    annualFee: 0,
    foreignFee: 'variabel (je Partnerbank)',
    cardType: 'Mastercard – Revolving (vermittelt)',
    details: {
      foreignCurrency: 'Konditionen (Auslandseinsatz, Bargeld, Zinsen) partnerabhängig',
      notes: 'Netkredit24 ist Vermittler (z. B. Extra Karte / Ferratum). Endgültige Bedingungen siehe Partnervertrag.'
    },
    disclaimer: '*Abhängig vom vermittelten Institut; Angaben Werbestand.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C5160120906T'
  },
  {
    id: 'consors-finanz-mastercard',
    slug: 'consors-finanz-mastercard',
    title: 'Consors Finanz Mastercard',
    bullets: [
      '0 € Jahresgebühr',
      'Bargeld ab 300 € kostenlos, darunter 3,95 €',
      'Bis 5.000 € Kreditrahmen*'
    ],
    image: '/images/creditcards/consors-finanz-mastercard.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'Mastercard – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay']
    },
    details: {
      annualFeeText: '0 € p.a. (dauerhaft)',
      foreignCurrency: '0 % (laut PV, Änderungen möglich)',
      cashWithdrawal: '≥ 300 €: 0 €; < 300 €: 3,95 € je Abhebung',
      limits: 'Tageslimit ca. 1.100 €*, Wochenlimit ca. 2.500 €*',
      creditLimit: 'Bis 5.000 €',
      interest: 'Einmalzahlung (bis 90 Tage zinsfrei) oder Teilzahlung; Sollzins ca. 17,43 %, eff. ca. 18,90 %'
    },
    disclaimer: '*Kreditrahmen bonitätsabhängig; PV beachten.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C395489098T'
  },
  {
    id: '1822direkt-visa-classic-gold',
    slug: '1822direkt-visa-classic-gold',
    title: '1822direkt Visa Classic / Gold',
    bullets: [
      '1. Jahr oft kostenlos',
      'Classic ca. 36 €/Jahr, Gold ca. 72 €/Jahr',
      'Girokontobindung erforderlich'
    ],
    image: '/images/creditcards/1822 direkt Visa_11zon.webp',
    annualFee: 36,
    foreignFee: 'ca. 2,25 %',
    cardType: 'VISA – Charge (Girokonto-Abrechnung)',
    details: {
      annualFeeText: '1. Jahr häufig kostenlos; danach Classic ~36 €/Jahr, Gold ~72 €/Jahr',
      foreignCurrency: 'ca. 2,25 % Auslandseinsatz',
      cashWithdrawal: 'Im Euroraum oft kostenlos (Sparkassen-Netz); außerhalb variable Gebühren (1,75–2,25 %)',
      notes: 'Abrechnung über Girokonto (Charge), keine Revolving-Funktion; Gold mit Reiseversicherungen; Automatenkonditionen über Sparkassenverbund'
    },
    disclaimer: '*Konditionen abhängig vom jeweiligen Kontomodell/Preisverzeichnis.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C10722509B'
  }
]
