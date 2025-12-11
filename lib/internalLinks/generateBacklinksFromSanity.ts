import { writeClient } from "@/sanity/lib/client";
import { allPostsQuery } from "@/lib/sanity/queries";
import { Post } from "@/lib/types";

interface KeywordMatch {
  post: Post;
  score: number;
  matchedKeywords: string[];
}

/**
 * Extract keywords from post content
 */
function extractKeywords(post: Post): string[] {
  const keywords: string[] = [];

  // Add title words (excluding common words)
  const titleWords = post.title
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        !["the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use"].includes(
          word
        )
    );
  keywords.push(...titleWords);

  // Add category title
  if (post.category) {
    keywords.push(post.category.title.toLowerCase());
  }

  // Add tag titles
  if (post.tags) {
    post.tags.forEach((tag) => {
      keywords.push(tag.title.toLowerCase());
    });
  }

  // Extract from excerpt
  if (post.excerpt) {
    const excerptWords = post.excerpt
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4);
    keywords.push(...excerptWords.slice(0, 10));
  }

  return [...new Set(keywords)];
}

/**
 * Calculate relevance score between two posts
 */
function calculateRelevanceScore(
  sourcePost: Post,
  targetPost: Post
): { score: number; matchedKeywords: string[] } {
  let score = 0;
  const matchedKeywords: string[] = [];

  const sourceKeywords = extractKeywords(sourcePost);
  const targetKeywords = extractKeywords(targetPost);

  // Category match (high weight)
  if (
    sourcePost.category?._id &&
    targetPost.category?._id &&
    sourcePost.category._id === targetPost.category._id
  ) {
    score += 50;
    matchedKeywords.push(sourcePost.category.title.toLowerCase());
  }

  // Tag matches (medium weight)
  if (sourcePost.tags && targetPost.tags) {
    const sourceTagIds = new Set(sourcePost.tags.map((t) => t._id));
    const matchingTags = targetPost.tags.filter((t) =>
      sourceTagIds.has(t._id)
    );
    score += matchingTags.length * 20;
    matchingTags.forEach((tag) => {
      matchedKeywords.push(tag.title.toLowerCase());
    });
  }

  // Keyword matches in title (medium weight)
  sourceKeywords.forEach((keyword) => {
    if (targetPost.title.toLowerCase().includes(keyword)) {
      score += 15;
      if (!matchedKeywords.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
  });

  // Keyword matches in excerpt (low weight)
  if (targetPost.excerpt) {
    sourceKeywords.forEach((keyword) => {
      if (targetPost.excerpt?.toLowerCase().includes(keyword)) {
        score += 5;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    });
  }

  return { score, matchedKeywords };
}

/**
 * Find related posts for a given post
 */
function findRelatedPosts(
  sourcePost: Post,
  allPosts: Post[],
  maxResults: number = 6
): KeywordMatch[] {
  const matches: KeywordMatch[] = [];

  allPosts.forEach((post) => {
    // Skip self
    if (post._id === sourcePost._id) {
      return;
    }

    // Skip if already in internalLinks
    if (
      sourcePost.internalLinks?.some((link) => link._id === post._id)
    ) {
      return;
    }

    const { score, matchedKeywords } = calculateRelevanceScore(
      sourcePost,
      post
    );

    if (score > 0) {
      matches.push({
        post,
        score,
        matchedKeywords,
      });
    }
  });

  // Sort by score descending and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Generate and update internal links for all posts
 */
export async function generateBacklinksFromSanity(): Promise<void> {
  try {
    console.log("Fetching all posts...");
    const allPosts = await writeClient.fetch<Post[]>(allPostsQuery);

    if (!allPosts || allPosts.length === 0) {
      console.log("No posts found.");
      return;
    }

    console.log(`Found ${allPosts.length} posts. Generating internal links...`);

    let updatedCount = 0;

    for (const post of allPosts) {
      const relatedPosts = findRelatedPosts(post, allPosts, 6);

      if (relatedPosts.length === 0) {
        continue;
      }

      // Get current internal links to preserve manually added ones
      const currentInternalLinkIds = new Set(
        post.internalLinks?.map((link) => link._id) || []
      );

      // Add new related posts (avoid duplicates)
      relatedPosts.forEach((match) => {
        if (!currentInternalLinkIds.has(match.post._id)) {
          currentInternalLinkIds.add(match.post._id);
        }
      });

      // Update post in Sanity
      const internalLinkRefs = Array.from(currentInternalLinkIds).map((id) => ({
        _type: "reference",
        _ref: id,
      }));

      await writeClient
        .patch(post._id)
        .set({
          internalLinks: internalLinkRefs,
        })
        .commit();

      updatedCount++;
      console.log(
        `Updated ${post.title}: Added ${relatedPosts.length} internal links`
      );
    }

    console.log(`\n✅ Successfully updated ${updatedCount} posts with internal links.`);
  } catch (error) {
    console.error("Error generating backlinks:", error);
    throw error;
  }
}

/**
 * Generate internal links for a single post
 */
export async function generateInternalLinksForPost(
  postId: string
): Promise<void> {
  try {
    const allPosts = await writeClient.fetch<Post[]>(allPostsQuery);
    const post = allPosts.find((p) => p._id === postId);

    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    const relatedPosts = findRelatedPosts(post, allPosts, 6);

    if (relatedPosts.length === 0) {
      console.log(`No related posts found for ${post.title}`);
      return;
    }

    const currentInternalLinkIds = new Set(
      post.internalLinks?.map((link) => link._id) || []
    );

    relatedPosts.forEach((match) => {
      if (!currentInternalLinkIds.has(match.post._id)) {
        currentInternalLinkIds.add(match.post._id);
      }
    });

    const internalLinkRefs = Array.from(currentInternalLinkIds).map((id) => ({
      _type: "reference",
      _ref: id,
    }));

    await writeClient
      .patch(postId)
      .set({
        internalLinks: internalLinkRefs,
      })
      .commit();

    console.log(
      `✅ Updated ${post.title}: Added ${relatedPosts.length} internal links`
    );
  } catch (error) {
    console.error("Error generating internal links for post:", error);
    throw error;
  }
}

