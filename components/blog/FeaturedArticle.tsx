"use client";

import { Post } from "@/lib/types";
import ArticleCard from "./ArticleCard";

interface FeaturedArticleProps {
  post: Post;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
      <ArticleCard post={post} featured />
    </div>
  );
}

