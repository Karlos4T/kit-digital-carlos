import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []

  return (
    <footer className="mt-auto border-t border-white/5 bg-black text-white">
      <div className="container py-16">
        <div className="text-center">
          {footerData?.contactHeading && (
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              {footerData.contactHeading}
            </p>
          )}
          {footerData?.contactEmail && (
            <a
              className="mt-6 inline-flex text-2xl font-semibold text-white underline underline-offset-8 md:text-4xl"
              href={`mailto:${footerData.contactEmail}`}
            >
              {footerData.contactEmail}
            </a>
          )}
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
          <Link aria-label="Inicio" className="flex items-center" href="/">
            {footerData?.logo && typeof footerData.logo === 'object' ? (
              <Media
                className="h-9 w-[300px]"
                imgClassName="h-9 w-[300px] object-contain"
                resource={footerData.logo}
              />
            ) : (
              <Logo className="text-white" />
            )}
          </Link>

          <div className="space-y-2 text-sm text-white/60">
            {footerData?.location && <p>{footerData.location}</p>}
            {footerData?.phone && <p>{footerData.phone}</p>}
          </div>

          <div className="space-y-6">
            <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    ariaLabel={link?.label || link?.url || 'Enlace social'}
                    className="transition-colors hover:text-white"
                    key={i}
                    {...link}
                    appearance="inline"
                  />
                )
              })}
            </nav>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                {socialLinks.map(({ link }, i) => (
                  <CMSLink
                    ariaLabel={link?.label || link?.url || 'Enlace social'}
                    className="transition-colors hover:text-white"
                    key={i}
                    {...link}
                    appearance="inline"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {footerData?.legalText && (
          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            {footerData.legalText}
          </div>
        )}

        {(footerData?.bottomText || footerData?.bottomImage) && (
          <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-center">
            {footerData?.bottomText && (
              <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                {footerData.bottomText}
              </p>
            )}
            {footerData?.bottomImage && typeof footerData.bottomImage === 'object' && (
              <Media
                className="h-16 w-auto"
                imgClassName="h-16 w-auto object-contain"
                resource={footerData.bottomImage}
              />
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
