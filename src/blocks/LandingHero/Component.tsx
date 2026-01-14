import React from 'react'

import type { LandingHeroBlock as LandingHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const LandingHeroBlock: React.FC<LandingHeroBlockProps> = ({ cta, title }) => {
  return (
    <section className="home-hero">
      <div className="container relative py-28 md:py-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          {cta && (
            <div className="mt-10">
              <CMSLink
                {...cta}
                className="group rounded-full bg-primary px-8 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-primary-foreground shadow-[0_20px_40px_rgba(72,187,123,0.25)] transition hover:bg-primary/90"
              >
                <span className="ml-2 text-[0.65rem] text-primary-foreground/80 transition group-hover:text-primary-foreground">
                  -&gt;
                </span>
              </CMSLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
