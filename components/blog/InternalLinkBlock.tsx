"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";

interface InternalLinkBlockProps {
  posts: Post[];
  title?: string;
}

export default function InternalLinkBlock({
  posts,
  title = "Related Articles",
}: InternalLinkBlockProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="my-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/article/${post.slug.current}`}
            className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {post.coverImage && (
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  src={urlFor(post.coverImage).width(400).height(200).url()}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              {post.category && (
                <span className="inline-block mt-3 text-xs text-primary-600 font-medium">
                  {post.category.title}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

