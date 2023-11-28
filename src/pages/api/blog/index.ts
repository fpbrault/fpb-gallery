import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '@/sanity/lib/client';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {

    const posts = await getAllPosts();
    res.json(posts);

}