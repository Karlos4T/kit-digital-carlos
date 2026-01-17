import type { LegalTextBlock } from '@/payload-types'

import React from 'react'

import RichText from '@/components/RichText'

export const LegalTextBlock: React.FC<LegalTextBlock> = ({
  ctaEmail,
  ctaHeading,
  dateLabel,
  sections,
  title,
}) => {
  return (
    <section className="relative">
      <div className="container py-24">
        <div className="max-w-2xl">
          {dateLabel && (
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{dateLabel}</p>
          )}
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="mt-10 h-px w-full bg-white/10" />

        <div className="mt-12 max-w-3xl space-y-12">
          {sections?.map((section, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-white md:text-3xl">
                {section.heading}
              </h3>
              {section.body && (
                <RichText
                  className="mt-4 text-sm leading-relaxed text-white/70"
                  data={section.body}
                  enableGutter={false}
                  enableProse={false}
                />
              )}
            </div>
          ))}
        </div>

        {(ctaHeading || ctaEmail) && (
          <div className="mt-16 text-center">
            {ctaHeading && (
              <p className="text-xs uppercase tracking-[0.3em] text-primary">{ctaHeading}</p>
            )}
            {ctaEmail && (
              <a
                className="mt-4 block text-2xl font-semibold text-white underline underline-offset-4 md:text-4xl"
                href={`mailto:${ctaEmail}`}
              >
                {ctaEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
