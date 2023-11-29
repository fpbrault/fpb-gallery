import { QueryParams } from '@sanity/client';
// ./nextjs-pages/src/pages/api/preview.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
    const {slug, albumId, categoryName} = req.query;
    const destination = slug ? `/blog/${slug}` : categoryName ? `/category/${categoryName}` : albumId ? `/album/${albumId}` :'/'
    res.setDraftMode({ enable: true })
    res.writeHead(307, { Location: destination })
    res.end()
}