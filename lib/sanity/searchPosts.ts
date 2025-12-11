import { client } from "@/sanity/lib/client";
import { searchPostsQuery } from "./queries";
import { Post } from "../types";

export async function searchPosts(query: string): Promise<Post[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const posts = await client.fetch<Post[]>(searchPostsQuery, {
      query: `*${query}*`,
    });
    return posts || [];
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

