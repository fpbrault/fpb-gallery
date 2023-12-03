import { getClient } from "@/sanity/lib/client";

export async function getPageData(
  query: any,
  context: any,
  previewToken: string | undefined,
  redirectPath?: string
) {
  const client = getClient(previewToken);

  if (context.params) {
    context.params.locale = context?.locale;
  }

  const data = await client.fetch(query, context.params);

  if (!data) {
    throw new Error("Could not get data");
  }
  return { data };
}
