
import album from './album'
import author from './author'
import category from './category'
import { page } from './page'
import pageList from './pageList'
import {post} from './post'
import { colors, siteSettings, socialLink } from './siteSettings'

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
        pageList
    ]
}
export default schemaTypes