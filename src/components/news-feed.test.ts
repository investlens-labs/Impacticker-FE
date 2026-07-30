import { describe, expect, it } from 'vitest'
import { getEmptyNewsVariant, impactScoreOptions } from './news-feed'

describe('맞춤 뉴스 점수 필터', () => {
  it('10점부터 1점까지 모든 최소 점수를 제공한다', () => {
    expect(impactScoreOptions).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })
})

describe('맞춤 뉴스 빈 상태', () => {
  it('포트폴리오 없음과 필터 결과 없음을 구분한다', () => {
    expect(getEmptyNewsVariant(true, '', '')).toBe('portfolio')
    expect(getEmptyNewsVariant(false, 'NEGATIVE', '')).toBe('filtered')
    expect(getEmptyNewsVariant(false, '', 7)).toBe('filtered')
    expect(getEmptyNewsVariant(false, '', '')).toBe('default')
  })
})
