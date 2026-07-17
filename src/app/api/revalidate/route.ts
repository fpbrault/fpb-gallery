import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { z } from "zod";

import { tagsForDocumentType } from "@/lib/revalidation";

const payloadSchema = z.object({
  _id: z.string().min(1).max(200),
  _type: z.enum(["album", "category", "page", "pageList", "post", "siteSettings", "all"])
});

const MAX_BODY_BYTES = 16_384;

export async function POST(request: Request) {
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (!webhookSecret)
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const authorized = signature ? await isValidSignature(body, signature, webhookSecret) : false;

  if (!authorized) return Response.json({ error: "Invalid signature" }, { status: 401 });

  let payload: z.infer<typeof payloadSchema>;
  try {
    payload = payloadSchema.parse(JSON.parse(body));
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const tags = tagsForDocumentType(payload._type);
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  console.info(JSON.stringify({ event: "sanity_revalidated", documentId: payload._id, tags }));
  return Response.json({ revalidated: true, tags });
}

export function GET() {
  return Response.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
