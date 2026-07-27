import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/privacy'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/advertising-policy'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
