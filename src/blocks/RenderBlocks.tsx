/**
 * RenderBlocks — renders a list of blocks.
 * Updated to remove Payload Page type dependency.
 * FormBlock removed — contact form now uses Formspree directly.
 */
import React, { Fragment } from 'react'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
}

type BlockType = keyof typeof blockComponents

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RenderBlocks: React.FC<{ blocks: any[] }> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as BlockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Block {...(block as any)} disableInnerContainer />
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
