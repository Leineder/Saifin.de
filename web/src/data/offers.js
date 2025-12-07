export const offers = [
  {
    id: 'tf-bank-mastercard-gold',
    slug: 'tf-bank-mastercard-gold',
    title: 'TF Bank Mastercard Gold',
    bullets: [
      '0 € Jahresgebühr',
      '0 % Kosten bei Auslandseinsatz',
      'Bargeld weltweit gebührenfrei',
      'Reiseversicherungspaket inkl.'
    ],
    image: '/images/creditcards/TFBank_MastercardGold_11zon.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'Mastercard – Revolving',
    isTestsieger: true,
    details: {
      foreignCurrency: '0 % Kosten bei Auslandseinsatz',
      cashWithdrawal: 'Weltweit gebührenfrei; Bargeld und Überweisungen verzinsen sich ab Buchungstag',
      interest: 'Einkäufe bis 51 Tage zinsfrei bei Vollzahlung; Mindestrate 3 % / min. 30 €; Sollzins 22,35 % p.a., eff. 24,79 % p.a.',
      creditLimit: 'Rahmen bis 10.000 €*',
      notes: 'Keine automatische Abbuchung – Rechnung aktiv überweisen'
    },
    disclaimer: '*Versicherung an Bedingungen geknüpft (z. B. ≥50 % Reisekosten mit Karte zahlen).',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C213344020T'
  },
  {
    id: 'instabank-kreditkarte',
    slug: 'instabank-kreditkarte',
    title: 'Instabank Kreditkarte',
    bullets: [
      '0 € Jahresgebühr',
      'Kreditlimit bis 25.000 €',
      '10%-Club Mitgliedschaft inklusive',
      'Bei Schufa Einträgen Ablehnung'
    ],
    image: '/images/creditcards/Instabank_card_horizontal_11zon.webp',
    annualFee: 0,
    foreignFee: '2,49 %',
    cardType: 'Visa – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay']
    },
    details: {
      foreignCurrency: '2,49 % Auslandseinsatz',
      cashWithdrawal: '2 % (max. 50 € pro Abhebung)',
      creditLimit: 'Bis 25.000 €*',
      interest: 'Sollzins 18,9 % p.a., eff. 20,63 % p.a.',
      notes: 'Sofort verfügbar nach Antrag; Geldüberweisung von Kreditkarte möglich; App verfügbar; Keine SCHUFA-Prüfung (Experian-Bonitätsprüfung)',
      benefits: '10%-Club: Monatliche Rabatte; Sofortige virtuelle Karte verfügbar'
    },
    disclaimer: '*Bonitätsabhängig; Mindestalter 23 Jahre; Wohnsitz in Deutschland erforderlich.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C5393126557T'
  },
  {
    id: 'netkredit24-mastercard',
    slug: 'netkredit24-mastercard',
    title: 'Netkredit24 Mastercard',
    bullets: [
      '0 € Jahresgebühr',
      'Bis zu 8 Wochen zinsfrei',
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
    id: 'extra-karte-mastercard',
    slug: 'extra-karte-mastercard',
    title: 'Extra Karte (Novum Bank) – Mastercard',
    bullets: [
      '0 € Jahresgebühr',
      'Bis zu 8 Wochen zinsfrei (bei Vollzahlung)',
      'Bis 4.000 € Kreditrahmen*',
      'Bei Schufa Einträgen Ablehnung'
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
      notes: 'Kein Girokonto erforderlich; Voraussetzungen: Einkommen, SCHUFA, keine Selbstständigen; Bei Schufa Einträgen Ablehnung'
    },
    disclaimer: '*Bonitätsabhängig; Bedingungen lt. Bank.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C411691936T'
  },
  {
    id: 'gebuehrenfrei-mastercard-gold',
    slug: 'gebuehrenfrei-mastercard-gold',
    title: 'Gebührenfrei Mastercard Gold',
    bullets: [
      '0 € Jahresgebühr dauerhaft',
      'Bis zu 7 Wochen zinsfrei',
      '0 % Kosten bei Auslandseinsatz & Bargeld weltweit gebührenfrei*',
      'Ablehnung bei Schufa-Einträgen'
    ],
    image: '/images/creditcards/Advanzia_Gebuehrenfrei_Mastercard_Gold.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'Mastercard – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay', 'Garmin Pay'],
      insurance: 'Reiseversicherung inklusive'
    },
    details: {
      annualFeeText: '0 € p.a. (dauerhaft)',
      foreignCurrency: '0 % Kosten bei Auslandseinsatz; Mastercard-Referenzkurs inkl. Aufschlag',
      cashWithdrawal: '0 € Bargeldabhebung*; Zinsen laut Preisverzeichnis ab Buchungstag',
      interest: 'Bis zu 7 Wochen zinsfrei bei Vollzahlung; danach Sollzins gemäß Preisverzeichnis',
      benefits: '5 % Reisegutschrift & 5 % Mietwagen-Rückvergütung über Kundenportal',
      notes: '24/7 Kundenservice, Advanzia Mobil App, keine Mindestumsätze erforderlich'
    },
    disclaimer: '*Zinsen gemäß Preisverzeichnis; Fremdwährungsumrechnungsaufschlag laut Mastercard.¹',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C13814286T'
  },
  {
    id: 'barclays-visa',
    slug: 'barclays-visa',
    title: 'Barclays Visa',
    bullets: [
      '25€ Startguthaben',
      '€0 Jahresgebühr*',
      'Über 1.000 € Sofortgeld möglich',
      'Weltweit gebührenfrei bezahlen',
      'Weltweit kostenlose Bargeldabhebungen',
      'Bis zu 8 Wochen Zahlungsziel uvm.'
    ],
    image: '/images/creditcards/Barclays Visa.webp',
    annualFee: 0,
    foreignFee: '0 %',
    cardType: 'Visa – Revolving',
    features: {
      mobilePay: ['Apple Pay', 'Google Pay']
    },
    details: {
      annualFeeText: '€0 Jahresgebühr*',
      foreignCurrency: 'Weltweit gebührenfrei bezahlen',
      cashWithdrawal: 'Weltweit kostenlose Bargeldabhebungen',
      creditLimit: 'Über 1.000 € Sofortgeld möglich*',
      interest: 'Bis zu 8 Wochen Zahlungsziel',
      benefits: '25€ Startguthaben',
      notes: 'Für weitere Informationen zur Kreditkarte schau dir den Affiliate Link an.'
    },
    disclaimer: '*Leistungsumfang laut Versicherungsbedingungen/Preisverzeichnis.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C14313531T'
  },
  {
    id: 'consors-finanz-mastercard',
    slug: 'consors-finanz-mastercard',
    title: 'Consors Finanz Mastercard',
    bullets: [
      '0 € Jahresgebühr',
      'Bis zu 90 Tage zinsfrei',
      'Bis 5.000 € Kreditrahmen*',
      'Ablehnung bei Schufa-Einträgen'
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
    id: 'hanseatic-bank-goldcard',
    slug: 'hanseatic-bank-goldcard',
    title: 'Hanseatic Bank GoldCard (Visa)',
    bullets: [
      '4,90 € mtl. (= 58,80 € p.a.)',
      '0 % Kosten bei Auslandseinsatz',
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
      foreignCurrency: '0 % Kosten bei Auslandseinsatz',
      cashWithdrawal: 'Weltweit gebührenfrei (seitens Hanseatic); Mindestabhebung 50 €*',
      creditLimit: 'Typische Obergrenze ca. 5.000 €*',
      interest: 'Teilzahlung voreingestellt (3 % / min. 20 €); Sollzins 16,05 % p.a., eff. ca. 25,49 % p.a.',
      notes: 'Sondergebühr Casinotransaktionen 3 % (min. 3,95 €)'
    },
    disclaimer: '*Leistungsumfang laut Versicherungsbedingungen/Preisverzeichnis.',
    applyUrl: 'https://www.financeads.net/tc.php?t=78535C328118428T'
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
