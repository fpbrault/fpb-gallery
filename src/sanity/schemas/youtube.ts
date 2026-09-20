import { defineField, defineType } from "sanity";
import { YouTubePreview } from "@/components/studio/YoutubePreview";

export const youtube = defineType({
  name: "youtube",
  type: "object",
  title: "YouTube Embed",
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube video URL"
    })
  ],
  preview: {
    select: {
      url: "url"
    }
  },
  components: {
    preview: YouTubePreview
  }
});
