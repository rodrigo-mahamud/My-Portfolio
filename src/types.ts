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
  duration: string;
  accentColor?: string;
  excerpt?: string;
  category?: string;
  postIndex?: Array<string>;
  status: string;

  Content: string;
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
