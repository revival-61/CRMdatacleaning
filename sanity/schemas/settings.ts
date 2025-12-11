import { defineType, defineField } from "sanity";

export default defineType({
  name: "settings",
  type: "document",
  title: "Settings",
  fields: [
    defineField({
      name: "siteTitle",
      type: "string",
      title: "Site Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      type: "text",
      title: "Site Description",
      description: "Default meta description for the site",
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "footerLinks",
      type: "array",
      title: "Footer Links",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "url", type: "url", title: "URL" },
          ],
        },
      ],
    }),
  ],
});

