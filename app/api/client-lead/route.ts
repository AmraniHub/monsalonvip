/**
 * /api/client-lead — Shared lead routing for all client salon sites
 *
 * Client sites call this endpoint with their config.
 * Leads are routed to:
 *   1. Client's own Telegram (if they have a bot)
 *   2. YOUR Telegram (always — so you see everything)
 *   3. Your Google Sheet (Leads tab with source = salon name)
 */
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Required: salonName, phone or name
    if (!body.salonName) return NextResponse.json({ error: 'Missing salonName' }, { status: 400 })

    const myToken  = process.env.TELEGRAM_BOT_TOKEN
    const myChat   = process.env.TELEGRAM_CHAT_ID
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL

    const waRaw = (body.phone || '').replace(/\D/g, '').replace(/^0/, '')
    const waLink = waRaw ? `https://wa.me/33${waRaw}` : null

    // ── Message ───────────────────────────────────────────────────────────────
    const msg = [
      `💅 <b>NOUVEAU LEAD — ${body.salonName}</b>`,
      ``,
      `👤 ${body.name || '—'}`,
      body.phone ? `📞 ${body.phone}` : null,
      body.email ? `📧 ${body.email}` : null,
      body.service ? `💆 Service: ${body.service}` : null,
      body.message ? `💬 ${body.message}` : null,
      ``,
      waLink ? `<a href="${waLink}">💬 Ouvrir WhatsApp →</a>` : null,
    ].filter(Boolean).join('\n')

    const tgPayload = (chatId: string) => JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })

    const sends: Promise<any>[] = []

    // 1. Send to YOUR Telegram (always)
    if (myToken && myChat) {
      sends.push(fetch(`https://api.telegram.org/bot${myToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: tgPayload(myChat),
      }))
    }

    // 2. Send to CLIENT's Telegram (if they have their own bot + chat)
    if (body.clientTgToken && body.clientTgChat) {
      sends.push(fetch(`https://api.telegram.org/bot${body.clientTgToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: tgPayload(body.clientTgChat),
      }))
    }

    // 3. Save to Google Sheet
    if (scriptUrl) {
      sends.push(fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:   'addLead',
          source:   body.salonName,
          name:     body.name || '—',
          phone:    body.phone || '—',
          business: body.salonName,
          city:     body.city || '—',
          sector:   body.service || body.sector || '—',
          notes:    body.message || '—',
        }),
      }))
    }

    await Promise.allSettled(sends)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Client lead error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
