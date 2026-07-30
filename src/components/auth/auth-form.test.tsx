import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/lib/api/services'
import { getAuthenticationCredentials, submitAuthentication } from './auth-form'

describe('회원가입 후 자동 로그인', () => {
  afterEach(() => vi.restoreAllMocks())

  it('가입이 끝난 뒤 로그인 재시도에서는 계정을 다시 만들지 않는다', async () => {
    const signup = vi.spyOn(authApi, 'signup').mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: 'USER',
    })
    const login = vi.spyOn(authApi, 'login')
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({ accessToken: 'token', tokenType: 'Bearer', expiresIn: 3600 })
    let signupCompleted = false
    const input = {
      mode: 'signup' as const,
      email: 'user@example.com',
      password: 'password123',
      onSignupCompleted: () => { signupCompleted = true },
    }

    await expect(submitAuthentication({ ...input, signupCompleted })).rejects.toThrow('temporary failure')
    await expect(submitAuthentication({ ...input, signupCompleted })).resolves.toMatchObject({ accessToken: 'token' })

    expect(signup).toHaveBeenCalledOnce()
    expect(login).toHaveBeenCalledTimes(2)
  })

  it('가입 완료 뒤 입력값이 달라져도 생성된 계정 자격증명으로 로그인한다', () => {
    expect(getAuthenticationCredentials(
      true,
      { email: 'created@example.com', password: 'created-password' },
      { email: 'changed@example.com', password: 'changed-password' },
    )).toEqual({ email: 'created@example.com', password: 'created-password' })
  })
})
