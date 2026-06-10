/**
 * Lossless PDF annotation — watermark text and page numbers — client-side via
 * pdf-lib. Original page content (text, vectors, fonts) is preserved; nothing
 * is rasterized and nothing is uploaded.
 */

export interface WatermarkOptions {
  text: string;
  /** 0..1. Default 0.22. */
  opacity?: number;
  /** Rotation in degrees. Default 45 (diagonal). */
  rotate?: number;
}

/** Stamp a diagonal, semi-transparent text watermark across every page. */
export async function watermarkPdf(
  file: File,
  opts: WatermarkOptions
): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");
  const doc = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const text = (opts.text || "").trim() || "CONFIDENTIAL";
  const opacity = Math.min(1, Math.max(0.04, opts.opacity ?? 0.22));
  const angle = opts.rotate ?? 45;
  const rad = (angle * Math.PI) / 180;

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    // Scale the watermark to roughly span the page diagonally.
    let size = Math.max(24, Math.min(width, height) * 0.13);
    let tw = font.widthOfTextAtSize(text, size);
    const maxSpan = Math.min(width, height) * 1.1;
    if (tw > maxSpan) {
      size *= maxSpan / tw;
      tw = font.widthOfTextAtSize(text, size);
    }
    // Centre the rotated baseline midpoint on the page centre.
    const x = width / 2 - (tw / 2) * Math.cos(rad);
    const y = height / 2 - (tw / 2) * Math.sin(rad);
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0.45, 0.45, 0.45),
      opacity,
      rotate: degrees(angle),
    });
  }

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left";

export type PageNumberFormat = "n" | "n-of-total" | "page-n";

export interface PageNumberOptions {
  position?: PageNumberPosition;
  /** Number to print on the first page. Default 1. */
  startAt?: number;
  format?: PageNumberFormat;
  fontSize?: number;
  /** Edge margin in points. Default 28. */
  margin?: number;
}

/** Draw page numbers on every page at the chosen corner/edge. */
export async function addPageNumbers(
  file: File,
  opts: PageNumberOptions = {}
): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const start = opts.startAt ?? 1;
  const size = opts.fontSize ?? 11;
  const margin = opts.margin ?? 28;
  const position = opts.position ?? "bottom-center";
  const format = opts.format ?? "n";
  const lastLabelNumber = start + total - 1;

  pages.forEach((page, i) => {
    const n = start + i;
    const label =
      format === "n-of-total"
        ? `${n} of ${lastLabelNumber}`
        : format === "page-n"
          ? `Page ${n}`
          : `${n}`;
    const { width, height } = page.getSize();
    const tw = font.widthOfTextAtSize(label, size);

    let x: number;
    if (position.endsWith("center")) x = width / 2 - tw / 2;
    else if (position.endsWith("right")) x = width - margin - tw;
    else x = margin;

    const y = position.startsWith("top") ? height - margin : margin;

    page.drawText(label, {
      x,
      y,
      size,
      font,
      color: rgb(0.25, 0.22, 0.2),
    });
  });

  const bytes = await doc.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
