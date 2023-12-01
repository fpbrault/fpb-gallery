import { defineField, defineType } from "sanity"

export const category = {
  name: 'category',
  type: 'document',
  title: 'Categories',
  fields: [
    defineField({
      name: 'categoryName',
      type: 'string',
      title: 'Category Name',
    }),
    defineField({
      name: 'slug', type: 'slug',
      title: 'Category slug',
      options: {
        source: 'categoryName',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    }),
  ],
}

export default category;