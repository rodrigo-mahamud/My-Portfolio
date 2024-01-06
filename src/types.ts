export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  author: string;
  title: string;
  rol?: string;

  image?: string;
  video?: string;

  canonical?: string | URL;
  permalink?: string;
  duration: string;
  accentColor?: string;
  excerpt?: string;
  category?: string;
  tags?: Array<string>;
  status: string;

  Content: unknown;
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
