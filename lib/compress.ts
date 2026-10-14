/**
 * File-size compressor.
 * ---------------------
 * Lands an exported photo at or UNDER a country's KB cap (upload portals reject
 * oversized files). It first drops JPEG quality, and — when quality alone can't
 * get under the cap — falls back to downscaling the pixel dimensions, but never
 * below the portal's pixel minimum (going smaller would break a different rule).
 *
 * The search algorithm (`searchUnderCap`) is pure and takes an injectable
 * encoder, so it is fully unit-testable without a real canvas / image codec.
 * `compressToCap` is the thin browser wrapper that plugs a canvas encoder in.
 */

import { padBlobToMin } from "@/lib/padBytes";
import { setBlobDensityDpi } from "@/lib/jpegDensity";
import { kbCapBytes, kbFloorBytes } from "@/lib/utils";

// ── Pure, testable search ────────────────────────────────────────────────

/** An encoder's measured output: encoded size in bytes + the opaque payload. */
export interface Measured<T> {
  bytes: number;
  payload: T;
}

/**
 * Produce an encoding at a given dimension `scale` (0..1) and `quality` (0..1).
 * Returns the byte size and an opaque payload (a Blob in the real impl, a stub
 * in tests). Pure with respect to the search — no canvas knowledge needed here.
 */
export type Encoder<T> = (
  scale: number,
  quality: number
) => Promise<Measured<T>>;

export interface SearchOptions {
  maxBytes: number;
  minQuality?: number;
  maxQuality?: number;
  /** Binary-search iterations for quality at a given scale. */
  qualitySteps?: number;
  /** Smallest allowed dimension scale (the pixel-minimum guard). 0 < x ≤ 1. */
  minScale?: number;
  /** Geometric step between successive scales (0 < x < 1). */
  scaleStep?: number;
  /**
   * Opt-in last resort: when nothing fits at `minQuality` even at the smallest
   * allowed scale, retry at that scale with quality down to this floor before
   * giving up. Fixed-pixel portals (Driving Licence 420×525 ≤ 20 KB, CAT)
   * can't shrink, so a photo a few percent over the cap at 0.4 was a dead end.
   */
  lastResortMinQuality?: number;
}

/** Normal JPEG quality floor for the cap search. */
export const DEFAULT_MIN_QUALITY = 0.4;

/**
 * Quality floor for the last-resort pass. Low enough to close the few-percent
 * gap fixed-size portals hit at 0.4; high enough that a face stays reviewable.
 */
export const LAST_RESORT_MIN_QUALITY = 0.2;

export interface SearchResult<T> {
  payload: T;
  quality: number;
  scale: number;
  bytes: number;
  /** True if the result is at or under maxBytes. */
  underCap: boolean;
}

/** Build a descending list of scales from 1 down to (and including) minScale. */
export function buildScales(minScale: number, step: number): number[] {
  const scales: number[] = [];
  let s = 1;
  while (s > minScale) {
    scales.push(+s.toFixed(4));
    s *= step;
  }
  scales.push(+minScale.toFixed(4));
  return scales;
}

/**
 * Find the encoding that fits under `maxBytes`, preferring the LARGEST
 * dimension scale (most resolution) and then the HIGHEST quality at that scale.
 *
 * Guarantees a result under the cap whenever the smallest allowed scale at the
 * lowest quality fits; otherwise returns that smallest encoding with
 * `underCap: false` so the caller can warn the user.
 */
