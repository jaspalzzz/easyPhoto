import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
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
