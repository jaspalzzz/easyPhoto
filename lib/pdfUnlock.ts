/**
 * Unlock / remove the password from a PDF — fully client-side.
 * ------------------------------------------------------------
 * The big India use case: the e-Aadhaar PDF is password-protected, and people
 * need an unprotected copy to view, print or upload. pdfjs-dist decrypts a
 * password-protected PDF when given the password, so we render the pages and
 * rebuild an UNPROTECTED PDF with jsPDF. The PDF and its password never leave
 * the device.
 *
 * The rebuilt PDF is image-based (rasterised) — the password/encryption is gone
 * and the document looks identical, but text is no longer selectable. That's the
 * inherent trade-off of a pure-browser, no-dependency decrypt+rebuild.
 */

/** Thrown when the PDF is encrypted: `wrong` distinguishes a bad password from a missing one. */
export class PdfPasswordError extends Error {
  constructor(public readonly wrong: boolean) {
    super(wrong ? "Incorrect password." : "This PDF needs a password.");
    this.name = "PdfPasswordError";
  }
}

export interface UnlockResult {
  blob: Blob;
  pages: number;
}

const RENDER_SCALE = 3; // sharp enough to print; clamped by maxSide below
const MAX_SIDE = 3000;
const MAX_PAGES = 30;

/**
 * Decrypt a (possibly password-protected) PDF and return an unprotected copy.
 * @param password  the open password, if the PDF is protected
 */
export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (page: number, total: number) => void
): Promise<UnlockResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const data = await file.arrayBuffer();
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data, password }).promise;
  } catch (e: unknown) {
    // pdfjs PasswordException: code 1 = needed, 2 = incorrect.
    const err = e as { name?: string; code?: number };
    if (err?.name === "PasswordException") {
      throw new PdfPasswordError(err.code === 2);
    }
    throw e;
  }

  const total = pdf.numPages;
  if (total > MAX_PAGES) {
    await pdf.destroy();
    throw new Error(`This PDF has ${total} pages; this tool unlocks up to ${MAX_PAGES}.`);
  }

  const { jsPDF } = await import("jspdf");
  let doc: import("jspdf").jsPDF | null = null;

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const pts = page.getViewport({ scale: 1 }); // page size in PDF points (1pt = 1/72")
    const clamp = Math.min(RENDER_SCALE, MAX_SIDE / pts.width, MAX_SIDE / pts.height);
    const viewport = page.getViewport({ scale: Math.max(0.5, clamp) });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    page.cleanup();

    // True physical size from the points — keeps A4 as A4 when printed.
    const mmW = (pts.width / 72) * 25.4;
    const mmH = (pts.height / 72) * 25.4;
    const orientation: "p" | "l" = mmW >= mmH ? "l" : "p";
    const url = canvas.toDataURL("image/jpeg", 0.92);
    if (!doc) doc = new jsPDF({ unit: "mm", format: [mmW, mmH], orientation });
    else doc.addPage([mmW, mmH], orientation);
    doc.addImage(url, "JPEG", 0, 0, mmW, mmH);

    onProgress?.(i, total);
  }

  await pdf.destroy();
  if (!doc) throw new Error("Could not read the PDF.");
  return { blob: doc.output("blob"), pages: total };
}
