import { FaImages, FaLink, FaPen } from "react-icons/fa6";
import { defineType, defineArrayMember, defineField } from "sanity";
import LinkRenderer from "@/components/PortableText/LinkRenderer";
import RoughAnnotationRenderer from "@/components/PortableText/RoughAnnotationRenderer";

const JustifyStyle = (props: any) => <div className="text-justify">{props.children} </div>;
const CenterStyle = (props: any) => <div className="text-center">{props.children} </div>;

export const styledBlock = defineType({
  title: "Block Content",
  name: "styledBlock",
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H1", value: "h1" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "Quote", value: "blockquote" },
    {
      title: "Justify",
      value: "justify",
      component: JustifyStyle
    },
    {
      title: "Center",
      value: "center",
      component: CenterStyle
    }
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" }
    ],
    annotations: [
      {
        name: "rough",
        type: "object",
        icon: FaPen,
        title: "Hand Drawn annotation",
        components: { annotation: RoughAnnotationRenderer },
        fields: [
          {
            name: "type",
            type: "string",
            title: "Type",
            initialValue: "underline",
            options: {
              list: [
                { title: "Underline", value: "underline" },
                { title: "Box", value: "box" },
                { title: "Highlight", value: "highlight" },
                { title: "Strike-Through", value: "strike-through" },
                { title: "Crossed-Off", value: "crossed-off" },
                { title: "Brackets", value: "brackets" },
                { title: "Circle", value: "circle" }
              ],
              layout: "dropdown"
            }
          },
          {
            name: "color",
            type: "color",
            title: "Color"
          },
          {
            name: "animate",
            type: "boolean",
            title: "Animate",
            initialValue: true
          },
          {
            name: "order",
            type: "number",
            description: "Order in which the animation appear.",
            title: "Order",
            initialValue: 1,
            validation: (Rule) => Rule.required().integer()
          }
        ]
      },
      {
        name: "link",
        type: "object",
        title: "Link",
        icon: FaLink,
        components: { annotation: LinkRenderer },
        fields: [
          {
            name: "href",
            type: "url",
            validation: (Rule) =>
              Rule.uri({
                allowRelative: false,
                scheme: ["http", "https", "mailto", "tel"]
              })
          }
        ]
      },
      {
        name: "internalLink",
        type: "object",
        title: "Internal link",
        icon: FaLink,
        components: { annotation: LinkRenderer },
        fields: [
          {
            name: "reference",
            type: "reference",
            title: "Reference",
            to: [{ type: "post" as const }, { type: "page" as const }, { type: "album" as const }]
          }
        ]
      }
    ]
  }
});

export const innerblockContent = defineType({
  title: "Block Content",
  name: "innerblockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "styledBlock"
    }),
    defineArrayMember({ type: "image" })
  ]
});

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export const blockContent = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "styledBlock"
    }),
    defineArrayMember({
      title: "2 Column Layout",
      name: "layout-col-2",
      type: "object",
      fields: [
        defineField({
          title: "Left Column",
          name: "leftCol",
          type: "innerblockContent"
        }),
        defineField({
          title: "Right Column",
          name: "rightCol",
          type: "innerblockContent"
        })
      ]
    }),

    defineArrayMember({ type: "image" }),
    defineArrayMember({ type: "youtube" }),
    { type: "reference", name: "Post", to: { type: "post" as const } },
    { type: "reference", name: "album", to: { type: "album" as const } },
    {
      type: "reference",
      icon: FaImages,
      title: "Album Card",
      name: "albumCard",
      to: { type: "album" as const }
    }
  ]
});
