import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contactHeading',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'legalText',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
