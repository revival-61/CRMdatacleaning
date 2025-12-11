import { client } from "@/sanity/lib/client";
import { settingsQuery } from "./queries";
import { Settings } from "../types";

export async function getSettings(): Promise<Settings | null> {
  try {
    const settings = await client.fetch<Settings>(settingsQuery);
    return settings || null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

