/**
 * deploy-client.mjs — One command to deploy a client salon site
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE:
 *   node scripts/deploy-client.mjs --client=clients/salon-eleonore.json
 *
 * WHAT IT DOES:
 *   1. Runs build-client-site.mjs to generate the site
 *   2. npm install in the generated folder
 *   3. vercel deploy --prod (deploys to Vercel)
 *   4. Prints the live URL + WhatsApp message to send client
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const args = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('='))
)

const clientFile = args.client
if (!clientFile) {
  console.error('❌ Usage: node scripts/deploy-client.mjs --client=clients/salon-eleonore.json')
  process.exit(1)
}

const client = JSON.parse(fs.readFileSync(path.resolve(ROOT, clientFile), 'utf8'))
const slug = client.salonName
  .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const outDir = path.join(ROOT, 'client-sites', slug)

console.log('\n🚀 MonSalonVip — Client Deploy Pipeline')
console.log('═══════════════════════════════════════')
console.log(`📋 Client  : ${client.salonName}`)
console.log(`📍 City    : ${client.city}`)
console.log(`🎨 Palette : ${client.palette}`)
console.log(`🌐 Domain  : ${client.domain || '(not set)'}`)
console.log('═══════════════════════════════════════\n')

// Step 1 — Generate site
console.log('📦 Step 1/3 — Generating site...')
if (fs.existsSync(outDir)) {
  console.log(`⚠️  client-sites/${slug} already exists — delete it first to regenerate`)
  process.exit(1)
}
execSync(`node ${path.join(__dirname, 'build-client-site.mjs')} --client=${clientFile}`, { stdio: 'inherit' })

// Step 2 — Install dependencies
console.log('\n📦 Step 2/3 — Installing dependencies...')
execSync('npm install --silent', { cwd: outDir, stdio: 'inherit' })

// Step 3 — Deploy to Vercel
console.log('\n🚀 Step 3/3 — Deploying to Vercel...')
let deployUrl = ''
try {
  const output = execSync(`vercel --prod --yes --name ${slug}`, { cwd: outDir }).toString()
  const match = output.match(/https:\/\/[^\s]+\.vercel\.app/)
  if (match) deployUrl = match[0]
  console.log(output)
} catch (err) {
  console.error('⚠️  Vercel deploy failed. Try manually:')
  console.error(`   cd client-sites/${slug} && vercel --prod`)
}

const liveUrl = client.domain ? `https://${client.domain}` : deployUrl

// Done
console.log('\n✅ DONE!')
console.log('═══════════════════════════════════════')
console.log(`🌐 Live URL : ${liveUrl || deployUrl}`)
if (client.domain) {
  console.log(`\n📌 Add custom domain in Vercel:`)
  console.log(`   vercel domains add ${client.domain}`)
  console.log(`   Then add DNS CNAME: @ → cname.vercel-dns.com`)
}
console.log(`\n💬 WhatsApp message to send client:`)
console.log(`─────────────────────────────────────`)
console.log(`Bonjour ${client.ownerName} ! 🎉`)
console.log(``)
console.log(`Votre site est en ligne : ${liveUrl || deployUrl}`)
console.log(``)
console.log(`Il inclut :`)
console.log(`✅ Votre palette ${client.palette} personnalisée`)
console.log(`✅ Vos ${(client.services||[]).length} services`)
console.log(`✅ Réservation en ligne`)
console.log(`✅ Optimisé SEO pour ${client.city}`)
console.log(``)
console.log(`Pour toute modification, répondez ici 👍`)
console.log(`─────────────────────────────────────\n`)
