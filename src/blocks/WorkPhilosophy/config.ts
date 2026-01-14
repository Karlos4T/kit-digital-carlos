import type { Block } from 'payload'

export const WorkPhilosophy: Block = {
  slug: 'workPhilosophy',
  interfaceName: 'WorkPhilosophyBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'author',
      type: 'text',
    },
  ],
  labels: {
    plural: 'Work Philosophies',
    singular: 'Work Philosophy',
  },
}
