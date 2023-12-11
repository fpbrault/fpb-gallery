import { SanityClient, createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
import { urlForImage } from "./image";
import { UseNextSanityImageDimensions } from "next-sanity-image";
import { marked } from "marked";
import { Image } from "sanity";
import { pageQuery, postListQuery2 } from "../queries";

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

export function getImageDimensions(id: string): UseNextSanityImageDimensions {
  const dimensions = id.split("-")[2];

  const [width, height] = dimensions.split("x").map((num: string) => parseInt(num, 10));
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

function calculateNewWidth(originalWidth: number, originalHeight: number, newHeight: number) {
  // Calculate the aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  // Calculate the new width based on the aspect ratio and the given height
  const newWidth = aspectRatio * newHeight;

  return Math.floor(newWidth);
}

export function getResizedImage(image: Image, quality?: number, height?: number, blur?: boolean) {
  try {
    if (image.asset) {
      const dimensions = getImageDimensions(image.asset._ref);
      let imageBuilder = urlForImage(image);
      let imageHeight = height ? height : dimensions.height;
      let imageWidth = calculateNewWidth(dimensions.width, dimensions.height, imageHeight);

      imageBuilder = imageBuilder.height(height ? height : imageHeight).width(imageWidth);

      if (quality) {
        imageBuilder = imageBuilder.quality(quality);
      } else {
        imageBuilder = imageBuilder.quality(75);
      }
      if (blur) {
        imageBuilder = imageBuilder.blur(100);
      }
      const imageUrl = imageBuilder.url();
      return { imageUrl, imageHeight, imageWidth };
    } else {
      throw new Error("No Asset for Image");
    }
  } catch (error) {
    throw error;
  }
}

export function getResizedImageSquare(
  image: Image,
  size: number,
  quality?: number,
  blur?: boolean
) {
  try {
    if (image.asset) {
      let imageBuilder = urlForImage(image);

      let imageHeight = size;
      let imageWidth = size;

      imageBuilder = imageBuilder.height(size).width(size);

      if (quality) {
        imageBuilder = imageBuilder.quality(quality);
      } else {
        imageBuilder = imageBuilder.quality(75);
      }
      if (blur) {
        imageBuilder = imageBuilder.blur(100);
      }
      const imageUrl = imageBuilder.url();
      return { imageUrl, imageHeight, imageWidth };
    } else {
      throw new Error("No Asset for Image");
    }
  } catch (error) {
    throw error;
  }
}

export async function getCategories() {
  const query =
    '*[_type == "category" && count(*[_type=="album" && references(^._id)]) > 0] {...,"albums": *[_type=="album" && references(^._id)]{...,"cover": images[0]{asset, "placeholders" : asset->{metadata{lqip}}}}}';

  const categories = await client.fetch(query);
  const categoriesWithComputedURLs = await Promise.all(
    categories.map(async (category: { albums: any[]; categoryName: any }) => {
      const recentAlbum = category.albums[0];
      if (typeof recentAlbum != "undefined") {
        const {
          imageUrl: coverImageUrl,
          imageWidth,
          imageHeight
        } = getResizedImage(recentAlbum.cover, 75, 600);
        return {
          categoryName: category.categoryName,
          albums: category.albums,
          coverImage: coverImageUrl,
          coverImageHeight: imageHeight,
          coverImageWidth: imageWidth,
          blurDataURL: recentAlbum.cover.placeholders.metadata.lqip
        };
      }
    })
  );
  return categoriesWithComputedURLs;
}

export async function getAlbumsForCategory(categoryName: string | string[] | undefined) {
  const query = `*[_type == "category" && lower(categoryName) == lower("${categoryName}")]{...,"albums": *[_type=="album" && references(^._id)]{...,images[]{...,"placeholders" : asset->{metadata{lqip}}}}}`;

  const category = await client.fetch(query);

  // Compute the URLs using the urlForImage function
  const albumsWithComputedURLs = category[0].albums.map(
    (album: { images: any[]; coverImage: string }) => {
      const imagesWithComputedURLs = album.images.map((image: Image) => {
        const { imageUrl, imageWidth, imageHeight } = getResizedImage(image, 75, 800);
        const blurdata = image?.placeholders ?? (null as any);
        return {
          ...image,
          src: imageUrl,
          height: imageHeight,
          width: imageWidth,
          blurDataURL: blurdata.metadata.lqip
        };
      });
      album.coverImage = urlForImage(album.images[0]).height(800).url();
      return {
        ...album,
        images: imagesWithComputedURLs
      };
    }
  );

  return albumsWithComputedURLs;
}

export async function getAlbum(id: string | string[] | undefined) {
  const query = `*[_type == "album" && lower(albumId) == lower("${id}")]{...,category->,images[]{...,"placeholders" : asset->{metadata{lqip}}}}`;

  const albums = await client.fetch(query);
  // Compute the URLs using the urlForImage function
  const albumsWithComputedURLs = albums.map(
    (album: { images: any[]; coverImage: string; albumDescription: string }) => {
      const imagesWithComputedURLs = album.images.map((image: Image) => {
        const { imageUrl: thumbnailSrc } = getResizedImage(image, 80, 800);
        const { imageUrl, imageWidth, imageHeight } = getResizedImage(image, 80, 2048);
        return {
          ...image,
          description: image.description ? marked(image.description.toString()) : null,
          src: imageUrl,
          thumbnailSrc: thumbnailSrc,
          height: imageHeight,
          width: imageWidth
        };
      });
      album.coverImage = urlForImage(album.images[0]).height(800).url();

      return {
        ...album,
        images: imagesWithComputedURLs,
        albumDescription: album.albumDescription ? marked(album.albumDescription) : null
      };
    }
  );

  return albumsWithComputedURLs[0];
}

export async function getFeaturedImagesAlbum() {
  const query = `*[_type == 'album'] {
    "featuredImages": images[featured == true]{"stuff": asset->{ "_createdAt": _createdAt},...,"placeholders" : asset->{metadata{lqip}}} 
  } | order(featuredImages.stuff._createdAt desc)`;

  const albums = await client.fetch(query);

  const combinedFeaturedImages = [].concat(
    ...albums.map((item: { featuredImages: any }) => item.featuredImages)
  );

  const myAlbum = [
    {
      display: "rows",
      albumId: "featured",
      category: { categoryName: "Featured" },

      albumName: "Featured",
      images: combinedFeaturedImages
    }
  ];

  // Compute the URLs using the urlForImage function
  const albumsWithComputedURLs = myAlbum.map((album: any) => {
    const imagesWithComputedURLs = album.images.map((image: Image) => {
      const { imageUrl: thumbnailSrc } = getResizedImage(image, 75, 800);
      const { imageUrl, imageWidth, imageHeight } = getResizedImage(image, 75, 2048);
      return {
        ...image,
        description: image.description ? marked(image.description.toString()) : null,
        src: imageUrl,
        thumbnailSrc: thumbnailSrc,
        height: imageHeight,
        width: imageWidth
      };
    });
    album.coverImage = urlForImage(album.images[0]).height(800).url();

    return {
      ...album,
      images: imagesWithComputedURLs,
      albumDescription: album.albumDescription ? marked(album.albumDescription) : null
    };
  });

  return albumsWithComputedURLs[0];
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


export async function getCustomPageContent(slug: string, locale: string) {

  const pageContent = await client.fetch(pageQuery, { slug: slug, locale: locale });
  
  return pageContent;
}

export async function getPostBySlug(slug: string) {
  const query =
    '*[_type == "post" && slug.current =="' +
    slug +
    '"][0]{...,content[]{...,_type == "album" =>{...}->{albumName,albumId,images[]{...,asset->}}},"blurDataURL": coverImage.asset->.metadata.lqip}';

  const post = await client.fetch(query);
  const width = 1000;
  const height = 750;
  const imageUrl = urlForImage(post.coverImage).height(height).width(width).quality(80).url();

  return {
    ...post,
    imageUrl: imageUrl,
    imageWidth: width,
    imageHeight: height,
    blurDataUrl: post.blurDataURL
  };
}
