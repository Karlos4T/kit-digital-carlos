import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'node:fs/promises'
import path from 'node:path'

type ProjectSeed = {
  name: string
  type: string
  duration?: string | null
  technologies?: string[]
  description_technical: string
  why_project: string
}

type WorksSeedFile = {
  projects: ProjectSeed[]
}

const mediaDir = path.resolve(process.cwd(), 'public', 'media')
const seedPath = path.resolve(process.cwd(), 'data', 'works.json')

const defaultHeroImage = 'Diseño sin título-3.jpg'

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const getOrCreateMediaByFilename = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
) => {
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

  if (existing.docs?.[0]) return existing.docs[0]

  const filePath = path.join(mediaDir, filename)
  try {
    await fs.access(filePath)
  } catch {
    payload.logger.warn(`Media file not found at ${filePath}.`)
    return null
  }

  const fileBuffer = await fs.readFile(filePath)
  const stats = await fs.stat(filePath)
  const ext = path.extname(filename).toLowerCase()

  return payload.create({
    collection: 'media',
    data: {
      alt: path.parse(filename).name,
    },
    file: {
      data: fileBuffer,
      mimetype: mimeTypes[ext] || 'application/octet-stream',
      name: filename,
      size: stats.size,
    },
  })
}

const getAnyMediaFallback = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
  })

  return existing.docs?.[0] || null
}

const buildStoryBody = (project: ProjectSeed) => {
  const techLine = project.technologies?.length
    ? `Tecnologias: ${project.technologies.join(', ')}`
    : null
  return [project.description_technical, techLine].filter(Boolean).join('\n\n')
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const seedRaw = await fs.readFile(seedPath, 'utf-8')
  const seedData = JSON.parse(seedRaw) as WorksSeedFile

  if (!seedData.projects?.length) {
    payload.logger.warn('No projects found in data/works.json')
    return
  }

  const heroImage =
    (await getOrCreateMediaByFilename(payload, defaultHeroImage)) ||
    (await getAnyMediaFallback(payload))

  if (!heroImage) {
    payload.logger.warn('No media available. Skipping works sync.')
    return
  }

  let created = 0
  let updated = 0

  for (const project of seedData.projects) {
    const slug = slugify(project.name)
    const existing = await payload.find({
      collection: 'works',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const data = {
      title: project.name,
      label: project.type,
      subtitle: project.duration || project.technologies?.join(' · ') || undefined,
      heroImage: heroImage.id,
      storyTitle: 'Detalles tecnicos',
      storyBody: buildStoryBody(project),
      storyImages: [{ image: heroImage.id }],
      descriptionTitle: 'Por que este proyecto',
      descriptionBody: project.why_project,
      slug,
    }

    if (existing.docs?.[0]) {
      await payload.update({
        collection: 'works',
        id: existing.docs[0].id,
        data,
      })
      updated += 1
    } else {
      await payload.create({
        collection: 'works',
        data,
      })
      created += 1
    }
  }

  payload.logger.info(`Works sync complete. Created: ${created}, Updated: ${updated}.`)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})
