import type { Block } from 'payload'

export const PostMedia: Block = {
  slug: 'postMedia',
  labels: {
    singular: 'Media',
    plural: 'Media Blocks',
  },
  fields: [
    {
      name: 'mediaFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image or video file',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      admin: {
        description: 'Media description or caption (HTML supported)',
      },
    },
    {
      name: 'delay',
      type: 'number',
      defaultValue: 0.25,
      admin: {
        description: 'Animation delay in seconds',
        step: 0.05,
      },
    },
    {
      name: 'frame',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show frame/border around media',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single (Full Width)', value: 'single' },
        { label: 'Half Width', value: 'half' },
        { label: 'Two Columns', value: 'two-columns' },
      ],
      admin: {
        description: 'Layout style for this media block',
      },
    },
  ],
}