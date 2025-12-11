import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "./queries";
import { Post } from "../types";

export interface GetPostsOptions {
  limit?: number;
  offset?: number;
}

export async function getPosts(options: GetPostsOptions = {}): Promise<Post[]> {
  try {
    const { limit, offset = 0 } = options;
    let query = allPostsQuery;
    
    if (limit) {
      query = `${query}[${offset}...${offset + limit}]`;
    }
    
    const posts = await client.fetch<Post[]>(query);
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

