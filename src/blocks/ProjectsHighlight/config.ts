import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ProjectsHighlight: Block = {
  slug: 'projectsHighlight',
  interfaceName: 'ProjectsHighlightBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA',
        name: 'cta',
      },
    }),
    {
      name: 'projects',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'scope',
          type: 'text',
          localized: true,
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  labels: {
    plural: 'Projects Highlights',
    singular: 'Projects Highlight',
  },
}
