import { defineType, defineField } from "sanity";

export default defineType({
  name: "seo",
  type: "object",
  title: "SEO",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "SEO Title",
      description: "Title for search engines (leave empty to use post title)",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "SEO Description",
      description: "Meta description for search engines",
      validation: (Rule) => Rule.max(160).warning("Should be under 160 characters"),
    }),
    defineField({
      name: "canonical",
      type: "url",
      title: "Canonical URL",
      description: "Canonical URL for this page",
    }),
    defineField({
      name: "keywords",
      type: "array",
      title: "Keywords",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "ogImage",
      type: "image",
      title: "Open Graph Image",
      description: "Image for social media sharing (1200x630 recommended)",
      options: {
        hotspot: true,
      },
    }),
  ],
});

