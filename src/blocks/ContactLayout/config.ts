import type { Block } from 'payload'

export const ContactLayout: Block = {
  slug: 'contactLayout',
  interfaceName: 'ContactLayoutBlock',
  fields: [
    {
      name: 'heroHeading',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubheading',
      type: 'text',
    },
    {
      name: 'formHeading',
      type: 'textarea',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'infoItems',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
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
    plural: 'Contact Layouts',
    singular: 'Contact Layout',
  },
}
