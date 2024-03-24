import { getImageUrl } from '../../lib/image/getImageUrl';

export const useImage = ({ height, imageId, width }: { height: number; imageId: string; width: number }) => {
  return getImageUrl({
    height,
    imageId,
    width,
  });
};
