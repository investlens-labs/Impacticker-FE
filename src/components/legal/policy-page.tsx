import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import logo from '@/app/icon.png'

export interface PolicySection {
  title: string
  content: ReactNode
}

interface PolicyPageProps {
  eyebrow: string
  title: string
  description: string
  updatedLabel: string
  updatedAt: string
  backLabel: string
  sections: PolicySection[]
}

export function PolicyPage({
  eyebrow,
  title,
  description,
  updatedLabel,
  updatedAt,
  backLabel,
  sections,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#0d1211] dark:text-white">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex h-14 max-w-4xl items-center px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src={logo} alt="" className="size-7 rounded-lg object-contain" />
            Impacticker
          </Link>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-14">
        <Link href="/" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800">
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
        <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
          <p className="mt-2 text-xs text-slate-400">{updatedLabel}: {updatedAt}</p>
          <div className="mt-8 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {sections.map((section) => (
              <section key={section.title} className="py-6">
                <h2 className="text-base font-semibold">{section.title}</h2>
                <div className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}
