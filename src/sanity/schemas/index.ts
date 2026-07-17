import album from "./album";
import author from "./author";
import category from "./category";
import { page } from "./page";
import pageList from "./pageList";
import { post } from "./post";
import { colors, customTheme, siteSettings, socialLink } from "./siteSettings";
import { blockContent, innerblockContent, styledBlock } from "./blockContent";
import { youtube } from "./youtube";
import type { Template } from "sanity";

export const schemaTypes = {
  types: [
    album,
    category,
    siteSettings,
    socialLink,
    post,
    author,
    colors,
    page,
    pageList,
    blockContent,
    styledBlock,
    innerblockContent,
    customTheme,
    youtube
  ],
  templates: (previous: Template[]) =>
    previous.filter((template) => !["page"].includes(template.id))
};
export default schemaTypes;
