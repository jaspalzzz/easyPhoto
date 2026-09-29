/**
 * Lossless PDF editing — reorder/rotate/delete pages and overlay signatures —
 * client-side via pdf-lib. Original page content (text, vectors, fonts) is
 * preserved; we never rasterize. Nothing is uploaded.
 */
import { assertPdfDecryptable, loadPdfForEditing } from "./pdfToImages";

/** One output page: which original page it is, and any user rotation to apply. */
export interface ReorderItem {
  originalIndex: number; // 0-based index in the source PDF
  rotation?: number; // additional clockwise rotation in degrees (0/90/180/270)
}

/**
 * Rebuild a PDF from `items` (new order), applying each item's rotation on top
 * of the page's existing rotation. Deleted pages are simply omitted from items.
 */
export async function reorderPdf(
  file: File,
  items: ReorderItem[]
): Promise<Blob> {
  if (items.length === 0) throw new Error("No pages to export.");
  await assertPdfDecryptable(file);
  const { PDFDocument, degrees } = await import("pdf-lib");

  const src = await loadPdfForEditing(file);
  const total = src.getPageCount();
  const order = items.filter((it) => it.originalIndex >= 0 && it.originalIndex < total);
  if (order.length === 0) throw new Error("Selected pages are out of range.");

  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    src,
    order.map((it) => it.originalIndex)
  );
  copied.forEach((page, i) => {
    const extra = ((order[i].rotation ?? 0) % 360 + 360) % 360;
    if (extra !== 0) {
      const existing = page.getRotation().angle || 0;
      page.setRotation(degrees((existing + extra) % 360));
    }
    out.addPage(page);
  });

  const bytes = await out.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/** A signature placed on a page, in PERCENT of the displayed page box. */
export interface SignaturePlacement {
  /** PNG data URL of the (transparent) signature. */
  signatureUrl: string;
  /** Left/top as % of page width/height; width/height as % of page w/h. */
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Map a placement given in percent of the page AS DISPLAYED (top-left origin,
 * after the page's /Rotate is applied — what the preview shows) to pdf-lib's
 * unrotated user space (bottom-left origin). Returns the drawImage anchor plus
 * the counter-clockwise rotation that keeps the image upright once the viewer
 * rotates the page. Ignoring /Rotate put signatures sideways and in the wrong
 * place on rotated pages (e.g. ones turned with the Reorder tool).
 *
 * `pageW`/`pageH` are the UNROTATED page size; `rotation` is 0/90/180/270.
 */
export function placementToPdfRect(
  p: Pick<SignaturePlacement, "x" | "y" | "width" | "height">,
  pageW: number,
  pageH: number,
  rotation: number
): { x: number; y: number; width: number; height: number; rotate: number } {
  const r = (((Math.round(rotation / 90) * 90) % 360) + 360) % 360;
  const quarter = r === 90 || r === 270;
  // Displayed page size, then the placement in displayed points.
  const dispW = quarter ? pageH : pageW;
  const dispH = quarter ? pageW : pageH;
  const dx = (p.x / 100) * dispW;
  const dy = (p.y / 100) * dispH;
  const dw = (p.width / 100) * dispW;
  const dh = (p.height / 100) * dispH;
  // width/height are the image's own (upright) size; the anchor is its
  // bottom-left corner before pdf-lib applies the ccw rotation.
  switch (r) {
    case 90:
      return { x: dy + dh, y: dx, width: dw, height: dh, rotate: 90 };
    case 180:
      return { x: pageW - dx, y: dy + dh, width: dw, height: dh, rotate: 180 };
    case 270:
      return { x: pageW - dy - dh, y: pageH - dx, width: dw, height: dh, rotate: 270 };
    default:
      return { x: dx, y: pageH - dy - dh, width: dw, height: dh, rotate: 0 };
  }
}

/**
 * Overlay signatures onto the ORIGINAL PDF pages (text preserved). Placements
 * are keyed by 0-based page index. Coordinates are percentages of the page box,
 * matching the on-screen overlay (top-left origin); we convert to pdf-lib's
 * bottom-left origin per page.
 */
export async function signPdf(
  file: File,
  signaturesPerPage: Record<number, SignaturePlacement[]>
): Promise<Blob> {
  await assertPdfDecryptable(file);
  const { degrees } = await import("pdf-lib");
  const src = await loadPdfForEditing(file);
  const pages = src.getPages();

  // Embed each distinct signature image once. Decode the data: URL directly
  // (atob) rather than fetch() — our CSP connect-src has no `data:`, so a
  // fetch(dataUrl) would be blocked in production.
  const cache = new Map<string, Awaited<ReturnType<typeof src.embedPng>>>();
  const embed = async (dataUrl: string) => {
    const cached = cache.get(dataUrl);
    if (cached) return cached;
    const base64 = dataUrl.split(",")[1] ?? "";
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const img = await src.embedPng(bytes);
    cache.set(dataUrl, img);
    return img;
  };

  for (const [idxStr, placements] of Object.entries(signaturesPerPage)) {
    const page = pages[Number(idxStr)];
    if (!page || !placements?.length) continue;
    const { width: pw, height: ph } = page.getSize();
    const rotation = page.getRotation().angle;
    for (const p of placements) {
      const img = await embed(p.signatureUrl);
      const rect = placementToPdfRect(p, pw, ph, rotation);
      page.drawImage(img, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        rotate: degrees(rect.rotate),
      });
    }
  }

  const bytes = await src.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
