import fs from 'node:fs/promises';
import path from 'node:path';

import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PostImageRequestBodySchema } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import { PostImageResponseSchema } from '@wsh-2024/schema/src/api/images/PostImageResponse';

import { BOOK_IAMGES_PATH } from '../../../constants/paths';
import type { ConverterInterface } from '../../../image-converters/ConverterInterface';
import { avifConverter } from '../../../image-converters/avifConverter';
import { jpegConverter } from '../../../image-converters/jpegConverter';
import { jpegXlConverter } from '../../../image-converters/jpegXlConverter';
import { pngConverter } from '../../../image-converters/pngConverter';
import { webpConverter } from '../../../image-converters/webpConverter';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { imageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/images',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: PostImageRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostImageResponseSchema,
        },
      },
      description: 'Create image.',
    },
  },
  tags: ['[Admin] Images API'],
});

const SUPPORTED_IMAGE_EXTENSIONS = ['jxl', 'avif', 'webp', 'png', 'jpeg', 'jpg'] as const;

type SupportedImageExtension = (typeof SUPPORTED_IMAGE_EXTENSIONS)[number];

function isSupportedImageFormat(ext: unknown): ext is SupportedImageExtension {
  return (SUPPORTED_IMAGE_EXTENSIONS as readonly unknown[]).includes(ext);
}

const IMAGE_MIME_TYPE: Record<string, SupportedImageExtension> = {
  ['image/avif']: 'avif',
  ['image/jpeg']: 'jpeg',
  ['image/jpg']: 'jpeg',
  ['image/jxl']: 'jxl',
  ['image/png']: 'png',
  ['image/webp']: 'webp',
};

const IMAGE_CONVERTER: Record<SupportedImageExtension, ConverterInterface> = {
  ['avif']: avifConverter,
  ['jpeg']: jpegConverter,
  ['jpg']: jpegConverter,
  ['jxl']: jpegXlConverter,
  ['png']: pngConverter,
  ['webp']: webpConverter,
};

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const formData = c.req.valid('form');

  const result = await imageRepository.create({
    body: {
      alt: formData.alt,
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  const origBinary = await formData.content.arrayBuffer();
  const ext = IMAGE_MIME_TYPE[formData.content.type];
  if (!isSupportedImageFormat(ext)) {
    throw new Error('Unsupported image format.');
  }

  const image = await IMAGE_CONVERTER[ext].decode(new Uint8Array(origBinary));
  const webp = await webpConverter.encode(image);

  await fs.mkdir(BOOK_IAMGES_PATH, {
    recursive: true,
  });
  await fs.writeFile(path.resolve(BOOK_IAMGES_PATH, `./${result.value.id}.webp`), webp);

  return c.json(result.value);
});

export { app as postImageApp };
