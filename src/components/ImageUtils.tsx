import { S3 } from "@aws-sdk/client-s3";

import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Configure AWS SDK with the environment variables

const s3 = new S3({
    region: process.env.AWS_REGION, credentials: {
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
                    return {
                        src: `https://${bucketName}.s3.amazonaws.com/${key}`,
                        original: `https://${bucketName}.s3.amazonaws.com/${key}`,
                        width: dimensions.width || 600,
                        height: dimensions.height || 400,
                    };
                }
            }
            return null
        });
        let images = (await Promise.all(imagePromises)).filter(
            (image) => image !== null
        );

        images = images.filter(Boolean); // Remove any null or undefined values

        // Shuffle the array of images randomly

        return images;
    }
    else { return null }

}
