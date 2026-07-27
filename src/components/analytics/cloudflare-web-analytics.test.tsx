import { cleanup, render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CloudflareWebAnalytics } from './cloudflare-web-analytics'

vi.mock('next/script', () => ({
  default: (props: ComponentProps<'script'> & { strategy?: string }) => {
    const scriptProps = { ...props }
    delete scriptProps.strategy
    return <script {...scriptProps} />
  },
}))

afterEach(cleanup)

describe('CloudflareWebAnalytics', () => {
  it('토큰이 없으면 외부 스크립트를 렌더링하지 않는다', () => {
    const { container } = render(<CloudflareWebAnalytics />)
    expect(container).toBeEmptyDOMElement()
  })

  it('유효한 토큰으로 Cloudflare 비콘을 구성한다', () => {
    const token = 'd71cca3608cb4366a2d7f72d0bb8576b'
    const { container } = render(<CloudflareWebAnalytics token={token} />)
    const script = container.querySelector('script')

    expect(script).toHaveAttribute('src', 'https://static.cloudflareinsights.com/beacon.min.js')
    expect(script).toHaveAttribute('data-cf-beacon', JSON.stringify({ token }))
    expect(script).toHaveAttribute('type', 'module')
  })
})
