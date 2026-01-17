import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'

import AdmZip from 'adm-zip'
import type { Field } from 'payload'
import { createPayloadRequest, getPayload } from 'payload'

import config from '@payload-config'

export const runtime = 'nodejs'

const configPromise = Promise.resolve(config)

const excludedCollections = new Set(['users', 'form-submissions', 'payload-jobs'])

const csvEscape = (value: unknown) => {
  const stringValue = String(value ?? '')
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

const serializeCSV = (rows: Record<string, unknown>[], columns: string[]) => {
  const header = columns.join(',')
  const lines = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(','))
  return [header, ...lines].join('\n')
}

const parseCSVLine = (line: string) => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }

  values.push(current)
  return values
}

const parseCSV = (input: string) => {
  const lines = input.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return []

  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? ''
      return acc
    }, {})
  })
}

const sanitizeDoc = (doc: Record<string, unknown>) => {
  const clone = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>
  delete clone.id
  delete clone._id
  delete clone.createdAt
  delete clone.updatedAt
  return clone
}

const getUploadFilePath = (filename: string) =>
  path.resolve(process.cwd(), 'public', 'media', filename)

const getCollectionOrder = (slugs: string[]) => {
  const preferred = ['media', 'categories', 'works', 'posts', 'forms', 'pages', 'redirects']
  const ordered = preferred.filter((slug) => slugs.includes(slug))
  const remaining = slugs.filter((slug) => !ordered.includes(slug))
  return [...ordered, ...remaining]
}

const remapRelationship = (
  value: unknown,
  relationTo: string | string[],
  idMap: Map<string, Map<string, string>>,
  mode: 'create' | 'update',
): unknown => {
  if (value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value
      .map((entry) => remapRelationship(entry, relationTo, idMap, mode))
      .filter((entry) => entry !== null && entry !== undefined)
  }

  if (Array.isArray(relationTo)) {
    if (typeof value === 'object' && value && 'relationTo' in value && 'value' in value) {
      const relation = value as { relationTo: string; value: unknown }
      const mapped = remapRelationship(relation.value, relation.relationTo, idMap, mode)
      if (!mapped) return mode === 'create' ? null : value
      return {
        ...relation,
        value: mapped,
      }
    }
    return value
  }

  const rawID =
    typeof value === 'object' && value && 'id' in value
      ? String((value as { id?: string }).id)
      : String(value)
  const mapped = idMap.get(relationTo)?.get(rawID)

  if (!mapped) {
    return mode === 'create' ? null : value
  }

  return mapped
}

const remapFields = (
  fields: Field[],
  data: Record<string, unknown>,
  idMap: Map<string, Map<string, string>>,
  mode: 'create' | 'update',
): Record<string, unknown> => {
  const next = { ...data }

  fields.forEach((field) => {
    if (!('name' in field) || !field.name) {
      if ('fields' in field && Array.isArray(field.fields)) {
        Object.assign(next, remapFields(field.fields, next, idMap, mode))
      }
      if ('tabs' in field && Array.isArray(field.tabs)) {
        field.tabs.forEach((tab) => {
          Object.assign(next, remapFields(tab.fields, next, idMap, mode))
        })
      }
      return
    }

    const fieldName = field.name
    const value = next[fieldName]
    if (value === undefined) return

    switch (field.type) {
      case 'relationship':
      case 'upload':
        next[fieldName] = remapRelationship(value, field.relationTo, idMap, mode)
        break
      case 'array':
        if (Array.isArray(value)) {
          next[fieldName] = value.map((row) =>
            remapFields(field.fields, row as Record<string, unknown>, idMap, mode),
          )
        }
        break
      case 'blocks':
        if (Array.isArray(value) && Array.isArray(field.blocks)) {
          next[fieldName] = value.map((block) => {
            if (!block || typeof block !== 'object') return block
            const blockType = (block as { blockType?: string }).blockType
            const blockConfig = field.blocks.find(
              (item) => typeof item !== 'string' && item.slug === blockType,
            )
            if (!blockConfig || typeof blockConfig === 'string') return block
            return remapFields(blockConfig.fields, block as Record<string, unknown>, idMap, mode)
          })
        }
        break
      case 'group':
        if (value && typeof value === 'object') {
          next[fieldName] = remapFields(
            field.fields,
            value as Record<string, unknown>,
            idMap,
            mode,
          )
        }
        break
      case 'tabs':
        field.tabs.forEach((tab) => {
          Object.assign(next, remapFields(tab.fields, next, idMap, mode))
        })
        break
      default:
        break
    }
  })

  return next
}

