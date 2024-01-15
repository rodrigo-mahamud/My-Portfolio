import { z, defineCollection } from 'astro:content';

const post = defineCollection({
  schema: ({ image }) =>
    z.object({
      publishDate: z.date().or(z.string()).optional(),
      title: z.string(),
      author: z.string(),
      rol: z.string().optional(),
      excerpt: z.string().optional(),
      image: image(),
      video: z.string().optional(),
      accentColor: z.string().optional(),
      canonical: z.string().url().optional(),
      duration: z.string().optional(),
      status: z.string().optional(),
      postIndex: z.array(z.string()).optional(),
    }),
});

export const collections = {
  post: post,
};
