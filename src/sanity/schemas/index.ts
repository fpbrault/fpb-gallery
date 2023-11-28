
import album from './album'
import siteSettings, { colors } from './siteSettings'
import category from './category'
import post from './post'
import author from './author'

export const schemaTypes = {
    types: [
        album,
        category,
        siteSettings,
        post,
        author,
        colors
    ]
}