/**
 * PDF size compressor — client-side, to hit an upload KB limit (marksheets,
 * certificates, income proofs for forms).
 *
 * UNLIKE merge/split/reorder/sign (which are LOSSLESS via pdf-lib), a size
 * compressor MUST resample: a scanned PDF can't be shrunk losslessly. We render
 * each page (pdfjs) and re-encode to JPEG at an adaptive scale × quality until
 * the total fits the target, then rebuild with jsPDF. Output becomes image-based
 * (text no longer selectable) — that's the inherent trade-off of compression and
 * should be stated in the UI. Nothing is uploaded; all in-browser.
 */
import { pdfToCanvases } from "./pdfToImages";

export interface PdfCompressResult {
  blob: Blob;
  bytes: number;
  /** True if we got at or under the requested target. */
  underTarget: boolean;
  pages: number;
}

/**
 * pdfjs renders at scale 1 = 72 DPI (1 CSS px per PDF point). We render the base
 * at RENDER_SCALE, so the effective DPI of the base canvas is 72 × RENDER_SCALE.
 * Physical page size (mm) must be derived from THIS, not a hardcoded guess, or
 * the rebuilt PDF comes out the wrong physical size (e.g. A4 → ~151mm wide).
 */
const RENDER_SCALE = 1.5;
const BASE_DPI = 72 * RENDER_SCALE; // = 108

/** Quality ladder from best → smallest. First level under target wins. */
const LEVELS: Array<{ scale: number; quality: number }> = [
  { scale: 1.0, quality: 0.82 },
  { scale: 1.0, quality: 0.62 },
  { scale: 0.85, quality: 0.6 },
  { scale: 0.7, quality: 0.55 },
  { scale: 0.7, quality: 0.42 },
  { scale: 0.55, quality: 0.45 },
  { scale: 0.45, quality: 0.4 },
  { scale: 0.36, quality: 0.34 },
  { scale: 0.3, quality: 0.28 },
];

/** Binary byte size of a base64 data URL (no re-encode needed). */
function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(",");
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  // 4 base64 chars → 3 bytes; subtract padding.
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

interface EncodedPage {
  dataUrl: string;
  mmW: number;
  mmH: number;
}

/** Yield to the event loop so the spinner animates during heavy encoding. */
const yieldToUi = () => new Promise<void>((r) => setTimeout(r, 0));

/** Encode every page at one level; returns the pages + total estimated bytes. */
async function encodeLevel(
  base: HTMLCanvasElement[],
  scale: number,
  quality: number
): Promise<{ pages: EncodedPage[]; total: number }> {
  const pages: EncodedPage[] = [];
  let total = 0;
  for (const b of base) {
    await yieldToUi(); // keep the UI responsive across many pages × levels
    // Physical size from the base render DPI (constant across levels).
    const mmW = (b.width / BASE_DPI) * 25.4;
    const mmH = (b.height / BASE_DPI) * 25.4;
    const w = Math.max(1, Math.round(b.width * scale));
    const h = Math.max(1, Math.round(b.height * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("Could not acquire 2D canvas context.");
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff"; // flatten transparency for JPEG
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(b, 0, 0, w, h);
    const dataUrl = c.toDataURL("image/jpeg", quality);
    total += dataUrlBytes(dataUrl);
    pages.push({ dataUrl, mmW, mmH });
  }
  return { pages, total };
}

/** Build a JPEG-per-page PDF blob from encoded pages. */
async function buildPdf(pages: EncodedPage[]): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  let doc: import("jspdf").jsPDF | null = null;
  for (const p of pages) {
    const orientation: "p" | "l" = p.mmW >= p.mmH ? "l" : "p";
    if (!doc) doc = new jsPDF({ unit: "mm", format: [p.mmW, p.mmH], orientation });
    else doc.addPage([p.mmW, p.mmH], orientation);
    doc.addImage(p.dataUrl, "JPEG", 0, 0, p.mmW, p.mmH);
  }
  if (!doc) throw new Error("Could not build the PDF.");
  return doc.output("blob");
}

/**
 * Compress `file` to at most `targetKb`. Walks the quality ladder and stops at
 * the first level that fits (best quality under the cap); if none fit, returns
 * the smallest achievable with underTarget=false.
 */
export async function compressPdfToTarget(
  file: File,
  targetKb: number,
  onProgress?: (msg: string) => void
): Promise<PdfCompressResult> {
  const targetBytes = targetKb * 1024;
  // ~8% headroom for the PDF container/overhead so we land safely under the cap.
  const budget = targetBytes * 0.92;

  onProgress?.("Rendering PDF pages…");
  const base = await pdfToCanvases(file, { scale: RENDER_SCALE, maxPages: 30 });
  if (base.length === 0) throw new Error("Could not read the PDF.");

  let best: { pages: EncodedPage[]; total: number } | null = null;
  for (let i = 0; i < LEVELS.length; i++) {
    onProgress?.(`Optimising… (pass ${i + 1})`);
    const { scale, quality } = LEVELS[i];
    const enc = await encodeLevel(base, scale, quality);
    if (!best || enc.total < best.total) best = enc;
    if (enc.total <= budget) {
      const blob = await buildPdf(enc.pages);
      return { blob, bytes: blob.size, underTarget: blob.size <= targetBytes, pages: base.length };
    }
  }
  // Nothing fit — return the smallest we managed.
  const blob = await buildPdf(best!.pages);
  return { blob, bytes: blob.size, underTarget: blob.size <= targetBytes, pages: base.length };
}
