/**
 * Extract embedded text from PDF pages using pdfjs-dist.
 * -------------------------------------------------------
 * Only works on digitally-created PDFs where text is embedded. Scanned PDFs
 * (text saved as images) will return empty strings — use OCR for those.
 * Nothing is uploaded; the file is read in-memory.
 */

export interface PdfTextPage {
  pageNumber: number;
  text: string;
}

export interface PdfTextResult {
  pages: PdfTextPage[];
  /** Concatenated text of all pages, separated by page markers. */
  fullText: string;
  totalPages: number;
}

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  return pdfjs;
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<PdfTextResult> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();

  let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    pdf = await pdfjs.getDocument({ data }).promise;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "PasswordException") {
      throw new Error("This PDF is password-protected. Use the Unlock PDF tool first.");
    }
    throw err;
  }

  const totalPages = pdf.numPages;
  const pages: PdfTextPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.(i, totalPages);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/ {2,}/g, " ")
      .trim();
    pages.push({ pageNumber: i, text });
    page.cleanup();
  }

  await pdf.destroy();

  const fullText = pages
    .map((p) => (totalPages > 1 ? `--- Page ${p.pageNumber} ---\n${p.text}` : p.text))
    .join("\n\n");

  return { pages, fullText, totalPages };
}
