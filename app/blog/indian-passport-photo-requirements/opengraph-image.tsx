import { ogImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Indian Passport Photo Requirements 2026: Full Compliance Checklist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: "Indian Passport Photo Requirements 2026",
    subtitle: "Full Compliance Checklist — size, background, expression, print quality",
  });
}
