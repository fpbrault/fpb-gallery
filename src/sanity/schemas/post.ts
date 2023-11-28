import { defineField, defineType } from 'sanity'

export const album = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    {
      name: 'title', type: 'string',
      title: 'Post Title',
    },
    {
      name: 'slug', type: 'slug',
      title: 'Post slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    },
    defineField({
      name: 'author',
      type: 'author',
      title: 'Author',
      initialValue: async () => {
        const user = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/users/me`, {
          credentials: 'include'
        }).then((res) => res.json())

        const { name, id } = user;
        return {
          name,
          id,
          _type: 'author'
        }
      }
    }),
    {
      name: 'coverImage', type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
      title: 'Cover Image',
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{
        name: 'tag',
        type: 'string',
        title: 'Tag',
      }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'publishDate',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      title: 'Publish Date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today'
      }
    },
    {
      name: 'excerpt',
      title: 'Custom Excerpt',
      description: "This will override the default excerpt",
      type: 'string',
    },
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [
        { type: 'block',
        marks: {
          annotations: [
            {
              name: 'internalLink',
              type: 'object',
              title: 'Internal link',
              fields: [
                {
                  name: 'reference',
                  type: 'reference',
                  title: 'Reference',
                  to: [
                    { type: 'post' },
                    { type: 'album' },
                    { type: 'category' },
                    // other types you may want to link to
                  ]
                }
              ]
            }
          ]
        }},
         { type: 'image' }, 
         { type: 'reference', name: 'Post', to: { type: 'post' } }, 
         { type: 'reference', name: 'album', to: { type: 'album' } },
         
        ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'coverImage',
    },
    prepare(selection: { author: any }) {
      const { author } = selection
      return {
        ...
        selection, subtitle: author && `by ${author.name}`
      }
    },
  }
})

export default album;