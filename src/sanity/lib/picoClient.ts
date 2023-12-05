import PicoSanity from 'picosanity'

import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
export function getClient(previewToken?: string): any {
  const client = PicoSanity({
    projectId,
    dataset,
    apiVersion,
    useCdn
  });

  return client;
}

export const picoClient = PicoSanity({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: "published"
});