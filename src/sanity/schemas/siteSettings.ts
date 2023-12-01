import {
    defineArrayMember,
    defineField,
    defineType,
  } from "sanity";
import { PreviewValue } from "sanity";


export const colors = defineType({
    name: 'colors',
    title: 'Site Colors',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: "Name",
            description: "Name of the color set",
            type: 'string'
        }),
        defineField({
            name: 'primary',
            title: "Primary",
            type: 'color',
        }),
        defineField({
            name: 'secondary',
            title: "Secondary",
            type: 'color',
        })
    ]
})


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
            // marks: {
            //   annotations: [
            //     defineField({
            //       name: 'internalLink',
            //       type: 'object',
            //       title: 'Internal link',
            //       fields: [
            //         defineField({
            //           name: 'reference',
            //           type: 'reference',
            //           title: 'Reference',
            //           to: [
            //             { type: 'post' as const },
            //             { type: 'album' as const },
            //             { type: 'category' as const },
            //           ]
            //         })
            //       ]
            //     })
            //   ]
            // }
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

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            hidden: true,
            title: 'Title',
            initialValue: "Site Settings"
        }),
        defineField({
            name: 'siteTitle',
            initialValue: 'My portfolio',
            title: 'Site Title',
            validation: Rule => Rule.required(),
            type: 'string'
        }),
        defineField({
            name: 'description',
            title: 'Site Description',
            type: 'text'
        }),
        defineField({
            name: 'author',
            title: 'Site Author',
            validation: Rule => Rule.required(),
            type: 'text'
        }),
        defineField( {
            name: 'socialLinks', type: 'array',
            title: 'Social Links',
            of: [
                defineArrayMember({ type: 'socialLink' })]
        }),
        defineField({
            name: 'siteColors',
            type: 'reference',
            title: 'Colors',
            weak: false,
            to: [{ type: 'colors' }as const ],
        }),
    ]
})


export const socialLink = defineType({
    name: 'socialLink',
    title: 'Social Link',
    type: 'object',
    
    fields: [
        defineField({
            name: 'type',
            type: 'string',
            title: 'Type',
            validation: Rule => Rule.required(),
            options: {
                list: [
                    { title: 'Instagram', value: 'instagram' },
                    { title: 'Facebook', value: 'facebook' },
                    { title: 'Youtube', value: 'youtube' },
                ],
                layout: 'radio', // <-- defaults to 'dropdown'
            },
        }),
        defineField({
            name: 'name',
            title: "Name",
            validation: Rule => Rule.required(),
            type: 'string'
        }),
        defineField({
            name: 'url',
            title: "Link",
            validation: Rule => Rule.required(),
            type: 'string'
        }),
    ]
})
