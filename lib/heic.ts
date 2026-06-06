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

/**
 * Return a browser-decodable image File: HEIC/HEIF → JPEG, everything else
 * passed through untouched. Throws a friendly error if conversion fails.
 */
export async function ensureDecodable(file: File): Promise<File> {
  if (!isHeic(file)) return file;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heic2any = (await import("heic2any")).default as any;
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
      "Couldn't read that HEIC photo. Try exporting it as JPG (on iPhone: Settings → Camera → Formats → Most Compatible), then upload again."
    );
  }
}