const remapDoc = (
  data: Record<string, unknown>,
  fields: Field[],
  idMap: Map<string, Map<string, string>>,
  mode: 'create' | 'update',
) => {
  const clone = JSON.parse(JSON.stringify(data)) as Record<string, unknown>
  return remapFields(fields, clone, idMap, mode)
}

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const payloadReq = await createPayloadRequest({ request, config: configPromise })

  if (!payloadReq.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const zip = new AdmZip()
  const collectionSlugs = payload.config.collections
    .map((collection) => collection.slug)
    .filter((slug) => !excludedCollections.has(slug))

  for (const slug of collectionSlugs) {
    const result = await payload.find({
      collection: slug,
      depth: 0,
      pagination: false,
      // Export is admin-only; bypass access controls to include all content.
      overrideAccess: true,
      req: payloadReq,
    })

    if (slug === 'media') {
      const rows = result.docs.map((doc) => {
        const record = sanitizeDoc(doc as Record<string, unknown>)
        return {
          id: doc.id,
          filename: doc.filename || '',
          data: JSON.stringify({
            alt: record.alt ?? null,
            caption: record.caption ?? null,
            mimeType: record.mimeType ?? null,
          }),
        }
      })
      const csv = serializeCSV(rows, ['id', 'filename', 'data'])
      zip.addFile(`collections/${slug}.csv`, Buffer.from(csv))

      for (const doc of result.docs) {
        if (doc.filename) {
          const filePath = getUploadFilePath(doc.filename)
          try {
            await fs.access(filePath)
            zip.addLocalFile(filePath, 'media')
          } catch {
            // ignore missing files
          }
        }
      }
      continue
    }

    const rows = result.docs.map((doc) => {
      const record = sanitizeDoc(doc as Record<string, unknown>)
      return {
        id: doc.id,
        slug: typeof doc.slug === 'string' ? doc.slug : '',
        data: JSON.stringify(record),
      }
    })

    const csv = serializeCSV(rows, ['id', 'slug', 'data'])
    zip.addFile(`collections/${slug}.csv`, Buffer.from(csv))
  }

  const globalSlugs = payload.config.globals.map((global) => global.slug)

  for (const slug of globalSlugs) {
    const globalDoc = await payload.findGlobal({
      slug,
      depth: 0,
      // Export is admin-only; bypass access controls to include all content.
      overrideAccess: true,
      req: payloadReq,
    })
    const data = sanitizeDoc(globalDoc as Record<string, unknown>)
    zip.addFile(`globals/${slug}.json`, Buffer.from(JSON.stringify(data, null, 2)))
  }

  const manifest = {
    exportedAt: new Date().toISOString(),
    collections: collectionSlugs,
    globals: globalSlugs,
    version: 1,
  }
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2)))

  const buffer = zip.toBuffer()
  const filename = `payload-export-${Date.now()}.zip`

  return new Response(buffer, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'application/zip',
    },
  })
}

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const payloadReq = await createPayloadRequest({ request, config: configPromise })

  if (!payloadReq.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('importFile')

  if (!file || !(file instanceof File)) {
    return new Response('Missing file', { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const zip = new AdmZip(buffer)
  const entries = zip.getEntries()

  const collectionsData = new Map<string, ReturnType<typeof parseCSV>>()
  const globalsData = new Map<string, Record<string, unknown>>()

  for (const entry of entries) {
    if (entry.entryName.startsWith('collections/') && entry.entryName.endsWith('.csv')) {
      const slug = entry.entryName.replace('collections/', '').replace('.csv', '')
      const content = entry.getData().toString('utf8')
      collectionsData.set(slug, parseCSV(content))
    }

    if (entry.entryName.startsWith('globals/') && entry.entryName.endsWith('.json')) {
      const slug = entry.entryName.replace('globals/', '').replace('.json', '')
      const content = entry.getData().toString('utf8')
      globalsData.set(slug, JSON.parse(content))
    }
  }

  const idMap = new Map<string, Map<string, string>>()
  const ensureMap = (slug: string) => {
    if (!idMap.has(slug)) idMap.set(slug, new Map())
    return idMap.get(slug)!
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'payload-import-'))

  const mediaRows = collectionsData.get('media') || []
  for (const row of mediaRows) {
    const filename = row.filename
    if (!filename) continue

    const entry = entries.find((item) => item.entryName === `media/${filename}`)
    if (!entry) continue

    const data = row.data ? JSON.parse(row.data) : {}
    const filePath = path.join(tempDir, filename)
    await fs.writeFile(filePath, entry.getData())

    const created = await payload.create({
      collection: 'media',
      data,
      filePath,
      overrideAccess: false,
      req: payloadReq,
    })

    ensureMap('media').set(row.id, String(created.id))
  }

  const collectionSlugs = getCollectionOrder([...collectionsData.keys()]).filter(
    (slug) => slug !== 'media',
  )

  const createdDocs: Array<{
    slug: string
    oldID: string
    newID: string
    data: Record<string, unknown>
  }> = []

  for (const slug of collectionSlugs) {
    const rows = collectionsData.get(slug) || []
    const collectionConfig = payload.config.collections.find((collection) => collection.slug === slug)
    if (!collectionConfig) continue

    for (const row of rows) {
      const data = row.data ? JSON.parse(row.data) : {}
      const prepared = remapDoc(data, collectionConfig.fields, idMap, 'create')

      let created
      if (typeof data.slug === 'string' && data.slug) {
        const existing = await payload.find({
          collection: slug,
          depth: 0,
          limit: 1,
          overrideAccess: false,
          pagination: false,
          req: payloadReq,
          where: {
            slug: {
              equals: data.slug,
            },
          },
        })

        if (existing.docs?.[0]) {
          created = await payload.update({
            collection: slug,
            id: existing.docs[0].id,
            data: prepared,
            overrideAccess: false,
            req: payloadReq,
          })
        }
      }

      if (!created) {
        created = await payload.create({
          collection: slug,
          data: prepared,
          overrideAccess: false,
          req: payloadReq,
        })
      }

      ensureMap(slug).set(row.id, String(created.id))
      createdDocs.push({ slug, oldID: row.id, newID: String(created.id), data })
    }
  }

  for (const entry of createdDocs) {
    const collectionConfig = payload.config.collections.find((collection) => collection.slug === entry.slug)
    if (!collectionConfig) continue

    const updatedData = remapDoc(entry.data, collectionConfig.fields, idMap, 'update')

    await payload.update({
      collection: entry.slug,
      id: entry.newID,
      data: updatedData,
      overrideAccess: false,
      req: payloadReq,
    })
  }

  for (const [slug, data] of globalsData) {
    const globalConfig = payload.config.globals.find((global) => global.slug === slug)
    if (!globalConfig) continue

    const updatedData = remapDoc(data, globalConfig.fields, idMap, 'update')

    await payload.updateGlobal({
      slug,
      data: updatedData,
      overrideAccess: false,
      req: payloadReq,
    })
  }

  return Response.json({
    collections: collectionSlugs,
    globals: [...globalsData.keys()],
    media: mediaRows.length,
    status: 'ok',
  })
}
