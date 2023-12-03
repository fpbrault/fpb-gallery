import { FaFile } from "react-icons/fa6";
import { SlugValidationContext, defineField } from "sanity"
export const page = {
  name: 'page',
  type: 'document',
  title: 'Page',
  icon: FaFile,
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
        isUnique: isUniqueOtherThanLanguage
      },
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'blockContent',
    })
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
    },
    prepare(value: any) {
      const { title, language } = value;
      const flagEmoji = getFlagEmoji(language); // Add a function to get the flag emoji based on the language
  
      return {
        title: title,
        subtitle: flagEmoji ? `${flagEmoji} ${language}` : language,
      };
    },
  },
  
}
export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document?.language) {
    return true
  }
  const client = getClient({apiVersion: '2023-04-24'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result
}

function getFlagEmoji(language: string): string | null {
  switch (language) {
    case 'en':
      return '🇺🇸'; // Replace with the flag emoji for English
    case 'fr':
      return '🇫🇷'; // Replace with the flag emoji for French
    // Add more cases for other languages as needed
    default:
      return null; // Return null if the language is not supported
  }
}
