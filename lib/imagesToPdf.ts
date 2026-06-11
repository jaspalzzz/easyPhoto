/**
 * Combine one or more images into a single PDF (one image per page).
 * --------------------------------------------------------------------
 * Each page is A4, oriented to match the image, with the image aspect-fitted
 * inside a margin. jsPDF is dynamically imported so it only loads on use.
 * Fully client-side — images are read in-memory, nothing is uploaded.
 */

import { loadImageFromFile } from "./pipeline";
import { imageToCanvas } from "./imaging";

const A4 = { w: 210, h: 297 }; // mm
const MARGIN_MM = 10;

/** Render a File to a white-backed JPEG data URL (flattens any transparency). */
async function toJpegDataUrl(
  file: File
): Promise<{ dataUrl: string; w: number; h: number }> {
  const { image, size, url } = await loadImageFromFile(file);
  try {
    const canvas = imageToCanvas(image, size.width, size.height);
    // Flatten transparency onto white so it doesn't render black in the PDF.
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context.");
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    return { dataUrl, w: size.width, h: size.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
  if (files.length === 0) throw new Error("No images to convert.");
  const { jsPDF } = await import("jspdf");

  let doc: import("jspdf").jsPDF | null = null;

  for (const file of files) {
    // Name the failing file: in a batch, "image 3 (scan.png)" beats a generic
    // failure that makes the user re-try the whole set blind.
    let converted: { dataUrl: string; w: number; h: number };
    try {
      converted = await toJpegDataUrl(file);
    } catch {
      throw new Error(
        `Couldn't read "${file.name}" (image ${files.indexOf(file) + 1} of ${files.length}). Remove it or re-export it as JPG/PNG, then try again.`
      );
    }
    const { dataUrl, w, h } = converted;
    const orientation: "p" | "l" = w >= h ? "l" : "p";
    const page = orientation === "l" ? { w: A4.h, h: A4.w } : A4;

    if (!doc) {
      doc = new jsPDF({ unit: "mm", format: "a4", orientation });
    } else {
      doc.addPage("a4", orientation);
    }

    const availW = page.w - 2 * MARGIN_MM;
    const availH = page.h - 2 * MARGIN_MM;
    const imgAspect = w / h;
    const boxAspect = availW / availH;
    let drawW: number;
    let drawH: number;
    if (imgAspect > boxAspect) {
      drawW = availW;
      drawH = availW / imgAspect;
    } else {
      drawH = availH;
      drawW = availH * imgAspect;
    }
    const x = MARGIN_MM + (availW - drawW) / 2;
    const y = MARGIN_MM + (availH - drawH) / 2;
    doc.addImage(dataUrl, "JPEG", x, y, drawW, drawH);
  }

  return doc!.output("blob");
}
