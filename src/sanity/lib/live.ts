import "server-only";

import { defineLive } from "next-sanity/live";

import { getSanityEnvironment } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN;

const live = defineLive({
  client: getSanityClient(),
  serverToken: token
});

export const SanityLive = live.SanityLive;

export async function sanityFetch(
  ...args: Parameters<typeof live.sanityFetch>
): ReturnType<typeof live.sanityFetch> {
  getSanityEnvironment();
  return live.sanityFetch(...args);
}
