import React from 'react'

import type { ProjectsHighlightBlock as ProjectsHighlightBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const ProjectsHighlightBlock: React.FC<ProjectsHighlightBlockProps> = ({
  cta,
  projects,
  title,
}) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
  ]

  return (
    <section className="relative overflow-hidden" id="projects">
      <div className="container py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
          {cta && (
            <CMSLink
              {...cta}
              className="rounded-full border border-primary/40 px-6 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-primary transition hover:bg-primary/10"
            />
          )}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(projects || []).map((project, index) => (
            <article className="group" key={index}>
              <div className="relative aspect-square overflow-hidden rounded-[10px]">
                {project.image && typeof project.image === 'object' ? (
                  <Media
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    resource={project.image}
                  />
                ) : (
                  <img
                    alt={project.title || 'Project'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={fallbackImages[index % fallbackImages.length]}
                  />
                )}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <div className="h-px w-8 bg-primary" />
                <div className="text-xs text-white/50">
                  {project.scope && (
                    <div className="flex gap-2">
                      <span className="text-white/40">Ambito:</span>
                      <span className="text-white">{project.scope}</span>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-white/40">Tags:</span>
                      {project.tags.map((tagItem, tagIndex) => (
                        <span className="text-white" key={tagIndex}>
                          {tagItem.tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
