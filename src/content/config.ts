import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    publishDate: z.date().or(z.string()).optional(),
    title: z.string(),
    author: z.string(),
    rol: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    video: z.string().optional(),
    accentColor: z.string().optional(),
    canonical: z.string().url().optional(),
    duration: z.string(),
    status: z.string(),
  }),
});

export const collections = {
  post: post,
};
