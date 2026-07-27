import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/render'
import { ApiError } from '@/lib/api/client'
import { ErrorNotice, ErrorState } from './status-state'

describe('오류 상태 피드백', () => {
  it('네트워크 오류의 원인과 사용자가 할 일을 안내한다', () => {
    const retry = vi.fn()
    renderWithIntl(<ErrorState error={new ApiError('offline', 0)} onRetry={retry} />)

    expect(screen.getByRole('heading', { name: '인터넷 연결을 확인해 주세요' })).toBeInTheDocument()
    expect(screen.getByText(/연결 상태를 확인한 뒤 다시 시도/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('서버 오류를 사용자에게 백엔드 용어 없이 안내한다', () => {
    renderWithIntl(<ErrorNotice error={new ApiError('Internal Server Error', 503)} fallback="삭제 실패" />)

    expect(screen.getByRole('alert')).toHaveTextContent('서비스 연결이 원활하지 않습니다')
    expect(screen.queryByText(/Internal Server Error/)).not.toBeInTheDocument()
  })

  it('분류할 수 없는 작업 오류에는 화면별 문구를 사용한다', () => {
    renderWithIntl(<ErrorNotice error={new ApiError('Bad Request', 400)} fallback="이미 등록된 종목인지 확인해 주세요." />)

    expect(screen.getByRole('alert')).toHaveTextContent('이미 등록된 종목인지 확인해 주세요.')
  })
})
