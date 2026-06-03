import { MetadataRoute } from 'next'

const BASE = 'https://monsalonvip.com'

const CITY_SLUGS = [
  'paris','lyon','marseille','bordeaux','nice',
  'toulouse','lille','bruxelles','geneve','monaco'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/intake`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/demo`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const cityPages: MetadataRoute.Sitemap = CITY_SLUGS.map(city => ({
    url: `${BASE}/site-web-salon/${city}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...cityPages]
}
