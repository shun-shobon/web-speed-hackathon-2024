import { fileTypeFromStream } from 'file-type';

const SUPPORTED_MIME_TYPE_LIST = ['image/bmp', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jxl'];

export async function isSupportedImage(image: File): Promise<boolean> {
  const fileType = await fileTypeFromStream(image.stream());
  if (SUPPORTED_MIME_TYPE_LIST.includes(fileType?.mime ?? '')) {
    return true;
  }

  return false;
}
