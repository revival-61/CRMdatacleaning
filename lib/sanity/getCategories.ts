import { client } from "@/sanity/lib/client";
import { allCategoriesQuery } from "./queries";
import { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await client.fetch<Category[]>(allCategoriesQuery);
    return categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

