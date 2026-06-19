/**
 * JFIF density (DPI) metadata.
 * ----------------------------
 * canvas.toBlob() writes JPEGs with a default/absent pixel density, but some
 * portals mandate a scan DPI (e.g. PAN: 200 DPI). The pixels are what actually
 * matter, yet a portal that *reads* the JFIF header would see the wrong value —
 * so we patch the APP0 JFIF segment's units/density fields (or insert the
 * segment) post-encode. Pure bytes-in/bytes-out; pixels untouched.
 */

/** True if the buffer starts with the JPEG SOI marker. */
function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

/** Is there a JFIF APP0 segment immediately after SOI? */
function hasJfifApp0(b: Uint8Array): boolean {
  return (
    b.length >= 11 &&
    b[2] === 0xff &&
    b[3] === 0xe0 &&
    // "JFIF\0"
    b[6] === 0x4a &&
    b[7] === 0x46 &&
    b[8] === 0x49 &&
    b[9] === 0x46 &&
    b[10] === 0x00
  );
}

/**
 * Return a copy of `src` whose JFIF header declares `dpi` dots-per-inch
 * (both axes). Patches the existing APP0 in place when present; otherwise
 * inserts a standard 18-byte JFIF APP0 right after SOI (where the JFIF spec
 * requires it). Non-JPEG input is returned unchanged.
 */
export function setJpegDensityDpi(src: Uint8Array, dpi: number): Uint8Array {
  if (!isJpeg(src) || dpi <= 0 || dpi > 0xffff) return src;

  if (hasJfifApp0(src)) {
    // APP0 layout: FF E0 len(2) "JFIF\0" ver(2) units(1) Xden(2) Yden(2) ...
    const out = src.slice();
    out[13] = 1; // units: dots per inch
    out[14] = (dpi >> 8) & 0xff;
    out[15] = dpi & 0xff;
    out[16] = (dpi >> 8) & 0xff;
    out[17] = dpi & 0xff;
    return out;
  }

  // Insert a minimal JFIF APP0 (v1.02, no thumbnail) immediately after SOI.
  const seg = new Uint8Array([
    0xff, 0xe0, // APP0
    0x00, 0x10, // length 16 (includes these two bytes)
    0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x02, // version 1.02
    0x01, // units: dpi
    (dpi >> 8) & 0xff, dpi & 0xff, // X density
    (dpi >> 8) & 0xff, dpi & 0xff, // Y density
    0x00, 0x00, // no thumbnail
  ]);
  const out = new Uint8Array(src.length + seg.length);
  out.set(src.subarray(0, 2), 0);
  out.set(seg, 2);
  out.set(src.subarray(2), 2 + seg.length);
  return out;
}

/** Blob convenience wrapper for JPEG blobs; no-op for other types. */
export async function setBlobDensityDpi(blob: Blob, dpi: number): Promise<Blob> {
  const src: Uint8Array = new Uint8Array(await blob.arrayBuffer());
  const out = setJpegDensityDpi(src, dpi);
  if (out === src) return blob;
  return new Blob([out as BlobPart], { type: blob.type });
}

/** The declared DPI of a JPEG's JFIF header. */
export interface JpegDensity {
  /** X density (dots per `unit`). */
  x: number;
  /** Y density (dots per `unit`). */
  y: number;
  /** JFIF units: 0 = aspect-ratio only (no real DPI), 1 = dpi, 2 = dots/cm. */
  units: number;
}

/**
 * Read the JFIF density a JPEG declares, normalised to dots-per-inch.
 * Returns null for non-JPEG input or a JPEG with no JFIF APP0 segment.
 * When units = 2 (dots/cm) the value is converted to DPI (× 2.54);
 * when units = 0 the density fields are an aspect ratio, not a real DPI,
 * so `units` is surfaced for the caller to label it "not specified".
 */
export function readJpegDensityDpi(src: Uint8Array): JpegDensity | null {
  if (!isJpeg(src) || !hasJfifApp0(src) || src.length < 18) return null;
  const units = src[13];
  const xRaw = (src[14] << 8) | src[15];
  const yRaw = (src[16] << 8) | src[17];
  // Normalise dots/cm → dots/inch so callers always reason in DPI.
  const toDpi = (v: number) => (units === 2 ? Math.round(v * 2.54) : v);
  return { x: toDpi(xRaw), y: toDpi(yRaw), units };
}

/** Blob convenience wrapper for reading JPEG density; null for other types. */
export async function readBlobDensityDpi(blob: Blob): Promise<JpegDensity | null> {
  const src = new Uint8Array(await blob.arrayBuffer());
  return readJpegDensityDpi(src);
}
