import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { SearchBookRequestQuerySchema } from '@wsh-2024/schema/src/api/books/SearchBookRequestQuery';
import { SearchBookResponseSchema } from '@wsh-2024/schema/src/api/books/SearchBookSearchResponse';

import { bookRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/search',
  request: {
    query: SearchBookRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SearchBookResponseSchema,
        },
      },
      description: 'Search book.',
    },
  },
  tags: ['[App] Books API'],
});

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const res = await bookRepository.search({ query });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as searchBookApp };
