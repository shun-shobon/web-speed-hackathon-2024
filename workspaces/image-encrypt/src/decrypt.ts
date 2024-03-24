import { MAPPING } from './mapping';

const COLUMN_SIZE = 4;
const ROW_SIZE = 8;

export async function decrypt({
  exportCanvasContext,
  sourceImage,
  sourceImageInfo,
}: {
  exportCanvasContext: CanvasRenderingContext2D;
  sourceImage: CanvasImageSource;
  sourceImageInfo: { height: number; width: number };
}): Promise<void> {
  const columnOffsetPixel = Math.floor((sourceImageInfo.width % COLUMN_SIZE) / 2);
  const columnPixel = Math.floor(sourceImageInfo.width / COLUMN_SIZE);

  const rowOffsetPixel = Math.floor((sourceImageInfo.width % COLUMN_SIZE) / 2);
  const rowPixel = Math.floor(sourceImageInfo.height / ROW_SIZE);

  exportCanvasContext.drawImage(sourceImage, 0, 0);

  for (const [toIdx, fromIdx] of MAPPING.entries()) {
    const from = {
      column: fromIdx % COLUMN_SIZE,
      row: Math.floor(fromIdx / COLUMN_SIZE),
    };
    const to = {
      column: toIdx % COLUMN_SIZE,
      row: Math.floor(toIdx / COLUMN_SIZE),
    };

    const srcX = columnOffsetPixel + from.column * columnPixel;
    const srcY = rowOffsetPixel + from.row * rowPixel;
    const destX = columnOffsetPixel + to.column * columnPixel;
    const destY = rowOffsetPixel + to.row * rowPixel;
    exportCanvasContext.drawImage(sourceImage, srcX, srcY, columnPixel, rowPixel, destX, destY, columnPixel, rowPixel);
  }
}
