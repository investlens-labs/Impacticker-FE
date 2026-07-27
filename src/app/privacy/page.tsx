import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PolicyPage, type PolicySection } from '@/components/legal/policy-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy')
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/privacy' },
  }
}

export default async function PrivacyPage() {
  const t = await getTranslations('legal')
  const privacy = await getTranslations('legal.privacy')
  const contactEmail = process.env.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL
  const sections: PolicySection[] = [
    { title: privacy('accountTitle'), content: <p>{privacy('accountContent')}</p> },
    { title: privacy('preferencesTitle'), content: <p>{privacy('preferencesContent')}</p> },
    { title: privacy('advertisingTitle'), content: <p>{privacy('advertisingContent')}</p> },
    { title: privacy('targetingTitle'), content: <p>{privacy('targetingContent')}</p> },
    {
      title: privacy('choicesTitle'),
      content: (
        <p>
          {privacy('choicesContent')}{' '}
          <a className="font-semibold text-brand-700 underline underline-offset-2 dark:text-brand-100" href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">
            {privacy('googleSettings')}
          </a>
        </p>
      ),
    },
    {
      title: privacy('contactTitle'),
      content: contactEmail
        ? <a className="font-semibold text-brand-700 underline underline-offset-2 dark:text-brand-100" href={`mailto:${contactEmail}`}>{contactEmail}</a>
        : <p>{privacy('contactPending')}</p>,
    },
  ]

  return (
    <PolicyPage
      eyebrow={t('eyebrow')}
      title={privacy('title')}
      description={privacy('description')}
      updatedLabel={t('updated')}
      updatedAt="2026-07-27"
      backLabel={t('backHome')}
      sections={sections}
    />
  )
}
