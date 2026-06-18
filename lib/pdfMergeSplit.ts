/**
 * Core PDF merging and splitting — client-side, LOSSLESS via pdf-lib.
 *
 * We copy the original pages (text, vectors, fonts preserved) into a new
 * document — never rasterize. Output stays small and selectable. Nothing is
 * uploaded; everything runs in the browser.
 */
import { assertPdfDecryptable } from "./pdfToImages";

/** Merge multiple PDFs into one, preserving every page's content and order. */
export async function mergePdfs(
  files: File[],
  onProgress?: (msg: string) => void
): Promise<Blob> {
  if (files.length === 0) throw new Error("No PDF files selected.");
  const { PDFDocument } = await import("pdf-lib");

  const out = await PDFDocument.create();
  let i = 1;
  for (const file of files) {
    onProgress?.(`Merging PDF ${i} of ${files.length}: ${file.name}…`);
    // Reject any password-protected input — pdf-lib's ignoreEncryption would
    // copy undecryptable pages and produce a broken merged file.
    await assertPdfDecryptable(file);
    const src = await PDFDocument.load(await file.arrayBuffer(), {
      ignoreEncryption: true,
    });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    i++;
  }

  const bytes = await out.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/** Extract specific pages (0-indexed) into a new PDF, losslessly. */
export async function splitPdf(
  file: File,
  selectedPages: number[],
  onProgress?: (msg: string) => void
): Promise<Blob> {
  if (selectedPages.length === 0)
    throw new Error("No pages selected to extract.");
  const { PDFDocument } = await import("pdf-lib");

  onProgress?.("Extracting selected pages…");
  const src = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const total = src.getPageCount();
  const valid = selectedPages.filter((i) => i >= 0 && i < total);
  if (valid.length === 0) throw new Error("Selected pages are out of range.");

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, valid);
  copied.forEach((p, idx) => {
    onProgress?.(`Extracting page ${idx + 1} of ${valid.length}…`);
    out.addPage(p);
  });

  const bytes = await out.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
