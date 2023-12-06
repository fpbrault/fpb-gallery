import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { makeSafeQueryRunner, q, InferType } from "groqd";
import { cdnClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import { CSSProperties, ReactNode } from "react";

export const config = {
  runtime: "edge"
};

export const siteMetadataQuery = q("*", { isArray: true })
  .filter("_type == 'siteSettings'")
  .slice(0)
  .grab({
    siteTitle: q.string(),
    author: q.string(),
    description: q.string()
  });

export type SiteMetadata = InferType<typeof siteMetadataQuery>;

export default async function handler(request: NextRequest) {
  const fontData = await fetch(new URL("../../assets/Inter-Regular.ttf", import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const albumId = searchParams.get("albumId");
    const pageTitle = searchParams.get("pageTitle");

    const runQuery = makeSafeQueryRunner((query) => cdnClient.fetch(query));
    const siteMetadata = (await runQuery(siteMetadataQuery)) as SiteMetadata;

    let imageUrl;
    let width = 1200;
    let height = 630;

    // ?title=<title>
    const hasTitle = siteMetadata.siteTitle;
    const title = hasTitle ? siteMetadata?.siteTitle?.slice(0, 100) : "My Portfolio";

    // Check if pagePath starts with "blog/"
    if (slug) {
      try {
        // Fetch custom image from Sanity based on your logic
        // Replace 'yourSanityImageQuery' with the actual query to fetch the image from Sanity
        const postImageQuery = groq`*[_type == "post" && (slug.current == "${slug}" || slug_fr.current == "${slug}")][0].coverImage`;
        const sanityImage = await cdnClient.fetch(postImageQuery);
        const assetUrl = urlForImage(sanityImage)
          .width(width / 2)
          .height(height)
          .quality(80)
          .format("jpg")
          .url();
        // Extract the image URL from the Sanity response
        imageUrl = assetUrl;
      } catch (error) {
        console.error(error);
      }
    } else if (albumId) {
      try {
        // Fetch custom image from Sanity based on your logic
        // Replace 'yourSanityImageQuery' with the actual query to fetch the image from Sanity
        const albumImageQuery = groq`*[_type == "album" && slug.current == "${albumId}"]{images[0]}[0].images.asset`;
        const sanityImage = await cdnClient.fetch(albumImageQuery);
        const assetUrl = urlForImage(sanityImage)
          .width(width / 2)
          .height(height)
          .quality(80)
          .format("jpg")
          .url();
        // Extract the image URL from the Sanity response
        imageUrl = assetUrl;
      } catch (error) {
        console.error(error);
      }
    }

    const BackgroundCanvas = ({
      children,
      flexDirection
    }: {
      children?: ReactNode;
      flexDirection: "row" | "column";
    }) => {
      return (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, #e8cbc0, #636fa4)",
            fontFamily: '"Inter"',
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            fontSize: 40,
            flexDirection: flexDirection,
            flexWrap: "nowrap",
            backgroundColor: "black"
          }}
        >
          {children}
        </div>
      );
    };

    if (!imageUrl) {
      return new ImageResponse(
        (
          <BackgroundCanvas flexDirection="column">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="256"
                viewBox="0 -960 960 960"
                width="256"
              >
                <path d="M456-600h320q-27-69-82.5-118.5T566-788L456-600Zm-92 80 160-276q-11-2-22-3t-22-1q-66 0-123 25t-101 67l108 188ZM170-400h218L228-676q-32 41-50 90.5T160-480q0 21 2.5 40.5T170-400Zm224 228 108-188H184q27 69 82.5 118.5T394-172Zm86 12q66 0 123-25t101-67L596-440 436-164q11 2 21.5 3t22.5 1Zm252-124q32-41 50-90.5T800-480q0-21-2.5-40.5T790-560H572l160 276ZM480-480Zm0 400q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 60,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                marginTop: 30,
                padding: "0 120px",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap"
              }}
            >
              {title}
            </div>
          </BackgroundCanvas>
        ),
        {
          width: width,
          height: height,
          fonts: [
            {
              name: "Inter",
              data: fontData,
              style: "normal"
            }
          ]
        }
      );
    }

    return new ImageResponse(
      (
        <BackgroundCanvas flexDirection="row">
          <img
            alt={title}
            width={width / 2}
            height={height}
            src={imageUrl}
            style={{
              width: width / 2
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",

              flexDirection: "column",

              width: width / 2
            }}
          >
            <div
              style={{
                background: "#131313",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: 20,
                display: "flex",
                width: width / 2,
                height: height / 3
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center"
                }}
              >
                <svg
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  height="64"
                  viewBox="0 -960 960 960"
                  width="64"
                >
                  <path d="M456-600h320q-27-69-82.5-118.5T566-788L456-600Zm-92 80 160-276q-11-2-22-3t-22-1q-66 0-123 25t-101 67l108 188ZM170-400h218L228-676q-32 41-50 90.5T160-480q0 21 2.5 40.5T170-400Zm224 228 108-188H184q27 69 82.5 118.5T394-172Zm86 12q66 0 123-25t101-67L596-440 436-164q11 2 21.5 3t22.5 1Zm252-124q32-41 50-90.5T800-480q0-21-2.5-40.5T790-560H572l160 276ZM480-480Zm0 400q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                </svg>
              </div>
              <span
                style={{
                  color: "white"
                }}
              >
                {" "}
                {title}
              </span>
            </div>
            <div
              style={{
                color: "black",
                background: "linear-gradient(to right, #e8cbc0, #636fa4)",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: 60,
                padding: 20,
                height: (height / 3) * 2,
                width: "100%"
              }}
            >
              {pageTitle ?? "Blog"}
            </div>
          </div>
        </BackgroundCanvas>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal"
          }
        ]
      }
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }
}
