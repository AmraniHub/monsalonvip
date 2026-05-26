'use client'

import { useState } from 'react'
import Link from 'next/link'

const SERVICES = [
  { name: 'Coupe & Brushing', price: 'à partir de 45€', desc: 'Coupe personnalisée + brushing professionnel', emoji: '✂️' },
  { name: 'Coloration', price: 'à partir de 65€', desc: 'Couleur, mèches, balayage — tous styles', emoji: '🎨' },
  { name: 'Soin Profond', price: 'à partir de 35€', desc: 'Masque restructurant, soin kératine', emoji: '💆‍♀️' },
  { name: 'Lissage Brésilien', price: 'à partir de 120€', desc: 'Lissage longue durée jusqu\'à 6 mois', emoji: '✨' },
  { name: 'Manucure', price: 'à partir de 30€', desc: 'Pose gel, french, nail art', emoji: '💅' },
  { name: 'Maquillage', price: 'à partir de 55€', desc: 'Maquillage jour, soirée, mariée', emoji: '💄' },
]

const REVIEWS = [
  { name: 'Camille D.', note: 5, text: 'Éléonore est une magicienne ! Résultat parfait, exactement ce que je voulais. Je reviens chaque mois.', date: 'Il y a 3 jours' },
  { name: 'Sarah M.', note: 5, text: 'Accueil chaleureux, salon magnifique, résultat au top. Merci pour le soin kératine, mes cheveux n\'ont jamais été aussi beaux.', date: 'Il y a 1 semaine' },
  { name: 'Laetitia R.', note: 5, text: 'Je suis venue pour une coloration complète. C\'est exactement la couleur que j\'avais en tête. Professionnalisme impeccable.', date: 'Il y a 2 semaines' },
]

