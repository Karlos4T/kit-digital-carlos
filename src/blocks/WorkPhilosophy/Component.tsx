import React from 'react'

import type { WorkPhilosophyBlock as WorkPhilosophyBlockProps } from '@/payload-types'

const splitParagraphs = (value?: string | null) =>
  value
    ?.split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) || []

export const WorkPhilosophyBlock: React.FC<WorkPhilosophyBlockProps> = ({
  author,
  body,
  title,
}) => {
  const paragraphs = splitParagraphs(body)

  return (
    <section className="relative overflow-hidden">
      <div className="container py-24">
        <div className="relative max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/70">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {author && <p className="mt-6 text-sm font-semibold text-primary">- {author}</p>}
        </div>
      </div>
    </section>
  )
}
