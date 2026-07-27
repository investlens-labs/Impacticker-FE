import { cleanup, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderWithIntl } from '@/test/render'
import { AdSlot } from './ad-slot'

const validConfiguration = {
  enabled: 'true',
  clientId: 'ca-pub-1234567890123456',
  slot: '1234567890',
  privacyContact: 'privacy@example.com',
  label: '광고',
}

afterEach(() => {
  cleanup()
  document.getElementById('impacticker-adsense')?.remove()
  delete window.adsbygoogle
})

describe('AdSlot', () => {
  it('설정이 없으면 공간을 남기지 않는다', () => {
    const { container } = renderWithIntl(<AdSlot label="광고" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('유효한 설정에서는 광고임을 명확히 표시하고 비개인화 요청을 준비한다', async () => {
    renderWithIntl(<AdSlot {...validConfiguration} />)

    expect(screen.getByRole('complementary', { name: '광고' })).toBeInTheDocument()
    expect(screen.getByText('광고')).toBeInTheDocument()
    await waitFor(() => {
      expect(window.adsbygoogle?.requestNonPersonalizedAds).toBe(1)
      expect(document.getElementById('impacticker-adsense')).toBeInTheDocument()
    })
  })
})
