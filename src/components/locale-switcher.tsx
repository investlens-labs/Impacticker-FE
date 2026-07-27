'use client'

import { Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { isAppLocale, locales, type AppLocale } from '@/i18n/config'

type LocaleSwitcherProps = {
  compact?: boolean
  currentLocale: AppLocale
  label: string
  changingLabel: string
  localeLabels: Record<AppLocale, string>
}

export function LocaleSwitcher({
  compact = false,
  currentLocale,
  label,
  changingLabel,
  localeLabels,
}: LocaleSwitcherProps) {
  const router = useRouter()
  const [selectedLocale, setSelectedLocale] = useState(currentLocale)
  const [pending, startTransition] = useTransition()

  const changeLocale = (nextLocale: string) => {
    if (!isAppLocale(nextLocale) || nextLocale === selectedLocale) return
    const previousLocale = selectedLocale
    setSelectedLocale(nextLocale)

    startTransition(async () => {
      const response = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: nextLocale }),
      }).catch(() => null)

      if (!response?.ok) {
        setSelectedLocale(previousLocale)
        return
      }

      router.refresh()
    })
  }

  return (
    <label className={`relative inline-flex items-center ${compact ? '' : 'gap-2'}`}>
      <span className="sr-only">{label}</span>
      <Languages className={`pointer-events-none absolute left-2.5 size-4 text-slate-500 dark:text-slate-400 ${pending ? 'animate-pulse' : ''}`} aria-hidden />
      <select
        aria-label={label}
        className={`${compact ? 'h-9 w-[104px] pl-8 pr-7 text-xs' : 'h-10 min-w-32 pl-9 pr-8 text-sm'} appearance-none rounded-lg border border-slate-200 bg-white font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
        value={selectedLocale}
        disabled={pending}
        onChange={(event) => changeLocale(event.target.value)}
      >
        {locales.map((locale) => <option key={locale} value={locale}>{localeLabels[locale]}</option>)}
      </select>
      <span className="pointer-events-none absolute right-2.5 text-[9px] text-slate-400" aria-hidden>▼</span>
      {pending && <span className="sr-only" role="status">{changingLabel}</span>}
    </label>
  )
}
