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
import { AccentColor } from '../fields/color'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  InlineCodeFeature,
  ParagraphFeature,
  HeadingFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ChecklistFeature,
  BlockquoteFeature,
  AlignFeature,
  IndentFeature,
  SuperscriptFeature,
  SubscriptFeature,
  HorizontalRuleFeature,
  BlocksFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Brief description of the project for previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          // Toolbar fija en la parte superior
          FixedToolbarFeature(),
          // Toolbar flotante al seleccionar texto
          InlineToolbarFeature(),

          // Formateo de texto básico
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          InlineCodeFeature(),
          SuperscriptFeature(),
          SubscriptFeature(),

          // Estructura de documento
          ParagraphFeature(),
          HeadingFeature({
            enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          }),

          // Listas
          OrderedListFeature(),
          UnorderedListFeature(),
          ChecklistFeature(),

          // Bloques especiales
          BlockquoteFeature(),
          HorizontalRuleFeature(),

          // Enlaces
          LinkFeature({
            enabledCollections: ['works'],
            fields: ({ defaultFields }) => defaultFields,
          }),

          // Alineación y sangría
          AlignFeature(),
          IndentFeature(),

          // Multimedia y contenido avanzado
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'alt',
                    type: 'text',
                    required: true,
                  },
                  {
                    name: 'caption',
                    type: 'text',
                  },
                ],
              },
            },
          }),

          // Bloques reutilizables
          BlocksFeature({
            blocks: [
              SinglePostInfo,
              SinglePostSection,
              PostMedia,
              PostGalleryGrid,
              PostCards,
              Stats,
              RichText,
            ],
          }),
        ],
      }),
      admin: {
        description: 'Contenido detallado del proyecto con formato enriquecido',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
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
    AccentColor({
      name: 'accentColor',
      label: 'Color de accento',
      admin: {
        description: 'Color for project theming',
      },
    }),

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
