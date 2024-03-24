import fs from 'node:fs/promises';
import path from 'node:path';

import { zValidator } from '@hono/zod-validator';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { Image } from 'image-js';
import { z } from 'zod';

import { encrypt } from '@wsh-2024/image-encrypt/src/encrypt';

import { BOOK_IAMGES_PATH, IMAGES_PATH } from '../../constants/paths';
import { webpConverter } from '../../image-converters/webpConverter';

const cacheMap = new Map<string, Uint8Array>();

const cacheControlMiddleware = createMiddleware(async (c, next) => {
  await next();
  c.res.headers.append('Cache-Control', 'public');
  c.res.headers.append('Cache-Control', 'max-age=1800');
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
      isBooks: z
        .string()
        .optional()
        .transform((v) => v === 'true'),
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
      origBinary = await fs.readFile(
        path.resolve(c.req.valid('query').isBooks ? BOOK_IAMGES_PATH : IMAGES_PATH, `${imgId}.webp`),
      );
    } catch {
      throw new HTTPException(404, { message: 'Not found.' });
    }

    if (c.req.valid('query').width == null && c.req.valid('query').height == null && !c.req.valid('query').isBooks) {
      // 画像変換せずにそのまま返す
      c.header('Content-Type', 'image/webp');
      return c.body(origBinary);
    }

    const image = new Image(await webpConverter.decode(origBinary));

    const reqImageSize = c.req.valid('query');

    const scale = Math.max((reqImageSize.width ?? 0) / image.width, (reqImageSize.height ?? 0) / image.height) || 1;
    const manipulated = image.resize({
      height: Math.ceil(image.height * scale),
      preserveAspectRatio: true,
      width: Math.ceil(image.width * scale),
    });

    if (c.req.valid('query').isBooks) {
      const canvas = createCanvas(manipulated.width, manipulated.height);
      const ctx = canvas.getContext('2d');
      const sourceImage = await loadImage(manipulated.toBuffer({ format: 'png' }));

      encrypt({
        // パワー！！！！！
        exportCanvasContext: ctx as unknown as CanvasRenderingContext2D,
        // @ts-expect-error パワー！！！！！
        sourceImage,
        sourceImageInfo: {
          height: manipulated.height,
          width: manipulated.width,
        },
      });

      const data = canvas.data();

      const resBinary = await webpConverter.encode({
        colorSpace: 'srgb',
        data: new Uint8ClampedArray(data),
        height: manipulated.height,
        width: manipulated.width,
      });
      cacheMap.set(cacheKey, resBinary);

      c.header('Content-Type', 'image/webp');
      return c.body(resBinary);
    }

    const resBinary = await webpConverter.encode({
      colorSpace: 'srgb',
      data: new Uint8ClampedArray(manipulated.data),
      height: manipulated.height,
      width: manipulated.width,
    });
    cacheMap.set(cacheKey, resBinary);

    c.header('Content-Type', 'image/webp');
    return c.body(resBinary);
  },
);

export { app as imageApp };
