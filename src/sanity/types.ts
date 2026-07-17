import type { PortableTextBlock } from "@portabletext/types";

export type Locale = "en" | "fr";
export type Slug = { current: string };

export type SanityImage = {
  _key?: string;
  _type?: "image";
  alt?: string;
  asset?: { _ref: string; _type: "reference" };
  description?: PortableTextBlock[];
  featured?: boolean;
  placeholders?: { metadata?: { lqip?: string } };
  title?: string;
};

export type CategorySummary = {
  _id: string;
  categoryName: string;
  coverImage?: SanityImage;
  slug: Slug;
  albums: AlbumSummary[];
};

export type AlbumSummary = {
  _id: string;
  albumName: string;
  albumDescription?: string;
  cover?: SanityImage;
  images: SanityImage[];
  slug: Slug;
};

export type Album = AlbumSummary & {
  category?: { categoryName: string; slug: Slug };
  columns?: number;
  description?: PortableTextBlock[];
  display?: "rows" | "columns" | "masonry";
};

export type PostSummary = {
  _id: string;
  blurDataURL?: string;
  coverImage?: SanityImage;
  excerpt?: string;
  publishDate?: string;
  slug: Slug;
  title: string;
};

export type Post = PostSummary & {
  postContent?: { value?: PortableTextBlock[] };
};

export type PostPage = {
  current: Post;
  next?: PostSummary;
  previous?: PostSummary;
};

export type CustomPage = {
  _id: string;
  _translations?: Array<{ language: Locale; slug: Slug; title: string }>;
  content?: PortableTextBlock[];
  language: Locale;
  slug: Slug;
  title: string;
};

export type SiteMetadata = {
  author: string;
  customDisplayFont?: string;
  customFont?: string;
  customThemeVariables?: {
    dark?: Record<string, string>;
    light?: Record<string, string>;
  };
  description: string;
  siteTitle: string;
  socialLinks: Array<{ name: string; type: string; url: string }>;
  themes: { darkThemeName: string; lightThemeName: string };
};

export type HeaderData = {
  pages: Array<{
    _translations?: { _translations?: Array<{ language: Locale; slug: Slug; title: string }> };
    slug: string;
    slug_fr?: string;
    title: string;
    title_fr?: string;
  }>;
  showHome: boolean;
};
