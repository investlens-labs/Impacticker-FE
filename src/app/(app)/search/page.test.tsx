import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ko from '../../../../messages/ko.json'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import type { PortfolioItem } from '@/lib/api/types'
import SearchPage from './page'

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}))

vi.mock('@/hooks/use-debounced-value', () => ({
  useDebouncedValue: <T,>(value: T) => value,
}))

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return (
    <NextIntlClientProvider locale="ko" messages={ko}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  )
}

const created: PortfolioItem = {
  id: 'portfolio-1',
  instrumentId: 'instrument-1',
  ticker: 'AAPL',
  companyName: 'Apple Inc.',
  type: 'STOCK',
  createdAt: '2026-07-30T00:00:00Z',
}

describe('종목 검색 핵심 사용자 흐름', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    routerPush.mockReset()
  })

  it('키보드 선택을 알리고 Enter로 상세 화면을 연다', async () => {
    vi.spyOn(instrumentApi, 'search').mockResolvedValue([{
      id: 'instrument-1',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      type: 'STOCK',
      market: 'US',
      logoUrl: null,
      logoAttributionUrl: null,
    }])
    vi.spyOn(portfolioApi, 'list').mockResolvedValue([])

    render(<SearchPage />, { wrapper: Wrapper })

    const search = await screen.findByRole('searchbox', { name: '티커 또는 종목명 검색' })
    await screen.findByText('Apple Inc.')
    fireEvent.keyDown(search, { key: 'ArrowDown' })

    expect(screen.getByText('AAPL · Apple Inc. 선택됨')).toBeInTheDocument()
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(routerPush).toHaveBeenCalledWith('/instruments/instrument-1')
  })

  it('추가 요청 중 모든 추가 버튼을 잠가 중복 POST를 막고 성공을 알린다', async () => {
    vi.spyOn(instrumentApi, 'search').mockResolvedValue([{
      id: 'instrument-1',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      type: 'STOCK',
      market: 'US',
      logoUrl: null,
      logoAttributionUrl: null,
    }])
    vi.spyOn(portfolioApi, 'list').mockResolvedValueOnce([]).mockResolvedValue([created])
    let resolveAdd!: (item: PortfolioItem) => void
    const add = vi.spyOn(portfolioApi, 'add').mockImplementation(() => new Promise((resolve) => { resolveAdd = resolve }))

    render(<SearchPage />, { wrapper: Wrapper })

    const button = await screen.findByRole('button', { name: '추가' })
    fireEvent.click(button)
    await waitFor(() => expect(button).toBeDisabled())
    fireEvent.click(button)
    expect(add).toHaveBeenCalledOnce()

    await act(async () => resolveAdd(created))
    expect(await screen.findByRole('status')).toHaveTextContent('AAPL 종목을 포트폴리오에 추가했습니다.')
  })
})
