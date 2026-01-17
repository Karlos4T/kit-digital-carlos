'use client'

import { Link, NavGroup, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'
import { formatAdminURL } from 'payload/shared'

const baseClass = 'nav'

export const ImportExportNavLink: React.FC = () => {
  const pathname = usePathname()
  const { config } = useConfig()
  const href = formatAdminURL({ adminRoute: config.routes.admin, path: '/import-export' })
  const isActive = pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])

  const Label = (
    <>
      {isActive && <div className={`${baseClass}__link-indicator`} />}
      <span className={`${baseClass}__link-label`}>Importar / Exportar</span>
    </>
  )

  return (
    <NavGroup isOpen label="Herramientas">
      {pathname === href ? (
        <div className={`${baseClass}__link`} id="nav-import-export">
          {Label}
        </div>
      ) : (
        <Link className={`${baseClass}__link`} href={href} id="nav-import-export" prefetch={false}>
          {Label}
        </Link>
      )}
    </NavGroup>
  )
}

export default ImportExportNavLink
