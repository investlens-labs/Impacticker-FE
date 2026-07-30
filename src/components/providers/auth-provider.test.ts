import { describe, expect, it } from 'vitest'
import { getAuthRouteState } from './auth-provider'

describe('보호 화면 인증 게이트', () => {
  it('토큰이 없거나 사용자 확인 중이면 보호 화면을 렌더링하지 않는다', () => {
    expect(getAuthRouteState('/dashboard', false, false).shouldBlock).toBe(true)
    expect(getAuthRouteState('/dashboard', true, true).shouldBlock).toBe(true)
    expect(getAuthRouteState('/dashboard', true, false).shouldBlock).toBe(false)
  })

  it('로그인된 사용자가 인증 화면을 다시 보지 않게 한다', () => {
    expect(getAuthRouteState('/login', true, false).shouldBlock).toBe(true)
    expect(getAuthRouteState('/signup', false, false).shouldBlock).toBe(false)
    expect(getAuthRouteState('/', false, false).shouldBlock).toBe(false)
  })
})
