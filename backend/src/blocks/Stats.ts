import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  labels: {
    singular: 'Statistics',
    plural: 'Statistics',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title for the statistics section',
      },
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Statistic label (e.g., "CGI Scenes in Total")',
          },
        },
        {
          name: 'amount',
          type: 'text',
          required: true,
          admin: {
            description: 'Statistic value (e.g., "260", "40+", "95%")',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Optional additional description',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Row', value: 'row' },
        { label: 'Vertical', value: 'vertical' },
      ],
      admin: {
        description: 'Layout style for statistics',
      },
    },
  ],
}