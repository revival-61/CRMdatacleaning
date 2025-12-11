import { notFound } from "next/navigation";
import { getPost, getInternalLinks, getCategories, getTags, getPopularPosts } from "@/lib/sanity";
import { generateMetadata as generateSEO } from "@/lib/seo/generateMetadata";
import { buildArticleSchema } from "@/lib/seo/buildSchema";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";
import InternalLinkBlock from "@/components/blog/InternalLinkBlock";
import TOC from "@/components/layout/TOC";
import Sidebar from "@/components/layout/Sidebar";
import { getSettings } from "@/lib/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  const settings = await getSettings();

  if (!post) {
    return {};
  }

  return generateSEO({
    post,
    settings,
    path: `/article/${slug}`,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPost(slug),
    getSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const [internalLinks, categories, tags, popularPosts] = await Promise.all([
    getInternalLinks(post),
    getCategories(),
    getTags(),
    getPopularPosts(5),
  ]);

  const articleSchema = buildArticleSchema(post, settings);
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    ...(post.category
      ? [{ name: post.category.title, url: `/category/${post.category.slug.current}` }]
      : []),
    { name: post.title, url: `/article/${post.slug.current}` },
  ];

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(600).url()
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Header */}
            <header className="mb-8">
              {post.category && (
                <span className="inline-block mb-4 text-sm font-semibold text-primary-600 uppercase tracking-wide">
                  {post.category.title}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {post.author && (
                  <span className="font-medium text-gray-900">
                    {post.author.name}
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
                {post.readTime && <span>{post.readTime} min read</span>}
              </div>
            </header>

            {/* Cover Image */}
            {coverImageUrl && (
              <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <PortableText
                value={post.body}
                components={{
                  types: {
                    image: ({ value }: any) => {
                      if (!value?.asset) return null;
                      const imageUrl = urlFor(value).width(800).url();
                      return (
                        <figure className="my-8">
                          <img
                            src={imageUrl}
                            alt={value.alt || ""}
                            className="rounded-lg"
                          />
                          {value.caption && (
                            <figcaption className="text-center text-sm text-gray-600 mt-2">
                              {value.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                  },
                  block: {
                    h2: ({ children }: any) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h2 id={id} className="scroll-mt-24">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }: any) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h3 id={id} className="scroll-mt-24">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children }: any) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h4 id={id} className="scroll-mt-24">
                          {children}
                        </h4>
                      );
                    },
                  },
                }}
              />
            </div>

            {/* Author Bio */}
            {post.author && <AuthorBio author={post.author} />}

            {/* Internal Links */}
            {post.internalLinks && post.internalLinks.length > 0 && (
              <InternalLinkBlock
                posts={post.internalLinks}
                title="Suggested Reading"
              />
            )}

            {/* Related Articles */}
            {internalLinks.length > 0 && (
              <RelatedArticles posts={internalLinks} />
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <TOC content={post.body} />
              <Sidebar
                categories={categories}
                tags={post.tags}
                popularPosts={popularPosts}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

