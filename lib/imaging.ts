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

/** Draw any image source onto a freshly-sized canvas (1:1, no scaling).
 *  Pass `background` (e.g. "#ffffff") when the output will be JPEG-encoded —
 *  without it, transparent pixels become black. Leave undefined for PNG/signatures
 *  that need the alpha channel preserved. */
export function imageToCanvas(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  width: number,
  height: number,
  background?: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

/** Flatten a canvas onto white before JPEG encoding — prevents transparent pixels becoming black. */
export function flattenForJpeg(source: HTMLCanvasElement): HTMLCanvasElement {
  return imageToCanvas(source, source.width, source.height, "#ffffff");
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
 * Centre-crop an image to the requested aspect ratio, then resize it to the
 * exact output dimensions. Portal fields such as 130x170 are output sizes, not
 * lower bounds: keeping a larger square image would still fail their validator.
 */
export async function cropAndResizeToExact(
  source: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
  background = "#ffffff"
): Promise<HTMLCanvasElement> {
  const targetWidth = Math.max(1, Math.round(width));
  const targetHeight = Math.max(1, Math.round(height));
  const sourceWidth =
    source instanceof HTMLCanvasElement ? source.width : source.naturalWidth;
  const sourceHeight =
    source instanceof HTMLCanvasElement ? source.height : source.naturalHeight;
  const targetAspect = targetWidth / targetHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;
  if (sourceAspect > targetAspect) {
    sw = Math.max(1, Math.round(sourceHeight * targetAspect));
    sx = Math.max(0, Math.round((sourceWidth - sw) / 2));
  } else if (sourceAspect < targetAspect) {
    sh = Math.max(1, Math.round(sourceWidth / targetAspect));
    sy = Math.max(0, Math.round((sourceHeight - sh) / 2));
  }

  const cropped = document.createElement("canvas");
  cropped.width = sw;
  cropped.height = sh;
  const ctx = cropped.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, sw, sh);
  }
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);

  return picaResizeTo(cropped, targetWidth, targetHeight);
}

/**
 * Fit a signature inside an exact portal-sized frame without stretching the
 * handwriting. Empty space is centred and filled with the requested background.
 */
export async function fitToExactFrame(
  source: HTMLCanvasElement,
  width: number,
  height: number,
  background?: string
): Promise<HTMLCanvasElement> {
  const targetWidth = Math.max(1, Math.round(width));
  const targetHeight = Math.max(1, Math.round(height));
  const padding = Math.max(2, Math.round(Math.min(targetWidth, targetHeight) * 0.04));
  const availableWidth = Math.max(1, targetWidth - padding * 2);
  const availableHeight = Math.max(1, targetHeight - padding * 2);
  const scale = Math.min(
    availableWidth / Math.max(1, source.width),
    availableHeight / Math.max(1, source.height)
  );
  const fittedWidth = Math.max(1, Math.round(source.width * scale));
  const fittedHeight = Math.max(1, Math.round(source.height * scale));
  const fitted = await picaResizeTo(source, fittedWidth, fittedHeight);

  const framed = document.createElement("canvas");
  framed.width = targetWidth;
  framed.height = targetHeight;
  const ctx = framed.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  ctx.drawImage(
    fitted,
    Math.round((targetWidth - fittedWidth) / 2),
    Math.round((targetHeight - fittedHeight) / 2)
  );
  return framed;
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
  // Fix 1: clamp minScale to prevent an infinite loop when caller passes 0 or negative.
  minScale = Math.max(0.01, minScale);
  const maxBytes = maxKb * 1024;
  let scale = 1;
  let smallest: { canvas: HTMLCanvasElement; blob: Blob; bytes: number; scale: number } | null = null;

  while (scale >= minScale) {
    // Yield so the spinner can paint between expensive PNG encodes.
    await new Promise<void>((r) => setTimeout(r, 0));
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

  // Fix 2: always test the exact minScale floor (the loop exits before reaching it).
  {
    const w = Math.max(1, Math.round(source.width * minScale));
    const h = Math.max(1, Math.round(source.height * minScale));
    const c = imageToCanvas(source, w, h);
    const blob = await canvasToBlob(c, "image/png");
    if (!smallest || blob.size < smallest.bytes)
      smallest = { canvas: c, blob, bytes: blob.size, scale: minScale };
    if (blob.size <= maxBytes)
      return { canvas: c, blob, bytes: blob.size, scale: minScale, underCap: true };
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
