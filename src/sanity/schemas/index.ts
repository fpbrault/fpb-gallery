import type { Template } from "sanity";
import album from "./album";
import author from "./author";
import { blockContent, innerblockContent, styledBlock } from "./blockContent";
import category from "./category";
import { page } from "./page";
import pageList from "./pageList";
import { post } from "./post";
import { siteSettings, socialLink } from "./siteSettings";
import { youtube } from "./youtube";

export const schemaTypes = {
  types: [
    album,
    category,
    siteSettings,
    socialLink,
    post,
    author,
    page,
    pageList,
    blockContent,
    styledBlock,
    innerblockContent,
    youtube
  ],
  templates: (previous: Template[]) =>
    previous.filter((template) => !["page"].includes(template.id))
};
export default schemaTypes;
