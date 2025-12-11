import { client } from "@/sanity/lib/client";
import { relatedPostsQuery } from "./queries";
import { Post } from "../types";

export async function getInternalLinks(
  post: Post,
  limit: number = 6
): Promise<Post[]> {
  try {
    if (!post.category && (!post.tags || post.tags.length === 0)) {
      return [];
    }

    const categoryId = post.category?._id;
    const tagIds = post.tags?.map((tag) => tag._id) || [];

    const relatedPosts = await client.fetch<Post[]>(relatedPostsQuery, {
      postId: post._id,
      categoryId,
      tagIds,
    });

    return relatedPosts.slice(0, limit) || [];
  } catch (error) {
    console.error("Error fetching internal links:", error);
    return [];
  }
}

