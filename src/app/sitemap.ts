import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

const lastModified = new Date('2026-07-30')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/about'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/methodology'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/advertising-policy'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
