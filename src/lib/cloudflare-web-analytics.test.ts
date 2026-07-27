import { describe, expect, it } from 'vitest'
import { getCloudflareWebAnalyticsToken } from './cloudflare-web-analytics'

describe('Cloudflare Web Analytics configuration', () => {
  it('유효한 사이트 토큰을 정규화한다', () => {
    expect(getCloudflareWebAnalyticsToken(' d71cca3608cb4366a2d7f72d0bb8576b ')).toBe(
      'd71cca3608cb4366a2d7f72d0bb8576b',
    )
  })

  it('토큰이 없거나 형식이 잘못되면 비콘을 비활성화한다', () => {
    expect(getCloudflareWebAnalyticsToken(undefined)).toBeNull()
    expect(getCloudflareWebAnalyticsToken('')).toBeNull()
    expect(getCloudflareWebAnalyticsToken('invalid-token')).toBeNull()
  })
})
