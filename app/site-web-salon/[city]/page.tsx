import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const CITIES: Record<string, {
  name: string; region: string; country: string; flag: string
  lat: string; lng: string; intro: string
  testimonial: { name: string; role: string; text: string }
}> = {
  paris: {
    name: 'Paris', region: 'Île-de-France', country: 'FR', flag: '🇫🇷',
    lat: '48.8566', lng: '2.3522',
    intro: 'Paris compte des milliers de salons de beauté. Démarquez-vous avec un site web professionnel livré en 24h à partir de 490€ — réservation en ligne incluse.',
    testimonial: { name: 'Amina K.', role: 'Salon de coiffure, Paris 18e', text: 'Mon site est magnifique et mes clientes réservent directement en ligne. Livré en 24h !' },
  },
  lyon: {
    name: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'FR', flag: '🇫🇷',
    lat: '45.7640', lng: '4.8357',
    intro: 'Votre salon à Lyon mérite une vitrine digitale. Nous créons des sites web professionnels pour salons de beauté lyonnais — livrés en 24h, à partir de 490€.',
    testimonial: { name: 'Fatima O.', role: 'Esthéticienne, Lyon 7e', text: 'Mes rendez-vous en ligne ont triplé depuis le lancement de mon site. Merci !' },
  },
  marseille: {
    name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', country: 'FR', flag: '🇫🇷',
    lat: '43.2965', lng: '5.3698',
    intro: 'Marseille vibre. Votre salon aussi. Sites web pour salons de beauté marseillais livrés en 24h — design professionnel, réservation en ligne, 490€ tout inclus.',
    testimonial: { name: 'Nadia B.', role: 'Onglerie, Marseille', text: 'Avant j\'avais aucun site. Maintenant mes clients me trouvent sur Google.' },
  },
  bordeaux: {
    name: 'Bordeaux', region: 'Nouvelle-Aquitaine', country: 'FR', flag: '🇫🇷',
    lat: '44.8378', lng: '-0.5792',
    intro: 'Bordeaux attire. Votre salon aussi. Site web professionnel pour salons de beauté bordelais — livré en 24h, réservation en ligne, à partir de 490€.',
    testimonial: { name: 'Léa P.', role: 'Coiffeuse, Bordeaux', text: 'Mon site reflète parfaitement l\'ambiance de mon salon. Clientes ravies !' },
  },
  nice: {
    name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', country: 'FR', flag: '🇫🇷',
    lat: '43.7102', lng: '7.2620',
    intro: 'Sur la Côte d\'Azur, la clientèle est exigeante. Donnez à votre salon un site à la hauteur — design premium, livraison 24h, à partir de 490€.',
    testimonial: { name: 'Marine C.', role: 'Institut beauté, Nice', text: 'Un site digne de notre clientèle haut de gamme. Livré en un jour !' },
  },
  toulouse: {
    name: 'Toulouse', region: 'Occitanie', country: 'FR', flag: '🇫🇷',
    lat: '43.6047', lng: '1.4442',
    intro: 'Toulouse grandit. Votre salon aussi. Sites web professionnels pour salons de beauté toulousains — réservation en ligne, livraison 24h, 490€.',
    testimonial: { name: 'Sara M.', role: 'Salon afro, Toulouse', text: 'Mes clientes aiment pouvoir réserver directement depuis mon site.' },
  },
  lille: {
    name: 'Lille', region: 'Hauts-de-France', country: 'FR', flag: '🇫🇷',
    lat: '50.6292', lng: '3.0573',
    intro: 'Lille, métropole dynamique. Votre salon mérite le meilleur. Site web professionnel livré en 24h — réservation en ligne, design personnalisé, 490€.',
    testimonial: { name: 'Yasmine L.', role: 'Nail art, Lille', text: 'Toutes mes collègues esthéticiennes me demandent où j\'ai fait mon site !' },
  },
  bruxelles: {
    name: 'Bruxelles', region: 'Bruxelles-Capitale', country: 'BE', flag: '🇧🇪',
    lat: '50.8503', lng: '4.3517',
    intro: 'Bruxelles, ville internationale. Votre salon de beauté bruxellois mérite un site professionnel — livré en 24h, réservation en ligne, à partir de 490€.',
    testimonial: { name: 'Dounia A.', role: 'Hammam & Spa, Bruxelles', text: 'Notre site a changé la façon dont nos clientes nous contactent. Excellent service.' },
  },
  geneve: {
    name: 'Genève', region: 'Canton de Genève', country: 'CH', flag: '🇨🇭',
    lat: '46.2044', lng: '6.1432',
    intro: 'Genève exige l\'excellence. Sites web premium pour salons de beauté genevois — livraison 24h, design haut de gamme, réservation en ligne, à partir de 490€.',
    testimonial: { name: 'Elena M.', role: 'Institut beauté, Genève', text: 'Site premium parfait pour notre clientèle genevoise. Livré en 24h !' },
  },
  monaco: {
    name: 'Monaco', region: 'Principauté de Monaco', country: 'MC', flag: '🇲🇨',
    lat: '43.7384', lng: '7.4246',
    intro: 'Monaco, synonyme d\'élégance. Votre salon mérite un site à la hauteur — design luxe, livraison 24h, réservation en ligne, à partir de 490€.',
    testimonial: { name: 'Sophie L.', role: 'Salon luxe, Monaco', text: 'Exactement l\'image que je voulais pour mon salon. Parfait.' },
  },
}

