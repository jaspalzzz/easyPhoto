/**
 * Render PDF pages to canvases — pdfjs-dist, fully client-side.
 * -----------------------------------------------------------
 * The library + its worker are dynamically imported so the (~1MB) weight only
 * loads when the user actually converts a PDF. The PDF bytes are read in-memory;
 * nothing is uploaded.
 */

export interface PdfRenderOptions {
  /** Render scale — higher = sharper, larger output. */
  scale?: number;
  /** Hard cap on pages rendered, to bound memory on huge/malicious PDFs. */
  maxPages?: number;
  /** Hard cap on a rendered page's longest side (px), clamps the scale down. */
  maxSide?: number;
  /** Progress callback (1-based page index, total). */
  onProgress?: (page: number, total: number) => void;
}

/** Thrown when a PDF exceeds the page cap, so the UI can explain the limit. */
export class PdfTooLargeError extends Error {
  constructor(public readonly totalPages: number, public readonly maxPages: number) {
    super(
      `This PDF has ${totalPages} pages; this tool renders up to ${maxPages} at a time.`
    );
    this.name = "PdfTooLargeError";
  }
}

/** Thrown when a PDF is password-protected and cannot be read without a password. */
export class PdfEncryptedError extends Error {
  constructor() {
    super(
      "This PDF is password-protected. Use the Unlock PDF tool first."
    );
    this.name = "PdfEncryptedError";
  }
}

/**
 * Throw PdfEncryptedError if the PDF needs a password to read. Cheap — it loads
 * the document via pdfjs (no page rendering) and checks for a PasswordException,
 * then disposes. The lossless pdf-lib tools (watermark, page numbers, merge) use
 * this BEFORE pdf-lib's load({ ignoreEncryption: true }), which otherwise accepts
 * a locked PDF it can't decrypt and emits a broken/blank/encrypted file.
 * Owner-only encrypted PDFs (no user password) do NOT throw — pdfjs reads them.
 */
export async function assertPdfDecryptable(file: File): Promise<void> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const data = await file.arrayBuffer();
  let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    pdf = await pdfjs.getDocument({ data }).promise;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "PasswordException") {
      throw new PdfEncryptedError();
    }
    throw err;
  }
  await pdf.destroy();
}

export async function pdfToCanvases(
  file: File,
  opts: PdfRenderOptions = {}
): Promise<HTMLCanvasElement[]> {
  const scale = opts.scale ?? 2;
  const maxPages = opts.maxPages ?? 50;
  const maxSide = opts.maxSide ?? 4000;
  const pdfjs = await import("pdfjs-dist");
  // Bundle the worker via webpack's asset handling (stays client-side/offline).
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const data = await file.arrayBuffer();
  let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    pdf = await pdfjs.getDocument({ data }).promise;
  } catch (err: unknown) {
    // pdfjs throws a PasswordException (name === "PasswordException") for
    // password-protected PDFs. It is not exported from pdfjs-dist's public
    // entry, so we detect it by the error name.
    if (err instanceof Error && err.name === "PasswordException") {
      throw new PdfEncryptedError();
    }
    throw err;
  }

  // Bound work up front so a huge/zip-bomb PDF can't exhaust tab memory.
  if (pdf.numPages > maxPages) {
    await pdf.destroy();
    throw new PdfTooLargeError(pdf.numPages, maxPages);
  }

  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    // Clamp the scale so neither side exceeds maxSide (defends against huge MediaBox).
    const clamp = Math.min(
      scale,
      maxSide / base.width,
      maxSide / base.height
    );
    const viewport = page.getViewport({ scale: Math.max(0.1, clamp) });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    page.cleanup();
    canvases.push(canvas);
    opts.onProgress?.(i, pdf.numPages);
  }

  await pdf.destroy();
  return canvases;
}
