#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Daten importieren
import { offers } from '../src/data/offers.js'
import { brokers } from '../src/data/brokers.js'
import { articles } from '../src/data/articles.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_URL = process.env.SITE_URL || 'https://www.saifin.de'

function url(path, opts = {}) {
  const priority = opts.priority ?? 0.7
  const changefreq = opts.changefreq ?? 'weekly'
  return `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const staticRoutes = [
  '/',
  '/kreditkarten',
  '/broker',
  '/tagesgeld',
  '/ratgeber',
  '/datenschutz',
  '/impressum',
  '/kontakt',
]

const dynamicCardRoutes = offers.map(o => `/kreditkarten/${o.slug}`)
const dynamicBrokerRoutes = brokers.map(b => `/broker/${b.slug}`)
const dynamicGuideRoutes = articles.map(a => `/ratgeber/${a.slug}`)

const allRoutes = [
  ...staticRoutes,
  ...dynamicCardRoutes,
  ...dynamicBrokerRoutes,
  ...dynamicGuideRoutes,
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
allRoutes.map(p => url(p)).join('\n') +
`\n</urlset>\n`

const outDir = resolve(__dirname, '../public')
await mkdir(outDir, { recursive: true })
await writeFile(resolve(outDir, 'sitemap.xml'), xml, 'utf8')
console.log(`Sitemap mit ${allRoutes.length} URLs generiert → public/sitemap.xml`)


