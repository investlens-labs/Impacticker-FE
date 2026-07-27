import { afterEach, describe, expect, it } from 'vitest'
import { GET } from './route'

const originalClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

afterEach(() => {
  if (originalClientId === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  else process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = originalClientId
})

describe('GET /ads.txt', () => {
  it('publisher ID가 없으면 비활성 상태를 반환한다', async () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
    const response = GET()

    expect(response.status).toBe(404)
  })

  it('publisher ID가 있으면 Google 판매자 항목을 반환한다', async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = 'ca-pub-1234567890123456'
    const response = GET()

    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe(
      'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n',
    )
  })
})
