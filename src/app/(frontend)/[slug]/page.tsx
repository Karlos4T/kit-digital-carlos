import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs?.[0] || null

  if (!page || !page.layout || page.layout.length === 0) {
    return page
  }

  const worksGalleryBlock = page.layout.find(
    (block) =>
      block.blockType === 'worksGallery' &&
      Array.isArray(block.works) &&
      block.works.length > 0,
  )

  if (!worksGalleryBlock || !Array.isArray(worksGalleryBlock.works)) {
    return page
  }

  const worksRefs = worksGalleryBlock.works
  const workIDs = worksRefs
    .map((work) => (typeof work === 'string' ? work : work?.id))
    .filter((id): id is string => Boolean(id))

  const worksResult = workIDs.length
    ? await payload.find({
        collection: 'works',
        depth: 1,
        limit: workIDs.length,
        overrideAccess: draft ? true : false,
        pagination: false,
        where: {
          id: {
            in: workIDs,
          },
        },
      })
    : { docs: [] }

  const worksByID = new Map(worksResult.docs.map((work) => [String(work.id), work]))
  const resolvedWorks = worksRefs
    .map((work) => {
      if (!work) return null
      if (typeof work === 'string') return worksByID.get(work) || null
      return work
    })
    .filter((work): work is RequiredDataFromCollectionSlug<'works'> => Boolean(work))

  if (resolvedWorks.length === 0) {
    return page
  }

  const projectsFromWorks = resolvedWorks.map((work) => ({
    title: work.title || 'Project',
    scope: work.label,
    tags: [],
    image: work.heroImage,
  }))

  const nextLayout = page.layout.map((block) => {
    if (block.blockType === 'projectsHighlight') {
      if (!block.projects || block.projects.length === 0) {
        return {
          ...block,
          projects: projectsFromWorks,
        }
      }
    }

    if (block.blockType === 'worksGallery') {
      return {
        ...block,
        works: resolvedWorks,
      }
    }

    return block
  })

  return {
    ...page,
    layout: nextLayout,
  }
})
