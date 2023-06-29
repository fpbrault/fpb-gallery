import { S3 } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import fs from 'fs';
import { imageData } from '../app/image-data.js';

dotenv.config(); // Load environment variables from .env file

// Configure AWS SDK with the environment variables
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fallback",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "fallback",
    }
});

export const runtime = 'nodejs';

export default async function getImages() {
    function extractDimensionsFromFilename(filename: string) {
        const matches = filename.match(/(\d+)x(\d+)/);
        if (matches && matches.length === 3) {
            const width = parseInt(matches[1], 10);
            const height = parseInt(matches[2], 10);
            return { width, height };
        }
        return null;
    }

    const bucketName = process.env.AWS_BUCKET_NAME || "fpb-gallery";
    const imageFolder = 'images';
    const metadataFilePath = 'image-data.json';

    const params = {
        Bucket: bucketName,
        Prefix: imageFolder,
    };

    const data = await s3.listObjectsV2(params);
    if (data.Contents) {
        const imageKeys = data.Contents.map((object) => object.Key);

        const imagePromises = imageKeys.map(async (key) => {
            if (key) {
                const dimensions = extractDimensionsFromFilename(key);

                if (dimensions && dimensions.width && dimensions.height) {
                    // Read the image metadata from image-data.json
                    const metadata = imageData;

                    const imageMetadata = metadata.find((item: any) => {
                        const filenameWithoutPrefixAndSize = key.split("images/")[1].split("_")[0].replace(/\.[^/.]+$/, "");
                        return item.filename === filenameWithoutPrefixAndSize;
                    });

                    return {
                        src: `https://${bucketName}.s3.amazonaws.com/${key}`,
                        original: `https://${bucketName}.s3.amazonaws.com/${key}`,
                        width: dimensions.width || 600,
                        height: dimensions.height || 400,
                        title: imageMetadata?.title || null, // Set title to null if not available
                        description: imageMetadata?.description || null, // Set description to null if not available
                    };
                }
            }
            return null;
        });

        let images = (await Promise.all(imagePromises)).filter((image) => image !== null);
        images = images.filter(Boolean); // Remove any null or undefined values

        // Sort the images by filename numerically
        images.sort((a, b) => {
            const filenameA = a?.src.split("/").pop() || "";
            const filenameB = b?.src.split("/").pop() || "";
            const numberA = parseInt(filenameA.match(/\d+/)?.[0] || "0", 10);
            const numberB = parseInt(filenameB.match(/\d+/)?.[0] || "0", 10);
            return numberA - numberB;
        });

        return images;
    } else {
        return null;
    }
}
