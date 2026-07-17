import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const browserClient = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: "published",
  useCdn: true
});
