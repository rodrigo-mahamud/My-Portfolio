import type { Block } from 'payload'

export const PostGalleryGrid: Block = {
  slug: 'postGalleryGrid',
  labels: {
    singular: 'Gallery Grid',
    plural: 'Gallery Grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title for the gallery section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle for the gallery section',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      defaultValue: 'videos',
      options: [
        { label: 'Videos', value: 'videos' },
        { label: 'Images', value: 'images' },
        { label: 'Mixed', value: 'mixed' },
      ],
      admin: {
        description: 'Type of media in this gallery',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'mediaFile',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title for this gallery item',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Description or subtitle for this item',
          },
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        description: 'Number of columns in the gallery grid',
      },
    },
  ],
}