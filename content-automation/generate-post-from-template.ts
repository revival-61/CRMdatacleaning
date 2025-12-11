import { writeClient } from "@/sanity/lib/client";
import { Post, Author, Category } from "@/lib/types";

interface PostTemplate {
  topic: string;
  outline: string[];
  categoryId?: string;
  authorId: string;
  tags?: string[];
}

/**
 * Generate a draft post from a template
 */
export async function generatePostFromTemplate(
  template: PostTemplate
): Promise<string> {
  try {
    // Get author
    const author = await writeClient.fetch<Author>(
      `*[_type == "author" && _id == $authorId][0]`,
      { authorId: template.authorId }
    );

    if (!author) {
      throw new Error(`Author with ID ${template.authorId} not found`);
    }

    // Get category if provided
    let category: Category | null = null;
    if (template.categoryId) {
      category = await writeClient.fetch<Category>(
        `*[_type == "category" && _id == $categoryId][0]`,
        { categoryId: template.categoryId }
      );
    }

    // Generate slug from topic
    const slug = template.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Generate body content from outline
    const bodyBlocks = template.outline.map((point, index) => ({
      _type: "block",
      _key: `block-${index}`,
      style: index === 0 ? "h2" : "normal",
      children: [
        {
          _type: "span",
          _key: `span-${index}`,
          text: point,
          marks: [],
        },
      ],
      markDefs: [],
    }));

    // Create draft post
    const post = {
      _type: "post",
      title: template.topic,
      slug: {
        _type: "slug",
        current: slug,
      },
      excerpt: `Learn about ${template.topic.toLowerCase()}.`,
      body: bodyBlocks,
      author: {
        _type: "reference",
        _ref: template.authorId,
      },
      ...(category && {
        category: {
          _type: "reference",
          _ref: template.categoryId,
        },
      }),
      ...(template.tags && template.tags.length > 0 && {
        tags: template.tags.map((tagTitle) => {
          // In a real implementation, you'd fetch or create tags
          return {
            _type: "reference",
            // This would need to be a tag ID
          };
        }),
      }),
      publishedAt: null, // Draft post
    };

    const createdPost = await writeClient.create(post);

    console.log(`✅ Created draft post: ${createdPost._id}`);
    console.log(`   Title: ${template.topic}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Author: ${author.name}`);

    return createdPost._id;
  } catch (error) {
    console.error("Error generating post from template:", error);
    throw error;
  }
}

/**
 * Example usage
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: tsx generate-post-from-template.ts <topic> <authorId> [categoryId]");
    console.log("Example: tsx generate-post-from-template.ts 'Getting Started with React' 'author-id' 'category-id'");
    process.exit(1);
  }

  const [topic, authorId, categoryId] = args;

  const template: PostTemplate = {
    topic,
    authorId,
    categoryId,
    outline: [
      "Introduction",
      "What is this topic?",
      "Why is it important?",
      "Key concepts",
      "Best practices",
      "Conclusion",
    ],
  };

  try {
    const postId = await generatePostFromTemplate(template);
    console.log(`\n✨ Post created successfully!`);
    console.log(`   Post ID: ${postId}`);
    console.log(`   Edit in Sanity Studio: /studio`);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

