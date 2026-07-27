import type { Metadata, Viewport } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import './globals.css'
import { CloudflareWebAnalytics } from '@/components/analytics/cloudflare-web-analytics'
import { getSiteUrl, siteName } from '@/lib/seo'

const themeInitializationScript = `
try {
  const savedTheme = window.localStorage.getItem('impacticker.theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', savedTheme ? savedTheme === 'dark' : prefersDark);
} catch {}
`

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1211' },
  ],
  colorScheme: 'light dark',
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  const naverVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
  const title = t('homeTitle')
  const description = t('description')

  return {
    metadataBase: getSiteUrl(),
    title: { default: title, template: `%s · ${siteName}` },
    description,
    applicationName: siteName,
    icons: { icon: '/icon.png', apple: '/icon.png' },
    manifest: '/manifest.webmanifest',
    category: 'finance',
    formatDetection: { telephone: false, email: false, address: false },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(naverVerification ? { other: { 'naver-site-verification': naverVerification } } : {}),
    },
  }
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale()
  const t = await getTranslations('accessibility')

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>
        <a href="#main-content" className="sr-only z-50 rounded bg-brand-600 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          {t('skipToContent')}
        </a>
        {children}
        <CloudflareWebAnalytics token={process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN} />
      </body>
    </html>
  )
}
