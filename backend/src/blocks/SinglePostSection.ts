import type { Block } from 'payload'

export const SinglePostSection: Block = {
  slug: 'singlePostSection',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'preTitle',
      type: 'text',
      admin: {
        description: 'Category or context (e.g., "Context", "Process")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main section title',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Section content - supports rich text formatting',
      },
    },
  ],
}