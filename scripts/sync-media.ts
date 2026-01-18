import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'node:fs/promises'
import path from 'node:path'

const mediaDir = path.resolve(process.cwd(), 'public', 'media')

const sizeSuffixes = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og']

const supportedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.svg',
])

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

const isGeneratedSize = (filename: string) => {
  return sizeSuffixes.some((suffix) => filename.includes(`-${suffix}`))
}

const isIgnoredFile = (filename: string) => {
  return (
    filename.startsWith('.') ||
    filename.startsWith('._') ||
    filename === 'Thumbs.db' ||
    isGeneratedSize(filename)
  )
}

const listFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)))
      continue
    }

    files.push(entryPath)
  }

  return files
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  const files = await listFiles(mediaDir)
  const candidates = files
    .map((filePath) => ({
      filePath,
      filename: path.basename(filePath),
      ext: path.extname(filePath).toLowerCase(),
    }))
    .filter(({ filename, ext }) => !isIgnoredFile(filename) && supportedExtensions.has(ext))

  if (candidates.length === 0) {
    payload.logger.info('No media files found to sync.')
    return
  }

  let created = 0
  let skipped = 0

  for (const { filePath, filename, ext } of candidates) {
    const existing = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        filename: {
          equals: filename,
        },
      },
    })

    if (existing.docs?.length) {
      skipped += 1
      continue
    }

    const buffer = await fs.readFile(filePath)
    const stat = await fs.stat(filePath)

    await payload.create({
      collection: 'media',
      data: {
        alt: path.parse(filename).name,
      },
      file: {
        data: buffer,
        mimetype: mimeTypes[ext] || 'application/octet-stream',
        name: filename,
        size: stat.size,
      },
    })

    created += 1
  }

  payload.logger.info(`Media sync complete. Created: ${created}, Skipped: ${skipped}.`)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})
