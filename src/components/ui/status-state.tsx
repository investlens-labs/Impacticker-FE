'use client'

import {
  AlertTriangle,
  Clock3,
  Inbox,
  LoaderCircle,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
  WifiOff,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getApiErrorKind, type ApiErrorKind } from '@/lib/api/error-feedback'
import { Button } from './button'

interface StatusStateProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  actionPending?: boolean
  compact?: boolean
}

interface ErrorNoticeProps {
  error: unknown
  fallback: string
  className?: string
}

export function StatusState({ title, description, icon: Icon = Inbox, actionLabel, onAction, actionPending, compact }: StatusStateProps) {
  return (
    <div className={`surface flex flex-col items-center justify-center text-center ${compact ? 'min-h-44 p-5' : 'min-h-72 p-8'}`}>
      <span className="mb-3 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon aria-hidden className="size-5" />
      </span>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction && <Button className="mt-4" variant="secondary" icon={RefreshCw} loading={actionPending} disabled={actionPending} onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}

export function LoadingState({ label }: { label?: string }) {
  const t = useTranslations('status')
  return (
    <div className="surface flex min-h-52 flex-col items-center justify-center p-6 text-center" role="status">
      <LoaderCircle className="size-6 animate-spin text-brand-600" aria-hidden />
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{label ?? t('loading')}</p>
      <p className="mt-1 text-xs text-slate-500">{t('coldStart')}</p>
    </div>
  )
}

const errorIcons: Record<ApiErrorKind, LucideIcon> = {
  network: WifiOff,
  timeout: Clock3,
  rateLimit: Clock3,
  server: ServerCrash,
  forbidden: ShieldAlert,
  unauthorized: ShieldAlert,
  generic: AlertTriangle,
}

export function ErrorState({ error, onRetry, retrying, compact }: { error?: unknown; onRetry: () => void; retrying?: boolean; compact?: boolean }) {
  const t = useTranslations('status')
  const common = useTranslations('common')
  const kind = getApiErrorKind(error)
  return (
    <StatusState
      compact={compact}
      title={t(`errors.${kind}.title`)}
      description={t(`errors.${kind}.description`)}
      icon={errorIcons[kind]}
      actionLabel={common('retry')}
      onAction={onRetry}
      actionPending={retrying}
    />
  )
}

export function ErrorNotice({ error, fallback, className = '' }: ErrorNoticeProps) {
  const t = useTranslations('status')
  const kind = getApiErrorKind(error)
  const message = kind === 'generic' ? fallback : t(`errors.${kind}.inline`)

  return (
    <p
      role="alert"
      className={`rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300 ${className}`}
    >
      {message}
    </p>
  )
}
