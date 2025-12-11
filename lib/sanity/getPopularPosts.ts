import { client } from "@/sanity/lib/client";
import { popularPostsQuery } from "./queries";
import { Post } from "../types";

export async function getPopularPosts(limit: number = 10): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(popularPostsQuery);
    return posts.slice(0, limit) || [];
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}

