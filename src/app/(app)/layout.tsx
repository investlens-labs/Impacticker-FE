import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { AppProviders } from '@/components/providers/app-providers'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>
        <AppShell>{children}</AppShell>
      </AppProviders>
    </NextIntlClientProvider>
  )
}
