type Params = {
  format: 'avif' | 'webp' | 'png' | 'jpg';
  height?: number;
  imageId: string;
  isBooks?: boolean;
  width?: number;
};

export function getImageUrl({ format, height, imageId, isBooks, width }: Params): string {
  const url = new URL(`/images/${imageId}`, location.href);

  url.searchParams.set('format', format);
  if (width != null) {
    url.searchParams.set('width', `${width}`);
  }
  if (height != null) {
    url.searchParams.set('height', `${height}`);
  }
  if (isBooks != null) {
    url.searchParams.set('isBooks', 'true');
  }

  return url.href;
}
