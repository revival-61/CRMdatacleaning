"use client";

import { Post } from "@/lib/types";
import InternalLinkBlock from "./InternalLinkBlock";

interface RelatedArticlesProps {
  posts: Post[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  return <InternalLinkBlock posts={posts} title="Related Articles" />;
}

