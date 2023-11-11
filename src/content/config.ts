import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    publishDate: z.date().or(z.string()).optional(),
    title: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    videoThumbnail: z.string().optional(),
    accentColor: z.string().optional(),
    canonical: z.string().url().optional(),
  }),
});

export const collections = {
  post: post,
};
