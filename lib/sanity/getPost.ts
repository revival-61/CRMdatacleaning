import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "./queries";
import { Post } from "../types";

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await client.fetch<Post>(postBySlugQuery, { slug });
    return post || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

