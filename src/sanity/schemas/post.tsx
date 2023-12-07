import { PreviewValue } from "sanity";
import { defineArrayMember, defineField, defineType } from "sanity";
import { MdOutlineArticle } from "react-icons/md";
import Image from "next/image";

export const post = defineType({
  name: "post",
  type: "document",
  title: "Post",
  icon: MdOutlineArticle,
  fields: [
    defineField({
      name: "title",
      type: "internationalizedArrayString",
      title: "Post Title",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      title: "Post slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: any) => {
          const title =
            input.find(
              (element: { _key: string; _type: string; value: string }) => element._key == "en"
            )?.value ?? input[0]?.value;
          return title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        }
      }
    }),

    defineField({
      name: "slug_fr",
      type: "slug",
      title: "Post slug (FR)",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: any) => {
          const title =
            input.find(
              (element: { _key: string; _type: string; value: string }) => element._key == "fr"
            )?.value ?? input[0]?.value;
          return title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        }
      }
    }),
    defineField({
      name: "author",
      type: "author",
      hidden: true,
      title: "Author",
      initialValue: async () => {
        const user = await fetch(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/users/me`,
          {
            credentials: "include"
          }
        ).then((res) => res.json());

        const { name, id } = user;
        return {
          name,
          id,
          _type: "author"
        };
      }
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string"
        }
      ],
      title: "Cover Image"
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [
        defineArrayMember({
          name: "tag",
          type: "string",
          title: "Tag"
        })
      ],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "publishDate",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      description: "This does not affect the publishing status of the post. It is only used to determine the order of the posts on the blog page (and post navigation)",
      initialValue: new Date().toISOString(),
      title: "Publish Date",
      options: {
        dateFormat: "YYYY-MM-DD"
      }
    }),
    defineField({
      name: "postContent",
      title: "Post Content",
      type: "internationalizedArrayBlockContent"
    })
  ],
  orderings: [
    {
      title: "Publish Date, New",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }]
    },
    {
      title: "Publish Date, Old",
      name: "publishDateAsc",
      by: [{ field: "publishDate", direction: "asc" }]
    },
    {
      title: "Alphabetical, Asc",
      name: "alphaAsc",
      by: [{ field: "title", direction: "asc" }]
    },
    {
      title: "Alphabetical, Desc",
      name: "alphaDesc",
      by: [{ field: "title", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "title",
      publishDate: "publishDate",
      coverImage: "coverImage"
    },
    prepare(value: Record<string, any>): PreviewValue {
      const { publishDate } = value;
      return {
        title: value.title[0].value,
        subtitle: publishDate && `${new Date(publishDate).toLocaleString()}`,
        media: value.coverImage ?? <Image unoptimized width={100} height={100} alt="no image" src="https://placehold.co/100x100/orange/white/jpg?text=no-image"></Image>,
      };
    }
  }
});
