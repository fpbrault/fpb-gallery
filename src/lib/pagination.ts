import { z } from "zod";

export const blogCursorQuerySchema = z.object({
  cursor: z.iso.datetime(),
  limit: z.coerce.number().int().min(1).max(12).default(3),
  locale: z.enum(["en", "fr"])
});
