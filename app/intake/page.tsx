'use client'

import { useState } from 'react'

// ── Color palettes a salon can pick from ──────────────────────────────────────
const PALETTES = [
  { id: 'rose',    label: 'Rose Parisien',  bg: '#fdf2f8', accent: '#e11d48', preview: ['#e11d48','#f9a8d4','#1a0008'] },
  { id: 'gold',    label: 'Or & Noir',      bg: '#0a0a0a', accent: '#d4a847', preview: ['#d4a847','#f5e6a3','#0a0a0a'] },
  { id: 'sage',    label: 'Naturel & Vert', bg: '#f0fdf4', accent: '#16a34a', preview: ['#16a34a','#bbf7d0','#052e16'] },
  { id: 'violet',  label: 'Violet Luxe',   bg: '#faf5ff', accent: '#7c3aed', preview: ['#7c3aed','#ddd6fe','#2e1065'] },
  { id: 'nude',    label: 'Nude & Beige',  bg: '#fdf8f0', accent: '#c2956c', preview: ['#c2956c','#f5deb3','#1a0f00'] },
  { id: 'custom',  label: 'J\'ai mes couleurs', bg: '#f8fafc', accent: '#64748b', preview: ['#94a3b8','#cbd5e1','#0f172a'] },
]

const BOOKING_OPTIONS = [
  { id: 'none',      label: 'Non — les clientes m\'appellent / WhatsApp' },
  { id: 'planity',   label: 'Oui — j\'utilise Planity' },
  { id: 'calendly',  label: 'Oui — j\'utilise Calendly' },
  { id: 'doctolib',  label: 'Oui — j\'utilise Doctolib' },
  { id: 'other',     label: 'Oui — autre système (je précise ci-dessous)' },
]

const SECTORS = [
  'Coiffure',
  'Esthétique / Soin visage & corps',
  'Onglerie / Nail art',
  'Coiffure + Esthétique (mixte)',
  'Barbier',
  'Maquillage & Coiffure mariée',
  'Hammam & Spa',
  'Autre',
]

interface ServiceRow { name: string; price: string }

interface FormData {
  // Identity
  ownerName: string
  salonName: string
  tagline: string
  sector: string
  city: string
  address: string
  phone: string
  whatsapp: string
  email: string
  // Online
  googleMaps: string
  instagram: string
  facebook: string
  tiktok: string
  // Style
  palette: string
  customColors: string
  style: string
  // Services
  services: ServiceRow[]
  // Booking
  booking: string
  bookingLink: string
  bookingNote: string
  // Content
  aboutText: string
  hasPhotos: string
  photoNote: string
  hasLogo: string
  // Extras
  openingHours: string
  extraNote: string
}

const EMPTY_FORM: FormData = {
  ownerName: '', salonName: '', tagline: '', sector: '', city: '', address: '',
  phone: '', whatsapp: '', email: '',
  googleMaps: '', instagram: '', facebook: '', tiktok: '',
  palette: '', customColors: '', style: '',
  services: [
    { name: '', price: '' },
    { name: '', price: '' },
    { name: '', price: '' },
  ],
  booking: '', bookingLink: '', bookingNote: '',
  aboutText: '', hasPhotos: '', photoNote: '', hasLogo: '',
  openingHours: '', extraNote: '',
}

