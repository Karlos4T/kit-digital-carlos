import React from 'react'

import type { AboutMeBlock as AboutMeBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const splitParagraphs = (value?: string | null) =>
  value
    ?.split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) || []

export const AboutMeBlock: React.FC<AboutMeBlockProps> = ({
  heroSubtitle,
  heroTitle,
  images,
  missionBody,
  missionTitle,
  showDivider,
  socialHeading,
  socialLinks,
}) => {
  const paragraphs = splitParagraphs(missionBody)

  return (
    <section className="relative">
      <div className="container pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {heroTitle}
          </h1>
          {heroSubtitle && <p className="text-sm text-white/60">{heroSubtitle}</p>}
        </div>
        {showDivider && <div className="mt-10 h-px w-full bg-white/10" />}

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.05fr] md:items-start md:gap-16">
          <h2 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            {missionTitle}
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-white/65">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{missionBody}</p>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="relative">
            <div className="pointer-events-none absolute -left-4 top-10 h-20 w-5 rounded-full border border-primary/40 md:block" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
              {images?.primary && typeof images.primary === 'object' ? (
                <Media className="h-full w-full" imgClassName="object-cover" resource={images.primary} />
              ) : (
                <img
                  alt="Primary portrait"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?q=80&w=1200&auto=format&fit=crop"
                />
              )}
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -right-4 bottom-6 h-12 w-24 rounded-full border border-primary/40 md:block" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
              {images?.secondary && typeof images.secondary === 'object' ? (
                <Media
                  className="h-full w-full"
                  imgClassName="object-cover"
                  resource={images.secondary}
                />
              ) : (
                <img
                  alt="Secondary portrait"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                />
              )}
            </div>
          </div>
        </div>

        {(socialHeading || (socialLinks && socialLinks.length > 0)) && (
          <div className="mt-12">
            {socialHeading && (
              <p className="text-base font-semibold text-white">{socialHeading}</p>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                {socialLinks.map((item, index) => (
                  <CMSLink key={item.id ?? index} {...item.link} className="hover:text-white" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
