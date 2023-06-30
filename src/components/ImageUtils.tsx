import { S3 } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { imageData } from '../app/image-data.js';

export const runtime = 'nodejs';

export default async function getImages(source = 'local') {

    if (source === 's3') {
        const res = await fetch('http://localhost:3000/api/data')
        // The return value is *not* serialized
        // You can return Date, Map, Set, etc.

        // Recommendation: handle errors
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json()

    } else if (source === 'local') {
        const imageFolder = 'public/images';

        const filenames = fs.readdirSync(imageFolder);
        const imagePromises = filenames.map(async (filename) => {
            const imagePath = path.join(imageFolder, filename);

            try {
                const dimensions = await sharp(imagePath).metadata();

                if (dimensions && dimensions.width && dimensions.height) {
                    const imageMetadata = imageData.find((item) => {
                        const filenameWithoutExtension = filename.split(".")[0];
                        return item.filename === filenameWithoutExtension;
                    });

                    return {
                        src: `/images/${filename}`,
                        original: `/images/${filename}`,
                        width: dimensions.width || 600,
                        height: dimensions.height || 400,
                        title: imageMetadata?.title || null, // Set title to null if not available
                        description: imageMetadata?.description || null, // Set description to null if not available
                    };
                }
            } catch (error) {
                console.error(`Failed to extract dimensions for image: ${filename}`, error);
            }

            return null;
        });

        let images = (await Promise.all(imagePromises)).filter((image) => image !== null);
        images = images.filter(Boolean); // Remove any null or undefined values

        // Sort the images by filename numerically
        images.sort((a, b) => {
            const numberA = parseInt(a?.src.split("-")[1]?.split(".")[0] || "0", 10);
            const numberB = parseInt(b?.src.split("-")[1]?.split(".")[0] || "0", 10);
            return numberA - numberB;
        });

        return images;
    }

    return null;
}
