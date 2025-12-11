import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories } from "@/lib/sanity";
import { generateMetadata as generateSEO } from "@/lib/seo/generateMetadata";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.current === slug);

  if (!category) {
    return {};
  }

  return generateSEO({
    title: `${category.title} - Category`,
    description: category.description || `Articles in ${category.title}`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, categories] = await Promise.all([
    getPostsByCategory(slug),
    getCategories(),
  ]);

  const category = categories.find((c) => c.slug.current === slug);

  if (!category) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: category.title, url: `/category/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600">{category.description}</p>
        )}
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

