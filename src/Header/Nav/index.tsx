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
    <nav className="flex items-center gap-8 text-[0.7rem] uppercase tracking-[0.28em] text-white/70">
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
          className="rounded-full border border-white/25 px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary/60 hover:text-primary"
        />
      )}
      <button
        className="rounded-full border border-white/20 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-primary/60 hover:text-white"
        onClick={toggleLanguage}
        type="button"
      >
        {lang === 'es' ? 'EN' : 'ES'}
      </button>
    </nav>
  )
}
