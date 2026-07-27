'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type AppLocale, locales } from '@/i18n/config'
import { LocaleSwitcher } from '@/components/locale-switcher'

export function LocalizedLocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const currentLocale = useLocale() as AppLocale
  const t = useTranslations('locale')
  const localeLabels = Object.fromEntries(
    locales.map((locale) => [locale, t(locale)]),
  ) as Record<AppLocale, string>

  return (
    <LocaleSwitcher
      compact={compact}
      currentLocale={currentLocale}
      label={t('label')}
      changingLabel={t('changing')}
      localeLabels={localeLabels}
    />
  )
}
