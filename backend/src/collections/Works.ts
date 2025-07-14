import type { CollectionConfig } from 'payload'
import {
  SinglePostInfo,
  SinglePostSection,
  PostMedia,
  PostGalleryGrid,
  PostCards,
  Stats,
  PostNextProject,
  RichText,
} from '../blocks'

export const Works: CollectionConfig = {
  slug: 'works',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishDate'],
  },
  fields: [
    // Basic Information
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: 'Rodrigo',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Brief description of the project for previews',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main project hero image',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'RGBA color for project theming (e.g., rgba(161, 198, 0, 1))',
      },
    },

    // Navigation Index
    {
      name: 'postIndex',
      type: 'array',
      admin: {
        description: 'Navigation menu for the project page',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'anchor',
          type: 'text',
          required: true,
          admin: {
            description: 'Anchor link (e.g., "#section-1")',
          },
        },
      ],
    },

    // Main Content using Blocks
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        SinglePostInfo,
        SinglePostSection,
        PostMedia,
        PostGalleryGrid,
        PostCards,
        Stats,
        PostNextProject,
        RichText,
      ],
      admin: {
        description: 'Build your project page using blocks',
      },
    },

    // SEO
    {
      name: 'canonical',
      type: 'text',
      admin: {
        description: 'Canonical URL for SEO',
      },
    },

    // Slug for URL generation
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug for the project',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}
