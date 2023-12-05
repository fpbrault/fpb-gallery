// pages/api/blog/[page].js

import { getClient } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page, locale, postsPerPage } = req.query;

  if (typeof page !== "string" || typeof locale !== "string" || typeof postsPerPage !== "string") {
    return res.status(400).json({ error: "Invalid parameters" });
  }
  const start = (parseInt(page) - 1) * parseInt(postsPerPage);
  const end = start + parseInt(postsPerPage) - 1;
  const query = groq`*[_type == "post" && defined(slug.current) || defined(slug_fr.current)] {
    ...,
    "slug": select(
      $locale == 'en' => coalesce(slug, slug_fr),
      $locale == 'fr' => coalesce(slug_fr, slug)
    ),
    "title": title[_key == $locale].value,
    "blurDataURL": coverImage.asset->.metadata.lqip,
    "excerpt": array::join(
      string::split(
        (pt::text(
          postContent[_key == $locale].value[]
        )
      ),
      ""
    )[0..255], "") + "..."
  } | order(publishDate desc)[$start..$end]`;

  try {
    const client = getClient();
    const data = await client.fetch(query, { start: start, end: end, locale: locale });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
