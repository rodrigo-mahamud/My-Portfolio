import type { Block } from 'payload'

export const PostCards: Block = {
  slug: 'postCards',
  labels: {
    singular: 'YouTube Cards',
    plural: 'YouTube Cards',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'ytId',
          type: 'text',
          required: true,
          admin: {
            description: 'YouTube video ID (e.g., "TjkRhh3Gh1U")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Card title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Card description',
          },
        },
        {
          name: 'info',
          type: 'array',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Calendar Time', value: 'calendarTime' },
                { label: 'Thumb Up', value: 'thumbUp' },
                { label: 'Eye', value: 'eye' },
                { label: 'Clock', value: 'clock' },
                { label: 'User', value: 'user' },
                { label: 'Star', value: 'star' },
                { label: 'Heart', value: 'heart' },
                { label: 'Play', value: 'play' },
                { label: 'Message Circle', value: 'message-circle' },
              ],
              admin: {
                description: 'Icon for this info item',
              },
            },
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Info text (e.g., "Published on: 22-12-2023")',
              },
            },
          ],
          admin: {
            description: 'Additional information items with icons',
          },
        },
      ],
    },
  ],
}