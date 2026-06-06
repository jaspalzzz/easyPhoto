/**
 * Generic, reusable image-canvas operations for the standalone tools.
 * ------------------------------------------------------------------
 * Browser-only. Pica is dynamically imported (lazy) so it only loads when a
 * tool actually resizes something.
 */

let picaInstance: unknown = null;
async function getPica() {
  if (!picaInstance) {
    const Pica = (await import("pica")).default;
    picaInstance = Pica();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return picaInstance as any;
}

/** Draw any image source onto a freshly-sized canvas (1:1, no scaling). */
export function imageToCanvas(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

/**
 * High-quality resize to exact pixel dimensions using Pica. Accepts an image or
 * canvas; returns a new canvas at the requested size.
 */
export async function picaResizeTo(
  source: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  // Pica wants a canvas source; normalise images first.
  const from =
    source instanceof HTMLCanvasElement
      ? source
      : imageToCanvas(source, source.naturalWidth, source.naturalHeight);

  const dest = document.createElement("canvas");
  dest.width = w;
  dest.height = h;
  const pica = await getPica();
  await pica.resize(from, dest, { alpha: true });
  return dest;
}

/**
 * Compress a TRANSPARENT canvas to a PNG under `maxKb`. PNG has no quality
 * knob, so we shrink dimensions (preserving the alpha channel) until it fits —
 * the right approach for signatures, which must keep a transparent background.
 */
export async function pngUnderKb(
  source: HTMLCanvasElement,
  maxKb: number,
  minScale = 0.2
): Promise<{ canvas: HTMLCanvasElement; blob: Blob; bytes: number; scale: number; underCap: boolean }> {
  const maxBytes = maxKb * 1024;
  let scale = 1;
  let smallest: { canvas: HTMLCanvasElement; blob: Blob; bytes: number; scale: number } | null = null;

  while (scale >= minScale) {
    const w = Math.max(1, Math.round(source.width * scale));
    const h = Math.max(1, Math.round(source.height * scale));
    const c = scale === 1 ? source : imageToCanvas(source, w, h);
    const blob = await canvasToBlob(c, "image/png");
    if (!smallest || blob.size < smallest.bytes)
      smallest = { canvas: c, blob, bytes: blob.size, scale };
    if (blob.size <= maxBytes)
      return { canvas: c, blob, bytes: blob.size, scale, underCap: true };
    scale *= 0.82;
  }
  return { ...smallest!, underCap: false };
}

/** Encode a canvas to a Blob (Promise wrapper around canvas.toBlob). */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png" | "image/webp" = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
      type,
      quality
    );
  });
}
