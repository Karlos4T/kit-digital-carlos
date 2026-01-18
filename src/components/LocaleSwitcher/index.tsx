'use client'

import React from 'react'
import { useConfig, useLocale } from '@payloadcms/ui'

export const LocaleSwitcher: React.FC = () => {
  const { config } = useConfig()
  const { locale, setLocale } = useLocale()

  const locales = config?.localization?.locales ?? config?.i18n?.locales ?? []

  if (!locales.length || !setLocale) return null

  return (
    <div className="field-type">
      <label className="field-label">Locale</label>
      <select
        className="input"
        onChange={(event) => setLocale(event.target.value)}
        value={locale}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {value.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LocaleSwitcher
