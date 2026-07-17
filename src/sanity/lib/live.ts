import "server-only";

import { defineLive } from "next-sanity/live";

import { getSanityEnvironment } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";

const token = process.env.SANITY_API_READ_TOKEN;

const live = defineLive({
  client: getSanityClient(),
  serverToken: token,
  browserToken: false
});

export const SanityLive = live.SanityLive;

export const sanityFetch: typeof live.sanityFetch = (options) => {
  getSanityEnvironment();
  return live.sanityFetch(options);
};
