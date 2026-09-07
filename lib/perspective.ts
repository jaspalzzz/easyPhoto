/**
 * Four-point perspective correction — the "flatten a photographed page" step.
 * ---------------------------------------------------------------------------
 * A document shot with a phone is a quadrilateral, not a rectangle: the far
 * edge is shorter than the near one. Cropping cannot fix that; only a
 * projective transform can. This module solves the homography that maps a
 * chosen quad back onto a flat rectangle, then resamples the pixels through it.
 *
 * The maths (`solveHomography`, `projectPoint`, `estimateOutputSize`,
 * `isConvexQuad`) is deliberately pure and DOM-free so it can be unit-tested
 * in node. Only `warpQuadToCanvas` touches the browser.
 *
 * Corner order is always clockwise from the top-left of the *document*, as the
 * user sees it: [topLeft, topRight, bottomRight, bottomLeft].
 */

export interface Point {
  x: number;
  y: number;
}

/** Document corners, clockwise from top-left. */
export type Quad = readonly [Point, Point, Point, Point];

/**
 * Row-major 3x3 projective transform. The final element is fixed at 1, so the
 * eight free parameters are h[0]..h[7].
 */
export type Homography = readonly number[];

/** Below this, a pivot is treated as zero and the quad as degenerate. */
const SINGULAR_EPSILON = 1e-10;

/** Guards against a multi-gigabyte allocation from a silly output size. */
const MAX_OUTPUT_PIXELS = 40_000_000;

/**
 * Solve the 8x8 system for the projective transform taking each `from` corner
 * to the matching `to` corner.
 *
 * Note the direction carefully: for resampling we want destination -> source,
 * so that every output pixel can ask which input pixel it came from. Passing
 * the quads the other way round produces a forward map with holes in it.
 *
 * @throws if the correspondence is degenerate (collinear or coincident corners).
 */
export function solveHomography(from: Quad, to: Quad): Homography {
  // Each correspondence contributes two rows:
  //   x*h0 + y*h1 + h2                   - x*u*h6 - y*u*h7 = u
  //                    x*h3 + y*h4 + h5  - x*v*h6 - y*v*h7 = v
  const m: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    m.push([x, y, 1, 0, 0, 0, -x * u, -y * u, u]);
    m.push([0, 0, 0, x, y, 1, -x * v, -y * v, v]);
  }

  // Gaussian elimination with partial pivoting.
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let row = col + 1; row < 8; row++) {
      if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row;
    }
    if (Math.abs(m[pivot][col]) < SINGULAR_EPSILON) {
      throw new Error(
        "Cannot solve perspective transform: the four corners are collinear or coincident."
      );
    }
    if (pivot !== col) [m[col], m[pivot]] = [m[pivot], m[col]];

    const lead = m[col][col];
    for (let c = col; c <= 8; c++) m[col][c] /= lead;

    for (let row = 0; row < 8; row++) {
      if (row === col) continue;
      const factor = m[row][col];
      if (factor === 0) continue;
      for (let c = col; c <= 8; c++) m[row][c] -= factor * m[col][c];
    }
  }

  const h = m.map((row) => row[8]);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/** Push a point through a homography. */
export function projectPoint(h: Homography, p: Point): Point {
  const denominator = h[6] * p.x + h[7] * p.y + 1;
  if (Math.abs(denominator) < SINGULAR_EPSILON) {
    throw new Error("Point projects to infinity under this transform.");
  }
  return {
    x: (h[0] * p.x + h[1] * p.y + h[2]) / denominator,
    y: (h[3] * p.x + h[4] * p.y + h[5]) / denominator,
  };
}

/**
 * True when the corners form a non-self-intersecting quad wound consistently.
 * A dragged handle can cross its neighbour and produce a bow-tie, which warps
 * to visual nonsense — the UI should refuse to proceed rather than render it.
 */
export function isConvexQuad(quad: Quad): boolean {
  let negative = false;
  let positive = false;
  for (let i = 0; i < 4; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % 4];
    const c = quad[(i + 2) % 4];
    const cross =
      (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross < 0) negative = true;
    if (cross > 0) positive = true;
    if (negative && positive) return false;
  }
  // All-zero crosses means every corner is collinear, which is not a quad.
  return negative || positive;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Pick output dimensions that preserve the document's real proportions.
 *
 * Opposite edges of the quad disagree (that is the whole point of perspective),
 * so we take the longer of each pair: downsampling later costs less quality
 * than inventing detail that was never captured.
 */
