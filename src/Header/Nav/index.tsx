'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const cta = data?.cta
  const router = useRouter()
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const currentLang = document.documentElement.lang
    setLang(currentLang === 'en' ? 'en' : 'es')
  }, [])

  const toggleLanguage = () => {
    const next = lang === 'es' ? 'en' : 'es'
    document.cookie = `lang=${next}; path=/; max-age=31536000`
    setLang(next)
    router.refresh()
  }

  return (
    <div className="relative flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.28em] text-white/70">
      <button
        className="rounded-full border border-white/20 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-primary/60 hover:text-white md:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Menu
      </button>
      <nav
        className={`absolute right-0 top-full z-30 mt-3 w-64 rounded-2xl border border-white/10 bg-black/95 p-6 text-xs text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition md:static md:mt-0 md:flex md:w-auto md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100'
        }`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                className="transition-colors hover:text-white"
                key={i}
                {...link}
                appearance="inline"
              />
            )
          })}
          {cta && (
            <CMSLink
              {...cta}
              className="mt-3 rounded-full border border-white/25 px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-black transition hover:border-primary/60 hover:text-primary md:mt-0"
            />
          )}
          <button
            className="rounded-full border border-white/20 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-primary/60 hover:text-white"
            onClick={toggleLanguage}
            type="button"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>
    </div>
  )
}
