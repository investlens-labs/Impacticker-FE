import { describe, expect, it } from 'vitest'
import manifest from './manifest'
import robots from './robots'
import sitemap from './sitemap'

describe('metadata routes', () => {
  it('공개 홈을 허용하고 API 크롤링을 제한한다', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules

    expect(rules).toMatchObject({ userAgent: '*', allow: '/', disallow: '/api/' })
    expect(result.sitemap).toMatch(/^https:\/\/.*\/sitemap\.xml$/)
  })

  it('공개 랜딩, 서비스 안내와 정책 페이지를 sitemap에 포함한다', () => {
    const result = sitemap()

    expect(result).toHaveLength(5)
    expect(result[0]).toMatchObject({
      url: expect.stringMatching(/^https:\/\/.*\/$/),
      priority: 1,
      lastModified: expect.any(Date),
    })
    expect(result.map(({ url }) => url)).toEqual(expect.arrayContaining([
      expect.stringMatching(/\/about$/),
      expect.stringMatching(/\/methodology$/),
      expect.stringMatching(/\/privacy$/),
      expect.stringMatching(/\/advertising-policy$/),
    ]))
  })

  it('설치 가능한 웹 앱 manifest를 제공한다', () => {
    expect(manifest()).toMatchObject({
      name: 'Impacticker',
      start_url: '/',
      display: 'standalone',
      icons: [expect.objectContaining({ src: '/icon.png', type: 'image/png' })],
    })
  })
})
