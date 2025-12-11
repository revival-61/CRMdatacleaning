import { Metadata } from "next";
import { Post, Settings } from "../types";
import { urlFor } from "@/sanity/lib/image";

export interface GenerateMetadataOptions {
  post?: Post;
  settings?: Settings;
  title?: string;
  description?: string;
  path?: string;
}

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
  const { post, settings, title, description, path } = options;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Use post SEO data if available, otherwise use provided or fallback
  const seoTitle =
    post?.seo?.title ||
    title ||
    post?.title ||
    settings?.siteTitle ||
    "Blog";

  const seoDescription =
    post?.seo?.description ||
    description ||
    post?.excerpt ||
    settings?.siteDescription ||
    "";

  const keywords = post?.seo?.keywords || post?.tags?.map((tag) => tag.title) || [];

  const canonical =
    post?.seo?.canonical || (path ? `${siteUrl}${path}` : undefined);

  const ogImage = post?.seo?.ogImage || post?.coverImage;
  const ogImageUrl = ogImage
    ? urlFor(ogImage).width(1200).height(630).url()
    : undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      siteName: settings?.siteTitle || "Blog",
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: post?.title || "",
            },
          ]
        : [],
      type: post ? "article" : "website",
      publishedTime: post?.publishedAt,
      modifiedTime: post?.updatedAt,
      authors: post?.author ? [post.author.name] : undefined,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

