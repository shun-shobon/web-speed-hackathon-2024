import { z } from 'zod';

export const SearchBookRequestQuerySchema = z.object({
  authorId: z.string().optional(),
  authorName: z.string().optional(),
  bookId: z.string().optional(),
  name: z.string().optional(),
});

export type SearchBookRequestQuery = z.infer<typeof SearchBookRequestQuerySchema>;
