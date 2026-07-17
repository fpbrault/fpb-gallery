import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { getPreviewClient } from "@/sanity/lib/client";
import { isAllowedPreviewPath } from "@/lib/preview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    if (!isAllowedPreviewPath(url.searchParams.get("sanity-preview-pathname"))) {
      return Response.json({ error: "Invalid preview destination" }, { status: 400 });
    }
    const handler = defineEnableDraftMode({ client: getPreviewClient() });
    return handler.GET(request);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "preview_error",
        message: error instanceof Error ? error.message : String(error)
      })
    );
    return Response.json({ error: "Preview is unavailable" }, { status: 503 });
  }
}
