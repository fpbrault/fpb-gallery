import { getPostsAfter } from "@/sanity/repositories/blogRepository";
import { blogCursorQuerySchema } from "@/lib/pagination";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = blogCursorQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return Response.json({ error: "Invalid query" }, { status: 400 });

  const items = await getPostsAfter(parsed.data.locale, parsed.data.cursor, parsed.data.limit);
  return Response.json(
    { items, nextCursor: items.at(-1)?.publishDate ?? null },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
