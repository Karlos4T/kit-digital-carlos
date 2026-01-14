import type { Block } from 'payload'

import { link } from '@/fields/link'

export const AboutCloser: Block = {
  slug: 'aboutCloser',
  interfaceName: 'AboutCloserBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA',
        name: 'cta',
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'About Closers',
    singular: 'About Closer',
  },
}
