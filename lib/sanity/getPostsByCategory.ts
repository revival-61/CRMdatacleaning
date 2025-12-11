import { client } from "@/sanity/lib/client";
import { postsByCategoryQuery } from "./queries";
import { Post } from "../types";

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(postsByCategoryQuery, {
      categorySlug,
    });
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

