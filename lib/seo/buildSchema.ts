import { Post, Settings } from "../types";
import { urlFor } from "@/sanity/lib/image";

export interface ArticleSchema {
  "@context": string;
  "@type": string;
  headline: string;
  description?: string;
  image?: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": string;
    name: string;
    url?: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo?: {
      "@type": string;
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function buildArticleSchema(
  post: Post,
  settings?: Settings
): ArticleSchema {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/article/${post.slug.current}`;

  const images: string[] = [];
  if (post.coverImage) {
    images.push(urlFor(post.coverImage).width(1200).url());
  }
  if (post.seo?.ogImage) {
    images.push(urlFor(post.seo.ogImage).width(1200).url());
  }

  const authorUrl = post.author.socialLinks?.website;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seo?.description,
    image: images.length > 0 ? images : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: settings?.siteTitle || "Blog",
      logo: settings?.logo
        ? {
            "@type": "ImageObject",
            url: urlFor(settings.logo).width(600).url(),
          }
        : undefined,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

