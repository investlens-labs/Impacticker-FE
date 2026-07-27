import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PolicyPage, type PolicySection } from '@/components/legal/policy-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.advertising')
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/advertising-policy' },
  }
}

export default async function AdvertisingPolicyPage() {
  const t = await getTranslations('legal')
  const advertising = await getTranslations('legal.advertising')
  const sections: PolicySection[] = [
    { title: advertising('labelTitle'), content: <p>{advertising('labelContent')}</p> },
    { title: advertising('independenceTitle'), content: <p>{advertising('independenceContent')}</p> },
    { title: advertising('placementTitle'), content: <p>{advertising('placementContent')}</p> },
    { title: advertising('prohibitedTitle'), content: <p>{advertising('prohibitedContent')}</p> },
    { title: advertising('personalizationTitle'), content: <p>{advertising('personalizationContent')}</p> },
  ]

  return (
    <PolicyPage
      eyebrow={t('eyebrow')}
      title={advertising('title')}
      description={advertising('description')}
      updatedLabel={t('updated')}
      updatedAt="2026-07-27"
      backLabel={t('backHome')}
      sections={sections}
    />
  )
}
