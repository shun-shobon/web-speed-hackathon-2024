import { expandGlob } from "https://deno.land/std@0.220.1/fs/expand_glob.ts";
import { createCanvas, loadImage } from "https://deno.land/x/canvas/mod.ts";

 const MAPPING = [
  25, 3, 2, 26, 5, 30, 28, 12, 24, 17, 22, 31, 13, 15, 6, 29, 14, 1, 16, 10, 8, 18, 11, 9, 21, 0, 27, 20, 7, 23, 19, 4,
];


const COLUMN_SIZE = 4;
const ROW_SIZE = 8;

 async function encrypt({
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

  for (const [fromIdx, toIdx] of MAPPING.entries()) {
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


for await (const entry of expandGlob("./*.png")) {
  console.log(entry.path);

  const canvas = createCanvas(354, 500);
  const ctx = canvas.getContext('2d');

  const sourceImage = await loadImage(entry.path);

  encrypt({
    exportCanvasContext: ctx as unknown as CanvasRenderingContext2D,
    sourceImage,
    sourceImageInfo: {
      height: 500,
      width: 354,
    },
  });

  await Deno.writeFile(entry.path, canvas.toBuffer())
}
