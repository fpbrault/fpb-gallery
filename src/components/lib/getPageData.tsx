import { getClient } from "@/sanity/lib/client";

export async function getPageData(
  query: any,
  context: any,
  previewToken: string | undefined,
) {
  const client = getClient(previewToken);

  if (context.params) {
    context.params.locale = context?.locale;

    // Check if context.params.slug is an array and then join it
    if (Array.isArray(context.params.slug)) {
      context.params.slug = context.params.slug.join('/');
    }
  }

  const data = await client.fetch(query, context.params);

  if (!data) {
    throw new Error("Could not get data");
  }
  return { data };
}
