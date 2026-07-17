import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || ""
});

export type ImageSource = { asset?: { _ref: string } };

export const urlForImage = (source: ImageSource) => {
  return imageBuilder
    .image(source as SanityImageSource)
    .auto("format")
    .fit("max");
};

export type ImageDimensions = { width: number; height: number; aspectRatio: number };

export function getImageDimensions(id: string): ImageDimensions {
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

export function getResizedImage(
  image: ImageSource,
  quality?: number,
  height?: number,
  blur?: boolean
) {
  try {
    if (image.asset) {
      const dimensions = getImageDimensions(image.asset._ref);
      let imageBuilder = urlForImage(image);
      const imageHeight = height ? height : dimensions.height;
      const imageWidth = calculateNewWidth(dimensions.width, dimensions.height, imageHeight);

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
  image: ImageSource,
  size: number,
  quality?: number,
  blur?: boolean
) {
  try {
    if (image.asset) {
      let imageBuilder = urlForImage(image);

      const imageHeight = size;
      const imageWidth = size;

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
