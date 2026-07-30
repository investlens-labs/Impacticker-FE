import type { PortfolioItem } from '@/lib/api/types'

export function addPortfolioItem(current: PortfolioItem[] | undefined, created: PortfolioItem) {
  const items = current ?? []
  return items.some((item) => item.instrumentId === created.instrumentId) ? items : [...items, created]
}

export function removePortfolioItem(current: PortfolioItem[] | undefined, removedId: string) {
  return (current ?? []).filter((item) => item.id !== removedId)
}
