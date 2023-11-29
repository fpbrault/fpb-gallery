import { defineType } from 'sanity'

export const category = defineType({

  name: 'category',
  type: 'document',
  title: 'Categories',
  fields: [
    {
      name: 'categoryName',
      type: 'string',
      title: 'Category Name',
    },
    {
      name: 'slug', type: 'slug',
      title: 'Category slug',
      options: {
        source: 'categoryName',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    },
  ],
}
)

export default category;