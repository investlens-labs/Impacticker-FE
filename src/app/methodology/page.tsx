import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PolicyPage, type PolicySection } from '@/components/legal/policy-page'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('publicInfo.methodology')

  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/methodology' },
  }
}

export default async function MethodologyPage() {
  const common = await getTranslations('publicInfo')
  const methodology = await getTranslations('publicInfo.methodology')
  const sections: PolicySection[] = [
    { title: methodology('directionTitle'), content: <p>{methodology('directionContent')}</p> },
    { title: methodology('scoreTitle'), content: <p>{methodology('scoreContent')}</p> },
    { title: methodology('probabilityTitle'), content: <p>{methodology('probabilityContent')}</p> },
    { title: methodology('analysisTitle'), content: <p>{methodology('analysisContent')}</p> },
    { title: methodology('evidenceTitle'), content: <p>{methodology('evidenceContent')}</p> },
    { title: methodology('disclaimerTitle'), content: <p>{methodology('disclaimerContent')}</p> },
  ]

  return (
    <PolicyPage
      eyebrow={common('eyebrow')}
      title={methodology('title')}
      description={methodology('description')}
      updatedLabel={common('updated')}
      updatedAt="2026-07-30"
      backLabel={common('backHome')}
      sections={sections}
    />
  )
}
