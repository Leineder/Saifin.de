// Hilfsfunktionen für dynamische SEO (Titel, Description, Canonical, OG/Twitter)
import { offers } from './data/offers'
import { brokers } from './data/brokers'
import { articles } from './data/articles'

function ensureTag(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setCanonical(url) {
  const link = ensureTag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'canonical')
    l.id = 'canonical'
    return l
  })
  link.setAttribute('href', url)
}

function setMetaName(name, content) {
  if (!content) return
  const meta = ensureTag(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  })
  meta.setAttribute('content', content)
}

function setMetaProperty(property, content) {
  if (!content) return
  const meta = ensureTag(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', property)
    return m
  })
  meta.setAttribute('content', content)
}

export function setMeta({ title, description, canonical, ogImage }) {
  if (title) document.title = title
  if (canonical) setCanonical(canonical)

  setMetaName('description', description || '')
  setMetaName('robots', 'index,follow')

  // Open Graph
  setMetaProperty('og:site_name', 'Saifin')
  setMetaProperty('og:type', 'website')
  setMetaProperty('og:title', title || '')
  setMetaProperty('og:description', description || '')
  if (ogImage) setMetaProperty('og:image', ogImage)

  // Twitter
  setMetaName('twitter:card', 'summary_large_image')
  setMetaName('twitter:title', title || '')
  setMetaName('twitter:description', description || '')
  if (ogImage) setMetaName('twitter:image', ogImage)
}

function clearLdJson() {
  document.head.querySelectorAll('script[data-ld]')?.forEach((n) => n.parentNode.removeChild(n))
}

function appendLdJson(obj) {
  const s = document.createElement('script')
  s.type = 'application/ld+json'
  s.setAttribute('data-ld', 'true')
  s.text = JSON.stringify(obj)
  document.head.appendChild(s)
}

function setHreflangAlternates(url) {
  if (!url) return
  // Entferne bestehende alternates (de/x-default) und setze neu
  document.head.querySelectorAll('link[rel="alternate"][hreflang]')?.forEach((n) => n.parentNode.removeChild(n))
  const make = (lang) => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'alternate')
    l.setAttribute('hreflang', lang)
    l.setAttribute('href', url)
    document.head.appendChild(l)
  }
  make('de')
  make('x-default')
}

function buildCanonicalFromRoute(route) {
  try {
    const base = window.location.origin
    const path = route.fullPath ? route.fullPath.split('?')[0] : '/'
    return `${base}${path}`
  } catch (_) {
    return undefined
  }
}

function summarizeBullets(bullets) {
  if (!Array.isArray(bullets)) return ''
  return bullets.slice(0, 3).join(' • ')
}

