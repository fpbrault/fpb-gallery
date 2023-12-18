import { defineField, defineType } from "sanity";

export const category = {
  name: "category",
  type: "document",
  title: "Categories",
  fields: [
    defineField({
      name: "categoryName",
      type: "string",
      title: "Category Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      title: "Category slug",
      options: {
        source: "categoryName",
        maxLength: 96,
        slugify: (input) => {
          return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        }
      }
    }),
    defineField({
      name: "coverImage",
      type: "image",
      description: "Optional, defaults to the first image of the most recent album",
      options: {
        hotspot: true
      },
      title: "Cover Image"
    }),
  ]
};

export default category;
