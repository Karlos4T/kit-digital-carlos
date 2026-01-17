import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA',
        name: 'cta',
      },
    }),
    {
      name: 'navItems',
      type: 'array',
      fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
