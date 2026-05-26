import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MonSalonVip — Site web pour salons de beauté en 24h',
  description: 'On crée le site web de votre salon de beauté en 24h à partir de 490€. Design professionnel, SEO inclus, livraison garantie. Devis gratuit en quelques secondes.',
  keywords: 'site web salon de beauté France, création site salon coiffure, site internet salon esthétique pas cher, site web salon livraison rapide',
  metadataBase: new URL('https://monsalonvip.fr'),
  openGraph: {
    title: 'MonSalonVip — Site web pour votre salon en 24h',
    description: 'Site professionnel pour salon de beauté livré en 24h à partir de 490€.',
    type: 'website',
    siteName: 'MonSalonVip',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
