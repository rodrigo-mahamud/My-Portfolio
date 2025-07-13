import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishDate'],
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
        description: 'Brief description of the project',
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
        description: 'Main project image',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'RGBA color for project theming (e.g., rgba(161, 198, 0, 1))',
      },
    },
    
    // Project Details
    {
      name: 'singlePostInfo',
      type: 'group',
      fields: [
        {
          name: 'rol',
          type: 'text',
          admin: {
            description: 'Your role in the project',
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'On Hold', value: 'on-hold' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Project duration (e.g., "3 months", "2022-2023")',
          },
        },
        {
          name: 'overview',
          type: 'richText',
          admin: {
            description: 'Project overview and description',
          },
        },
        {
          name: 'team',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'Portfolio or social media URL',
              },
            },
          ],
        },
      ],
    },

    // Content Sections
    {
      name: 'sections',
      type: 'array',
      maxRows: 5,
      fields: [
        {
          name: 'preTitle',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },

    // Statistics
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'amount',
          type: 'text',
          required: true,
          admin: {
            description: 'Statistic value (e.g., "95%", "10+", "2M")',
          },
        },
      ],
    },

    // Video Cards (YouTube embeds)
    {
      name: 'cards',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'videoId',
          type: 'text',
          required: true,
          admin: {
            description: 'YouTube video ID',
          },
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // Media Gallery
    {
      name: 'media',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'delay',
          type: 'number',
          admin: {
            description: 'Animation delay in milliseconds',
          },
        },
        {
          name: 'frameDelay',
          type: 'number',
          admin: {
            description: 'Frame animation delay',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          defaultValue: 'image',
        },
      ],
    },

    // Video Gallery
    {
      name: 'PostGalleryGrid',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'text',
            },
          ],
        },
      ],
    },

    // Navigation
    {
      name: 'postIndex',
      type: 'array',
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

    // Next Project Reference
    {
      name: 'PostNextProject',
      type: 'group',
      fields: [
        {
          name: 'nextProject',
          type: 'relationship',
          relationTo: 'works',
          admin: {
            description: 'Reference to the next project to display',
          },
        },
        {
          name: 'customTitle',
          type: 'text',
          admin: {
            description: 'Custom title for next project section',
          },
        },
      ],
    },

    // SEO
    {
      name: 'canonical',
      type: 'text',
      admin: {
        description: 'Canonical URL for SEO',
      },
    },

    // Content Body (Rich Text)
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Main project content (converted from MDX)',
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