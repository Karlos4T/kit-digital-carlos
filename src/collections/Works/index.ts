import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { slugField } from 'payload'

export const Works: CollectionConfig<'works'> = {
  slug: 'works',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'label', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    label: true,
    heroImage: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'storyTitle',
      type: 'text',
    },
    {
      name: 'storyBody',
      type: 'textarea',
    },
    {
      name: 'storyImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'descriptionTitle',
      type: 'text',
    },
    {
      name: 'descriptionBody',
      type: 'textarea',
    },
    {
      name: 'otherProjects',
      type: 'relationship',
      relationTo: 'works',
      hasMany: true,
    },
    slugField(),
  ],
  timestamps: true,
}
