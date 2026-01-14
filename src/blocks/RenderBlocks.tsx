import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { AboutCloserBlock } from '@/blocks/AboutCloser/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LandingHeroBlock } from '@/blocks/LandingHero/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProjectsHighlightBlock } from '@/blocks/ProjectsHighlight/Component'
import { WorkPhilosophyBlock } from '@/blocks/WorkPhilosophy/Component'
import { WorksGalleryBlock } from '@/blocks/WorksGallery/Component'

const blockComponents = {
  aboutCloser: AboutCloserBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  landingHero: LandingHeroBlock,
  mediaBlock: MediaBlock,
  projectsHighlight: ProjectsHighlightBlock,
  workPhilosophy: WorkPhilosophyBlock,
  worksGallery: WorksGalleryBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const wrapperClassName =
            blockType === 'landingHero' ||
            blockType === 'aboutCloser' ||
            blockType === 'projectsHighlight' ||
            blockType === 'workPhilosophy' ||
            blockType === 'worksGallery'
              ? 'my-0'
              : 'my-16'

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={wrapperClassName} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
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
