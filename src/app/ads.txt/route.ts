import { createAdsTxtLine } from '@/lib/adsense'

export function GET() {
  const line = createAdsTxtLine(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)
  if (!line) return new Response('Not configured', { status: 404 })

  return new Response(`${line}\n`, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