export function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }))
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = CITIES[params.city]
  if (!city) return {}
  return {
    title: `Site web salon de beauté ${city.name} — Livré en 24h à partir de 490€ | MonSalonVip`,
    description: `Créez le site web de votre salon de beauté à ${city.name} en 24h à partir de 490€. Design professionnel, réservation en ligne, SEO local. Devis gratuit.`,
    keywords: `site web salon beauté ${city.name}, création site salon coiffure ${city.name}, site internet salon esthétique ${city.name}`,
    alternates: { canonical: `https://monsalonvip.com/site-web-salon/${params.city}` },
    other: {
      'geo.region':    city.country,
      'geo.placename': city.name,
      'geo.position':  `${city.lat};${city.lng}`,
      'ICBM':          `${city.lat}, ${city.lng}`,
    },
  }
}

export default function SalonCityPage({ params }: { params: { city: string } }) {
  const city = CITIES[params.city]
  if (!city) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `MonSalonVip — Sites web salons de beauté ${city.name}`,
    description: `Création de sites web pour salons de beauté à ${city.name}`,
    url: `https://monsalonvip.com/site-web-salon/${params.city}`,
    telephone: '+212627716149',
    areaServed: { '@type': 'City', name: city.name },
    priceRange: '€€',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="min-h-screen bg-gray-950 text-white">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-900/30 border border-rose-700/30 rounded-full px-4 py-1.5 text-rose-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {city.flag} Disponible à {city.name}
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
            Site web pour votre salon<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              à {city.name} — livré en 24h
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {city.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake"
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-rose-900/30">
              Créer mon site — 490€ →
            </Link>
            <a href="https://wa.me/212627716149"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition">
              Devis gratuit WhatsApp
            </a>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-black text-center mb-8">Ce qui est inclus dans votre site</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '💅', title: 'Design personnalisé', desc: `Palette de couleurs, style et identité adaptés à votre salon à ${city.name}.` },
              { icon: '📅', title: 'Réservation en ligne', desc: 'Planity, Calendly ou lien WhatsApp intégré pour que vos clientes réservent 24h/24.' },
              { icon: '📍', title: 'SEO local', desc: `Votre salon apparaît sur Google quand on cherche "salon de beauté ${city.name}".` },
            ].map(f => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIAL ──────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-gray-300 text-lg italic mb-4">&ldquo;{city.testimonial.text}&rdquo;</p>
            <p className="text-white font-bold">{city.testimonial.name}</p>
            <p className="text-gray-500 text-sm">{city.testimonial.role}</p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-black text-center mb-8">Questions — {city.name}</h2>
          <div className="space-y-4">
            {[
              { q: `Combien coûte un site web pour salon à ${city.name} ?`, a: `À partir de 490€ tout inclus — design, hébergement 1 an, SEO local optimisé pour ${city.name}. Prix fixe, sans surprise.` },
              { q: `Mon site sera-t-il visible sur Google à ${city.name} ?`, a: `Oui. Chaque site MonSalonVip est optimisé pour les recherches locales : "salon de beauté ${city.name}", "coiffure ${city.name}", etc.` },
              { q: `Puis-je avoir la réservation en ligne ?`, a: `Oui. On intègre votre système de RDV existant (Planity, Calendly, Doctolib) ou un lien WhatsApp direct.` },
            ].map(faq => (
              <div key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/20 border border-rose-800/30 rounded-3xl p-10">
            <h2 className="text-3xl font-black mb-3">Votre salon à {city.name} mérite mieux</h2>
            <p className="text-gray-400 mb-6">Site professionnel livré en 24h. 490€ tout inclus. Satisfait ou remboursé.</p>
            <Link href="/intake"
              className="inline-block bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black px-10 py-4 rounded-xl text-base transition shadow-lg shadow-rose-900/30">
              Démarrer pour 490€ →
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
