export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  author: string;
  title: string;
  description?: string;

  image?: string;

  canonical?: string | URL;
  permalink?: string;

  videoThumbnail?: string;
  accentColor?: string;
  excerpt?: string;
  category?: string;
  tags?: Array<string>;

  Content: unknown;
  content?: string;
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
