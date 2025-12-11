import { client } from "@/sanity/lib/client";
import { allTagsQuery } from "./queries";
import { Tag } from "../types";

export async function getTags(): Promise<Tag[]> {
  try {
    const tags = await client.fetch<Tag[]>(allTagsQuery);
    return tags || [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

