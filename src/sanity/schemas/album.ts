import { PreviewImage } from "@/components/studio/PreviewImage";
import { defineArrayMember, defineField } from "sanity";
import { FaImages } from "react-icons/fa6";

export const album = {
  name: "album",
  type: "document",
  title: "Albums",
  icon: FaImages,
  groups: [
    {
      name: "metadata",
      title: "Metadata"
    },
    {
      name: "media",
      title: "Media"
    },
    {
      name: "options",
      title: "Options"
    }
  ],
  fields: [
    defineField({
      name: "albumName",
      type: "string",
      title: "Album Name",
      group: "metadata",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Album slug",
      validation: (Rule) => Rule.required(),
      group: "metadata",
      options: {
        source: "albumName",
        maxLength: 96,
        slugify: (input) => {
          return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        }
      }
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "metadata",
      validation: (Rule) => Rule.required(),
      title: "Category",
      to: [{ type: "category" as any }]
    }),
    defineField({
      name: "publishDate",
      type: "datetime",
      group: "metadata",
      initialValue: new Date().toISOString(),
      title: "Publish Date",
      options: {
        dateFormat: "YYYY-MM-DD"
      }
    }),
    defineField({
      name: "albumContent",
      title: "Album Description",
      group: "metadata",
      type: "internationalizedArrayBlockContent"
    }),
    defineField({
      name: "display",
      type: "string",
      group: "options",
      title: "Display as",
      initialValue: "rows",
      description: "How should we display these images?",
      options: {
        list: [
          { title: "Rows", value: "rows" },
          { title: "Columns", value: "columns" },
          { title: "Masonry", value: "masonry" }
        ],
        layout: "radio" // <-- defaults to 'dropdown'
      }
    }),
    defineField({
      name: "columns",
      type: "number",
      group: "options",
      title: "Number of columns",
      hidden: ({ document }) => document?.display === "rows",
      description: "No effect on mobile devices",
      initialValue: 3,
      options: {
        list: [2, 3, 4, 5, 6]
      }
    }),

    defineField({
      name: "images",
      type: "array",
      group: "media",
      title: "Images",
      of: [
        defineArrayMember({
          name: "image",
          type: "image",
          title: "Image",
          components: {
            preview: PreviewImage
          },
          options: {
            hotspot: true,
            metadata: ["blurhash", "lqip"]
          },
          fields: [
            defineField({
              name: "featured",
              type: "boolean",
              title: "Featured"
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text"
            }),
            defineField({
              name: "title",
              type: "string",
              title: "Title"
            }),
            defineField({
              name: "description",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block"
                }),
                defineArrayMember({
                  type: "image"
                })
              ],
              title: "Description"
            })
          ]
        })
      ],
      options: {
        layout: "grid"
      }
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
      by: [{ field: "albumName", direction: "asc" }]
    },
    {
      title: "Alphabetical, Desc",
      name: "alphaDesc",
      by: [{ field: "albumName", direction: "desc" }]
    }
  ],
  preview: {
    select: {
      title: "albumName",
      images: "images",
      category: "category.categoryName",
      publishDate: "publishDate"
    },
    prepare(selection: any) {
      const { title, images, category, publishDate } = selection;

      return {
        title: title,
        media: images ? images[0] : null,
        subtitle:
          (category ?? "Uncategorized") +
          (publishDate ? " | Published:" + new Date(publishDate).toLocaleDateString() : "")
      };
    }
  }
};

export default album;
