import "server-only";

import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, getSanityEnvironment, projectId, useCdn } from "@/sanity/env";
import { createStegaConfig } from "@/sanity/lib/stegaConfig";

let publishedClient: SanityClient | undefined;

export function getSanityClient(): SanityClient {
  if (!publishedClient) {
    publishedClient = createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn,
      perspective: "published",
      stega: createStegaConfig(false)
    });
  }

  return publishedClient;
}

export function getPreviewClient(): SanityClient {
  getSanityEnvironment();
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_READ_TOKEN");

  return getSanityClient().withConfig({
    token,
    useCdn: false,
    perspective: "drafts",
    stega: createStegaConfig(true)
  });
}
