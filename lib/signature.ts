/**
 * Signature processing — pure canvas pixel ops (no model needed).
 * --------------------------------------------------------------
 * A scanned/photographed signature is dark ink on light paper. A luminance
 * threshold isolates the ink far better than a person-segmentation model, so
 * these tools use simple, fast, deterministic pixel math:
 *   - whiteToTransparent: paper → transparent, ink kept (with soft edges)
 *   - trimToContent: crop to the ink's bounding box
 *   - optional ink darkening for a clean, solid signature
 */

const luma = (r: number, g: number, b: number) =>
  0.299 * r + 0.587 * g + 0.114 * b;

export interface TransparentOptions {
  /** Luminance (0–255) at/above which a pixel is treated as paper. */
  threshold?: number;
  /** Width of the soft edge below the threshold (anti-aliasing). */
  softness?: number;
  /** Force the remaining ink to solid black (deprecated, use inkColor instead). */
  darkenInk?: boolean;
  /** Force ink to a specific color preset: original, black, or blue. */
  inkColor?: "original" | "black" | "blue";
  /** Contrast multiplier for signature strokes (1.0 to 3.0). */
  inkContrast?: number;
}

/**
 * Turn light paper into transparency, keeping the dark ink. Returns a NEW RGBA
 * canvas; the source is untouched.
 */
export function whiteToTransparent(
  source: HTMLCanvasElement,
  opts: TransparentOptions = {}
): HTMLCanvasElement {
  const threshold = opts.threshold ?? 200;
  const softness = Math.max(1, opts.softness ?? 40);
  const contrast = opts.inkContrast ?? 1.0;
  const inkColor = opts.inkColor ?? (opts.darkenInk ? "black" : "original");

  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const sctx = source.getContext("2d");
  const octx = out.getContext("2d");
  if (!sctx || !octx) throw new Error("Could not acquire 2D canvas context.");

  const img = sctx.getImageData(0, 0, source.width, source.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const L = luma(d[i], d[i + 1], d[i + 2]);
    // alpha: 0 at/above threshold (paper) → 255 at threshold-softness (ink)
    let alpha = ((threshold - L) / softness) * 255;
    
    // Boost contrast if specified
    if (contrast > 1.0) {
      alpha = alpha * contrast;
    }
    
    alpha = alpha < 0 ? 0 : alpha > 255 ? 255 : alpha;
    d[i + 3] = Math.round((d[i + 3] / 255) * alpha);
    
    if (alpha > 0) {
      if (inkColor === "black") {
        d[i] = 0;
        d[i + 1] = 0;
        d[i + 2] = 0;
      } else if (inkColor === "blue") {
        d[i] = 0;
        d[i + 1] = 51;  // Compliant dark blue ink
        d[i + 2] = 203;
      }
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Bounding box of the "content". Mode "alpha" counts pixels above an alpha
 * threshold (use after whiteToTransparent); mode "luma" counts pixels DARKER
 * than the threshold (use on an opaque scan). Returns null if nothing found.
 */
export function getContentBBox(
  source: HTMLCanvasElement,
  opts: { mode?: "alpha" | "luma"; threshold?: number } = {}
): BBox | null {
  const mode = opts.mode ?? "alpha";
  const threshold = opts.threshold ?? (mode === "alpha" ? 16 : 200);
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    source.width,
    source.height
  );

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const hit =
        mode === "alpha"
          ? data[i + 3] > threshold
          : luma(data[i], data[i + 1], data[i + 2]) < threshold &&
            data[i + 3] > 16;
      if (hit) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Crop a canvas to its content bounding box, with optional padding (px). */
export function trimToContent(
  source: HTMLCanvasElement,
  opts: { mode?: "alpha" | "luma"; threshold?: number; padding?: number } = {}
): { canvas: HTMLCanvasElement; bbox: BBox | null } {
  const bbox = getContentBBox(source, opts);
  if (!bbox) return { canvas: source, bbox: null };

  const pad = opts.padding ?? 0;
  const x = Math.max(0, bbox.x - pad);
  const y = Math.max(0, bbox.y - pad);
  const w = Math.min(source.width - x, bbox.width + pad * 2);
  const h = Math.min(source.height - y, bbox.height + pad * 2);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(source, x, y, w, h, 0, 0, w, h);
  return { canvas: out, bbox };
}
