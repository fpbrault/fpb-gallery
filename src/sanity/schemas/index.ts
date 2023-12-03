import album from './album'
import author from './author'
import category from './category'
import { page } from './page'
import pageList from './pageList'
import {post} from './post'
import { colors, siteSettings, socialLink } from './siteSettings'
import {blockContent, innerblockContent, styledBlock} from './blockContent'

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
        innerblockContent
    ],
    templates: (prev: any[]) =>
    prev.filter((template) => !['page', 'post'].includes(template.id)),
}
export default schemaTypes