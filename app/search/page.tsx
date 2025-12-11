import { searchPosts } from "@/lib/sanity";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { generateMetadata as generateSEO } from "@/lib/seo/generateMetadata";
import SearchForm from "@/components/blog/SearchForm";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata() {
  return generateSEO({
    title: "Search - Blog",
    description: "Search for articles",
    path: "/search",
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const posts = query ? await searchPosts(query) : [];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Search", url: "/search" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Search</h1>
        <SearchForm initialQuery={query} />
      </header>

      {query && (
        <div className="mb-6">
          <p className="text-gray-600">
            {posts.length === 0
              ? `No results found for "${query}"`
              : `Found ${posts.length} result${posts.length === 1 ? "" : "s"} for "${query}"`}
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-600">Enter a search query to find articles.</p>
        </div>
      )}
    </div>
  );
}

