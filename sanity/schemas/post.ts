import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  type: "document",
  title: "Post",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      title: "Excerpt",
      description: "Short description for previews",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "category",
      type: "reference",
      title: "Category",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
      title: "Updated At",
    }),
    defineField({
      name: "readTime",
      type: "number",
      title: "Read Time (minutes)",
      description: "Estimated reading time in minutes",
    }),
    defineField({
      name: "seo",
      type: "seo",
      title: "SEO",
    }),
    defineField({
      name: "internalLinks",
      type: "array",
      title: "Internal Links",
      description: "Related posts for internal linking",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Old",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});

