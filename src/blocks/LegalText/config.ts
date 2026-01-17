import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const LegalText: Block = {
  slug: 'legalText',
  interfaceName: 'LegalTextBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'dateLabel',
      type: 'text',
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          label: 'Body',
        },
      ],
    },
    {
      name: 'ctaHeading',
      type: 'text',
    },
    {
      name: 'ctaEmail',
      type: 'text',
    },
  ],
  labels: {
    plural: 'Legal Text Layouts',
    singular: 'Legal Text Layout',
  },
}
