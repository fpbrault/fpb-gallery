import { PreviewImage } from '@/components/studio/PreviewImage';
import { defineType } from 'sanity'

export const album = defineType({
  name: 'album',
  type: 'document',
  title: 'Albums',
  groups: [
    {
      name: 'metadata',
      title: 'Metadata',
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'options',
      title: 'Options',
    },
  ],
  fields: [
    {
      name: 'albumName', type: 'string',
      title: 'Album Name',group: 'metadata'
    },
    {
      name: 'albumId', type: 'string',
      title: 'Album Id', group: 'metadata'
    },
    {
      name: 'publishDate',
      type: 'datetime',
      group: 'metadata',
      initialValue: (new Date()).toISOString(),
      title: 'Publish Date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today'
      }
    },
    {
      name: 'slug', type: 'slug',
      title: 'Album slug',
      group: 'metadata',
      options: {
        source: 'albumName',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    },
    {
      name: 'category',
      type: 'reference',
      group: 'metadata',
      title: 'Category',
      to: [{ type: 'category' }],
    },
    {
      name: 'description', type: 'array',
      title: 'Album Description',
      group: 'metadata',
      of: [{ type: 'block' },
      {
        type: 'image'
      }]
    },
    {
      name: 'display',
      type: 'string',
      group: 'options',
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
      group: 'options',
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
      name: 'images',
      type: 'array',
      group: 'media',
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
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishDateDesc',
      by: [
        {field: 'publishDate', direction: 'desc'}
      ]
    },
    {
      title: 'Publish Date, Old',
      name: 'publishDateAsc',
      by: [
        {field: 'publishDate', direction: 'asc'}
      ]
    },
    {
      title: 'Alphabetical, Asc',
      name: 'alphaAsc',
      by: [
        {field: 'albumName', direction: 'asc'}
      ]
    },
    {
      title: 'Alphabetical, Desc',
      name: 'alphaDesc',
      by: [
        {field: 'albumName', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'albumName',
      images: 'images',
      category: 'category.categoryName',
      publishDate: 'publishDate'
    },
    prepare(selection) {
      const { title, images, category, publishDate} = selection;

      return {
        title: title,
        media: images ? images[0] : null,
        subtitle: (category ?? "Uncategorized") +  (publishDate ? (" | Published:" + new Date(publishDate).toLocaleDateString()) : "")
      };
    },
  }

})

export default album;