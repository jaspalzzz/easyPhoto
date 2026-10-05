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
 * Default paper-removal settings for an uploaded signature photo. Shared by
 * the signature workflow tools and the sign-image pad so a phone photo of a
 * signature cleans identically everywhere: the pad's older 210/35 left shadowed
 * paper (luma ~211) semi-opaque, baking a grey panel into the signed image.
 */
export const SIGNATURE_CLEAN_DEFAULTS = { threshold: 200, softness: 40 } as const;

/**
 * Density floor for trimming a cleaned signature: ignore sparse margin noise
 * (specks, scanner dust, a faint page-edge rim) so the box snaps to the real
 * ink. ~0.5% of the smaller side, min 2 px.
 */
export function signatureTrimMinRun(width: number, height: number): number {
  return Math.max(2, Math.round(Math.min(width, height) * 0.005));
}

/**
 * The minimum KB a signature export must reach. It follows the preset the user
 * has SELECTED, falling back to the page's own band only when none is chosen.
 * Using the page's band alone let the standalone tool's IBPS/RRB presets export
 * 7.8 KB against their 10/30 KB floors, and kept IBPS's floor after switching an
 * IBPS page to the RRB preset.
 */
export function signatureKbFloor(
  selectedPreset: { sigMinKb?: number } | undefined,
  pageMinKb: number | undefined,
): number | undefined {
  return selectedPreset ? selectedPreset.sigMinKb : pageMinKb;
}

/**
 * File format to export a signature in for a portal preset. The preset's
 * published `sigFormat` decides; the description is only a fallback for
 * presets that don't state one. Matching the description alone exported a
 * transparent PNG for the Driving Licence (Sarathi) preset, whose source
 * requires JPG but whose description never says so.
 */
