import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChat  = process.env.TELEGRAM_CHAT_ID
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL

    const waRaw = (body.whatsapp || body.phone || '').replace(/\D/g, '').replace(/^0/, '')

    // ── Telegram notification ─────────────────────────────────────────────────
    if (tgToken && tgChat) {
      const msg = [
        `📋 <b>INTAKE REÇU — ${body.salonName}</b>`,
        ``,
        `👤 <b>${body.ownerName}</b> · ${body.city}`,
        `📞 ${body.phone}`,
        `💼 Secteur: ${body.sector || '—'}`,
        `🎨 Palette: ${body.palette || '—'}`,
        `🖌 Style: ${body.style || '—'}`,
        `📅 Booking: ${body.booking || '—'}`,
        `📸 Photos: ${body.hasPhotos || '—'}`,
        `🖼 Logo: ${body.hasLogo || '—'}`,
        body.extraNote ? `💬 Note: ${body.extraNote}` : null,
        ``,
        waRaw
          ? `💬 <a href="https://wa.me/33${waRaw}">Ouvrir WhatsApp →</a>`
          : null,
      ].filter(Boolean).join('\n')

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: msg, parse_mode: 'HTML' }),
      })
    }

    // ── Google Sheets (CRM) ───────────────────────────────────────────────────
    if (scriptUrl) {
      // 1. Save full intake details
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addIntake',
          source: 'MonSalonVip',
          ownerName: body.ownerName,
          salonName: body.salonName,
          city: body.city,
          phone: body.phone,
          whatsapp: body.whatsapp || body.phone,
          email: body.email || '—',
          sector: body.sector || '—',
          palette: body.palette || '—',
          style: body.style || '—',
          booking: body.booking || '—',
          bookingLink: body.bookingLink || '—',
          hasPhotos: body.hasPhotos || '—',
          hasLogo: body.hasLogo || '—',
          services: body.services || '[]',
          openingHours: body.openingHours || '—',
          aboutText: body.aboutText || '—',
          extraNote: body.extraNote || '—',
          instagram: body.instagram || '—',
          googleMaps: body.googleMaps || '—',
          submittedAt: body.submittedAt || new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        }),
      })

      // 2. Auto-create a Project in CRM
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:    'addProject',
          client:    body.ownerName || '—',
          business:  body.salonName || '—',
          type:      'Site vitrine',
          status:    'Brief',
          price:     '490',
          startDate: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          dueDate:   '—',
          url:       '—',
          notes:     [
            body.sector   ? `Secteur: ${body.sector}` : null,
            body.palette  ? `Palette: ${body.palette}` : null,
            body.style    ? `Style: ${body.style}` : null,
            body.booking  ? `Booking: ${body.booking}` : null,
            body.extraNote ? `Note: ${body.extraNote}` : null,
          ].filter(Boolean).join(' | ') || '—',
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Intake error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
