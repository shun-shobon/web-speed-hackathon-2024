type Params = {
  height?: number;
  imageId: string;
  width?: number;
};

export function getImageUrl({ height, imageId, width }: Params): string {
  const url = new URL(`/images/${imageId}`, location.href);

  if (width != null) {
    url.searchParams.set('width', `${width}`);
  }
  if (height != null) {
    url.searchParams.set('height', `${height}`);
  }

  return url.href;
}
