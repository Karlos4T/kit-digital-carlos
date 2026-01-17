'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

const storageKey = 'cookie-consent'

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const existing = window.localStorage.getItem(storageKey)
    if (!existing) setIsVisible(true)
  }, [])

  const setConsent = (value: 'accepted' | 'declined') => {
    window.localStorage.setItem(storageKey, value)
    document.cookie = `${storageKey}=${value}; path=/; max-age=31536000; samesite=lax`
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-3xl border border-white/10 bg-black/80 p-6 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Usamos cookies</p>
          <p className="mt-1 text-xs text-white/70">
            Utilizamos cookies para mejorar la experiencia y analizar el uso del sitio.{' '}
            <Link className="text-white underline underline-offset-4" href="/cookie-policy">
              Ver politica de cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setConsent('declined')}
            size="sm"
            variant="outline"
          >
            Rechazar
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => setConsent('accepted')}
            size="sm"
            variant="default"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}
