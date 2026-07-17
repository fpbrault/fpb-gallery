import { defineArrayMember, defineField, defineType } from "sanity";

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
      description: "50 characters maximum",
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
      description: "32 characters maximum",
      validation: (Rule) => Rule.max(32).required(),
      type: "string"
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      validation: (Rule) => Rule.max(6),
      title: "Social Links",
      of: [defineArrayMember({ type: "socialLink" })]
    })
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
          { title: "Dribbble", value: "dribbble" }
        ],
        layout: "radio"
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
      title: "url",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https", "mailto", "tel"]
        }),
      type: "url"
    })
  ]
});
