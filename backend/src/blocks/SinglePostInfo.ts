import type { Block } from 'payload'

export const SinglePostInfo: Block = {
  slug: 'singlePostInfo',
  labels: {
    singular: 'Project Info',
    plural: 'Project Info Blocks',
  },
  fields: [
    {
      name: 'rol',
      type: 'text',
      required: true,
      admin: {
        description: 'Your role in the project',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Done', value: 'done' },
        { label: 'In Progress', value: 'in progress' },
        { label: 'On Hold', value: 'on hold' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Project duration (e.g., "2 months", "2022-2023")',
      },
    },
    {
      name: 'overview',
      type: 'richText',
      required: true,
      admin: {
        description: 'Project overview and description',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional additional title (e.g., "2023 Team")',
      },
    },
    {
      name: 'team',
      type: 'richText',
      admin: {
        description: 'Team members and roles (HTML supported)',
      },
    },
  ],
}