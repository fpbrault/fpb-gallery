import { QueryParams } from '@sanity/client';
// ./nextjs-pages/src/pages/api/preview.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
    const {slug} = req.query;
    res.setDraftMode({ enable: true })
    res.writeHead(307, { Location: slug ? `/blog/${slug}` :'/' })
    res.end()
}