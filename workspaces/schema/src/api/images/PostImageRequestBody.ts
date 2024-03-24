import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { image } from '../../models';

export const PostImageRequestBodySchema = createInsertSchema(image)
  .pick({
    alt: true,
  })
  .extend({
    content: z
      .custom<File>((data) => data instanceof File)
      .openapi({
        format: 'binary',
        type: 'string',
      }),
    isBooks: z.string().optional(),
  });

export type PostImageRequestBody = z.infer<typeof PostImageRequestBodySchema>;
