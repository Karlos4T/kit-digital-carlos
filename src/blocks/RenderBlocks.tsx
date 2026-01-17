import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { AboutCloserBlock } from '@/blocks/AboutCloser/Component'
import { AboutMeBlock } from '@/blocks/AboutMe/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactLayoutBlock } from '@/blocks/ContactLayout/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LandingHeroBlock } from '@/blocks/LandingHero/Component'
import { LegalTextBlock } from '@/blocks/LegalText/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProjectsHighlightBlock } from '@/blocks/ProjectsHighlight/Component'
import { WorkPhilosophyBlock } from '@/blocks/WorkPhilosophy/Component'
import { WorksGalleryBlock } from '@/blocks/WorksGallery/Component'

const blockComponents = {
  aboutCloser: AboutCloserBlock,
  aboutMe: AboutMeBlock,
  archive: ArchiveBlock,
  contactLayout: ContactLayoutBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  landingHero: LandingHeroBlock,
  legalText: LegalTextBlock,
  mediaBlock: MediaBlock,
  projectsHighlight: ProjectsHighlightBlock,
  workPhilosophy: WorkPhilosophyBlock,
  worksGallery: WorksGalleryBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props


  const worksFromGallery =
    blocks?.find(
      (block) =>
        block.blockType === 'worksGallery' &&
        Array.isArray(block.works) &&
        block.works.length > 0,
    )?.works || []

  const projectsFromWorks = worksFromGallery
    .map((work) => {
      if (!work || typeof work !== 'object') return null
      return {
        title: work.title || 'Project',
        scope: work.label,
        tags: [],
        image: work.heroImage,
      }
    })
    .filter(Boolean)

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const wrapperClassName =
            blockType === 'landingHero' ||
            blockType === 'aboutCloser' ||
            blockType === 'aboutMe' ||
            blockType === 'projectsHighlight' ||
            blockType === 'workPhilosophy' ||
            blockType === 'worksGallery' ||
            blockType === 'contactLayout' ||
            blockType === 'legalText'
              ? 'my-0'
              : 'my-16'

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const blockProps =
                blockType === 'projectsHighlight' &&
                (!block.projects || block.projects.length === 0) &&
                projectsFromWorks.length > 0
                  ? { ...block, projects: projectsFromWorks }
                  : block

              return (
                <div className={wrapperClassName} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...blockProps} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
