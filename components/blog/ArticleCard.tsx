"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(800).height(400).url()
    : null;

  if (featured) {
    return (
      <Link
        href={`/article/${post.slug.current}`}
        className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        {coverImageUrl && (
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          {post.category && (
            <span className="inline-block mb-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
              {post.category.title}
            </span>
          )}
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {post.author && (
                <span className="flex items-center">
                  <span className="font-medium">{post.author.name}</span>
                </span>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            {post.readTime && (
              <span>{post.readTime} min read</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${post.slug.current}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {coverImageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={coverImageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        {post.category && (
          <span className="inline-block mb-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
            {post.category.title}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {post.author && <span>{post.author.name}</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            )}
          </div>
          {post.readTime && <span>{post.readTime} min</span>}
        </div>
      </div>
    </Link>
  );
}

