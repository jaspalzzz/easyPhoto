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
  /** Force ink to a colour preset, or use customInkColor with "custom". */
  inkColor?: SignatureInkColor;
  /** Six-digit hex colour used when inkColor is "custom". */
  customInkColor?: string;
  /** Contrast multiplier for signature strokes (1.0 to 3.0). */
  inkContrast?: number;
  /** Expand the extracted ink outwards by this many pixels (0 to 6). */
  strokeWidth?: number;
}

export type SignatureInkColor =
  | "original"
  | "black"
  | "dark-blue"
  | "blue"
  | "red"
  | "custom";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const INK_PRESET_RGB: Record<Exclude<SignatureInkColor, "original" | "custom">, Rgb> = {
  black: { r: 0, g: 0, b: 0 },
  "dark-blue": { r: 11, g: 42, b: 111 },
  blue: { r: 0, g: 51, b: 203 },
  red: { r: 180, g: 35, b: 24 },
};

function parseHexColour(value: string): Rgb | null {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const number = Number.parseInt(match[1], 16);
  return {
    r: (number >> 16) & 0xff,
    g: (number >> 8) & 0xff,
    b: number & 0xff,
  };
}

/** Resolve a UI colour choice once, before the full pixel pass. */
export function resolveSignatureInkRgb(
  inkColor: SignatureInkColor,
  customInkColor = "#0033cb"
): Rgb | null {
  if (inkColor === "original") return null;
  if (inkColor === "custom") {
    return parseHexColour(customInkColor) ?? INK_PRESET_RGB.blue;
  }
  return INK_PRESET_RGB[inkColor];
}

/** Integer offsets forming a circular brush used to expand extracted strokes. */
export function signatureStrokeOffsets(radius: number): Array<{ x: number; y: number }> {
  const r = Math.min(6, Math.max(0, Math.round(radius)));
  const offsets: Array<{ x: number; y: number }> = [];
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) {
        // Normalise -0 to 0: at radius 0 the loop bounds produce -0, which
        // Object.is (and therefore toEqual) treats as distinct from 0.
        offsets.push({ x: x === 0 ? 0 : x, y: y === 0 ? 0 : y });
      }
    }
  }
  return offsets;
}

/**
 * Expand transparent ink strokes without resizing the canvas. Repeated canvas
 * compositing is handled natively and is substantially faster than a nested
 * per-pixel neighbourhood scan on full-resolution phone photographs.
 */
