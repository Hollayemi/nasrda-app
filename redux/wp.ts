export interface WPRendered {
  rendered: string;
}

export interface WPContent {
  rendered: string;
  protected: boolean;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  source_url: string;
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;

  title: WPRendered;
  content: WPContent;
  excerpt: WPContent;

  author: number;
  featured_media: number;

  categories: number[];
  tags: number[];

  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
  };
}

export type GetPostsResponse = WPPost[];
export type GetSinglePostResponse = WPPost;