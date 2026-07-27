import { ApiError } from './client'

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'rateLimit'
  | 'server'
  | 'forbidden'
  | 'unauthorized'
  | 'generic'

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (!(error instanceof ApiError)) return 'generic'
  if (error.status === 0) return 'network'
  if (error.status === 401) return 'unauthorized'
  if (error.status === 403) return 'forbidden'
  if (error.status === 408 || error.status === 504) return 'timeout'
  if (error.status === 429) return 'rateLimit'
  if (error.status >= 500) return 'server'
  return 'generic'
}
