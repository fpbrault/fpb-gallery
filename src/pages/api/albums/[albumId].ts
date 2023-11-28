import { getAlbum } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getAlbumById(req: NextApiRequest, res: NextApiResponse) {
    const { albumId } = req.query;



    if (!albumId) {
        return res.status(400).json({ error: 'Missing albumId parameter' });
    }

    const album = await getAlbum(albumId);

    if (!album) {
        return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);
}