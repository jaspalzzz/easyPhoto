/**
 * HEIC/HEIF support.
 * -----------------
 * iPhones shoot HEIC by default, but only Safari can decode it via the native
 * image pipeline — Chrome/Firefox/Edge can't. So we detect HEIC and convert it
 * to JPEG client-side (heic2any / libheif wasm, lazy-loaded) before the rest of
 * the pipeline touches it. Still 100% in-browser; nothing is uploaded.
 */

function isHeic(file: File): boolean {
  return (
    /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
  );
}

/** Hard ceiling — a 100MB+ "image" will OOM mobile browsers long before decode. */
const MAX_FILE_BYTES = 80 * 1024 * 1024;

/**
 * Cheap validity gate for any user-supplied image file. Runs before decode so
 * an empty or absurd file fails fast with a clear message instead of hanging
 * the pipeline. Throws a user-facing Error; returns nothing on success.
 */
export function assertValidImageFile(file: File): void {
  if (file.size === 0) {
    throw new Error(
      "That file is empty (0 KB). It may not have finished downloading or copying — try the original file again."
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      "That file is over 80 MB — more than a browser can safely process. Export a smaller version and try again."
    );
  }
}

/**
 * Return a browser-decodable image File: HEIC/HEIF → JPEG, everything else
 * passed through untouched. Validates first (empty/oversized files fail fast
 * with a friendly message). Throws a friendly error if conversion fails.
 */
export async function ensureDecodable(file: File): Promise<File> {
  assertValidImageFile(file);
  if (!isHeic(file)) return file;

  // Load the converter first: an import failure is a NETWORK problem (offline,
  // blocked CDN), not a broken photo — tell the user the right thing to fix.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let heic2any: any;
  try {
    heic2any = (await import("heic2any")).default;
  } catch {
    throw new Error(
      "Couldn't load the HEIC converter — your connection may be offline or blocked. Check your internet and try again, or export the photo as JPG first."
    );
  }

  try {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });
    const blob: Blob = Array.isArray(result) ? result[0] : result;
    const name = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], name || "photo.jpg", { type: "image/jpeg" });
  } catch {
    throw new Error(
      "Couldn't read that HEIC photo — the file may be damaged. Try exporting it as JPG (on iPhone: Settings → Camera → Formats → Most Compatible), then upload again."
    );
  }
}
