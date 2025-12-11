import { notFound } from "next/navigation";
import { getPostsByTag, getTags } from "@/lib/sanity";
import { generateMetadata as generateSEO } from "@/lib/seo/generateMetadata";
import ArticleCard from "@/components/blog/ArticleCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.slug.current === slug);

  if (!tag) {
    return {};
  }

  return generateSEO({
    title: `${tag.title} - Tag`,
    description: `Articles tagged with ${tag.title}`,
    path: `/tag/${slug}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, tags] = await Promise.all([
    getPostsByTag(slug),
    getTags(),
  ]);

  const tag = tags.find((t) => t.slug.current === slug);

  if (!tag) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: tag.title, url: `/tag/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tag: {tag.title}
        </h1>
        <p className="text-xl text-gray-600">
          Articles tagged with &quot;{tag.title}&quot;
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles found with this tag.</p>
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

