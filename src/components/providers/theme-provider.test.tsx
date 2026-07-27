import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from './theme-provider'

function ThemeConsumer() {
  const { theme, toggle } = useTheme()
  return <button type="button" onClick={toggle}>{theme}</button>
}

beforeEach(() => {
  document.documentElement.classList.remove('dark')
  window.localStorage.clear()
})

afterEach(cleanup)

describe('ThemeProvider', () => {
  it('테마 변경을 문서와 로컬 저장소에 동기화한다', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'light' }))

    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem('impacticker.theme')).toBe('dark')
  })
})
