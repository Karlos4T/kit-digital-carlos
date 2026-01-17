'use client'

import Link from 'next/link'
import React from 'react'

export const ImportExportSettingsLink = () => {
  return (
    <Link className="text-sm text-white/80 hover:text-white" href="/admin/import-export">
      Importar / Exportar
    </Link>
  )
}

export default ImportExportSettingsLink
