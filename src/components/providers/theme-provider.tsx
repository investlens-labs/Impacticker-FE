'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null)
const themeListeners = new Set<() => void>()

function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener)
  return () => themeListeners.delete(listener)
}

function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem('impacticker.theme', theme)
  themeListeners.forEach((listener) => listener())
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, (): Theme => 'light')
  const toggle = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme])
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
