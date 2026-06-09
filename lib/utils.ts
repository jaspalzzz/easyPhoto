import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
