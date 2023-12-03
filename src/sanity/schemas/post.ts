import { PreviewValue } from 'sanity';
import { defineArrayMember, defineField, defineType } from "sanity"
import { MdOutlineArticle } from "react-icons/md";

export const post = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  icon: MdOutlineArticle,
  fields: [
    defineField({
      name: 'title', type: 'internationalizedArrayString',
      title: 'Post Title',
    }),

    defineField({
      name: 'slug', type: 'slug',
      title: 'Post slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: any) => {
          const title = input.find((element: { _key: string; _type: string; value: string; }) => element._key == 'en')?.value ?? input[0]?.value;
          return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
      },
    }),

    defineField({
      name: 'slug_fr', type: 'slug',
      title: 'Post slug (FR)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: any) => {
          const title = input.find((element: { _key: string; _type: string; value: string; }) => element._key == 'fr')?.value ?? input[0]?.value;
          return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
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
/*     defineField({
      name: 'excerpt',
      title: 'Custom Excerpt',
      description: "This will override the default excerpt",
      type: 'string',
    }), */
    defineField({
      name: 'postContent',
      type: 'internationalizedArrayBlockContent',
    }),
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
        title: value.title[0].value,
        subtitle: author && `by ${author.name}`,
        media: value.coverImage
      }
    },
  }
})