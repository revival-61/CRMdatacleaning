import { getPosts, getPopularPosts, getCategories } from "@/lib/sanity";
import ArticleCard from "@/components/blog/ArticleCard";
import FeaturedArticle from "@/components/blog/FeaturedArticle";
import Link from "next/link";

export default async function HomePage() {
  const [posts, popularPosts, categories] = await Promise.all([
    getPosts({ limit: 6 }),
    getPopularPosts(5),
    getCategories(),
  ]);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Article */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* Recent Posts */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
          <Link
            href="/search"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug.current}`}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center"
              >
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Posts */}
      {popularPosts && popularPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPosts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