export async function searchUnderCap<T>(
  encode: Encoder<T>,
  opts: SearchOptions
): Promise<SearchResult<T>> {
  const maxBytes = opts.maxBytes;
  const minQ = opts.minQuality ?? DEFAULT_MIN_QUALITY;
  const maxQ = opts.maxQuality ?? 0.95;
  const steps = opts.qualitySteps ?? 7;
  const minScale = Math.min(1, Math.max(0.01, opts.minScale ?? 1));
  const step = Math.min(0.99, Math.max(0.01, opts.scaleStep ?? 0.85));
  const scales = buildScales(minScale, step);

  let smallest: Measured<T> & { quality: number; scale: number } | null = null;

  for (const scale of scales) {
    // Cheapest encoding at this scale; if it still overflows, go smaller.
    const lo = await encode(scale, minQ);
    if (!smallest || lo.bytes < smallest.bytes) {
      smallest = { ...lo, quality: minQ, scale };
    }
    if (lo.bytes > maxBytes) continue;

    // This scale fits at min quality — can we afford top quality?
    const hi = await encode(scale, maxQ);
    if (hi.bytes <= maxBytes) {
      return {
        payload: hi.payload,
        quality: maxQ,
        scale,
        bytes: hi.bytes,
        underCap: true,
      };
    }

    // Binary-search the highest quality that still fits at this scale.
    let bestFit: Measured<T> & { quality: number } = { ...lo, quality: minQ };
    let lq = minQ;
    let hq = maxQ;
    for (let i = 0; i < steps; i++) {
      const mq = (lq + hq) / 2;
      const m = await encode(scale, mq);
      if (m.bytes <= maxBytes) {
        bestFit = { ...m, quality: mq };
        lq = mq;
      } else {
        hq = mq;
      }
    }
    return {
      payload: bestFit.payload,
      quality: bestFit.quality,
      scale,
      bytes: bestFit.bytes,
      underCap: true,
    };
  }

  // Last resort (opt-in): lower the quality floor at the smallest scale.
  const floorQ = opts.lastResortMinQuality;
  if (floorQ != null && floorQ < minQ) {
    const scale = scales[scales.length - 1];
    const lo = await encode(scale, floorQ);
    if (lo.bytes <= maxBytes) {
      let bestFit: Measured<T> & { quality: number } = { ...lo, quality: floorQ };
      let lq = floorQ;
      let hq = minQ;
      for (let i = 0; i < steps; i++) {
        const mq = (lq + hq) / 2;
        const m = await encode(scale, mq);
        if (m.bytes <= maxBytes) {
          bestFit = { ...m, quality: mq };
          lq = mq;
        } else {
          hq = mq;
        }
      }
      return {
        payload: bestFit.payload,
        quality: bestFit.quality,
        scale,
        bytes: bestFit.bytes,
        underCap: true,
      };
    }
  }

  // Nothing fit, even at the smallest allowed scale + lowest quality.
  return {
    payload: smallest!.payload,
    quality: smallest!.quality,
    scale: smallest!.scale,
    bytes: smallest!.bytes,
    underCap: false,
  };
}

// ── Browser canvas wrapper ───────────────────────────────────────────────

export interface CompressResult {
  blob: Blob;
  quality: number;
  scale: number;
  bytes: number;
  width: number;
  height: number;
  underCap: boolean;
  /**
   * True when the cap was only reached by the low-quality fallback (quality
   * below the normal floor). Callers should tell the user to check the result
   * is still clear — a portal can reject a blurry photo.
   */
  qualityReduced: boolean;
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
      type,
      quality
    );
  });
}

/** Downscale a canvas to a fraction of its size (1 = unchanged). */
function scaleCanvas(canvas: HTMLCanvasElement, scale: number): HTMLCanvasElement {
  if (scale >= 1) return canvas;
  const w = Math.max(1, Math.round(canvas.width * scale));
  const h = Math.max(1, Math.round(canvas.height * scale));
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, w, h);
  return out;
}

