import { defineQuery } from "next-sanity";

const imageProjection = `{
  _key,
  _type,
  alt,
  asset,
  description,
  decorative,
  featured,
  title,
  "placeholders": {"metadata": {"lqip": asset->metadata.lqip}}
}`;

export const SITE_METADATA_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  siteTitle,
  description,
  author,
  socialLinks[]{name, type, url}
}`);

export const HEADER_QUERY = defineQuery(`*[_type == "pageList" && defined(pages)][0]{
  showHome,
  pages[]{
    _type,
    _type == "reference" => @->{
      title,
      "slug": slug.current,
      "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[].value->{language, title, "slug": slug.current}
    },
    _type == "hardcodedPage" => {
      title,
      title_fr,
      slug,
      slug_fr
    }
  }
}`);

export const CATEGORY_INDEX_QUERY = defineQuery(`
*[_type == "category" && count(*[_type == "album" && references(^._id)]) > 0]{
  _id,
  categoryName,
  slug,
  "coverImage": coverImage${imageProjection},
  "albums": *[_type == "album" && references(^._id)] | order(coalesce(publishDate, "") desc){
    _id,
    albumName,
    slug,
    "images": images[0...1]${imageProjection},
    "cover": images[0]${imageProjection}
  }
}`);

export const CATEGORY_QUERY = defineQuery(`
*[_type == "album" && category->slug.current == $slug] | order(coalesce(publishDate, "") desc){
  _id,
  albumName,
  slug,
  "images": images[]${imageProjection}
}`);

export const CATEGORY_SLUGS_QUERY = defineQuery(`
*[_type == "category" && defined(slug.current)]{"slug": slug.current}
`);

export const ALBUM_QUERY = defineQuery(`
*[_type == "album" && slug.current == $slug][0]{
  _id,
  albumName,
  slug,
  display,
  columns,
  "description": albumContent[_key == $locale][0].value,
  "category": category->{categoryName, slug},
  "images": images[]${imageProjection}
}`);

export const ALBUM_SLUGS_QUERY = defineQuery(`
*[_type == "album" && defined(slug.current)]{"slug": slug.current}
`);

export const ALL_IMAGES_QUERY = defineQuery(`
*[_type == "album"].images[]${imageProjection}
`);

export const FEATURED_IMAGES_QUERY = defineQuery(`
*[_type == "album"].images[featured == true]${imageProjection}
`);

const postSummaryProjection = `{
  _id,
  publishDate,
  coverImage,
  "slug": select(
    $locale == "fr" => coalesce(slug_fr, slug),
    coalesce(slug, slug_fr)
  ),
  "title": title[_key == $locale][0].value,
  "blurDataURL": coverImage.asset->metadata.lqip,
  "excerpt": array::join(string::split(pt::text(postContent[_key == $locale][0].value), "")[0...255], "") + "..."
}`;

export const POST_LIST_QUERY = defineQuery(`{
  "posts": *[_type == "post" && (defined(slug.current) || defined(slug_fr.current))]
    | order(publishDate desc) [0...$limit] ${postSummaryProjection},
  "totalCount": count(*[_type == "post" && (defined(slug.current) || defined(slug_fr.current))])
}`);

export const POST_CURSOR_QUERY = defineQuery(`
*[_type == "post" && (defined(slug.current) || defined(slug_fr.current)) &&
  (!defined($cursor) || publishDate < $cursor)]
  | order(publishDate desc) [0...$limit] ${postSummaryProjection}
`);

export const LATEST_POST_QUERY = defineQuery(`
*[_type == "post" && (defined(slug.current) || defined(slug_fr.current))]
  | order(publishDate desc) [0] ${postSummaryProjection}
`);

export const POST_QUERY = defineQuery(`
*[_type == "post" && (slug.current == $slug || slug_fr.current == $slug)][0]{
  "current": {
    _id,
    publishDate,
    coverImage,
    "slug": select($locale == "fr" => coalesce(slug_fr, slug), coalesce(slug, slug_fr)),
    "title": title[_key == $locale][0].value,
    "content": postContent[_key == $locale][0].value
  },
  "previous": *[_type == "post" && publishDate < ^.publishDate] | order(publishDate desc)[0] ${postSummaryProjection},
  "next": *[_type == "post" && publishDate > ^.publishDate] | order(publishDate asc)[0] ${postSummaryProjection}
}`);

export const POST_SLUGS_QUERY = defineQuery(`
*[_type == "post" && (defined(slug.current) || defined(slug_fr.current))]{
  "slug": slug.current,
  "slugFr": slug_fr.current
}`);

export const PAGE_QUERY = defineQuery(`
*[_type == "page" && slug.current == $slug && language == $locale][0]{
  _id,
  title,
  slug,
  language,
  content,
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    language,
    title,
    slug
  }
}`);

export const PAGE_SLUGS_QUERY = defineQuery(`
*[_type == "page" && defined(slug.current)]{language, "slug": slug.current}
`);

export const OG_POST_IMAGE_QUERY = defineQuery(`
*[_type == "post" && (slug.current == $slug || slug_fr.current == $slug)][0].coverImage
`);

export const OG_ALBUM_IMAGE_QUERY = defineQuery(`
*[_type == "album" && slug.current == $slug][0].images[0]
`);
