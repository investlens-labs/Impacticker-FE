'use client'

import { useEffect, useRef } from 'react'
import { isAdsensePlacementEnabled } from '@/lib/adsense'

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      requestNonPersonalizedAds?: number
    }
  }
}

interface AdSlotProps {
  clientId?: string
  slot?: string
  enabled?: string
  privacyContact?: string
  label: string
  className?: string
  minHeight?: number
}

const ADSENSE_SCRIPT_ID = 'impacticker-adsense'

export function AdSlot({
  clientId,
  slot,
  enabled,
  privacyContact,
  label,
  className = '',
  minHeight = 96,
}: AdSlotProps) {
  const initialized = useRef(false)
  const configured = isAdsensePlacementEnabled({ enabled, clientId, slot, privacyContact })

  useEffect(() => {
    if (!configured || initialized.current) return
    initialized.current = true

    const queue = window.adsbygoogle ?? []
    queue.requestNonPersonalizedAds = 1
    window.adsbygoogle = queue

    if (!document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = ADSENSE_SCRIPT_ID
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
      document.head.appendChild(script)
    }

    queue.push({})
  }, [clientId, configured])

  if (!configured) return null

  return (
    <aside
      aria-label={label}
      className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-2 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
    >
      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block', minHeight }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest={process.env.NODE_ENV === 'production' ? undefined : 'on'}
      />
    </aside>
  )
}
