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
  ],
}
)

export default category;