function expandInkStrokes(source: HTMLCanvasElement, radius: number): HTMLCanvasElement {
  const offsets = signatureStrokeOffsets(radius);
  if (offsets.length <= 1) return source;

  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");

  for (const { x, y } of offsets) ctx.drawImage(source, x, y);
  return out;
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
  const solidInk = resolveSignatureInkRgb(inkColor, opts.customInkColor);

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
    
    if (alpha > 0 && solidInk) {
      d[i] = solidInk.r;
      d[i + 1] = solidInk.g;
      d[i + 2] = solidInk.b;
    }
  }
  octx.putImageData(img, 0, 0);
  return expandInkStrokes(out, opts.strokeWidth ?? 0);
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
  opts: { mode?: "alpha" | "luma"; threshold?: number; minRun?: number } = {}
): BBox | null {
  const mode = opts.mode ?? "alpha";
  const threshold = opts.threshold ?? (mode === "alpha" ? 16 : 200);
  // A row/column counts toward the box only if MORE than `minRun` of its pixels
  // are content. This is what makes the trim robust on real scans: a stray
  // speck, scanner dust, a thin page-edge rim or faint texture leaves a few
  // opaque pixels in the margins that would otherwise pin the box to the image
  // edge — so the crop barely moves (the "no visible difference" bug). Ignoring
  // sparse rows/cols snaps the box to the actual ink. Default 0 = legacy
  // behaviour (any single content pixel counts).
  const minRun = opts.minRun ?? 0;
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    source.width,
    source.height
  );

  // Per-row / per-column content histograms, so the density floor applies
  // independently on each axis (a speck in a margin only adds to its own row
  // and column, both of which then fall below the floor and are skipped).
  const rowHits = new Int32Array(height);
  const colHits = new Int32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const hit =
        mode === "alpha"
          ? data[i + 3] > threshold
          : luma(data[i], data[i + 1], data[i + 2]) < threshold &&
            data[i + 3] > 16;
      if (hit) {
        rowHits[y]++;
        colHits[x]++;
      }
    }
  }

  const firstAbove = (arr: Int32Array) => {
    for (let i = 0; i < arr.length; i++) if (arr[i] > minRun) return i;
    return -1;
  };
  const lastAbove = (arr: Int32Array) => {
    for (let i = arr.length - 1; i >= 0; i--) if (arr[i] > minRun) return i;
    return -1;
  };
  const minY = firstAbove(rowHits);
  const maxY = lastAbove(rowHits);
  const minX = firstAbove(colHits);
  const maxX = lastAbove(colHits);
  if (minX < 0 || minY < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Crop a canvas to its content bounding box, with optional padding (px). */
export function trimToContent(
  source: HTMLCanvasElement,
  opts: {
    mode?: "alpha" | "luma";
    threshold?: number;
    padding?: number;
    minRun?: number;
  } = {}
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

/**
 * Detect the ink bounding box of a signature on a real-world PHOTO (uneven
 * lighting, off-white paper, shadows) — where a fixed luma threshold fails
 * because the paper itself can be darker than the cut-off.
 *
 * Ink is the DARK MINORITY of pixels, so the threshold can't come from Otsu
 * (which splits the dominant mode — on a photo that's paper-light vs
 * paper-shadow, not paper vs ink). Instead:
 *   1. Downsample for speed + noise smoothing.
 *   2. paper level = median luma (robust to the small ink fraction).
 *   3. ink level = darkest luma reached after a small absolute pixel count
 *      (the dark tail). If it isn't meaningfully below paper, there's no real
 *      ink contrast → bail (blank page, or dust only).
 *   4. threshold = halfway between ink and paper; bound the darker class with a
 *      per-row/column density floor so specks/page rims don't pin the box.
 *
 * Returns a bbox in the SOURCE canvas's coordinate space, or null when no
 * reliable signature region is found (caller should let the user drag manually).
 * All constants validated against synthetic shadowed-photo fixtures.
 */
export function detectInkBBox(
  source: HTMLCanvasElement,
  opts: { padding?: number } = {}
): BBox | null {
  const maxEdge = 800;
  const scale = Math.min(1, maxEdge / Math.max(source.width, source.height));
  const sw = Math.max(1, Math.round(source.width * scale));
  const sh = Math.max(1, Math.round(source.height * scale));

  const small = document.createElement("canvas");
  small.width = sw;
  small.height = sh;
  const sctx = small.getContext("2d");
  if (!sctx) return null;
  sctx.drawImage(source, 0, 0, sw, sh);
  const { data } = sctx.getImageData(0, 0, sw, sh);

  // Luma histogram over the downsampled image.
  const hist = new Int32Array(256);
  const total = sw * sh;
  for (let i = 0; i < data.length; i += 4) {
    hist[luma(data[i], data[i + 1], data[i + 2]) | 0]++;
  }

  // paper = median luma (50th percentile).
  const percentile = (frac: number) => {
    const target = frac * total;
    let cum = 0;
    for (let t = 0; t < 256; t++) {
      cum += hist[t];
      if (cum >= target) return t;
    }
    return 255;
  };
  const paper = percentile(0.5);

  // ink = darkest luma reached after a small absolute count of pixels (the dark
  // tail). Min 12 px guards against single stray pixels on tiny images.
  const anchorCount = Math.max(12, Math.round(total * 0.0002));
  let cum = 0;
  let ink = 0;
  for (let t = 0; t < 256; t++) {
    cum += hist[t];
    if (cum >= anchorCount) {
      ink = t;
      break;
    }
  }

  // No meaningful dark/light separation → no signature to find.
  if (paper - ink < 40) return null;

  const thr = ink + (paper - ink) * 0.5;
  // Density floor: a row/col must have > minRun ink pixels to count. Kept low so
  // thin strokes survive (a column crosses only a few px of a stroke); the
  // contrast gate above is what rejects blank/speck images, not this floor.
  const minRun = Math.max(2, Math.round(Math.min(sw, sh) * 0.004));
  const bbox = getContentBBox(small, { mode: "luma", threshold: thr, minRun });
  if (!bbox) return null;

  // A box covering almost the whole frame means detection was unreliable.
  if (bbox.width * bbox.height > total * 0.85) return null;

  // Scale the box back up to the source resolution and apply padding.
  const inv = 1 / scale;
  const pad = opts.padding ?? 0;
  const x = Math.max(0, Math.round(bbox.x * inv) - pad);
  const y = Math.max(0, Math.round(bbox.y * inv) - pad);
  const width = Math.min(source.width - x, Math.round(bbox.width * inv) + pad * 2);
  const height = Math.min(source.height - y, Math.round(bbox.height * inv) + pad * 2);
  return { x, y, width, height };
}
