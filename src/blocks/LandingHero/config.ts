import type { Block } from 'payload'

import { link } from '@/fields/link'

export const LandingHero: Block = {
  slug: 'landingHero',
  interfaceName: 'LandingHeroBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'Primary CTA',
        name: 'cta',
      },
    }),
  ],
  labels: {
    plural: 'Landing Heroes',
    singular: 'Landing Hero',
  },
}
