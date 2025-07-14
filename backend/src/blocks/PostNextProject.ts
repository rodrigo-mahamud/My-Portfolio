import type { Block } from 'payload'

export const PostNextProject: Block = {
  slug: 'postNextProject',
  labels: {
    singular: 'Next Project',
    plural: 'Next Project Blocks',
  },
  fields: [
    {
      name: 'nextProject',
      type: 'relationship',
      relationTo: 'works',
      admin: {
        description: 'Select the next project to showcase',
      },
    },
    {
      name: 'customImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Custom image for next project (overrides project image)',
      },
    },
    {
      name: 'customTitle',
      type: 'text',
      admin: {
        description: 'Custom title (overrides project title)',
      },
    },
    {
      name: 'customDescription',
      type: 'textarea',
      admin: {
        description: 'Custom description for the next project link',
      },
    },
    {
      name: 'customUrl',
      type: 'text',
      admin: {
        description: 'Custom URL (if not linking to a project in the system)',
      },
    },
  ],
}