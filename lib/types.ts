import { PortableTextBlock } from "@portabletext/react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  slug: { current: string };
  bio?: string;
  avatar?: SanityImageSource;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Tag {
  _id: string;
  _type: "tag";
  title: string;
  slug: { current: string };
}

export interface SEO {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: SanityImageSource;
}

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: { current: string };
  excerpt?: string;
  body: PortableTextBlock[];
  coverImage?: SanityImageSource;
  category?: Category;
  tags?: Tag[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime?: number;
  seo?: SEO;
  internalLinks?: Post[];
}

export interface Settings {
  _id: string;
  _type: "settings";
  siteTitle: string;
  siteDescription?: string;
  logo?: SanityImageSource;
  footerLinks?: Array<{
    label: string;
    url: string;
  }>;
}

