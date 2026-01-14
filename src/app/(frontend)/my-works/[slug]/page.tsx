import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { worksSeedData } from '@/endpoints/seed/works'
import { Media } from '@/components/Media'

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const payload = await getPayload({ config: configPromise })

  const workResult = await payload.find({
    collection: 'works',
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const work = workResult.docs?.[0] ?? null
  const allWorksResult = await payload.find({
    collection: 'works',
    limit: 100,
    overrideAccess: false,
  })

  const allWorks = allWorksResult.docs || []
  const fallbackWork = worksSeedData.find((item) => item.slug === slug) || null

  if (!work && !fallbackWork) {
    notFound()
  }

  const title = work?.title || fallbackWork?.title || 'Project Title'
  const subtitle = work?.subtitle || fallbackWork?.subtitle || 'Details About The Project'
  const heroImage =
    work?.heroImage && typeof work.heroImage === 'object' ? work.heroImage : null
  const heroImageUrl = fallbackWork?.heroImageUrl
  const storyTitle = work?.storyTitle || fallbackWork?.storyTitle || 'Project Story'
  const storyBody = work?.storyBody || fallbackWork?.storyBody || ''
  const descriptionTitle =
    work?.descriptionTitle || fallbackWork?.descriptionTitle || 'Description'
  const descriptionBody = work?.descriptionBody || fallbackWork?.descriptionBody || ''
  const storyImages =
    work?.storyImages?.map((item) => (item?.image && typeof item.image === 'object' ? item : null)) ||
    []
  const fallbackStoryImages = fallbackWork?.storyImages || []

  const worksSource = allWorks.length > 0 ? allWorks : worksSeedData
  const workIndex = worksSource.findIndex((item) =>
    typeof item === 'object' && 'slug' in item ? item.slug === slug : false,
  )
  const prevWork =
    workIndex > 0 ? worksSource[workIndex - 1] : workIndex === 0 ? worksSource.at(-1) : null
  const nextWork =
    workIndex >= 0 && workIndex < worksSource.length - 1
      ? worksSource[workIndex + 1]
      : workIndex >= 0
        ? worksSource[0]
        : null

  const otherProjects =
    work?.otherProjects?.filter((item) => item && typeof item === 'object') || []
  const fallbackOthers = worksSeedData.filter((item) => item.slug !== slug).slice(0, 3)

  return (
    <article className="pb-24">
      <section className="container py-20">
        <div className="fade-up">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{title}</h1>
          <p className="mt-2 text-sm text-white/50">{subtitle}</p>
        </div>
        <div className="mt-10 h-px w-full bg-white/15 fade-up fade-up--delay-1" />

        <div className="mt-12 aspect-[11/6] overflow-hidden rounded-[18px] fade-up fade-up--delay-2">
          {heroImage ? (
            <Media className="h-full w-full" imgClassName="object-cover" resource={heroImage} />
          ) : heroImageUrl ? (
            <img alt={title} className="h-full w-full object-cover" src={heroImageUrl} />
          ) : null}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center fade-up fade-up--delay-3">
          <h2 className="text-xl font-semibold text-white">{storyTitle}</h2>
          {storyBody && (
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/60 text-center">
              {storyBody.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 fade-up">
          {storyImages.length > 0
            ? storyImages.slice(0, 2).map((item, index) => (
                <div className="aspect-square overflow-hidden rounded-[18px]" key={index}>
                  {item?.image && typeof item.image === 'object' && (
                    <Media
                      className="h-full w-full"
                      imgClassName="object-cover"
                      resource={item.image}
                    />
                  )}
                </div>
              ))
            : fallbackStoryImages.map((imageUrl, index) => (
                <div className="aspect-square overflow-hidden rounded-[18px]" key={index}>
                  <img
                    alt={`${title} ${index + 1}`}
                    className="h-full w-full object-cover"
                    src={imageUrl}
                  />
                </div>
              ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center fade-up">
          <h2 className="text-xl font-semibold text-white">{descriptionTitle}</h2>
          {descriptionBody && (
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/60 text-center">
              {descriptionBody.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50 fade-up">
          {prevWork && typeof prevWork === 'object' && 'slug' in prevWork && (
            <Link
              className="flex items-center gap-3 transition-colors hover:text-white"
              href={`/my-works/${prevWork.slug}`}
            >
              <span className="h-px w-10 bg-white/30" />
              Previous work
            </Link>
          )}
          {nextWork && typeof nextWork === 'object' && 'slug' in nextWork && (
            <Link
              className="ml-auto flex items-center gap-3 transition-colors hover:text-white"
              href={`/my-works/${nextWork.slug}`}
            >
              Next work
              <span className="h-px w-10 bg-white/30" />
            </Link>
          )}
        </div>
      </section>

      <section className="container py-20">
        <h2 className="text-center text-3xl font-semibold text-white md:text-4xl fade-up">
          Other Projects
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 fade-up fade-up--delay-1">
          {(otherProjects.length > 0 ? otherProjects : fallbackOthers).map((item, index) => {
            if (!item || typeof item !== 'object') return null
            const slugValue = 'slug' in item ? item.slug : ''
            const titleValue = 'title' in item ? item.title : 'Project'
            const labelValue = 'label' in item ? item.label : ''
            const hero =
              'heroImage' in item && item.heroImage && typeof item.heroImage === 'object'
                ? item.heroImage
                : null
            const imageUrl =
              hero && typeof hero === 'object'
                ? hero.url
                : 'heroImageUrl' in item
                  ? item.heroImageUrl
                  : fallbackOthers[index]?.heroImageUrl

            return (
              <Link className="text-center" href={`/my-works/${slugValue}`} key={index}>
                <div className="aspect-square overflow-hidden rounded-[18px] bg-black/40">
                  <img alt={titleValue} className="h-full w-full object-cover" src={imageUrl} />
                </div>
                <div className="mt-4">
                  {labelValue && (
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
                      {labelValue}
                    </p>
                  )}
                  <h3 className="mt-2 text-lg font-semibold text-white">{titleValue}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </article>
  )
}
