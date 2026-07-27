import { describe, expect, it } from 'vitest'
import {
  createAdsTxtLine,
  isAdsensePlacementEnabled,
  isValidAdsenseClientId,
  isValidPrivacyContact,
  isValidAdsenseSlot,
} from './adsense'

describe('AdSense configuration', () => {
  it('Google publisher ID와 광고 슬롯 형식을 검증한다', () => {
    expect(isValidAdsenseClientId('ca-pub-1234567890123456')).toBe(true)
    expect(isValidAdsenseClientId('pub-1234567890123456')).toBe(false)
    expect(isValidAdsenseSlot('1234567890')).toBe(true)
    expect(isValidAdsenseSlot('slot-name')).toBe(false)
    expect(isValidPrivacyContact('privacy@example.com')).toBe(true)
    expect(isValidPrivacyContact('not-an-email')).toBe(false)
  })

  it('명시적으로 활성화되고 모든 값이 유효할 때만 광고를 표시한다', () => {
    const values = {
      clientId: 'ca-pub-1234567890123456',
      slot: '1234567890',
      privacyContact: 'privacy@example.com',
    }

    expect(isAdsensePlacementEnabled({ enabled: 'true', ...values })).toBe(true)
    expect(isAdsensePlacementEnabled({ enabled: 'false', ...values })).toBe(false)
    expect(isAdsensePlacementEnabled({ enabled: 'true', ...values, slot: undefined })).toBe(false)
    expect(isAdsensePlacementEnabled({ enabled: 'true', ...values, privacyContact: undefined })).toBe(false)
  })

  it('publisher ID로 ads.txt 항목을 생성한다', () => {
    expect(createAdsTxtLine('ca-pub-1234567890123456')).toBe(
      'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0',
    )
    expect(createAdsTxtLine('invalid')).toBeNull()
  })
})
