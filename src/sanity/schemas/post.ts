import { PreviewValue } from 'sanity';
import { defineArrayMember, defineField, defineType } from "sanity"

export const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    defineField({
      name: 'title', type: 'string',
      title: 'Post Title',
    }),
    defineField({
      name: 'slug', type: 'slug',
      title: 'Post slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    }),
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
    defineField({
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
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [defineArrayMember({
        name: 'tag',
        type: 'string',
        title: 'Tag',
      })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishDate',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      title: 'Publish Date',
      options: {
        dateFormat: 'YYYY-MM-DD'
      }
    }),
    defineField({
      name: 'excerpt',
      title: 'Custom Excerpt',
      description: "This will override the default excerpt",
      type: 'string',
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
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
                      { type: 'post' as const },
                      { type: 'album' as const },
                      { type: 'category' as const },
                    ]
                  }
                ]
              }
            ]
          }
        }),
        defineArrayMember({ type: 'image' }),
        { type: 'reference', name: 'Post', to: { type: 'post' as const } },
        { type: 'reference', name: 'album', to: { type: 'album' as const } }

      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'coverImage',
    },
    prepare(value: Record<string, any>, viewOptions?: any): PreviewValue {
      const { author } = value
      return {
        title: value.title,
        subtitle: author && `by ${author.name}`,
        media: value.coverImage
      }
    },
  }
})