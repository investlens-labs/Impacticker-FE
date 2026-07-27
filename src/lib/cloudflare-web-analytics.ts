const CLOUDFLARE_WEB_ANALYTICS_TOKEN_PATTERN = /^[a-f0-9]{32}$/i

export function getCloudflareWebAnalyticsToken(value: string | undefined) {
  const token = value?.trim()
  return token && CLOUDFLARE_WEB_ANALYTICS_TOKEN_PATTERN.test(token) ? token : null
}
