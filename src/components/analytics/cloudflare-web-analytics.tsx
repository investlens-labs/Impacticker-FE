import Script from 'next/script'
import { getCloudflareWebAnalyticsToken } from '@/lib/cloudflare-web-analytics'

interface CloudflareWebAnalyticsProps {
  token?: string
}

export function CloudflareWebAnalytics({ token: rawToken }: CloudflareWebAnalyticsProps) {
  const token = getCloudflareWebAnalyticsToken(rawToken)
  if (!token) return null

  return (
    <Script
      id="cloudflare-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      type="module"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  )
}
