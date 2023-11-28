import { NextApiRequest, NextApiResponse } from 'next';
import { getCategories } from '@/sanity/lib/client';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {

    const categories = await getCategories();
    res.json(categories);


}