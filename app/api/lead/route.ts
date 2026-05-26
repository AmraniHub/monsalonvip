import { NextResponse } from 'next/server'

async function sendTelegram(data: { name: string; phone: string; salon: string; city: string }) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const waNumber = data.phone.replace(/\D/g, '').replace(/^0/, '')
  const msg = [
    `💅 <b>NOUVEAU LEAD — MonSalonVip</b>`,
    ``,
    `👤 <b>Prénom :</b> ${data.name}`,
    `💇 <b>Salon :</b> ${data.salon}`,
    `📍 <b>Ville :</b> ${data.city}`,
    `📞 <b>Téléphone :</b> ${data.phone}`,
    ``,
    `⚡ Répondre dans les 24h !`,
    `💬 <a href="https://wa.me/33${waNumber}">Ouvrir WhatsApp →</a>`,
  ].join('\n')

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
  })
}

async function sendToSheets(data: { name: string; phone: string; salon: string; city: string }) {
  const url = process.env.GOOGLE_SCRIPT_URL
  if (!url) return

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action:   'addLead',
      source:   'MonSalonVip',
      name:     data.name,
      phone:    data.phone,
      business: data.salon,
      city:     data.city,
      sector:   'Salon de beauté',
    }),
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, salon, city } = body

    await Promise.allSettled([
      sendTelegram({ name, phone, salon, city }),
      sendToSheets({ name, phone, salon, city }),
    ])

    return NextResponse.json({ status: 'ok' })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
