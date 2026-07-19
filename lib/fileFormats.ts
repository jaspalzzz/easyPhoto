export function displayFileFormat(format: string): string {
  const normalised = format.trim().toLowerCase();
  if (normalised === "jpg" || normalised === "jpeg") return "JPG";
  return normalised.toUpperCase();
}

/** Display equivalent encodings once (for example, JPG + JPEG becomes JPG). */
export function displayFileFormatBundle(formats: readonly string[]): string {
  return [...new Set(formats.map(displayFileFormat))].join(" + ");
}
