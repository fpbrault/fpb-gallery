import { PreviewImage } from '@/components/studio/PreviewImage';
import { defineType } from 'sanity'

export const album = defineType({
  name: 'album',
  type: 'document',
  title: 'Albums',
  fields: [
    {
      name: 'albumName', type: 'string',
      title: 'Album Name',
    },
    {
      name: 'albumId', type: 'string',
      title: 'Album Id',
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }],
    },
    {
      name: 'display',
      type: 'string',
      title: 'Display as',
      initialValue: "rows",
      description: 'How should we display these images?',
      options: {
        list: [
          { title: 'Rows', value: 'rows' },
          { title: 'Columns', value: 'columns' },
          { title: 'Masonry', value: 'masonry' },
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
    },
    {
      name: 'columns',
      type: 'number',
      title: 'Number of columns',
      hidden: ({ document }) => (document?.display === "rows"),
      description: 'No effect on mobile devices',
      initialValue: 3,
            options: {
        list: [
         2,3,4,5,6
        ]
      },
    },
    {
      name: 'description', type: 'array',
      title: 'Album Description',
      of: [{ type: 'block' },
      {
        type: 'image'
      }]
    },

    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        {
          name: 'image',
          type: 'image',
          title: 'Image',
          components: {
            preview: PreviewImage,
          },
          options: {
            hotstop: true,
            metadata: [
              'blurhash',
              'lqip',
            ],
          },
          fields: [
            {
              name: 'featured',
              type: 'boolean',
              title: 'Featured',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'description',
              type: 'array',
              of: [{ type: 'block' },
              {
                type: 'image'
              }],
              title: 'Description',
            },
          ],

        },
      ], options: {
        layout: "grid",
      },

    },
  ],
  preview: {
    select: {
      title: 'albumName',
      images: 'images',
      category: 'category.categoryName'
    },
    prepare(selection) {
      const { title, images, category } = selection;

      return {
        title: title,
        media: images ? images[0] : null,
        subtitle: category ?? "Uncategorized"
      };
    },
  }

})

export default album;