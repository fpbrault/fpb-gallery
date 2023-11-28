import { getAlbum, getFeaturedImagesAlbum } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getAlbumById(req: NextApiRequest, res: NextApiResponse) {



    const album = await getFeaturedImagesAlbum();

    if (!album) {
        return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);
}