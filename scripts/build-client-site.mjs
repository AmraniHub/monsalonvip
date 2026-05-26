/**
 * build-client-site.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a ready-to-deploy client salon site from intake form data.
 *
 * USAGE:
 *   node scripts/build-client-site.mjs --client=clients/salon-eleonore.json
 *   node scripts/build-client-site.mjs --client=clients/salon-eleonore.json --template=luxe
 *
 * OUTPUT:
 *   client-sites/[salonSlug]/  — complete Next.js app, push to Vercel in 1 click
 *
 * TEMPLATES (in /site-templates/):
 *   luxe     — dark rose/gold, luxury feel
 *   moderne  — white minimalist, clean
 *   naturel  — beige/green, organic
 *
 * CLIENT JSON FORMAT (generated from intake form or filled manually):
 * {
 *   "salonName": "Salon Éléonore",
 *   "tagline": "Beauté & Bien-être au cœur de Paris",
 *   "ownerName": "Éléonore",
 *   "city": "Paris 16e",
 *   "address": "12 rue de Rivoli, 75016 Paris",
 *   "phone": "06 12 34 56 78",
 *   "whatsapp": "0612345678",
 *   "instagram": "@saloneleonore",
 *   "googleMaps": "https://maps.google.com/...",
 *   "googleRating": "4.9",
 *   "googleReviewCount": "127",
 *   "bookingLink": "https://planity.com/salon-eleonore",
 *   "palette": "rose",
 *   "style": "luxe",
 *   "sector": "Coiffure",
 *   "services": [
 *     { "name": "Coupe & Brushing", "price": "à partir de 45€", "emoji": "✂️" },
 *     { "name": "Coloration", "price": "à partir de 65€", "emoji": "🎨" }
 *   ],
 *   "reviews": [
 *     { "name": "Camille D.", "text": "Résultat parfait !", "rating": 5, "date": "Il y a 3 jours" }
 *   ],
 *   "domain": "salon-eleonore.fr",
 *   "deliveryDate": "2026-05-27"
 * }
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
)

const clientFile = args.client
if (!clientFile) {
  console.error('❌ Usage: node scripts/build-client-site.mjs --client=clients/salon-eleonore.json')
  process.exit(1)
}

const clientPath = path.resolve(ROOT, clientFile)
if (!fs.existsSync(clientPath)) {
  console.error(`❌ Client file not found: ${clientPath}`)
  process.exit(1)
}

const client   = JSON.parse(fs.readFileSync(clientPath, 'utf8'))
const template = args.template || client.style || 'moderne'

console.log(`\n🚀 Building site for: ${client.salonName}`)
console.log(`   Template: ${template}`)
console.log(`   Domain:   ${client.domain || '[not set]'}\n`)

// ── Slug ──────────────────────────────────────────────────────────────────────
const slug = client.salonName
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

// ── Output dir ────────────────────────────────────────────────────────────────
const outDir = path.join(ROOT, 'client-sites', slug)
if (fs.existsSync(outDir)) {
  console.log(`⚠️  Output dir already exists: ${outDir}`)
  console.log('   Remove it first if you want to regenerate.\n')
  process.exit(1)
}
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(path.join(outDir, 'app'), { recursive: true })
fs.mkdirSync(path.join(outDir, 'public'), { recursive: true })

// ── Color palettes ────────────────────────────────────────────────────────────
const PALETTES = {
  rose:    { bg: '#fff0f3', dark: '#1a0008', accent: '#e11d48', accentLight: '#fda4af', btn: 'from-rose-600 to-pink-600' },
  gold:    { bg: '#0a0a0a', dark: '#0a0a0a', accent: '#d4a847', accentLight: '#f5e6a3', btn: 'from-yellow-600 to-amber-600' },
  sage:    { bg: '#f0fdf4', dark: '#052e16', accent: '#16a34a', accentLight: '#bbf7d0', btn: 'from-green-600 to-emerald-600' },
  violet:  { bg: '#faf5ff', dark: '#2e1065', accent: '#7c3aed', accentLight: '#ddd6fe', btn: 'from-violet-600 to-purple-600' },
  nude:    { bg: '#fdf8f0', dark: '#1a0f00', accent: '#c2956c', accentLight: '#f5deb3', btn: 'from-amber-700 to-orange-600' },
  custom:  { bg: '#fff',    dark: '#111',    accent: '#333',    accentLight: '#eee',    btn: 'from-gray-700 to-gray-900' },
}
const palette = PALETTES[client.palette] || PALETTES.rose

// ── WhatsApp number ───────────────────────────────────────────────────────────
const waRaw = (client.whatsapp || client.phone || '').replace(/\D/g, '').replace(/^0/, '')
const waLink = `https://wa.me/33${waRaw}`

// ── Services HTML ─────────────────────────────────────────────────────────────
const servicesArray = client.services || []
const servicesCode = servicesArray.length > 0
  ? `const SERVICES = ${JSON.stringify(servicesArray, null, 2)}`
  : `const SERVICES = [
  { name: 'Coupe & Brushing', price: 'à partir de 45€', emoji: '✂️', desc: 'Coupe personnalisée + brushing professionnel' },
  { name: 'Coloration', price: 'à partir de 65€', emoji: '🎨', desc: 'Couleur, mèches, balayage' },
  { name: 'Soin Profond', price: 'à partir de 35€', emoji: '💆‍♀️', desc: 'Masque restructurant, soin kératine' },
  { name: 'Manucure', price: 'à partir de 30€', emoji: '💅', desc: 'Pose gel, french, nail art' },
]`

// ── Reviews HTML ──────────────────────────────────────────────────────────────
const reviewsArray = client.reviews || [
  { name: 'Cliente satisfaite', text: 'Excellent salon, je recommande vivement !', rating: 5, date: 'Il y a 1 semaine' },
]
const reviewsCode = `const REVIEWS = ${JSON.stringify(reviewsArray, null, 2)}`

// ── Generate page.tsx ─────────────────────────────────────────────────────────
const pageContent = `'use client'

import { useState } from 'react'

// ── Client data ──────────────────────────────────────────────────────────────
const SALON_NAME     = ${JSON.stringify(client.salonName || 'Salon')}
const TAGLINE        = ${JSON.stringify(client.tagline || 'Beauté & Bien-être')}
const CITY           = ${JSON.stringify(client.city || '')}
const ADDRESS        = ${JSON.stringify(client.address || '')}
const PHONE          = ${JSON.stringify(client.phone || '')}
const WA_LINK        = ${JSON.stringify(waLink)}
const BOOKING_LINK   = ${JSON.stringify(client.bookingLink || '')}
const INSTAGRAM      = ${JSON.stringify(client.instagram || '')}
const GOOGLE_MAPS    = ${JSON.stringify(client.googleMaps || '')}
const GOOGLE_RATING  = ${JSON.stringify(client.googleRating || '4.9')}
const REVIEW_COUNT   = ${JSON.stringify(client.googleReviewCount || '100+')}
const ABOUT_TEXT     = ${JSON.stringify(client.aboutText || `${client.salonName} est un salon de beauté professionnel situé à ${client.city}. Notre équipe passionnée vous accueille dans un cadre chaleureux pour prendre soin de vous.`)}

${servicesCode}

${reviewsCode}

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
)

export default function SalonPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <p className="text-xl font-black text-gray-900">{SALON_NAME}</p>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-gray-900 transition">Services</a>
            <a href="#avis" className="hover:text-gray-900 transition">Avis</a>
            <a href="#contact" className="hover:text-gray-900 transition">Contact</a>
            <a
              href={BOOKING_LINK || WA_LINK}
              target="_blank" rel="noopener noreferrer"
              className="bg-gradient-to-r ${palette.btn} text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-all"
            >
              Prendre RDV
            </a>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm font-medium border-t border-gray-100 pt-4">
            <a href="#services" onClick={() => setMenuOpen(false)} className="text-gray-600">Services</a>
            <a href="#avis" onClick={() => setMenuOpen(false)} className="text-gray-600">Avis</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-gray-600">Contact</a>
            <a href={BOOKING_LINK || WA_LINK} target="_blank" rel="noopener noreferrer"
              className="bg-gradient-to-r ${palette.btn} text-white font-bold px-5 py-3 rounded-xl text-center">
              Prendre RDV
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24"
        style={{ background: 'linear-gradient(160deg, ${palette.dark} 0%, #1a0a14 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-yellow-400">★</span>
            <span className="text-white/80 text-sm">{GOOGLE_RATING}/5 · {REVIEW_COUNT} avis Google</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            {SALON_NAME}
          </h1>
          <p className="text-xl text-white/70 mb-8">{TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BOOKING_LINK || WA_LINK}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r ${palette.btn} text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              📅 Prendre rendez-vous
            </a>
            <a
              href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition"
            >
              {WA_ICON} WhatsApp
            </a>
          </div>
          <p className="text-white/40 text-sm mt-6">{ADDRESS}</p>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '${palette.accent}' }}>Nos prestations</p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-14">Nos services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s: { emoji: string; name: string; desc?: string; price: string }, i: number) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.name}</h3>
                {s.desc && <p className="text-gray-500 text-sm mb-3">{s.desc}</p>}
                <p className="font-semibold text-sm" style={{ color: '${palette.accent}' }}>{s.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={BOOKING_LINK || WA_LINK}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r ${palette.btn} text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Réserver maintenant →
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '${palette.bg}' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div
            className="h-80 rounded-3xl flex items-center justify-center text-white text-6xl shadow-2xl"
            style={{ background: 'linear-gradient(135deg, ${palette.dark} 0%, ${palette.accent} 150%)' }}
          >
            💇‍♀️
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '${palette.accent}' }}>Notre histoire</p>
            <h2 className="text-3xl font-black text-gray-900 mb-6">{SALON_NAME}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{ABOUT_TEXT}</p>
            <div className="mt-6 flex gap-6">
              {INSTAGRAM && (
                <a href={\`https://instagram.com/\${INSTAGRAM.replace('@','')}\`} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                  📸 Instagram
                </a>
              )}
              {GOOGLE_MAPS && (
                <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                  📍 Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────── */}
      <section id="avis" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '${palette.accent}' }}>Ce que disent nos clientes</p>
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-14">
            {GOOGLE_RATING} ★ · {REVIEW_COUNT} avis Google
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r: { name: string; text: string; rating: number; date?: string }, i: number) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.rating)].map((_,j) => <span key={j} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '${palette.accent}' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    {r.date && <p className="text-gray-400 text-xs">{r.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / BOOKING ─────────────────────────────────── */}
      <section id="contact" className="py-20 px-6" style={{ background: 'linear-gradient(160deg, ${palette.dark} 0%, #1a0a14 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Prenez rendez-vous</h2>
          <p className="text-white/60 mb-8">Réservez en ligne ou contactez-nous directement</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {BOOKING_LINK && (
              <a
                href={BOOKING_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r ${palette.btn} text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl hover:-translate-y-0.5 transition"
              >
                📅 Réserver en ligne
              </a>
            )}
            <a
              href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition"
            >
              {WA_ICON} WhatsApp
            </a>
            <a
              href={\`tel:\${PHONE}\`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/25 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition"
            >
              📞 Appeler
            </a>
          </div>
          <div className="text-white/40 text-sm space-y-1">
            <p>{ADDRESS}</p>
            <p>{PHONE}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-6 text-center">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} {SALON_NAME} · {CITY} ·{' '}
          Site créé par <a href="https://monsalonvip.com" className="hover:text-gray-400 transition">MonSalonVip</a>
          {' '}· livré en 24h à partir de 490€
        </p>
      </footer>

      {/* ── WA FLOAT ──────────────────────────────────────────── */}
      <a
        href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

    </div>
  )
}
`

// ── Write page.tsx ────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'app', 'page.tsx'), pageContent, 'utf8')

// ── Write layout.tsx ──────────────────────────────────────────────────────────
const layoutContent = `import type { Metadata } from 'next'
import '../../../app/globals.css'

export const metadata: Metadata = {
  title: '${client.salonName} — ${client.city}',
  description: '${client.tagline || `Salon de beauté à ${client.city}`}',
  metadataBase: new URL('https://${client.domain || `${slug}.monsalonvip.com`}'),
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
`
fs.writeFileSync(path.join(outDir, 'app', 'layout.tsx'), layoutContent, 'utf8')

// ── Write package.json ────────────────────────────────────────────────────────
const pkgContent = {
  name: slug,
  version: '1.0.0',
  private: true,
  scripts: {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
  },
  dependencies: {
    next: '^14.2.3',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  },
  devDependencies: {
    '@types/react': '^18.3.1',
    '@types/node': '^20',
    typescript: '^5',
    tailwindcss: '^3.4.1',
    autoprefixer: '^10.4.19',
    postcss: '^8.4.38',
  },
}
fs.writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(pkgContent, null, 2), 'utf8')

// ── Write next.config.js ──────────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'next.config.js'), `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
}
module.exports = nextConfig
`, 'utf8')

// ── Write tailwind.config.js ──────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'tailwind.config.js'), `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
`, 'utf8')

// ── Write tsconfig.json ───────────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'es5', lib: ['dom','dom.iterable','esnext'],
    allowJs: true, skipLibCheck: true, strict: true,
    noEmit: true, esModuleInterop: true, module: 'esnext',
    moduleResolution: 'bundler', resolveJsonModule: true,
    isolatedModules: true, jsx: 'preserve', incremental: true,
    plugins: [{ name: 'next' }],
    paths: { '@/*': ['./*'] },
  },
  include: ['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],
  exclude: ['node_modules'],
}, null, 2), 'utf8')

// ── Write globals.css ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'app', 'globals.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: system-ui, -apple-system, sans-serif; }
`, 'utf8')

// ── Write postcss.config.js ───────────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'postcss.config.js'), `module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
`, 'utf8')

// ── Write client JSON as reference ────────────────────────────────────────────
fs.writeFileSync(path.join(outDir, 'client.json'), JSON.stringify(client, null, 2), 'utf8')

// ── Done ──────────────────────────────────────────────────────────────────────
console.log(`✅ Site generated: ${outDir}`)
console.log(`\n📋 Next steps:`)
console.log(`   1. cd client-sites/${slug}`)
console.log(`   2. npm install`)
console.log(`   3. npm run dev  (preview at localhost:3000)`)
console.log(`   4. Push to GitHub → import in Vercel → deploy in 2 min`)
if (client.domain) {
  console.log(`   5. Set custom domain: ${client.domain}`)
}
console.log(`\n💬 WhatsApp to client: "${client.salonName} est en ligne 🎉 Votre site : https://${client.domain || `${slug}.vercel.app`}"`)
