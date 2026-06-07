/**
 * Core PDF merging and splitting utilities — client-side using pdfjs-dist and jsPDF.
 */

import { pdfToCanvases } from "./pdfToImages";

/**
 * Merge multiple PDF files into a single PDF blob, maintaining page orientations.
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (msg: string) => void
): Promise<Blob> {
  if (files.length === 0) throw new Error("No PDF files selected.");
  const { jsPDF } = await import("jspdf");

  let doc: import("jspdf").jsPDF | null = null;
  let fileIndex = 1;

  for (const file of files) {
    onProgress?.(`Reading PDF ${fileIndex} of ${files.length}: ${file.name}…`);
    const canvases = await pdfToCanvases(file, {
      scale: 1.5, // 150 DPI is a good balance between speed, file size, and legibility
    });

    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const w = canvas.width;
      const h = canvas.height;
      const orientation: "p" | "l" = w >= h ? "l" : "p";

      // Convert pixels (at 150 DPI scale) to millimetres: mm = (px / 150) * 25.4
      const mmW = (w / 150) * 25.4;
      const mmH = (h / 150) * 25.4;

      if (!doc) {
        doc = new jsPDF({
          unit: "mm",
          format: [mmW, mmH],
          orientation,
        });
      } else {
        doc.addPage([mmW, mmH], orientation);
      }

      // Flatten background to white and draw
      const dataUrl = canvas.toDataURL("image/jpeg", 0.90);
      doc.addImage(dataUrl, "JPEG", 0, 0, mmW, mmH);
    }
    fileIndex++;
  }

  if (!doc) throw new Error("Could not construct PDF document.");
  return doc.output("blob");
}

/**
 * Split a single PDF file by extracting specific pages, returning a single PDF blob of those pages.
 */
export async function splitPdf(
  file: File,
  selectedPages: number[], // 0-indexed page indices
  onProgress?: (msg: string) => void
): Promise<Blob> {
  if (selectedPages.length === 0) throw new Error("No pages selected to extract.");
  const { jsPDF } = await import("jspdf");

  onProgress?.("Loading and rendering PDF pages…");
  const canvases = await pdfToCanvases(file, { scale: 1.5 });

  let doc: import("jspdf").jsPDF | null = null;

  for (const pageIdx of selectedPages) {
    const canvas = canvases[pageIdx];
    if (!canvas) continue;

    const w = canvas.width;
    const h = canvas.height;
    const orientation: "p" | "l" = w >= h ? "l" : "p";
    const mmW = (w / 150) * 25.4;
    const mmH = (h / 150) * 25.4;

    if (!doc) {
      doc = new jsPDF({
        unit: "mm",
        format: [mmW, mmH],
        orientation,
      });
    } else {
      doc.addPage([mmW, mmH], orientation);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.90);
    doc.addImage(dataUrl, "JPEG", 0, 0, mmW, mmH);
  }

  if (!doc) throw new Error("Could not extract selected pages.");
  return doc.output("blob");
}
