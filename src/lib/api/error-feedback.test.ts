import { describe, expect, it } from 'vitest'
import { ApiError } from './client'
import { getApiErrorKind } from './error-feedback'

describe('getApiErrorKind', () => {
  it.each([
    [0, 'network'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [408, 'timeout'],
    [429, 'rateLimit'],
    [500, 'server'],
    [503, 'server'],
    [504, 'timeout'],
    [400, 'generic'],
  ] as const)('HTTP 상태 %s를 %s 피드백으로 분류한다', (status, expected) => {
    expect(getApiErrorKind(new ApiError('test', status))).toBe(expected)
  })

  it('알 수 없는 오류는 일반 오류로 처리한다', () => {
    expect(getApiErrorKind(new Error('test'))).toBe('generic')
  })
})
