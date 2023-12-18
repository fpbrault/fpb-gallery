import type { NextApiRequest, NextApiResponse } from "next";

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  const { slug, albumId, categoryName, pageSlug } = req.query;
  let destination;
  switch (true) {
    case Boolean(slug):
      destination = `/blog/${slug}`;
      break;
    case Boolean(pageSlug):
      destination = `/${pageSlug}`;
      break;
    case Boolean(categoryName):
      destination = `/category/${categoryName}`;
      break;
    case Boolean(albumId):
      destination = `/album/${albumId}`;
      break;
    default:
      destination = "/";
  }
  res.setDraftMode({ enable: true });
  res.writeHead(307, { Location: destination });
  res.end();
}
