import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MonSalonVip — Site web pour salons de beauté en 24h',
  description: 'On crée le site web de votre salon de beauté en 24h à partir de 490€. Design professionnel, SEO inclus, livraison garantie. Devis gratuit en quelques secondes.',
  keywords: 'site web salon de beauté France, création site salon coiffure Belgique, site internet salon esthétique Suisse, site web salon Monaco, site web salon livraison rapide',
  metadataBase: new URL('https://monsalonvip.com'),
  openGraph: {
    title: 'MonSalonVip — Site web pour votre salon en 24h',
    description: 'Site professionnel pour salon de beauté livré en 24h à partir de 490€.',
    type: 'website',
    siteName: 'MonSalonVip',
  },
  robots: { index: true, follow: true },
  other: {
    'geo.region':    'FR',
    'geo.placename': 'France',
    'geo.position':  '46.2276;2.2137',
    'ICBM':          '46.2276, 2.2137',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
