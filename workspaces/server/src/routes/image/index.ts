import fs from 'node:fs/promises';
import path from 'node:path';

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import sharp from 'sharp';
import { z } from 'zod';

import { IMAGES_PATH } from '../../constants/paths';

const cacheMap = new Map<string, Uint8Array>();

const cacheControlMiddleware = createMiddleware(async (c, next) => {
  await next();
  c.res.headers.append('Cache-Control', 'public');
  c.res.headers.append('Cache-Control', 'max-age=31536000');
  c.res.headers.append('Cache-Control', 'immutable');
});

const app = new Hono();

app.use(cacheControlMiddleware);

app.get(
  '/images/:imageFile',
  zValidator(
    'param',
    z.object({
      imageFile: z.string().regex(/^[a-f0-9-]+(?:\.\w*)?$/),
    }),
  ),
  zValidator(
    'query',
    z.object({
      height: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
    }),
  ),
  async (c) => {
    const imgId = c.req.valid('param').imageFile;

    const cacheKey = `${imgId}-${c.req.valid('query').width}-${c.req.valid('query').height}`;
    if (cacheMap.has(cacheKey)) {
      c.header('Content-Type', 'image/webp');
      return c.body(cacheMap.get(cacheKey)!);
    }

    let origBinary;
    try {
      origBinary = await fs.readFile(path.resolve(IMAGES_PATH, `${imgId}.webp`));
    } catch {
      throw new HTTPException(404, { message: 'Not found.' });
    }

    if (c.req.valid('query').width == null && c.req.valid('query').height == null) {
      // 画像変換せずにそのまま返す
      c.header('Content-Type', 'image/webp');
      return c.body(origBinary);
    }

    const reqImageSize = c.req.valid('query');

    const resized = sharp(origBinary).resize(reqImageSize.width, reqImageSize.height);

    const resBinary = await resized.toBuffer();
    cacheMap.set(cacheKey, resBinary);

    c.header('Content-Type', 'image/webp');
    return c.body(resBinary);
  },
);

export { app as imageApp };