export function signatureExportFormat(
  preset: { sigFormat?: string; description?: string } | undefined,
): "jpeg" | "png" {
  const jpg = /\b(?:JPG|JPEG)\b/i;
  if (preset?.sigFormat) return jpg.test(preset.sigFormat) ? "jpeg" : "png";
  return jpg.test(preset?.description ?? "") ? "jpeg" : "png";
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

/** Options for {@link attachedInkBBox}; see {@link signatureTrimAttach}. */
export interface AttachOptions {
  /** Empty pixels allowed between the signature and a nearby stroke (an i-dot, a pen lift). */
  attachGap: number;
  /** Ink shapes smaller than this many pixels are specks and never extend the box. */
  minSpeckArea: number;
}

/**
 * Trim settings for a cleaned signature: the density floor that finds the
 * signature's dense core, plus how far a stroke may sit from it and how big it
 * must be to count as ink rather than dust. All scale with the image.
 */
export function signatureTrimAttach(width: number, height: number): { minRun: number; keepAttached: AttachOptions } {
  const minRun = signatureTrimMinRun(width, height);
  return {
    minRun,
    keepAttached: { attachGap: minRun * 4, minSpeckArea: Math.max(4, Math.round((minRun * minRun) / 4)) },
  };
}

/**
 * Trim settings for a signature uploaded to sign-image (the full-resolution
 * photo or scan, after whiteToTransparent). Same attached-strokes rule as the
 * signature tools: a lone dust speck or stray mark away from the signature no
 * longer stretches the crop, while thin strokes, i-dots and pen lifts next to
 * it are kept. Without keepAttached the floor would cut thin strokes off.
 * If nothing clears the floor it falls back to every ink pixel, as before.
 */
export function signatureUploadTrim(width: number, height: number) {
  return {
    mode: "alpha" as const,
    padding: 8,
    ...signatureTrimAttach(width, height),
    // Before this trim, sign-image found any visible ink; a faint signature
    // too sparse for the floor must still crop, not fail as "no signature".
    fallbackToAnyInk: true,
  };
}

/**
 * How many signatures are stacked one below another in a cleaned signature
 * image: runs of ink rows separated by at least `minGap` rows without ink.
 * A row counts as ink only above `minInk` pixels, so specks don't add bands,
 * and a band shorter than `minGap` rows (an i-dot, a stray mark) doesn't count.
 * Pure, for testing; see {@link signatureStackParams} for the thresholds.
 */
export function countStackedSignatures(
  rowHits: ArrayLike<number>,
  opts: { minInk: number; minGap: number },
): number {
  // Runs of ink rows; a gap shorter than minGap stays inside the same run.
  const runs: { start: number; end: number }[] = [];
  for (let y = 0; y < rowHits.length; y++) {
    if (rowHits[y] <= opts.minInk) continue;
    const last = runs[runs.length - 1];
    if (last && y - last.end - 1 < opts.minGap) last.end = y;
    else runs.push({ start: y, end: y });
  }
  return runs.filter((r) => r.end - r.start + 1 >= opts.minGap).length;
}

/** Thresholds for {@link countStackedSignatures}, scaled to the image. */
export function signatureStackParams(width: number, height: number): { minInk: number; minGap: number } {
  return { minInk: signatureTrimMinRun(width, height), minGap: Math.max(4, Math.round(height * 0.02)) };
}

/** Per-row count of pixels whose alpha exceeds `threshold` (use after whiteToTransparent). */
export function alphaRowHits(source: HTMLCanvasElement, threshold = 16): Int32Array {
  const ctx = source.getContext("2d");
  const rows = new Int32Array(source.height);
  if (!ctx) return rows;
  const { data, width, height } = ctx.getImageData(0, 0, source.width, source.height);
  for (let y = 0; y < height; y++) {
    let n = 0;
    for (let x = 0, i = y * width * 4 + 3; x < width; x++, i += 4) if (data[i] > threshold) n++;
    rows[y] = n;
  }
  return rows;
}

/** Rows/columns whose hit count exceeds `minRun` bound the box (legacy density-floor rule). */
function bboxFromHits(rowHits: Int32Array, colHits: Int32Array, minRun: number): BBox | null {
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

/** Longest side of the grid the connected-shape pass runs on (bounds memory on 12 MP photos). */
const ATTACH_GRID_MAX = 2000;

/**
 * The signature's bounding box: its dense core (the `minRun` rule, which
 * ignores sparse specks and texture) grown to every ink SHAPE attached to it.
 *
 * The density floor alone cut thin strokes off: on a 12 MP photo it is ~15 px,
 * thicker than a ballpoint line, so rows holding only an ascender or a lead-in
 * stroke looked like noise. Here ink is grouped into 8-connected shapes; any
 * shape of at least `minSpeckArea` pixels that touches the core, or lies within
 * `attachGap` of the growing box, is kept whole. Dust specks (tiny shapes) and
 * marks far from the signature still can't stretch the crop.
 *
 * `ink` is a width×height mask (non-zero = content). Pure, for testing.
 */
export function attachedInkBBox(
  mask: { width: number; height: number; ink: Uint8Array },
  minRun: number,
  opts: AttachOptions,
): BBox | null {
  const { width: w, height: h, ink } = mask;
  const rowHits = new Int32Array(h);
  const colHits = new Int32Array(w);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      if (ink[row + x]) {
        rowHits[y]++;
        colHits[x]++;
      }
    }
  }
  const core = bboxFromHits(rowHits, colHits, minRun);
  if (!core) return null;

  // Pool the mask into f×f cells so the shape pass stays small on huge photos.
  const f = Math.max(1, Math.ceil(Math.max(w, h) / ATTACH_GRID_MAX));
  const gw = Math.ceil(w / f);
  const gh = Math.ceil(h / f);
  const cells = new Uint16Array(gw * gh);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    const crow = Math.floor(y / f) * gw;
    for (let x = 0; x < w; x++) if (ink[row + x]) cells[crow + Math.floor(x / f)]++;
  }

  // 8-connected shapes over occupied cells; keep only those big enough to be ink.
  const shapes: { x0: number; y0: number; x1: number; y1: number }[] = [];
  const seen = new Uint8Array(gw * gh);
  const stack = new Int32Array(gw * gh);
  for (let start = 0; start < cells.length; start++) {
    if (!cells[start] || seen[start]) continue;
    let top = 0;
    stack[top++] = start;
    seen[start] = 1;
    let area = 0;
    let cx0 = gw, cy0 = gh, cx1 = -1, cy1 = -1;
    while (top) {
      const c = stack[--top];
      const cx = c % gw;
      const cy = (c - cx) / gw;
      area += cells[c];
      if (cx < cx0) cx0 = cx;
      if (cx > cx1) cx1 = cx;
      if (cy < cy0) cy0 = cy;
      if (cy > cy1) cy1 = cy;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = cy + dy;
        if (ny < 0 || ny >= gh) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          if (nx < 0 || nx >= gw) continue;
          const n = ny * gw + nx;
          if (cells[n] && !seen[n]) {
            seen[n] = 1;
            stack[top++] = n;
          }
        }
      }
    }
    if (area >= opts.minSpeckArea) {
      shapes.push({
        x0: cx0 * f,
        y0: cy0 * f,
        x1: Math.min(w - 1, (cx1 + 1) * f - 1),
        y1: Math.min(h - 1, (cy1 + 1) * f - 1),
      });
    }
  }

  // Grow from the core: add every shape touching, or within attachGap of, the box so far.
  let x0 = core.x, y0 = core.y;
  let x1 = core.x + core.width - 1, y1 = core.y + core.height - 1;
  const gap = opts.attachGap;
  const taken = new Uint8Array(shapes.length);
  for (let grew = true; grew; ) {
    grew = false;
    shapes.forEach((s, i) => {
      if (taken[i]) return;
      const near = s.x0 <= x1 + gap && s.x1 >= x0 - gap && s.y0 <= y1 + gap && s.y1 >= y0 - gap;
      if (!near) return;
      taken[i] = 1;
      grew = true;
      x0 = Math.min(x0, s.x0);
      y0 = Math.min(y0, s.y0);
      x1 = Math.max(x1, s.x1);
      y1 = Math.max(y1, s.y1);
    });
  }
  return { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/**
 * Bounding box of the "content". Mode "alpha" counts pixels above an alpha
 * threshold (use after whiteToTransparent); mode "luma" counts pixels DARKER
 * than the threshold (use on an opaque scan). Returns null if nothing found.
 */
export function getContentBBox(
  source: HTMLCanvasElement,
  opts: {
    mode?: "alpha" | "luma";
    threshold?: number;
    minRun?: number;
    /** Keep thin strokes attached to the dense core (see attachedInkBBox). */
    keepAttached?: AttachOptions;
    /** With keepAttached: if no row/column clears the floor (a faint or tiny
     *  signature in a large photo), fall back to every content pixel instead
     *  of finding nothing. */
    fallbackToAnyInk?: boolean;
  } = {}
): BBox | null {
  const mode = opts.mode ?? "alpha";
  const threshold = opts.threshold ?? (mode === "alpha" ? 16 : 200);
  // A row/column counts toward the box only if MORE than `minRun` of its pixels
  // are content. This is what makes the trim robust on real scans: a stray
  // speck, scanner dust, a thin page-edge rim or faint texture leaves a few
  // opaque pixels in the margins that would otherwise pin the box to the image
  // edge — so the crop barely moves (the "no visible difference" bug). Ignoring
  // sparse rows/cols snaps the box to the actual ink. Default 0 = legacy
  // behaviour (any single content pixel counts). Pair it with keepAttached, or
  // thin strokes (ascenders, lead-ins) fall below the floor and are cut off.
  const minRun = opts.minRun ?? 0;
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    source.width,
    source.height
  );
  const isContent = (i: number) =>
    mode === "alpha"
      ? data[i + 3] > threshold
      : luma(data[i], data[i + 1], data[i + 2]) < threshold && data[i + 3] > 16;

  if (opts.keepAttached) {
    const ink = new Uint8Array(width * height);
    for (let p = 0; p < ink.length; p++) if (isContent(p * 4)) ink[p] = 1;
    const attached = attachedInkBBox({ width, height, ink }, minRun, opts.keepAttached);
    if (attached || !opts.fallbackToAnyInk) return attached;
    return attachedInkBBox({ width, height, ink }, 0, { attachGap: 0, minSpeckArea: 0 });
  }

  // Per-row / per-column content histograms, so the density floor applies
  // independently on each axis (a speck in a margin only adds to its own row
  // and column, both of which then fall below the floor and are skipped).
  const rowHits = new Int32Array(height);
  const colHits = new Int32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isContent((y * width + x) * 4)) {
        rowHits[y]++;
        colHits[x]++;
      }
    }
  }
  return bboxFromHits(rowHits, colHits, minRun);
}

/** Crop a canvas to its content bounding box, with optional padding (px). */
export function trimToContent(
  source: HTMLCanvasElement,
  opts: {
    mode?: "alpha" | "luma";
    threshold?: number;
    padding?: number;
    minRun?: number;
    keepAttached?: AttachOptions;
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
