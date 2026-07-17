const DEFAULT_API_VERSION = "2026-07-01";

export type SanityEnvironment = {
  apiVersion: string;
  dataset: string;
  projectId: string;
  useCdn: boolean;
};

export function getSanityEnvironment(): SanityEnvironment {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
  }

  return {
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION,
    dataset,
    projectId,
    useCdn: process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false"
  };
}

// Sanity Studio configuration is evaluated during builds. Placeholders keep
// module evaluation safe; server data access still validates through the getter.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing";
export const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false";
