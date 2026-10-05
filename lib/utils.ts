import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * KB limits → bytes, for every file-size band a tool enforces.
 *
 * Upload portals disagree on what "1 KB" means: some count 1024 bytes, others
 * 1000. Enforcing a 50 KB cap as 50 × 1024 = 51,200 B shipped 50,928 B files,
 * which a 1000-byte portal rejects as over 50 KB. To pass BOTH conventions, a
 * cap is enforced in the smaller unit and a floor in the larger one:
 *   bytes ≤ maxKb × 1000  (so also ≤ maxKb × 1024)
 *   bytes ≥ minKb × 1024  (so also ≥ minKb × 1000)
 * Display (formatKb) stays 1024-based: a file inside this band reads as inside
 * it in either unit, so no shown size contradicts the stated band.
 */

/** Largest byte size that is within `maxKb` whether 1 KB = 1000 or 1024 B. */
export function kbCapBytes(maxKb: number): number {
  return maxKb * 1000;
}

/** Smallest byte size that reaches `minKb` whether 1 KB = 1000 or 1024 B. */
export function kbFloorBytes(minKb: number): number {
  return minKb * 1024;
}

/**
 * Smallest whole-KB cap that can still hold a file reaching `minKb` under both
 * conventions (20 → 21: a 20–20 KB band would need ≥ 20,480 B and ≤ 20,000 B).
 * Use it as the lowest target a user can pick when a portal band has a floor.
 */
export function minCapKbForFloor(minKb: number): number {
  return Math.ceil(kbFloorBytes(minKb) / 1000);
}

export function formatKb(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function generateBatchFilename(template: string, index: number, ext: string): string {
  const num = index + 1;
  const match = template.match(/#+/);
  if (match) {
    const hashes = match[0];
    const paddedNum = String(num).padStart(hashes.length, "0");
    return template.replace(hashes, paddedNum) + "." + ext;
  }
  return `${template}_${num}.${ext}`;
}
