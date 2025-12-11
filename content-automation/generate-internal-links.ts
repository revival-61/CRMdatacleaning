import { generateBacklinksFromSanity } from "@/lib/internalLinks/generateBacklinksFromSanity";

/**
 * Script to generate internal links for all posts
 * Run with: npm run internal-links
 */
async function main() {
  console.log("🚀 Starting internal link generation...\n");

  try {
    await generateBacklinksFromSanity();
    console.log("\n✨ Internal link generation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during internal link generation:", error);
    process.exit(1);
  }
}

main();

