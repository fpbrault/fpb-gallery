import { promises as fs } from 'fs';
import path from 'path';
import sizeOf from 'image-size'

export default async function getImages() {
    function getNumberFromFilename(filename: string) {
        const matches = filename.match(/(\d+)/);
        return matches ? parseInt(matches[0], 10) : 0;
    }
    const imageDirectory = path.join(process.cwd(), '/public/images');
    const imageFilenames = await fs.readdir(imageDirectory);

    // Filter image filenames to include only JPG files
    const jpgFilenames = imageFilenames.filter((filename) =>
        filename.toLowerCase().endsWith('.jpg')
    );
    const sortedFilenames = jpgFilenames.sort((a, b) => {
        const aNumber = getNumberFromFilename(a);
        const bNumber = getNumberFromFilename(b);
        return aNumber - bNumber;
    });

    const imagePromises = sortedFilenames.map(async (image) => {
        const imagePath = path.join(imageDirectory, image);
        const dimensions = sizeOf(imagePath);

        if (dimensions && dimensions.width && dimensions.height) {
            return {
                src: "/images/" + image,
                original: "/images/" + image,
                width: dimensions.width || 600,
                height: dimensions.height || 400,
            };
        }
        return null;

    });

    const images: CustomImage[] = (await Promise.all(imagePromises)).filter(
        (image): image is CustomImage => image !== null
    );

    return images
}