export default function IntakePage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const TOTAL_STEPS = 5

  function set(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function setService(i: number, field: 'name' | 'price', value: string) {
    setForm(prev => {
      const s = [...prev.services]
      s[i] = { ...s[i], [field]: value }
      return { ...prev, services: s }
    })
  }

  function addService() {
    setForm(prev => ({ ...prev, services: [...prev.services, { name: '', price: '' }] }))
  }

  function removeService(i: number) {
    setForm(prev => ({ ...prev, services: prev.services.filter((_, idx) => idx !== i) }))
  }

  function nextStep() {
    setError('')
    // Validation per step
    if (step === 1) {
      if (!form.ownerName || !form.salonName || !form.phone || !form.city) {
        setError('Merci de remplir les champs obligatoires (*).')
        return
      }
    }
    if (step === 3) {
      if (!form.palette) {
        setError('Merci de choisir une palette de couleurs.')
        return
      }
    }
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prevStep() {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          services: JSON.stringify(form.services.filter(s => s.name)),
          submittedAt: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        }),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Submitted ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #1a0008 0%, #2d0018 100%)' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-3xl font-black text-white mb-3">Parfait, {form.ownerName} !</h1>
          <p className="text-pink-200 text-lg mb-6">
            On a reçu toutes les infos pour <span className="text-white font-bold">{form.salonName}</span>.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left space-y-4 mb-8">
            <p className="text-white font-semibold">🗓️ Ce qui se passe maintenant :</p>
            {[
              'Notre designer prépare votre maquette avec votre palette choisie',
              'Vous recevez un aperçu du design dans les 4 heures',
              'Dès votre validation — site en ligne en 24h',
            ].map((s, i) => (
              <div key={i} className="flex gap-3 text-sm text-pink-200">
                <span className="text-yellow-300 font-bold shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            Une question ? WhatsApp:{' '}
            <a href="https://wa.me/212627716149" className="text-white underline">+212 627 716 149</a>
          </p>
        </div>
      </div>
    )
  }

  // ── Step indicator ────────────────────────────────────────────────────────────
  const stepLabels = ['Votre salon', 'Vos services', 'Design', 'Contenu', 'Résumé']

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">

      {/* Header */}
      <div className="bg-rose-900/30 border-b border-rose-800/30 py-4 px-6 text-center">
        <p className="text-rose-300 text-sm font-semibold">💅 MonSalonVip · Formulaire de création de site</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i + 1 < step  ? 'bg-rose-600 border-rose-600 text-white' :
                  i + 1 === step ? 'bg-transparent border-rose-500 text-rose-400' :
                  'bg-transparent border-gray-700 text-gray-600'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-rose-400' : 'text-gray-600'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* ── STEP 1 — Identity ───────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Votre salon 💇‍♀️</h2>
              <p className="text-gray-400 text-sm">Les informations de base pour identifier votre activité.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Votre prénom *" placeholder="Sophie" value={form.ownerName} onChange={v => set('ownerName', v)} />
              <Field label="Nom du salon *" placeholder="Salon Éléonore" value={form.salonName} onChange={v => set('salonName', v)} />
            </div>

            <Field label="Slogan / tagline (optionnel)" placeholder="Ex : Beauté & Bien-être au cœur de Paris" value={form.tagline} onChange={v => set('tagline', v)} />

            <SelectField label="Type de salon *" value={form.sector} onChange={v => set('sector', v)} options={SECTORS} placeholder="Sélectionnez..." />

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Ville *" placeholder="Paris" value={form.city} onChange={v => set('city', v)} />
              <Field label="Adresse complète" placeholder="12 rue de Rivoli, 75001 Paris" value={form.address} onChange={v => set('address', v)} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Téléphone *" placeholder="06 12 34 56 78" value={form.phone} onChange={v => set('phone', v)} type="tel" />
              <Field label="WhatsApp (si différent)" placeholder="06 12 34 56 78" value={form.whatsapp} onChange={v => set('whatsapp', v)} type="tel" />
            </div>

            <Field label="Email professionnel" placeholder="contact@monsalon.fr" value={form.email} onChange={v => set('email', v)} type="email" />

            <div className="pt-2">
              <p className="text-gray-400 text-sm font-medium mb-3">Réseaux sociaux (optionnels)</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="📍 Lien Google Maps" placeholder="https://maps.google.com/..." value={form.googleMaps} onChange={v => set('googleMaps', v)} />
                <Field label="📸 Instagram" placeholder="@monsaloneleonore" value={form.instagram} onChange={v => set('instagram', v)} />
                <Field label="👤 Facebook" placeholder="https://facebook.com/..." value={form.facebook} onChange={v => set('facebook', v)} />
                <Field label="🎵 TikTok" placeholder="@monsalon" value={form.tiktok} onChange={v => set('tiktok', v)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Services ───────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Vos services & tarifs 💅</h2>
              <p className="text-gray-400 text-sm">Listez vos prestations — elles apparaîtront sur votre site.</p>
            </div>

            <div className="space-y-3">
              {form.services.map((svc, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      className={INPUT_CLS}
                      placeholder={`Service ${i + 1} (ex: Coupe femme)`}
                      value={svc.name}
                      onChange={e => setService(i, 'name', e.target.value)}
                    />
                    <input
                      className={INPUT_CLS}
                      placeholder="Prix (ex: 45€)"
                      value={svc.price}
                      onChange={e => setService(i, 'price', e.target.value)}
                    />
                  </div>
                  {form.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      className="text-gray-600 hover:text-red-400 transition text-lg leading-none flex-shrink-0"
                    >×</button>
                  )}
                </div>
              ))}
            </div>

            {form.services.length < 12 && (
              <button
                type="button" onClick={addService}
                className="text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center gap-1 transition"
              >
                + Ajouter un service
              </button>
            )}

            <div className="mt-6">
              <p className="text-gray-400 text-sm font-medium mb-3">📅 Prise de rendez-vous en ligne</p>
              <div className="space-y-2">
                {BOOKING_OPTIONS.map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:border-rose-500/50 transition">
                    <input
                      type="radio" name="booking" value={opt.id}
                      checked={form.booking === opt.id}
                      onChange={() => set('booking', opt.id)}
                      className="accent-rose-500"
                    />
                    <span className="text-gray-300 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(form.booking === 'planity' || form.booking === 'calendly' || form.booking === 'doctolib') && (
              <Field
                label={`Lien ${form.booking}`}
                placeholder={`https://${form.booking}.com/votre-salon`}
                value={form.bookingLink}
                onChange={v => set('bookingLink', v)}
              />
            )}
            {form.booking === 'other' && (
              <Field label="Précisez votre système de RDV" placeholder="Nom + lien..." value={form.bookingNote} onChange={v => set('bookingNote', v)} />
            )}

            <Field
              label="Horaires d'ouverture"
              placeholder="Lun-Sam : 9h-19h / Dim : fermé"
              value={form.openingHours}
              onChange={v => set('openingHours', v)}
            />
          </div>
        )}

        {/* ── STEP 3 — Design ─────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Le design de votre site 🎨</h2>
              <p className="text-gray-400 text-sm">Choisissez une palette — on adapte tout le site à vos couleurs.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PALETTES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set('palette', p.id)}
                  className={`rounded-2xl p-4 border-2 text-left transition-all ${
                    form.palette === p.id
                      ? 'border-rose-500 bg-rose-950/30'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex gap-1.5 mb-3">
                    {p.preview.map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-white text-xs font-semibold">{p.label}</p>
                </button>
              ))}
            </div>

            {form.palette === 'custom' && (
              <Field
                label="Décrivez vos couleurs ou partagez vos codes hex"
                placeholder="Ex: bordeaux #8B0000 + or #d4a847, ou envoyez votre charte graphique en WhatsApp"
                value={form.customColors}
                onChange={v => set('customColors', v)}
              />
            )}

            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">Style général du site</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'luxe',     label: 'Luxe & élégant',   emoji: '✨' },
                  { id: 'moderne',  label: 'Moderne & épuré',  emoji: '⚡' },
                  { id: 'naturel',  label: 'Naturel & doux',   emoji: '🌿' },
                  { id: 'colorful', label: 'Coloré & joyeux',  emoji: '🎨' },
                ].map(s => (
                  <button
                    key={s.id} type="button"
                    onClick={() => set('style', s.id)}
                    className={`rounded-xl px-4 py-3 border-2 text-left transition-all ${
                      form.style === s.id
                        ? 'border-rose-500 bg-rose-950/30 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-xl mr-2">{s.emoji}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Content ────────────────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Votre contenu 📸</h2>
              <p className="text-gray-400 text-sm">Ce qu'on va mettre sur votre site — ne vous inquiétez pas si vous n'avez pas tout.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Présentation du salon (optionnel)
              </label>
              <textarea
                rows={4}
                className={INPUT_CLS + ' resize-none'}
                placeholder="Ex: Salon Éléonore est un salon de coiffure haut de gamme situé dans le 16e arrondissement de Paris..."
                value={form.aboutText}
                onChange={e => set('aboutText', e.target.value)}
              />
              <p className="text-gray-600 text-xs mt-1">Si vous ne remplissez pas, on rédige un texte professionnel pour vous 👌</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">Avez-vous des photos de votre salon / travaux ?</p>
              <div className="space-y-2">
                {[
                  { id: 'yes-send',  label: 'Oui — je les envoie par WhatsApp après ce formulaire' },
                  { id: 'yes-later', label: 'Oui — je les envoie plus tard' },
                  { id: 'no',        label: 'Non — utilisez des photos professionnelles (stock photos)' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:border-rose-500/50 transition">
                    <input
                      type="radio" name="hasPhotos" value={opt.id}
                      checked={form.hasPhotos === opt.id}
                      onChange={() => set('hasPhotos', opt.id)}
                      className="accent-rose-500"
                    />
                    <span className="text-gray-300 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              {form.hasPhotos === 'yes-send' && (
                <div className="mt-3 bg-green-900/20 border border-green-800/30 rounded-xl p-3 text-sm text-green-300">
                  📲 Envoyez vos photos en WhatsApp à ce numéro : <strong>+212 627 716 149</strong>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-sm font-medium mb-3">Avez-vous un logo ?</p>
              <div className="space-y-2">
                {[
                  { id: 'yes-send',  label: 'Oui — je l\'envoie par WhatsApp' },
                  { id: 'yes-later', label: 'Oui — je l\'envoie plus tard' },
                  { id: 'no',        label: 'Non — créez-moi un logo simple' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:border-rose-500/50 transition">
                    <input
                      type="radio" name="hasLogo" value={opt.id}
                      checked={form.hasLogo === opt.id}
                      onChange={() => set('hasLogo', opt.id)}
                      className="accent-rose-500"
                    />
                    <span className="text-gray-300 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field
              label="Informations supplémentaires (optionnel)"
              placeholder="Ex: Je veux absolument mettre en avant nos soins kératine, éviter les couleurs trop sombres..."
              value={form.extraNote}
              onChange={v => set('extraNote', v)}
            />
          </div>
        )}

        {/* ── STEP 5 — Summary ────────────────────────────────────────────────── */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Tout est bon ? ✅</h2>
              <p className="text-gray-400 text-sm">Vérifiez vos informations avant d'envoyer.</p>
            </div>

            <div className="space-y-4">
              <SummaryBlock title="Votre salon" items={[
                ['Propriétaire', form.ownerName],
                ['Salon', form.salonName],
                ['Ville', form.city],
                ['Téléphone', form.phone],
                ['Secteur', form.sector],
                form.tagline ? ['Slogan', form.tagline] : null,
              ].filter(Boolean) as [string,string][]} />

              <SummaryBlock title="Services" items={
                form.services.filter(s => s.name).map(s => [s.name, s.price || '—'] as [string,string])
              } />

              <SummaryBlock title="Design" items={[
                ['Palette', PALETTES.find(p => p.id === form.palette)?.label || '—'],
                form.style ? ['Style', form.style] : null,
              ].filter(Boolean) as [string,string][]} />

              <SummaryBlock title="Contenu" items={[
                ['Photos', form.hasPhotos || '—'],
                ['Logo', form.hasLogo || '—'],
                ['RDV en ligne', form.booking || '—'],
              ]} />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl text-base shadow-lg disabled:opacity-60 transition"
            >
              {loading ? 'Envoi en cours...' : '🚀 Envoyer et démarrer mon site'}
            </button>

            <p className="text-center text-gray-600 text-xs">
              Vos données sont confidentielles et ne seront jamais partagées.
            </p>
          </form>
        )}

        {/* Navigation */}
        {step < TOTAL_STEPS && (
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                type="button" onClick={prevStep}
                className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-sm font-medium"
              >
                ← Précédent
              </button>
            )}
            <button
              type="button" onClick={nextStep}
              className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition text-sm shadow-lg shadow-rose-900/30"
            >
              {step === TOTAL_STEPS - 1 ? 'Vérifier →' : 'Continuer →'}
            </button>
          </div>
        )}
        {step > 1 && step === TOTAL_STEPS && (
          <button
            type="button" onClick={prevStep}
            className="mt-4 w-full py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-sm font-medium"
          >
            ← Modifier mes infos
          </button>
        )}

      </div>
    </div>
  )
}

// ── Reusable field components ─────────────────────────────────────────────────

const INPUT_CLS = 'w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition'

function Field({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className={INPUT_CLS}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className={INPUT_CLS + ' cursor-pointer'}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SummaryBlock({ title, items }: { title: string; items: [string, string][] }) {
  if (!items.length) return null
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-2">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-start gap-2 text-sm">
            <span className="text-gray-500 min-w-[100px] flex-shrink-0">{k}</span>
            <span className="text-white">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
