import { groq } from "next-sanity";

export const postListQuery = groq`
*[_type == "post" && defined(slug.current) || defined(slug_fr.current)]{
    ...,
    "slug": select(
    $locale == 'en' => coalesce(slug, slug_fr),
    $locale == 'fr' => coalesce(slug_fr, slug)
  ),
    "title": title[_key == $locale].value,
    "blurDataURL": coverImage.asset->.metadata.lqip,
    "excerpt":array::join(
    string::split(
      (pt::text(
        postContent[_key == $locale].value[]
      )
    ), "")[0..255], "") + "..."
}| order(publishDate desc)[0..1]`;


const lqipPlaceholders = groq`asset->{metadata{lqip}}`;

export const postListQuery2 = groq`
*[_type == "post" && defined(slug.current) || defined(slug_fr.current)]  {
    "posts": *[_type == "post" && defined(slug.current) || defined(slug_fr.current)] {
        ...,
        "slug": select(
            $locale == 'en' => coalesce(slug, slug_fr),
            $locale == 'fr' => coalesce(slug_fr, slug)
        ),
        "title": title[_key == $locale].value,
        "blurDataURL": coverImage.asset->.metadata.lqip,
        "excerpt": array::join(
            string::split(
            (pt::text(postContent[_key == $locale].value[]
            )
        ),""
        )[0..255], "") + "..."
    } | order(publishDate desc)[$start..$end],
    "totalCount": count(*[_type == "post" && defined(slug.current) || defined(slug_fr.current)])
  }[0]
  `;

export const indexAlbumQuery = groq`
*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0]{
    ...,
    "coverImage": coverImage{
      ...,
      "placeholders" : ${lqipPlaceholders}
      },
      "albums": *[_type=="album" && references(^._id)]
    | order(coalesce(publishDate, -1) desc){
        ...,
        "cover": images[0]{
            asset,
            "placeholders": ${lqipPlaceholders}
        }
    }
}`;

const queryLayoutPart = groq`_type == "layout-col-2"=>{...,rightCol[]{...,_type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},_type == "album" || _type == "albumCard" =>{...}->{...,images[0]{...,asset->}}}
,leftCol[]{...,_type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},_type == "album" || _type == "albumCard" =>{...}->{...,images[0]{...,asset->}}}}`;

export const pageQuery = groq`
*[_type == "page" && slug.current == $slug && (language == $locale || language == "en" || language == "fr")] | score(language == $locale) | order(_score desc)[0]{
    ...{
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
            slug,
            title,
            language
            }
        },
    title,
    content[]{
        ...,
        ${queryLayoutPart},
        markDefs[]{
            ...,
            _type == "internalLink" => {
                "type": @.reference->_type,
                "slug": @.reference->slug
                }
            },
            _type == "image" =>{
                asset, "blurDataURL": asset->.metadata.lqip
            },
            _type == "album" || _type == "albumCard" =>{...}->{
                albumName,
                "slug": slug.current,
                images[0]{
                    ...,
                    asset->
                }
            }
        },
    "blurDataURL": coverImage.asset->.metadata.lqip
}`;

export const categoryQuery = groq`
*[_type == "album" && category->.slug.current in [$slug]]{
    ...,
    "category": category->categoryName,images[]{
        ...,
        "placeholders": ${lqipPlaceholders}
        }
    } | order(coalesce(publishDate, -1) desc)`;


export const categoryParamsQuery = groq`
*[_type == "category" && defined(slug.current)][]{
    "params": { "slug": slug.current }
    }`

export const postPathsquery = groq`*[_type == "post" && defined(slug.current)][]{
  "params": { "slug": slug.current,"slug_fr": slug_fr.current }
}`
export const albumPathsquery = groq`*[_type == "album" && defined(slug.current)][]{
  "params": { "slug": slug.current }
}`

export const postQuery = groq`*[_type == "post" && (slug.current == $slug || slug_fr.current == $slug)] {"current": {...,"slug": select(
    $locale == 'en' => coalesce(slug, slug_fr),
    $locale == 'fr' => coalesce(slug_fr, slug)
  ), 
    "postContent": postContent[_key == $locale]{value[]
      {...,_type == "image" =>{asset, "blurDataURL": asset->.metadata.lqip},
        _type == "Post"=>{...}->{"slug": select(
          $locale == 'en' => coalesce(slug, slug_fr).current,
          $locale == 'fr' => coalesce(slug_fr, slug).current
        ),coverImage{...,asset->}, title[_key == $locale]},
        (_type == "album" || _type == "albumCard") =>{...}->{albumName,"slug": slug.current,images[0]{...,asset->}}}}
    ,"title": title[_key == $locale][0].value,
      "blurDataURL": coverImage.asset->.metadata.lqip
  }
  ,"previous": *[_type == "post" && ^.publishDate > publishDate]|order(publishDate desc)[0]{ 
    "slug": select(
      $locale == 'en' => coalesce(slug, slug_fr),
      $locale == 'fr' => coalesce(slug_fr, slug)
    ), "title": title[_key == $locale][0].value, publishDate, tags[], coverImage
  },"next": *[_type == "post" && ^.publishDate < publishDate]|order(publishDate asc)[0]{ 
  "slug": select(
      $locale == 'en' => coalesce(slug, slug_fr),
      $locale == 'fr' => coalesce(slug_fr, slug)
    ), "title": title[_key == $locale][0].value, publishDate, tags[], coverImage
  }
  } [0]`;


export const featuredAlbumQuery = groq`*[_type == "album"]{...,category->,images[featured == true]
  {...,"placeholders" : ${lqipPlaceholders}}}.images[]`;

export const albumQuery = groq`*[_type == "album"]{...,category->,images[]
  {...,"placeholders" : ${lqipPlaceholders}}}.images[]`;

export const albumQueryWithSlug = groq`*[_type == "album" && slug.current == $slug][0]{...,
    "description": albumContent[_key == $locale][0]{value[]
      {...,
        _type == "Post"=>{...}->{coverImage{...,asset->}, title[_key == $locale]},
        _type == "album" || _type == "albumCard" =>{...}->{albumName,"slug": slug.current,images[0]{...,asset->}}}}.value
  
  ,
  category->,images[]{...,"placeholders" : ${lqipPlaceholders}}}`;