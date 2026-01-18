import type { Block } from 'payload'

export const WorkPhilosophy: Block = {
  slug: 'workPhilosophy',
  interfaceName: 'WorkPhilosophyBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'author',
      type: 'text',
      localized: true,
    },
  ],
  labels: {
    plural: 'Work Philosophies',
    singular: 'Work Philosophy',
  },
}
