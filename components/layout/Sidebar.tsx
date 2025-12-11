"use client";

import Link from "next/link";
import { Category, Tag, Post } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface SidebarProps {
  categories?: Category[];
  tags?: Tag[];
  popularPosts?: Post[];
}

export default function Sidebar({
  categories,
  tags,
  popularPosts,
}: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/category/${category.slug.current}`}
                  className="text-gray-700 hover:text-primary-600 transition-colors flex items-center justify-between"
                >
                  <span>{category.title}</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Posts */}
      {popularPosts && popularPosts.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Posts
          </h3>
          <ul className="space-y-4">
            {popularPosts.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/article/${post.slug.current}`}
                  className="group flex items-start space-x-3"
                >
                  {post.coverImage && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={urlFor(post.coverImage).width(64).height(64).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    {post.publishedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug.current}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

