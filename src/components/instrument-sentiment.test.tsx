import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { InstrumentNewsSentiment } from '@/lib/api/types'
import { renderWithIntl } from '@/test/render'
import { InstrumentSentiment } from './instrument-sentiment'

const analyzedSentiment: InstrumentNewsSentiment = {
  aiAnalyzed: true,
  analyzedArticleCount: 12,
  relatedArticleCount: 15,
  upPercentage: 48,
  downPercentage: 22,
  neutralPercentage: 30,
  analysisModel: 'gemini-3.5-flash',
  disclaimer: '최근 관련 기사에 대한 AI 기반 단기 시장 반응 가능성입니다. 주가 예측이나 투자 조언이 아닙니다.',
}

describe('InstrumentSentiment', () => {
  it('분석된 기사 집계와 세 가지 반응 가능성을 표시한다', () => {
    renderWithIntl(<InstrumentSentiment sentiment={analyzedSentiment} />, { locale: 'ko' })

    expect(screen.getByText(/관련 기사 15건 중 AI 분석 완료 12건/)).toBeInTheDocument()
    expect(screen.getByText('48%')).toBeInTheDocument()
    expect(screen.getByText('22%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('AI · gemini-3.5-flash')).toBeInTheDocument()
    expect(screen.getByText(analyzedSentiment.disclaimer)).toBeInTheDocument()

    const upMetric = screen.getByText('상승').closest('div')
    const downMetric = screen.getByText('하락').closest('div')
    const neutralMetric = screen.getByText('중립').closest('div')

    expect(upMetric).not.toBeNull()
    expect(downMetric).not.toBeNull()
    expect(neutralMetric).not.toBeNull()
    expect(within(upMetric as HTMLElement).getByText('48%')).toBeInTheDocument()
    expect(within(downMetric as HTMLElement).getByText('22%')).toBeInTheDocument()
    expect(within(neutralMetric as HTMLElement).getByText('30%')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '상승 48%, 하락 22%, 중립 30%' })).toBeInTheDocument()
  })

  it('AI 미분석 상태의 0을 실제 확률로 표시하지 않는다', () => {
    renderWithIntl(<InstrumentSentiment sentiment={{ ...analyzedSentiment, aiAnalyzed: false, analyzedArticleCount: 0, upPercentage: 0, downPercentage: 0, neutralPercentage: 0, analysisModel: null }} />, { locale: 'ko' })

    expect(screen.getByText('AI 종합 분석 준비 중')).toBeInTheDocument()
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
  })
})
