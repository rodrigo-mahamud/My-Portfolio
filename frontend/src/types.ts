import type { PayloadBlock } from './utils/payload';

export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  author: string;
  title: string;
  rol?: string;

  image?: any;
  video?: string;

  canonical?: string | URL;
  permalink?: string;
  duration?: string;
  accentColor?: string;
  excerpt?: string;
  category?: string;
  postIndex?: Array<{
    label: string;
    anchor: string;
  }>;
  status?: string;

  // Payload specific properties
  layout?: PayloadBlock[];
  isPayloadPost?: boolean;
  content?: any; // Rich text content from Payload

  Content?: any; // Function for MDX posts, null for Payload posts
}

export interface MetaSEO {
  title?: string;
  description?: string;
  image?: string;

  canonical?: string | URL;
  noindex?: boolean;
  nofollow?: boolean;

  ogTitle?: string;
  ogType?: string;
}
