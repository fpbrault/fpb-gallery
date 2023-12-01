import { defineArrayMember, defineField, defineType } from "sanity"
import { client } from "../lib/client";

export const page = {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      initialValue: 'en',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'header',
      type: 'boolean',
      title: 'Show in Header',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Page Order',
      description: 'Enter a number to specify the order of this page in the header.',
    }),
    defineField({
      name: 'title', type: 'string',
      title: 'Page Title',
    }),
    defineField({
      name: 'slug', type: 'slug',
      title: 'Page slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => {
          return input.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        },
        isUnique: (input, { document }) => {
          // Check if the slug is unique within the same locale
          const query = `*[slug.current == $slug && language == $language && _id != $id]`;
          const params = {
            slug: input,
            language: document?.language,
            id: document?._id || 'does-not-exist', // Handle the case when creating a new document
          };
          
          return client.fetch(query, params).then(existingDocs => {
            return existingDocs.length === 0;
          });
        },
      },
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
                      { type: 'post' },
                      { type: 'album' },
                      { type: 'category' },
                    ]
                  }
                ]
              }
            ]
          }
        }),
        defineArrayMember({ type: 'image' }),
        { type: 'reference', name: 'Post', to: { type: 'post' as any } },
        { type: 'reference', name: 'album', to: { type: 'album' as const } },

      ]
    })
  ],
}