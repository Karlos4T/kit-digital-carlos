'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

const exportEndpoint = '/api/import-export'

export const ImportExportView: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    try {
      const response = await fetch(exportEndpoint, { method: 'GET' })
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Export failed')
      }

      const blob = await response.blob()
      const filename =
        response.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] ||
        'payload-export.zip'
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get('importFile')

    if (!file || !(file instanceof File)) {
      setImportError('Selecciona un archivo ZIP.')
      return
    }

    setIsImporting(true)
    setImportError(null)
    setImportResult(null)

    try {
      const response = await fetch(exportEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Import failed')
      }

      const result = await response.json()
      setImportResult(JSON.stringify(result, null, 2))
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Backup ZIP
            </span>
            <span className="text-xs text-white/40">Admin tools</span>
          </div>
          <h1 className="text-3xl font-semibold text-white">Importar y Exportar</h1>
          <p className="max-w-2xl text-sm text-white/65">
            Descarga un ZIP con todo el contenido editable o restaura un ZIP existente en segundos.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-black/50 p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Exportar</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Genera un ZIP con colecciones, globals y archivos de media.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  Solo lectura
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button disabled={isExporting} onClick={handleExport} size="sm">
                  {isExporting ? 'Exportando...' : 'Exportar ZIP'}
                </Button>
                {exportError && <p className="text-sm text-red-400">{exportError}</p>}
              </div>
            </section>

            <form
              className="rounded-2xl border border-white/10 bg-black/50 p-6"
              onSubmit={handleImport}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Importar</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Sube el ZIP exportado para restaurar contenido. Mantén el archivo original sin
                    modificar.
                  </p>
                </div>
                <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
                  Reemplaza datos
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
                  <span className="text-xs uppercase tracking-wide text-white/40">
                    Archivo ZIP
                  </span>
                  <input
                    accept=".zip"
                    className="mt-2 block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/20"
                    name="importFile"
                    onChange={(event) =>
                      setSelectedFileName(event.currentTarget.files?.[0]?.name ?? null)
                    }
                    type="file"
                  />
                  {selectedFileName && (
                    <p className="mt-2 text-xs text-emerald-200">Seleccionado: {selectedFileName}</p>
                  )}
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <Button disabled={isImporting} size="sm" type="submit" variant="outline">
                    {isImporting ? 'Importando...' : 'Importar ZIP'}
                  </Button>
                  {importError && <p className="text-sm text-red-400">{importError}</p>}
                </div>

                {importResult && (
                  <div className="rounded-xl border border-white/10 bg-black/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      Resultado
                    </p>
                    <pre className="mt-3 max-h-64 overflow-auto text-xs text-white/70">
                      {importResult}
                    </pre>
                  </div>
                )}
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Incluye
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-center justify-between">
                  <span>Colecciones</span>
                  <span className="text-xs text-white/40">CSV + JSON</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Globals</span>
                  <span className="text-xs text-white/40">JSON</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Media</span>
                  <span className="text-xs text-white/40">Archivos</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Relaciones</span>
                  <span className="text-xs text-white/40">Re-mapeo</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Recomendaciones
              </h3>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <p>Haz un export antes de importar para conservar una copia de seguridad.</p>
                <p>El import reescribe documentos existentes con el mismo slug.</p>
                <p>Los archivos se omiten si ya existen por filename.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ImportExportView
