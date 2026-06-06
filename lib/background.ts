/**
 * Background compositing.
 * -----------------------
 * GOLDEN RULE (top rejection cause): the background colour is PER-COUNTRY.
 * Never hardcode white. Always pass spec.background.hex.
 *
 * Phase 1: there is no cutout yet, so we render the crop straight to the
 * output canvas. We still expose `fillBackground` + `compositeOver` so that
 * once Phase 2 segmentation lands, the same canvas plumbing replaces the
 * background with the spec colour behind the person cutout.
 */

/** Fill an entire canvas with a solid hex colour (the spec background). */
export function fillBackground(canvas: HTMLCanvasElement, hex: string): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

/**
 * Composite a person cutout (RGBA with transparent background) over a solid
 * spec-colour background, returning a fully-opaque canvas. Phase 2 entry point.
 */
export function compositeOver(
  cutout: HTMLCanvasElement | ImageBitmap,
  width: number,
  height: number,
  hex: string
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(cutout, 0, 0, width, height);
  return out;
}
