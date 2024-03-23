import { z } from 'zod';

export const SearchBookRequestQuerySchema = z.object({
  keyword: z.string().optional(),
});

export type SearchBookRequestQuery = z.infer<typeof SearchBookRequestQuerySchema>;
