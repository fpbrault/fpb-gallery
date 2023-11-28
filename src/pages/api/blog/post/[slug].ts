import { getPostBySlug } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";


export default async function getPost(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;

    

    if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
    }

    const post = await getPostBySlug(slug.toString());

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
}