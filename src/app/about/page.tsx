import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PolicyPage, type PolicySection } from '@/components/legal/policy-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('publicInfo.about')

  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/about' },
  }
}

export default async function AboutPage() {
  const common = await getTranslations('publicInfo')
  const about = await getTranslations('publicInfo.about')
  const sections: PolicySection[] = [
    { title: about('purposeTitle'), content: <p>{about('purposeContent')}</p> },
    { title: about('coverageTitle'), content: <p>{about('coverageContent')}</p> },
    { title: about('flowTitle'), content: <p>{about('flowContent')}</p> },
    { title: about('limitsTitle'), content: <p>{about('limitsContent')}</p> },
  ]

  return (
    <PolicyPage
      eyebrow={common('eyebrow')}
      title={about('title')}
      description={about('description')}
      updatedLabel={common('updated')}
      updatedAt="2026-07-30"
      backLabel={common('backHome')}
      sections={sections}
    />
  )
}
