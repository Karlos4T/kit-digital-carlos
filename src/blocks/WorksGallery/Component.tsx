'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { WorksGalleryBlock as WorksGalleryBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { worksSeedData } from '@/endpoints/seed/works'

export const WorksGalleryBlock: React.FC<WorksGalleryBlockProps> = ({
  cta,
  searchLabel,
  subtitle,
  title,
  works,
}) => {
  const [isActive, setIsActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus()
    }
  }, [isActive])

  return (
    <section className="relative overflow-hidden">
      <div className="container py-24">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{title}</h1>
          {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
        </div>

        <div className="mt-12">
          <div
            className={cn(
              'flex items-center gap-4 border-b pb-4 transition-colors duration-300',
              isActive ? 'border-primary' : 'border-white/15',
            )}
          >
            <input
              ref={inputRef}
              className={cn(
                'w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none focus:placeholder-transparent transition-colors',
                'text-left',
              )}
              onBlur={() => setIsActive(false)}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => setIsActive(true)}
              placeholder={searchLabel || 'Search'}
              type="text"
              value={searchValue}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {(works && works.length > 0 ? works : worksSeedData).map((item, index) => {
            if (!item || typeof item !== 'object') return null

            const heroImage =
              'heroImage' in item && item.heroImage && typeof item.heroImage === 'object'
                ? item.heroImage
                : null
            const imageUrl =
              heroImage && typeof heroImage === 'object'
                ? heroImage.url
                : 'heroImageUrl' in item
                  ? item.heroImageUrl
                  : 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1400&auto=format&fit=crop'
            const titleText = 'title' in item && item.title ? item.title : 'Project'
            const labelText = 'label' in item && item.label ? item.label : ''
            const slugText = 'slug' in item && item.slug ? item.slug : ''

            if (!slugText) return null

            return (
              <Link
                className="text-center transition-transform duration-300 ease-out hover:-translate-y-1"
                href={`/my-works/${slugText}`}
                key={index}
              >
                <div className="aspect-square overflow-hidden rounded-[18px] bg-black/40">
                  <img alt={titleText} className="h-full w-full object-cover" src={imageUrl} />
                </div>
                <div className="mt-4">
                  {labelText && (
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/50">
                      {labelText}
                    </p>
                  )}
                  <h3 className="mt-2 text-lg font-semibold text-white">{titleText}</h3>
                </div>
              </Link>
            )
          })}
        </div>

        {cta && (
          <div className="mt-12 flex justify-center">
            <CMSLink
              {...cta}
              className="rounded-full border border-primary/40 px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-primary transition hover:bg-primary/10"
            />
          </div>
        )}
      </div>
    </section>
  )
}
