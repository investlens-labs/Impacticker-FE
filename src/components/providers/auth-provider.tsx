'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react'
import { authApi } from '@/lib/api/services'
import type { TokenResponse, User } from '@/lib/api/types'
import { tokenStorage } from '@/lib/auth/token-storage'
import { queryKeys } from '@/lib/query-keys'

interface AuthContextValue {
  user?: User
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (token: TokenResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const PUBLIC_PATHS = ['/login', '/signup']
const RETURN_TO_KEY = 'impacticker.returnTo'

export function getAuthRouteState(pathname: string, hasToken: boolean, isLoading: boolean) {
  const isAuthPath = PUBLIC_PATHS.includes(pathname)
  const isProtectedPath = pathname !== '/' && !isAuthPath
  return {
    isAuthPath,
    isProtectedPath,
    shouldBlock: (isProtectedPath && (!hasToken || isLoading)) || (isAuthPath && hasToken),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const statusT = useTranslations('status')
  const queryClient = useQueryClient()
  const hasToken = Boolean(tokenStorage.get())
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    enabled: hasToken,
  })
  const { isAuthPath, isProtectedPath, shouldBlock } = getAuthRouteState(pathname, hasToken, isLoading)

  const signOut = useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    router.replace('/login')
  }, [queryClient, router])

  const signIn = useCallback((token: TokenResponse) => {
    tokenStorage.set(token.accessToken)
    void queryClient.invalidateQueries({ queryKey: queryKeys.me })
    const returnTo = window.sessionStorage.getItem(RETURN_TO_KEY)
    window.sessionStorage.removeItem(RETURN_TO_KEY)
    router.replace(returnTo?.startsWith('/') ? returnTo : '/dashboard')
  }, [queryClient, router])

  useEffect(() => {
    window.addEventListener('impacticker:unauthorized', signOut)
    return () => window.removeEventListener('impacticker:unauthorized', signOut)
  }, [signOut])

  useEffect(() => {
    if (!hasToken && isProtectedPath) {
      window.sessionStorage.setItem(RETURN_TO_KEY, pathname)
      router.replace('/login')
    }
    if (hasToken && isAuthPath) router.replace('/dashboard')
  }, [hasToken, isAuthPath, isProtectedPath, pathname, router])

  if (shouldBlock) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950" role="status" aria-live="polite">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-6 animate-spin text-brand-600 motion-reduce:animate-none" aria-hidden />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{statusT('authChecking')}</p>
        </div>
      </div>
    )
  }

  return <AuthContext value={{ user, isAuthenticated: hasToken, isLoading, signIn, signOut }}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
