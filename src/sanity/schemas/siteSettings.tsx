import { FaInfo, FaMoon, FaSun } from "react-icons/fa6";
import { defineArrayMember, defineField, defineType } from "sanity";


export const colors = defineType({
  name: "colors",
  title: "Site Colors",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Name of the color set",
      type: "string"
    }),
    defineField({
      name: "primary",
      title: "Primary",
      type: "color"
    }),
    defineField({
      name: "secondary",
      title: "Secondary",
      type: "color"
    }),
  ]
});

export const customTheme = defineType({
  name: "customTheme",
  title: "Custom Theme",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Name of the color set",
      type: "string"
    }),
    defineField({
      name: "p",
      title: "primary",
      type: "color"
    }),
    defineField({
      name: "pc",
      title: "primary-content",
      type: "color"
    }),
    defineField({
      name: "s",
      title: "secondary",
      type: "color"
    }),
    defineField({
      name: "sc",
      title: "secondary-content",
      type: "color"
    }),
    defineField({
      name: "a",
      title: "accent",
      type: "color"
    }),
    defineField({
      name: "ac",
      title: "accent-content",
      type: "color"
    }),
    defineField({
      name: "n",
      title: "neutral",
      type: "color"
    }),
    defineField({
      name: "nc",
      title: "neutral-content",
      type: "color"
    }),
    defineField({
      name: "b1",
      title: "base-100",
      type: "color"
    }),
    defineField({
      name: "b2",
      title: "base-200",
      type: "color"
    }),
    defineField({
      name: "b3",
      title: "base-300",
      type: "color"
    }),
    defineField({
      name: "bc",
      title: "base-content",
      type: "color"
    }),
    defineField({
      name: "in",
      title: "info",
      type: "color"
    }),
    defineField({
      name: "su",
      title: "success",
      type: "color"
    }),
    defineField({
      name: "wa",
      title: "warning",
      type: "color"
    }),
    defineField({
      name: "er",
      title: "error",
      type: "color"
    }),
  ]
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      title: "Title",
      initialValue: "Site Settings"
    }),
    defineField({
      name: "siteTitle",
      initialValue: "My portfolio",
      title: "Site Title",
      description:"50 characters maximum",
      validation: (Rule) => Rule.max(50).required(),
      type: "string"
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "string"
    }),
    defineField({
      name: "author",
      title: "Site Author",
      description:"32 characters maximum",
      validation: (Rule) => Rule.max(32).required(),
      type: "string"
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      validation: (Rule) => Rule.max(6),
      title: "Social Links",
      of: [defineArrayMember({ type: "socialLink" })]
    }),
    defineField({
      name: "darkThemeName",
      type: "string",
      icon: FaMoon,
      title: "Dark Theme Name",
      initialValue: 'mytheme',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Default Theme", value: "mytheme" },
          { title: "Dark", value: "dark" },
          { title: "Synthwave", value: "synthwave" },
          { title: "dracula", value: "dracula" },
          { title: "black", value: "black" },
          { title: "night", value: "night" },
          { title: "dim", value: "dim" },
          { title: "sunset", value: "sunset" },
          { title: "business", value: "business" }
        ]
      }
    }),
    defineField({
      name: "lightThemeName",
      type: "string",
      icon: FaSun,
      title: "Light Theme Name",
      initialValue: 'mytheme',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Default Theme", value: "light" },
          { title: "retro", value: "retro" },
          { title: "cupcake", value: "cupcake" },
          { title: "emerald", value: "emerald" },
          { title: "lofi", value: "lofi" },
          { title: "garden", value: "garden" },
          { title: "cmyk", value: "cmyk" },
          { title: "winter", value: "winter" },
          { title: "nord", value: "nord" },
          { title: "cyberpunk", value: "cyberpunk" }
        ]
      }
    }),
    defineField({
      title: 'Custom Theme Colors',
      description: 'You can set custom theme colors. These will override the default colors of your selected themes. Note that you do not need to set all of the colors.',
      name: 'myCustomNote',
      type: 'note',
      options: {
        icon: () => FaInfo,
        tone: 'positive',
      },
    }),
    defineField({
      name: "customDarkTheme",
      type: "reference",
      title: "Custom Dark Theme Colors",
      weak: false,
      to: [{ type: "customTheme" } as const]
    }),
    defineField({
      name: "customLightTheme",
      type: "reference",
      title: "Custom Light Theme Colors",
      weak: false,
      to: [{ type: "customTheme" } as const]
    }),
  ]
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",

  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Type",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "Youtube", value: "youtube" },
          { title: "Twitter", value: "twitter" },
          { title: "Twitch", value: "twitch" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Pinterest", value: "pinterest" },
          { title: "Snapchat", value: "snapchat" },
          { title: "TikTok", value: "tiktok" },
          { title: "Reddit", value: "reddit" },
          { title: "Tumblr", value: "tumblr" },
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Telegram", value: "telegram" },
          { title: "Discord", value: "discord" },
          { title: "Medium", value: "medium" },
          { title: "Flickr", value: "flickr" },
          { title: "Vimeo", value: "vimeo" },
          { title: "SoundCloud", value: "soundcloud" },
          { title: "Spotify", value: "spotify" },
          { title: "Behance", value: "behance" },
          { title: "Dribbble", value: "dribbble" },
        ],
        layout: "radio" // <-- defaults to 'dropdown'
      }
    }),
    defineField({
      name: "name",
      title: "Name",
      validation: (Rule) => Rule.required(),
      type: "string"
    }),
    defineField({
      name: "url",
      title: "Link",
      validation: (Rule) => Rule.required(),
      type: "string"
    })
  ]
});
