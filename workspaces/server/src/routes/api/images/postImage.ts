import path from 'node:path';

import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import sharp from 'sharp';

import { PostImageRequestBodySchema } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import { PostImageResponseSchema } from '@wsh-2024/schema/src/api/images/PostImageResponse';

import { IMAGES_PATH } from '../../../constants/paths';
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

  const imagePath = path.resolve(IMAGES_PATH, `./${result.value.id}.webp`);
  await sharp(origBinary)
    .ensureAlpha()
    .toFormat('webp', {
      quality: 70,
    })
    .toFile(imagePath);

  return c.json(result.value);
});

export { app as postImageApp };
