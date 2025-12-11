import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  type: "document",
  title: "Author",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      type: "text",
      title: "Bio",
      description: "Author biography",
    }),
    defineField({
      name: "avatar",
      type: "image",
      title: "Avatar",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "socialLinks",
      type: "object",
      title: "Social Links",
      fields: [
        {
          name: "twitter",
          type: "url",
          title: "Twitter",
        },
        {
          name: "linkedin",
          type: "url",
          title: "LinkedIn",
        },
        {
          name: "github",
          type: "url",
          title: "GitHub",
        },
        {
          name: "website",
          type: "url",
          title: "Website",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "avatar",
    },
  },
});