interface CanvasPayload {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Encode `canvas` to a JPEG at or below `maxKb`, dropping quality first and then
 * dimensions (never below `minDimensions`, the portal's pixel minimum).
 */
export async function compressToCap(
  canvas: HTMLCanvasElement,
  maxKb: number,
  opts: {
    minQuality?: number;
    maxQuality?: number;
    iterations?: number;
    /** Don't downscale below this pixel size (the digital upload minimum). */
    minDimensions?: { width: number; height: number };
    /**
     * Lowest dimension scale to allow (0–1). Defaults to 1 (no downscaling) so
     * size-constrained callers stay safe; a generic resizer can pass e.g. 0.1
     * to let dimensions shrink in order to hit a small KB target.
     */
    minScale?: number;
    /**
     * Portal's MINIMUM file size in KB (e.g. IBPS photo is a 20–50 KB band —
     * below 20 KB is rejected too). When the best result lands under this,
     * the JPEG is padded with inert COM segments up to the floor. Pixels and
     * quality are untouched; every JPEG reader skips the padding.
     */
    minKb?: number;
    /**
     * Declared DPI for the JFIF header (e.g. PAN mandates 200 DPI scans).
     * Pixels are unchanged — this only sets the metadata a strict portal
     * could read. Applied before any min-KB padding.
     */
    densityDpi?: number;
    /**
     * Allow the last-resort quality floor (LAST_RESORT_MIN_QUALITY) when the
     * cap can't be met at the normal floor. Only for fixed-pixel photos (e.g.
     * Driving Licence 420×525 ≤ 20 KB, CAT) that can't shrink to fit; everyone
     * else keeps the normal floor and reports underCap:false, so the tool shows
     * "could not fit" instead of silently returning a blurry file.
     */
    allowLowQualityFallback?: boolean;
  } = {}
): Promise<CompressResult> {
  // Scale floor: the most restrictive of an explicit minScale and the pixel
  // minimum. Default 1 = never downscale unless a caller opts in.
  const floors: number[] = [];
  if (opts.minScale != null) floors.push(opts.minScale);
  if (opts.minDimensions) {
    floors.push(
      Math.max(
        opts.minDimensions.width / canvas.width,
        opts.minDimensions.height / canvas.height
      )
    );
  }
  const minScale = floors.length ? Math.min(1, Math.max(...floors)) : 1;

  const encode: Encoder<CanvasPayload> = async (scale, quality) => {
    const target = scaleCanvas(canvas, scale);
    const blob = await toBlob(target, "image/jpeg", quality);
    return {
      bytes: blob.size,
      payload: { blob, width: target.width, height: target.height },
    };
  };

  // Cap and floor in bytes that satisfy portals counting 1 KB as either 1000
  // or 1024 bytes (see kbCapBytes / kbFloorBytes).
  const capBytes = kbCapBytes(maxKb);
  const res = await searchUnderCap(encode, {
    maxBytes: capBytes,
    minQuality: opts.minQuality,
    lastResortMinQuality: opts.allowLowQualityFallback ? LAST_RESORT_MIN_QUALITY : undefined,
    maxQuality: opts.maxQuality,
    qualitySteps: opts.iterations,
    minScale,
  });

  let blob = res.payload.blob;
  // Declared-DPI metadata first (so padding lands after the APP0 header)…
  if (opts.densityDpi) {
    blob = await setBlobDensityDpi(blob, opts.densityDpi);
  }
  // …then the portal minimum-KB floor: pad up when below the band.
  if (opts.minKb && res.underCap && blob.size < kbFloorBytes(opts.minKb)) {
    blob = await padBlobToMin(blob, kbFloorBytes(opts.minKb));
  }

  return {
    blob,
    quality: res.quality,
    scale: res.scale,
    bytes: blob.size,
    width: res.payload.width,
    height: res.payload.height,
    // Padding can only satisfy a portal band when its floor is not above the
    // selected ceiling. Re-evaluate the final blob instead of reporting the
    // pre-padding encoder verdict.
    underCap: res.underCap && blob.size <= capBytes,
    qualityReduced: res.underCap && res.quality < (opts.minQuality ?? DEFAULT_MIN_QUALITY),
  };
}

/** Plain encode with no size target (print preset). */
export async function encode(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.95
): Promise<Blob> {
  return toBlob(canvas, type, quality);
}