export function estimateOutputSize(
  quad: Quad,
  maxDimension?: number
): { width: number; height: number } {
  const [tl, tr, br, bl] = quad;
  let width = Math.max(distance(tl, tr), distance(bl, br));
  let height = Math.max(distance(tl, bl), distance(tr, br));

  if (maxDimension && maxDimension > 0) {
    const scale = maxDimension / Math.max(width, height);
    if (scale < 1) {
      width *= scale;
      height *= scale;
    }
  }

  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

export interface WarpOptions {
  /** Output size. Defaults to `estimateOutputSize(quad, maxDimension)`. */
  width?: number;
  height?: number;
  /**
   * Cap on the longest output edge. Phone cameras produce quads big enough to
   * exhaust memory on mobile Safari, so callers should pass a sane ceiling.
   */
  maxDimension?: number;
}

/**
 * Resample the region bounded by `quad` into a flat, upright canvas.
 *
 * Sampling is bilinear and runs destination-first, so every output pixel is
 * written exactly once and no seams or holes appear.
 *
 * Browser-only: needs a 2D canvas context.
 */
export function warpQuadToCanvas(
  source: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
  quad: Quad,
  options: WarpOptions = {}
): HTMLCanvasElement {
  if (!isConvexQuad(quad)) {
    throw new Error(
      "The selected corners cross over each other. Drag them back into a four-sided shape."
    );
  }

  const estimated = estimateOutputSize(quad, options.maxDimension);
  const outWidth = Math.max(1, Math.round(options.width ?? estimated.width));
  const outHeight = Math.max(1, Math.round(options.height ?? estimated.height));

  if (outWidth * outHeight > MAX_OUTPUT_PIXELS) {
    throw new Error(
      `Requested output of ${outWidth}x${outHeight} is too large to process. Lower maxDimension.`
    );
  }

  const sourceCanvas = toCanvas(source);
  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) throw new Error("Could not acquire 2D canvas context.");
  const src = sourceCtx.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height
  );

  // Destination rectangle -> the user's quad, so each output pixel can look up
  // where it came from in the photograph.
  const destination: Quad = [
    { x: 0, y: 0 },
    { x: outWidth, y: 0 },
    { x: outWidth, y: outHeight },
    { x: 0, y: outHeight },
  ];
  const h = solveHomography(destination, quad);

  const out = document.createElement("canvas");
  out.width = outWidth;
  out.height = outHeight;
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("Could not acquire 2D canvas context.");
  const dst = outCtx.createImageData(outWidth, outHeight);

  const { data: sd, width: sw, height: sh } = src;
  const dd = dst.data;

  for (let y = 0; y < outHeight; y++) {
    for (let x = 0; x < outWidth; x++) {
      // Sample at pixel centres, or the output shifts by half a pixel.
      const px = x + 0.5;
      const py = y + 0.5;
      const denominator = h[6] * px + h[7] * py + 1;
      const sx = (h[0] * px + h[1] * py + h[2]) / denominator - 0.5;
      const sy = (h[3] * px + h[4] * py + h[5]) / denominator - 0.5;

      const di = (y * outWidth + x) * 4;
      sampleBilinear(sd, sw, sh, sx, sy, dd, di);
    }
  }

  outCtx.putImageData(dst, 0, 0);
  return out;
}

function toCanvas(
  source: HTMLCanvasElement | HTMLImageElement | ImageBitmap
): HTMLCanvasElement {
  if (typeof HTMLCanvasElement !== "undefined" && source instanceof HTMLCanvasElement) {
    return source;
  }
  const width =
    "naturalWidth" in source ? source.naturalWidth : source.width;
  const height =
    "naturalHeight" in source ? source.naturalHeight : source.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(source, 0, 0);
  return canvas;
}

/**
 * Bilinear sample with edge clamping, written straight into the output buffer.
 * Clamping rather than zero-filling keeps the border clean when a corner sits
 * a fraction of a pixel outside the photograph.
 */
function sampleBilinear(
  src: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  out: Uint8ClampedArray,
  outIndex: number
): void {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;

  const x0c = clamp(x0, 0, width - 1);
  const x1c = clamp(x0 + 1, 0, width - 1);
  const y0c = clamp(y0, 0, height - 1);
  const y1c = clamp(y0 + 1, 0, height - 1);

  const i00 = (y0c * width + x0c) * 4;
  const i10 = (y0c * width + x1c) * 4;
  const i01 = (y1c * width + x0c) * 4;
  const i11 = (y1c * width + x1c) * 4;

  const w00 = (1 - fx) * (1 - fy);
  const w10 = fx * (1 - fy);
  const w01 = (1 - fx) * fy;
  const w11 = fx * fy;

  for (let c = 0; c < 4; c++) {
    out[outIndex + c] =
      src[i00 + c] * w00 +
      src[i10 + c] * w10 +
      src[i01 + c] * w01 +
      src[i11 + c] * w11;
  }
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
