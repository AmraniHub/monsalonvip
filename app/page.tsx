'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const CITIES = [
  'Paris','Lyon','Marseille','Toulouse','Bordeaux','Lille','Nantes','Strasbourg',
  'Rennes','Montpellier','Nice','Grenoble','Toulon','Saint-Étienne','Dijon',
  'Autre ville',
]

const PROBLEMS = [
  { icon: '📉', text: 'Pas de site web — vos clientes ne vous trouvent pas sur Google' },
  { icon: '😬', text: 'Site web trop vieux ou peu professionnel' },
  { icon: '⭐', text: 'Peu d\'avis Google — vous perdez face aux concurrents' },
  { icon: '📱', text: 'Site non adapté au mobile — 80% de vos clientes cherchent sur téléphone' },
]

const INCLUDED = [
  '✅ Design VIP personnalisé pour votre salon',
  '✅ Prise de rendez-vous en ligne intégrée',
  '✅ Optimisé Google (SEO local) — vos clientes vous trouvent',
  '✅ 100% mobile — parfait sur iPhone et Android',
  '✅ Vos services, tarifs et galerie photos',
  '✅ Bouton WhatsApp pour être contactée facilement',
  '✅ Hébergement inclus la 1ère année',
  '✅ Support WhatsApp après livraison',
]

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', phone: '', salon: '', city: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.salon || !form.city) {
      setError('Merci de remplir tous les champs.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-rose-950 flex items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #1a0008 0%, #2d0018 100%)' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💅</div>
          <h1 className="text-3xl font-black text-white mb-3">Parfait, {form.name} !</h1>
          <p className="text-pink-200 text-lg mb-2">
            Votre demande pour <span className="text-white font-bold">{form.salon}</span> a bien été reçue.
          </p>
          <p className="text-pink-300 mb-8">
            On vous rappelle au <span className="text-white font-semibold">{form.phone}</span> dans les <span className="text-yellow-300 font-bold">24 heures</span> avec votre devis personnalisé.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left space-y-4 mb-8">
            <p className="text-white font-semibold">🚀 La suite :</p>
            {[
              'On prépare une maquette de votre site avec les couleurs de votre salon',
              'Vous recevez un devis précis — prix fixe, pas de surprise',
              'Dès validation, votre site est en ligne en 24h',
            ].map((s, i) => (
              <div key={i} className="flex gap-3 text-sm text-pink-200">
                <span className="text-yellow-300 font-bold shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <Link
            href="/demo"
            className="inline-block bg-white text-rose-700 font-bold px-8 py-3 rounded-xl hover:bg-pink-50 transition text-sm"
          >
            Voir un exemple de site salon →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div className="bg-rose-700 text-white text-center text-sm py-2.5 px-4 font-medium">
        💅 Site web pour salon de beauté — livré en <strong>24h</strong> à partir de <strong>490€</strong>
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        className="px-6 pt-14 pb-16 text-center"
        style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #fff 60%)' }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Spécialiste sites web pour salons — France, Belgique, Suisse & Monaco
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 max-w-2xl mx-auto">
          Votre salon mérite un site
          <span className="text-gradient-rose"> VIP</span>
          <br />livré en <span className="text-gradient-rose">24 heures</span>
        </h1>

        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Pendant que vos concurrentes ont un site pro, vos clientes les choisissent sur Google.
          On règle ça en 24h — à partir de <strong className="text-gray-800">490€</strong>.
        </p>

        <button
          onClick={scrollToForm}
          className="btn-rose text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-lg mb-4"
        >
          💅 Je veux mon site VIP →
        </button>

        <p className="text-gray-400 text-sm">
          Devis gratuit · Réponse en 24h · Sans engagement
        </p>

        {/* Social proof */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {['💇‍♀️','💅','💆‍♀️','✂️','🌸'].map((e, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-sm shadow">{e}</div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            <span className="text-gray-800 font-bold">+50 salons</span> ont déjà leur site VIP
          </p>
        </div>
      </section>

      {/* ── PROBLEM SECTION ─────────────────────────────────────── */}
      <section className="bg-gray-950 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-2">Le problème</p>
          <h2 className="text-center text-2xl md:text-3xl font-black text-white mb-10">
            Sans site pro, vous perdez des clientes chaque jour
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PROBLEMS.map(p => (
              <div key={p.text} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 items-start">
                <span className="text-2xl">{p.icon}</span>
                <p className="text-gray-300 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO PREVIEW ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Exemple concret</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Voici ce qu'on livre en 24h
          </h2>
          <p className="text-gray-500 mb-8">Un vrai site pour un salon — professionnel, moderne, sur mobile.</p>

          {/* Demo preview card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 max-w-2xl mx-auto">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-700 rounded-lg px-4 py-1 text-gray-400 text-xs text-center">
                monsalonvip.com/demo
              </div>
            </div>
            <div
              className="h-64 flex items-center justify-center text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #9f1239 0%, #1a0008 100%)' }}
            >
              <div className="text-center z-10">
                <div className="text-4xl mb-2">🌸</div>
                <p className="text-2xl font-black mb-1">Salon Éléonore</p>
                <p className="text-pink-200 text-sm mb-4">Coiffure · Soin · Beauté · Paris 16e</p>
                <div className="inline-flex bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm gap-2 items-center">
                  <span>⭐ 4.9</span>
                  <span className="text-white/40">·</span>
                  <span>127 avis</span>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fda4af 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d4a847 0%, transparent 40%)' }} />
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600 text-sm mb-4">Design, réservation en ligne, galerie, tarifs, avis Google — tout inclus.</p>
              <Link
                href="/demo"
                className="inline-block btn-rose text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
              >
                Voir le site complet →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ─────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Tout inclus</p>
          <h2 className="text-center text-2xl md:text-3xl font-black text-gray-900 mb-10">
            Ce que vous obtenez pour 490€
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {INCLUDED.map(item => (
              <div key={item} className="flex items-start gap-3 bg-rose-50 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #fff 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Simple & rapide</p>
          <h2 className="text-center text-2xl md:text-3xl font-black text-gray-900 mb-12">
            Votre site en 3 étapes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '1', emoji: '📝', title: 'Remplissez le formulaire', desc: 'Prénom, téléphone, nom du salon. 30 secondes.', tag: 'Maintenant' },
              { n: '2', emoji: '🎨', title: 'On prépare votre site', desc: 'Maquette + devis personnalisé envoyés dans les 24h.', tag: 'Dans 24h' },
              { n: '3', emoji: '🚀', title: 'Votre site est en ligne', desc: 'Dès validation, livraison en 24h. Vous recevez tous les accès.', tag: 'Sous 48h max' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg shadow-rose-200">
                  {s.n}
                </div>
                <p className="text-rose-500 text-xs font-semibold uppercase tracking-wider mb-2">{s.tag}</p>
                <div className="text-2xl mb-2">{s.emoji}</div>
                <h3 className="text-gray-900 font-bold mb-2 text-sm">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-950" id="devis" ref={formRef}>
        <div className="max-w-md mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-2">Devis gratuit</p>
          <h2 className="text-center text-2xl md:text-3xl font-black text-white mb-2">
            Votre site VIP en 24h
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">Sans engagement · Réponse garantie sous 24h</p>

          <div className="bg-gray-900 border border-gray-700/50 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Votre prénom *</label>
                <input
                  type="text" required placeholder="Sophie"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom de votre salon *</label>
                <input
                  type="text" required placeholder="Salon Éléonore"
                  value={form.salon} onChange={e => setForm({ ...form, salon: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Votre ville *</label>
                <select
                  required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition cursor-pointer"
                >
                  <option value="">Sélectionnez votre ville...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Votre téléphone *</label>
                <input
                  type="tel" required placeholder="06 12 34 56 78"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full btn-rose text-white font-bold py-4 rounded-xl text-base shadow-lg disabled:opacity-60"
              >
                {loading ? 'Envoi...' : '💅 Je veux mon site VIP →'}
              </button>

              <p className="text-center text-gray-600 text-xs">
                🔒 Données confidentielles · Aucun spam · Pas d'engagement
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center">
            <p className="text-4xl mb-4">⭐⭐⭐⭐⭐</p>
            <p className="text-gray-800 text-lg font-medium italic leading-relaxed mb-6">
              "Mon site a été livré en moins de 24h. Mes clientes peuvent maintenant prendre rendez-vous directement en ligne. En 2 semaines j'ai eu 8 nouvelles clientes via Google. C'est exactement ce dont j'avais besoin."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm">N</div>
              <div className="text-left">
                <p className="text-gray-900 font-semibold text-sm">Nadia B.</p>
                <p className="text-gray-500 text-xs">Gérante · Salon Nadia Beauté · Lyon 🇫🇷</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #9f1239 0%, #1a0008 100%)' }}
      >
        <div className="text-4xl mb-4">🌸</div>
        <h2 className="text-3xl font-black text-white mb-3">
          Votre salon mérite mieux
        </h2>
        <p className="text-pink-200 text-lg mb-8 max-w-md mx-auto">
          Devis gratuit · Site livré en 24h · À partir de 490€
        </p>
        <button
          onClick={scrollToForm}
          className="bg-white text-rose-700 font-black px-10 py-4 rounded-2xl text-lg hover:bg-rose-50 transition shadow-xl hover:scale-105"
        >
          Obtenir mon devis gratuit →
        </button>
      </section>

      {/* ── OFFRES / PRICING ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-wider mb-2">Nos formules</p>
          <h2 className="text-center text-3xl font-black text-white mb-3">Choisissez votre offre</h2>
          <p className="text-center text-gray-500 mb-12">Tout commence par votre site — le reste suit.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Site Web',
                price: '490€',
                sub: 'paiement unique',
                badge: '',
                color: 'border-gray-700',
                features: ['Site vitrine 5 pages','Design personnalisé','RDV en ligne intégré','SEO local inclus','Livré en 24h','Hébergement 1 an inclus'],
                cta: 'Démarrer →',
                href: '/intake',
              },
              {
                name: 'Site + Maintenance',
                price: '490€',
                sub: '+ 49€/mois',
                badge: '⭐ Recommandé',
                color: 'border-rose-600',
                features: ['Tout du plan Site Web','Mises à jour illimitées','Hébergement inclus à vie','Rapport SEO mensuel','Support prioritaire WhatsApp','Backup automatique'],
                cta: 'Choisir cette formule →',
                href: '/intake',
              },
              {
                name: 'Site + Pub Meta',
                price: '490€',
                sub: '+ 99€/mois + budget pub',
                badge: '🚀 Maximum clients',
                color: 'border-violet-600',
                features: ['Tout du plan Maintenance','Campagne Meta Ads gérée','Ciblage local précis','Rapport leads mensuel','Pixel Meta installé','Optimisation continue'],
                cta: 'Booster mon salon →',
                href: '/intake',
              },
            ].map(plan => (
              <div key={plan.name} className={`bg-gray-900 border-2 ${plan.color} rounded-2xl p-6 flex flex-col`}>
                {plan.badge && (
                  <div className="mb-3">
                    <span className="bg-rose-600/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-600/30">{plan.badge}</span>
                  </div>
                )}
                <h3 className="text-white font-black text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">{plan.sub}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-rose-500 shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className="w-full text-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-sm transition">
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP FLOAT ──────────────────────────────────────── */}
      <a
        href="https://wa.me/212627716149?text=Bonjour%2C%20je%20voudrais%20un%20site%20pour%20mon%20salon%20%F0%9F%92%85"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-2xl shadow-green-900/50 transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-6 text-center">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} MonSalonVip · Propulsé par Lightsofter ·{' '}
          <a href="https://lightsofter.vercel.app/mentions-legales" className="hover:text-gray-400 transition">Mentions légales</a>
          {' · '}
          <a href="https://lightsofter.vercel.app/politique-confidentialite" className="hover:text-gray-400 transition">Confidentialité</a>
        </p>
      </footer>

    </div>
  )
}
