import type { Block } from 'payload'

import { link } from '@/fields/link'

export const WorksGallery: Block = {
  slug: 'worksGallery',
  interfaceName: 'WorksGalleryBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'searchLabel',
      type: 'text',
      localized: true,
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
        required: true,
      },
    }),
  ],
  labels: {
    plural: 'Works Galleries',
    singular: 'Works Gallery',
  },
}
