import type { Block } from 'payload'

import { link } from '@/fields/link'

export const AboutMe: Block = {
  slug: 'aboutMe',
  interfaceName: 'AboutMeBlock',
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubtitle',
      type: 'text',
    },
    {
      name: 'showDivider',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'missionTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'missionBody',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'secondary',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'socialHeading',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        link({
          appearances: false,
          overrides: {
            label: 'Social Link',
          },
        }),
      ],
      labels: {
        plural: 'Social Links',
        singular: 'Social Link',
      },
    },
  ],
  labels: {
    plural: 'About Me Sections',
    singular: 'About Me Section',
  },
}
