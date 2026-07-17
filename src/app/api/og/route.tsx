import { ImageResponse } from "next/og";
import { z } from "zod";

import { getSanityClient } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { OG_ALBUM_IMAGE_QUERY, OG_POST_IMAGE_QUERY } from "@/sanity/queries";
import type { Image } from "sanity";

export const runtime = "nodejs";

const querySchema = z.object({
  albumId: z.string().max(120).optional(),
  slug: z.string().max(120).optional(),
  title: z.string().max(120).default("Felix Perron-Brault Photographe")
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return new Response("Invalid query", { status: 400 });

  const { albumId, slug, title } = parsed.data;
  let image: { asset?: { _ref: string; _type: "reference" } } | null = null;
  try {
    if (slug) image = await getSanityClient().fetch(OG_POST_IMAGE_QUERY, { slug });
    if (!image && albumId)
      image = await getSanityClient().fetch(OG_ALBUM_IMAGE_QUERY, { slug: albumId });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "og_query_error",
        message: error instanceof Error ? error.message : String(error)
      })
    );
  }

  const background = image?.asset
    ? urlForImage(image as Image)
        .width(1200)
        .height(630)
        .fit("crop")
        .url()
    : null;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#101010",
        backgroundImage: background
          ? `linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.28)), url(${background})`
          : undefined,
        backgroundPosition: "center",
        backgroundSize: "cover",
        color: "white",
        position: "relative"
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 64,
          fontSize: 64,
          textAlign: "center",
          background: "rgba(0,0,0,.55)",
          borderRadius: 18
        }}
      >
        {title}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
    }
  );
}
