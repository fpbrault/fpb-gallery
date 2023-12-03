import { defineArrayMember, defineField, defineType } from "sanity";
import { PreviewValue } from "sanity";

export const colors = defineType({
  name: "colors",
  title: "Site Colors",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Name of the color set",
      type: "string"
    }),
    defineField({
      name: "primary",
      title: "Primary",
      type: "color"
    }),
    defineField({
      name: "secondary",
      title: "Secondary",
      type: "color"
    })
  ]
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      title: "Title",
      initialValue: "Site Settings"
    }),
    defineField({
      name: "siteTitle",
      initialValue: "My portfolio",
      title: "Site Title",
      validation: (Rule) => Rule.required(),
      type: "string"
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "string"
    }),
    defineField({
      name: "author",
      title: "Site Author",
      validation: (Rule) => Rule.required(),
      type: "string"
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      title: "Social Links",
      of: [defineArrayMember({ type: "socialLink" })]
    }),
    defineField({
      name: "siteColors",
      type: "reference",
      title: "Colors",
      weak: false,
      to: [{ type: "colors" } as const]
    })
  ]
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",

  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Type",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "Youtube", value: "youtube" }
        ],
        layout: "radio" // <-- defaults to 'dropdown'
      }
    }),
    defineField({
      name: "name",
      title: "Name",
      validation: (Rule) => Rule.required(),
      type: "string"
    }),
    defineField({
      name: "url",
      title: "Link",
      validation: (Rule) => Rule.required(),
      type: "string"
    })
  ]
});