export default function DemoSalon() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── DEMO BANNER ─────────────────────────────────────── */}
      <div className="bg-gray-900 text-white text-center text-xs py-2 px-4">
        🎯 Ceci est un <strong>exemple de site</strong> créé par MonSalonVip ·{' '}
        <Link href="/" className="text-rose-400 underline font-semibold">Créer le site de votre salon →</Link>
      </div>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-rose-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <div>
              <p className="font-black text-gray-900 text-lg leading-none">Salon Éléonore</p>
              <p className="text-rose-500 text-xs">Coiffure · Beauté · Paris 16e</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-rose-600 transition">Services</a>
            <a href="#galerie" className="hover:text-rose-600 transition">Galerie</a>
            <a href="#avis" className="hover:text-rose-600 transition">Avis</a>
            <a href="#contact" className="hover:text-rose-600 transition">Contact</a>
            <button
              onClick={() => setBookingOpen(true)}
              className="btn-rose text-white px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              Prendre RDV
            </button>
          </div>
          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-rose-100 pt-3 space-y-2">
            {['Services','Galerie','Avis','Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:text-rose-600 text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setBookingOpen(true); setMenuOpen(false) }}
              className="btn-rose text-white px-5 py-2.5 rounded-xl text-sm font-bold w-full mt-2">
              Prendre RDV
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        className="relative px-6 py-20 md:py-32 text-center text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #9f1239 0%, #4a0020 50%, #1a0008 100%)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fda4af 0%, transparent 50%), radial-gradient(circle at 70% 30%, #d4a847 0%, transparent 40%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-pink-200 text-sm mb-6">
            <span>⭐⭐⭐⭐⭐</span>
            <span>4.9 · 127 avis Google</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Salon Éléonore
          </h1>
          <p className="text-pink-200 text-xl mb-2">Coiffure · Soin · Beauté</p>
          <p className="text-pink-300 text-sm mb-10">15 rue de Passy, Paris 16e · Ouvert 7j/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setBookingOpen(true)}
              className="bg-white text-rose-700 font-black px-8 py-4 rounded-2xl text-lg hover:bg-rose-50 transition shadow-xl"
            >
              💅 Prendre rendez-vous
            </button>
            <a href="https://wa.me/33600000000" target="_blank" rel="noopener"
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition flex items-center justify-center gap-2">
              <span>💬</span> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="bg-rose-700 py-6 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-2xl font-black">127</p>
            <p className="text-pink-200 text-xs">Avis Google</p>
          </div>
          <div className="border-x border-white/20">
            <p className="text-2xl font-black">4.9 ⭐</p>
            <p className="text-pink-200 text-xs">Note moyenne</p>
          </div>
          <div>
            <p className="text-2xl font-black">8 ans</p>
            <p className="text-pink-200 text-xs">D'expérience</p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────── */}
      <section id="services" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Nos prestations</p>
          <h2 className="text-center text-3xl font-black text-gray-900 mb-10">Nos services</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map(s => (
              <div key={s.name} className="bg-rose-50 border border-rose-100 rounded-2xl p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300 group">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                <p className="text-rose-600 font-bold text-sm">{s.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => setBookingOpen(true)}
              className="btn-rose text-white font-bold px-8 py-4 rounded-2xl text-base">
              Réserver maintenant →
            </button>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="galerie" className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Nos créations</p>
          <h2 className="text-center text-3xl font-black text-gray-900 mb-10">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { bg: 'linear-gradient(135deg, #fda4af, #e11d48)', label: 'Coloration' },
              { bg: 'linear-gradient(135deg, #d4a847, #92400e)', label: 'Balayage doré' },
              { bg: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', label: 'Couleur fantasy' },
              { bg: 'linear-gradient(135deg, #6b7280, #111827)', label: 'Coupe courte' },
              { bg: 'linear-gradient(135deg, #fca5a5, #b91c1c)', label: 'Brushing' },
              { bg: 'linear-gradient(135deg, #86efac, #15803d)', label: 'Soin kératine' },
            ].map((g, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer">
                <div className="w-full h-full" style={{ background: g.bg }} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <p className="text-white font-semibold text-sm">{g.label}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            📸 Retrouvez toutes nos créations sur{' '}
            <a href="#" className="text-rose-500 underline">@saloneleonore</a>
          </p>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────── */}
      <section id="avis" className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Ce qu'elles disent</p>
          <h2 className="text-center text-3xl font-black text-gray-900 mb-3">Avis clients</h2>
          <p className="text-center text-gray-500 text-sm mb-10">⭐ 4.9/5 · 127 avis Google</p>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map(r => (
              <div key={r.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.date}</p>
                  </div>
                </div>
                <p className="text-yellow-400 text-sm mb-3">{'⭐'.repeat(r.note)}</p>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <section id="contact" className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #fff0f3, #fff)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-rose-500 text-sm font-semibold uppercase tracking-widest mb-2">Venir nous voir</p>
          <h2 className="text-center text-3xl font-black text-gray-900 mb-10">Nous trouver</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              {[
                { icon: '📍', title: 'Adresse', val: '15 rue de Passy\n75016 Paris' },
                { icon: '📞', title: 'Téléphone', val: '01 45 XX XX XX' },
                { icon: '🕐', title: 'Horaires', val: 'Lun–Sam : 9h–19h\nDim : 10h–17h' },
                { icon: '📱', title: 'Instagram', val: '@saloneleonore' },
              ].map(c => (
                <div key={c.title} className="flex gap-4">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 rounded-2xl h-52 flex items-center justify-center text-gray-400 text-sm">
              📍 Carte Google Maps
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 text-center bg-rose-700">
        <h2 className="text-3xl font-black text-white mb-3">Prête pour votre transformation ?</h2>
        <p className="text-pink-200 mb-8">Prenez rendez-vous en ligne — c'est rapide et gratuit</p>
        <button onClick={() => setBookingOpen(true)}
          className="bg-white text-rose-700 font-black px-10 py-4 rounded-2xl text-lg hover:bg-rose-50 transition shadow-xl">
          Réserver maintenant →
        </button>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-6 px-6 text-center border-t border-gray-800">
        <p className="text-gray-600 text-xs mb-2">© {new Date().getFullYear()} Salon Éléonore · Paris 16e</p>
        <p className="text-gray-700 text-xs">
          Site créé par <a href="/" className="text-rose-400 hover:text-rose-300 transition">MonSalonVip</a> ·{' '}
          Site livré en 24h à partir de 490€
        </p>
      </footer>

      {/* ── WHATSAPP BUTTON ─────────────────────────────────── */}
      <a href="https://wa.me/33600000000" target="_blank" rel="noopener"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 text-2xl">
        💬
      </a>

      {/* ── BOOKING MODAL ───────────────────────────────────── */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setBookingOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Prendre RDV</h3>
              <button onClick={() => setBookingOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center mb-4">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-gray-700 text-sm font-medium mb-1">Système de réservation en ligne</p>
              <p className="text-gray-400 text-xs">Planity · Treatwell · ou appel direct</p>
            </div>
            <a href="tel:0145000000"
              className="btn-rose text-white font-bold py-3 rounded-xl w-full text-sm block text-center">
              📞 Appeler le salon
            </a>
            <p className="text-center text-gray-400 text-xs mt-3">
              ⚡ Ce site est une démo MonSalonVip
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
