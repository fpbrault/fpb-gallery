import { SanityClient, createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
import { albumPathsquery, albumQuery, albumQueryWithSlug, categoryParamsQuery, categoryQuery, featuredAlbumQuery, indexAlbumQuery, pageQuery, postListQuery, postListQuery2, postPathsquery, postQuery } from "../queries";

export function getClient(previewToken?: string): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn
  });

  return previewToken
    ? client.withConfig({
      token: previewToken,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: "previewDrafts"
    })
    : client;
}

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: "published"
});

export const cdnClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: true
});


export async function getFeaturedImagesAlbum() {

  const album = await client.fetch(featuredAlbumQuery);

  return album;
}

export async function getAllImages() {

  const album = await client.fetch(albumQuery);

  return album;
}

export async function getAlbumPaths() {
  const paths = await client.fetch(albumPathsquery);
  return paths;
}

export async function getAlbumBySlug(slug: string | string[] | undefined, locale: string | undefined) {

  if (Array.isArray(slug)) {
    slug = slug[0];
  } else if (typeof slug === 'string') {
    slug = slug;
  }

  if (!slug) {
    // Handle the case when slug is undefined
    throw new Error("Slug is required");
  }
  const album = await client.fetch(albumQueryWithSlug, { slug: slug, locale: locale });

  return album;
}

export async function getAllPosts(context: any) {
  const postsPerPage = 3;

  if (context.params) {
    context.params.locale = context?.locale;
    // Check if context.params.slug is an array and then join it
    if (Array.isArray(context.params.slug)) {
      context.params.slug = context.params.slug.join("/");
    }
  } else {
    context.params = { locale: context?.locale };
  }
  const posts = await client.fetch(postListQuery2, { ...context.params, start: 0, end: postsPerPage - 1 });


  return posts;
}



export async function getCustomPageContent(slug: string | string[] | undefined, locale: string | undefined) {

  if (!slug) {
    // Handle the case when slug is undefined
    throw new Error("Slug is required");
  }
  if (!locale) {
    // Handle the case when slug is undefined
    throw new Error("Locale is required");
  }

  const pageContent = await client.fetch(pageQuery, { slug: slug, locale: locale });

  return pageContent;
}

export async function getCategories() {
  const categories = await client.fetch(indexAlbumQuery);
  return categories;
}

export async function getCategoryPaths() {
  const paths = await client.fetch(categoryParamsQuery);
  return paths;
}
export async function getCategoryBySlug(slug: string | string[] | undefined) {

  if (Array.isArray(slug)) {
    slug = slug[0];
  } else if (typeof slug === 'string') {
    slug = slug;
  }

  if (!slug) {
    // Handle the case when slug is undefined
    throw new Error("Slug is required");
  }
  const category = await client.fetch(categoryQuery, { slug: slug });

  return category;
}

export async function getPostPaths(locales: string[] | undefined) {
  const paths = await client.fetch(postPathsquery);

  const pathsForLocales: any[] = [];

  paths.map((element: { params: { slug: string; slug_fr: string } }) => {
    return locales?.map((locale: string) => {
      const slugName = locale == "en" ? "slug" : "slug_fr";
      const slugForLocale = slugName ? element.params[slugName] : null;
      if (slugForLocale) {
        return pathsForLocales.push({
          params: { slug: `${slugForLocale}` },
          locale
        });
      }
    });
  });

  return pathsForLocales;
}
export async function getPostBySlug(slug: string, locale: string) {

  const post = await client.fetch(postQuery, { slug: slug, locale: locale });
  return post
}

export async function getLatestPost(locale: string) {

  const pageContent = await client.fetch(postListQuery, { locale: locale });

  return pageContent;
}