export function applyRouteMeta(route) {
  const name = route.name
  const canonical = buildCanonicalFromRoute(route)
  const defaultOg = '/images/landing-hero.jpg'

  let title = 'Saifin – Finanzprodukte vergleichen'
  let description = 'Vergleiche Kreditkarten, Broker und Tagesgeld. Schnell, transparent, unabhängig.'
  let ogImage = defaultOg

  try {
    if (name === 'home') {
      title = 'Saifin – Kreditkarten, Broker & Tagesgeld vergleichen'
      description = 'Top-Angebote vergleichen und in Minuten entscheiden. Kostenlos und unabhängig.'
    } else if (name === 'cards') {
      title = 'Kreditkarten Vergleich 2025 | Saifin'
      description = 'Finde die passende Kreditkarte: Gebühren, Leistungen, Versicherungen – transparent im Vergleich.'
    } else if (name === 'card-detail') {
      const offer = offers.find(o => o.slug === route.params.slug)
      if (offer) {
        title = `${offer.title} – Details, Gebühren & Vorteile | Saifin`
        description = summarizeBullets(offer.bullets) || 'Alle Konditionen im Überblick.'
        ogImage = offer.image || defaultOg
      }
    } else if (name === 'brokers') {
      title = 'Broker Vergleich 2025 | Saifin'
      description = 'Orderkosten, Sparpläne, Regulierung: Finde den passenden Broker für deine Strategie.'
    } else if (name === 'broker-detail') {
      const broker = brokers.find(b => b.slug === route.params.slug)
      if (broker) {
        title = `${broker.name} – Gebühren, Sparpläne & Regulierung | Saifin`
        description = summarizeBullets(broker.highlights) || 'Alle Fakten im Überblick.'
        ogImage = broker.image || defaultOg
      }
    } else if (name === 'savings') {
      title = 'Tagesgeld Vergleich 2025 | Saifin'
      description = 'Aktuelle Zinsen, Einlagensicherung und Konditionen – Tagesgeld im Vergleich.'
    } else if (name === 'guide') {
      title = 'Ratgeber – Finanzwissen kompakt | Saifin'
      description = 'Aktuelle Beiträge zu Kreditkarten, Broker und Tagesgeld – verständlich erklärt.'
    } else if (name === 'guide-detail') {
      const article = articles.find(a => a.slug === route.params.slug)
      if (article) {
        title = `${article.title} | Saifin`
        description = (article.excerpt || '').toString().slice(0, 160)
        ogImage = article.hero || defaultOg
      }
    } else if (name === 'apply') {
      const key = route.params.slug
      const offer = offers.find(o => o.slug === key)
      const broker = brokers.find(b => b.slug === key)
      const label = offer?.title || broker?.name || String(key)
      title = `Antrag: ${label} | Saifin`
      description = 'Jetzt direkt und sicher den Antrag starten.'
      ogImage = offer?.image || broker?.image || defaultOg
    } else if (name === 'privacy') {
      title = 'Datenschutzerklärung | Saifin'
      description = 'Informationen zum Datenschutz auf einen Blick.'
    } else if (name === 'imprint') {
      title = 'Impressum | Saifin'
      description = 'Anbieterkennzeichnung gemäß § 5 TMG.'
    } else if (name === 'contact') {
      title = 'Kontakt | Saifin'
      description = 'Schreibe uns – wir helfen gern weiter.'
    } else if (name === 'thanks') {
      title = 'Vielen Dank | Saifin'
      description = 'Deine Anfrage wurde übermittelt.'
    }
  } catch (_) {
    // Fallbacks bereits gesetzt
  }

  setMeta({ title, description, canonical, ogImage })

  // hreflang alternates
  setHreflangAlternates(canonical)

  // JSON-LD: Breadcrumb + seiten-/detailtyp-spezifisch
  try {
    clearLdJson()
    const items = []

    // Breadcrumbs
    const crumbs = []
    const segments = (route.path || '/').split('/').filter(Boolean)
    let acc = ''
    crumbs.push({ '@type': 'ListItem', position: 1, name: 'Start', item: canonical?.replace(route.path, '/') || '/' })
    segments.forEach((seg, idx) => {
      acc += `/${seg}`
      const pos = idx + 2
      let nameGuess = seg.replace(/-/g, ' ')
      nameGuess = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1)
      crumbs.push({ '@type': 'ListItem', position: pos, name: nameGuess, item: (canonical || '') })
    })
    items.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs })

    if (name === 'card-detail') {
      const offer = offers.find(o => o.slug === route.params.slug)
      if (offer) {
        items.push({
          '@context': 'https://schema.org',
          '@type': 'PaymentCard',
          'name': offer.title,
          'image': offer.image || defaultOg,
          'url': canonical,
          'feesAndCommissionsSpecification': offer.details?.annualFeeText || `${offer.annualFee} € p.a.`,
        })
      }
    } else if (name === 'broker-detail') {
      const broker = brokers.find(b => b.slug === route.params.slug)
      if (broker) {
        items.push({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': broker.name,
          'url': canonical,
          'logo': broker.image || defaultOg
        })
      }
    } else if (name === 'guide-detail') {
      const article = articles.find(a => a.slug === route.params.slug)
      if (article) {
        items.push({
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': article.title,
          'image': article.hero || defaultOg,
          'author': { '@type': 'Organization', 'name': 'Saifin' },
          'publisher': { '@type': 'Organization', 'name': 'Saifin' },
          'mainEntityOfPage': canonical
        })
      }
    } else {
      // Generischer WebPage/CollectionPage
      items.push({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: canonical })
    }

    items.forEach(appendLdJson)
  } catch (_) {
    // best-effort
  }
}


