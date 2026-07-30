import { describe, expect, it } from 'vitest'
import type { PortfolioItem } from '@/lib/api/types'
import { addPortfolioItem, removePortfolioItem } from './portfolio-cache'

const item: PortfolioItem = {
  id: 'portfolio-1',
  instrumentId: 'instrument-1',
  ticker: 'AAPL',
  companyName: 'Apple Inc.',
  type: 'STOCK',
  createdAt: '2026-07-30T00:00:00Z',
}

describe('포트폴리오 즉시 캐시 반영', () => {
  it('같은 종목을 중복 추가하지 않는다', () => {
    expect(addPortfolioItem([item], { ...item, id: 'portfolio-2' })).toEqual([item])
  })

  it('추가와 삭제 결과를 서버 재조회 전에 반영한다', () => {
    expect(addPortfolioItem(undefined, item)).toEqual([item])
    expect(removePortfolioItem([item], item.id)).toEqual([])
  })
})
