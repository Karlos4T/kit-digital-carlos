import React from 'react'

import type { AboutCloserBlock as AboutCloserBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const splitParagraphs = (value?: string | null) =>
  value
    ?.split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) || []

export const AboutCloserBlock: React.FC<AboutCloserBlockProps> = ({
  body,
  cta,
  image,
  title,
}) => {
  const fallbackImage = '/media/Disen%CC%83o%20sin%20ti%CC%81tulo-3.jpg'
  const paragraphs = splitParagraphs(body)

  return (
    <section className="relative overflow-hidden">
      <div className="container grid gap-12 py-24 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div className="relative">
          <div className="pointer-events-none absolute -left-6 top-12 hidden h-20 w-5 rounded-full border border-primary/40 md:block" />
          <div className="pointer-events-none absolute -right-5 bottom-10 hidden h-24 w-6 rounded-full border border-primary/20 md:block" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-card/60 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
            {image && typeof image === 'object' ? (
              <Media className="h-full w-full" imgClassName="object-cover" resource={image} />
            ) : (
              <img
                alt="Portrait"
                className="h-full w-full object-cover"
                src={fallbackImage}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/70">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {cta && (
            <div className="mt-8">
              <CMSLink
                {...cta}
                className="rounded-full border border-primary/40 px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-primary transition hover:bg-primary/10"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
