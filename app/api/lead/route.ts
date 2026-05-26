import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, phone, salon, city } = await req.json()

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

    if (BOT_TOKEN && CHAT_ID) {
      const msg = [
        `💅 <b>NOUVEAU LEAD — MonSalonVip</b>`,
        ``,
        `👤 <b>Prénom :</b> ${name}`,
        `💇 <b>Salon :</b> ${salon}`,
        `📍 <b>Ville :</b> ${city}`,
        `📞 <b>Téléphone :</b> ${phone}`,
        ``,
        `⏰ Répondre dans les 24h !`,
        `🔗 <a href="https://wa.me/33${String(phone).replace(/\D/g,'').replace(/^0/,'')}">Ouvrir WhatsApp</a>`,
      ].join('\n')

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' }),
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
