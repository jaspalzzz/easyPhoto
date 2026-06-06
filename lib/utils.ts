import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}
