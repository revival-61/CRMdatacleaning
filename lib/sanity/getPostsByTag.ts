import { client } from "@/sanity/lib/client";
import { postsByTagQuery } from "./queries";
import { Post } from "../types";

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  try {
    const posts = await client.fetch<Post[]>(postsByTagQuery, {
      tagSlug,
    });
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return [];
  }
}

