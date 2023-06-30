import { S3 } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { imageData } from '../app/image-data.js';

export const runtime = 'nodejs';

export default async function getImages(source = 'local') {
    function extractDimensionsFromFilename(filename: string) {
        const matches = filename.match(/(\d+)x(\d+)/);
        if (matches && matches.length === 3) {
            const width = parseInt(matches[1], 10);
            const height = parseInt(matches[2], 10);
            return { width, height };
        }
        return null;
    }

    if (source === 's3') {
        const s3 = new S3({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "fallback",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "fallback",
            }
        });

        const bucketName = process.env.AWS_BUCKET_NAME || "fpb-gallery";
        const imageFolder = 'images';

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

                        const imageMetadata = metadata.find((item) => {
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
        }
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
