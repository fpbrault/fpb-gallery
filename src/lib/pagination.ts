import { z } from "zod";

const blogCursorSchema = z.object({
  id: z.string().min(1),
  publishDate: z.iso.datetime()
});

export type BlogCursor = z.infer<typeof blogCursorSchema>;

export function encodeBlogCursor(cursor: BlogCursor): string {
  return Buffer.from(JSON.stringify(blogCursorSchema.parse(cursor))).toString("base64url");
}

export function decodeBlogCursor(value: string): BlogCursor | null {
  try {
    return blogCursorSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
  } catch {
    return null;
  }
}

export const blogCursorQuerySchema = z.object({
  cursor: z.string().transform((value, context) => {
    const cursor = decodeBlogCursor(value);
    if (cursor) return cursor;
    context.addIssue({ code: "custom", message: "Invalid cursor" });
    return z.NEVER;
  }),
  limit: z.coerce.number().int().min(1).max(12).default(3),
  locale: z.enum(["en", "fr"])
});
