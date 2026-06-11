/**
 * Minimum-file-size padding.
 * --------------------------
 * Exam/government portals commonly specify a KB *band* (e.g. SSC photo
 * 20–50 KB) and reject uploads BELOW the minimum just as they reject ones
 * above the cap. When a clean source compresses to under the minimum, the only
 * way to raise the byte size without touching pixels or quality is to embed
 * inert metadata the decoders skip:
 *
 *  - JPEG: COM (comment) segments after the SOI marker. Every JPEG reader
 *    skips them; payload ≤ 65533 bytes each, 4 bytes overhead.
 *  - PNG:  a private ancillary chunk ("eXIf"-style lowercase first letter =
 *    non-critical) before IEND. We use "prVt" with a zero payload + CRC.
 *
 * Both functions are pure over bytes (unit-testable, no canvas).
 */

/** True if the buffer starts with the JPEG SOI marker. */
function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 && PNG_SIG.every((b, i) => bytes[i] === b)
  );
}

/**
 * Pad a JPEG to at least `minBytes` by inserting COM segments after SOI.
 * Returns the original bytes unchanged when already ≥ minBytes or not a JPEG.
 */
export function padJpegBytesToMin(
  src: Uint8Array,
  minBytes: number
): Uint8Array {
  if (src.length >= minBytes || !isJpeg(src)) return src;

  // JFIF requires APP0 (and EXIF its APP1) immediately after SOI — so insert
  // our padding AFTER any leading APPn segments, not between SOI and them.
  let insertAt = 2;
  while (
    insertAt + 4 <= src.length &&
    src[insertAt] === 0xff &&
    src[insertAt + 1] >= 0xe0 &&
    src[insertAt + 1] <= 0xef
  ) {
    const segLen = (src[insertAt + 2] << 8) | src[insertAt + 3];
    if (segLen < 2) break; // corrupt length; stop scanning
    insertAt += 2 + segLen;
  }

  const segments: Uint8Array[] = [];
  let deficit = minBytes - src.length;
  while (deficit > 0) {
    // Segment on-disk size = 2 (FF FE) + 2 (length) + payload.
    // The length field counts itself + payload, so payload ≤ 65533.
    const payload = Math.min(65533, Math.max(0, deficit - 4));
    const seg = new Uint8Array(4 + payload);
    seg[0] = 0xff;
    seg[1] = 0xfe; // COM
    const lenField = payload + 2;
    seg[2] = (lenField >> 8) & 0xff;
    seg[3] = lenField & 0xff;
    // payload stays zero-filled
    segments.push(seg);
    deficit -= seg.length;
  }

  const total =
    src.length + segments.reduce((n, s) => n + s.length, 0);
  const out = new Uint8Array(total);
  // Original head (SOI + any APPn), padding segments, then the remainder.
  out.set(src.subarray(0, insertAt), 0);
  let offset = insertAt;
  for (const seg of segments) {
    out.set(seg, offset);
    offset += seg.length;
  }
  out.set(src.subarray(insertAt), offset);
  return out;
}

/** CRC-32 (PNG variant) over a byte slice. */
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Pad a PNG to at least `minBytes` by inserting ancillary "prVt" chunks before
 * IEND. Ancillary (lowercase first letter) chunks are skipped by all decoders.
 * Returns the original bytes unchanged when already ≥ minBytes or not a PNG.
 */
export function padPngBytesToMin(
  src: Uint8Array,
  minBytes: number
): Uint8Array {
  if (src.length >= minBytes || !isPng(src)) return src;

  // IEND chunk = length(4) + "IEND"(4) + CRC(4) = last 12 bytes of a valid PNG.
  const iendOffset = src.length - 12;
  if (
    iendOffset < 8 ||
    src[iendOffset + 4] !== 0x49 || // I
    src[iendOffset + 5] !== 0x45 || // E
    src[iendOffset + 6] !== 0x4e || // N
    src[iendOffset + 7] !== 0x44 //   D
  ) {
    return src; // Unexpected layout — don't touch it.
  }

  const TYPE = [0x70, 0x72, 0x56, 0x74]; // "prVt" — private ancillary
  const chunks: Uint8Array[] = [];
  let deficit = minBytes - src.length;
  while (deficit > 0) {
    // Chunk on-disk size = 4 (len) + 4 (type) + payload + 4 (CRC).
    const payload = Math.min(0x7fffffff, Math.max(0, deficit - 12));
    const chunk = new Uint8Array(12 + payload);
    const dv = new DataView(chunk.buffer);
    dv.setUint32(0, payload);
    chunk.set(TYPE, 4);
    // payload stays zero-filled
    const crc = crc32(chunk.subarray(4, 8 + payload));
    dv.setUint32(8 + payload, crc);
    chunks.push(chunk);
    deficit -= chunk.length;
  }

  const total =
    src.length + chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  out.set(src.subarray(0, iendOffset), 0);
  let offset = iendOffset;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  out.set(src.subarray(iendOffset), offset);
  return out;
}

/**
 * Blob convenience wrapper: raise `blob` to at least `minBytes` (JPEG or PNG).
 * No-op for other types or when already large enough.
 */
export async function padBlobToMin(blob: Blob, minBytes: number): Promise<Blob> {
  if (blob.size >= minBytes) return blob;
  const src: Uint8Array = new Uint8Array(await blob.arrayBuffer());
  let out: Uint8Array = src;
  if (isJpeg(src)) out = padJpegBytesToMin(src, minBytes);
  else if (isPng(src)) out = padPngBytesToMin(src, minBytes);
  if (out === src) return blob;
  return new Blob([out as BlobPart], { type: blob.type });
}
