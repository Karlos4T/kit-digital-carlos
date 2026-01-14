'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const cta = data?.cta

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
    </nav>
  )
}
