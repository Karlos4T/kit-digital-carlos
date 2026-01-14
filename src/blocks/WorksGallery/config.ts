import type { Block } from 'payload'

import { link } from '@/fields/link'

export const WorksGallery: Block = {
  slug: 'worksGallery',
  interfaceName: 'WorksGalleryBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'searchLabel',
      type: 'text',
      defaultValue: 'Search',
    },
    {
      name: 'works',
      type: 'relationship',
      relationTo: 'works',
      hasMany: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA',
        name: 'cta',
      },
    }),
  ],
  labels: {
    plural: 'Works Galleries',
    singular: 'Works Gallery',
  },
}
